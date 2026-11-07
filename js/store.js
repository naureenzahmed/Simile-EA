import { isReadOnly } from './readOnly.js';
import { seedData, NAME_CHANGES, POTENTIAL_POCS, INVESTOR_PARTNERS, TECH_STACK_FIELDS, techStackRows, seedLeadershipSchedule, SCHOOL_FIELDS, schoolRows, CONFERENCE_FIELDS, conferenceRows, PARTNER_FIELDS, potentialInvestorRows, currentInvestorRows, clientFields, clientRows, cooOtherMail, OKR_DEPARTMENTS, starterOkr, TEAMS, OLD_TEAM_MAP, seedPeople, personId, isCurrentInvestor, scheduleCityFor, seedDocLibrary, eventChecklist, EVENT_PHASES, QUIRKS_LA, TOOL_ACCESS_NOTE, TOOL_ACCESS_FIELDS, toolAccessRows, CONFERENCE_FIXES, CONFERENCE_GROUPS, conferenceGroupOf, TECH_STACK_COSTS, ABOUT_BACKGROUND, ABOUT_EXPERIENCE, ABOUT_GOALS, ABOUT_WHY, ROADMAP_NOTE, PIPELINE_NOTE, SCHEDULE_NOTE, COO_NOTE, BOARD_NOTE, EVENTS_NOTE, seedMilestones, teamMemberPeople, leaderBandwidth, PERSON_FOCUS, mailStatusFor, SPRINT_TASK_DUE, SPRINT_TASK_OWNER, cooWeekEvents, dataRoomRows, placeholderEvents, eventOwnerAt, SALES_DOC_TITLES } from './seed.js';

const STORAGE_KEY = 'simileEAData.v2';

// Copy edit (2026-11): old starter text -> corrected text. Only exact matches change,
// so anything someone typed in themselves is left alone.
const COPY_FIXES = {
    "Example task description — replace with the real scope of work.": "Example task description. Replace it with the real scope of work.",
    "Software Login": "Software Logins",
    "Set Up Instructions": "Setup Instructions",
    "Setting up LinkedIn ads": "Setting up LinkedIn Ads",
    "Setting up Meta ads": "Setting up Meta Ads",
    "Demos Documents": "Demo Documents",
    "One Pager": "One-Pager",
    "Ads Materials": "Ad Materials",
    "Ad Creatives - Google": "Ad Creatives: Google",
    "Ad Creatives - Meta": "Ad Creatives: Meta",
    "Ad Creatives - ChatGPT": "Ad Creatives: ChatGPT",
    "Ad Creatives - LinkedIn": "Ad Creatives: LinkedIn",
    "Ads Audiences Lists": "Ad Audience Lists",
    "Grokbot will be able to reach ideal candidates and automate messaging them. Grokbot allows you to reach LinkedIn (used by sales and ops people heavily) and X (used heavily by engineers and technical people). It will also be able to scrape through new publications and research to find the appropriate people in highly technical fields.": "Grokbot will reach ideal candidates and automate messages to them. It covers LinkedIn, where sales and ops people spend most of their time, and X, where engineers and technical people are most active. It can also scan new publications and research to find the right people in highly technical fields.",
    "$30/mo (SuperGrok). Grok Business is $30/user/mo, SuperGrok Lite $10/mo, SuperGrok Heavy $300/mo, Enterprise custom.": "$30/mo for SuperGrok. Grok Business is $30/user/mo, SuperGrok Lite is $10/mo, SuperGrok Heavy is $300/mo and Enterprise is custom.",
    "Apollo can support quick email pulling.": "Apollo makes it quick to pull email addresses.",
    "$49–$119/user/mo billed yearly (Basic $49, Professional $79, Organization $119); about $59–$149 billed monthly. Free plan available. Credits, add-ons and overages can raise the total a lot.": "$49–$119/user/mo billed yearly (Basic is $49, Professional is $79 and Organization is $119), or about $59–$149 billed monthly. There is a free plan. Credits, add-ons and overages can raise the total a lot.",
    "Juicebox can run through LinkedIn, Github, Google Scholar and 30 more data sources. We will be able to reach business oriented profiles just as much deep science.": "Juicebox searches LinkedIn, GitHub, Google Scholar and 30 more data sources, so we can reach business-oriented profiles just as easily as deep science ones.",
    "About $99–$179/seat/mo billed yearly (Starter $99, or $119 monthly; Growth $179). Agents add-on $199/agent/mo. Unlimited searches; contact/export credits capped at 500/mo (Starter) or 1,500/mo (Growth). Prices changed July 2026.": "About $99–$179/seat/mo billed yearly (Starter is $99, or $119 billed monthly, and Growth is $179). The Agents add-on is $199/agent/mo. Searches are unlimited, but contact and export credits are capped at 500/mo on Starter and 1,500/mo on Growth. Prices changed in July 2026.",
    "Claude skills can be utilized to connect all of these software and automate the information transfer. Additionally, Claude skills can send the interviewer brief summaries right before the meeting and the appropriate interview questions. An alternative would be Gumloop.": "Claude skills can connect all of these tools and automate the handoff of information between them. They can also send each interviewer a short summary and the right interview questions just before the meeting. Gumloop is an alternative.",
    "$20–$25/user/mo for most people (Pro $20, Team Standard $25). Max 5x $100/mo, Max 20x $200/mo, Team Premium $125/user/mo.": "$20–$25/user/mo for most people (Pro is $20 and Team Standard is $25). Max 5x is $100/mo, Max 20x is $200/mo and Team Premium is $125/user/mo.",
    "Gem is an Applicant Tracking System (ATS). Once the ideal process is put in, email, scheduling and communication tracking is all automated.": "Gem is an applicant tracking system (ATS). Once the ideal process is set up, email, scheduling and communication tracking are all automated.",
    "Most expensive item. Custom quote based on company headcount; Startups plan $270/mo. Median buyer pays about $25,700/yr (SMB average ~$19,800/yr, enterprise average ~$94,600/yr).": "The most expensive item. Pricing is a custom quote based on company headcount, and the Startups plan is $270/mo. The median buyer pays about $25,700/yr (the SMB average is about $19,800/yr and the enterprise average is about $94,600/yr).",
    "Follow up with event organiser for Wi-Fi and connection": "Wi-Fi and connection confirmed with the event organizer",
    "Lead list": "Lead list on hand",
    "HubSpot to track all the conversations": "HubSpot ready to track every conversation",
    "Follow-ups on conversations": "Follow-ups on every conversation",
    "Marketing on the recap from our attendance": "Marketing recap of our attendance",
    "Interview Booked (%)": "Interviews booked (%)",
    "Interview Booked (#)": "Interviews booked (#)",
    "Look at hiring from that same level of talent.": "Look at hiring from the same level of talent."
  };

