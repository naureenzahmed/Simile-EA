import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { CLIENT_FIELDS } from '../seed.js';

export function renderClientMaterials(container) {
  const data = getData();
  const sections = data.clientMaterials;
  // Keep saved tables in step with the current column list.
  const clients = sections.find((s) => s.id === 'clients');
  if (clients) clients.fields = CLIENT_FIELDS;

  container.innerHTML = `
    <div id="client-sections" class="stack-16"></div>
  `;

  document.getElementById('client-sections').innerHTML = sections.map(renderSection).join('');
  wireEvents(container, sections);
}

function renderSection(s) {
  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <button class="btn btn-ghost" data-add-row="${s.id}" style="padding:4px 8px;">+ Add row</button>
      </div>
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
                    <td><input type="${f.type || 'text'}" class="cell-input" data-row-id="${entry.id}" data-section-id="${s.id}" data-field="${f.key}" value="${escapeHtml(entry[f.key] || '')}" /></td>
                  `).join('')}
                  <td><button class="btn btn-ghost" data-remove-row="${s.id}|${entry.id}" style="padding:3px 7px;">✕</button></td>
                </tr>
              `).join('') || `<tr><td colspan="${s.fields.length + 1}" class="empty-hint">No clients yet. Click "+ Add row" to add one.</td></tr>`}
            </tbody>
          </table>
      </div>
    </div>
  `;
}

function wireEvents(container, sections) {
  document.querySelectorAll('[data-add-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = sections.find((s) => s.id === btn.dataset.addRow);
      const row = { id: uid('client') };
      section.fields.forEach((f) => { row[f.key] = ''; });
      section.entries.push(row);
      commit();
      renderClientMaterials(container);
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
      renderClientMaterials(container);
    });
  });
}
