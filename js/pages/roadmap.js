import { getData, commit, findTeam } from '../store.js';
import { uid, todayISO, addDays, daysBetween, fmtDate, escapeHtml, initials } from '../utils.js';
import { openTaskSidebar } from '../taskSidebar.js';
import { mondaysBetween, meetingFor, openWeeklyMeeting } from '../weeklyMeetings.js';
import { renderOkrSection } from './okr.js';
import { renderDeadlineCalendar } from './deadlineCalendar.js';
import { renderTrackedGoals } from './metrics.js';
import { renderClientMaterials } from './clientMaterials.js';
import { notesBoxHtml } from '../notesBox.js';
import { getSlackWebhookUrl, setSlackWebhookUrl } from '../slackNotify.js';

const DAY_PX = 18;
const DAYS_BEFORE = 21;
const DAYS_AFTER = 63;
const STATUS_ORDER = ['No status', 'Backlog', 'Ready', 'In progress', 'In design', 'Committed', 'Done'];

let currentView = 'timeline';
let mountedContainer = null;

export function renderRoadmap(container) {
  mountedContainer = container;
  const data = getData();

  container.innerHTML = `
    ${notesBoxHtml('roadmap')}
    <div class="goal-banner" id="roadmap-timeline-section">
      <div class="goal-title-row">
        <div>
          <div class="section-label">GTM Roadmap</div>
          <div class="goal-big">GTM Roadmap</div>
        </div>
      </div>
      <div class="goal-days">
        <b>${Math.max(daysBetween(todayISO(), data.companyGoal.targetDate), 0)}</b>
        days to target
      </div>
    </div>

    <div class="toolbar">
      <div class="view-tabs" id="view-tabs">
        ${['timeline', 'list', 'board'].map((v) => `<button class="view-tab ${v === currentView ? 'active' : ''}" data-view="${v}">${cap(v)}</button>`).join('')}
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-ghost" id="slack-settings-btn">Slack</button>
        <button class="btn btn-primary" id="add-task-btn">+ Add objective</button>
      </div>
    </div>
    <div class="inline-add-form" id="slack-settings-form" style="display:none;">
      <input type="text" id="slack-webhook-input" placeholder="Slack incoming webhook URL" value="${escapeHtml(getSlackWebhookUrl())}" style="max-width:420px;" />
      <button class="btn btn-primary" id="slack-webhook-save">Save</button>
      <button class="btn btn-ghost" id="slack-settings-cancel">Cancel</button>
    </div>

    <div id="roadmap-view"></div>

    <div style="margin-top: 40px;" id="roadmap-clients">
      <div class="page-title" style="margin-bottom: 12px;">Client Materials</div>
      <div id="roadmap-clients-section"></div>
    </div>

    <div id="roadmap-okr-section" style="margin-top: 40px;"></div>

    <div style="margin-top: 40px;">
      <div class="page-title" style="margin-bottom: 12px;">Calendar</div>
      <div id="roadmap-calendar-section"></div>
    </div>

    <div style="margin-top: 40px;">
      <div id="roadmap-tracked-goals"></div>
    </div>
  `;

  container.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => { currentView = btn.dataset.view; renderRoadmap(container); });
  });

  document.getElementById('add-task-btn').addEventListener('click', () => {
    addTask(data.initiatives[0]?.id);
  });

  const slackForm = document.getElementById('slack-settings-form');
  const slackInput = document.getElementById('slack-webhook-input');
  document.getElementById('slack-settings-btn').addEventListener('click', () => {
    slackForm.style.display = slackForm.style.display === 'none' ? 'flex' : 'none';
    if (slackForm.style.display === 'flex') slackInput.focus();
  });
  document.getElementById('slack-settings-cancel').addEventListener('click', () => {
    slackForm.style.display = 'none';
  });
  document.getElementById('slack-webhook-save').addEventListener('click', () => {
    setSlackWebhookUrl(slackInput.value);
    slackForm.style.display = 'none';
  });

  const view = document.getElementById('roadmap-view');
  if (currentView === 'timeline') renderTimeline(view, data);
  else if (currentView === 'list') renderList(view, data);
  else renderBoard(view, data);

  renderOkrSection(document.getElementById('roadmap-okr-section'));
  renderDeadlineCalendar(document.getElementById('roadmap-calendar-section'), () => renderRoadmap(mountedContainer));
  renderTrackedGoals(document.getElementById('roadmap-tracked-goals'));
  renderClientMaterials(document.getElementById('roadmap-clients-section'));
}

function cap(s) { return s[0].toUpperCase() + s.slice(1); }

