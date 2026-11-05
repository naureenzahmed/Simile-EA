import { getData } from '../store.js';
import { escapeHtml } from '../utils.js';
import { BOARD_SECTIONS } from '../seed.js';

export function renderCover(container) {
  const data = getData();
  const pages = buildManifest(data);

  container.innerHTML = `
    <div class="page-title">Simile EA</div>
    <div class="section-desc" style="margin-top:-14px; margin-bottom: 20px;">Jump to any page or section below.</div>
    <div class="cover-grid">
      ${pages.map((p) => `
        <div class="card cover-card">
          <a class="cover-page-title" href="#/${p.key}">${escapeHtml(p.label)}</a>
          ${p.subsections.length ? `
            <ul class="cover-sublist">
              ${p.subsections.map((s) => `<li><a href="#/${p.key}?anchor=${encodeURIComponent(s.id)}">${escapeHtml(s.label)}</a></li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
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
      key: 'boardInvestor', label: 'Board & Investor Support',
      subsections: BOARD_SECTIONS.map((s) => ({ id: s.id, label: s.title })),
    },
    {
      key: 'recruitment', label: 'Recruitment',
      subsections: data.recruitment.filter((s) => !s.isIntro).map((s) => ({ id: s.id, label: s.title })),
    },
    {
      key: 'events', label: 'Events & Offsites',
      subsections: [{ id: 'events-contents', label: 'Table of Contents' }, ...data.events.map((e) => ({ id: e.id, label: e.name || 'Untitled event' }))],
    },
    {
      key: 'documentation', label: 'Documentation',
      subsections: data.docs.map((s) => ({ id: s.id, label: s.title })),
    },
  ];
}
