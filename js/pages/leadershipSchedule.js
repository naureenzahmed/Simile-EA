import { getData, commit } from '../store.js';
import { uid, escapeHtml, todayISO } from '../utils.js';
import { LEADERS, SCHEDULE_TYPES } from '../seed.js';

export const SCHEDULE_TITLE = 'Leadership Schedule Management';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// View state lives here (not saved), so it survives re-renders while you click around.
const view = {
  month: todayISO().slice(0, 7), // "YYYY-MM"
  types: new Set(SCHEDULE_TYPES.map((t) => t.key)),
  people: new Set(LEADERS),
};

const typeOf = (key) => SCHEDULE_TYPES.find((t) => t.key === key) || { key, label: key || 'Other', color: '#b8b6b2' };

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

// Six weeks of dates, Sunday first, covering the month.
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

export function renderLeadershipSchedule(container) {
  const entries = getData().leadershipSchedule;
  const visible = entries.filter((e) => view.types.has(e.type) && view.people.has(e.person));
  const today = todayISO();
  const days = gridDays(view.month);

  container.innerHTML = `
    <div class="toolbar">
      <div class="page-title" style="margin:0;">${SCHEDULE_TITLE}</div>
      <button class="btn btn-primary" id="sched-add">+ Add entry</button>
    </div>

    <div class="card sched-filters">
      <div class="sched-filter-row">
        <div class="sched-filter-label">Type</div>
        <div class="sched-chips">
          ${SCHEDULE_TYPES.map((t) => `
            <button class="sched-chip ${view.types.has(t.key) ? 'on' : ''}" data-filter-type="${t.key}" title="Show or hide ${escapeHtml(t.label)}">
              <span class="sched-swatch" style="background:${t.color}"></span>${escapeHtml(t.label)}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="sched-filter-row">
        <div class="sched-filter-label">Person</div>
        <div class="sched-chips">
          ${LEADERS.map((p) => `<button class="sched-chip ${view.people.has(p) ? 'on' : ''}" data-filter-person="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join('')}
        </div>
      </div>
      <div class="sched-filter-foot">
        <span>Showing ${visible.length} of ${entries.length} entries. Click a chip to show or hide it.</span>
        <button class="btn btn-ghost" id="sched-show-all" style="padding:3px 8px;">Show all</button>
      </div>
    </div>

    <div class="card sched-card">
      <div class="toolbar sched-nav">
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn" id="sched-prev" aria-label="Previous month">‹</button>
          <button class="btn" id="sched-today">Today</button>
          <button class="btn" id="sched-next" aria-label="Next month">›</button>
          <h4 style="margin:0 0 0 8px;">${monthLabel(view.month)}</h4>
        </div>
        <div class="sched-legend">
          ${SCHEDULE_TYPES.map((t) => `<span><span class="sched-swatch" style="background:${t.color}"></span>${escapeHtml(t.label)}</span>`).join('')}
        </div>
      </div>
      <div class="sched-grid">
        ${WEEKDAYS.map((d) => `<div class="sched-weekday">${d}</div>`).join('')}
        ${days.map((day) => {
          const items = visible
            .filter((e) => e.start <= day && day <= (e.end || e.start))
            .sort((a, b) => (a.time || '99').localeCompare(b.time || '99') || a.person.localeCompare(b.person));
          return `
            <div class="sched-day ${day.slice(0, 7) !== view.month ? 'other-month' : ''} ${day === today ? 'today' : ''}" data-day="${day}">
              <div class="sched-date">${Number(day.slice(8))}</div>
              ${items.map((e) => {
                const t = typeOf(e.type);
                const label = `${e.person}${e.title ? ' · ' + e.title : ''}`;
                return `<button class="sched-pill" style="--c:${t.color}" data-entry="${e.id}" title="${escapeHtml(`${t.label}: ${label}${e.time ? ' at ' + fmtTime(e.time) : ''}`)}">${e.time ? `<b>${fmtTime(e.time)}</b> ` : ''}${escapeHtml(label)}</button>`;
              }).join('')}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  wire(container, entries);
}

function wire(container, entries) {
  const rerender = () => renderLeadershipSchedule(container);
  const toggle = (set, value) => { if (set.has(value)) set.delete(value); else set.add(value); rerender(); };

  container.querySelectorAll('[data-filter-type]').forEach((b) => b.addEventListener('click', () => toggle(view.types, b.dataset.filterType)));
  container.querySelectorAll('[data-filter-person]').forEach((b) => b.addEventListener('click', () => toggle(view.people, b.dataset.filterPerson)));
  container.querySelector('#sched-show-all').addEventListener('click', () => {
    SCHEDULE_TYPES.forEach((t) => view.types.add(t.key));
    LEADERS.forEach((p) => view.people.add(p));
    rerender();
  });

  container.querySelector('#sched-prev').addEventListener('click', () => { view.month = shiftMonth(view.month, -1); rerender(); });
  container.querySelector('#sched-next').addEventListener('click', () => { view.month = shiftMonth(view.month, 1); rerender(); });
  container.querySelector('#sched-today').addEventListener('click', () => { view.month = todayISO().slice(0, 7); rerender(); });

  container.querySelector('#sched-add').addEventListener('click', () => openPanel(container, entries, null, todayISO()));
  container.querySelectorAll('.sched-day').forEach((cell) => {
    cell.addEventListener('click', (ev) => {
      if (ev.target.closest('.sched-pill')) return;
      openPanel(container, entries, null, cell.dataset.day);
    });
  });
  container.querySelectorAll('[data-entry]').forEach((pill) => {
    pill.addEventListener('click', () => openPanel(container, entries, entries.find((e) => e.id === pill.dataset.entry)));
  });
}

// Side panel for adding or editing one entry.
function openPanel(container, entries, entry, day) {
  closePanel();
  const e = entry || { person: LEADERS[0], type: SCHEDULE_TYPES[0].key, title: '', start: day, end: day, time: '', notes: '' };

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sched-overlay';
  const panel = document.createElement('div');
  panel.className = 'task-sidebar';
  panel.id = 'sched-panel';
  panel.innerHTML = `
    <div class="ts-header">
      <strong>${entry ? 'Edit entry' : 'New entry'}</strong>
      <button class="btn btn-ghost" id="sp-close" aria-label="Close">✕</button>
    </div>
    <div class="ts-body">
      <div class="ts-field"><div class="ts-field-label">Who</div>
        <select id="sp-person">${LEADERS.map((p) => `<option ${p === e.person ? 'selected' : ''}>${escapeHtml(p)}</option>`).join('')}</select>
      </div>
      <div class="ts-field"><div class="ts-field-label">Type</div>
        <select id="sp-type">${SCHEDULE_TYPES.map((t) => `<option value="${t.key}" ${t.key === e.type ? 'selected' : ''}>${escapeHtml(t.label)}</option>`).join('')}</select>
      </div>
      <div class="ts-field"><div class="ts-field-label">Title</div>
        <input type="text" id="sp-title" value="${escapeHtml(e.title)}" placeholder="e.g. Customer QBR" />
      </div>
      <div class="ts-field"><div class="ts-field-label">Dates</div>
        <div class="ts-inline">
          <input type="date" id="sp-start" value="${e.start}" />
          <span style="color:var(--text-dim);">to</span>
          <input type="date" id="sp-end" value="${e.end || e.start}" />
        </div>
      </div>
      <div class="ts-field"><div class="ts-field-label">Time (optional)</div>
        <input type="time" id="sp-time" value="${e.time || ''}" class="sched-time" />
      </div>
      <div class="ts-field"><div class="ts-field-label">Notes</div>
        <textarea id="sp-notes">${escapeHtml(e.notes || '')}</textarea>
      </div>
      <div class="sched-panel-actions">
        <button class="btn btn-primary" id="sp-save">Save</button>
        <button class="btn btn-ghost" id="sp-cancel">Cancel</button>
        ${entry ? '<button class="btn btn-ghost btn-danger" id="sp-delete" style="margin-left:auto;">Delete</button>' : ''}
      </div>
    </div>
  `;
  document.body.append(overlay, panel);
  panel.querySelector('#sp-title').focus();

  const done = () => { closePanel(); renderLeadershipSchedule(container); };
  overlay.addEventListener('click', closePanel);
  panel.querySelector('#sp-close').addEventListener('click', closePanel);
  panel.querySelector('#sp-cancel').addEventListener('click', closePanel);

  panel.querySelector('#sp-save').addEventListener('click', () => {
    const start = panel.querySelector('#sp-start').value;
    if (!start) { panel.querySelector('#sp-start').focus(); return; }
    let end = panel.querySelector('#sp-end').value || start;
    if (end < start) end = start;
    const values = {
      person: panel.querySelector('#sp-person').value,
      type: panel.querySelector('#sp-type').value,
      title: panel.querySelector('#sp-title').value.trim(),
      start, end,
      time: panel.querySelector('#sp-time').value,
      notes: panel.querySelector('#sp-notes').value,
    };
    if (entry) Object.assign(entry, values);
    else entries.push({ id: uid('sched'), ...values });
    view.month = start.slice(0, 7);
    commit();
    done();
  });

  panel.querySelector('#sp-delete')?.addEventListener('click', () => {
    if (!confirm('Delete this entry?')) return;
    entries.splice(entries.indexOf(entry), 1);
    commit();
    done();
  });
}

function closePanel() {
  document.getElementById('sched-overlay')?.remove();
  document.getElementById('sched-panel')?.remove();
}

window.addEventListener('hashchange', closePanel);
