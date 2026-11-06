import { getData, commit } from '../store.js';
import { isReadOnly } from '../readOnly.js';
import { uid, escapeHtml, todayISO } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';
import { PIPELINE_SECTIONS, REVENUE_HISTORY, seedPipeline } from '../seed.js';

export const PIPELINE_TITLE = 'Pipeline & Forecasts';

const money = (v) => (v >= 1e9 ? `$${+(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `$${+(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${Math.round(v / 1e3)}K` : `$${v}`);
const monthName = (ym, long) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', long ? { month: 'long', year: 'numeric' } : { month: 'short' });
};
const toHref = (v) => (/^https?:\/\//i.test(v) ? v : v ? `https://${v}` : '');

export function renderPipeline(container) {
  const data = getData();
  if (!data.pipeline) { data.pipeline = seedPipeline(); commit(); }
  const p = data.pipeline;
  for (const s of PIPELINE_SECTIONS) p[s.id] = p[s.id] || [];

  container.innerHTML = `
    ${notesBoxHtml('pipeline')}
    <div class="page-title">${PIPELINE_TITLE}</div>
    ${renderRevenue()}
    <div class="stack-16" style="margin-top:28px;">
      <datalist id="pipeline-people">${(data.people || []).map((x) => `<option value="${escapeHtml(x.name)}"></option>`).join('')}</datalist>
      ${PIPELINE_SECTIONS.map((s) => renderTable(s, p[s.id])).join('')}
      <div class="card doc-card" id="pipeline-glance"></div>
    </div>
  `;
  renderGlance(container, p);
  wireChart(container);
  wireTables(container, p);
}

/* ---------- Revenue chart ---------- */
const W = 900, H = 300, PAD = { l: 56, r: 64, t: 28, b: 40 };

function renderRevenue() {
  const pts = REVENUE_HISTORY;
  const n = pts.length;
  const last = pts[n - 1], growthFrom = pts[n - 6];
  const max = 250e6;
  const x = (i) => PAD.l + (i * (W - PAD.l - PAD.r)) / (n - 1);
  const y = (v) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
  const line = pts.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.revenue).toFixed(1)}`).join(' ');
  const area = `${line} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0, 50e6, 100e6, 150e6, 200e6, 250e6];
  const bandX = x(n - 6);

  return `
    <div class="card pf-revenue" id="pipeline-revenue">
      <div class="pf-head">
        <div>
          <div class="section-label" style="margin:0;">Revenue run-rate by month</div>
          <div class="pf-hero">${money(last.revenue)}<sup class="pf-ast" aria-hidden="true">*</sup></div>
          <div class="pf-sub">Annualized revenue run-rate as of ${monthName(last.month, true)}</div>
          <div class="pf-estimate"><span aria-hidden="true">*</span>Estimate for illustration only. Not a real figure.</div>
        </div>
        <div class="pf-facts">
          <div><span class="pf-fact-num">${Math.round(last.revenue / growthFrom.revenue)}x</span><span>growth in the last 5 months</span></div>
        </div>
      </div>
      <div class="pf-chart-wrap">
        <svg class="pf-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Simile annualized revenue run-rate by month, from $0 in ${monthName(pts[0].month, true)} to ${money(last.revenue)} in ${monthName(last.month, true)}, growing ${Math.round(last.revenue / growthFrom.revenue)}x in the last 5 months.">
          <rect class="pf-band" x="${bandX}" y="${PAD.t}" width="${x(n - 1) - bandX}" height="${H - PAD.t - PAD.b}" />
          <text class="pf-band-label" x="${(bandX + x(n - 1)) / 2}" y="${PAD.t - 10}" text-anchor="middle">${Math.round(last.revenue / growthFrom.revenue)}x in the last 5 months</text>
          ${ticks.map((t) => `
            <line class="pf-grid" x1="${PAD.l}" x2="${W - PAD.r}" y1="${y(t)}" y2="${y(t)}" />
            <text class="pf-axis" x="${PAD.l - 8}" y="${y(t) + 4}" text-anchor="end">${money(t)}</text>`).join('')}
          ${pts.map((d, i) => `
            <text class="pf-axis" x="${x(i)}" y="${H - PAD.b + 18}" text-anchor="middle">${monthName(d.month)}</text>
            <text class="pf-axis pf-axis-month" x="${x(i)}" y="${H - PAD.b + 32}" text-anchor="middle">${i === 0 ? 'Month 1' : i === n - 1 ? 'Month 14' : ''}</text>`).join('')}
          <path class="pf-area" d="${area}" />
          <path class="pf-line" d="${line}" />
          <circle class="pf-dot" cx="${x(0)}" cy="${y(0)}" r="5" />
          <text class="pf-note" x="${x(0) + 10}" y="${y(0) - 12}">Founded, $0</text>
          <circle class="pf-dot" cx="${x(n - 1)}" cy="${y(last.revenue)}" r="5" />
          <text class="pf-end" x="${x(n - 1) + 10}" y="${y(last.revenue) + 4}">${money(last.revenue)}*</text>
          <line class="pf-cross" id="pf-cross" y1="${PAD.t}" y2="${H - PAD.b}" x1="0" x2="0" />
          <circle class="pf-dot pf-hover-dot" id="pf-hover-dot" r="5" cx="-10" cy="-10" />
          <rect class="pf-hit" id="pf-hit" x="${PAD.l}" y="${PAD.t}" width="${W - PAD.l - PAD.r}" height="${H - PAD.t - PAD.b}" />
        </svg>
        <div class="pf-tip" id="pf-tip" role="status"></div>
      </div>
      <details class="pf-table">
        <summary>Show as a table</summary>
        <table class="list-table">
          <thead><tr><th>Month</th><th>Age</th><th>Run-Rate</th></tr></thead>
          <tbody>${pts.map((d, i) => `<tr><td>${monthName(d.month, true)}</td><td>Month ${i + 1}</td><td>${money(d.revenue)}</td></tr>`).join('')}</tbody>
        </table>
      </details>
      <div class="pf-footnote">Example numbers for demonstration.</div>
    </div>
  `;
}

