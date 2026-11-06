import { getData, commit } from './store.js';
import { startReadOnly, isReadOnly } from './readOnly.js';
import { renderCover } from './pages/cover.js';
import { renderDocumentation } from './pages/documentation.js';
import { renderRoadmap } from './pages/roadmap.js';
import { renderRecruitment, RECRUITMENT_TITLE } from './pages/recruitment.js';
import { renderEvents, EVENTS_TITLE } from './pages/events.js';
import { renderScheduleManagement, SCHEDULE_PAGE_TITLE } from './pages/scheduleManagement.js';
import { renderBoardInvestor, BOARD_TITLE } from './pages/boardInvestor.js';
import { renderCooScheduling, COO_TITLE } from './pages/cooScheduling.js';
import { renderPipeline, PIPELINE_TITLE } from './pages/pipeline.js';

const PAGES = {
  home: { label: 'Home', render: renderCover },
  roadmap: { label: 'GTM Roadmap', render: renderRoadmap },
  pipeline: { label: PIPELINE_TITLE, render: renderPipeline },
  schedule: { label: SCHEDULE_PAGE_TITLE, render: renderScheduleManagement },
  coo: { label: COO_TITLE, render: renderCooScheduling },
  boardInvestor: { label: BOARD_TITLE, render: renderBoardInvestor },
  events: { label: EVENTS_TITLE, render: renderEvents },
  documentation: { label: 'Documentation', render: renderDocumentation },
  recruitment: { label: RECRUITMENT_TITLE, render: renderRecruitment },
};

const FOLDER_ICON = '<svg class="folder-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1.5 3.5A1.5 1.5 0 0 1 3 2h3.2c.4 0 .78.16 1.06.44L8.4 3.6H13A1.5 1.5 0 0 1 14.5 5.1V12.5A1.5 1.5 0 0 1 13 14H3a1.5 1.5 0 0 1-1.5-1.5v-9Z"/></svg>';

// Old page addresses that now live on another page.
const MOVED = { operations: 'schedule', leadershipSchedule: 'schedule', clientMaterials: 'roadmap' };
// Where to scroll when an old address has no anchor of its own.
const MOVED_ANCHOR = { clientMaterials: 'roadmap-clients' };

function currentRoute() {
  const raw = location.hash.replace('#/', '').split('?')[0];
  const hash = MOVED[raw] || raw;
  return PAGES[hash] ? hash : 'home';
}

function currentAnchor() {
  const qIdx = location.hash.indexOf('?');
  const raw = location.hash.replace('#/', '').split('?')[0];
  if (qIdx === -1) return MOVED_ANCHOR[raw] || null;
  return new URLSearchParams(location.hash.slice(qIdx + 1)).get('anchor') || MOVED_ANCHOR[raw] || null;
}

export function rerender() {
  const route = currentRoute();
  renderHeader(route);
  const page = document.getElementById('app-page');
  page.innerHTML = '';
  PAGES[route].render(page);

  const anchor = currentAnchor();
  if (anchor) {
    requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else {
    window.scrollTo(0, 0);
  }
}

function renderHeader(route) {
  const data = getData();
  const header = document.getElementById('app-header');

  header.innerHTML = `
    <div class="header-left">
      <nav class="nav-tabs">
        ${Object.entries(PAGES).map(([key, p]) => `
          <a class="nav-tab ${key === route ? 'active' : ''}" href="#/${key}">${FOLDER_ICON}<span>${p.label}</span></a>
        `).join('')}
      </nav>
    </div>
    <div class="header-right">
      <span class="mode-badge ${isReadOnly() ? '' : 'editing'}">${isReadOnly() ? 'Read only' : 'Editing'}</span>
      <button class="btn ${isReadOnly() ? '' : 'btn-primary'} edit-toggle" data-toggle-edit aria-pressed="${!isReadOnly()}">${isReadOnly() ? 'Edit' : 'Done editing'}</button>
    </div>
  `;

}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}

window.addEventListener('hashchange', rerender);
window.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#/home';
  startReadOnly(() => {
    // Keep the scroll position when switching modes.
    const y = window.scrollY;
    document.getElementById('sidebar-root').innerHTML = '';
    document.querySelectorAll('.task-sidebar, .sidebar-overlay, .coo-modal-wrap').forEach((el) => el.remove());
    rerender();
    window.scrollTo(0, y);
  });
  rerender();
});
