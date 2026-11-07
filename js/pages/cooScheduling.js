import { getData, commit, findTeam } from '../store.js';
import { uid, escapeHtml, todayISO, fmtDate, dayLabel, initials, milestoneDate } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';
import { isReadOnly } from '../readOnly.js';
import { COO_INBOX, COO_STAGES, seedCoo } from '../seed.js';

export const COO_TITLE = 'Office of COO';

const PARTS = [
  { id: 'coo-calendar', label: 'Calendar' },
  { id: 'coo-inbox', label: 'Inbox' },
  { id: 'coo-inquiries', label: 'Inquiries' },
  { id: 'coo-sprint', label: 'Current Sprint' },
  { id: 'coo-past', label: 'Past Sprints' },
  { id: 'coo-sprint-calendar', label: 'Sprint Calendar' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Not saved: calendar month, open inbox folder and email, and the last sync time.
const view = { month: todayISO().slice(0, 7), calMode: 'month', calSource: 'coo', hiddenSources: new Set(), focus: todayISO(), folder: 'investors', openMail: null, syncedAt: Date.now() - 2 * 60000, syncing: false };

function coo() {
  const data = getData();
  if (!data.coo) { data.coo = seedCoo(); commit(); }
  return data.coo;
}

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function shiftMonth(month, n) {
  const [y, m] = month.split('-').map(Number);
  return iso(new Date(y, m - 1 + n, 1)).slice(0, 7);
}
function monthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
function gridDays(month) {
  const [y, m] = month.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const start = new Date(y, m - 1, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => iso(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)));
}
function fmtTime(t) {
  if (!t) return '';
  const [h, min] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}${min ? ':' + String(min).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`;
}
const dateText = (d) => (d ? fmtDate(d) : '');
const range = (s) => [s.start, s.end].filter(Boolean).map(fmtDate).join(' to ');

export function renderCooScheduling(container) {
  const c = coo();
  container.innerHTML = `
    ${notesBoxHtml('coo')}
    <div class="page-title" style="margin-bottom:12px;">${COO_TITLE}</div>
    <div class="schedule-jump">
      ${PARTS.map((p) => `<a class="btn" href="#/coo?anchor=${p.id}" data-jump="${p.id}">${p.label}</a>`).join('')}
    </div>
    <datalist id="coo-people">${(getData().scheduleLeaders || []).map((n) => `<option value="${escapeHtml(n)}"></option>`).join('')}</datalist>
    <section class="schedule-part" id="coo-calendar">${renderCalendar(c)}</section>
    <section class="schedule-part" id="coo-inbox">${renderInbox(c)}</section>
    <section class="schedule-part" id="coo-inquiries">${renderInquiries(c)}</section>
    <section class="schedule-part" id="coo-sprint">${renderSprint(c.currentSprint)}</section>
    <section class="schedule-part" id="coo-past">${renderPast(c)}</section>
    <section class="schedule-part" id="coo-sprint-calendar">${renderSprintCalendar(c)}</section>
  `;
  wire(container, c);
}

/* ---------- Calendar: month, week and day views ---------- */
const CAL_MODES = [{ key: 'month', label: 'Month' }, { key: 'week', label: 'Week' }, { key: 'day', label: 'Day' }];
const HOURS = Array.from({ length: 13 }, (_, i) => 7 + i); // 7am to 7pm

const weekStart = (iso) => { const d = new Date(iso + 'T00:00:00'); return addDaysIso(iso, -((d.getDay() + 6) % 7)); };
const longDate = (iso, opts) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', opts);
const byTime = (a, b) => (a.time || '99').localeCompare(b.time || '99');
const pill = (e) => `<button class="sched-pill" style="--c:var(--accent)" data-coo-event="${e.id}" title="${escapeHtml(e.title)}${e.notes ? ' · ' + escapeHtml(e.notes) : ''}">${e.time ? `<b>${fmtTime(e.time)}</b> ` : ''}${escapeHtml(e.title || 'Untitled')}</button>`;

// Department Calendar: everything dated on the other pages, pulled in read-only. Each source has its own color.
// Lainie's own events stay on the COO Calendar.
const DEPT_SOURCES = [
  { key: 'leadership', label: 'Leadership schedule', color: '#7fb8e6', href: '#/schedule?anchor=schedule-leadership' },
  { key: 'roadmap', label: 'GTM Roadmap', color: '#b48ee0', href: '#/roadmap?anchor=roadmap-calendar-section' },
  { key: 'events', label: 'Events & Offsites', color: '#e0a95a', href: '#/events?anchor=events-calendar' },
  { key: 'sprints', label: 'Sprint tasks', color: '#5fc4c4', href: '#/coo?anchor=coo-sprint-calendar' },
];

function deptEntries(c) {
  const data = getData();
  const out = [];
  const add = (source, date, title, time = '', extra = '') => { if (date) out.push({ source, date, title, time, extra }); };
  for (const e of data.leadershipSchedule || []) {
    for (let d = e.start; d && d <= (e.end || e.start); d = addDaysIso(d, 1)) add('leadership', d, `${e.person} · ${e.title || 'Busy'}`, e.time, e.city);
  }
  for (const t of data.tasks || []) add('roadmap', t.endDate, `${t.title} due`, '', 'Objective');
  for (const o of data.okrs || []) for (const kr of o.keyResults || []) add('roadmap', kr.deadline, `${kr.title} deadline`, '', o.objective);
  for (const m of data.milestones || []) add('roadmap', milestoneDate(m), m.title, '', 'Milestone');
  for (const e of data.events || []) add('events', e.date, e.name || 'Untitled event', '', e.location);
  for (const sp of allSprints(c)) for (const t of sp.tasks || []) add('sprints', t.due, t.text || 'Untitled task', '', sp.name);
  return out.filter((x) => !view.hiddenSources.has(x.source));
}

function deptPill(x) {
  const src = DEPT_SOURCES.find((d) => d.key === x.source);
  return `<a class="sched-pill" style="--c:${src.color}" href="${src.href}" title="${escapeHtml(`${src.label}: ${x.title}${x.extra ? ' · ' + x.extra : ''}`)}">${x.time ? `<b>${fmtTime(x.time)}</b> ` : ''}${escapeHtml(x.title)}</a>`;
}

// What the calendar shows: the COO's own events, or everything from every page.
function calItems(c) {
  if (view.calSource === 'dept') return deptEntries(c).map((x) => ({ ...x, html: deptPill(x) }));
  return (c.calendar || []).map((e) => ({ date: e.date, time: e.time, title: e.title, html: pill(e) }));
}
const editable = () => view.calSource === 'coo';
const dayAttrs = (day, time = '') => (editable() ? `data-coo-day="${day}"${time ? ` data-coo-time="${time}"` : ''}` : '');

function calTitle() {
  if (view.calMode === 'month') return monthLabel(view.focus.slice(0, 7));
  if (view.calMode === 'day') return longDate(view.focus, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const start = weekStart(view.focus);
  const end = addDaysIso(start, 6);
  return `${longDate(start, { month: 'short', day: 'numeric' })} to ${longDate(end, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function renderCalendar(c) {
  const mode = view.calMode;
  const unit = mode === 'month' ? 'month' : mode === 'week' ? 'week' : 'day';
  return `
    <div class="toolbar">
      <h2 class="schedule-part-title">Calendar</h2>
      ${editable() ? '<button class="btn btn-primary" id="coo-cal-add">+ Add event</button>' : ''}
    </div>
    <div class="section-desc cal-source-note">You can click through the COO calendar and department calendar. The COO calendar is only Lainie’s, whereas the department calendar consolidates all of the calendars across all pages: everything that needs to be done, everything that is in progress and all the objectives.</div>
    <div class="cal-source-tabs" role="tablist" aria-label="Which calendar">
      <button class="cal-source-tab ${view.calSource === 'coo' ? 'active' : ''}" data-cal-source="coo" role="tab" aria-selected="${view.calSource === 'coo'}">COO Calendar</button>
      <button class="cal-source-tab ${view.calSource === 'dept' ? 'active' : ''}" data-cal-source="dept" role="tab" aria-selected="${view.calSource === 'dept'}">Department Calendar</button>
    </div>
    ${view.calSource === 'dept' ? `
      <div class="dept-legend">
        ${DEPT_SOURCES.map((d) => `<button class="sched-chip ${view.hiddenSources.has(d.key) ? '' : 'on'}" data-dept-source="${d.key}"><span class="sched-swatch" style="background:${d.color}"></span>${d.label}</button>`).join('')}
        <span class="dept-legend-hint">Pulled from every page. Click a source to show or hide it, or an item to open its page.</span>
      </div>` : ''}
    <div class="card sched-card">
      <div class="toolbar sched-nav">
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn" id="coo-prev" aria-label="Previous ${unit}">‹</button>
          <button class="btn" id="coo-today">Today</button>
          <button class="btn" id="coo-next" aria-label="Next ${unit}">›</button>
          <h4 style="margin:0 0 0 8px;">${calTitle()}</h4>
        </div>
        <div class="view-tabs coo-cal-modes" role="tablist" aria-label="Calendar view">
          ${CAL_MODES.map((m) => `<button class="view-tab ${m.key === mode ? 'active' : ''}" data-cal-mode="${m.key}" role="tab" aria-selected="${m.key === mode}">${m.label}</button>`).join('')}
        </div>
      </div>
      ${mode === 'month' ? monthView(c) : mode === 'week' ? weekView(c) : dayView(c)}
      ${editable() ? `<div class="section-desc" style="margin:8px 0 0;">Click ${mode === 'day' ? 'an hour' : 'a day'} to add an event, or click an event to see or edit it.</div>` : ''}
    </div>
  `;
}

function monthView(c) {
  const today = todayISO();
  const month = view.focus.slice(0, 7);
  const all = calItems(c);
  return `
    ${all.some((e) => e.date.slice(0, 7) === month) ? '' : '<div class="sched-list-empty">Nothing on the calendar this month.</div>'}
    <div class="sched-grid">
      ${WEEKDAYS.map((d) => `<div class="sched-weekday">${d}</div>`).join('')}
      ${gridDays(month).map((day) => {
        const items = all.filter((e) => e.date === day).sort(byTime);
        return `
          <div class="sched-day ${day.slice(0, 7) !== month ? 'other-month' : ''} ${day === today ? 'today' : ''} ${items.length ? 'has-items' : ''} ${editable() ? '' : 'cal-static'}" ${dayAttrs(day)} data-label="${dayLabel(day)}">
            <div class="sched-date">${Number(day.slice(8))}</div>
            ${items.map((x) => x.html).join('')}
          </div>`;
      }).join('')}
    </div>`;
}

function weekView(c) {
  const today = todayISO();
  const start = weekStart(view.focus);
  const days = Array.from({ length: 7 }, (_, i) => addDaysIso(start, i));
  const all = calItems(c);
  return `
    <div class="cal-week">
      ${days.map((day) => {
        const items = all.filter((e) => e.date === day).sort(byTime);
        return `
          <div class="cal-week-col ${day === today ? 'today' : ''}">
            <button type="button" class="cal-week-head" data-cal-goto-day="${day}" title="Open this day">
              <span>${longDate(day, { weekday: 'short' })}</span><b>${new Date(day + 'T00:00:00').getDate()}</b>
            </button>
            <div class="cal-week-body ${editable() ? '' : 'static'}" ${dayAttrs(day)}>
              ${items.map((x) => x.html).join('') || '<span class="cal-week-empty">Free</span>'}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function dayView(c) {
  const day = view.focus;
  const items = calItems(c).filter((e) => e.date === day).sort(byTime);
  const allDay = items.filter((e) => !e.time);
  const hourOf = (e) => Math.min(Math.max(Number(e.time.slice(0, 2)), HOURS[0]), HOURS[HOURS.length - 1]);
  return `
    <div class="cal-day">
      <div class="cal-day-row cal-day-allday">
        <div class="cal-day-hour">All day</div>
        <div class="cal-day-slot ${editable() ? '' : 'static'}" ${dayAttrs(day)}>${allDay.map((x) => x.html).join('')}</div>
      </div>
      ${HOURS.map((h) => {
        const here = items.filter((e) => e.time && hourOf(e) === h);
        const hh = String(h).padStart(2, '0');
        return `
          <div class="cal-day-row ${day === todayISO() && new Date().getHours() === h ? 'now' : ''}">
            <div class="cal-day-hour">${fmtTime(`${hh}:00`)}</div>
            <div class="cal-day-slot ${editable() ? '' : 'static'}" ${dayAttrs(day, `${hh}:00`)}>${here.map((x) => x.html).join('')}</div>
          </div>`;
      }).join('')}
    </div>`;
}

/* ---------- Inbox ---------- */
// Where each email stands. Click the status to move it along (in edit mode).
const MAIL_STATUS = [
  { key: 'needs', label: 'Needs to be addressed' },
  { key: 'progress', label: 'In progress' },
  { key: 'done', label: 'Addressed' },
];

function statusButton(m) {
  const st = MAIL_STATUS.find((x) => x.key === m.status) || MAIL_STATUS[0];
  return `<button type="button" class="coo-mail-status st-${st.key}" data-mail-status="${m.id}" data-ro-keep title="Click to change the status (edit mode)">${st.label}</button>`;
}

function syncedLabel() {
  const mins = Math.max(0, Math.round((Date.now() - view.syncedAt) / 60000));
  return mins < 1 ? 'Synced just now' : `Synced ${mins} min ago`;
}

function renderInbox(c) {
  const folder = view.folder;
  const mails = c.inbox.filter((m) => m.category === folder).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const unread = (key) => c.inbox.filter((m) => m.category === key && !m.read).length;
  return `
    <div class="toolbar">
      <h2 class="schedule-part-title">Inbox</h2>
    </div>
    <div class="card coo-mail">
      <div class="coo-mail-bar">
        <span class="coo-mail-status"><span class="coo-dot"></span>Connected to your email · Sorted automatically</span>
        <span class="coo-mail-sync">
          <span id="coo-synced">${view.syncing ? 'Syncing…' : syncedLabel()}</span>
          <button class="btn btn-ghost" id="coo-sync" style="padding:3px 8px;" ${view.syncing ? 'disabled' : ''}>↻ Sync</button>
        </span>
      </div>
      <div class="coo-mail-body">
        <nav class="coo-folders" aria-label="Folders">
          ${COO_INBOX.map((f) => `
            <button class="coo-folder ${f.key === folder ? 'on' : ''}" data-folder="${f.key}">
              <span>${f.label}</span>
              <span class="coo-folder-count">${unread(f.key) || ''}</span>
            </button>`).join('')}
        </nav>
        <div class="coo-mail-list">
          ${mails.map((m) => {
            const open = view.openMail === m.id;
            return `
            <div class="coo-msg ${m.read ? '' : 'unread'} ${open ? 'open' : ''}">
              <div class="coo-msg-line">
                <button class="coo-msg-row" data-open-mail="${m.id}" aria-expanded="${open}">
                  <span class="coo-avatar">${escapeHtml((m.from || '?').trim()[0].toUpperCase())}</span>
                  <span class="coo-msg-from">${escapeHtml(m.from)}</span>
                  <span class="coo-msg-text"><span class="coo-msg-subject">${escapeHtml(m.subject)}</span>${m.summary ? ` <span class="coo-msg-snippet">· ${escapeHtml(m.summary)}</span>` : ''}</span>
                </button>
                ${statusButton(m)}
                <span class="coo-msg-date">${dateText(m.date)}</span>
              </div>
              ${open ? `
                <div class="coo-msg-detail">
                  <div class="coo-msg-detail-head"><strong>${escapeHtml(m.subject)}</strong><span>${escapeHtml(m.from)} · ${dateText(m.date)}</span></div>
                  <p>${escapeHtml(m.summary) || '<span class="empty-hint" style="padding:0;">No preview.</span>'}</p>
                  <label class="coo-move">Move to
                    <select class="cell-input" data-mail-move="${m.id}">${COO_INBOX.map((o) => `<option value="${o.key}" ${o.key === m.category ? 'selected' : ''}>${o.label}</option>`).join('')}</select>
                  </label>
                </div>` : ''}
            </div>`;
          }).join('') || '<div class="empty-hint" style="padding:24px;">No emails in this folder.</div>'}
        </div>
      </div>
    </div>
  `;
}

/* ---------- Inquiries board ---------- */
function renderInquiries(c) {
  return `
    <div class="toolbar">
      <h2 class="schedule-part-title">Inquiries</h2>
      <button class="btn btn-primary" data-inq-add="needed">+ Add inquiry</button>
    </div>
    <div class="section-desc">Drag a card to move it to another column. Click a card to open it.</div>
    <div class="coo-board">
      ${COO_STAGES.map((st) => {
        const cards = c.inquiries.filter((q) => q.stage === st.key);
        return `
        <div class="coo-col" data-inq-col="${st.key}">
          <div class="coo-col-head">
            <span>${st.label}</span>
            <span class="event-phase-count">${cards.length}</span>
          </div>
          <div class="coo-col-body" data-inq-drop="${st.key}">
            ${cards.map((q) => `
              <div class="coo-card" draggable="true" data-inq="${q.id}" tabindex="0">
                <div class="coo-card-title">${escapeHtml(q.title || 'Untitled inquiry')}</div>
                ${q.department ? `<span class="coo-tag">${escapeHtml(q.department)}</span>` : ''}
                ${q.description ? `<div class="coo-card-desc">${escapeHtml(q.description)}</div>` : ''}
                <div class="coo-card-meta">
                  <div><span>Owner</span>${escapeHtml(q.owner || 'No owner')}</div>
                  <div><span>Deadline</span>${q.deadline ? dateText(q.deadline) : 'None'}</div>
                </div>
              </div>`).join('')}
          </div>
          <button class="coo-col-add" data-inq-add="${st.key}">+ Add inquiry</button>
        </div>`;
      }).join('')}
    </div>
  `;
}

/* ---------- Sprints ---------- */
// Owner of a sprint task: a round initials badge in the person's department color.
function ownerCell(t, canType) {
  const data = getData();
  const person = (data.people || []).find((p) => p.id === t.ownerId);
  const team = person && findTeam(person.teamId);
  const color = team?.color || '#8f9bb3';
  const badge = person
    ? `<span class="coo-owner-badge" style="background:${color}" title="${escapeHtml(person.name)}${team ? `, ${escapeHtml(team.name)}` : ', Leadership'}">${initials(person.name)}</span>`
    : '<span class="coo-owner-badge empty" title="No owner">?</span>';
  if (!canType) return badge;
  return `<span class="coo-owner-edit">${badge}<select class="cell-input" data-task-owner="${t.id}" aria-label="Owner">
    <option value="">No owner</option>
    ${(data.people || []).map((p) => `<option value="${p.id}" ${p.id === t.ownerId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
  </select></span>`;
}

const shortDay = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

function sprintBody(s, editable) {
  const canType = editable && !isReadOnly();
  const field = (key, label, placeholder) => editable
    ? `<div class="coo-sprint-block"><div class="home-sub-title">${label}</div><textarea class="notes-box" data-sprint="${key}" placeholder="${placeholder}">${escapeHtml(s[key] || '')}</textarea></div>`
    : `<div class="coo-sprint-block"><div class="home-sub-title">${label}</div><div class="coo-readonly">${escapeHtml(s[key] || '') || '<span class="empty-hint" style="padding:0;">Nothing written.</span>'}</div></div>`;
  const done = s.tasks.filter((t) => t.done).length;
  return `
    <div class="coo-sprint-grid">
      <div class="coo-sprint-block coo-sprint-tasks">
        <div class="coo-tasks-head">
          <div class="home-sub-title" style="margin:0;">Tasks <span class="event-phase-count">${done}/${s.tasks.length}</span></div>
          ${editable ? '<button class="btn btn-primary" id="coo-task-add" data-ro-keep>Add a task</button>' : ''}
        </div>
        <table class="list-table coo-task-table">
          <thead><tr><th class="ct-check">Done</th><th>Task</th><th class="coo-owner-col">Owner</th><th class="coo-due-col">Due</th>${canType ? '<th></th>' : ''}</tr></thead>
          <tbody>
            ${[...s.tasks].sort((x, y) => (x.due || '9').localeCompare(y.due || '9')).map((t) => `
              <tr class="${t.done ? 'done' : ''}">
                <td class="ct-check">${canType
                  ? `<input type="checkbox" data-task-done="${t.id}" ${t.done ? 'checked' : ''} aria-label="Done" />`
                  : `<span class="coo-check">${t.done ? '✓' : ''}</span>`}</td>
                <td>${canType
                  ? `<input type="text" class="cell-input" data-task-text="${t.id}" value="${escapeHtml(t.text)}" placeholder="What needs to get done?" />`
                  : `<span class="coo-task-text">${escapeHtml(t.text)}</span>`}</td>
                <td class="coo-owner-col">${ownerCell(t, canType)}</td>
                <td class="coo-due-col">${canType
                  ? `<input type="date" class="cell-input" data-task-due="${t.id}" value="${escapeHtml(t.due || '')}" />`
                  : `<span class="coo-due ${!t.done && t.due && t.due < todayISO() ? 'late' : ''}">${t.due ? shortDay(t.due) : 'No date'}</span>`}</td>
                ${canType ? `<td><button class="btn btn-ghost" data-task-remove="${t.id}" style="padding:3px 7px;" title="Remove">✕</button></td>` : ''}
              </tr>`).join('') || `<tr><td colspan="5" class="empty-hint">No tasks yet.</td></tr>`}
          </tbody>
        </table>
      </div>
      ${field('goal', 'End Goal', 'What this sprint is meant to achieve.')}
      ${field('metrics', 'Metrics of Success', 'How we will know it worked.')}
      ${field('notes', 'Notes', 'Anything else worth remembering.')}
      <div class="coo-sprint-block">
        <div class="home-sub-title">Team</div>
        <div class="coo-team">
          ${s.team.map((n) => `<span class="ts-chip">${escapeHtml(n)}${editable ? ` <button data-team-remove="${escapeHtml(n)}" title="Remove">✕</button>` : ''}</span>`).join('') || (editable ? '' : '<span class="empty-hint" style="padding:0;">No one listed.</span>')}
          ${editable ? '<input type="text" class="cell-input coo-team-add" id="coo-team-add" list="coo-people" placeholder="+ Add person" />' : ''}
        </div>
      </div>
    </div>
  `;
}

// The sprint as a row of working days, with today marked and each task's due date as a dot.
function sprintTimeline(s) {
  if (!s.start || !s.end || s.end < s.start) return '';
  const today = todayISO();
  const days = [];
  for (let d = s.start; d <= s.end && days.length < 62; d = addDaysIso(d, 1)) {
    const wd = new Date(d + 'T00:00:00').getDay();
    if (wd !== 0 && wd !== 6) days.push(d);
  }
  if (!days.length) return '';
  const idx = days.indexOf(today);
  const label = new Date(today + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const next = days.findIndex((d) => d > today);
  const status = idx >= 0 ? `Today is <b>${label}</b>, day ${idx + 1} of ${days.length}`
    : today < days[0] ? `Today is <b>${label}</b>. The sprint starts ${shortDay(days[0])}`
    : today > days[days.length - 1] ? `Ran <b>${shortDay(days[0])}</b> to <b>${shortDay(days[days.length - 1])}</b>, ${days.length} working days`
    : `Today is <b>${label}</b>, a weekend. Next working day: ${shortDay(days[next])}, day ${next + 1} of ${days.length}`;
  return `
    <div class="coo-timeline">
      <div class="coo-timeline-status">${status}</div>
      <div class="coo-timeline-days" style="grid-template-columns: repeat(${days.length}, minmax(0, 1fr));">
        ${days.map((d) => {
          const due = s.tasks.filter((t) => t.due === d);
          const dt = new Date(d + 'T00:00:00');
          return `
            <div class="coo-day ${d < today ? 'past' : ''} ${d === today ? 'today' : ''}" title="${escapeHtml(shortDay(d))}${due.length ? ': ' + escapeHtml(due.map((t) => t.text).join(', ')) : ''}">
              <span class="coo-day-name">${dt.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span class="coo-day-num">${dt.getDate()}</span>
              <span class="coo-day-dots">${due.map((t) => `<i class="${t.done ? 'done' : ''}"></i>`).join('')}</span>
            </div>`;
        }).join('')}
      </div>
      <div class="coo-timeline-legend"><span><i></i>Task due</span><span><i class="done"></i>Done</span></div>
    </div>`;
}

const addDaysIso = (iso, n) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function renderSprint(s) {
  return `
    <div class="toolbar">
      <h2 class="schedule-part-title">Current Sprint</h2>
      <button class="btn" id="coo-sprint-close" title="Save this sprint to Past Sprints and start a new one">Finish sprint</button>
    </div>
    <div class="card doc-card">
      <div class="coo-sprint-head">
        <input type="text" class="cell-input coo-sprint-name" data-sprint="name" value="${escapeHtml(s.name)}" placeholder="Sprint name" />
        <span class="coo-sprint-dates">
          <label>Start <input type="date" class="cell-input" data-sprint="start" value="${escapeHtml(s.start)}" /></label>
          <label>End <input type="date" class="cell-input" data-sprint="end" value="${escapeHtml(s.end)}" /></label>
        </span>
      </div>
      ${sprintTimeline(s)}
      ${sprintBody(s, true)}
    </div>
  `;
}

function renderPast(c) {
  return `
    <div class="toolbar">
      <h2 class="schedule-part-title">Past Sprints</h2>
    </div>
    <div class="section-desc">Click a sprint to see everything from it.</div>
    <div class="card doc-card">
      <table class="list-table coo-past-table">
        <thead><tr><th>Sprint</th><th>Dates</th><th>End Goal</th><th>Tasks Done</th></tr></thead>
        <tbody>
          ${c.pastSprints.map((s) => `
            <tr class="coo-past-row" data-past="${s.id}" tabindex="0">
              <td><strong>${escapeHtml(s.name)}</strong></td>
              <td>${range(s)}</td>
              <td class="coo-past-goal">${escapeHtml(s.goal || '')}</td>
              <td>${s.tasks.filter((t) => t.done).length}/${s.tasks.length}</td>
            </tr>`).join('') || '<tr><td colspan="4" class="empty-hint">No past sprints yet. Click "Finish sprint" above to save one here.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

/* ---------- Sprint Calendar: one row per week, tasks on their due day ---------- */
function mondayOf(iso) {
  const d = new Date(iso + 'T00:00:00');
  return addDaysIso(iso, -((d.getDay() + 6) % 7));
}

function allSprints(c) {
  return [...(c.pastSprints || []), c.currentSprint].filter(Boolean);
}

function renderSprintCalendar(c) {
  const sprints = allSprints(c).filter((sp) => sp.start && sp.end);
  if (!sprints.length) return '';
  const today = todayISO();
  const first = mondayOf(sprints.reduce((m, sp) => (sp.start < m ? sp.start : m), sprints[0].start));
  const lastSprintEnd = sprints.reduce((m, sp) => (sp.end > m ? sp.end : m), sprints[0].end);
  const last = addDaysIso(mondayOf(lastSprintEnd > today ? lastSprintEnd : today), 14); // two weeks ahead to plan into
  const weeks = [];
  for (let w = first; w <= last; w = addDaysIso(w, 7)) weeks.push(w);
  const tasks = sprints.flatMap((sp) => sp.tasks.map((t) => ({ t, sp })));
  const canMove = !isReadOnly();

  return `
    <div class="toolbar">
      <h2 class="schedule-part-title">Sprint Calendar</h2>
    </div>
    <div class="section-desc">Each week is its own sprint, with tasks on the day they are due. ${canMove ? 'Drag a task to another day to move it.' : 'Click Edit to drag tasks to another day.'}</div>
    <div class="card sc-card">
      <div class="sc-grid">
        <div class="sc-head sc-week-head">Week</div>
        ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => `<div class="sc-head">${d}</div>`).join('')}
        ${weeks.map((w) => {
          const sp = sprints.find((x) => x.start <= addDaysIso(w, 4) && x.end >= w);
          const isNow = w === mondayOf(today);
          const weekNo = sp ? Math.floor((Date.parse(w) - Date.parse(mondayOf(sp.start))) / 604800000) + 1 : 0;
          return `
            <div class="sc-week ${isNow ? 'now' : ''}">
              <span class="sc-week-date">Week of ${fmtDate(w)}</span>
              <span class="sc-week-sprint">${sp ? `${escapeHtml(sp.name)} · week ${weekNo}` : 'Not planned yet'}</span>
            </div>
            ${[0, 1, 2, 3, 4].map((i) => {
              const day = addDaysIso(w, i);
              const here = tasks.filter(({ t }) => t.due === day);
              return `
                <div class="sc-day ${day === today ? 'today' : ''} ${day < today ? 'past' : ''}" data-sc-day="${day}">
                  <span class="sc-day-num">${new Date(day + 'T00:00:00').getDate()}</span>
                  ${here.map(({ t, sp: owner }) => taskChip(t, owner, canMove)).join('')}
                </div>`;
            }).join('')}`;
        }).join('')}
      </div>
    </div>
  `;
}

function taskChip(t, sp, canMove) {
  const person = (getData().people || []).find((p) => p.id === t.ownerId);
  const color = (person && findTeam(person.teamId)?.color) || '#8f9bb3';
  return `
    <div class="sc-task ${t.done ? 'done' : ''}" ${canMove ? 'draggable="true"' : ''} data-sc-task="${sp.id}|${t.id}" tabindex="0"
      title="${escapeHtml(t.text || 'Untitled task')}${person ? ` · ${escapeHtml(person.name)}` : ''} · ${escapeHtml(sp.name)}${t.done ? ' · Done' : ''}">
      <span class="sc-task-badge" style="background:${color}">${person ? initials(person.name) : '?'}</span>
      <span class="sc-task-text">${escapeHtml(t.text || 'Untitled task')}</span>
    </div>`;
}

function wireSprintCalendar(container, c, rerender) {
  const find = (key) => {
    const [spId, tId] = key.split('|');
    const sp = allSprints(c).find((x) => x.id === spId);
    return { sp, t: sp?.tasks.find((x) => x.id === tId) };
  };
  container.querySelectorAll('[data-sc-task][draggable]').forEach((chip) => {
    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', chip.dataset.scTask);
      e.dataTransfer.effectAllowed = 'move';
      requestAnimationFrame(() => chip.classList.add('dragging'));
    });
    chip.addEventListener('dragend', () => {
      chip.classList.remove('dragging');
      container.querySelectorAll('.sc-day.drop').forEach((d) => d.classList.remove('drop'));
    });
  });
  container.querySelectorAll('[data-sc-day]').forEach((cell) => {
    cell.addEventListener('dragover', (e) => {
      if (isReadOnly()) return;
      e.preventDefault();
      container.querySelectorAll('.sc-day.drop').forEach((d) => d !== cell && d.classList.remove('drop'));
      cell.classList.add('drop');
    });
    cell.addEventListener('dragleave', (e) => { if (!cell.contains(e.relatedTarget)) cell.classList.remove('drop'); });
    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      const { sp, t } = find(e.dataTransfer.getData('text/plain'));
      if (!t) return;
      const day = cell.dataset.scDay;
      t.due = day;
      // If another sprint covers the new day, the task moves into that sprint.
      const home = allSprints(c).find((x) => x.start && x.end && x.start <= day && day <= x.end);
      if (home && home !== sp) {
        sp.tasks = sp.tasks.filter((x) => x !== t);
        home.tasks.push(t);
      }
      commit();
      rerender();
    });
  });
}

/* ---------- Events ---------- */
function wire(container, c) {
  const rerender = () => {
    const y = window.scrollY;
    renderCooScheduling(container);
    window.scrollTo(0, y);
  };

  container.querySelectorAll('[data-jump]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.jump).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Calendar
  const step = (n) => {
    if (view.calMode === 'month') view.focus = `${shiftMonth(view.focus.slice(0, 7), n)}-01`;
    else view.focus = addDaysIso(view.focus, view.calMode === 'week' ? 7 * n : n);
    rerender();
  };
  container.querySelector('#coo-prev').addEventListener('click', () => step(-1));
  container.querySelector('#coo-next').addEventListener('click', () => step(1));
  container.querySelector('#coo-today').addEventListener('click', () => { view.focus = todayISO(); rerender(); });
  container.querySelectorAll('[data-cal-mode]').forEach((b) => b.addEventListener('click', () => {
    view.calMode = b.dataset.calMode;
    // Week and day views start from today when today is in the month you were looking at.
    if (view.calMode !== 'month' && todayISO().slice(0, 7) === view.focus.slice(0, 7)) view.focus = todayISO();
    rerender();
  }));
  container.querySelectorAll('[data-cal-goto-day]').forEach((b) => b.addEventListener('click', () => {
    view.calMode = 'day';
    view.focus = b.dataset.calGotoDay;
    rerender();
  }));
  container.querySelector('#coo-cal-add')?.addEventListener('click', () => openEventPanel(c, null, todayISO(), rerender));
  container.querySelectorAll('[data-cal-source]').forEach((b) => b.addEventListener('click', () => { view.calSource = b.dataset.calSource; rerender(); }));
  container.querySelectorAll('[data-dept-source]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.deptSource;
    if (view.hiddenSources.has(k)) view.hiddenSources.delete(k); else view.hiddenSources.add(k);
    rerender();
  }));
  container.querySelectorAll('[data-coo-day]').forEach((cell) => cell.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-coo-event]')) return;
    openEventPanel(c, null, cell.dataset.cooDay, rerender, cell.dataset.cooTime || '');
  }));
  container.querySelectorAll('[data-coo-event]').forEach((pill) => pill.addEventListener('click', () => {
    openEventPanel(c, c.calendar.find((e) => e.id === pill.dataset.cooEvent), null, rerender);
  }));

  // Inbox
  container.querySelectorAll('[data-folder]').forEach((btn) => btn.addEventListener('click', () => {
    view.folder = btn.dataset.folder;
    view.openMail = null;
    rerender();
  }));
  container.querySelectorAll('[data-open-mail]').forEach((row) => row.addEventListener('click', () => {
    const id = row.dataset.openMail;
    view.openMail = view.openMail === id ? null : id;
    const m = c.inbox.find((x) => x.id === id);
    if (!m.read) { m.read = true; commit(); }
    rerender();
  }));
  container.querySelectorAll('[data-mail-status]').forEach((btn) => btn.addEventListener('click', () => {
    if (isReadOnly()) return;
    const m = c.inbox.find((x) => x.id === btn.dataset.mailStatus);
    const keys = MAIL_STATUS.map((x) => x.key);
    m.status = keys[(keys.indexOf(m.status || 'needs') + 1) % keys.length];
    commit();
    rerender();
  }));
  container.querySelectorAll('[data-mail-move]').forEach((sel) => sel.addEventListener('change', () => {
    c.inbox.find((m) => m.id === sel.dataset.mailMove).category = sel.value;
    view.openMail = null;
    commit();
    rerender();
  }));
  container.querySelector('#coo-sync').addEventListener('click', () => {
    view.syncing = true;
    rerender();
    setTimeout(() => { view.syncing = false; view.syncedAt = Date.now(); rerender(); }, 900);
  });

  // Inquiries: open, add and drag between columns.
  container.querySelectorAll('[data-inq]').forEach((card) => {
    card.addEventListener('click', () => openInquiryPanel(c, c.inquiries.find((q) => q.id === card.dataset.inq), null, rerender));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') card.click(); });
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.dataset.inq);
      e.dataTransfer.effectAllowed = 'move';
      requestAnimationFrame(() => card.classList.add('dragging'));
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      container.querySelectorAll('.coo-col.drop-target').forEach((col) => col.classList.remove('drop-target'));
    });
  });
  container.querySelectorAll('[data-inq-col]').forEach((col) => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      container.querySelectorAll('.coo-col.drop-target').forEach((x) => x !== col && x.classList.remove('drop-target'));
      col.classList.add('drop-target');
    });
    col.addEventListener('dragleave', (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove('drop-target'); });
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const item = c.inquiries.find((q) => q.id === id);
      if (!item) return;
      // Drop above the first card whose middle is below the pointer.
      const before = [...col.querySelectorAll('[data-inq]')]
        .filter((el) => el.dataset.inq !== id)
        .find((el) => { const r = el.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
      c.inquiries.splice(c.inquiries.indexOf(item), 1);
      item.stage = col.dataset.inqCol;
      const at = before ? c.inquiries.findIndex((q) => q.id === before.dataset.inq) : -1;
      if (at === -1) c.inquiries.push(item); else c.inquiries.splice(at, 0, item);
      commit();
      rerender();
    });
  });
  container.querySelectorAll('[data-inq-add]').forEach((btn) => btn.addEventListener('click', () => openInquiryPanel(c, null, btn.dataset.inqAdd, rerender)));

  // Current sprint
  const s = c.currentSprint;
  container.querySelectorAll('[data-sprint]').forEach((input) => input.addEventListener('input', () => {
    s[input.dataset.sprint] = input.value;
    commit();
  }));
  // New start or end dates redraw the timeline.
  container.querySelectorAll('[data-sprint="start"], [data-sprint="end"]').forEach((input) => input.addEventListener('change', rerender));
  container.querySelectorAll('[data-task-done]').forEach((box) => box.addEventListener('change', () => {
    s.tasks.find((t) => t.id === box.dataset.taskDone).done = box.checked;
    commit();
    rerender();
  }));
  container.querySelectorAll('[data-task-text]').forEach((input) => input.addEventListener('input', () => {
    s.tasks.find((t) => t.id === input.dataset.taskText).text = input.value;
    commit();
  }));
  container.querySelectorAll('[data-task-remove]').forEach((btn) => btn.addEventListener('click', () => {
    s.tasks = s.tasks.filter((t) => t.id !== btn.dataset.taskRemove);
    commit();
    rerender();
  }));
  container.querySelector('#coo-task-add')?.addEventListener('click', () => {
    // Shown in read-only mode too: clicking it turns on editing first, then adds the task.
    if (isReadOnly()) {
      document.querySelector('[data-toggle-edit]')?.click();
      document.querySelector('#coo-task-add')?.click();
      return;
    }
    const today = todayISO();
    const due = s.start && s.end && today >= s.start && today <= s.end ? today : s.start || today;
    const id = uid('task');
    s.tasks.push({ id, text: '', done: false, due });
    commit();
    rerender();
    container.querySelector(`[data-task-text="${id}"]`)?.focus();
  });
  container.querySelectorAll('[data-task-owner]').forEach((sel) => sel.addEventListener('change', () => {
    s.tasks.find((t) => t.id === sel.dataset.taskOwner).ownerId = sel.value || null;
    commit();
    rerender();
  }));
  container.querySelectorAll('[data-task-due]').forEach((input) => input.addEventListener('change', () => {
    s.tasks.find((t) => t.id === input.dataset.taskDue).due = input.value;
    commit();
    rerender();
  }));
  container.querySelectorAll('[data-team-remove]').forEach((btn) => btn.addEventListener('click', () => {
    s.team = s.team.filter((n) => n !== btn.dataset.teamRemove);
    commit();
    rerender();
  }));
  const teamAdd = container.querySelector('#coo-team-add');
  const addPerson = () => {
    const v = teamAdd.value.trim();
    if (!v || s.team.includes(v)) return;
    s.team.push(v);
    commit();
    rerender();
    container.querySelector('#coo-team-add').focus();
  };
  teamAdd.addEventListener('keydown', (e) => { if (e.key === 'Enter') addPerson(); });
  teamAdd.addEventListener('change', () => { if (getData().scheduleLeaders?.includes(teamAdd.value.trim())) addPerson(); });

  container.querySelector('#coo-sprint-close').addEventListener('click', () => {
    if (!confirm(`Move "${s.name || 'this sprint'}" to Past Sprints and start a new one?`)) return;
    c.pastSprints.unshift(s);
    const num = Number((s.name || '').match(/(\d+)\s*$/)?.[1]);
    c.currentSprint = {
      id: uid('sprint'), name: num ? s.name.replace(/\d+\s*$/, String(num + 1)) : 'New sprint',
      start: '', end: '', tasks: [], goal: '', metrics: '', notes: '', team: [...s.team],
    };
    commit();
    rerender();
  });

  wireSprintCalendar(container, c, rerender);

  // Past sprints open in a pop-up.
  container.querySelectorAll('[data-past]').forEach((row) => {
    const open = () => openPastModal(c, c.pastSprints.find((p) => p.id === row.dataset.past), rerender);
    row.addEventListener('click', open);
    row.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
  });
}

