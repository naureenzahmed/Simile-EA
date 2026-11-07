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
      <div class="section-desc">Who has room for more work. Click anyone to see their name, department and what they're working on.</div>
      <div class="card" style="margin-bottom:24px;">
        <div class="avail-note" role="note">This would be adjusted to the team structure, but would also be cognizant of each individual's situation. It would only be used in the case of special projects, for understanding who is working on what and how to delegate the work.</div>
        <div id="availability-summary"></div>
        <div id="people-list"></div>
      </div>
    </div>

    <div id="ops-teams">
      <div class="section-label">Team Composition</div>
      <div class="section-desc">Who is in each department. Click a name to see what they're working on.</div>
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
                return `<button type="button" class="bw-avatar" data-person="${p.id}" style="--c:${team.color}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}: ${b.label}">${initials(p.name)}</button>`;
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
        <button type="button" class="team-member team-member-btn" data-person="${p.id}" title="See what ${escapeHtml(p.name)} is working on">
          <span class="avatar" style="background:${color};">${initials(p.name)}</span>
          ${escapeHtml(p.name)}${p.role ? ` <span class="role">${escapeHtml(p.role)}</span>` : ''}
        </button>
      `).join('') || '<div class="empty-hint">No one yet.</div>'}
    </div>
  `;
  document.getElementById('team-grid').innerHTML =
    (unassigned.length ? card('Leadership', LEADERSHIP.color, unassigned) : '')
    + data.teams.map((t) => card(t.name, t.color, data.people.filter((p) => p.teamId === t.id))).join('');
}

// Clicking anyone in Availability or Team Composition opens their details.
function wirePeople(container) {
  container.querySelectorAll('[data-person]').forEach((btn) => {
    btn.addEventListener('click', () => openPersonPanel(container, btn.dataset.person));
  });
}

const fmtDue = (iso) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');

// Everything on the site that names this person as owner.
function linkedWork(data, p) {
  const same = (v) => (v || '').trim().toLowerCase() === p.name.toLowerCase();
  const out = [];
  for (const t of data.tasks || []) {
    if (t.assigneeId === p.id && t.status !== 'Done') out.push({ text: t.title, meta: `GTM Roadmap objective · ${t.status}${t.endDate ? ` · due ${fmtDue(t.endDate)}` : ''}` });
  }
  for (const q of data.coo?.inquiries || []) {
    if (same(q.owner) && q.stage !== 'solved') out.push({ text: q.title, meta: `COO inquiry${q.deadline ? ` · due ${fmtDue(q.deadline)}` : ''}` });
  }
  for (const e of data.events || []) {
    for (const items of Object.values(e.checklist || {})) {
      for (const i of items) if (same(i.owner) && !i.done) out.push({ text: i.text, meta: e.name });
    }
  }
  for (const m of data.milestones || []) {
    if (p.teamId && m.teamId === p.teamId) out.push({ text: m.title, meta: `Team milestone · due ${fmtDue(milestoneDate(m))}` });
  }
  return out;
}

function openPersonPanel(container, personId) {
  closePersonPanel();
  const data = getData();
  const p = data.people.find((x) => x.id === personId);
  if (!p) return;
  p.focus = p.focus || [];
  const team = teamOf(p);
  const bw = BANDWIDTH.find((b) => b.key === (p.bandwidth || 'open'));
  const editing = !isReadOnly();
  const linked = linkedWork(data, p);

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'person-overlay';
  const panel = document.createElement('div');
  panel.className = 'task-sidebar person-panel';
  panel.id = 'person-panel';
  panel.innerHTML = `
    <div class="ts-header">
      <strong>Team member</strong>
      <button class="btn btn-ghost" id="person-close" aria-label="Close">✕</button>
    </div>
    <div class="ts-body">
      <div class="person-hero">
        <span class="person-hero-avatar" style="background:${team.color}">${initials(p.name)}</span>
        <div>
          <div class="person-hero-name">${escapeHtml(p.name)}</div>
          <div class="person-hero-dept"><span class="team-dot" style="background:${team.color}"></span>${escapeHtml(team.name)}</div>
        </div>
      </div>
      <div class="ts-field">
        <div class="ts-field-label">Bandwidth</div>
        ${editing
          ? `<select id="person-bw">${BANDWIDTH.map((b) => `<option value="${b.key}" ${b.key === bw.key ? 'selected' : ''}>${b.label}</option>`).join('')}</select>`
          : `<span class="person-bw-pill"><span class="bw-dot bw-${bw.key}"></span>${bw.label}</span>`}
      </div>
      <div class="ts-field">
        <div class="ts-field-label">Working on</div>
        <ul class="person-list">
          ${p.focus.map((f, i) => `<li><span>${escapeHtml(f)}</span>${editing ? `<button class="btn btn-ghost" data-focus-remove="${i}" style="padding:2px 6px;" title="Remove">✕</button>` : ''}</li>`).join('') || '<li class="empty-hint" style="padding:0;">Nothing listed.</li>'}
        </ul>
        ${editing ? '<input type="text" id="person-focus-add" placeholder="+ Add a task (press Enter)" style="margin-top:6px;" />' : ''}
      </div>
      <div class="ts-field" style="border-bottom:none;">
        <div class="ts-field-label">Owner elsewhere on the site</div>
        <ul class="person-list person-linked">
          ${linked.map((l) => `<li><span>${escapeHtml(l.text)}</span><span class="person-linked-meta">${escapeHtml(l.meta)}</span></li>`).join('') || '<li class="empty-hint" style="padding:0;">Not the owner of anything yet.</li>'}
        </ul>
      </div>
    </div>`;
  document.body.append(overlay, panel);

  const reopen = () => { renderTeamManagement(container); openPersonPanel(container, personId); };
  overlay.addEventListener('click', closePersonPanel);
  panel.querySelector('#person-close').addEventListener('click', closePersonPanel);
  panel.querySelector('#person-close').focus();
  const onKey = (e) => { if (e.key === 'Escape') closePersonPanel(); };
  document.addEventListener('keydown', onKey, { once: true });

  panel.querySelector('#person-bw')?.addEventListener('change', (e) => { p.bandwidth = e.target.value; commit(); reopen(); });
  panel.querySelectorAll('[data-focus-remove]').forEach((b) => b.addEventListener('click', () => {
    p.focus.splice(Number(b.dataset.focusRemove), 1);
    commit();
    reopen();
  }));
  panel.querySelector('#person-focus-add')?.addEventListener('keydown', (e) => {
    const v = e.target.value.trim();
    if (e.key !== 'Enter' || !v) return;
    p.focus.push(v);
    commit();
    reopen();
    document.getElementById('person-focus-add')?.focus();
  });
}

function closePersonPanel() {
  document.getElementById('person-overlay')?.remove();
  document.getElementById('person-panel')?.remove();
}
