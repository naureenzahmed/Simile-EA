import { commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { openClubSidebar } from '../clubSidebar.js';
import { notesBoxHtml } from '../notesBox.js';

export function renderTrackerPage(container, data, key, opts) {
  const sections = data[key];
  const weeks = data.weeks;

  container.innerHTML = `
    ${notesBoxHtml(key)}
    <div class="toolbar">
      <div class="page-title" style="margin:0;">${escapeHtml(opts.title)}</div>
      <button class="btn btn-primary" id="add-section-btn">+ Add section</button>
    </div>
    <div class="inline-add-form" id="add-section-form" style="display:none;">
      <input type="text" id="add-section-input" placeholder="Section title" />
      <button class="btn btn-primary" id="add-section-confirm">Add</button>
      <button class="btn btn-ghost" id="add-section-cancel">Cancel</button>
    </div>
    <div id="tracker-sections" class="stack-16"></div>
  `;

  document.getElementById('tracker-sections').innerHTML = sections.map((s) => renderSection(s, weeks)).join('');

  const sectionForm = document.getElementById('add-section-form');
  const sectionInput = document.getElementById('add-section-input');

  document.getElementById('add-section-btn').addEventListener('click', () => {
    sectionForm.style.display = sectionForm.style.display === 'none' ? 'flex' : 'none';
    if (sectionForm.style.display === 'flex') sectionInput.focus();
  });
  document.getElementById('add-section-cancel').addEventListener('click', () => {
    sectionForm.style.display = 'none';
    sectionInput.value = '';
  });
  const confirmAddSection = () => {
    const title = sectionInput.value.trim();
    if (!title) return;
    sections.push({ id: uid('sec'), title, metrics: [] });
    commit();
    renderTrackerPage(container, data, key, opts);
  };
  document.getElementById('add-section-confirm').addEventListener('click', confirmAddSection);
  sectionInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmAddSection(); });

  wireEvents(container, data, key, opts, sections);
}