/* ---------- Side panels and pop-up ---------- */
function openPanel(title, bodyHtml, { onSave, onDelete }) {
  closePanel();
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'coo-overlay';
  const panel = document.createElement('div');
  panel.className = 'task-sidebar';
  panel.id = 'coo-panel';
  panel.innerHTML = `
    <div class="ts-header"><strong>${title}</strong><button class="btn btn-ghost" data-close aria-label="Close">✕</button></div>
    <div class="ts-body">
      ${bodyHtml}
      <div class="sched-panel-actions">
        <button class="btn btn-primary" data-save>Save</button>
        <button class="btn btn-ghost" data-close>Cancel</button>
        ${onDelete ? '<button class="btn btn-ghost btn-danger" data-delete style="margin-left:auto;">Delete</button>' : ''}
      </div>
    </div>`;
  document.body.append(overlay, panel);
  overlay.addEventListener('click', closePanel);
  panel.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closePanel));
  panel.querySelector('[data-save]').addEventListener('click', () => { if (onSave(panel) !== false) closePanel(); });
  panel.querySelector('[data-delete]')?.addEventListener('click', () => { if (onDelete()) closePanel(); });
  panel.querySelector('input, textarea, select')?.focus();
  return panel;
}

function closePanel() {
  document.getElementById('coo-overlay')?.remove();
  document.getElementById('coo-panel')?.remove();
  document.getElementById('coo-modal')?.remove();
}

