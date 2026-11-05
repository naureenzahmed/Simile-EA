import { getData, commit } from './store.js';
import { renderCover } from './pages/cover.js';
import { renderDocumentation } from './pages/documentation.js';
import { renderTerritoryManagement } from './pages/territoryManagement.js';
import { renderRoadmap } from './pages/roadmap.js';
import { renderPaidConversions } from './pages/paidConversions.js';
import { renderInboundLeads } from './pages/inboundLeads.js';
import { renderGtmExperiments } from './pages/gtmExperiments.js';

const PAGES = {
  home: { label: 'Home', render: renderCover },
  documentation: { label: 'Documentation', render: renderDocumentation },
  territoryManagement: { label: 'Territory Management', render: renderTerritoryManagement },
  inboundLeads: { label: 'Leads Management', render: renderInboundLeads },
  paidConversions: { label: 'Outbound', render: renderPaidConversions },
  gtmExperiments: { label: 'GTM Experiments', render: renderGtmExperiments },
  roadmap: { label: 'Roadmap', render: renderRoadmap },
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
  const pct = data.companyGoal.target ? Math.round((data.companyGoal.current / data.companyGoal.target) * 100) : 0;

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
    <div class="header-goal" id="header-goal">
      <div>
        <div class="goal-sub">${escapeAttr(data.companyGoal.title)}</div>
        <div class="goal-value">${data.companyGoal.current}${data.companyGoal.unit} <span class="goal-sub">/ ${data.companyGoal.target}${data.companyGoal.unit}</span></div>
      </div>
      <span class="pill">${pct}%</span>
    </div>
  `;

  document.getElementById('header-goal').addEventListener('click', () => {
    const title = prompt('Goal title', data.companyGoal.title);
    if (title === null) return;
    const current = Number(prompt('Current value', data.companyGoal.current));
    const target = Number(prompt('Target value', data.companyGoal.target));
    data.companyGoal.title = title;
    if (!Number.isNaN(current)) data.companyGoal.current = current;
    if (!Number.isNaN(target)) data.companyGoal.target = target;
    commit();
    rerender();
  });
}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}

window.addEventListener('hashchange', rerender);
window.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#/home';
  rerender();
});
