import { getData, commit, findTeam } from '../store.js';
import { BANDWIDTH } from '../seed.js';
import { isReadOnly } from '../readOnly.js';
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
      <div class="section-desc">Who has room for more work. Hover over initials to see the name. In edit mode, click someone to move them to the next group.</div>
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
        <div style="color: var(--text-dim);">${escapeHtml(team?.name || 'Leadership')}</div>
        <div class="milestone-rel">${relativeDay(date)}</div>
      </div>
    `;
  }).join('') || '<div class="empty-hint">No milestones this week.</div>';
}

const LEADERSHIP = { name: 'Leadership', color: '#8f9bb3' };
const teamOf = (p) => findTeam(p.teamId) || LEADERSHIP;

// Availability: everyone as initials, grouped by bandwidth.
function renderAvailability(data) {
  const people = data.people;
  const by = (key) => people.filter((p) => (p.bandwidth || 'open') === key);
  const open = by('open').length;
  const pct = people.length ? Math.round((open / people.length) * 100) : 0;

  document.getElementById('availability-summary').innerHTML = `
    <div class="avail-bar-row">
      <div class="avail-big">${pct}%</div>
      <div style="color: var(--text-dim); font-size:12px;">of the team has bandwidth</div>
      <div style="margin-left:auto; color: var(--text-dim); font-size:12px;">${open} of ${people.length} people</div>
    </div>
    <div class="avail-stack" aria-hidden="true">
      ${BANDWIDTH.map((b) => `<span class="avail-seg bw-${b.key}" style="flex:${by(b.key).length || 0}"></span>`).join('')}
    </div>
  `;

  document.getElementById('people-list').innerHTML = `
    <div class="bw-groups">
      ${BANDWIDTH.map((b) => {
        const group = by(b.key);
        return `
          <div class="bw-group">
            <div class="bw-head"><span class="bw-dot bw-${b.key}"></span>${b.label} <span class="event-phase-count">${group.length}</span></div>
            <div class="bw-people">
              ${group.map((p) => {
                const team = teamOf(p);
                const label = `${p.name}, ${team.name}`;
                return `<button type="button" class="bw-avatar" data-bw-person="${p.id}" style="--c:${team.color}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}: ${b.label}">${initials(p.name)}</button>`;
              }).join('') || '<span class="empty-hint" style="padding:0;">No one.</span>'}
            </div>
          </div>`;
      }).join('')}
    </div>
    <div class="bw-legend">
      ${[...data.teams, LEADERSHIP].map((t) => `<span><span class="team-dot" style="background:${t.color}"></span>${escapeHtml(t.name)}</span>`).join('')}
    </div>
  `;
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
    (unassigned.length ? card('Leadership', LEADERSHIP.color, unassigned) : '')
    + data.teams.map((t) => card(t.name, t.color, data.people.filter((p) => p.teamId === t.id))).join('');
}

// In edit mode, clicking someone moves them to the next bandwidth group.
function wirePeople(container) {
  container.querySelectorAll('[data-bw-person]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isReadOnly()) return;
      const person = getData().people.find((p) => p.id === btn.dataset.bwPerson);
      const keys = BANDWIDTH.map((b) => b.key);
      person.bandwidth = keys[(keys.indexOf(person.bandwidth || 'open') + 1) % keys.length];
      commit();
      renderTeamManagement(container);
    });
  });
}