// Page notes are read-only on the site, so they are replaced outright.
const NOTE_FIXES = {
    "recruitment": "This page is about bringing top-of-funnel talent to Simile.\n\nA note on events: partnering with others on events is much more interesting, since it has the same impact for far less time and effort. With school partnerships, the goal is to build relationships early, so that when very strong talent comes along, it gets funneled to us quickly.\n\nTo build a successful funnel for Simile, we need several long-term relationships in place. That’s why we’re looking at:\n\n• School partnerships for newcomers\n• Event sponsorships for people already in the ecosystem\n• Event attendance, to understand who we’re getting in front of and whether they’re the right people, whether that’s a future client or a future employee\n• Event partnerships, as our ICPs converge\n• The total count from leads to interviews booked, and the gap between them",
    "operations": "This page shows every team milestone and each teammate’s capacity. It also shows team composition, so when a project changes or the direction shifts, the work can go to a teammate who has room for it. Anyone newly onboarded can see who’s working on what, how much capacity everyone has and who they can go to for support at any time.",
    "documentation": "This page keeps all the processes, SOPs and helpful links in one place, so they’re easy to find for me, anyone working with me and anyone I need to train. I can just send them this page. It also keeps the history and the lists I used for each of my campaigns. I made it to save time for myself and for anyone I work with.",
    "roadmap": "This lets anyone working with me follow my timeline week by week, with exactly when I plan to start and finish each initiative, experiment or task. It gives a clear picture of my progress.\n\nIt also has goals, metrics and objectives that show where things stand and how much more needs to happen to hit the end goals. The monthly calendar of deadlines shows what needs to happen each month and each day, so we can work backwards from the goals."
  };