function openEventPanel(c, event, day, rerender, time = '') {
  const e = event || { title: '', date: day, time, notes: '' };
  openPanel(event ? 'Edit event' : 'New event', `
    <div class="ts-field"><div class="ts-field-label">Title</div><input type="text" id="ce-title" value="${escapeHtml(e.title)}" placeholder="e.g. Board prep" /></div>
    <div class="ts-field"><div class="ts-field-label">Date</div><input type="date" id="ce-date" value="${escapeHtml(e.date)}" /></div>
    <div class="ts-field"><div class="ts-field-label">Time (optional)</div><input type="time" id="ce-time" class="sched-time" value="${escapeHtml(e.time || '')}" /></div>
    <div class="ts-field"><div class="ts-field-label">Notes</div><textarea id="ce-notes">${escapeHtml(e.notes || '')}</textarea></div>
  `, {
    onSave: (p) => {
      const date = p.querySelector('#ce-date').value;
      if (!date) { p.querySelector('#ce-date').focus(); return false; }
      const values = { title: p.querySelector('#ce-title').value.trim(), date, time: p.querySelector('#ce-time').value, notes: p.querySelector('#ce-notes').value };
      if (event) Object.assign(event, values); else c.calendar.push({ id: uid('cal'), ...values });
      view.month = date.slice(0, 7);
      if (view.calMode === 'month' ? view.focus.slice(0, 7) !== date.slice(0, 7) : true) view.focus = date;
      commit();
      rerender();
    },
    onDelete: event && (() => {
      if (!confirm('Delete this event?')) return false;
      c.calendar = c.calendar.filter((x) => x !== event);
      commit();
      rerender();
      return true;
    }),
  });
}

