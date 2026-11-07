import { getData, commit } from './store.js';
import { startReadOnly, isReadOnly } from './readOnly.js';
import { startNotesSync } from './notesBox.js';
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
  coo: { label: COO_TITLE, render: renderCooScheduling },
  roadmap: { label: 'GTM Roadmap', render: renderRoadmap },
  pipeline: { label: PIPELINE_TITLE, render: renderPipeline },
  schedule: { label: SCHEDULE_PAGE_TITLE, render: renderScheduleManagement },
  boardInvestor: { label: BOARD_TITLE, render: renderBoardInvestor },
  events: { label: EVENTS_TITLE, render: renderEvents },
  documentation: { label: 'Documentation', render: renderDocumentation },
  recruitment: { label: RECRUITMENT_TITLE, render: renderRecruitment },
};

const HOUSE_ICON = '<svg class="house-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.2 10 3.5l7 5.7"/><path d="M5 8v8.5h3.8v-4.6h2.4v4.6H15V8"/></svg>';
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
  // The Read only / Edit bar lives outside the page, so it stays when a page redraws itself.
  document.getElementById('mode-root').replaceChildren(modeBar());

  const anchor = currentAnchor();
  if (anchor) {
    requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else {
    window.scrollTo(0, 0);
  }
}

// Read only / Edit switch, in the top-right corner of every page.
function modeBar() {
  const bar = document.createElement('div');
  bar.className = 'mode-bar';
  bar.innerHTML = `
    <span class="mode-badge ${isReadOnly() ? '' : 'editing'}">${isReadOnly() ? 'Read only' : 'Editing'}</span>
    <button class="btn ${isReadOnly() ? '' : 'btn-primary'} edit-toggle" data-toggle-edit data-ro-keep aria-pressed="${!isReadOnly()}">${isReadOnly() ? 'Edit' : 'Done editing'}</button>
  `;
  return bar;
}

function renderHeader(route) {
  const header = document.getElementById('app-header');

  header.innerHTML = `
    <div class="header-left">
      <a class="wordmark" href="#/home" title="Home"><img src="assets/simile-logo.png" alt="Simile" /></a>
      <nav class="nav-tabs" aria-label="Pages">
        <a class="nav-home ${route === 'home' ? 'active' : ''}" href="#/home" aria-label="Home" title="Home" ${route === 'home' ? 'aria-current="page"' : ''}>${HOUSE_ICON}</a>
        ${Object.entries(PAGES).filter(([key]) => key !== 'home').map(([key, p]) => `
          <a class="nav-tab ${key === route ? 'active' : ''}" data-key="${key}" href="#/${key}" ${key === route ? 'aria-current="page"' : ''}>${FOLDER_ICON}<span>${p.label}</span></a>
        `).join('')}
        <button class="nav-tab nav-more" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="nav-more-menu" hidden>
          <span class="nav-more-label">More</span><span class="nav-more-count"></span><span class="nav-more-caret" aria-hidden="true">▾</span>
        </button>
      </nav>
    </div>
    <div class="nav-more-menu" id="nav-more-menu" role="menu" hidden></div>
  `;

  const more = header.querySelector('.nav-more');
  const menu = header.querySelector('.nav-more-menu');
  more.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(menu.hidden);
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  fitTabs();
}

function setMenu(open) {
  const header = document.getElementById('app-header');
  const more = header.querySelector('.nav-more');
  const menu = header.querySelector('.nav-more-menu');
  if (!more || !menu) return;
  menu.hidden = !open;
  more.setAttribute('aria-expanded', String(open));
  more.classList.toggle('open', open);
  if (open) {
    const h = header.getBoundingClientRect();
    const b = more.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(b.left - h.left, h.width - menu.offsetWidth - 8))}px`;
    menu.querySelector('a')?.focus();
  }
}

// Show as many tabs as fit; the rest go into the "More" menu. The open page's tab always stays visible.
function fitTabs() {
  const header = document.getElementById('app-header');
  const nav = header?.querySelector('.nav-tabs');
  if (!nav) return;
  const tabs = [...nav.querySelectorAll('.nav-tab[data-key]')];
  const more = nav.querySelector('.nav-more');
  const menu = header.querySelector('.nav-more-menu');

  tabs.forEach((t) => { t.hidden = false; });
  more.hidden = true;
  setMenu(false);
  if (nav.scrollWidth <= nav.clientWidth + 1) { menu.innerHTML = ''; return; }

  more.hidden = false;
  const overlap = 6;
  const home = nav.querySelector('.nav-home');
  const room = nav.clientWidth - more.offsetWidth - (home ? home.offsetWidth + 14 : 0) - 12;
  const active = tabs.find((t) => t.classList.contains('active'));
  let used = active ? active.offsetWidth - overlap : 0;
  const hidden = [];
  for (const t of tabs) {
    if (t === active) continue;
    const w = t.offsetWidth - overlap;
    if (!hidden.length && used + w <= room) used += w;
    else hidden.push(t);
  }
  hidden.forEach((t) => { t.hidden = true; });
  more.querySelector('.nav-more-count').textContent = ` (${hidden.length})`;
  more.setAttribute('aria-label', `More pages: ${hidden.length}`);
  menu.innerHTML = hidden.map((t) => `<a role="menuitem" href="${t.getAttribute('href')}">${FOLDER_ICON}<span>${t.textContent.trim()}</span></a>`).join('');
}

document.addEventListener('click', (e) => { if (!e.target.closest('.nav-more-menu, .nav-more')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.querySelector('.nav-more-menu')?.hidden) {
    setMenu(false);
    document.querySelector('.nav-more')?.focus();
  }
});
let fitTimer;
window.addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitTabs, 60); });
document.fonts?.ready.then(fitTabs);

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}

window.addEventListener('hashchange', rerender);
window.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#/home';
  startNotesSync();
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
