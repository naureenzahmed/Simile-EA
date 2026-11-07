import { getData } from '../store.js';
import { todayISO, escapeHtml, dayLabel, milestoneDate } from '../utils.js';
import { openTaskSidebar } from '../taskSidebar.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Same look as the Schedule Management and Office of COO calendars.
const KINDS = {
  task: { label: 'Objective due', color: 'var(--accent)' },
  kr: { label: 'Key result deadline', color: '#7fb8e6' },
  milestone: { label: 'Milestone', color: '#e0a95a' },
};

let monthOffset = 0;

export function renderDeadlineCalendar(container, onChange) {
  const dueMap = groupByDate(collectItems(getData()));
  const now = new Date();
  const current = addMonths(now.getFullYear(), now.getMonth(), monthOffset);
  const today = todayISO();

  container.innerHTML = `
    <div class="card sched-card">
      <div class="toolbar sched-nav">
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn" id="cal-prev" aria-label="Previous month">‹</button>
          <button class="btn" id="cal-today">Today</button>
          <button class="btn" id="cal-next" aria-label="Next month">›</button>
          <h4 style="margin:0 0 0 8px;">${monthLabel(current)}</h4>
        </div>
        <div class="sched-legend">
          ${Object.values(KINDS).map((k) => `<span><span class="sched-swatch" style="background:${k.color}"></span>${k.label}</span>`).join('')}
        </div>
      </div>
      ${Object.keys(dueMap).some((d) => d.slice(0, 7) === isoMonth(current)) ? '' : '<div class="sched-list-empty">Nothing due this month.</div>'}
      <div class="sched-grid">
        ${WEEKDAYS.map((d) => `<div class="sched-weekday">${d}</div>`).join('')}
        ${gridDays(current).map((day) => `
          <div class="sched-day cal-static ${day.slice(0, 7) !== isoMonth(current) ? 'other-month' : ''} ${day === today ? 'today' : ''} ${(dueMap[day] || []).length ? 'has-items' : ''}" data-label="${dayLabel(day)}">
            <div class="sched-date">${Number(day.slice(8))}</div>
            ${(dueMap[day] || []).map((it) => it.type === 'task'
              ? `<button class="sched-pill" style="--c:${KINDS.task.color}" data-cal-objective="${it.id}" title="${escapeHtml(`${KINDS.task.label}: ${it.title}. Click to open.`)}">${escapeHtml(it.title)}</button>`
              : `<span class="sched-pill" style="--c:${KINDS[it.type].color}" title="${escapeHtml(`${KINDS[it.type].label}: ${it.title}`)}">${escapeHtml(it.title)}</span>`).join('')}
          </div>`).join('')}
      </div>
    </div>
  `;

  const go = (n) => { monthOffset = n; renderDeadlineCalendar(container, onChange); };
  container.querySelectorAll('[data-cal-objective]').forEach((b) => {
    b.addEventListener('click', () => openTaskSidebar(b.dataset.calObjective, onChange || (() => renderDeadlineCalendar(container))));
  });
  container.querySelector('#cal-prev').addEventListener('click', () => go(monthOffset - 1));
  container.querySelector('#cal-next').addEventListener('click', () => go(monthOffset + 1));
  container.querySelector('#cal-today').addEventListener('click', () => go(0));
}

function isoMonth({ year, month }) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

// Six weeks of dates, Sunday first, covering the month.
function gridDays({ year, month }) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
}

function collectItems(data) {
  const items = [];
  data.tasks.forEach((t) => {
    if (t.endDate) items.push({ id: t.id, date: t.endDate, title: t.title, type: 'task', teamId: t.teamId || null, assigneeIds: t.assigneeId ? [t.assigneeId] : [] });
  });
  data.okrs.forEach((okr) => {
    okr.keyResults.forEach((kr) => {
      if (kr.deadline) items.push({ date: kr.deadline, title: kr.title, type: 'kr', teamId: okr.teamId || null, assigneeIds: kr.assigneeIds || [] });
    });
  });
  data.milestones.forEach((m) => {
    const date = milestoneDate(m);
    if (date) items.push({ date, title: m.title, type: 'milestone', teamId: m.teamId || null, assigneeIds: [] });
  });
  return items;
}

function groupByDate(items) {
  const map = {};
  items.forEach((it) => { (map[it.date] = map[it.date] || []).push(it); });
  return map;
}

function addMonths(year, month, n) {
  const d = new Date(year, month + n, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function monthLabel({ year, month }) {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