// Crosshair and tooltip that snap to the nearest month.
function wireChart(container) {
  const svg = container.querySelector('.pf-chart');
  const hit = container.querySelector('#pf-hit');
  const tip = container.querySelector('#pf-tip');
  const cross = container.querySelector('#pf-cross');
  const dot = container.querySelector('#pf-hover-dot');
  const pts = REVENUE_HISTORY;
  const n = pts.length;
  const max = 250e6;
  const x = (i) => PAD.l + (i * (W - PAD.l - PAD.r)) / (n - 1);
  const y = (v) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);

  const show = (i) => {
    const d = pts[i];
    cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i));
    dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(d.revenue));
    svg.classList.add('hovering');
    const prev = i ? pts[i - 1].revenue : 0;
    tip.innerHTML = `<strong>${monthName(d.month, true)}</strong><span>Month ${i + 1}</span><b>${money(d.revenue)}</b>${i && prev ? `<span>${d.revenue >= prev ? '+' : ''}${Math.round(((d.revenue - prev) / prev) * 100)}% vs prior month</span>` : ''}`;
    const r = svg.getBoundingClientRect();
    const px = (x(i) / W) * r.width;
    tip.style.left = `${Math.min(Math.max(px, 70), r.width - 70)}px`;
    tip.style.top = `${(y(d.revenue) / H) * r.height}px`;
    tip.classList.add('on');
  };
  const hide = () => { svg.classList.remove('hovering'); tip.classList.remove('on'); };
  hit.addEventListener('mousemove', (e) => {
    const r = svg.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    show(Math.max(0, Math.min(n - 1, Math.round(((vx - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1)))));
  });
  hit.addEventListener('mouseleave', hide);
}