function renderSection(s, weeks) {
  // A section with only a table gets the simple table card.
  if (s.table && !s.metrics?.length && !s.entities?.length) return renderTableSection(s);
  if (s.isIntro) {
    return `<div class="card page-intro">${(Array.isArray(s.note) ? s.note : [s.note]).map((p) => `<p style="margin:0 0 8px;">${escapeHtml(p)}</p>`).join('')}</div>`;
  }

  return `
    <div class="card tracker-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <div style="display:flex; gap:6px;">
          ${s.table && !s.table.groups ? `<button class="btn btn-ghost" data-add-table-row="${s.id}" style="padding:4px 8px;">+ Add row</button>` : ''}
          <button class="btn btn-ghost" data-add-metric="${s.id}" style="padding:4px 8px;">+ Add metric</button>
          <button class="btn btn-ghost btn-danger" data-remove-section="${s.id}" style="padding:4px 8px;">Remove section</button>
        </div>
      </div>
      ${s.note ? `<div class="section-desc">${escapeHtml(s.note)}</div>` : ''}
      ${s.table ? `<div style="margin-bottom:14px;">${tableHtml(s)}</div>` : ''}
      ${s.entities && s.entities.length ? `
        <div class="entity-list">
          ${s.entities.map((e, entityIndex) => `
            <div class="entity-row">
              <div class="entity-name">${escapeHtml(e.name)}</div>
              ${e.note
                ? `<div class="entity-note">${escapeHtml(e.note)}</div>`
                : `<div class="entity-org-list">${e.links && e.links.length ? e.links.map((l) => `<button type="button" class="entity-org-box" data-open-club="${s.id}|${entityIndex}|${l.id}">${escapeHtml(l.name)}</button>`).join('') : '<span class="entity-org-empty">None yet</span>'}</div>`
              }
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${s.metrics && s.metrics.length ? `
        <div class="tracker-scroll">
          <table class="list-table tracker-table">
            <thead>
              <tr>
                <th class="tracker-sticky-col">Metric</th>
                <th>Notes</th>
                <th>Target</th>
                ${(s.columns || weeks).map((w) => `<th class="tracker-week-th ${w.isCurrent ? 'current-week' : ''}">${escapeHtml(w.label)}</th>`).join('')}
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${s.metrics.map((m) => `
                <tr>
                  <td class="tracker-sticky-col">${escapeHtml(m.label)}</td>
                  <td class="tracker-note">${escapeHtml(m.note || '')}</td>
                  <td class="tracker-target">${m.target ?? 'Not set'}</td>
                  ${(s.columns || weeks).map((w) => `
                    <td class="tracker-week-td ${w.isCurrent ? 'current-week' : ''}">
                      <input type="text" inputmode="decimal" class="tracker-input" data-metric="${s.id}|${m.id}|${w.key}" value="${escapeHtml(m.values?.[w.key] ?? '')}" />
                    </td>
                  `).join('')}
                  <td><button class="btn btn-ghost" data-remove-metric="${s.id}|${m.id}" style="padding:2px 7px;">✕</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-hint">No metrics yet.</div>'}
      ${renderMeetingsSummary(s)}
      <div class="inline-add-form" id="add-metric-form-${s.id}" style="display:none;">
        <input type="text" id="add-metric-input-${s.id}" placeholder="Metric name" />
        <button class="btn btn-primary" data-confirm-add-metric="${s.id}">Add</button>
        <button class="btn btn-ghost" data-cancel-add-metric="${s.id}">Cancel</button>
      </div>
    </div>
  `;
}

// A section that holds a plain editable table (columns in s.table.fields).
function renderTableSection(s) {
  return `
    <div class="card tracker-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <div style="display:flex; gap:6px;">
          ${s.table?.groups ? '' : `<button class="btn btn-ghost" data-add-table-row="${s.id}" style="padding:4px 8px;">+ Add row</button>`}
          <button class="btn btn-ghost btn-danger" data-remove-section="${s.id}" style="padding:4px 8px;">Remove section</button>
        </div>
      </div>
      ${s.note ? `<div class="section-desc">${escapeHtml(s.note)}</div>` : ''}
      ${tableHtml(s)}
    </div>
  `;
}

function tableCell(s, row, f) {
  const key = `${s.id}|${row.id}|${f.key}`;
  const value = row[f.key] || '';
  if (f.type === 'url') {
    const href = /^https?:\/\//i.test(value) ? value : value ? `https://${value}` : '';
    return `
      <div class="board-link">
        <input type="url" class="cell-input" data-table-cell="${key}" value="${escapeHtml(value)}" placeholder="Paste link" />
        <a class="board-open ${href ? '' : 'hidden'}" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="Open link">↗</a>
      </div>`;
  }
  if (f.multiline) {
    return `<textarea class="cell-input cell-textarea" rows="3" data-table-cell="${key}">${escapeHtml(value)}</textarea>`;
  }
  return `<input type="text" class="cell-input" data-table-cell="${key}" value="${escapeHtml(value)}" />`;
}

// Tables with groups (like Event Attendance) show one sub-table per group.
function tableHtml(s) {
  const { groups } = s.table;
  if (!groups) return tableGrid(s, s.table.rows);
  const keys = groups.map((g) => g.key);
  return groups.map((g) => {
    const rows = s.table.rows.filter((r) => (keys.includes(r.group) ? r.group : 'upcoming') === g.key);
    return `
      <div class="table-group">
        <div class="table-group-head">
          <h5>${escapeHtml(g.label)} <span class="event-phase-count">${rows.length}</span></h5>
          <button class="btn btn-ghost" data-add-table-row="${s.id}" data-group="${g.key}" style="padding:3px 8px;">+ Add row</button>
        </div>
        ${tableGrid(s, rows)}
      </div>`;
  }).join('');
}

function tableGrid(s, rows) {
  const { fields } = s.table;
  return `
    <div class="tracker-scroll">
      <table class="list-table doc-fields-table">
        <thead>
          <tr>${fields.map((f) => `<th>${escapeHtml(f.label)}</th>`).join('')}<th></th></tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${fields.map((f) => `<td>${tableCell(s, row, f)}</td>`).join('')}
              <td><button class="btn btn-ghost" data-remove-table-row="${s.id}|${row.id}" style="padding:3px 7px;">✕</button></td>
            </tr>
          `).join('') || `<tr><td colspan="${fields.length + 1}" class="empty-hint">No rows yet. Click "+ Add row" to add one.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderMeetingsSummary(s) {
  const metric = s.metrics?.find((m) => /meeting(s)?\s*booked/i.test(m.label) && !/%/.test(m.label));
  if (!metric) return '';
  const total = Object.values(metric.values || {}).reduce((sum, v) => {
    const n = parseFloat(v);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);
  return `<div class="tracker-summary">Meetings booked <b>${total}</b></div>`;
}

function wireEvents(container, data, key, opts, sections) {
  document.querySelectorAll('[data-open-club]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, entityIndex, linkId] = btn.dataset.openClub.split('|');
      openClubSidebar(sections, sectionId, Number(entityIndex), linkId, () => renderTrackerPage(container, data, key, opts));
    });
  });

  document.querySelectorAll('.tracker-input').forEach((input) => {
    input.addEventListener('input', () => {
      const [sectionId, metricId, weekKey] = input.dataset.metric.split('|');
      const section = sections.find((s) => s.id === sectionId);
      const metric = section.metrics.find((m) => m.id === metricId);
      metric.values = metric.values || {};
      if (input.value.trim() === '') delete metric.values[weekKey];
      else metric.values[weekKey] = input.value;
      commit();
    });
  });

  document.querySelectorAll('[data-add-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const form = document.getElementById(`add-metric-form-${btn.dataset.addMetric}`);
      const input = document.getElementById(`add-metric-input-${btn.dataset.addMetric}`);
      form.style.display = form.style.display === 'none' ? 'flex' : 'none';
      if (form.style.display === 'flex') input.focus();
    });
  });

  document.querySelectorAll('[data-cancel-add-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById(`add-metric-form-${btn.dataset.cancelAddMetric}`).style.display = 'none';
    });
  });

  const confirmAddMetric = (sectionId) => {
    const input = document.getElementById(`add-metric-input-${sectionId}`);
    const label = input.value.trim();
    if (!label) return;
    const section = sections.find((s) => s.id === sectionId);
    section.metrics = section.metrics || [];
    section.metrics.push({ id: uid('m'), label, target: null, values: {} });
    commit();
    renderTrackerPage(container, data, key, opts);
  };
  document.querySelectorAll('[data-confirm-add-metric]').forEach((btn) => {
    btn.addEventListener('click', () => confirmAddMetric(btn.dataset.confirmAddMetric));
  });
  document.querySelectorAll('[id^="add-metric-input-"]').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmAddMetric(input.id.replace('add-metric-input-', ''));
    });
  });

  document.querySelectorAll('[data-remove-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, metricId] = btn.dataset.removeMetric.split('|');
      const section = sections.find((s) => s.id === sectionId);
      section.metrics = section.metrics.filter((m) => m.id !== metricId);
      commit();
      renderTrackerPage(container, data, key, opts);
    });
  });

  document.querySelectorAll('[data-add-table-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = sections.find((s) => s.id === btn.dataset.addTableRow);
      const row = { id: uid('row') };
      section.table.fields.forEach((f) => { row[f.key] = ''; });
      if (section.table.groups) row.group = btn.dataset.group || 'upcoming';
      section.table.rows.push(row);
      commit();
      renderTrackerPage(container, data, key, opts);
    });
  });

  document.querySelectorAll('[data-table-cell]').forEach((input) => {
    input.addEventListener('input', () => {
      const [sectionId, rowId, field] = input.dataset.tableCell.split('|');
      const row = sections.find((s) => s.id === sectionId).table.rows.find((r) => r.id === rowId);
      row[field] = input.value;
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

  document.querySelectorAll('[data-remove-table-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, rowId] = btn.dataset.removeTableRow.split('|');
      const section = sections.find((s) => s.id === sectionId);
      section.table.rows = section.table.rows.filter((r) => r.id !== rowId);
      commit();
      renderTrackerPage(container, data, key, opts);
    });
  });

  document.querySelectorAll('[data-remove-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = sections.findIndex((s) => s.id === btn.dataset.removeSection);
      if (idx >= 0) sections.splice(idx, 1);
      commit();
      renderTrackerPage(container, data, key, opts);
    });
  });
}