function openInquiryPanel(c, inquiry, stage, rerender) {
  const q = inquiry || { title: '', department: '', description: '', owner: '', deadline: '', stage };
  openPanel(inquiry ? 'Inquiry' : 'New inquiry', `
    <div class="ts-field"><div class="ts-field-label">Inquiry</div><input type="text" id="ci-title" value="${escapeHtml(q.title)}" placeholder="What is the inquiry?" /></div>
    <div class="ts-field"><div class="ts-field-label">Department</div><input type="text" id="ci-dept" value="${escapeHtml(q.department)}" placeholder="e.g. Finance" /></div>
    <div class="ts-field"><div class="ts-field-label">Description</div><textarea id="ci-desc">${escapeHtml(q.description)}</textarea></div>
    <div class="ts-field"><div class="ts-field-label">Owner</div><input type="text" id="ci-owner" list="coo-people" value="${escapeHtml(q.owner)}" placeholder="Who owns it" /></div>
    <div class="ts-field"><div class="ts-field-label">Deadline</div><input type="date" id="ci-deadline" value="${escapeHtml(q.deadline)}" /></div>
    <div class="ts-field"><div class="ts-field-label">Column</div>
      <select id="ci-stage">${COO_STAGES.map((s) => `<option value="${s.key}" ${s.key === q.stage ? 'selected' : ''}>${s.label}</option>`).join('')}</select>
    </div>
  `, {
    onSave: (p) => {
      const title = p.querySelector('#ci-title').value.trim();
      if (!title) { p.querySelector('#ci-title').focus(); return false; }
      const values = {
        title, department: p.querySelector('#ci-dept').value.trim(), description: p.querySelector('#ci-desc').value,
        owner: p.querySelector('#ci-owner').value.trim(), deadline: p.querySelector('#ci-deadline').value, stage: p.querySelector('#ci-stage').value,
      };
      if (inquiry) Object.assign(inquiry, values); else c.inquiries.push({ id: uid('inq'), ...values });
      commit();
      rerender();
    },
    onDelete: inquiry && (() => {
      if (!confirm('Delete this inquiry?')) return false;
      c.inquiries = c.inquiries.filter((x) => x !== inquiry);
      commit();
      rerender();
      return true;
    }),
  });
}