function addTask(sectionId) {
  const data = getData();
  const task = {
    id: uid('task'),
    title: 'New objective',
    description: '',
    impact: '',
    status: 'No status',
    assigneeId: null,
    startDate: todayISO(),
    endDate: addDays(todayISO(), 3),
    designDeadline: '',
    sectionId: sectionId || data.initiatives[0]?.id || null,
    teamId: data.initiatives.find((i) => i.id === sectionId)?.teamId || data.teams[0]?.id,
    client: '',
    createdBy: 'You',
    blockedBy: [],
    subtasks: [],
    comments: [],
  };
  data.tasks.push(task);
  commit();
  renderRoadmap(mountedContainer);
  openTaskSidebar(task.id, () => renderRoadmap(mountedContainer));
}

/* ---------------- Timeline view ---------------- */

function renderTimeline(view, data) {
  const timelineStart = addDays(todayISO(), -DAYS_BEFORE);
  const totalDays = DAYS_BEFORE + DAYS_AFTER;
  const laneWidth = totalDays * DAY_PX;
  const weekPx = 7 * DAY_PX;
  const todayLeft = DAYS_BEFORE * DAY_PX;

  const weeks = [];
  for (let d = 0; d < totalDays; d += 7) {
    weeks.push({ left: d * DAY_PX, label: fmtDate(addDays(timelineStart, d)) });
  }

  view.innerHTML = `
    <div class="timeline-scroll">
      <div class="tl-row tl-header-row">
        <div class="tl-label"></div>
        <div class="tl-lane" style="width:${laneWidth}px; --week-px:${weekPx}px;">
          ${weeks.map((w) => `<div class="tl-week-label" style="left:${w.left + 6}px;">${w.label}</div>`).join('')}
          <div class="tl-today-line" style="left:${todayLeft}px;"><span class="tl-today-flag">Today</span></div>
        </div>
      </div>
      ${renderMeetingsRow(timelineStart, totalDays, laneWidth, weekPx, todayLeft)}
      ${data.initiatives.map((init) => renderInitiativeRow(init, data, timelineStart, laneWidth, weekPx, todayLeft)).join('')}
    </div>
  `;

  view.querySelectorAll('[data-meeting-week]').forEach((el) => {
    el.addEventListener('click', () => openWeeklyMeeting(el.dataset.meetingWeek, () => renderRoadmap(mountedContainer)));
  });

  view.querySelectorAll('[data-task-bar]').forEach((el) => {
    el.addEventListener('click', () => openTaskSidebar(el.dataset.taskBar, () => renderRoadmap(mountedContainer)));
  });
  view.querySelectorAll('[data-add-to-section]').forEach((el) => {
    el.addEventListener('click', () => addTask(el.dataset.addToSection));
  });
}

// One weekly agenda and meeting per week, on the Monday.
function renderMeetingsRow(timelineStart, totalDays, laneWidth, weekPx, todayLeft) {
  const weeks = mondaysBetween(timelineStart, addDays(timelineStart, totalDays - 1));
  return `
    <div class="tl-row tl-meetings-row">
      <div class="tl-label">
        <div class="tl-init-name"><span class="team-dot" style="background:var(--text);"></span>Weekly Agenda &amp; Meeting</div>
        <div class="tl-init-sub">Each Monday. Click a week to open it.</div>
      </div>
      <div class="tl-lane" style="width:${laneWidth}px; --week-px:${weekPx}px;">
        <div class="tl-today-line" style="left:${todayLeft}px;"></div>
        ${weeks.map((w) => {
          const m = meetingFor(w);
          const filled = m && (m.notes?.trim() || m.docUrl);
          return `<button class="tl-meeting ${filled ? 'filled' : ''}" data-meeting-week="${w}" style="left:${daysBetween(timelineStart, w) * DAY_PX}px; width:${5 * DAY_PX - 4}px;" title="Weekly meeting, week of ${fmtDate(w)}">${filled ? '✓ ' : ''}${fmtDate(w)}</button>`;
        }).join('')}
      </div>
    </div>
  `;
}

function taskHasConflict(task, allTasks) {
  const startsBeforeBlockerFinishes = (task.blockedBy || []).some((bid) => {
    const blocker = allTasks.find((t) => t.id === bid);
    return blocker && blocker.endDate > task.startDate;
  });
  const dependentStartsBeforeThisFinishes = allTasks.some((t) => (t.blockedBy || []).includes(task.id) && task.endDate > t.startDate);
  return startsBeforeBlockerFinishes || dependentStartsBeforeThisFinishes;
}