/* ---------- Target Accounts and Lead Lists ---------- */
function cell(s, row, f) {
  const key = `${s.id}|${row.id}|${f.key}`;
  const value = row[f.key] || '';
  if (f.type === 'select') {
    const opts = value && !f.options.includes(value) ? [value, ...f.options] : f.options;
    return `<select class="cell-input" data-pf-cell="${key}"><option value=""></option>${opts.map((o) => `<option ${o === value ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}</select>`;
  }
  if (f.type === 'url') {
    const href = toHref(value);
    return `<div class="board-link"><input type="url" class="cell-input" data-pf-cell="${key}" value="${escapeHtml(value)}" placeholder="Paste link" /><a class="board-open ${href ? '' : 'hidden'}" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="Open link">↗</a></div>`;
  }
  if (f.type === 'date') return `<input type="date" class="cell-input" data-pf-cell="${key}" value="${escapeHtml(value)}" />`;
  return `<input type="text" class="cell-input" data-pf-cell="${key}" value="${escapeHtml(value)}" ${f.key === 'poc' ? 'list="pipeline-people"' : ''} />`;
}

function renderTable(s, rows) {
  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:2px;">
        <h4 style="margin:0;">${escapeHtml(s.title)} <span class="event-phase-count">${rows.length}</span></h4>
        <div class="pf-head-actions">
          <button class="btn btn-primary pf-select-btn" data-pf-add="${s.id}" data-ro-keep>Add Account</button>
        </div>
      </div>
      <div class="section-desc">${escapeHtml(s.note)}</div>
      <div class="tracker-scroll">
        <table class="list-table doc-fields-table pf-table-grid">
          <thead><tr>${s.fields.map((f) => `<th>${escapeHtml(f.label)}</th>`).join('')}<th></th></tr></thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                ${s.fields.map((f) => `<td>${cell(s, row, f)}</td>`).join('')}
                <td><button class="btn btn-ghost" data-pf-remove="${s.id}|${row.id}" style="padding:3px 7px;" title="Remove row">✕</button></td>
              </tr>`).join('') || `<tr><td colspan="${s.fields.length + 1}" class="empty-hint">Nothing here yet. Click "Add Account" to add one.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function wireTables(container, p) {
  const rerender = () => renderPipeline(container);

  container.querySelectorAll('[data-pf-add]').forEach((btn) => btn.addEventListener('click', () => {
    const id = btn.dataset.pfAdd;
    // Shown even in read-only mode: clicking it turns on editing first, then adds the row.
    if (isReadOnly()) {
      document.querySelector('[data-toggle-edit]')?.click();
      document.querySelector(`[data-pf-add="${id}"]`)?.click();
      return;
    }
    p[id].push({ id: uid('pf'), updated: todayISO() });
    commit();
    rerender();
    container.querySelector(`#${id} tbody tr:last-child [data-pf-cell]`)?.focus();
  }));

  container.querySelectorAll('[data-pf-cell]').forEach((input) => {
    input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
      const [sid, rid, field] = input.dataset.pfCell.split('|');
      const row = p[sid].find((r) => r.id === rid);
      row[field] = input.value;
      // Any edit counts as an update, so "Last Updated" stays current on its own.
      if (field !== 'updated') {
        row.updated = todayISO();
        const dateInput = container.querySelector(`[data-pf-cell="${sid}|${rid}|updated"]`);
        if (dateInput) dateInput.value = row.updated;
      }
      commit();
      renderGlance(container, p);
      const open = input.parentElement.querySelector('.board-open');
      if (open) {
        open.href = toHref(input.value.trim());
        open.classList.toggle('hidden', !input.value.trim());
      }
    });
  });

  container.querySelectorAll('[data-pf-remove]').forEach((btn) => btn.addEventListener('click', () => {
    const [sid, rid] = btn.dataset.pfRemove.split('|');
    const row = p[sid].find((r) => r.id === rid);
    if (row.company && !confirm(`Remove ${row.company}?`)) return;
    p[sid] = p[sid].filter((r) => r.id !== rid);
    commit();
    rerender();
  }));
}

