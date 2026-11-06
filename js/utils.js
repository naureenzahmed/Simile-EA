export function uid(prefix = 'id') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
}

export function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function relativeDay(iso) {
  const diff = daysBetween(todayISO(), iso);
  if (diff === 0) return 'Today';
  if (diff > 0) return `in ${diff}d`;
  return `${Math.abs(diff)}d ago`;
}

// "Priya Shah" → "PS". One-word names use the first and third letters ("Madison" → "MD", "Matan" → "MT")
// so people who share a first letter still look different.
export function initials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return (words[0][0] + (words[0][2] || words[0][1] || '')).toUpperCase();
  return words.map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

const PALETTE = ['#6c8cff', '#ef6f6c', '#57c785', '#f2994a', '#c77dff', '#4dd0e1', '#f4c95d', '#ff8fab'];

export function colorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// "Thu, Nov 12" for calendar list views on small screens.
export function dayLabel(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Friday of the current week (weeks run Monday to Sunday). Weekly milestones are due then.
export function weekDue(today = todayISO()) {
  const d = new Date(today + 'T00:00:00');
  return addDays(today, 4 - ((d.getDay() + 6) % 7));
}

export function milestoneDate(m) {
  return m.weekly ? weekDue() : m.date;
}
