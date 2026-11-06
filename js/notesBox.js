import { getData, commit } from './store.js';
import { escapeHtml } from './utils.js';

// One note per page, stored in data.pageNotes[pageKey]. The same note shows at the top of the page
// and on that page's card on Home, so editing either one changes both.
export function notesBoxHtml(pageKey, { compact = false } = {}) {
  const value = getData().pageNotes?.[pageKey] || '';
  const box = `<textarea class="notes-box ${compact ? 'cover-notes' : ''}" id="${compact ? 'card' : 'page'}-notes-${pageKey}" data-page-note="${pageKey}" placeholder="No notes yet." aria-label="Notes">${escapeHtml(value)}</textarea>`;
  return compact ? box : `
    <div class="page-notes-wrap">
      <div class="section-label">Notes</div>
      ${box}
    </div>
  `;
}

// Save notes as you type, wherever the box is.
export function startNotesSync() {
  document.addEventListener('input', (e) => {
    const box = e.target.closest?.('[data-page-note]');
    if (!box) return;
    const data = getData();
    data.pageNotes = data.pageNotes || {};
    data.pageNotes[box.dataset.pageNote] = box.value;
    commit();
    document.querySelectorAll(`[data-page-note="${box.dataset.pageNote}"]`).forEach((other) => {
      if (other !== box) other.value = box.value;
    });
  });
}
