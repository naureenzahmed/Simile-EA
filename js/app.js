import { getData, commit } from './store.js';
import { renderCover } from './pages/cover.js';
import { renderDocumentation } from './pages/documentation.js';
import { renderRoadmap } from './pages/roadmap.js';
import { renderClientMaterials } from './pages/clientMaterials.js';
import { renderTeamManagement } from './pages/teamManagement.js';
import { renderRecruitment } from './pages/recruitment.js';
import { blankPage } from './pages/blankPage.js';
import { renderEvents, EVENTS_TITLE } from './pages/events.js';
import { renderLeadershipSchedule, SCHEDULE_TITLE } from './pages/leadershipSchedule.js';
import { renderBoardInvestor, BOARD_TITLE } from './pages/boardInvestor.js';

const PAGES = {
  home: { label: 'Home', render: renderCover },
  documentation: { label: 'Documentation', render: renderDocumentation },
  roadmap: { label: 'GTM Roadmap', render: renderRoadmap },
  operations: { label: 'Team Management', render: renderTeamManagement },
  leadershipSchedule: { label: SCHEDULE_TITLE, render: renderLeadershipSchedule },
  boardInvestor: { label: BOARD_TITLE, render: renderBoardInvestor },
  recruitment: { label: 'Recruitment', render: renderRecruitment },
  clientMaterials: { label: 'Client Materials', render: renderClientMaterials },
  events: { label: EVENTS_TITLE, render: renderEvents },
  inboundLeads: { label: 'Leads Management', render: blankPage('Leads Management') },
};

const FOLDER_ICON = '<svg class="folder-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1.5 3.5A1.5 1.5 0 0 1 3 2h3.2c.4 0 .78.16 1.06.44L8.4 3.6H13A1.5 1.5 0 0 1 14.5 5.1V12.5A1.5 1.5 0 0 1 13 14H3a1.5 1.5 0 0 1-1.5-1.5v-9Z"/></svg>';

function currentRoute() {
  const hash = location.hash.replace('#/', '').split('?')[0];
  return PAGES[hash] ? hash : 'home';
}

function currentAnchor() {
  const qIdx = location.hash.indexOf('?');
  if (qIdx === -1) return null;
  return new URLSearchParams(location.hash.slice(qIdx + 1)).get('anchor');
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
      <a class="wordmark" href="#/home">
        <img src="assets/simile-logo.png" alt="Simile" />
      </a>
      <nav class="nav-tabs">
        ${Object.entries(PAGES).map(([key, p]) => `
          <a class="nav-tab ${key === route ? 'active' : ''}" href="#/${key}">${FOLDER_ICON}<span>${p.label}</span></a>
        `).join('')}
      </nav>
    </div>
  `;

}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}

window.addEventListener('hashchange', rerender);
window.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#/home';
  rerender();
});
