import { getData, commit, findTask, findPerson } from './store.js';
import { uid, fmtDate, initials, colorForName, escapeHtml } from './utils.js';
import { notifySlack, getSlackWebhookUrl } from './slackNotify.js';

const STATUS_OPTIONS = ['No status', 'Backlog', 'Ready', 'In progress', 'In design', 'Committed', 'Done'];

let onCloseCallback = null;

export function openTaskSidebar(taskId, onClose) {
  onCloseCallback = onClose;
  render(taskId);
}

export function closeTaskSidebar() {
  document.getElementById('sidebar-root').innerHTML = '';
  if (onCloseCallback) onCloseCallback();
}

function computeConflicts(task, allTasks) {
  const conflicts = [];
  (task.blockedBy || []).forEach((bid) => {
    const blocker = allTasks.find((t) => t.id === bid);
    if (blocker && blocker.endDate > task.startDate) {
      conflicts.push(`Starts before its dependency “${blocker.title}” finishes (${fmtDate(blocker.endDate)})`);
    }
  });
  allTasks.forEach((t) => {
    if ((t.blockedBy || []).includes(task.id) && task.endDate > t.startDate) {
      conflicts.push(`“${t.title}” depends on this but starts before it finishes (${fmtDate(t.startDate)})`);
    }
  });
  return conflicts;
}

