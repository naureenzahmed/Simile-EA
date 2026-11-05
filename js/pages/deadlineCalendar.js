import { getData } from '../store.js';
import { todayISO, escapeHtml } from '../utils.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_SPAN = 19; // current month + 18 more

let monthOffset = 0;

export function renderDeadlineCalendar(container) {
  const data = getData();
  const allItems = collectItems(data);
  const dueMap = groupByDate(allItems);

  const now = new Date();
  const anchor = { year: now.getFullYear(), month: now.getMonth() };
  const current = addMonths(anchor.year, anchor.month, monthOffset);

  container.innerHTML = `
    <div class="cal-header">
      <button class="btn btn-ghost" id="cal-prev" ${monthOffset <= 0 ? 'disabled' : ''}>‹</button>
      <div style="display:flex; align-items:center; gap:10px;">
        <b style="font-size:15px;">${monthLabel(current)}</b>
        <select id="cal-jump">
          ${Array.from({ length: MONTHS_SPAN }, (_, i) => {
            const m = addMonths(anchor.year, anchor.month, i);
            return `<option value="${i}" ${i === monthOffset ? 'selected' : ''}>${monthLabel(m)}</option>`;
          }).join('')}
        </select>
      </div>
      <button class="btn btn-ghost" id="cal-next" ${monthOffset >= MONTHS_SPAN - 1 ? 'disabled' : ''}>›</button>
    </div>
    <div class="cal-grid">
      ${WEEKDAYS.map((d) => `<div class="cal-day-head">${d}</div>`).join('')}
      ${renderDays(current, dueMap)}
    </div>
    <div class="cal-legend">
      <span><span class="legend-dot" style="background:#2563eb;"></span>Task due</span>
      <span><span class="legend-dot" style="background:#0a0a0a;"></span>Key result deadline</span>
      <span><span class="legend-dot" style="background:#dc2626;"></span>Milestone</span>
    </div>
  `;

  document.getElementById('cal-prev').addEventListener('click', () => {
    if (monthOffset > 0) { monthOffset -= 1; renderDeadlineCalendar(container); }
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    if (monthOffset < MONTHS_SPAN - 1) { monthOffset += 1; renderDeadlineCalendar(container); }
  });
  document.getElementById('cal-jump').addEventListener('change', (e) => {
    monthOffset = Number(e.target.value);
    renderDeadlineCalendar(container);
  });
}

function renderDays(current, dueMap) {
  const { year, month } = current;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayISO();

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += `<div class="cal-cell blank"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const items = dueMap[iso] || [];
    const isToday = iso === today;
    const visible = items.slice(0, 2);
    const extra = items.length - visible.length;
    cells += `
      <div class="cal-cell ${isToday ? 'today' : ''}">
        <div class="cal-daynum">${day}</div>
        ${visible.map((it) => `<span class="cal-chip ${it.type}" title="${escapeHtml(it.title)}">${escapeHtml(it.title)}</span>`).join('')}
        ${extra > 0 ? `<span class="cal-more">+${extra} more</span>` : ''}
      </div>
    `;
  }

  const totalCells = firstDay + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < trailing; i++) cells += `<div class="cal-cell blank"></div>`;

  return cells;
}

function collectItems(data) {
  const items = [];
  data.tasks.forEach((t) => {
    if (t.endDate) items.push({ date: t.endDate, title: t.title, type: 'task', teamId: t.teamId || null, assigneeIds: t.assigneeId ? [t.assigneeId] : [] });
  });
  data.okrs.forEach((okr) => {
    okr.keyResults.forEach((kr) => {
      if (kr.deadline) items.push({ date: kr.deadline, title: kr.title, type: 'kr', teamId: okr.teamId || null, assigneeIds: kr.assigneeIds || [] });
    });
  });
  data.milestones.forEach((m) => {
    if (m.date) items.push({ date: m.date, title: m.title, type: 'milestone', teamId: m.teamId || null, assigneeIds: [] });
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
