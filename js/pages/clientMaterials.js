import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { COLUMN_TYPES } from '../seed.js';

const TYPE_LABEL = Object.fromEntries(COLUMN_TYPES.map((t) => [t.key, t.label]));

export function renderClientMaterials(container) {
  const sections = getData().clientMaterials;

  container.innerHTML = `
    <div class="stack-16">${sections.map(renderSection).join('')}</div>
  `;

  wireEvents(container, sections);
}

function renderSection(s) {
  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-ghost" data-add-column="${s.id}" style="padding:4px 8px;">+ Add column</button>
          <button class="btn btn-ghost" data-add-row="${s.id}" style="padding:4px 8px;">+ Add row</button>
        </div>
      </div>
      <div class="section-desc">Click a column name to rename it, change its answer type or remove it.</div>
      <div class="tracker-scroll">
        <table class="list-table doc-fields-table client-table">
          <thead>
            <tr>
              ${s.fields.map((f) => `
                <th><button class="col-head" data-edit-column="${s.id}|${f.key}" title="Edit column">
                  ${escapeHtml(f.label)} <span class="col-head-type">${TYPE_LABEL[f.type || 'text'] || 'Text'}</span>
                </button></th>`).join('')}
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${s.entries.map((entry) => `
              <tr>
                ${s.fields.map((f) => `<td class="${f.type === 'multiline' ? 'client-wide' : ''}">${cell(s, entry, f)}</td>`).join('')}
                <td><button class="btn btn-ghost" data-remove-row="${s.id}|${entry.id}" style="padding:3px 7px;">✕</button></td>
              </tr>
            `).join('') || `<tr><td colspan="${s.fields.length + 1}" class="empty-hint">No clients yet. Click "+ Add row" to add one.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// One input per cell, shaped by the column's answer type.
function cell(s, entry, f) {
  const attrs = `class="cell-input" data-row-id="${entry.id}" data-section-id="${s.id}" data-field="${f.key}"`;
  const value = entry[f.key] ?? '';
  switch (f.type) {
    case 'multiline':
      return `<textarea ${attrs.replace('cell-input', 'cell-input cell-textarea client-textarea')} rows="2">${escapeHtml(value)}</textarea>`;
    case 'number':
    case 'date':
      return `<input type="${f.type}" ${attrs} value="${escapeHtml(value)}" />`;
    case 'checkbox':
      return `<input type="checkbox" ${attrs.replace('class="cell-input"', 'class="cell-check"')} ${value === true ? 'checked' : ''} />`;
    case 'select': {
      const options = f.options || [];
      const all = value && !options.includes(value) ? [value, ...options] : options;
      return `<select ${attrs}><option value=""></option>${all.map((o) => `<option ${o === value ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}</select>`;
    }
    case 'url': {
      const href = /^https?:\/\//i.test(value) ? value : value ? `https://${value}` : '';
      return `
        <div class="board-link">
          <input type="url" ${attrs} value="${escapeHtml(value)}" placeholder="Paste link" />
          <a class="board-open ${href ? '' : 'hidden'}" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="Open link">↗</a>
        </div>`;
    }
    default:
      return `<input type="text" ${attrs} value="${escapeHtml(value)}" />`;
  }
}

function wireEvents(container, sections) {
  const rerender = () => renderClientMaterials(container);
  const findSection = (id) => sections.find((s) => s.id === id);

  container.querySelectorAll('[data-add-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      findSection(btn.dataset.addRow).entries.push({ id: uid('client') });
      commit();
      rerender();
    });
  });

  container.querySelectorAll('[data-field]').forEach((input) => {
    const save = () => {
      const entry = findSection(input.dataset.sectionId).entries.find((e) => e.id === input.dataset.rowId);
      entry[input.dataset.field] = input.type === 'checkbox' ? input.checked : input.value;
      commit();
      // Keep the "open link" arrow in step with the typed link.
      const open = input.parentElement.querySelector('.board-open');
      if (open) {
        const v = input.value.trim();
        open.href = /^https?:\/\//i.test(v) ? v : `https://${v}`;
        open.classList.toggle('hidden', !v);
      }
    };
    input.addEventListener(input.tagName === 'SELECT' || input.type === 'checkbox' ? 'change' : 'input', save);
  });

  container.querySelectorAll('[data-remove-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, rowId] = btn.dataset.removeRow.split('|');
      const section = findSection(sectionId);
      section.entries = section.entries.filter((e) => e.id !== rowId);
      commit();
      rerender();
    });
  });

  container.querySelectorAll('[data-add-column]').forEach((btn) => {
    btn.addEventListener('click', () => openColumnPanel(findSection(btn.dataset.addColumn), null, rerender));
  });

  container.querySelectorAll('[data-edit-column]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, key] = btn.dataset.editColumn.split('|');
      const section = findSection(sectionId);
      openColumnPanel(section, section.fields.find((f) => f.key === key), rerender);
    });
  });
}

