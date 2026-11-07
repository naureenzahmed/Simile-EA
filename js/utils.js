export function uid(prefix = 'id') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Today's date where the viewer is (not UTC), as YYYY-MM-DD.
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

// "Rory Pan" → "RP". Longer names use the first and last name ("Joon Sung Park" → "JP"), skipping
// suffixes like "III". One-word names use the first and third letters ("Matan" → "MT").
const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv']);

export function initials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return (words[0][0] + (words[0][2] || words[0][1] || '')).toUpperCase();
  const named = words.filter((w, i) => i === 0 || !SUFFIXES.has(w.toLowerCase().replace(/\./g, '')));
  return (named[0][0] + named[named.length - 1][0]).toUpperCase();
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
