import { getData, commit } from './store.js';
import { uid, escapeHtml, fmtDate, addDays } from './utils.js';

export const AGENDA_TEMPLATE = '1. Wins from last week\n2. Objective updates by department\n3. Blockers and decisions needed\n4. Action items and owners';

const toHref = (v) => (/^https?:\/\//i.test(v) ? v : v ? `https://${v}` : '');

// Mondays between two dates (inclusive), as YYYY-MM-DD.
export function mondaysBetween(start, end) {
  const d = new Date(start + 'T00:00:00');
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7));
  const out = [];
  for (let iso = toIso(d); iso <= end; iso = addDays(iso, 7)) out.push(iso);
  return out;
}

function toIso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function meetingFor(week) {
  return (getData().weeklyMeetings || []).find((m) => m.week === week) || null;
}

// Side panel for one week's meeting: document link at the top, then time, attendees, agenda and notes.
export function openWeeklyMeeting(week, onChange) {
  closeWeeklyMeeting();
  const data = getData();
  data.weeklyMeetings = data.weeklyMeetings || [];
  const existing = meetingFor(week);
  const m = existing || { id: uid('wk'), week, time: '10:00', attendees: '', agenda: AGENDA_TEMPLATE, notes: '', docUrl: '' };
  // Save on first edit, so weeks nobody touches don't fill up saved data.
  const save = () => {
    if (!data.weeklyMeetings.includes(m)) data.weeklyMeetings.push(m);
    commit();
  };
  afterClose = onChange;

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'wk-overlay';
  const panel = document.createElement('div');
  panel.className = 'task-sidebar';
  panel.id = 'wk-panel';

  const draw = () => {
    const href = toHref(m.docUrl);
    panel.innerHTML = `
      <div class="ts-header">
        <div>
          <strong>Weekly Agenda &amp; Meeting</strong>
          <div class="section-desc" style="margin:2px 0 0;">Week of ${fmtDate(week)} to ${fmtDate(addDays(week, 4))}</div>
        </div>
        <button class="btn btn-ghost" id="wk-close" aria-label="Close">✕</button>
      </div>
      <div class="ts-body">
        <div class="wk-doc">
          ${href
            ? `<a class="btn btn-primary" href="${escapeHtml(href)}" target="_blank" rel="noopener">Open meeting document ↗</a>
               <button class="btn btn-ghost" id="wk-doc-edit" style="padding:4px 8px;">Edit link</button>`
            : `<button class="btn btn-primary" id="wk-doc-edit">+ Add link to meeting document</button>`}
          <div class="wk-doc-form hidden" id="wk-doc-form">
            <input type="text" id="wk-doc-input" value="${escapeHtml(m.docUrl)}" placeholder="Paste the Google Doc or Notion link" />
            <button class="btn" id="wk-doc-save">Save</button>
          </div>
        </div>
        <div class="ts-field"><div class="ts-field-label">Meeting time (Monday)</div>
          <input type="time" id="wk-time" class="sched-time" value="${escapeHtml(m.time)}" />
        </div>
        <div class="ts-field"><div class="ts-field-label">Attendees</div>
          <input type="text" id="wk-attendees" value="${escapeHtml(m.attendees)}" placeholder="e.g. Lainie Yallen, Julia Lauer, Danny Wymer" />
        </div>
        <div class="ts-field"><div class="ts-field-label">Agenda</div>
          <textarea id="wk-agenda" class="wk-agenda">${escapeHtml(m.agenda)}</textarea>
        </div>
        <div class="ts-field" style="border-bottom:none;"><div class="ts-field-label">Meeting notes</div>
          <textarea id="wk-notes" class="wk-agenda" placeholder="What was discussed and decided.">${escapeHtml(m.notes)}</textarea>
        </div>
      </div>`;

    panel.querySelector('#wk-close').addEventListener('click', closeWeeklyMeeting);
    panel.querySelector('#wk-doc-edit').addEventListener('click', () => {
      panel.querySelector('#wk-doc-form').classList.toggle('hidden');
      panel.querySelector('#wk-doc-input').focus();
    });
    const saveDoc = () => { m.docUrl = panel.querySelector('#wk-doc-input').value.trim(); save(); draw(); };
    panel.querySelector('#wk-doc-save').addEventListener('click', saveDoc);
    panel.querySelector('#wk-doc-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveDoc(); });
    for (const [id, key] of [['wk-time', 'time'], ['wk-attendees', 'attendees'], ['wk-agenda', 'agenda'], ['wk-notes', 'notes']]) {
      panel.querySelector(`#${id}`).addEventListener('input', (e) => { m[key] = e.target.value; save(); });
    }
  };

  draw();
  document.body.append(overlay, panel);
  overlay.addEventListener('click', closeWeeklyMeeting);
}

let afterClose = null;

export function closeWeeklyMeeting() {
  const wasOpen = document.getElementById('wk-panel');
  document.getElementById('wk-overlay')?.remove();
  wasOpen?.remove();
  if (wasOpen && afterClose) { const cb = afterClose; afterClose = null; cb(); }
}
