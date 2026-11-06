import { getData, commit, findTeam } from '../store.js';
import { uid, todayISO, fmtDate, relativeDay, initials, escapeHtml, addDays, weekDue, milestoneDate } from '../utils.js';

export function renderTeamManagement(container) {
  const data = getData();

  container.innerHTML = `
    <h2 class="schedule-part-title" style="margin-bottom:16px;">Team Management</h2>

    <div id="ops-milestones">
      <div class="section-label">Key Milestones This Week</div>
      <div class="section-desc">One milestone per department, all due ${longDay(weekDue())}.</div>
      <div class="card" style="margin-bottom:24px;">
        <div id="milestones-list"></div>
        <button class="btn btn-ghost" id="add-milestone-btn" style="margin-top:8px; padding:4px 8px;">+ Add milestone</button>
      </div>
    </div>

    <div id="ops-availability">
      <div class="section-label">Availability</div>
      <div class="section-desc">Who is free right now, based on the roadmap objectives they own. Set each person's department here.</div>
      <div class="card" style="margin-bottom:24px;">
        <div id="availability-summary"></div>
        <div id="people-list"></div>
      </div>
    </div>

    <div id="ops-teams">
      <div class="section-label">Team Composition</div>
      <div class="section-desc">Who is in each department.</div>
      <div class="grid-3" id="team-grid"></div>
    </div>
  `;

  renderMilestones(data);
  renderAvailability(data);
  renderTeams(data);
  wirePeople(container);

  document.getElementById('add-milestone-btn').addEventListener('click', () => {
    const title = prompt('Milestone title', 'New milestone');
    if (!title) return;
    const names = data.teams.map((t) => t.name).join(', ');
    const deptName = prompt(`Department (${names})`, data.teams[0]?.name || '');
    if (deptName === null) return;
    const team = data.teams.find((t) => t.name.toLowerCase() === deptName.trim().toLowerCase());
    data.milestones.push({ id: uid('ms'), title, teamId: team?.id || null, weekly: true });
    commit();
    renderTeamManagement(container);
  });
}

function longDay(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

// This week's milestones in department order. Dated one-offs show too if they fall in this week.
function renderMilestones(data) {
  const due = weekDue();
  const monday = addDays(due, -4);
  const sunday = addDays(due, 2);
  const order = (m) => { const i = data.teams.findIndex((t) => t.id === m.teamId); return i === -1 ? 99 : i; };
  const thisWeek = data.milestones
    .filter((m) => { const d = milestoneDate(m); return d && d >= monday && d <= sunday; })
    .sort((a, b) => order(a) - order(b) || milestoneDate(a).localeCompare(milestoneDate(b)));
  const el = document.getElementById('milestones-list');
  el.innerHTML = thisWeek.map((m) => {
    const team = findTeam(m.teamId);
    const date = milestoneDate(m);
    return `
      <div class="milestone-row">
        <div class="milestone-date">${fmtDate(date)}</div>
        <div><span class="team-dot" style="background:${team?.color || '#666'}; display:inline-block; margin-right:8px;"></span>${escapeHtml(m.title)}</div>
        <div style="color: var(--text-dim);">${escapeHtml(team?.name || 'No department')}</div>
        <div class="milestone-rel">${relativeDay(date)}</div>
      </div>
    `;
  }).join('') || '<div class="empty-hint">No milestones this week.</div>';
}

function busyPersonIds(data) {
  const today = todayISO();
  const busy = new Set();
  data.tasks.forEach((t) => {
    if (t.assigneeId && t.status !== 'Done' && t.startDate <= today && today <= t.endDate) {
      busy.add(t.assigneeId);
    }
  });
  return busy;
}

function renderAvailability(data) {
  const busy = busyPersonIds(data);
  const total = data.people.length;
  const freeCount = total - busy.size;
  const pct = total ? Math.round((freeCount / total) * 100) : 0;

  document.getElementById('availability-summary').innerHTML = `
    <div class="avail-bar-row">
      <div class="avail-big">${pct}%</div>
      <div style="color: var(--text-dim); font-size:12px;">of the team free right now</div>
      <div style="margin-left:auto; color: var(--text-dim); font-size:12px;">${freeCount} of ${total} available</div>
    </div>
    <div class="progress-track" style="margin-bottom:10px;">
      <div class="progress-fill green" style="width:${pct}%;"></div>
    </div>
    <div class="avail-legend">
      <span><span class="legend-dot" style="background:var(--green);"></span>${freeCount} free</span>
      <span><span class="legend-dot" style="background:var(--accent);"></span>${busy.size} active</span>
    </div>
  `;

  const list = document.getElementById('people-list');
  list.innerHTML = data.people.map((p) => {
    const isBusy = busy.has(p.id);
    const team = findTeam(p.teamId);
    return `
      <div class="person-row">
        <div class="person-name-cell">
          <span class="avatar" style="background:${team?.color || '#b8b6b2'};">${initials(p.name)}</span>
          <div>${escapeHtml(p.name)}${p.role ? `<span class="role">${escapeHtml(p.role)}</span>` : ''}</div>
        </div>
        <div><select class="cell-input person-dept" data-person-dept="${p.id}" aria-label="Department for ${escapeHtml(p.name)}">
          <option value="">No department</option>
          ${data.teams.map((t) => `<option value="${t.id}" ${t.id === p.teamId ? 'selected' : ''}>${escapeHtml(t.name)}</option>`).join('')}
        </select></div>
        <div>${isBusy ? 'Working on an objective' : 'Open to work'}</div>
        <div><span class="status-badge ${isBusy ? 'progress' : 'done'}">${isBusy ? 'Active' : 'Free'}</span></div>
      </div>
    `;
  }).join('');
}

function renderTeams(data) {
  const unassigned = data.people.filter((p) => !p.teamId || !findTeam(p.teamId));
  const card = (name, color, members) => `
    <div class="card team-card">
      <h4><span class="team-dot" style="background:${color}; display:inline-block; margin-right:6px;"></span>${escapeHtml(name)}${members.length ? ` <span class="event-phase-count">${members.length}</span>` : ''}</h4>
      ${members.map((p) => `
        <div class="team-member">
          <span class="avatar" style="background:${color};">${initials(p.name)}</span>
          ${escapeHtml(p.name)}${p.role ? ` <span class="role">${escapeHtml(p.role)}</span>` : ''}
        </div>
      `).join('') || '<div class="empty-hint">No one yet.</div>'}
    </div>
  `;
  document.getElementById('team-grid').innerHTML =
    data.teams.map((t) => card(t.name, t.color, data.people.filter((p) => p.teamId === t.id))).join('')
    + (unassigned.length ? card('No department yet', '#b8b6b2', unassigned) : '');
}

function wirePeople(container) {
  container.querySelectorAll('[data-person-dept]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const person = getData().people.find((p) => p.id === sel.dataset.personDept);
      person.teamId = sel.value || null;
      commit();
      renderTeamManagement(container);
    });
  });
}