function renderInitiativeRow(init, data, timelineStart, laneWidth, weekPx, todayLeft) {
  const team = findTeam(init.teamId);
  const tasks = data.tasks.filter((t) => t.sectionId === init.id);
  const pct = init.target ? Math.round((init.current / init.target) * 100) : 0;

  const bars = tasks.map((t) => {
    const left = daysBetween(timelineStart, t.startDate) * DAY_PX;
    const width = Math.max((daysBetween(t.startDate, t.endDate) + 1) * DAY_PX, DAY_PX * 3);
    const color = team?.color || 'var(--accent)';
    const conflict = taskHasConflict(t, data.tasks);
    return `
      <div class="tl-bar ${conflict ? 'tl-bar-conflict' : ''}" data-task-bar="${t.id}" style="left:${left}px; width:${width}px; background:${color};" title="${escapeHtml(t.title)}${conflict ? ' (scheduling conflict)' : ''}">
        <span class="status-dot"></span>${escapeHtml(t.title)}${conflict ? ' ⚠' : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="tl-row">
      <div class="tl-label">
        <div class="tl-init-name"><span class="team-dot" style="background:${team?.color || '#666'};"></span>${escapeHtml(init.name)}</div>
        <div class="tl-init-sub">${escapeHtml(init.goalLabel)} · ${init.current}${init.unit} / ${init.target}${init.unit}</div>
        <div class="tl-init-progress progress-track"><div class="progress-fill accent" style="width:${Math.min(pct, 100)}%;"></div></div>
        <button class="tl-add-row" data-add-to-section="${init.id}">+ Add objective</button>
      </div>
      <div class="tl-lane" style="width:${laneWidth}px; --week-px:${weekPx}px;">
        <div class="tl-today-line" style="left:${todayLeft}px;"></div>
        ${bars || ''}
      </div>
    </div>
  `;
}

/* ---------------- List view ---------------- */

function renderList(view, data) {
  if (!data.tasks.length) {
    view.innerHTML = `<div class="card empty-hint">No objectives yet. Click "+ Add objective" to create one.</div>`;
    return;
  }
  view.innerHTML = `
    <table class="list-table">
      <thead><tr><th>Objective</th><th>Initiative</th><th>Owner</th><th>Status</th><th>Dates</th></tr></thead>
      <tbody>
        ${data.tasks.map((t) => {
          const init = data.initiatives.find((i) => i.id === t.sectionId);
          const person = data.people.find((p) => p.id === t.assigneeId);
          return `
            <tr data-row="${t.id}">
              <td>${escapeHtml(t.title)}</td>
              <td>${escapeHtml(init?.name || 'No initiative')}</td>
              <td>${escapeHtml(person?.name || 'No owner')}</td>
              <td>${statusBadge(t.status)}</td>
              <td>${fmtDate(t.startDate)} to ${fmtDate(t.endDate)}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
  view.querySelectorAll('[data-row]').forEach((row) => {
    row.addEventListener('click', () => openTaskSidebar(row.dataset.row, () => renderRoadmap(mountedContainer)));
  });
}

function statusBadge(status) {
  const cls = status === 'Done' ? 'done' : status === 'In progress' ? 'progress' : '';
  return `<span class="status-badge ${cls}">${status}</span>`;
}

/* ---------------- Board view ---------------- */

function renderBoard(view, data) {
  view.innerHTML = `
    <div class="board-cols">
      ${STATUS_ORDER.map((status) => {
        const tasks = data.tasks.filter((t) => t.status === status);
        return `
          <div class="board-col">
            <div class="board-col-title">${status} <span>${tasks.length}</span></div>
            ${tasks.map((t) => {
              const person = data.people.find((p) => p.id === t.assigneeId);
              return `
                <div class="board-card" data-card="${t.id}">
                  ${escapeHtml(t.title)}
                  <div class="board-card-meta">
                    <span style="color: var(--text-faint); font-weight: 500;">${fmtDate(t.endDate)}</span>
                    ${person ? `<span class="avatar" style="background:${teamColorForPerson(data, person)};">${initials(person.name)}</span>` : ''}
                  </div>
                </div>
              `;
            }).join('') || `<div class="empty-hint">No objectives.</div>`}
          </div>
        `;
      }).join('')}
    </div>
  `;
  view.querySelectorAll('[data-card]').forEach((el) => {
    el.addEventListener('click', () => openTaskSidebar(el.dataset.card, () => renderRoadmap(mountedContainer)));
  });
}

function teamColorForPerson(data, person) {
  return findTeam(person.teamId)?.color || '#666';
}