/* ---------- At a Glance: the accounts and leads to focus on right now ---------- */
// One funnel across both tables: leads fill the first part, target accounts the rest.
const FUNNEL = {
  'lead-lists': { New: 0.05, Contacted: 0.15, Qualified: 0.3, Converted: 0.4 },
  'target-accounts': { 'Meeting booked': 0.55, Demo: 0.7, 'Proposal sent': 0.85, 'Closed won': 1 },
};
const daysAgo = (iso) => (iso ? Math.max(0, Math.round((new Date(todayISO()) - new Date(iso)) / 86400000)) : 99);
const ago = (d) => (d === 0 ? 'Today' : d === 1 ? 'Yesterday' : d >= 99 ? 'Not updated' : `${d} days ago`);

function glanceItems(p) {
  const items = [];
  for (const sec of PIPELINE_SECTIONS) {
    for (const r of p[sec.id] || []) {
      const stage = FUNNEL[sec.id][r.status];
      if (!r.company || stage === undefined) continue; // skips blank rows, Closed lost and Unqualified
      if (sec.id === 'lead-lists' && r.status === 'Converted') continue; // already counted as a target account
      const days = daysAgo(r.updated);
      const momentum = Math.max(0, 1 - days / 30);
      items.push({ row: r, sectionId: sec.id, list: sec.id === 'target-accounts' ? 'Target account' : 'Lead', stage, days, fast: days <= 2, score: stage * 0.6 + momentum * 0.4 });
    }
  }
  return items.sort((a, b) => b.score - a.score).slice(0, 10);
}

function renderGlance(container, p) {
  const el = container.querySelector('#pipeline-glance');
  if (!el) return;
  const items = glanceItems(p);
  el.innerHTML = `
    <div class="toolbar" style="margin-bottom:2px;">
      <h4 style="margin:0;">At a Glance <span class="event-phase-count">${items.length}</span></h4>
    </div>
    <div class="section-desc">The accounts and leads that have progressed the most or are moving fastest right now, ranked from both tables. Click one to jump to its row.</div>
    <ol class="pf-glance">
      ${items.map((it, i) => `
        <li>
          <button type="button" class="pf-glance-row" data-glance="${it.sectionId}|${it.row.id}">
            <span class="pf-glance-rank">${i + 1}</span>
            <span class="pf-glance-main">
              <span class="pf-glance-name">${escapeHtml(it.row.company)}${it.fast ? '<span class="pf-glance-fast">Moving fast</span>' : ''}</span>
              <span class="pf-glance-meta">${it.list}${it.row.poc ? ` · PoC ${escapeHtml(it.row.poc)}` : ''}${it.row.buyer ? ` · ${escapeHtml(it.row.buyer)}` : ''}</span>
            </span>
            <span class="pf-glance-stage">
              <span class="pf-glance-status">${escapeHtml(it.row.status)}</span>
              <span class="pf-glance-track" aria-hidden="true"><span style="width:${Math.round(it.stage * 100)}%"></span></span>
            </span>
            <span class="pf-glance-when">${ago(it.days)}</span>
          </button>
        </li>`).join('') || '<li class="empty-hint">Nothing to show yet. Add accounts or leads above.</li>'}
    </ol>
  `;
  el.querySelectorAll('[data-glance]').forEach((b) => b.addEventListener('click', () => {
    const [sid, rid] = b.dataset.glance.split('|');
    const row = container.querySelector(`[data-pf-cell="${sid}|${rid}|company"]`)?.closest('tr');
    if (!row) return;
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.classList.remove('pf-flash');
    void row.offsetWidth;
    row.classList.add('pf-flash');
  }));
}
