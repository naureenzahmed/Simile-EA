import { seedData, TECH_STACK_FIELDS, techStackRows } from './seed.js';

const STORAGE_KEY = 'simileEAData.v2';

let data = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      const fresh = seedData();
      // Backfill any keys added to the seed after this data was first saved.
      let changed = false;
      // Recruitment v2: empty School Partnerships, add a Tech Stack section.
      // Runs before the backfill below, which would otherwise set the version first.
      if (stored.recruitment && (stored.recruitmentVersion || 1) < 2) {
        const schools = stored.recruitment.find((s) => s.id === 'rec-schools');
        if (schools) { schools.entities = []; schools.metrics = []; }
        if (!stored.recruitment.some((s) => s.id === 'rec-tech-stack')) {
          const at = stored.recruitment.findIndex((s) => s.id === 'rec-schools');
          stored.recruitment.splice(at + 1, 0, { id: 'rec-tech-stack', title: 'Tech Stack', metrics: [] });
        }
        stored.recruitmentVersion = 2;
        changed = true;
      }
      // Recruitment v3: clear Partnership Events, drop Companies to Track Employees.
      if (stored.recruitment && stored.recruitmentVersion < 3) {
        const partnerships = stored.recruitment.find((s) => s.id === 'rec-partnerships');
        if (partnerships) partnerships.entities = [];
        stored.recruitment = stored.recruitment.filter((s) => s.id !== 'rec-companies');
        stored.recruitmentVersion = 3;
        changed = true;
      }
      // Recruitment v4: Tech Stack moves to the top.
      if (stored.recruitment && stored.recruitmentVersion < 4) {
        const tech = stored.recruitment.find((s) => s.id === 'rec-tech-stack');
        if (tech) stored.recruitment = [tech, ...stored.recruitment.filter((s) => s !== tech)];
        stored.recruitmentVersion = 4;
        changed = true;
      }
      // Recruitment v5: Tech Stack gets a Software / Description / Cost table.
      if (stored.recruitment && stored.recruitmentVersion < 5) {
        const tech = stored.recruitment.find((s) => s.id === 'rec-tech-stack');
        if (tech && !tech.table) {
          tech.table = {
            fields: [
              { key: 'software', label: 'Software' },
              { key: 'description', label: 'Description' },
              { key: 'cost', label: 'Cost' },
            ],
            rows: [],
          };
        }
        stored.recruitmentVersion = 5;
        changed = true;
      }
      // Recruitment v6: fill the Tech Stack table with the chosen tools.
      if (stored.recruitment && stored.recruitmentVersion < 6) {
        const tech = stored.recruitment.find((s) => s.id === 'rec-tech-stack');
        if (tech && tech.table) {
          tech.table.fields = TECH_STACK_FIELDS;
          const have = new Set(tech.table.rows.map((r) => (r.software || '').trim().toLowerCase()));
          tech.table.rows = tech.table.rows.filter((r) => r.software || r.description || r.cost);
          for (const row of techStackRows()) {
            if (!have.has(row.software.toLowerCase())) tech.table.rows.push(row);
          }
        }
        stored.recruitmentVersion = 6;
        changed = true;
      }
      for (const key of Object.keys(fresh)) {
        if (!(key in stored)) { stored[key] = fresh[key]; changed = true; }
      }
      // Swap the template's old team colors for the Simile palette.
      const NEW_COLORS = { '#6c8cff': '#ff7a66', '#ef6f6c': '#7fb8e6', '#57c785': '#e0a95a' };
      for (const team of stored.teams || []) {
        if (NEW_COLORS[team.color]) { team.color = NEW_COLORS[team.color]; changed = true; }
      }
      // Backfill notes for pages added after this data was first saved.
      for (const key of Object.keys(fresh.pageNotes)) {
        if (!(key in stored.pageNotes)) { stored.pageNotes[key] = fresh.pageNotes[key]; changed = true; }
      }
      if (changed) save(stored);
      return stored;
    }
  } catch (e) {
    console.warn('Failed to load stored data, reseeding.', e);
  }
  const fresh = seedData();
  save(fresh);
  return fresh;
}

function save(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

export function getData() {
  return data;
}

export function commit() {
  save(data);
}

export function resetData() {
  data = seedData();
  save(data);
}

export function findPerson(id) {
  return data.people.find((p) => p.id === id) || null;
}

export function findTeam(id) {
  return data.teams.find((t) => t.id === id) || null;
}

export function findInitiative(id) {
  return data.initiatives.find((i) => i.id === id) || null;
}

export function findTask(id) {
  return data.tasks.find((t) => t.id === id) || null;
}
