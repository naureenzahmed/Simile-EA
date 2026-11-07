import { getData, commit } from '../store.js';
import { uid, escapeHtml, initials, colorForName } from '../utils.js';
import { isReadOnly } from '../readOnly.js';
import { notesBoxHtml } from '../notesBox.js';
import { BOARD_SECTIONS, CLEARANCE } from '../seed.js';

export const BOARD_TITLE = 'Board & Investor Support';

export function renderBoardInvestor(container) {
  const data = getData().boardInvestor;
  for (const s of BOARD_SECTIONS) data[s.id] = data[s.id] || [];
  data.links = data.links || {};

  container.innerHTML = `
    ${notesBoxHtml('boardInvestor')}
    <div class="page-title">${BOARD_TITLE}</div>
    <div class="stack-16">
      ${BOARD_SECTIONS.map((s) => renderSection(s, data[s.id], data.links[s.id] || '')).join('')}
    </div>
  `;

  wire(container, data);
}

function cell(s, row, f) {
  const key = `${s.id}|${row.id}|${f.key}`;
  const value = row[f.key] || '';
  if (f.type === 'multiline') {
    return `<textarea class="cell-input cell-textarea board-textarea" rows="2" data-board-cell="${key}">${escapeHtml(value)}</textarea>`;
  }
  if (f.type === 'url') {
    const href = /^https?:\/\//i.test(value) ? value : value ? `https://${value}` : '';
    return `
      <div class="board-link">
        <input type="url" class="cell-input" data-board-cell="${key}" value="${escapeHtml(value)}" placeholder="Paste link" />
        <a class="board-open ${href ? '' : 'hidden'}" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="Open link">↗</a>
      </div>`;
  }
  if (f.type === 'clearance') {
    const level = CLEARANCE.find((c) => c.key === value) || CLEARANCE[1];
    if (isReadOnly()) return `<span class="clearance-pill cl-${level.key}">${escapeHtml(level.label)}</span>`;
    return `<select class="cell-input board-clearance cl-${level.key}" data-board-cell="${key}">${CLEARANCE.map((c) => `<option value="${c.key}" ${c.key === level.key ? 'selected' : ''}>${escapeHtml(c.label)}</option>`).join('')}</select>`;
  }
  if (f.type === 'people') {
    const names = String(value).split(',').map((n) => n.trim()).filter(Boolean);
    const badges = names.map((n) => `<span class="dr-person" style="background:${colorForName(n)}" title="${escapeHtml(n)}">${initials(n)}</span>`).join('') || '<span class="empty-hint" style="padding:0;">No one yet</span>';
    if (isReadOnly()) return `<span class="dr-people">${badges}</span>`;
    return `<div class="dr-people-edit"><span class="dr-people">${badges}</span><input type="text" class="cell-input" data-board-cell="${key}" value="${escapeHtml(value)}" placeholder="Names, separated by commas" /></div>`;
  }
  return `<input type="${f.type === 'date' ? 'date' : 'text'}" class="cell-input ${f.width === 'sm' ? 'board-sm' : ''}" data-board-cell="${key}" value="${escapeHtml(value)}" />`;
}

const toHref = (v) => (/^https?:\/\//i.test(v) ? v : v ? `https://${v}` : '');

// A link shown at the top of a section, such as the Drive folder of past pitch decks.
function topLinkHtml(s, url) {
  if (!s.topLink) return '';
  const href = toHref(url);
  return `
    <div class="board-top-link">
      ${href
        ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(s.topLink)} ↗</a>`
        : `<span class="board-top-link-empty">${escapeHtml(s.topLink)}</span>`}
      <button class="btn btn-ghost" data-link-edit="${s.id}" style="padding:2px 8px;">${href ? 'Edit link' : '+ Add link'}</button>
      <span class="board-top-link-form hidden" data-link-form="${s.id}">
        <input type="url" class="cell-input" data-link-input="${s.id}" value="${escapeHtml(url)}" placeholder="Paste the Google Drive link" />
        <button class="btn btn-primary" data-link-save="${s.id}" style="padding:3px 10px;">Save</button>
      </span>
    </div>`;
}

function renderSection(s, rows, link) {
  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:2px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <button class="btn btn-ghost" data-board-add="${s.id}" style="padding:4px 8px;">+ ${escapeHtml(s.addLabel)}</button>
      </div>
      ${topLinkHtml(s, link)}
      <div class="section-desc">${escapeHtml(s.note)}</div>
      <div class="tracker-scroll">
        <table class="list-table doc-fields-table board-table">
          <thead>
            <tr>${s.fields.map((f) => `<th class="${f.type === 'multiline' ? 'board-wide' : ''}">${escapeHtml(f.label)}</th>`).join('')}<th></th></tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                ${s.fields.map((f) => `<td class="${f.type === 'multiline' ? 'board-wide' : ''}">${cell(s, row, f)}</td>`).join('')}
                <td><button class="btn btn-ghost" data-board-remove="${s.id}|${row.id}" style="padding:3px 7px;" title="Remove row">✕</button></td>
              </tr>
            `).join('') || `<tr><td colspan="${s.fields.length + 1}" class="empty-hint">Nothing here yet. Click "+ ${escapeHtml(s.addLabel)}" to add one.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function wire(container, data) {
  const rerender = () => renderBoardInvestor(container);

  container.querySelectorAll('[data-link-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const form = container.querySelector(`[data-link-form="${btn.dataset.linkEdit}"]`);
      form.classList.toggle('hidden');
      form.querySelector('input').focus();
    });
  });
  const saveLink = (id) => {
    data.links[id] = container.querySelector(`[data-link-input="${id}"]`).value.trim();
    commit();
    rerender();
  };
  container.querySelectorAll('[data-link-save]').forEach((btn) => btn.addEventListener('click', () => saveLink(btn.dataset.linkSave)));
  container.querySelectorAll('[data-link-input]').forEach((input) => input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveLink(input.dataset.linkInput);
    if (e.key === 'Escape') rerender();
  }));

  container.querySelectorAll('[data-board-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.boardAdd;
      data[id].push({ id: uid('row') });
      commit();
      rerender();
      const inputs = container.querySelectorAll(`#${id} tbody tr:last-child [data-board-cell]`);
      inputs[0]?.focus();
    });
  });

  container.querySelectorAll('[data-board-cell]').forEach((input) => {
    // Clearance and People redraw so the colored level and initials update.
    if (input.tagName === 'SELECT' || input.closest('.dr-people-edit')) {
      input.addEventListener('change', () => {
        const [sectionId, rowId, field] = input.dataset.boardCell.split('|');
        data[sectionId].find((r) => r.id === rowId)[field] = input.value;
        commit();
        rerender();
      });
      return;
    }
    input.addEventListener('input', () => {
      const [sectionId, rowId, field] = input.dataset.boardCell.split('|');
      const row = data[sectionId].find((r) => r.id === rowId);
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

  container.querySelectorAll('[data-board-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, rowId] = btn.dataset.boardRemove.split('|');
      const row = data[sectionId].find((r) => r.id === rowId);
      const filled = Object.entries(row).some(([k, v]) => k !== 'id' && v);
      if (filled && !confirm('Remove this row?')) return;
      data[sectionId] = data[sectionId].filter((r) => r.id !== rowId);
      commit();
      rerender();
    });
  });
}