function render(taskId) {
  const task = findTask(taskId);
  const root = document.getElementById('sidebar-root');
  if (!task) { root.innerHTML = ''; return; }

  const data = getData();
  const needsInfo = !task.description?.trim() || !task.impact?.trim();
  const dependingTasks = data.tasks.filter((t) => (t.blockedBy || []).includes(task.id));
  const conflicts = computeConflicts(task, data.tasks);
  const conflictingBlockerIds = new Set(
    (task.blockedBy || []).filter((bid) => {
      const blocker = findTask(bid);
      return blocker && blocker.endDate > task.startDate;
    })
  );

  root.innerHTML = `
    <div class="sidebar-overlay" id="ts-overlay"></div>
    <div class="task-sidebar">
      <div class="ts-header">
        <button class="btn ${task.status === 'Done' ? 'btn-primary' : ''}" id="ts-complete">
          ${task.status === 'Done' ? '✓ Completed' : 'Mark complete'}
        </button>
        <button class="btn btn-ghost" id="ts-close">✕</button>
      </div>
      <div class="ts-body">
        <input class="ts-title-input" id="ts-title" value="${escapeHtml(task.title)}" placeholder="Objective title" />

        ${needsInfo ? `<div class="ts-warning">Add a description and an impact before marking this objective complete.</div>` : ''}
        ${conflicts.length ? `
          <div class="ts-conflict">
            <b>Scheduling conflict${conflicts.length > 1 ? 's' : ''}</b>
            <ul style="margin:4px 0 0; padding-left:16px;">
              ${conflicts.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="ts-field">
          <div class="ts-field-label">Description · Required</div>
          <textarea id="ts-description" placeholder="What is this objective?">${escapeHtml(task.description)}</textarea>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Impact · Required</div>
          <input type="text" id="ts-impact" value="${escapeHtml(task.impact)}" placeholder="What's the impact? Keep it short, with numbers or a clear outcome." />
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Status</div>
          <select id="ts-status">
            ${STATUS_OPTIONS.map((s) => `<option value="${s}" ${s === task.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Owner</div>
          <select id="ts-assignee">
            <option value="">No owner</option>
            ${data.people.map((p) => `<option value="${p.id}" ${p.id === task.assigneeId ? 'selected' : ''}>${escapeHtml(p.name)}${p.role ? ` (${escapeHtml(p.role)})` : ''}</option>`).join('')}
          </select>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Dates</div>
          <div class="ts-inline">
            <input type="date" id="ts-start" value="${task.startDate}" />
            <input type="date" id="ts-end" value="${task.endDate}" />
          </div>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Design deadline</div>
          <input type="date" id="ts-design-deadline" value="${task.designDeadline || ''}" />
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Initiative</div>
          <select id="ts-section">
            ${data.initiatives.map((i) => `<option value="${i.id}" ${i.id === task.sectionId ? 'selected' : ''}>${i.name}</option>`).join('')}
          </select>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Created by</div>
          <div style="color: var(--text-dim); font-size: 13px;">${escapeHtml(task.createdBy || 'You')}</div>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Client</div>
          <input type="text" id="ts-client" value="${escapeHtml(task.client || '')}" placeholder="Who asked for this?" />
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Department</div>
          <select id="ts-team">
            ${data.teams.map((t) => `<option value="${t.id}" ${t.id === task.teamId ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Blocked by (depends on)</div>
          <div id="ts-blockers">
            ${task.blockedBy.map((bid) => {
              const bt = findTask(bid);
              const conflictClass = conflictingBlockerIds.has(bid) ? ' ts-chip-conflict' : '';
              return bt ? `<span class="ts-chip${conflictClass}">${escapeHtml(bt.title)}<button data-remove-blocker="${bid}">✕</button></span>` : '';
            }).join('') || '<span class="empty-hint" style="padding:0;">None</span>'}
          </div>
          <button class="btn btn-ghost" id="ts-add-blocker" style="margin-top:6px; padding: 4px 8px;">+ Add dependency</button>
          <select id="ts-blocker-select" style="display:none; margin-top:6px;"></select>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Dependent objectives</div>
          <div id="ts-dependents">
            ${dependingTasks.map((t) => `<span class="ts-chip">${escapeHtml(t.title)}</span>`).join('') || '<span class="empty-hint" style="padding:0;">Nothing depends on this yet.</span>'}
          </div>
        </div>

        <div class="ts-field">
          <div class="ts-field-label">Tasks</div>
          <div id="ts-subtasks">
            ${task.subtasks.map((s) => `
              <div class="ts-subtask-row">
                <input type="checkbox" data-subtask-toggle="${s.id}" ${s.done ? 'checked' : ''} />
                <span style="${s.done ? 'text-decoration: line-through; color: var(--text-faint);' : ''}">${escapeHtml(s.title)}</span>
                <button class="btn btn-ghost" data-subtask-remove="${s.id}" style="margin-left:auto; padding:2px 6px;">✕</button>
              </div>
            `).join('')}
          </div>
          <div class="ts-inline" style="margin-top:6px;">
            <input type="text" id="ts-subtask-input" placeholder="Add a task…" />
            <button class="btn" id="ts-subtask-add" style="flex: 0 0 auto;">Add</button>
          </div>
        </div>

        ${renderMeetingSections(task, data)}

        <div style="padding-top: 10px;">
          <div class="ts-field-label">Comments</div>
          <div id="ts-comments">
            ${task.comments.map((c) => `
              <div class="ts-comment">
                <div class="ts-comment-meta">${escapeHtml(c.author)} · ${new Date(c.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
                <div>${escapeHtml(c.text)}</div>
              </div>
            `).join('')}
          </div>
          <div class="ts-inline" style="margin-top:8px;">
            <textarea id="ts-comment-input" placeholder="Write a comment…" style="min-height: 40px;"></textarea>
          </div>
          <button class="btn" id="ts-comment-add" style="margin-top:6px;">Send</button>
        </div>
      </div>
      <div class="ts-footer">
        <button class="btn btn-danger" id="ts-delete">Delete objective</button>
      </div>
    </div>
  `;

  wireEvents(task);
}

const toHref = (v) => (/^https?:\/\//i.test(v) ? v : v ? `https://${v}` : '');

// Granola notes, documentation and action items per person, with buttons to send the action items.
function renderMeetingSections(task, data) {
  const docs = task.docs || [];
  const items = task.actionItems || [];
  const people = data.people || [];
  const nameOf = (id) => people.find((p) => p.id === id)?.name || 'No owner';
  const groups = [...new Set(items.map((i) => i.personId || ''))];
  const granolaHref = toHref(task.granolaUrl || '');
  return `
    <div class="ts-field">
      <div class="ts-field-label">Granola Notes</div>
      <div class="board-link">
        <input type="text" id="ts-granola-url" value="${escapeHtml(task.granolaUrl || '')}" placeholder="Paste the Granola note link" />
        <a class="board-open ${granolaHref ? '' : 'hidden'}" id="ts-granola-open" href="${escapeHtml(granolaHref)}" target="_blank" rel="noopener" title="Open in Granola">↗</a>
      </div>
      <textarea id="ts-granola" class="ts-granola" placeholder="Paste the meeting notes from Granola here.">${escapeHtml(task.granolaNotes || '')}</textarea>
    </div>

    <div class="ts-field">
      <div class="ts-field-label">Documentation</div>
      <div class="ts-docs">
        ${docs.map((d) => `
          <div class="ts-doc-row">
            ${toHref(d.url) ? `<a href="${escapeHtml(toHref(d.url))}" target="_blank" rel="noopener">${escapeHtml(d.title || d.url)} ↗</a>` : `<span>${escapeHtml(d.title)}</span>`}
            <button class="btn btn-ghost" data-doc-remove="${d.id}" style="margin-left:auto; padding:2px 6px;" title="Remove">✕</button>
          </div>`).join('') || '<span class="empty-hint" style="padding:0;">No documents yet.</span>'}
      </div>
      <div class="ts-inline" style="margin-top:6px;">
        <input type="text" id="ts-doc-title" placeholder="Name, e.g. Launch brief" />
        <input type="text" id="ts-doc-url" placeholder="Link" />
        <button class="btn" id="ts-doc-add" style="flex: 0 0 auto;">Add</button>
      </div>
    </div>

    <div class="ts-field">
      <div class="ts-field-label">Action Items</div>
      ${groups.map((g) => `
        <div class="ts-ai-group">
          <div class="ts-ai-person"><span class="avatar" style="background:${colorForName(nameOf(g))};">${initials(nameOf(g))}</span>${escapeHtml(nameOf(g))}</div>
          ${items.filter((i) => (i.personId || '') === g).map((i) => `
            <div class="ts-subtask-row">
              <input type="checkbox" data-ai-toggle="${i.id}" ${i.done ? 'checked' : ''} aria-label="Done" />
              <span style="${i.done ? 'text-decoration: line-through; color: var(--text-faint);' : ''}">${escapeHtml(i.text)}</span>
              <button class="btn btn-ghost" data-ai-remove="${i.id}" style="margin-left:auto; padding:2px 6px;" title="Remove">✕</button>
            </div>`).join('')}
        </div>`).join('') || '<span class="empty-hint" style="padding:0;">No action items yet.</span>'}
      <div class="ts-inline" style="margin-top:8px;">
        <select id="ts-ai-person" style="flex: 0 0 130px;">
          ${people.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}
        </select>
        <input type="text" id="ts-ai-text" placeholder="Add an action item…" />
        <button class="btn" id="ts-ai-add" style="flex: 0 0 auto;">Add</button>
      </div>

      <div class="ts-send">
        <div class="ts-send-title">Send action items</div>
        <div class="ts-send-buttons">
          <button class="btn btn-primary" id="ts-send-slack">Slack</button>
          <button class="btn" id="ts-send-email">Email</button>
        </div>
        <div class="ts-send-status" id="ts-send-status" role="status"></div>
      </div>
    </div>
  `;
}

// Open action items, grouped by person, as plain text for Slack or email.
function actionItemsText(task, data) {
  const open = (task.actionItems || []).filter((i) => !i.done);
  if (!open.length) return '';
  const nameOf = (id) => (data.people || []).find((p) => p.id === id)?.name || 'No owner';
  const groups = [...new Set(open.map((i) => i.personId || ''))];
  return [
    `Action items: ${task.title}${task.endDate ? ` (due ${fmtDate(task.endDate)})` : ''}`,
    ...groups.map((g) => `\n${nameOf(g)}\n${open.filter((i) => (i.personId || '') === g).map((i) => `• ${i.text}`).join('\n')}`),
  ].join('\n');
}

function notifyConflictsIfAny(task, conflicts) {
  if (conflicts.length) {
    notifySlack(`⚠️ Conflict on objective "${task.title}": ${conflicts[0]}${conflicts.length > 1 ? ` (+${conflicts.length - 1} more)` : ''}`);
  }
}

function wireEvents(task) {
  const data = getData();
  const close = () => closeTaskSidebar();

  document.getElementById('ts-overlay').addEventListener('click', close);
  document.getElementById('ts-close').addEventListener('click', close);

  const field = (id, key, label, { transform = (v) => v, checkConflicts = false } = {}) => {
    document.getElementById(id).addEventListener('change', (e) => {
      task[key] = transform(e.target.value);
      commit();
      notifySlack(`Objective "${task.title}" updated: ${label} changed.`);
      if (checkConflicts) notifyConflictsIfAny(task, computeConflicts(task, data.tasks));
      if (onCloseCallback) onCloseCallback();
      render(task.id);
    });
  };
  const liveField = (id, key) => {
    document.getElementById(id).addEventListener('input', (e) => {
      task[key] = e.target.value;
      commit();
      if (onCloseCallback) onCloseCallback();
    });
  };

  liveField('ts-title', 'title');
  liveField('ts-description', 'description');
  liveField('ts-impact', 'impact');
  liveField('ts-client', 'client');
  field('ts-status', 'status', 'status');
  field('ts-assignee', 'assigneeId', 'owner', { transform: (v) => v || null });
  field('ts-start', 'startDate', 'start date', { checkConflicts: true });
  field('ts-end', 'endDate', 'end date', { checkConflicts: true });
  field('ts-design-deadline', 'designDeadline', 'design deadline');
  field('ts-section', 'sectionId', 'initiative');
  field('ts-team', 'teamId', 'department');

  document.getElementById('ts-complete').addEventListener('click', () => {
    if (!task.description?.trim() || !task.impact?.trim()) {
      render(task.id);
      return;
    }
    task.status = task.status === 'Done' ? 'In progress' : 'Done';
    commit();
    notifySlack(`Objective "${task.title}" marked ${task.status === 'Done' ? 'complete' : 'incomplete'}.`);
    if (onCloseCallback) onCloseCallback();
    render(task.id);
  });

  document.getElementById('ts-delete').addEventListener('click', () => {
    if (!confirm('Delete this objective?')) return;
    const idx = data.tasks.findIndex((t) => t.id === task.id);
    if (idx >= 0) data.tasks.splice(idx, 1);
    commit();
    notifySlack(`Objective "${task.title}" deleted.`);
    closeTaskSidebar();
  });

  document.querySelectorAll('[data-remove-blocker]').forEach((btn) => {
    btn.addEventListener('click', () => {
      task.blockedBy = task.blockedBy.filter((id) => id !== btn.dataset.removeBlocker);
      commit();
      render(task.id);
    });
  });

  document.getElementById('ts-add-blocker').addEventListener('click', () => {
    const select = document.getElementById('ts-blocker-select');
    const candidates = data.tasks.filter((t) => t.id !== task.id && !task.blockedBy.includes(t.id));
    if (!candidates.length) { alert('No other objectives to depend on yet.'); return; }
    select.innerHTML = `<option value="">Choose an objective…</option>` + candidates.map((t) => `<option value="${t.id}">${escapeHtml(t.title)}</option>`).join('');
    select.style.display = 'block';
    select.onchange = () => {
      if (select.value) {
        task.blockedBy.push(select.value);
        commit();
        const newConflicts = computeConflicts(task, data.tasks);
        notifySlack(`Objective "${task.title}" now depends on "${findTask(select.value).title}".`);
        notifyConflictsIfAny(task, newConflicts);
        render(task.id);
      }
    };
  });

  document.getElementById('ts-subtask-add').addEventListener('click', () => {
    const input = document.getElementById('ts-subtask-input');
    if (!input.value.trim()) return;
    task.subtasks.push({ id: uid('sub'), title: input.value.trim(), done: false });
    commit();
    render(task.id);
  });

  document.querySelectorAll('[data-subtask-toggle]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const s = task.subtasks.find((s) => s.id === cb.dataset.subtaskToggle);
      if (s) s.done = cb.checked;
      commit();
      render(task.id);
    });
  });
  document.querySelectorAll('[data-subtask-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      task.subtasks = task.subtasks.filter((s) => s.id !== btn.dataset.subtaskRemove);
      commit();
      render(task.id);
    });
  });

  // Granola notes and documentation
  document.getElementById('ts-granola-url').addEventListener('input', (e) => {
    task.granolaUrl = e.target.value.trim();
    commit();
    const open = document.getElementById('ts-granola-open');
    open.href = toHref(task.granolaUrl);
    open.classList.toggle('hidden', !task.granolaUrl);
  });
  document.getElementById('ts-granola').addEventListener('input', (e) => { task.granolaNotes = e.target.value; commit(); });
  const addDoc = () => {
    const title = document.getElementById('ts-doc-title').value.trim();
    const url = document.getElementById('ts-doc-url').value.trim();
    if (!title && !url) return;
    (task.docs = task.docs || []).push({ id: uid('doc'), title, url });
    commit();
    render(task.id);
  };
  document.getElementById('ts-doc-add').addEventListener('click', addDoc);
  document.getElementById('ts-doc-url').addEventListener('keydown', (e) => { if (e.key === 'Enter') addDoc(); });
  document.querySelectorAll('[data-doc-remove]').forEach((btn) => btn.addEventListener('click', () => {
    task.docs = task.docs.filter((d) => d.id !== btn.dataset.docRemove);
    commit();
    render(task.id);
  }));

  // Action items per person
  const addItem = () => {
    const input = document.getElementById('ts-ai-text');
    if (!input.value.trim()) return;
    const personId = document.getElementById('ts-ai-person').value;
    (task.actionItems = task.actionItems || []).push({ id: uid('ai'), personId, text: input.value.trim(), done: false });
    commit();
    render(task.id);
    const sel = document.getElementById('ts-ai-person');
    sel.value = personId;
    document.getElementById('ts-ai-text').focus();
  };
  document.getElementById('ts-ai-add').addEventListener('click', addItem);
  document.getElementById('ts-ai-text').addEventListener('keydown', (e) => { if (e.key === 'Enter') addItem(); });
  document.querySelectorAll('[data-ai-toggle]').forEach((cb) => cb.addEventListener('change', () => {
    task.actionItems.find((i) => i.id === cb.dataset.aiToggle).done = cb.checked;
    commit();
    render(task.id);
  }));
  document.querySelectorAll('[data-ai-remove]').forEach((btn) => btn.addEventListener('click', () => {
    task.actionItems = task.actionItems.filter((i) => i.id !== btn.dataset.aiRemove);
    commit();
    render(task.id);
  }));

  const status = (msg) => { document.getElementById('ts-send-status').textContent = msg; };
  document.getElementById('ts-send-slack').addEventListener('click', () => {
    const text = actionItemsText(task, data);
    if (!text) return status('There are no open action items to send.');
    if (!getSlackWebhookUrl()) return status('Slack isn’t connected yet. Click the Slack button at the top of GTM Roadmap and paste your Slack webhook link.');
    notifySlack(text);
    status('Sent to your Slack channel.');
  });
  document.getElementById('ts-send-email').addEventListener('click', () => {
    const text = actionItemsText(task, data);
    if (!text) return status('There are no open action items to send.');
    window.location.href = `mailto:?subject=${encodeURIComponent(`Action items: ${task.title}`)}&body=${encodeURIComponent(text)}`;
    status('Opened a draft in your email app.');
  });

  document.getElementById('ts-comment-add').addEventListener('click', () => {
    const input = document.getElementById('ts-comment-input');
    if (!input.value.trim()) return;
    task.comments.push({ id: uid('c'), author: 'You', text: input.value.trim(), ts: Date.now() });
    commit();
    render(task.id);
  });
}