function openPastModal(c, sprint, rerender) {
  closePanel();
  const modal = document.createElement('div');
  modal.className = 'coo-modal-wrap';
  modal.id = 'coo-modal';
  modal.innerHTML = `
    <div class="coo-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(sprint.name)}">
      <div class="ts-header">
        <div><strong>${escapeHtml(sprint.name)}</strong> <span class="section-desc" style="margin:0 0 0 8px;">${range(sprint)}</span></div>
        <button class="btn btn-ghost" data-close aria-label="Close">✕</button>
      </div>
      <div class="coo-modal-body">
        ${sprintTimeline(sprint)}
        ${sprintBody(sprint, false)}
        <div class="sched-panel-actions">
          <button class="btn btn-ghost" data-close>Close</button>
          <button class="btn btn-ghost btn-danger" data-delete style="margin-left:auto;">Delete sprint</button>
        </div>
      </div>
    </div>`;
  document.body.append(modal);
  const close = () => { modal.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  modal.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  modal.querySelector('[data-delete]').addEventListener('click', () => {
    if (!confirm(`Delete "${sprint.name}" from Past Sprints?`)) return;
    c.pastSprints = c.pastSprints.filter((p) => p !== sprint);
    commit();
    close();
    rerender();
  });
  modal.querySelector('[data-close]').focus();
}