// Side panel for adding or editing a column: name, answer type, dropdown options and position.
function openColumnPanel(section, field, rerender) {
  closePanel();
  const f = field || { label: '', type: 'text', options: [] };
  const index = field ? section.fields.indexOf(field) : section.fields.length;

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'col-overlay';
  const panel = document.createElement('div');
  panel.className = 'task-sidebar';
  panel.id = 'col-panel';
  panel.innerHTML = `
    <div class="ts-header">
      <strong>${field ? 'Edit column' : 'New column'}</strong>
      <button class="btn btn-ghost" id="cp-close" aria-label="Close">✕</button>
    </div>
    <div class="ts-body">
      <div class="ts-field"><div class="ts-field-label">Column name</div>
        <input type="text" id="cp-name" value="${escapeHtml(f.label)}" placeholder="e.g. Contract Value" />
      </div>
      <div class="ts-field"><div class="ts-field-label">Answer type</div>
        <select id="cp-type">${COLUMN_TYPES.map((t) => `<option value="${t.key}" ${t.key === (f.type || 'text') ? 'selected' : ''}>${t.label}</option>`).join('')}</select>
        <div class="col-type-hint" id="cp-hint"></div>
      </div>
      <div class="ts-field" id="cp-options-field">
        <div class="ts-field-label">Dropdown options</div>
        <textarea id="cp-options" placeholder="One option per line">${escapeHtml((f.options || []).join('\n'))}</textarea>
      </div>
      <div class="ts-field"><div class="ts-field-label">Position</div>
        <select id="cp-position">
          ${section.fields.filter((x) => x !== field).map((x, i) => `<option value="${i}" ${i === index ? 'selected' : ''}>Before ${escapeHtml(x.label)}</option>`).join('')}
          <option value="end" ${index >= section.fields.length - (field ? 1 : 0) ? 'selected' : ''}>At the end</option>
        </select>
      </div>
      <div class="sched-panel-actions">
        <button class="btn btn-primary" id="cp-save">Save</button>
        <button class="btn btn-ghost" id="cp-cancel">Cancel</button>
        ${field ? '<button class="btn btn-ghost btn-danger" id="cp-delete" style="margin-left:auto;">Delete column</button>' : ''}
      </div>
    </div>
  `;
  document.body.append(overlay, panel);

  const HINTS = {
    text: 'A short line of text.',
    multiline: 'A larger box for notes and longer answers.',
    number: 'Numbers only.',
    date: 'Pick a date from a calendar.',
    url: 'A link, with an arrow to open it.',
    select: 'Pick one answer from a list you set below.',
    checkbox: 'A tick box for yes or no.',
  };
  const typeSel = panel.querySelector('#cp-type');
  const syncType = () => {
    panel.querySelector('#cp-options-field').style.display = typeSel.value === 'select' ? '' : 'none';
    panel.querySelector('#cp-hint').textContent = HINTS[typeSel.value];
  };
  typeSel.addEventListener('change', syncType);
  syncType();
  panel.querySelector('#cp-name').focus();

  overlay.addEventListener('click', closePanel);
  panel.querySelector('#cp-close').addEventListener('click', closePanel);
  panel.querySelector('#cp-cancel').addEventListener('click', closePanel);

  panel.querySelector('#cp-save').addEventListener('click', () => {
    const nameInput = panel.querySelector('#cp-name');
    const label = nameInput.value.trim();
    if (!label) { nameInput.focus(); return; }
    const type = typeSel.value;
    const updated = { key: field ? field.key : uid('col'), label, type };
    if (type === 'select') {
      updated.options = [...new Set(panel.querySelector('#cp-options').value.split('\n').map((o) => o.trim()).filter(Boolean))];
    }
    // A column that stops being a checkbox shouldn't show "true" as text, and vice versa.
    const wasCheckbox = field?.type === 'checkbox';
    if (field && wasCheckbox !== (type === 'checkbox')) {
      for (const e of section.entries) delete e[field.key];
    }
    const rest = section.fields.filter((x) => x !== field);
    const pos = panel.querySelector('#cp-position').value;
    rest.splice(pos === 'end' ? rest.length : Number(pos), 0, updated);
    section.fields = rest;
    commit();
    closePanel();
    rerender();
  });

  panel.querySelector('#cp-delete')?.addEventListener('click', () => {
    if (!confirm(`Delete the "${field.label}" column and everything in it?`)) return;
    section.fields = section.fields.filter((x) => x !== field);
    for (const e of section.entries) delete e[field.key];
    commit();
    closePanel();
    rerender();
  });
}

function closePanel() {
  document.getElementById('col-overlay')?.remove();
  document.getElementById('col-panel')?.remove();
}