function applyCopyFixes(value) {
  if (typeof value === 'string') return Object.prototype.hasOwnProperty.call(COPY_FIXES, value) ? COPY_FIXES[value] : value;
  if (Array.isArray(value)) return value.map(applyCopyFixes);
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) value[k] = applyCopyFixes(value[k]);
  }
  return value;
}

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
      // Recruitment v7: fill in Tech Stack costs (leaves any typed-in cost alone).
      if (stored.recruitment && stored.recruitmentVersion < 7) {
        const tech = stored.recruitment.find((s) => s.id === 'rec-tech-stack');
        if (tech && tech.table) {
          tech.table.fields = TECH_STACK_FIELDS;
          const costs = Object.fromEntries(techStackRows().map((r) => [r.software.toLowerCase(), r.cost]));
          for (const row of tech.table.rows) {
            const cost = costs[(row.software || '').trim().toLowerCase()];
            if (cost && !row.cost) row.cost = cost;
          }
        }
        stored.recruitmentVersion = 7;
        changed = true;
      }
      // Schedule v2: make sure every leader has one entry of each type.
      if (stored.leadershipSchedule && (stored.scheduleVersion || 1) < 2) {
        const have = new Set(stored.leadershipSchedule.map((e) => `${e.person}|${e.type}`));
        const ids = new Set(stored.leadershipSchedule.map((e) => e.id));
        for (const e of seedLeadershipSchedule()) {
          if (!have.has(`${e.person}|${e.type}`) && !ids.has(e.id)) { stored.leadershipSchedule.push(e); have.add(`${e.person}|${e.type}`); }
        }
        stored.scheduleVersion = 2;
        changed = true;
      }
      // Schedule v3: add Joon and Michael, each with one entry of every type.
      if (stored.leadershipSchedule && stored.scheduleVersion < 3) {
        const added = ['Joon Sung Park', 'Michael Bernstein'];
        if (stored.scheduleLeaders) {
          for (const name of added) if (!stored.scheduleLeaders.includes(name)) stored.scheduleLeaders.push(name);
        }
        const ids = new Set(stored.leadershipSchedule.map((e) => e.id));
        for (const e of seedLeadershipSchedule()) {
          if (added.includes(e.person) && !ids.has(e.id)) stored.leadershipSchedule.push(e);
        }
        stored.scheduleVersion = 3;
        changed = true;
      }
      // Recruitment v8: School Partnerships gets a table of top AI and ML schools.
      if (stored.recruitment && stored.recruitmentVersion < 8) {
        const schools = stored.recruitment.find((s) => s.id === 'rec-schools');
        if (schools && !schools.table) {
          schools.note = schools.note || 'Top schools for deep learning, AI, ML and simulation.';
          schools.table = { fields: SCHOOL_FIELDS, rows: schoolRows() };
        }
        stored.recruitmentVersion = 8;
        changed = true;
      }
      // Recruitment v9: Event Attendance gets a table of conferences.
      if (stored.recruitment && stored.recruitmentVersion < 9) {
        const attendance = stored.recruitment.find((s) => s.id === 'rec-attendance');
        if (attendance && !attendance.table) {
          attendance.note = attendance.note || 'Conferences and events worth attending, plus the ones Simile and Joon have already been part of.';
          attendance.table = { fields: CONFERENCE_FIELDS, rows: conferenceRows() };
        }
        stored.recruitmentVersion = 9;
        changed = true;
      }
      // Recruitment v10: drop the old event list from Event Attendance.
      if (stored.recruitment && stored.recruitmentVersion < 10) {
        const attendance = stored.recruitment.find((s) => s.id === 'rec-attendance');
        const old = ['Socratica Symposium', 'GenAI Genesis', 'Hack the North', 'MILA ALL-IN'];
        if (attendance?.entities) attendance.entities = attendance.entities.filter((e) => !old.includes(e.name));
        stored.recruitmentVersion = 10;
        changed = true;
      }
      // Recruitment v11: Partnership Events gets a table of partner companies.
      if (stored.recruitment && stored.recruitmentVersion < 11) {
        const partnerships = stored.recruitment.find((s) => s.id === 'rec-partnerships');
        if (partnerships && !partnerships.table) partnerships.table = { fields: PARTNER_FIELDS, rows: [] };
        stored.recruitmentVersion = 11;
        changed = true;
      }
      // Recruitment v12: Partnership Events targets drop to 30 leads and 30% conversion.
      if (stored.recruitment && stored.recruitmentVersion < 12) {
        const partnerships = stored.recruitment.find((s) => s.id === 'rec-partnerships');
        const targets = { m1: ['40 per event', '30 per event'], m2: ['37.5%', '30%'], m3: ['15 per event', '9 per event'] };
        for (const m of partnerships?.metrics || []) {
          const t = targets[m.id];
          if (t && m.target === t[0]) m.target = t[1];
        }
        stored.recruitmentVersion = 12;
        changed = true;
      }
      // Recruitment v13: Ashby replaces Gem in the Tech Stack.
      if (stored.recruitment && stored.recruitmentVersion < 13) {
        const tech = stored.recruitment.find((sec) => sec.id === 'rec-tech-stack');
        const ashby = techStackRows().find((r) => r.software === 'Ashby');
        const gem = tech?.table?.rows.find((r) => (r.software || '').trim().toLowerCase() === 'gem');
        if (gem && ashby) Object.assign(gem, { software: ashby.software, description: ashby.description, cost: ashby.cost });
        stored.recruitmentVersion = 13;
        changed = true;
      }
      // Schedule v4: each entry gets a city, so the calendar shows where leadership is.
      if (stored.leadershipSchedule && (stored.scheduleVersion || 0) < 4) {
        for (const e of stored.leadershipSchedule) {
          const m = /^sched-(\d+)$/.exec(e.id);
          if (!e.city && m) e.city = scheduleCityFor(Number(m[1]) - 1);
          const office = /^In office \((SF|NYC)\)$/.exec(e.title || '');
          if (office) { e.title = 'In office'; e.city = e.city || (office[1] === 'SF' ? 'San Francisco' : 'New York'); }
        }
        stored.scheduleVersion = 4;
        changed = true;
      }
      // Recruitment v14: fix rows with missing dates, use official event sites, and split past from upcoming.
      if (stored.recruitment && stored.recruitmentVersion < 14) {
        const att = stored.recruitment.find((sec) => sec.id === 'rec-attendance');
        if (att?.table) {
          att.table.groups = CONFERENCE_GROUPS.map((g) => ({ ...g }));
          for (const row of att.table.rows) {
            const fix = CONFERENCE_FIXES[row.event];
            if (fix) Object.assign(row, fix);
            row.group = row.group || conferenceGroupOf(row.event);
          }
        }
        stored.recruitmentVersion = 14;
        changed = true;
      }
      // Recruitment v15: one-line Tech Stack prices and the new Disney Accelerator line.
      if (stored.recruitment && stored.recruitmentVersion < 15) {
        const tech = stored.recruitment.find((sec) => sec.id === 'rec-tech-stack');
        if (tech?.table) tech.table.fields = TECH_STACK_FIELDS.map((f) => ({ ...f }));
        for (const row of tech?.table?.rows || []) {
          const short = TECH_STACK_COSTS[row.software];
          if (short && (row.cost || '').length > 60) row.cost = short;
        }
        const att = stored.recruitment.find((sec) => sec.id === 'rec-attendance');
        const disney = att?.table?.rows.find((r) => r.event === 'Disney Accelerator 2026');
        if (disney) disney.details = CONFERENCE_FIXES['Disney Accelerator 2026'].details;
        stored.recruitmentVersion = 15;
        changed = true;
      }
      // Copy v1: fix spelling, grammar and tone in the starter text.
      if ((stored.copyVersion || 0) < 1) {
        applyCopyFixes(stored);
        stored.pageNotes = { ...(stored.pageNotes || {}), ...NOTE_FIXES };
        stored.copyVersion = 1;
        changed = true;
      }
      // Board v1: add the Potential Investors list from the investor targets sheet.
      if (stored.boardInvestor && (stored.boardVersion || 0) < 1) {
        if (!stored.boardInvestor['potential-investors']?.length) stored.boardInvestor['potential-investors'] = potentialInvestorRows();
        stored.boardVersion = 1;
        changed = true;
      }
      // Board v2: the Investors table gets its firms and new columns (link, industry and PoC are gone).
      if (stored.boardInvestor && (stored.boardVersion || 0) < 2) {
        const current = stored.boardInvestor.investors || [];
        const filled = current.filter((r) => Object.entries(r).some(([k, v]) => k !== 'id' && v));
        stored.boardInvestor.investors = filled.length ? current : currentInvestorRows();
        stored.boardVersion = 2;
        changed = true;
      }
      // Board v3: firms that already invest in us come off the Potential Investors list.
      if (stored.boardInvestor && (stored.boardVersion || 0) < 3) {
        const current = (stored.boardInvestor.investors || []).map((r) => r.firm).filter(Boolean);
        const potential = stored.boardInvestor['potential-investors'] || [];
        stored.boardInvestor['potential-investors'] = potential.filter((r) => !isCurrentInvestor(r.firm, current));
        stored.boardVersion = 3;
        changed = true;
      }
      // Docs v1: add Templates, Client SOPs and Team Onboarding at the top of Documentation.
      if (stored.docs && (stored.docsVersion || 0) < 1) {
        const missing = seedDocLibrary().filter((sec) => !stored.docs.some((d) => d.id === sec.id));
        stored.docs.unshift(...missing);
        stored.docsVersion = 1;
        changed = true;
      }
      // Notes v1: the talent pipeline note opens with why this project exists.
      if (stored.pageNotes && (stored.notesVersion || 0) < 1) {
        const intro = 'After the chat with Sanjeev, there is a need for hiring support. Here are a couple of ideas I can put together in my first days to start a system for recruiting technical talent. Sourcing and scheduling need to be automated and systemized, while the interviews stay personal, with people engaging candidates and giving us a chance to build relationships with them.';
        const cur = stored.pageNotes.recruitment || '';
        if (!cur.includes('After the chat with Sanjeev')) stored.pageNotes.recruitment = cur ? `${intro}\n\n${cur}` : intro;
        stored.notesVersion = 1;
        changed = true;
      }
      // Events v1: each event type gets its own checklist, and the placeholder conference becomes Quirk's LA.
      if (stored.events && (stored.eventsVersion || 0) < 1) {
        const starterIds = ['evt-gtm-offsite', 'evt-sales-kickoff', 'evt-exec-dinner', 'evt-industry'];
        for (const e of stored.events) {
          if (e.id === 'evt-industry' && e.name === 'Industry Conference (booth)') {
            Object.assign(e, { name: QUIRKS_LA.name, description: QUIRKS_LA.description, date: QUIRKS_LA.date, location: QUIRKS_LA.location });
            if (e.status === 'Idea') e.status = 'Planning';
          }
          const items = EVENT_PHASES.flatMap((ph) => e.checklist?.[ph.key] || []);
          const untouched = items.every((i) => !i.done && !i.owner && !i.notes && !i.link);
          if (untouched) {
            e.checklist = eventChecklist(e.id, e.type, { sample: starterIds.includes(e.id) });
            if (e.id === 'evt-industry') e.checklist.pre[0].link = QUIRKS_LA.link;
          }
        }
        stored.eventsVersion = 1;
        changed = true;
      }
      // Docs v2: Software Logins becomes the Tool Access Guide, with the access process and the tools we use.
      if (stored.docs && (stored.docsVersion || 0) < 2) {
        const sec = stored.docs.find((d) => d.id === 'docs-logins');
        if (sec) {
          if (sec.title === 'Software Logins') sec.title = 'Tool Access Guide';
          sec.note = sec.note || TOOL_ACCESS_NOTE;
          sec.fields = TOOL_ACCESS_FIELDS.map((f) => ({ ...f }));
          if (!sec.entries.length) sec.entries = toolAccessRows();
        }
        stored.docsVersion = 2;
        changed = true;
      }
      // Notes v2: one note per page, shared by the page and its Home card. Team Management's note
      // becomes the Schedule Management note, and any Home card notes join their page's note.
      if (stored.pageNotes && (stored.notesVersion || 0) < 2) {
        const notes = stored.pageNotes;
        if (!notes.schedule && notes.operations) notes.schedule = notes.operations;
        delete notes.operations;
        for (const [key, card] of Object.entries(stored.home?.cardNotes || {})) {
          const text = (card || '').trim();
          if (!text) continue;
          const page = (notes[key] || '').trim();
          if (!page) notes[key] = text;
          else if (!page.includes(text)) notes[key] = `${page}\n\n${text}`;
        }
        if (stored.home) delete stored.home.cardNotes;
        stored.notesVersion = 2;
        changed = true;
      }
      // Home v1: fill in Background under About Naureen, unless something is already written there.
      if (stored.home && (stored.homeVersion || 0) < 1) {
        if (!(stored.home.background || '').trim()) stored.home.background = ABOUT_BACKGROUND;
        stored.homeVersion = 1;
        changed = true;
      }
      // Home v2: fill in Relevant Experience, unless something is already written there.
      if (stored.home && (stored.homeVersion || 0) < 2) {
        if (!(stored.home.experience || '').trim()) stored.home.experience = ABOUT_EXPERIENCE;
        stored.homeVersion = 2;
        changed = true;
      }
      // Home v3: fill in What I Want to Get Out of This, unless something is already written there.
      if (stored.home && (stored.homeVersion || 0) < 3) {
        if (!(stored.home.goals || '').trim()) stored.home.goals = ABOUT_GOALS;
        stored.homeVersion = 3;
        changed = true;
      }
      // Home v4: fill in Why I Built This, unless something is already written there.
      if (stored.home && (stored.homeVersion || 0) < 4) {
        if (!(stored.home.why || '').trim()) stored.home.why = ABOUT_WHY;
        stored.homeVersion = 4;
        changed = true;
      }
      // Home v5: new wording for the three About Naureen boxes.
      if (stored.home && (stored.homeVersion || 0) < 5) {
        stored.home.background = ABOUT_BACKGROUND;
        stored.home.experience = ABOUT_EXPERIENCE;
        stored.home.goals = ABOUT_GOALS;
        stored.homeVersion = 5;
        changed = true;
      }
      // Home v6: two new sentences at the end of the McGill Ventures paragraph.
      if (stored.home && (stored.homeVersion || 0) < 6) {
        stored.home.experience = ABOUT_EXPERIENCE;
        stored.homeVersion = 6;
        changed = true;
      }
      // Home v7: three new sentences in the Simile paragraph of What I Want to Get Out of This.
      if (stored.home && (stored.homeVersion || 0) < 7) {
        stored.home.goals = ABOUT_GOALS;
        stored.homeVersion = 7;
        changed = true;
      }
      if ((stored.copyVersion || 0) < 2) {
        replaceDeep(stored, COPY_FIXES_2);
        stored.copyVersion = 2;
        changed = true;
      }
      // Notes v3: new GTM Roadmap note. It replaces the old starter note; anything else written there is kept below it.
      if (stored.pageNotes && (stored.notesVersion || 0) < 3) {
        const cur = (stored.pageNotes.roadmap || '').trim();
        const starter = cur.startsWith('This lets anyone working with me follow my timeline');
        stored.pageNotes.roadmap = !cur || starter ? ROADMAP_NOTE : `${ROADMAP_NOTE}\n\n${cur}`;
        stored.notesVersion = 3;
        changed = true;
      }
      // Pipeline v1: Target Accounts drops Not contacted and Contacted for a single Demo status.
      if (stored.pipeline && (stored.pipelineVersion || 0) < 1) {
        for (const r of stored.pipeline['target-accounts'] || []) {
          if (r.status === 'Not contacted' || r.status === 'Contacted') r.status = 'Demo';
        }
        stored.pipelineVersion = 1;
        changed = true;
      }
      // Notes v4: Pipeline & Forecasts note. Anything already written there is kept below it.
      if (stored.pageNotes && (stored.notesVersion || 0) < 4) {
        const cur = (stored.pageNotes.pipeline || '').trim();
        stored.pageNotes.pipeline = cur && !cur.startsWith('This page shows our major revenue metrics') ? `${PIPELINE_NOTE}\n\n${cur}` : PIPELINE_NOTE;
        stored.notesVersion = 4;
        changed = true;
      }
      // Milestones v1: Key Milestones become this week's milestones, one per department, all due Friday.
      // The old starter milestones (Milestone 1 to 4) go; any milestone someone added is kept.
      if (stored.milestones && (stored.milestonesVersion || 0) < 1) {
        const custom = stored.milestones.filter((m) => !/^Milestone \d+$/.test(m.title || ''));
        stored.milestones = [...seedMilestones(), ...custom];
        stored.milestonesVersion = 1;
        changed = true;
      }
      // People v1: add made-up members to every department and give everyone a bandwidth level.
      if (stored.people && (stored.peopleVersion || 0) < 1) {
        const have = new Set(stored.people.map((p) => p.name.toLowerCase()));
        for (const p of teamMemberPeople()) if (!have.has(p.name.toLowerCase())) stored.people.push(p);
        for (const p of stored.people) if (!p.bandwidth) p.bandwidth = leaderBandwidth(p.name);
        stored.peopleVersion = 1;
        changed = true;
      }
      // People v2: each person gets a short list of what they're working on.
      if (stored.people && (stored.peopleVersion || 0) < 2) {
        for (const p of stored.people) if (!p.focus) p.focus = [...(PERSON_FOCUS[p.name] || [])];
        stored.peopleVersion = 2;
        changed = true;
      }
      // Notes v5: new Schedule Management note. It replaces the old starter note; anything else written there is kept below it.
      if (stored.pageNotes && (stored.notesVersion || 0) < 5) {
        const cur = (stored.pageNotes.schedule || '').trim();
        const starter = cur.startsWith('This page shows every team milestone');
        stored.pageNotes.schedule = !cur || starter ? SCHEDULE_NOTE : `${SCHEDULE_NOTE}\n\n${cur}`;
        stored.notesVersion = 5;
        changed = true;
      }
      // COO v3: each inbox email gets a status (Needs to be addressed, In progress or Addressed).
      if (stored.coo && (stored.cooVersion || 0) < 3) {
        for (const m of stored.coo.inbox || []) if (!m.status) m.status = mailStatusFor(m.id);
        stored.cooVersion = 3;
        changed = true;
      }
      // COO v4: sprint tasks get due dates.
      if (stored.coo && (stored.cooVersion || 0) < 4) {
        for (const sp of [stored.coo.currentSprint, ...(stored.coo.pastSprints || [])]) {
          for (const t of sp?.tasks || []) if (t.due === undefined) t.due = SPRINT_TASK_DUE[t.id] || '';
        }
        stored.cooVersion = 4;
        changed = true;
      }
      // COO v5: sprint tasks get an owner.
      if (stored.coo && (stored.cooVersion || 0) < 5) {
        for (const sp of [stored.coo.currentSprint, ...(stored.coo.pastSprints || [])]) {
          for (const t of sp?.tasks || []) if (t.ownerId === undefined) t.ownerId = SPRINT_TASK_OWNER[t.id] || null;
        }
        stored.cooVersion = 5;
        changed = true;
      }
      // Notes v6: COO Scheduling note. Anything already written there is kept below it.
      if (stored.pageNotes && (stored.notesVersion || 0) < 6) {
        const cur = (stored.pageNotes.coo || '').trim();
        stored.pageNotes.coo = cur && !cur.startsWith('Since I’ll be working closely') ? `${COO_NOTE}\n\n${cur}` : COO_NOTE;
        stored.notesVersion = 6;
        changed = true;
      }
      // COO v6: inquiry columns become Needs Attention, Solved, Escalated and Other.
      if (stored.coo && (stored.cooVersion || 0) < 6) {
        for (const q of stored.coo.inquiries || []) if (q.stage === 'potential') q.stage = 'needed';
        stored.cooVersion = 6;
        changed = true;
      }
      // COO v7: example events for the week of Nov 2, for the new week and day views.
      if (stored.coo && (stored.cooVersion || 0) < 7) {
        const ids = new Set((stored.coo.calendar || []).map((e) => e.id));
        for (const e of cooWeekEvents()) if (!ids.has(e.id)) stored.coo.calendar.push(e);
        stored.cooVersion = 7;
        changed = true;
      }
      // Board v4: a Data Room Links table, filled with the usual diligence documents.
      if (stored.boardInvestor && (stored.boardVersion || 0) < 4) {
        if (!stored.boardInvestor['data-room']?.length) stored.boardInvestor['data-room'] = dataRoomRows();
        stored.boardVersion = 4;
        changed = true;
      }
      // Board v5: Data Room Links becomes Title, Link, Security Clearance and People. Rows nobody edited are swapped
      // for the new ones; links already pasted in are kept.
      if (stored.boardInvestor && (stored.boardVersion || 0) < 5) {
        const fresh = dataRoomRows();
        const old = stored.boardInvestor['data-room'] || [];
        stored.boardInvestor['data-room'] = fresh.map((row, i) => ({ ...row, link: old[i]?.link || '' }))
          .concat(old.slice(fresh.length).map((r) => ({ id: r.id, title: r.document || r.title || '', link: r.link || '', clearance: 'lead', people: '' })));
        stored.boardVersion = 5;
        changed = true;
      }
      // Board v6: a POC column on Potential Investors, with a couple of rows filled in.
      if (stored.boardInvestor && (stored.boardVersion || 0) < 6) {
        (stored.boardInvestor['potential-investors'] || []).forEach((r, i) => { if (!r.poc && POTENTIAL_POCS[i]) r.poc = POTENTIAL_POCS[i]; });
        stored.boardVersion = 6;
        changed = true;
      }
      // Board v7: our partners at current investors, with their LinkedIn. At Index Ventures that's Shardul Shah
      // (also on the board) with Mark Xu as his board observer, and at BCV it's Aaref Hilaly. Mark Xu joins
      // Shardul Shah on the data room documents. Cells someone already filled in are left alone.
      if (stored.boardInvestor && (stored.boardVersion || 0) < 7) {
        const index = INVESTOR_PARTNERS['Index Ventures'];
        (stored.boardInvestor.investors || []).forEach((r) => {
          for (const [k, v] of Object.entries(INVESTOR_PARTNERS[r.firm] || {})) if (!r[k]) r[k] = v;
        });
        (stored.boardInvestor['data-room'] || []).forEach((r) => {
          const names = String(r.people || '').split(',').map((n) => n.trim()).filter(Boolean);
          const i = names.indexOf('Shardul Shah');
          if (i !== -1 && !names.includes('Mark Xu')) names.splice(i + 1, 0, 'Mark Xu');
          r.people = names.join(', ');
        });
        (stored.boardInvestor['potential-investors'] || []).forEach((r) => {
          if (r.firm !== 'Index Ventures' || !/linkedin\.com\/search/.test(r.linkedin || '')) return;
          r.linkedin = index.partnerLinkedin;
          r.linkedinStatus = 'Verified';
        });
        stored.boardVersion = 7;
        changed = true;
      }
      // Board v8: Panos Madamopoulos-Moraris joins the Investors table as an angel, and can open the
      // data room documents shared with all investors.
      if (stored.boardInvestor && (stored.boardVersion || 0) < 8) {
        const angel = INVESTOR_PARTNERS['Angel investor'];
        const list = stored.boardInvestor.investors = stored.boardInvestor.investors || [];
        if (!list.some((r) => r.partner === angel.partner)) list.push({ id: `investors-angel-${Date.now()}`, firm: 'Angel investor', stage: '', ...angel });
        for (const r of stored.boardInvestor['data-room'] || []) {
          if (r.clearance !== 'all') continue;
          const names = String(r.people || '').split(',').map((n) => n.trim()).filter(Boolean);
          if (!names.includes(angel.partner)) r.people = [...names, angel.partner].join(', ');
        }
        stored.boardVersion = 8;
        changed = true;
      }
      // Events v2: CEO EA becomes COO EA, the COO EA owns about three in four checklist items, and placeholder
      // events fill out the calendar. Owners that are people's names are left alone.
      if (stored.events && (stored.eventsVersion || 0) < 2) {
        const roles = ['CEO EA', 'COO EA', 'CTO EA', 'Chief of Staff'];
        for (const e of stored.events) {
          let n = 0;
          for (const ph of EVENT_PHASES) {
            for (const item of e.checklist?.[ph.key] || []) {
              if (item.owner === 'CEO EA') item.owner = 'COO EA';
              if (roles.includes(item.owner)) item.owner = eventOwnerAt(n, item.owner);
              n++;
            }
          }
        }
        const ids = new Set(stored.events.map((e) => e.id));
        for (const e of placeholderEvents()) if (!ids.has(e.id)) stored.events.push(e);
        stored.eventsVersion = 2;
        changed = true;
      }
      // Docs v3: drop Setup Instructions, Ad Materials and Ad Audience Lists, and rename the Sales & Pitch documents.
      if (stored.docs && (stored.docsVersion || 0) < 3) {
        stored.docs = stored.docs.filter((d) => !['docs-tofu', 'docs-ads-materials', 'docs-ads-audiences'].includes(d.id));
        const sales = stored.docs.find((d) => d.id === 'docs-sales-pitch');
        for (const e of sales?.entries || []) if (SALES_DOC_TITLES[e.id]) e.title = SALES_DOC_TITLES[e.id];
        stored.docsVersion = 3;
        changed = true;
      }
      // Notes v7: Board & Investor Support and Events & Offsites notes. Anything already written there is kept below.
      if (stored.pageNotes && (stored.notesVersion || 0) < 7) {
        for (const [key, note] of [['boardInvestor', BOARD_NOTE], ['events', EVENTS_NOTE]]) {
          const cur = (stored.pageNotes[key] || '').trim();
          stored.pageNotes[key] = cur && !cur.startsWith(note.slice(0, 30)) ? `${note}\n\n${cur}` : note;
        }
        stored.notesVersion = 7;
        changed = true;
      }
      // Clients v1: column types (Industry becomes a dropdown) and the starting client list.
      if (stored.clientMaterials && (stored.clientVersion || 0) < 1) {
        const clients = stored.clientMaterials.find((s) => s.id === 'clients');
        if (clients) {
          clients.fields = clientFields();
          const have = new Set(clients.entries.map((e) => (e.clientName || '').trim().toLowerCase()));
          for (const row of clientRows()) {
            if (!have.has(row.clientName.toLowerCase())) clients.entries.push({ ...row, id: `${row.id}-${Date.now().toString(36)}` });
          }
        }
        stored.clientVersion = 1;
        changed = true;
      }
      // COO v1: the inbox gets an Other folder.
      if (stored.coo && (stored.cooVersion || 0) < 1) {
        if (!stored.coo.inbox.some((m) => m.category === 'other')) stored.coo.inbox.push(...cooOtherMail());
        stored.cooVersion = 1;
        changed = true;
      }
      // COO v2: applicant emails come from Ashby, not Gem.
      if (stored.coo && (stored.cooVersion || 0) < 2) {
        for (const m of stored.coo.inbox) if (m.from === 'Gem') m.from = 'Ashby';
        stored.cooVersion = 2;
        changed = true;
      }
      // OKR v1: drop the Sector Objective box and group objectives by department.
      if (stored.okrs && (stored.okrVersion || 0) < 1) {
        stored.okrs = stored.okrs.filter((o) => o.id !== 'okr-company');
        const byTeam = { 'team-a': 'deployments', 'team-b': 'marketing', 'team-c': 'hr' };
        for (const o of stored.okrs) {
          if (!o.department) o.department = byTeam[o.teamId] || 'deployments';
          if (/^Objective \d+$/.test(o.objective)) o.objective = 'Objective 1';
        }
        for (const d of OKR_DEPARTMENTS) {
          if (!stored.okrs.some((o) => o.department === d.key)) stored.okrs.push(starterOkr(d.key));
        }
        stored.okrVersion = 1;
        changed = true;
      }
      // Consistency v1: Team A/B/C become the 7 departments, placeholder people become the real team,
      // roadmap tasks become objectives, and PoC at Simile becomes Owner.
      if (stored.teams && (stored.consistencyVersion || 0) < 1) {
        const team = (id) => OLD_TEAM_MAP[id] || id;
        stored.teams = TEAMS.map((t) => ({ ...t }));
        for (const list of [stored.tasks, stored.initiatives, stored.milestones, stored.metrics]) {
          for (const item of list || []) if (item.teamId) item.teamId = team(item.teamId);
        }
        const oldIds = (stored.people || []).map((p) => p.id);
        stored.people = seedPeople(stored.scheduleLeaders || undefined);
        const person = (id) => {
          const i = oldIds.indexOf(id);
          return i === -1 ? id : stored.people[i % stored.people.length]?.id || null;
        };
        for (const t of stored.tasks || []) {
          if (t.assigneeId) t.assigneeId = person(t.assigneeId);
          const m = /^Task (\d+)$/.exec(t.title || '');
          if (m) t.title = `Objective ${m[1]}`;
          if (t.title === 'New task') t.title = 'New objective';
          if (t.description === 'Example task description. Replace it with the real scope of work.') t.description = 'Example description. Replace it with the real scope of work.';
        }
        for (const o of stored.okrs || []) {
          for (const kr of o.keyResults || []) kr.assigneeIds = (kr.assigneeIds || []).map(person).filter(Boolean);
        }
        const clients = (stored.clientMaterials || []).find((x) => x.id === 'clients');
        const poc = clients?.fields.find((f) => f.key === 'similePoc');
        if (poc && poc.label === 'PoC at Simile') poc.label = 'Owner';
        stored.consistencyVersion = 1;
        changed = true;
      }
      // People v3: real Simile names replace the placeholder and first-only names everywhere. Olivia Wang moves
      // to Marketing and Danny Wymer takes her place in Leadership. A few owners change to someone whose role fits.
      if (stored.people && (stored.peopleVersion || 0) < 3) {
        for (const e of stored.leadershipSchedule || []) {
          if (e.person === 'Olivia') e.person = 'Danny Wymer';
          if (e.person === 'Madison' && e.title === 'Prospect intro call') e.title = 'Client kickoff';
        }
        if (stored.scheduleLeaders) stored.scheduleLeaders = stored.scheduleLeaders.map((n) => (n === 'Olivia' ? 'Danny Wymer' : n));
        const ownerFixes = {
          'coo-inq-2': ['Madison', 'Lainie Yallen'], 'coo-inq-3': ['Mihika', 'Matt Smith'],
          'coo-inq-4': ['Julia', 'Sanjeev Musuvathy'], 'coo-inq-6': ['Eileen', 'Ally Waldman'],
        };
        for (const q of stored.coo?.inquiries || []) {
          const f = ownerFixes[q.id];
          if (f && q.owner === f[0]) q.owner = f[1];
        }
        const pocFixes = {
          'ta-1': ['Julia', 'Danny Wymer'], 'ta-2': ['Olivia', 'Chris Jensen'], 'ta-3': ['Madison', 'Danny Brown'], 'ta-4': ['Mihika', "Sam O'Meara"],
          'll-1': ['Eileen', 'Noah Glazov'], 'll-2': ['Matan', 'Lori Ferro'], 'll-3': ['Joon', 'Conor Leary'], 'll-4': ['Michael', 'Giorgio Loiacono'],
        };
        for (const list of Object.values(stored.pipeline || {})) {
          for (const r of Array.isArray(list) ? list : []) {
            const f = pocFixes[r.id];
            if (f && r.poc === f[0]) r.poc = f[1];
          }
        }
        const s10 = (stored.coo?.pastSprints || []).find((x) => x.id === 'sprint-10');
        if (s10 && Array.isArray(s10.team)) s10.team = s10.team.map((n) => (n === 'Matan' ? 'Danny Wymer' : n));
        renameDeep(stored, NAME_CHANGES);
        // Rebuild the team list, keeping anyone added by hand.
        const seeded = seedPeople();
        const ids = new Set(seeded.map((p) => p.id));
        stored.people = [...seeded, ...stored.people.filter((p) => !ids.has(p.id) && !(p.name in NAME_CHANGES))];
        stored.peopleVersion = 3;
        changed = true;
      }
      // People v4 and v5: Engineering and Product departments, and more of the team in every department.
      if (stored.people && (stored.peopleVersion || 0) < 5) {
        stored.teams = stored.teams || [];
        for (const t of TEAMS) if (!stored.teams.some((x) => x.id === t.id)) stored.teams.push({ ...t });
        const have = new Set(stored.people.map((p) => p.id));
        for (const p of teamMemberPeople()) if (!have.has(p.id)) stored.people.push(p);
        stored.peopleVersion = 5;
        changed = true;
      }
      // Copy v3: small spelling and grammar fixes.
      if ((stored.copyVersion || 0) < 3) {
        replaceDeep(stored, COPY_FIXES_3);
        stored.copyVersion = 3;
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
      if (syncPeople(stored)) changed = true;
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

// Everyone on the Schedule Management list is also a person on the roadmap and Team Management.
export function syncPeople(d) {
  if (!d.people || !d.scheduleLeaders) return false;
  let added = false;
  for (const name of d.scheduleLeaders) {
    if (!d.people.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      d.people.push({ id: personId(name), name, role: '', teamId: null, bandwidth: 'open' });
      added = true;
    }
  }
  return added;
}

// Copy v3: small spelling and grammar fixes, applied wherever the old phrase appears in saved data.
const COPY_FIXES_3 = {
  "Population modelling for consumer panels": "Population modeling for consumer panels",
  "Concentrated growth bets in AI, enterprise, fintech": "Concentrated growth bets in AI, enterprise and fintech",
  "Click a name or initial to see": "Click a name or initials to see",
  "I know in the long run, I want to be a founder.": "I know that in the long run I want to be a founder.",
  "took the organization from seven people to 77": "took the organization from 7 people to 77"
};

// Copy v2: grammar and wording fixes, applied wherever the old phrase appears in saved data.
const COPY_FIXES_2 = {
  "tools access and the deployment checklist": "tool access and the deployment checklist",
  "Getting data access, security review, user accounts and the first test running, with who owns each step.": "Getting data access, the security review, user accounts and the first test running, with an owner for each step.",
  "The main event for industrial AI and digital twins, with a focus on industrial IoT, digital twin and AI solutions.": "The main event for industrial AI and digital twins, with a strong focus on industrial IoT.",
  "Thrive X – growth vehicle": "Thrive X (growth vehicle)",
  "start and finish each initiative, experiment or task.": "start and finish each initiative, experiment or objective.",
  "to make sure I was also helping their progress.": "to make sure I was also supporting their progress.",
  "Working under a COO like Lainie Yallen, who scaled Hebbia 15x in under two years and now leads sales and customer-facing work in the emerging field of simulation for business decision-making, tells me the caliber of talent Simile attracts.": "The chance to work under a COO like Lainie Yallen, who scaled Hebbia 15x in under two years and now leads sales and customer-facing work in the emerging field of simulation for business decision-making, shows me the caliber of talent Simile attracts.",
  "That change will come from direct use of Simile’s product, and also from the decisions clients make when they use Simile to guide their decision-making.": "That change will come from people using Simile’s product directly, and also from the decisions clients make with Simile’s help.",
  "as well as conversations with people on the team. I want to show how I’m thinking about addressing the role": "as well as what I’ve learned from conversations with people on the team. I want to show how I’m approaching the role",
  "Issues Needed to Be Addressed": "Issues That Need to Be Addressed"
};

// Swaps whole names, never parts of sentences: a value that is exactly an old name, an old name in a
// comma-separated list, or the matching person id ("person-priya-shah").
function renameDeep(value, names) {
  const ids = Object.fromEntries(Object.entries(names).map(([from, to]) => [personId(from), personId(to)]));
  const one = (v) => names[v] || ids[v] || v;
  const walk = (v) => {
    if (typeof v === 'string') {
      if (names[v] || ids[v]) return one(v);
      if (!v.includes(',')) return v;
      const parts = v.split(',').map((x) => x.trim());
      if (!parts.some((x) => names[x])) return v;
      return [...new Set(parts.map(one))].join(', ');
    }
    if (Array.isArray(v)) {
      const out = v.map(walk);
      // Two old names can become one person (Zoe Martin and Isaac Grant), so drop the repeat in name lists.
      return out.some((x, i) => x !== v[i] && typeof x === 'string') ? [...new Set(out)] : out;
    }
    if (v && typeof v === 'object') for (const k of Object.keys(v)) v[k] = walk(v[k]);
    return v;
  };
  return walk(value);
}

function replaceDeep(value, fixes) {
  if (typeof value === 'string') {
    let out = value;
    for (const [from, to] of Object.entries(fixes)) out = out.split(from).join(to);
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => replaceDeep(v, fixes));
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) value[k] = replaceDeep(value[k], fixes);
  }
  return value;
}

function save(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

export function getData() {
  return data;
}

// Nothing is saved while the site is read-only.
export function commit() {
  if (isReadOnly()) return;
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
