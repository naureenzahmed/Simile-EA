import { getData, findTeam } from '../store.js';
import { escapeHtml } from '../utils.js';

export function renderTrackedGoals(container) {
  container.innerHTML = `
    <div class="section-label">Tracked goals</div>
    <div class="grid-3" id="metric-cards"></div>
  `;
  renderCards(getData());
}

function renderCards(data) {
  document.getElementById('metric-cards').innerHTML = data.metrics.map((metric) => {
    const team = findTeam(metric.teamId);
    const completedMonths = data.months.filter((m) => !m.isProjection);
    const series = completedMonths.map((m) => metric.values[m.key] ?? 0);
    const latest = series[series.length - 1] ?? 0;
    const prev = series[series.length - 2] ?? latest;
    const trendPct = prev ? Math.round(((latest - prev) / Math.abs(prev)) * 100) : 0;

    return `
      <div class="card goal-card">
        <div class="goal-card-top">
          <div><span class="team-dot" style="background:${team?.color || '#666'}; display:inline-block; margin-right:6px;"></span>${escapeHtml(metric.name)}</div>
          ${trendPct !== 0 ? `<span class="pill">${trendPct > 0 ? '▲' : '▼'} ${Math.abs(trendPct)}%</span>` : ''}
        </div>
        <div class="goal-card-value">${latest} <span>/ ${escapeHtml(metric.target)}</span></div>
        <div class="sparkline">${sparklineSvg(series)}</div>
      </div>
    `;
  }).join('');
}

function sparklineSvg(series) {
  const w = 200, h = 40, pad = 4;
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const range = max - min || 1;
  const step = series.length > 1 ? (w - pad * 2) / (series.length - 1) : 0;
  const points = series.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${points}" fill="none" stroke="var(--green)" stroke-width="2" /></svg>`;
}
