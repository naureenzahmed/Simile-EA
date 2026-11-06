import { getData, commit } from '../store.js';
import { uid, escapeHtml, todayISO, fmtDate } from '../utils.js';
import { COO_INBOX, COO_STAGES, seedCoo } from '../seed.js';

export const COO_TITLE = 'COO Scheduling';

const PARTS = [
  { id: 'coo-calendar', label: 'Calendar' },
  { id: 'coo-inbox', label: 'Inbox' },
  { id: 'coo-inquiries', label: 'Inquiries' },
  { id: 'coo-sprint', label: 'Current Sprint' },
  { id: 'coo-past', label: 'Past Sprints' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Not saved: calendar month, open inbox folder and email, and the last sync time.
const view = { month: todayISO().slice(0, 7), folder: 'investors', openMail: null, syncedAt: Date.now() - 2 * 60000, syncing: false };

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
  `;
  wire(container, c);
}

/* ---------- Calendar ---------- */
function renderCalendar(c) {
  const today = todayISO();
  return `
    <div class="toolbar">
      <h2 class="schedule-part-title">Calendar</h2>
      <button class="btn btn-primary" id="coo-cal-add">+ Add event</button>
    </div>
    <div class="card sched-card">
      <div class="toolbar sched-nav">
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn" id="coo-prev" aria-label="Previous month">‹</button>
          <button class="btn" id="coo-today">Today</button>
          <button class="btn" id="coo-next" aria-label="Next month">›</button>
          <h4 style="margin:0 0 0 8px;">${monthLabel(view.month)}</h4>
        </div>
        <span class="section-desc" style="margin:0;">Click a day to add an event, or click an event to edit it.</span>
      </div>
      <div class="sched-grid">
        ${WEEKDAYS.map((d) => `<div class="sched-weekday">${d}</div>`).join('')}
        ${gridDays(view.month).map((day) => {
          const items = c.calendar.filter((e) => e.date === day).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
          return `
            <div class="sched-day ${day.slice(0, 7) !== view.month ? 'other-month' : ''} ${day === today ? 'today' : ''}" data-coo-day="${day}">
              <div class="sched-date">${Number(day.slice(8))}</div>
              ${items.map((e) => `<button class="sched-pill" style="--c:var(--accent)" data-coo-event="${e.id}" title="${escapeHtml(e.title)}">${e.time ? `<b>${fmtTime(e.time)}</b> ` : ''}${escapeHtml(e.title || 'Untitled')}</button>`).join('')}
            </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

/* ---------- Inbox ---------- */
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
              <button class="coo-msg-row" data-open-mail="${m.id}" aria-expanded="${open}">
                <span class="coo-avatar">${escapeHtml((m.from || '?').trim()[0].toUpperCase())}</span>
                <span class="coo-msg-from">${escapeHtml(m.from)}</span>
                <span class="coo-msg-text"><span class="coo-msg-subject">${escapeHtml(m.subject)}</span>${m.summary ? ` <span class="coo-msg-snippet">· ${escapeHtml(m.summary)}</span>` : ''}</span>
                <span class="coo-msg-date">${dateText(m.date)}</span>
              </button>
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
      <button class="btn btn-primary" data-inq-add="potential">+ Add inquiry</button>
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
                  <div><span>Owner</span>${escapeHtml(q.owner || 'Unassigned')}</div>
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
function sprintBody(s, editable) {
  const field = (key, label, placeholder) => editable
    ? `<div class="coo-sprint-block"><div class="home-sub-title">${label}</div><textarea class="notes-box" data-sprint="${key}" placeholder="${placeholder}">${escapeHtml(s[key] || '')}</textarea></div>`
    : `<div class="coo-sprint-block"><div class="home-sub-title">${label}</div><div class="coo-readonly">${escapeHtml(s[key] || '') || '<span class="empty-hint" style="padding:0;">Nothing written.</span>'}</div></div>`;
  const done = s.tasks.filter((t) => t.done).length;
  return `
    <div class="coo-sprint-grid">
      <div class="coo-sprint-block coo-sprint-tasks">
        <div class="home-sub-title">Tasks <span class="event-phase-count">${done}/${s.tasks.length}</span></div>
        <ul class="coo-tasks">
          ${s.tasks.map((t) => editable ? `
            <li class="${t.done ? 'done' : ''}">
              <input type="checkbox" data-task-done="${t.id}" ${t.done ? 'checked' : ''} aria-label="Done" />
              <input type="text" class="cell-input" data-task-text="${t.id}" value="${escapeHtml(t.text)}" />
              <button class="btn btn-ghost" data-task-remove="${t.id}" style="padding:3px 7px;" title="Remove">✕</button>
            </li>` : `
            <li class="${t.done ? 'done' : ''}"><span class="coo-check">${t.done ? '✓' : ''}</span><span>${escapeHtml(t.text)}</span></li>`).join('')}
        </ul>
        ${editable ? '<input type="text" class="cell-input checklist-add" id="coo-task-add" placeholder="+ Add task (press Enter)" />' : ''}
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

function renderSprint(s) {
  return `
    <div class="toolbar">
      <h2 class="schedule-part-title">Current Sprint</h2>
      <button class="btn" id="coo-sprint-close" title="Save this sprint to Past Sprints and start a new one">Finish sprint</button>
    </div>
    <div class="card doc-card">
      <div class="coo-sprint-head">
        <input type="text" class="cell-input coo-sprint-name" data-sprint="name" value="${escapeHtml(s.name)}" placeholder="Sprint name" />
        <label>Start <input type="date" class="cell-input" data-sprint="start" value="${escapeHtml(s.start)}" /></label>
        <label>End <input type="date" class="cell-input" data-sprint="end" value="${escapeHtml(s.end)}" /></label>
      </div>
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
  container.querySelector('#coo-prev').addEventListener('click', () => { view.month = shiftMonth(view.month, -1); rerender(); });
  container.querySelector('#coo-next').addEventListener('click', () => { view.month = shiftMonth(view.month, 1); rerender(); });
  container.querySelector('#coo-today').addEventListener('click', () => { view.month = todayISO().slice(0, 7); rerender(); });
  container.querySelector('#coo-cal-add').addEventListener('click', () => openEventPanel(c, null, todayISO(), rerender));
  container.querySelectorAll('[data-coo-day]').forEach((cell) => cell.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-coo-event]')) return;
    openEventPanel(c, null, cell.dataset.cooDay, rerender);
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
  container.querySelector('#coo-task-add').addEventListener('keydown', (e) => {
    const v = e.target.value.trim();
    if (e.key !== 'Enter' || !v) return;
    s.tasks.push({ id: uid('task'), text: v, done: false });
    commit();
    rerender();
    container.querySelector('#coo-task-add').focus();
  });
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

function openEventPanel(c, event, day, rerender) {
  const e = event || { title: '', date: day, time: '', notes: '' };
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
