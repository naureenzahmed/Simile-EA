import { getData } from '../store.js';
import { escapeHtml } from '../utils.js';

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
      key: 'documentation', label: 'Documentation',
      subsections: data.docs.map((s) => ({ id: s.id, label: s.title })),
    },
    {
      key: 'roadmap', label: 'Roadmap',
      subsections: [
        { id: 'roadmap-timeline-section', label: 'Timeline / List / Board' },
        { id: 'roadmap-okr-section', label: 'OKRs' },
        { id: 'roadmap-calendar-section', label: 'Calendar' },
        { id: 'roadmap-tracked-goals', label: 'Tracked Goals' },
      ],
    },
    {
      key: 'territoryManagement', label: 'Territory Management',
      subsections: [],
    },
    {
      key: 'inboundLeads', label: 'Leads Management',
      subsections: [],
    },
    {
      key: 'paidConversions', label: 'Outbound',
      subsections: [],
    },
    {
      key: 'gtmExperiments', label: 'GTM Experiments',
      subsections: [],
    },
  ];
}
