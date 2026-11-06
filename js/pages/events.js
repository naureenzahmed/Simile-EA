import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';
import { EVENT_TYPES, EVENT_STATUSES, EVENT_PHASES, EVENT_ROLES, eventChecklist } from '../seed.js';

export const EVENTS_TITLE = 'Events & Offsites';

export function renderEvents(container) {
  const events = getData().events;

  container.innerHTML = `
    ${notesBoxHtml('events')}
    <div class="toolbar">
      <div class="page-title" style="margin:0;">${EVENTS_TITLE}</div>
      <button class="btn btn-primary" id="add-event-btn">+ Add event</button>
    </div>
    <datalist id="event-owners">${[...EVENT_ROLES, ...(getData().scheduleLeaders || [])].map((n) => `<option value="${escapeHtml(n)}"></option>`).join('')}</datalist>
    <div class="stack-16">
      ${renderContents(events)}
      ${events.map(renderEventSection).join('')}
    </div>
  `;

  wireEvents(container, events);
}

function options(list, current) {
  const all = current && !list.includes(current) ? [current, ...list] : list;
  return `<option value=""></option>` + all.map((v) => `<option ${v === current ? 'selected' : ''}>${escapeHtml(v)}</option>`).join('');
}

// Table of contents: one row per event, linking down to its checklist.
function renderContents(events) {
  return `
    <div class="card doc-card" id="events-contents">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">Table of Contents</h4>
      </div>
      <div class="tracker-scroll">
        <table class="list-table doc-fields-table events-table">
          <thead>
            <tr>
              <th>Event Name</th><th>Event Type</th><th>Description</th><th>Date</th>
              <th>Location</th><th>Link to Checklist</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${events.map((e) => `
              <tr>
                <td><input type="text" class="cell-input events-name" data-event="${e.id}" data-field="name" value="${escapeHtml(e.name)}" /></td>
                <td><select class="cell-input" data-event="${e.id}" data-field="type">${options(EVENT_TYPES, e.type)}</select></td>
                <td class="events-desc"><textarea class="cell-input cell-textarea" rows="2" data-event="${e.id}" data-field="description">${escapeHtml(e.description)}</textarea></td>
                <td>
                  <label class="ev-date" title="Change date">
                    <span data-date-label="${e.id}">${longDate(e.date) || 'Pick a date'}</span>
                    <input type="date" data-event="${e.id}" data-field="date" value="${escapeHtml(e.date)}" aria-label="Date" />
                  </label>
                </td>
                <td><input type="text" class="cell-input" data-event="${e.id}" data-field="location" value="${escapeHtml(e.location)}" /></td>
                <td><a class="checklist-link" href="#/events?anchor=${e.id}">Checklist (${doneCount(e)}) →</a></td>
                <td><select class="cell-input" data-event="${e.id}" data-field="status">${options(EVENT_STATUSES, e.status)}</select></td>
                <td><button class="btn btn-ghost" data-remove-event="${e.id}" style="padding:3px 7px;">✕</button></td>
              </tr>
            `).join('') || `<tr><td colspan="8" class="empty-hint">No events yet. Click "+ Add event" to add one.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function doneCount(e) {
  const items = EVENT_PHASES.flatMap((p) => e.checklist[p.key] || []);
  return `${items.filter((i) => i.done).length}/${items.length}`;
}

// "Thu, Dec 3, 2026"
export function longDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function metaLine(e) {
  return [e.type, longDate(e.date), e.location, e.status].filter(Boolean).map(escapeHtml).join(' · ');
}

// One section per event, with a checklist for each phase.
function renderEventSection(e) {
  return `
    <div class="card doc-card" id="${e.id}">
      <div class="toolbar" style="margin-bottom:2px;">
        <h4 style="margin:0;" data-event-title="${e.id}">${escapeHtml(e.name) || 'Untitled event'}</h4>
        <a class="checklist-link" href="#/events?anchor=events-contents">↑ Back to Table of Contents</a>
      </div>
      <div class="section-desc" data-event-meta="${e.id}">${metaLine(e)}</div>
      <div class="event-phases">
        ${EVENT_PHASES.map((p) => {
          const items = e.checklist[p.key] || [];
          return `
          <div class="event-phase">
            <div class="event-phase-title">${p.label} <span class="event-phase-count">${items.filter((i) => i.done).length}/${items.length}</span></div>
            <div class="tracker-scroll">
              <table class="list-table checklist-table">
                <thead>
                  <tr><th class="ct-check">Done</th><th class="ct-action">Action Item</th><th class="ct-link">Link</th><th class="ct-notes">Notes</th><th class="ct-owner">Owner</th><th></th></tr>
                </thead>
                <tbody>
                  ${items.map((item) => {
                    const key = `${e.id}|${p.key}|${item.id}`;
                    const link = item.link || '';
                    const href = /^https?:\/\//i.test(link) ? link : link ? `https://${link}` : '';
                    return `
                    <tr class="${item.done ? 'done' : ''}">
                      <td class="ct-check"><input type="checkbox" data-check="${key}" ${item.done ? 'checked' : ''} aria-label="Done" /></td>
                      <td><textarea class="cell-input checklist-text" rows="1" data-check-text="${key}">${escapeHtml(item.text)}</textarea></td>
                      <td>
                        <div class="board-link">
                          <input type="url" class="cell-input" data-check-field="${key}|link" value="${escapeHtml(link)}" placeholder="Paste link" />
                          <a class="board-open ${href ? '' : 'hidden'}" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="Open link">↗</a>
                        </div>
                      </td>
                      <td><textarea class="cell-input checklist-text" rows="1" data-check-field="${key}|notes">${escapeHtml(item.notes || '')}</textarea></td>
                      <td><input type="text" class="cell-input" list="event-owners" data-check-field="${key}|owner" value="${escapeHtml(item.owner || '')}" placeholder="Who" /></td>
                      <td><button class="btn btn-ghost" data-check-remove="${key}" title="Remove" style="padding:3px 7px;">✕</button></td>
                    </tr>`;
                  }).join('')}
                  <tr class="checklist-add-row">
                    <td></td>
                    <td colspan="5"><input type="text" class="cell-input checklist-add" data-check-add="${e.id}|${p.key}" placeholder="+ Add action item (press Enter)" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function findEvent(events, id) {
  return events.find((e) => e.id === id);
}

function findItem(events, key) {
  const [eventId, phase, itemId] = key.split('|');
  const list = findEvent(events, eventId).checklist[phase];
  return { list, item: list.find((i) => i.id === itemId), eventId, phase };
}

function wireEvents(container, events) {
  const rerender = () => renderEvents(container);

  document.getElementById('add-event-btn').addEventListener('click', () => {
    const id = uid('evt');
    events.push({ id, name: 'New event', type: 'Other', description: '', date: '', location: '', status: 'Idea', checklist: eventChecklist(id, 'Other') });
    commit();
    rerender();
  });

  // Table edits save as you type and update the event's section heading in place.
  container.querySelectorAll('[data-event][data-field]').forEach((el) => {
    const save = () => {
      const e = findEvent(events, el.dataset.event);
      const prevType = e.type;
      e[el.dataset.field] = el.value;
      // A new type brings its own checklist, as long as nobody has started the old one.
      if (el.dataset.field === 'type' && prevType !== e.type) {
        const items = EVENT_PHASES.flatMap((ph) => e.checklist[ph.key] || []);
        if (items.every((i) => !i.done && !i.owner && !i.notes && !i.link)) {
          e.checklist = eventChecklist(e.id, e.type);
          commit();
          rerender();
          return;
        }
      }
      if (el.dataset.field === 'date') container.querySelector(`[data-date-label="${e.id}"]`).textContent = longDate(e.date) || 'Pick a date';
      commit();
      container.querySelector(`[data-event-title="${e.id}"]`).textContent = e.name || 'Untitled event';
      container.querySelector(`[data-event-meta="${e.id}"]`).innerHTML = metaLine(e);
    };
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', save);
  });

  container.querySelectorAll('.ev-date input').forEach((input) => {
    input.closest('.ev-date').addEventListener('click', () => { try { input.showPicker(); } catch { input.focus(); } });
  });

  container.querySelectorAll('[data-remove-event]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const e = findEvent(events, btn.dataset.removeEvent);
      if (!confirm(`Remove "${e.name || 'this event'}" and its checklist?`)) return;
      events.splice(events.indexOf(e), 1);
      commit();
      rerender();
    });
  });

  container.querySelectorAll('[data-check]').forEach((box) => {
    box.addEventListener('change', () => {
      findItem(events, box.dataset.check).item.done = box.checked;
      commit();
      rerender();
    });
  });

  container.querySelectorAll('[data-check-text]').forEach((input) => {
    input.addEventListener('input', () => {
      findItem(events, input.dataset.checkText).item.text = input.value;
      commit();
    });
  });

  container.querySelectorAll('[data-check-field]').forEach((input) => {
    input.addEventListener('input', () => {
      const parts = input.dataset.checkField.split('|');
      const field = parts.pop();
      findItem(events, parts.join('|')).item[field] = input.value;
      commit();
      // Keep the "open link" arrow in step with the typed link.
      const open = input.parentElement.querySelector('.board-open');
      if (open) {
        const v = input.value.trim();
        open.href = /^https?:\/\//i.test(v) ? v : `https://${v}`;
        open.classList.toggle('hidden', !v);
      }
    });
  });

  container.querySelectorAll('[data-check-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { list, item } = findItem(events, btn.dataset.checkRemove);
      list.splice(list.indexOf(item), 1);
      commit();
      rerender();
    });
  });

  container.querySelectorAll('[data-check-add]').forEach((input) => {
    input.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter' || !input.value.trim()) return;
      const [eventId, phase] = input.dataset.checkAdd.split('|');
      findEvent(events, eventId).checklist[phase].push({ id: uid('chk'), text: input.value.trim(), done: false, link: '', notes: '', owner: '' });
      commit();
      rerender();
      container.querySelector(`[data-check-add="${eventId}|${phase}"]`)?.focus();
    });
  });
}
