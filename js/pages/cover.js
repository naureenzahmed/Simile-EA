import { getData, commit } from '../store.js';
import { isReadOnly } from '../readOnly.js';
import { escapeHtml } from '../utils.js';
import { BOARD_SECTIONS } from '../seed.js';

const ABOUT_PARTS = [
  { key: 'background', label: 'Background', placeholder: 'Where I come from and what I have worked on.' },
  { key: 'experience', label: 'Relevant Experience', placeholder: 'Roles and projects that apply to this job.' },
  { key: 'goals', label: 'What I Want to Get Out of This', placeholder: 'What I hope to learn and achieve.' },
];

export function renderCover(container) {
  const data = getData();
  data.home = data.home || { background: '', experience: '', goals: '', why: '', cardNotes: {} };
  data.home.cardNotes = data.home.cardNotes || {};
  const home = data.home;
  const pages = buildManifest(data);

  container.innerHTML = `
    <div class="ro-note ${isReadOnly() ? '' : 'editing'}" role="note">
      ${isReadOnly()
        ? '<strong>This is a read-only file.</strong> You can browse every page, but nothing can be changed. Click <b>Edit</b> at the top right to make changes.'
        : '<strong>You are editing.</strong> Changes save in this browser only. Click <b>Done editing</b> at the top right to go back to read-only.'}
    </div>
    <div class="page-title">Simile EA</div>

    <div class="card doc-card home-about" id="home-about">
      <h4 style="margin:0 0 4px;">About Naureen</h4>
      <div class="home-about-grid">
        ${ABOUT_PARTS.map((p) => `
          <div class="home-about-part">
            <div class="home-sub-title">${p.label}</div>
            <textarea class="notes-box" data-home="${p.key}" placeholder="${p.placeholder}">${escapeHtml(home[p.key] || '')}</textarea>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card doc-card home-about" id="home-why">
      <h4 style="margin:0 0 4px;">Why I Built This</h4>
      <textarea class="notes-box" data-home="why" placeholder="What this site is for and why I made it.">${escapeHtml(home.why || '')}</textarea>
    </div>

    <div class="section-desc" style="margin: 24px 0 12px;">Jump to any page or section below.</div>
    <div class="cover-grid">
      ${pages.map((p) => `
        <div class="card cover-card">
          <a class="cover-page-title" href="#/${p.key}">${escapeHtml(p.label)}</a>
          <textarea class="notes-box cover-notes" data-card-note="${p.key}" rows="2" placeholder="Notes">${escapeHtml(home.cardNotes[p.key] || '')}</textarea>
          ${p.subsections.length ? `
            <ul class="cover-sublist">
              ${p.subsections.map((s) => `<li><a href="#/${p.key}?anchor=${encodeURIComponent(s.id)}">${escapeHtml(s.label)}</a></li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;

  // Everything saves as you type.
  container.querySelectorAll('[data-home]').forEach((el) => {
    el.addEventListener('input', () => { home[el.dataset.home] = el.value; commit(); });
  });
  container.querySelectorAll('[data-card-note]').forEach((el) => {
    el.addEventListener('input', () => { home.cardNotes[el.dataset.cardNote] = el.value; commit(); });
  });
}

function buildManifest(data) {
  return [
    {
      key: 'roadmap', label: 'GTM Roadmap',
      subsections: [
        { id: 'roadmap-timeline-section', label: 'Timeline / List / Board' },
        { id: 'roadmap-clients', label: 'Client Materials' },
        { id: 'roadmap-okr-section', label: 'OKRs' },
        { id: 'roadmap-calendar-section', label: 'Calendar' },
        { id: 'roadmap-tracked-goals', label: 'Tracked Goals' },
      ],
    },
    {
      key: 'pipeline', label: 'Pipeline & Forecasts',
      subsections: [
        { id: 'pipeline-revenue', label: 'Revenue' },
        { id: 'target-accounts', label: 'Target Accounts' },
        { id: 'lead-lists', label: 'Lead Lists' },
      ],
    },
    {
      key: 'schedule', label: 'Schedule Management',
      subsections: [
        { id: 'schedule-leadership', label: 'Leadership Schedule Management' },
        { id: 'schedule-team', label: 'Team Management' },
        { id: 'ops-milestones', label: 'Key Milestones' },
        { id: 'ops-availability', label: 'Availability' },
        { id: 'ops-teams', label: 'Team Composition' },
      ],
    },
    {
      key: 'coo', label: 'COO Scheduling',
      subsections: [
        { id: 'coo-calendar', label: 'Calendar' },
        { id: 'coo-inbox', label: 'Inbox' },
        { id: 'coo-inquiries', label: 'Inquiries' },
        { id: 'coo-sprint', label: 'Current Sprint' },
        { id: 'coo-past', label: 'Past Sprints' },
      ],
    },
    {
      key: 'boardInvestor', label: 'Board & Investor Support',
      subsections: BOARD_SECTIONS.map((s) => ({ id: s.id, label: s.title })),
    },
    {
      key: 'events', label: 'Events & Offsites',
      subsections: [{ id: 'events-contents', label: 'Table of Contents' }, ...data.events.map((e) => ({ id: e.id, label: e.name || 'Untitled event' }))],
    },
    {
      key: 'documentation', label: 'Documentation',
      subsections: data.docs.map((s) => ({ id: s.id, label: s.title })),
    },
    {
      key: 'recruitment', label: 'Special Project: Talent Pipeline',
      subsections: data.recruitment.filter((s) => !s.isIntro).map((s) => ({ id: s.id, label: s.title })),
    },
  ];
}
