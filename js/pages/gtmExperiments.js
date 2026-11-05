import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';

export function renderGtmExperiments(container) {
  const data = getData();
  const sections = data.gtmExperiments;

  container.innerHTML = `
    ${notesBoxHtml('gtmExperiments')}
    <div class="page-title">GTM Experiments</div>
    <div id="gtm-sections" class="stack-16"></div>
  `;

  document.getElementById('gtm-sections').innerHTML = sections.map(renderSection).join('');
  wireEvents(container, sections);
}

function renderSection(s) {
  if (s.columns) return renderMatrixSection(s);

  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <button class="btn btn-ghost" data-add-row="${s.id}" style="padding:4px 8px;">+ Add row</button>
      </div>
      ${s.note ? `<div class="section-desc" style="margin-bottom:12px;">${escapeHtml(s.note)}</div>` : ''}
      ${s.formats && s.formats.length ? `
        <div class="section-desc" style="margin-bottom:8px;">Event Formats</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
          ${s.formats.map((f) => `<span class="pill">${escapeHtml(f)}</span>`).join('')}
        </div>
      ` : ''}
      ${s.entries.length ? `
        <div class="tracker-scroll">
          <table class="list-table doc-fields-table">
            <thead>
              <tr>
                ${s.fields.map((f) => `<th>${escapeHtml(f.label)}</th>`).join('')}
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${s.entries.map((entry) => `
                <tr>
                  ${s.fields.map((f) => `
                    <td><input type="text" class="cell-input" data-row-id="${entry.id}" data-section-id="${s.id}" data-field="${f.key}" value="${escapeHtml(entry[f.key] || '')}" /></td>
                  `).join('')}
                  <td><button class="btn btn-ghost" data-remove-row="${s.id}|${entry.id}" style="padding:3px 7px;">✕</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-hint">No entries yet.</div>'}
      ${renderHypothesisAndLessons(s)}
    </div>
  `;
}

function renderHypothesisAndLessons(s) {
  return `
    <div style="margin-top:16px;">
      <div class="section-label">Hypothesis</div>
      <textarea class="notes-box" data-hypothesis="${s.id}" placeholder="What do we expect, and why?">${escapeHtml(s.hypothesis || '')}</textarea>
    </div>
    <div style="margin-top:12px;">
      <div class="section-label">Lessons Learned</div>
      <textarea class="notes-box" data-lessons="${s.id}" placeholder="What did we learn?">${escapeHtml(s.lessonsLearned || '')}</textarea>
    </div>
  `;
}

function renderMatrixSection(s) {
  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <button class="btn btn-ghost" data-add-matrix-row="${s.id}" style="padding:4px 8px;">+ Add row</button>
      </div>
      ${s.note ? `<div class="section-desc" style="margin-bottom:12px;">${escapeHtml(s.note)}</div>` : ''}
      ${s.metrics.length ? `
        <div class="tracker-scroll">
          <table class="list-table doc-fields-table">
            <thead>
              <tr>
                <th class="tracker-sticky-col">Metric</th>
                ${s.columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('')}
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${s.metrics.map((m) => `
                <tr>
                  <td class="tracker-sticky-col">${escapeHtml(m.label)}</td>
                  ${s.columns.map((c) => `
                    <td><input type="text" class="cell-input matrix-cell" data-row-id="${m.id}" data-section-id="${s.id}" data-col="${c.key}" value="${escapeHtml(m.values?.[c.key] ?? '')}" /></td>
                  `).join('')}
                  <td><button class="btn btn-ghost" data-remove-matrix-row="${s.id}|${m.id}" style="padding:3px 7px;">✕</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-hint">No rows yet.</div>'}
      ${renderHypothesisAndLessons(s)}
    </div>
  `;
}

function wireEvents(container, sections) {
  document.querySelectorAll('[data-add-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = sections.find((s) => s.id === btn.dataset.addRow);
      const row = { id: uid('gtmrow') };
      section.fields.forEach((f) => { row[f.key] = ''; });
      section.entries.push(row);
      commit();
      renderGtmExperiments(container);
    });
  });

  document.querySelectorAll('.doc-fields-table .cell-input:not(.matrix-cell)').forEach((input) => {
    input.addEventListener('input', () => {
      const section = sections.find((s) => s.id === input.dataset.sectionId);
      const entry = section.entries.find((e) => e.id === input.dataset.rowId);
      entry[input.dataset.field] = input.value;
      commit();
    });
  });

  document.querySelectorAll('[data-remove-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, rowId] = btn.dataset.removeRow.split('|');
      const section = sections.find((s) => s.id === sectionId);
      section.entries = section.entries.filter((e) => e.id !== rowId);
      commit();
      renderGtmExperiments(container);
    });
  });

  document.querySelectorAll('[data-add-matrix-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = sections.find((s) => s.id === btn.dataset.addMatrixRow);
      const label = prompt('Row label', '');
      if (!label) return;
      section.metrics.push({ id: uid('row'), label, values: {} });
      commit();
      renderGtmExperiments(container);
    });
  });

  document.querySelectorAll('.matrix-cell').forEach((input) => {
    input.addEventListener('input', () => {
      const section = sections.find((s) => s.id === input.dataset.sectionId);
      const metric = section.metrics.find((m) => m.id === input.dataset.rowId);
      metric.values = metric.values || {};
      metric.values[input.dataset.col] = input.value;
      commit();
    });
  });

  document.querySelectorAll('[data-remove-matrix-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, rowId] = btn.dataset.removeMatrixRow.split('|');
      const section = sections.find((s) => s.id === sectionId);
      section.metrics = section.metrics.filter((m) => m.id !== rowId);
      commit();
      renderGtmExperiments(container);
    });
  });

  document.querySelectorAll('[data-hypothesis]').forEach((ta) => {
    ta.addEventListener('input', () => {
      const section = sections.find((s) => s.id === ta.dataset.hypothesis);
      section.hypothesis = ta.value;
      commit();
    });
  });

  document.querySelectorAll('[data-lessons]').forEach((ta) => {
    ta.addEventListener('input', () => {
      const section = sections.find((s) => s.id === ta.dataset.lessons);
      section.lessonsLearned = ta.value;
      commit();
    });
  });
}
