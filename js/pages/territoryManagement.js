import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';

export function renderTerritoryManagement(container) {
  const data = getData();
  const sections = data.territoryManagement;

  container.innerHTML = `
    ${notesBoxHtml('territoryManagement')}
    <div class="page-title">Territory Management</div>
    <div id="territory-sections" class="stack-16"></div>
  `;

  document.getElementById('territory-sections').innerHTML = sections.map(renderSection).join('');
  wireEvents(container, sections);
}

function renderSection(s) {
  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <button class="btn btn-ghost" data-add-row="${s.id}" style="padding:4px 8px;">+ Add row</button>
      </div>
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
    </div>
  `;
}

function wireEvents(container, sections) {
  document.querySelectorAll('[data-add-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = sections.find((s) => s.id === btn.dataset.addRow);
      const row = { id: uid('terrow') };
      section.fields.forEach((f) => { row[f.key] = ''; });
      section.entries.push(row);
      commit();
      renderTerritoryManagement(container);
    });
  });

  document.querySelectorAll('.doc-fields-table .cell-input').forEach((input) => {
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
      renderTerritoryManagement(container);
    });
  });
}
