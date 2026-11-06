// Read-only mode. The site opens read-only; the Edit toggle in the header turns editing on
// until the page is reloaded. While read-only, nothing can be typed, added, removed or sent,
// but you can still browse, filter, switch views and open items to read them.

let readOnly = true;

export function isReadOnly() {
  return readOnly;
}

export function setReadOnly(value) {
  readOnly = value;
  document.body.classList.toggle('read-only', readOnly);
}

// Buttons that change data. Everything else (tabs, filters, Today, Close, jump links) stays.
const EDIT_BUTTON = /^(\+|✕|Add\b|Save\b|Delete\b|Remove\b|Edit\b|Cancel\b|Send\b|Mark complete|✓ Completed|Finish sprint|Slack$|Email$)/;
const ADD_FIELD = /^(\+ ?Add|Add a|Write a comment|Name, e\.g\.|Link$|Paste the Google Drive link|Section title|Document title)/;
// Clicks that would open an editor or a prompt.
const BLOCKED_CLICKS = '[data-rename-okr], [data-edit-kr], [data-edit-deadline], [data-edit-people], [data-edit-column], .ev-date';

function lock(root) {
  if (!(root instanceof Element) || root.closest('#app-header')) return;
  const all = (sel) => [root, ...root.querySelectorAll(sel)].filter((el) => el.matches?.(sel));

  all('button').forEach((b) => {
    // Close buttons on panels and pop-ups always stay.
    if (b.dataset.roKeep !== undefined || b.matches('[aria-label="Close"], [id$="-close"], [data-close]')) return;
    if (EDIT_BUTTON.test(b.textContent.trim())) b.classList.add('ro-hidden');
  });
  all('input, textarea').forEach((el) => {
    if (el.type === 'checkbox' || el.type === 'radio' || el.type === 'color') { el.disabled = true; return; }
    if (ADD_FIELD.test(el.placeholder || '')) { el.classList.add('ro-hidden'); return; }
    el.readOnly = true;
    if (el.type === 'date' || el.type === 'time') el.tabIndex = -1;
  });
  all('select').forEach((el) => { el.disabled = true; });
  all('[draggable="true"]').forEach((el) => { el.draggable = false; });
  all('.checklist-add-row, .inline-add-form, .sched-add-form, .board-top-link-form, .wk-doc-form').forEach((el) => el.classList.add('ro-hidden'));
}

export function startReadOnly(onToggle) {
  setReadOnly(true);

  // Lock whatever gets drawn while read-only: pages, side panels and pop-ups.
  new MutationObserver((records) => {
    if (!readOnly) return;
    for (const r of records) r.addedNodes.forEach(lock);
  }).observe(document.body, { childList: true, subtree: true });

  // Stop clicks that would start an edit: empty calendar days, prompt-based edits, column editors.
  document.addEventListener('click', (e) => {
    if (!readOnly || e.target.closest('#app-header')) return;
    const t = e.target;
    const emptyDay = (t.closest('[data-day]') && !t.closest('[data-entry]')) || (t.closest('[data-coo-day]') && !t.closest('[data-coo-event]'));
    if (emptyDay || t.closest(BLOCKED_CLICKS)) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('dragstart', (e) => { if (readOnly) e.preventDefault(); }, true);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toggle-edit]');
    if (!btn) return;
    setReadOnly(!readOnly);
    onToggle();
  });
}
