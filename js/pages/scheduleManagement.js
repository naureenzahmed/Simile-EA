import { renderLeadershipSchedule, SCHEDULE_TITLE } from './leadershipSchedule.js';
import { renderTeamManagement } from './teamManagement.js';
import { notesBoxHtml } from '../notesBox.js';

export const SCHEDULE_PAGE_TITLE = 'Schedule Management';

const PARTS = [
  { id: 'schedule-leadership', label: SCHEDULE_TITLE },
  { id: 'schedule-team', label: 'Team Management' },
];

// One page with the leadership calendar on top and Team Management below it.
export function renderScheduleManagement(container) {
  container.innerHTML = `
    ${notesBoxHtml('schedule')}
    <div class="page-title" style="margin-bottom:12px;">${SCHEDULE_PAGE_TITLE}</div>
    <div class="schedule-jump">
      ${PARTS.map((p) => `<a class="btn" href="#/schedule?anchor=${p.id}" data-jump="${p.id}">${p.label}</a>`).join('')}
    </div>
    ${PARTS.map((p) => `<section class="schedule-part" id="${p.id}"><div data-part-root></div></section>`).join('')}
  `;

  const roots = container.querySelectorAll('[data-part-root]');
  renderLeadershipSchedule(roots[0]);
  renderTeamManagement(roots[1]);

  // Scroll without re-drawing the page, so filters and open forms stay as they are.
  container.querySelectorAll('[data-jump]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.jump).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
