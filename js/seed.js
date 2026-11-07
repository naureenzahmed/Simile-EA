import { addDays, todayISO, uid } from './utils.js';

// Departments. These are the "teams" used across the roadmap, OKRs and Team Management.
export const TEAMS = [
  { id: 'deployments', name: 'Deployments', color: '#ff7a66' },
  { id: 'marketing', name: 'Marketing', color: '#7fb8e6' },
  { id: 'hr', name: 'HR', color: '#e0a95a' },
  { id: 'evals', name: 'Evals', color: '#b48ee0' },
  { id: 'consumer', name: 'Consumer', color: '#5fc4c4' },
  { id: 'ceo', name: 'CEO Office', color: '#e88fb4' },
  { id: 'revops', name: 'Revenue Operations', color: '#a3c45f' },
  // Engineering and Product don't report to the COO, so they show in Team Management but not on the OKR page.
  { id: 'engineering', name: 'Engineering', color: '#6c7ee0', okr: false },
  { id: 'product', name: 'Product', color: '#e6cf5a', okr: false },
];

// Old Team A/B/C ids, kept so saved data can be moved onto departments.
export const OLD_TEAM_MAP = { 'team-a': 'deployments', 'team-b': 'marketing', 'team-c': 'hr' };

// Bandwidth for the Availability section: has room, at capacity, or overloaded.
export const BANDWIDTH = [
  { key: 'open', label: 'Has bandwidth' },
  { key: 'full', label: 'Bandwidth full' },
  { key: 'over', label: 'Needs to be freed up' },
];

// Leadership: the Schedule Management names, with no department (shown as Leadership).
const LEADER_BANDWIDTH = {
  'Lainie Yallen': 'over', 'Eileen Smith': 'full', 'Julia Lauer': 'open', 'Danny Wymer': 'full', 'Madison Fox': 'open',
  'Mihika Kapoor': 'over', 'Matan Amir': 'full', 'Joon Sung Park': 'open', 'Michael Bernstein': 'full',
};

// Team members in each department, with their bandwidth.
export const TEAM_MEMBERS = [
  ['Rory Pan', 'deployments', 'over'], ['Ryan Boyd', 'deployments', 'full'], ['Gurbani Singh', 'deployments', 'open'],
  ['Sofia Russo', 'marketing', 'full'], ['Olivia Wang', 'marketing', 'full'], ['Shannon Hittson', 'marketing', 'open'],
  ['Ally Waldman', 'hr', 'open'], ['Christian Guanzing', 'hr', 'full'],
  ['Kritarth Anand', 'evals', 'over'], ['Skylar Wang', 'evals', 'full'], ['Nico Cavalluzzi', 'evals', 'open'],
  ['Estela L. Franca', 'consumer', 'full'], ['Alexandre A.', 'consumer', 'open'],
  ['Sanjeev Musuvathy', 'ceo', 'full'],
  ['Noah Glazov', 'revops', 'over'], ['Amy Shorter', 'revops', 'open'],
];

// More of the team, added later. Saved data gets anyone here who is missing.
export const MORE_TEAM_MEMBERS = [
  ['Blake Pender', 'revops', 'full'], ['Sam Collura', 'revops', 'open'],
  ['Mika Okamoto', 'evals', 'full'], ['Sanjay Kairam', 'evals', 'over'], ['Sam Hasani', 'evals', 'open'],
  ['Maria Dulce Zamora', 'ceo', 'over'],
  ['Tommy F.', 'hr', 'full'],
  ['Amir Hakimjavadi', 'engineering', 'full'], ['Manav Rathod', 'engineering', 'open'], ['Lucas Haarmann', 'engineering', 'full'],
  ['Carina Ramos', 'engineering', 'over'], ['Rohit Chouhan', 'engineering', 'open'], ['Tiffany Ding', 'engineering', 'full'],
  ['Sahana Srinivasan', 'engineering', 'open'], ['Jason Xiong', 'engineering', 'full'], ['Jenning Chen', 'engineering', 'over'],
  ['Sarah C.', 'engineering', 'full'], ['Tony Lee', 'engineering', 'open'], ['Chinmay Kulkarni', 'engineering', 'full'],
  ['Isabelle L.', 'product', 'full'], ['Jasmine Stoy', 'product', 'open'], ['Sam Catania', 'product', 'over'], ['Keeyen Y.', 'product', 'full'],
  // Leadership (no department).
  ['Chetan Patel', null, 'full'], ['Jyothi Vallurupalli', null, 'over'], ['Arturo Rajlevsky', null, 'open'],
  ['Chris Jensen', 'revops', 'over'], ['Danny Brown', 'revops', 'full'], ['Sam O\'Meara', 'revops', 'full'], ['Giorgio Loiacono', 'revops', 'open'],
  ['Lori Ferro', 'revops', 'full'], ['Conor Leary', 'revops', 'open'], ['Diane O\'Hara', 'revops', 'open'],
  ['Matt Smith', 'deployments', 'over'], ['Zoe Y.', 'deployments', 'full'], ['Christina Neiva de Figueiredo', 'deployments', 'open'],
  ['Shrushti M.', 'deployments', 'full'], ['Alex Quill', 'deployments', 'open'], ['Sarah Salzman', 'deployments', 'full'],
  ['Rehan Bhiwandiwalla', 'deployments', 'open'], ['Emily Nelsen', 'deployments', 'full'], ['Patrick O\'Brien', 'deployments', 'open'],
  ['Adriana Jimenez', 'deployments', 'full'],
  ['Alexander Dang', 'evals', 'full'],
  ['E.J. Labaria III', 'hr', 'open'],
  ['Christopher P.', 'engineering', 'open'], ['Zicheng Zhen', 'engineering', 'full'], ['Quan Nguyen', 'engineering', 'open'],
  ['Antonio Serrano', 'engineering', 'full'], ['Mike White', 'engineering', 'over'],
  ['Natasha Tenggoro', 'product', 'full'],
];

// Old placeholder names and the real people who replaced them, used to update saved data.
// Isaac Grant's work went to Sanjeev Musuvathy, and Olivia moved from Leadership to Marketing.
export const NAME_CHANGES = {
  Lainie: 'Lainie Yallen', Eileen: 'Eileen Smith', Julia: 'Julia Lauer', Olivia: 'Olivia Wang', Madison: 'Madison Fox',
  Mihika: 'Mihika Kapoor', Matan: 'Matan Amir', Joon: 'Joon Sung Park', Michael: 'Michael Bernstein',
  'Priya Shah': 'Rory Pan', 'Marcus Lee': 'Ryan Boyd', 'Hannah Brooks': 'Gurbani Singh',
  'Sofia Alvarez': 'Sofia Russo', 'Ben Carter': 'Shannon Hittson',
  'Grace Kim': 'Ally Waldman', 'Daniel Okafor': 'Christian Guanzing',
  'Leo Fischer': 'Kritarth Anand', 'Ava Thompson': 'Skylar Wang', 'Ryan Patel': 'Nico Cavalluzzi',
  'Maya Nguyen': 'Estela L. Franca', 'Ethan Walsh': 'Alexandre A.',
  'Zoe Martin': 'Sanjeev Musuvathy', 'Isaac Grant': 'Sanjeev Musuvathy',
  'Noah Rivera': 'Noah Glazov', 'Chloe Dubois': 'Amy Shorter',
};

// What each person is working on right now, shown when you click them in Team Management.
export const PERSON_FOCUS = {
  "Lainie Yallen": [
    "Q4 board meeting prep",
    "Series B investor follow-ups",
    "Hiring a Chief of Staff"
  ],
  "Eileen Smith": [
    "Consumer insights roadmap",
    "Customer check-ins"
  ],
  "Julia Lauer": [
    "Renewal calls",
    "Quirk's LA conference plan"
  ],
  "Danny Wymer": [
    "Customer QBRs",
    "Q4 pipeline review"
  ],
  "Madison Fox": [
    "Deployment capacity planning",
    "Client kickoffs"
  ],
  "Mihika Kapoor": [
    "Product roadmap review",
    "Prospect demos"
  ],
  "Matan Amir": [
    "Platform reliability",
    "Engineering hiring plan"
  ],
  "Joon Sung Park": [
    "Board meeting prep",
    "Customer QBR prep"
  ],
  "Michael Bernstein": [
    "Simulation accuracy research",
    "Prospect demos"
  ],
  "Rory Pan": [
    "Lead the CVS onsite plan",
    "Fix data access for the Wealthfront pilot",
    "Deployment checklist v2"
  ],
  "Ryan Boyd": [
    "Set up the Suntory deployment",
    "Weekly deployment status report"
  ],
  "Gurbani Singh": [
    "Shadow the Itaú rollout",
    "Draft the client QBR deck"
  ],
  "Sofia Russo": [
    "Quirk's LA booth materials",
    "Q4 case study with Gallup"
  ],
  "Olivia Wang": [
    "December offsite venue",
    "November newsletter"
  ],
  "Shannon Hittson": [
    "Paid ads refresh",
    "Event follow-up emails"
  ],
  "Ally Waldman": [
    "Chief of Staff interview loop",
    "Benefits enrollment reminders"
  ],
  "Christian Guanzing": [
    "Onboarding for three new hires",
    "Update Ashby pipeline stages"
  ],
  "Kritarth Anand": [
    "Weekly eval report",
    "Benchmark refresh for consumer models",
    "Client eval for Deloitte"
  ],
  "Skylar Wang": [
    "Eval dashboard cleanup",
    "Review simulation accuracy"
  ],
  "Nico Cavalluzzi": [
    "Eval methodology doc",
    "Spot-check client results"
  ],
  "Estela L. Franca": [
    "Suntory research findings",
    "Survey design for the Nike lead"
  ],
  "Alexandre A.": [
    "Consumer panel recruiting",
    "Insights summary for CVS"
  ],
  "Sanjeev Musuvathy": [
    "Q4 board deck draft",
    "November investor update",
    "CEO travel for December",
    "NYC customer dinner prep"
  ],
  "Noah Glazov": [
    "Pipeline review prep",
    "HubSpot cleanup",
    "Forecast model update"
  ],
  "Amy Shorter": [
    "Lead list enrichment",
    "Renewals contract tracker"
  ],
  "Blake Pender": ["Enterprise prospect outreach", "Pfizer proposal follow-up"],
  "Sam Collura": ["Quirk's LA lead follow-up", "Demo scheduling"],
  "Mika Okamoto": ["Eval suite for new simulation features", "Weekly eval report review"],
  "Sanjay Kairam": ["Simulation accuracy study", "Client eval for Deloitte", "Eval methodology doc review"],
  "Sam Hasani": ["Data pipeline for client evals", "Survey data cleanup"],
  "Maria Dulce Zamora": ["Founders' calendars", "December board meeting logistics", "Founder travel"],
  "Tommy F.": ["Engineering candidate sourcing", "Interview scheduling"],
  "Amir Hakimjavadi": ["Simulation engine performance"],
  "Manav Rathod": ["Client data connectors"],
  "Lucas Haarmann": ["Agent memory improvements"],
  "Carina Ramos": ["Platform reliability fixes", "On-call rotation"],
  "Rohit Chouhan": ["API rate limits"],
  "Tiffany Ding": ["Simulation dashboard front end"],
  "Sahana Srinivasan": ["Model fine-tuning experiments"],
  "Jason Xiong": ["Deployment tooling"],
  "Jenning Chen": ["Infrastructure cost review", "Security review for the Itaú rollout"],
  "Sarah C.": ["Population modeling for consumer panels"],
  "Tony Lee": ["Batch simulation jobs"],
  "Chinmay Kulkarni": ["Human-AI interaction research"],
  "Isabelle L.": ["Client feedback roundup", "Q1 product spec"],
  "Jasmine Stoy": ["Onboarding flow redesign"],
  "Sam Catania": ["Product roadmap review", "Pricing page update", "Customer interviews"],
  "Keeyen Y.": ["Design system refresh", "Simulation report templates"],
  "Chetan Patel": ["Data strategy for Q1", "Client data access standards"],
  "Jyothi Vallurupalli": ["GTM weekly agenda", "Q4 pipeline targets", "Sales hiring plan"],
  "Arturo Rajlevsky": ["Enterprise pricing review", "Partner channel plan"],
  "Chris Jensen": ["Global sales forecast", "Delta Air Lines demo"],
  "Danny Brown": ["Pfizer proposal", "Strategic account plans"],
  "Sam O'Meara": ["Verizon demo follow-up", "Strategic account renewals"],
  "Giorgio Loiacono": ["Marriott intro", "Sales playbook update"],
  "Lori Ferro": ["Mastercard lead follow-up", "Event lead qualification"],
  "Conor Leary": ["Spotify qualification call"],
  "Diane O'Hara": ["Outbound sequences", "Lead list review"],
  "Matt Smith": ["Laptops for new hires", "Deployment ops checklist"],
  "Zoe Y.": ["Wealthfront pilot setup"],
  "Christina Neiva de Figueiredo": ["Itaú rollout support", "Client training sessions"],
  "Shrushti M.": ["Client onboarding calls"],
  "Alex Quill": ["Deployment status updates"],
  "Sarah Salzman": ["Gallup deployment", "Client success plans"],
  "Rehan Bhiwandiwalla": ["Solution design for Unilever"],
  "Emily Nelsen": ["Pre-sales demos", "Solution proposals"],
  "Patrick O'Brien": ["Technical discovery calls"],
  "Adriana Jimenez": ["Proof-of-concept scoping"],
  "Alexander Dang": ["Compute capacity planning", "Data pipeline monitoring"],
  "E.J. Labaria III": ["GTM candidate sourcing", "Offer letters"],
  "Christopher P.": ["Simulation API improvements"],
  "Zicheng Zhen": ["Agent evaluation tooling"],
  "Quan Nguyen": ["Client dashboard features"],
  "Antonio Serrano": ["Java SDK for client integrations"],
  "Mike White": ["Core platform architecture", "Engineering onboarding docs"],
  "Natasha Tenggoro": ["Product design reviews", "Brand refresh"]
};

export function teamMemberPeople() {
  return [...TEAM_MEMBERS, ...MORE_TEAM_MEMBERS].map(([name, teamId, bandwidth]) => ({ id: personId(name), name, role: '', teamId, bandwidth, focus: [...(PERSON_FOCUS[name] || [])] }));
}

// The team: leadership (the Schedule Management names) plus the department members.
export function seedPeople(names = LEADERS) {
  return [
    ...names.map((name) => ({ id: personId(name), name, role: '', teamId: null, bandwidth: LEADER_BANDWIDTH[name] || 'open', focus: [...(PERSON_FOCUS[name] || [])] })),
    ...teamMemberPeople(),
  ];
}

export function leaderBandwidth(name) {
  return LEADER_BANDWIDTH[name] || 'open';
}

export function personId(name) {
  return `person-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export const INITIATIVES = [
  { id: 'init-1', name: 'Initiative 1', teamId: 'deployments', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
  { id: 'init-2', name: 'Initiative 2', teamId: 'marketing', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
  { id: 'init-3', name: 'Initiative 3', teamId: 'hr', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
];

const TASK_STATUSES = ['Backlog', 'Ready', 'In progress', 'In design', 'Committed', 'Done'];

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function seedTasks() {
  const tasks = [];
  INITIATIVES.forEach((init) => {
    const teamPeople = seedPeople();
    const count = randomInt(2, 4);
    for (let i = 1; i <= count; i++) {
      const startOffset = randomInt(-21, 45);
      const duration = randomInt(3, 12);
      const assignee = teamPeople.length ? teamPeople[randomInt(0, teamPeople.length - 1)] : null;
      tasks.push({
        id: uid('task'),
        title: `Objective ${i}`,
        description: 'Example description. Replace it with the real scope of work.',
        impact: 'Example impact statement.',
        status: TASK_STATUSES[randomInt(0, TASK_STATUSES.length - 1)],
        assigneeId: assignee ? assignee.id : null,
        startDate: addDays(todayISO(), startOffset),
        endDate: addDays(todayISO(), startOffset + duration),
        designDeadline: '',
        sectionId: init.id,
        teamId: init.teamId,
        client: '',
        createdBy: 'You',
        blockedBy: [],
        subtasks: [],
        comments: [],
      });
    }
  });
  return tasks;
}

// Key milestones for the week: one per department, all due Friday of the current week.
export const WEEKLY_MILESTONES = [
  ['deployments', 'CVS onsite plan signed off'],
  ['marketing', "Quirk's LA booth materials approved"],
  ['hr', 'Chief of Staff final-round interviews scheduled'],
  ['evals', 'Weekly eval report shared with clients'],
  ['consumer', 'Suntory research findings delivered'],
  ['ceo', 'Q4 board deck draft sent for review'],
  ['revops', 'Target Accounts and Lead Lists updated for the pipeline review'],
];

export function seedMilestones() {
  return WEEKLY_MILESTONES.map(([teamId, title]) => ({ id: `ms-${teamId}`, title, teamId, weekly: true }));
}

function seedMonths() {
  const now = new Date();
  const months = [];
  for (let offset = -3; offset <= 4; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      isCurrent: offset === 0,
      isProjection: offset > 0,
    });
  }
  return months;
}

function seedWeeks() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const weeks = [];
  for (let i = -2; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i * 7);
    weeks.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isCurrent: i === 0,
    });
  }
  return weeks;
}

function seedMetrics() {
  return [
    { id: 'metric-a', name: 'Metric A', teamId: 'deployments', target: 'Target', values: {} },
    { id: 'metric-b', name: 'Metric B', teamId: 'marketing', target: 'Target', values: {} },
    { id: 'metric-c', name: 'Metric C', teamId: 'hr', target: 'Target', values: {} },
  ];
}

export const OKR_DEPARTMENTS = [
  { key: 'deployments', label: 'Deployments' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'hr', label: 'HR' },
  { key: 'evals', label: 'Evals' },
  { key: 'consumer', label: 'Consumer' },
  { key: 'ceo', label: 'CEO Office' },
  { key: 'revops', label: 'Revenue Operations' },
];

// A starter objective for a department column.
export function starterOkr(department, days = 30) {
  return {
    id: `okr-${department}`, objective: 'Objective 1', teamId: null, department,
    keyResults: [{ id: `kr-${department}-1`, title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), days), assigneeIds: [] }],
  };
}

function seedOkrs() {
  return [
    {
      id: 'okr-1', objective: 'Objective 1', teamId: 'deployments', department: 'deployments',
      keyResults: [
        { id: 'kr-1-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: [] },
        { id: 'kr-1-2', title: 'Key result 2', current: 0, target: 100, deadline: addDays(todayISO(), 45), assigneeIds: [] },
      ],
    },
    {
      id: 'okr-2', objective: 'Objective 1', teamId: 'marketing', department: 'marketing',
      keyResults: [{ id: 'kr-2-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: [] }],
    },
    {
      id: 'okr-3', objective: 'Objective 1', teamId: 'hr', department: 'hr',
      keyResults: [{ id: 'kr-3-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: [] }],
    },
    ...['evals', 'consumer', 'ceo', 'revops'].map((d) => starterOkr(d)),
  ];
}

// Documentation: how to get access to each tool. Passwords never go here.
export const TOOL_ACCESS_NOTE = [
  'How to get access to a tool:',
  '1. Ask in the #tool-access Slack channel with the tool name and why you need it.',
  '2. The admin listed below approves it and invites your work email, using Google sign-in where the tool supports it.',
  '3. Turn on two-factor sign-in the first time you log in.',
  '4. Keep any passwords in the company password manager. Never put passwords or keys on this page.',
  '5. When someone changes roles or leaves, the admin removes their access the same day.',
].join('\n');

const TOOL_ACCESS = [
  ['Google Workspace', 'Set up by the admin on day one. Sign in with your work email.', 'Chief of Staff', 'Email, calendar, Drive and Docs. Sign-in for most other tools.'],
  ['Slack', 'Invite sent to your work email on day one.', 'Chief of Staff', 'Team chat, #tool-access requests and roadmap alerts.'],
  ['HubSpot', 'Request in #tool-access. Seats are limited, so say which team you are on.', 'CEO EA', 'CRM for accounts, deals, sequences and event follow-ups.'],
  ['Ashby', 'Request in #tool-access. Interviewers get a free interviewer seat.', 'HR', 'Applicant tracking, interview scheduling and scorecards.'],
  ['Apollo', 'Request in #tool-access. Credits are shared, so check before bulk exports.', 'Chief of Staff', 'Finding contact details for leads and candidates.'],
  ['Juicebox', 'Request in #tool-access. Recruiting team only.', 'HR', 'Searching for technical candidates across 30+ sources.'],
  ['Claude', 'Request in #tool-access. Added to the team workspace.', 'CTO EA', 'Writing, research and the skills that connect our tools.'],
  ['Granola', 'Install from granola.ai and sign in with Google.', 'CTO EA', 'Meeting notes that feed objectives on the GTM Roadmap.'],
];

function toolAccessGuide() {
  return {
    id: 'docs-logins', title: 'Tool Access Guide', note: TOOL_ACCESS_NOTE,
    fields: TOOL_ACCESS_FIELDS,
    entries: toolAccessRows(),
  };
}

export const TOOL_ACCESS_FIELDS = [
  { key: 'name', label: 'Tool' },
  { key: 'loginProcess', label: 'How to Get Access' },
  { key: 'adminAccess', label: 'Admin (Grants Access)' },
  { key: 'useCases', label: 'Use Cases' },
];

export function toolAccessRows() {
  return TOOL_ACCESS.map(([name, loginProcess, adminAccess, useCases], i) => ({ id: `tool-${i + 1}`, name, loginProcess, adminAccess, useCases }));
}

// Documentation: templates, SOPs and team onboarding, kept in their own sections at the top.
export const SALES_DOC_TITLES = {"sales-doc-1": "Sales Deck Template", "pitch-doc-1": "Pitch Deck Template", "demos-doc-1": "Demo Slide Template", "marketing-materials-1": "Marketing Material Components", "one-pager-1": "One-Pager Template"};

export function seedDocLibrary() {
  const doc = (id, title, notes) => ({ id, title, url: '', notes });
  return [
    {
      id: 'docs-templates', title: 'Templates',
      entries: [
        doc('tpl-investor-newsletter', 'Investor Newsletter Template', 'Monthly. Sections: highlights, lowlights, key metrics (revenue, pipeline, headcount), asks and next steps.'),
        doc('tpl-board-deck', 'Board Deck Template', 'Quarterly. Sections: summary, financials, pipeline and forecast, product updates, hiring, risks and decisions needed.'),
        doc('tpl-sales-deck-enterprise', 'Sales Deck Template: Enterprise', 'For enterprise buyers. Problem, how Simile works, customer proof, pilot plan, pricing and next steps.'),
        doc('tpl-sales-deck-consumer', 'Sales Deck Template: Consumer & Retail', 'Same structure as the enterprise deck, with consumer research use cases and retail case studies.'),
      ],
    },
    {
      id: 'docs-client-sops', title: 'Client SOPs',
      entries: [
        doc('sop-client-onboarding', 'Client Onboarding SOP', 'Steps from signed contract to kickoff: welcome email, kickoff call, success plan, owners on both sides and a 30/60/90-day check-in schedule.'),
        doc('sop-client-setup', 'Client Data and Access Setup SOP', 'Getting data access, the security review, user accounts and the first test running, with an owner for each step.'),
        doc('sop-client-qbr', 'Client QBR SOP', 'How to prepare and run quarterly business reviews: results so far, open issues, renewal and expansion.'),
      ],
    },
    {
      id: 'docs-team-onboarding', title: 'Team Onboarding',
      entries: [
        doc('onb-deployments', 'Deployment Team Onboarding', 'First two weeks: product training, shadowing live client deployments, tool access and the deployment checklist.'),
        doc('onb-consumer', 'Consumer Team Onboarding', 'First two weeks: consumer research use cases, key accounts, research methods and how we report results.'),
        doc('onb-hr', 'HR Team Onboarding', 'First two weeks: hiring process in Ashby, benefits and payroll setup, policies and the new-hire checklist.'),
      ],
    },
  ];
}

function seedDocs() {
  return [
    ...seedDocLibrary(),
    toolAccessGuide(),
    {
      id: 'docs-sales-pitch', title: 'Sales & Pitch Documents',
      entries: [
        { id: 'sales-doc-1', title: 'Sales Deck Template', url: '', notes: '' },
        { id: 'pitch-doc-1', title: 'Pitch Deck Template', url: '', notes: '' },
        { id: 'demos-doc-1', title: 'Demo Slide Template', url: '', notes: '' },
        { id: 'marketing-materials-1', title: 'Marketing Material Components', url: '', notes: '' },
        { id: 'one-pager-1', title: 'One-Pager Template', url: '', notes: '' },
      ],
    },
  ];
}

// Columns of the Recruitment Tech Stack table.
export const TECH_STACK_FIELDS = [
  { key: 'software', label: 'Software' },
  { key: 'description', label: 'Description', multiline: true },
  { key: 'cost', label: 'Cost' },
];

const TECH_STACK = [
  ['Grokbot', 'Grokbot will reach ideal candidates and automate messages to them. It covers LinkedIn, where sales and ops people spend most of their time, and X, where engineers and technical people are most active. It can also scan new publications and research to find the right people in highly technical fields.', '$30/mo for SuperGrok. Grok Business is $30/user/mo, SuperGrok Lite is $10/mo, SuperGrok Heavy is $300/mo and Enterprise is custom.'],
  ['Apollo', 'Apollo makes it quick to pull email addresses.', '$49–$119/user/mo billed yearly (Basic is $49, Professional is $79 and Organization is $119), or about $59–$149 billed monthly. There is a free plan. Credits, add-ons and overages can raise the total a lot.'],
  ['Juicebox', 'Juicebox searches LinkedIn, GitHub, Google Scholar and 30 more data sources, so we can reach business-oriented profiles just as easily as deep science ones.', 'About $99–$179/seat/mo billed yearly (Starter is $99, or $119 billed monthly, and Growth is $179). The Agents add-on is $199/agent/mo. Searches are unlimited, but contact and export credits are capped at 500/mo on Starter and 1,500/mo on Growth. Prices changed in July 2026.'],
  ['Claude', 'Claude skills can connect all of these tools and automate the handoff of information between them. They can also send each interviewer a short summary and the right interview questions just before the meeting. Gumloop is an alternative.', '$20–$25/user/mo for most people (Pro is $20 and Team Standard is $25). Max 5x is $100/mo, Max 20x is $200/mo and Team Premium is $125/user/mo.'],
  ['Ashby', 'Ashby is an all-in-one recruiting platform: applicant tracking (ATS), sourcing, CRM, scheduling and hiring analytics. Once the ideal process is set up, email, scheduling and communication tracking are all automated.', 'The Foundations plan (up to 100 employees) is about $400/mo, or about $360/mo billed yearly. The Plus and Enterprise plans for larger teams are custom quotes. Add-ons such as AI Notetaker and Advanced Scheduling cost extra.'],
];

// One-line prices for the Tech Stack.
export const TECH_STACK_COSTS = {"Grokbot": "Grokbot: $30/mo", "Apollo": "Apollo: $49–119/user/mo", "Juicebox": "Juicebox: $99–179/seat/mo", "Claude": "Claude: $20–25/user/mo", "Ashby": "Ashby: about $400/mo"};

export function techStackRows() {
  return TECH_STACK.map(([software, description, cost], i) => ({ id: `tech-${i + 1}`, software, description, cost: TECH_STACK_COSTS[software] || cost }));
}

// Columns of the Recruitment School Partnerships table.
export const SCHOOL_FIELDS = [
  { key: 'school', label: 'School', multiline: true },
  { key: 'city', label: 'City' },
  { key: 'strengths', label: 'Strengths', multiline: true },
  { key: 'labs', label: 'Notable Labs', multiline: true },
  { key: 'orgs', label: 'Notable Organizations', multiline: true },
];

// Top schools for deep learning, AI, ML and simulation.
const TOP_SCHOOLS = [
  ['Stanford University', 'Stanford, CA', 'Deep learning, NLP, human-centered AI, generative agents and social simulation', 'Stanford AI Lab (SAIL), Stanford HAI, Center for Research on Foundation Models (CRFM), Stanford HCI Group', 'Stanford ACM, Stanford AI Alignment, TreeHacks'],
  ['MIT', 'Cambridge, MA', 'Machine learning, robotics, computational science and simulation', 'CSAIL, MIT Media Lab, MIT-IBM Watson AI Lab, Center for Computational Science and Engineering', 'MIT Machine Intelligence Community, HackMIT'],
  ['Carnegie Mellon University', 'Pittsburgh, PA', 'Machine learning, robotics, language technologies', 'Machine Learning Department, Robotics Institute, Language Technologies Institute', 'ScottyLabs (runs TartanHacks)'],
  ['UC Berkeley', 'Berkeley, CA', 'Deep learning, reinforcement learning, AI safety', 'Berkeley AI Research (BAIR), Center for Human-Compatible AI (CHAI), Sky Computing Lab', 'Machine Learning at Berkeley, Cal Hacks'],
  ['University of Toronto', 'Toronto, ON', 'Deep learning, computer vision, graphics and physics simulation', 'Vector Institute, Dynamic Graphics Project', 'University of Toronto Machine Intelligence Student Team (UTMIST)'],
  ['Université de Montréal and McGill University', 'Montreal, QC', 'Deep learning, generative models, reinforcement learning', 'Mila (Quebec AI Institute), IVADO, McGill Centre for Intelligent Machines', 'McGill AI Society, McHacks'],
  ['University of Waterloo', 'Waterloo, ON', 'Machine learning, AI engineering, systems', 'Waterloo.AI (Waterloo Artificial Intelligence Institute)', 'Hack the North, Socratica, Waterloo Data Science Club'],
  ['University of Washington', 'Seattle, WA', 'NLP, computer vision, human-computer interaction', 'Paul G. Allen School of Computer Science & Engineering, UW NLP, Allen Institute for AI (AI2, nearby)', 'DubHacks'],
  ['Princeton University', 'Princeton, NJ', 'Machine learning theory, NLP, computational social science', 'Princeton Language and Intelligence (PLI), Princeton Visual AI Lab', 'HackPrinceton'],
  ['University of Oxford', 'Oxford, UK', 'Machine learning theory, Bayesian ML, computer vision', 'Oxford Applied and Theoretical Machine Learning Group (OATML), Visual Geometry Group (VGG)', 'Oxford AI Society (OxAI)'],
];

export function schoolRows() {
  return TOP_SCHOOLS.map(([school, city, strengths, labs, orgs], i) => ({ id: `school-${i + 1}`, school, city, strengths, labs, orgs }));
}

// Columns of the Recruitment Event Attendance conferences table.
export const CONFERENCE_FIELDS = [
  { key: 'event', label: 'Event', multiline: true },
  { key: 'category', label: 'Category', multiline: true },
  { key: 'region', label: 'Region' },
  { key: 'dates', label: 'Dates' },
  { key: 'location', label: 'Location', multiline: true },
  { key: 'details', label: 'Details', multiline: true },
  { key: 'link', label: 'Link', type: 'url' },
];

const CONFERENCES = [
  ['RAISE Summit 2026', 'Simile', 'Europe', 'Jul 8–9, 2026', 'Carrousel du Louvre, Paris, and online', 'Joon Sung Park, Simile’s CEO and co-founder, is listed as a speaker. The speaker page doesn’t name his session.', 'https://tickets.raisesummit.com/2026/speaker/2388172/joon-sung-park'],
  ['Disney Accelerator 2026', 'Simile', '', '2026', '', 'Simile is one of the five startup companies selected for the 12th annual Disney Accelerator program in 2026.', 'https://www.kentertechhub.com/disney-accel-2026-en/'],
  ['TEDAI 2023', 'Before Simile (Joon’s research years)', '', '2023', '', 'Joon gave a talk called “A Simulation of Human Reality, Powered by AI” while he was a Stanford PhD student.', 'https://ted-ai-new-website-git-newpage-0611-xy-ai.vercel.app/speakers/joon-sung-park'],
  ['UIST 2023', 'Before Simile (Joon’s research years)', '', '2023', '', 'The Generative Agents paper won a Best Paper Award. UIST is an academic human-computer interaction conference.', ''],
  ['ICLR 2027', 'Deep learning and AI research', 'United States', 'Apr 26–30, 2027', 'Moscone Center, San Francisco, CA', 'One of the top three machine learning conferences.', 'https://www.beri.net/events/iclr-2027'],
  ['CVPR 2027', 'Deep learning and AI research', 'United States', 'Jun 20–24, 2027', 'Seattle, WA', 'The main computer vision conference.', 'https://www.thecvf.com/?p=137'],
  ['WACV 2027', 'Deep learning and AI research', 'United States', 'Jan 4–8, 2027', 'Orlando, FL', 'A smaller computer vision conference.', 'https://www.thecvf.com/?p=137'],
  ['NeurIPS 2026 (Atlanta)', 'Deep learning and AI research', 'United States', 'Dec 8–13, 2026', 'Atlanta, GA', 'NeurIPS is split across three cities this year: Sydney (Dec 6–12), Atlanta and Paris. Atlanta is the North American site.', 'https://aiweekly.co/node/12069'],
  ['NVIDIA GTC 2027', 'Simulation and digital twins', 'United States', 'Mar 14–18, 2027', 'San Jose McEnery Convention Center and venues across San Jose, CA', 'The biggest single event that covers AI, simulation (Omniverse), robotics and digital twins together.', 'https://www.nvidia.com/en-zz/gtc/faq/'],
  ['I/ITSEC 2026', 'Simulation and digital twins', 'United States', 'Nov 30–Dec 4, 2026', 'Orlando, FL', 'Known as the world’s largest event for modeling, simulation and training. It leans toward defense.', 'https://www.tradefairdates.com/IITSEC-M2078/Orlando.html'],
  ['Digital Twin Summit (North America)', 'Simulation and digital twins', 'United States', 'Aug 19, 2026', 'Denver, CO', 'The 2026 edition was on Aug 19 in Denver. Expect a similar summer date in 2027.', 'https://community.esri.com/t5/digital-twin-events/eb-p/digital-twin-events'],
  ['AAAI 2027', 'Deep learning and AI research', 'Canada', 'Feb 16–23, 2027', 'Palais des congrès, Montréal, QC', 'A major AI research conference.', 'https://trybibby.com/conference-deadlines/aaai-2027'],
  ['Upper Bound 2027', 'AI research and business', 'Canada', 'May 18–21, 2027', 'Edmonton Convention Centre, Edmonton, AB', 'Run by Amii. It mixes AI research with business adoption.', 'https://www.amii.ca/events/upper-bound-2027'],
  ['ALL IN 2027', 'AI industry', 'Canada', 'Sep 22–23, 2027', 'Palais des congrès, Montréal, QC', 'Canada’s largest AI conference, organized by Scale AI with Mila.', 'https://www.beri.net/events/all-in-2027'],
  ['ICASSP 2027', 'Speech and signal processing', 'Canada', 'May 16–21, 2027', 'Toronto, ON', 'The main conference for signal processing and speech AI.', 'https://www.opencurious.com/ai-conference-deadlines/icml-2027'],
  ['NeurIPS 2026 (Paris)', 'Deep learning and AI research', 'Europe', 'Dec 9–13, 2026', 'Paris, France', 'The European site of NeurIPS this year.', 'https://aiweekly.co/node/12069'],
  ['Winter Simulation Conference 2026', 'Simulation and digital twins', 'Europe', 'Dec 6–9, 2026', 'Glasgow, UK', 'The top academic simulation conference. It’s usually held in the US, so a European location is unusual.', 'https://www.informs.org/Meetings-Conferences/Community-Conferences-Calendar/(cc_year)/2026/(cc_month)/12'],
  ['Hannover Messe 2027', 'Simulation and digital twins', 'Europe', 'Apr 5–8, 2027', 'Hannover, Germany', 'The main event for industrial AI and digital twins, with a strong focus on industrial IoT.', 'https://www.hannovermesse.de/en/for-visitors/opening-hours/'],
  ['Digital Twins and Applications Europe 2027 (IET)', 'Simulation and digital twins', 'Europe', 'Jun 8–9, 2027', 'Madrid, Spain', 'Covers energy, manufacturing and smart cities. Paper submissions are due Jan 30, 2027.', 'https://digitaltwins.theiet.org/dta-europe-2027'],
  ['EUROSIM', 'Simulation and digital twins', 'Europe', '2026 edition held', 'Genova, Italy', 'The conference of the Federation of European Simulation Societies. The 2026 edition was in Genova.', 'https://easychair.org/cfp/topic?tid=17638670'],
  ['IEEE Digital Twin Conference', 'Simulation and digital twins', 'Europe', 'Sep 7–11, 2026', 'Rende, Italy', 'The 2026 edition was in Rende.', 'https://swc-ieee-2026.github.io/digitaltwin'],
];

// Corrections: missing region, dates and location, and official event sites instead of third-party pages.
export const CONFERENCE_FIXES = {
  'Disney Accelerator 2026': { details: 'Simile is one of the five startup companies selected for the 12th annual Disney Accelerator program in 2026.', region: 'United States', dates: 'Nov 3, 2026', location: 'Demo Day at Walt Disney Studios, Burbank, CA', link: 'https://thewaltdisneycompany.com/news/accelerator-2026-participants/' },
  'TEDAI 2023': { region: 'United States', dates: 'Oct 17–18, 2023', location: 'San Francisco, CA', link: 'https://tedai-sanfrancisco.ted.com/' },
  'UIST 2023': { region: 'United States', dates: 'Oct 29–Nov 1, 2023', location: 'San Francisco, CA', link: 'https://uist.acm.org/2023/' },
  'ICLR 2027': { link: 'https://iclr.cc/Conferences/2027' },
  'CVPR 2027': { link: 'https://cvpr.thecvf.com/' },
  'WACV 2027': { link: 'https://wacv.thecvf.com/' },
  'NeurIPS 2026 (Atlanta)': { link: 'https://neurips.cc/Conferences/2026' },
  'NeurIPS 2026 (Paris)': { link: 'https://neurips.cc/Conferences/2026' },
  'NVIDIA GTC 2027': { link: 'https://www.nvidia.com/gtc/' },
  'I/ITSEC 2026': { link: 'https://www.iitsec.org/' },
  'AAAI 2027': { link: 'https://aaai.org/conference/aaai/aaai-27/' },
  'ALL IN 2027': { link: 'https://www.scaleai.ca/' },
  'ICASSP 2027': { link: 'https://2027.ieeeicassp.org/' },
  'Winter Simulation Conference 2026': { link: 'https://www.wintersim.org/' },
  EUROSIM: { event: 'EUROSIM 2026', dates: 'Sep 21–23, 2026', location: 'Grand Hotel Savoia, Genova, Italy', details: 'The 12th congress of the Federation of European Simulation Societies, held with I3M 2026.', link: 'https://www.msc-les.org/eurosim2026/' },
};

// Event Attendance is split into Simile's past appearances, upcoming events and past events.
export const CONFERENCE_GROUPS = [
  { key: 'past', label: 'Simile’s Past Appearances' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past-events', label: 'Past Events (Next Edition Not Announced)' },
];
const CONFERENCE_GROUP_OF = {
  'RAISE Summit 2026': 'past', 'Disney Accelerator 2026': 'past', 'TEDAI 2023': 'past', 'UIST 2023': 'past',
  'Digital Twin Summit (North America)': 'past-events', EUROSIM: 'past-events', 'EUROSIM 2026': 'past-events', 'IEEE Digital Twin Conference': 'past-events',
};
export function conferenceGroupOf(event) {
  return CONFERENCE_GROUP_OF[event] || 'upcoming';
}

export function conferenceRows() {
  return CONFERENCES.map(([event, category, region, dates, location, details, link], i) => ({
    id: `conf-${i + 1}`, event, category, region, dates, location, details, link,
    ...(CONFERENCE_FIXES[event] || {}), group: conferenceGroupOf(event),
  }));
}

// Columns of the Recruitment Partnership Events companies table.
export const PARTNER_FIELDS = [
  { key: 'company', label: 'Company Name' },
  { key: 'event', label: 'Event' },
  { key: 'date', label: 'Date' },
  { key: 'notes', label: 'Notes', multiline: true },
];

export const EVENT_TYPES = ['GTM Offsite', 'Sales Kickoff', 'Executive Customer Dinner', 'Industry Event', 'Other'];
// One color per event type, used on the Events page and its calendar.
export const EVENT_TYPE_COLORS = {
  'GTM Offsite': '#7fb8e6',
  'Sales Kickoff': '#b48ee0',
  'Executive Customer Dinner': '#ff7a66',
  'Industry Event': '#e0a95a',
  Other: '#8f9bb3',
};
export const EVENT_STATUSES = ['Idea', 'Planning', 'Confirmed', 'Completed', 'Cancelled'];
export const EVENT_PHASES = [
  { key: 'pre', label: 'Before the Event' },
  { key: 'during', label: 'During the Event' },
  { key: 'after', label: 'After the Event' },
];

// Owners used on event checklists, alongside the team's names.
export const EVENT_ROLES = ['COO EA', 'CTO EA', 'Chief of Staff'];

// One checklist per event type. Each item is [text, owner, done].
const EVENT_CHECKLISTS = {
  'Executive Customer Dinner': {
    pre: [
      ['Guest list with RSVPs tracked', 'COO EA', true],
      ['Bio for each guest', 'Chief of Staff', true],
      ['Private room booked', 'COO EA', true],
      ['Menu confirmed with the restaurant', 'COO EA', false],
      ['Dietary needs collected from every guest', 'COO EA', false],
      ['Seating plan', 'Chief of Staff', false],
      ['Talking points for the host', 'Chief of Staff', false],
    ],
    during: [
      ['Place cards match the seating plan', 'COO EA', false],
      ['Host has talking points and guest bios on hand', 'Chief of Staff', false],
      ['Notes on each guest conversation for follow-up', 'Chief of Staff', false],
    ],
    after: [
      ['Handwritten thank-you notes sent within 24 hours', 'COO EA', false],
      ['Follow-ups logged in HubSpot', 'Chief of Staff', false],
    ],
  },
  'Sales Kickoff': {
    pre: [
      ['Agenda', 'Chief of Staff', true],
      ['Speakers confirmed', 'Chief of Staff', false],
      ['Awards chosen and ordered', 'COO EA', false],
      ['Travel and hotels booked for the whole team', 'CTO EA', false],
      ['Feedback survey drafted', 'Chief of Staff', false],
    ],
    during: [
      ['Run-of-show and speaker timing', 'Chief of Staff', false],
      ['Awards presented', 'COO EA', false],
    ],
    after: [
      ['Feedback survey sent to everyone', 'Chief of Staff', false],
      ['Survey results shared with leadership', 'Chief of Staff', false],
      ['Travel expenses reconciled', 'CTO EA', false],
    ],
  },
  'GTM Offsite': {
    pre: [
      ['Pre-reads sent a week ahead', 'Chief of Staff', true],
      ['How each session will run: goal, owner and format', 'Chief of Staff', false],
      ['Venue, travel and rooms booked', 'COO EA', true],
    ],
    during: [
      ['Decisions log kept for every session', 'Chief of Staff', false],
      ['Owner and deadline captured for each decision', 'CTO EA', false],
    ],
    after: [
      ['Slide deck of outcomes sent within 48 hours', 'Chief of Staff', false],
      ['Decisions added to the GTM Roadmap', 'Chief of Staff', false],
    ],
  },
  'Industry Event': {
    pre: [
      ['Lead list of target accounts', 'Chief of Staff', true],
      ['Booth presentation and materials', 'COO EA', false],
      ['Booth staffing, scripts and run-of-show', 'CTO EA', false],
    ],
    during: [
      ['Wi-Fi and connection confirmed with the event organizer', 'CTO EA', false],
      ['Lead list on hand', 'Chief of Staff', false],
      ['Calendar open for call bookings', 'COO EA', false],
      ['HubSpot ready to track every conversation', 'Chief of Staff', false],
    ],
    after: [
      ['Follow-ups on every conversation', 'Chief of Staff', false],
      ['Marketing recap of our attendance', 'COO EA', false],
    ],
  },
  Other: {
    pre: [['Goals and guest list', 'Chief of Staff', false], ['Venue and logistics booked', 'COO EA', false]],
    during: [['Run-of-show', 'Chief of Staff', false]],
    after: [['Follow-ups and recap', 'Chief of Staff', false]],
  },
};

// The checklist for a new event of this type. Starter events keep their sample owners and done marks.
// The COO EA owns about three in four items; every fourth item keeps its specialist owner.
export function eventOwnerAt(n, listed) {
  if (n % 4 !== 3) return 'COO EA';
  return listed && listed !== 'COO EA' ? listed : n % 8 === 3 ? 'Chief of Staff' : 'CTO EA';
}

export function eventChecklist(eventId, type, { sample = false } = {}) {
  const lists = EVENT_CHECKLISTS[type] || EVENT_CHECKLISTS.Other;
  const out = {};
  let n = 0;
  for (const phase of EVENT_PHASES) {
    out[phase.key] = (lists[phase.key] || []).map(([text, owner, done], i) => ({
      id: `${eventId}-${phase.key}-${i + 1}`, text, done: sample && done, link: '', notes: '', owner: sample ? eventOwnerAt(n++, owner) : '',
    }));
  }
  return out;
}

export const QUIRKS_LA = { name: "The Quirk's Event – Los Angeles", description: "Booth at Quirk's, the market research and consumer insights conference, to meet insights leaders at target accounts and book follow-up calls.", date: '2027-02-24', location: 'Los Angeles, CA', link: 'https://www.quirks.com/events/the-quirks-event-los-angeles-2027' };

// Placeholder events so the calendar shows a fuller season. Replace them with real ones.
export const PLACEHOLDER_EVENTS = [
  ['evt-ph-cab-lunch', 'Customer Advisory Board Lunch', 'Executive Customer Dinner', 'Lunch with eight customer leaders to review the roadmap and hear feedback.', '2026-11-19', 'San Francisco, CA', 'Confirmed'],
  ['evt-ph-neurips', 'NeurIPS 2026 Meetups', 'Industry Event', 'Small meetups with researchers and recruiting leads around NeurIPS in Atlanta.', '2026-12-09', 'Atlanta, GA', 'Planning'],
  ['evt-ph-investor-dinner', 'Investor Holiday Dinner', 'Executive Customer Dinner', 'Year-end dinner with board members and lead investors.', '2026-12-10', 'New York, NY', 'Planning'],
  ['evt-ph-holiday-party', 'Team Holiday Party', 'Other', 'End-of-year party for the whole team and partners.', '2026-12-17', 'San Francisco, CA', 'Planning'],
  ['evt-ph-leadership-offsite', 'Leadership Planning Offsite', 'GTM Offsite', 'Two days for leadership to set H1 priorities, budgets and hiring.', '2027-01-28', 'Sonoma, CA', 'Idea'],
  ['evt-ph-board-dinner', 'Q1 Board Meeting Dinner', 'Executive Customer Dinner', 'Dinner after the Q1 board meeting with directors and leadership.', '2027-02-11', 'San Francisco, CA', 'Idea'],
  ['evt-ph-gtc', 'NVIDIA GTC 2027', 'Industry Event', 'Attend sessions on simulation and digital twins and meet target accounts.', '2027-03-15', 'San Jose, CA', 'Idea'],
  ['evt-ph-enablement', 'Spring Sales Enablement Day', 'Sales Kickoff', 'One-day refresh on the pitch, new case studies and Q2 targets.', '2027-03-24', 'New York, NY', 'Idea'],
];

export function placeholderEvents() {
  return PLACEHOLDER_EVENTS.map(([id, name, type, description, date, location, status]) => ({
    id, name, type, description, date, location, status, checklist: eventChecklist(id, type, { sample: true }),
  }));
}

function seedEvents() {
  return [
    ['evt-gtm-offsite', 'Q1 GTM Offsite', 'GTM Offsite', 'Two-day offsite for sales, marketing and customer success to agree on 2027 targets, territories and plays.', '2027-01-14', 'Napa, CA', 'Planning'],
    ['evt-sales-kickoff', '2027 Sales Kickoff', 'Sales Kickoff', 'Annual kickoff covering the product roadmap, the new pitch, enablement sessions and awards.', '2027-02-03', 'San Francisco, CA', 'Planning'],
    ['evt-exec-dinner', 'NYC Executive Customer Dinner', 'Executive Customer Dinner', 'Private dinner for about 12 customer and prospect executives to build relationships and hear feedback.', '2026-12-03', 'New York, NY', 'Confirmed'],
    ['evt-industry', QUIRKS_LA.name, 'Industry Event', QUIRKS_LA.description, QUIRKS_LA.date, QUIRKS_LA.location, 'Planning'],
    ...PLACEHOLDER_EVENTS,
  ].map(([id, name, type, description, date, location, status]) => {
    const checklist = eventChecklist(id, type, { sample: true });
    if (id === 'evt-industry') checklist.pre[0].link = QUIRKS_LA.link;
    return { id, name, type, description, date, location, status, checklist };
  });
}

export const LEADERS = ['Lainie Yallen', 'Eileen Smith', 'Julia Lauer', 'Danny Wymer', 'Madison Fox', 'Mihika Kapoor', 'Matan Amir', 'Joon Sung Park', 'Michael Bernstein'];
export const SCHEDULE_TYPES = [
  { key: 'customer', label: 'Customer meeting', color: '#ff7a66' },
  { key: 'onsite', label: 'Onsite', color: '#7fb8e6' },
  { key: 'conference', label: 'Conference', color: '#e0a95a' },
  { key: 'office', label: 'In office', color: '#7cc49a' },
];

const SCHEDULE_CITIES = ['New York', 'Chicago', 'London', 'San Francisco', 'San Francisco', 'New York', 'Toronto', 'Boston', 'London', 'San Francisco',
  'New York', 'Toronto', 'San Francisco', 'New York', 'Chicago', 'New York', 'San Francisco', 'Boston', 'London', 'Chicago',
  'London', 'San Francisco', 'New York', 'Toronto', 'Toronto', 'Boston', 'Chicago', 'New York', 'San Francisco', 'London',
  'Toronto', 'San Francisco', 'Chicago', 'Boston', 'Toronto', 'New York'];

// Cities the leadership team works from, with the short code shown on the calendar.
export const CITIES = [
  { name: 'San Francisco', short: 'SF' },
  { name: 'New York', short: 'NYC' },
  { name: 'Boston', short: 'BOS' },
  { name: 'Chicago', short: 'CHI' },
  { name: 'Toronto', short: 'TOR' },
  { name: 'London', short: 'LDN' },
];

export function scheduleCityFor(index) {
  return SCHEDULE_CITIES[index] || '';
}

export function seedLeadershipSchedule() {
  return [
    ['Lainie Yallen', 'customer', 'Customer QBR', '2026-11-10', '2026-11-10', '10:00'],
    ['Eileen Smith', 'onsite', 'Client onsite', '2026-11-17', '2026-11-18', ''],
    ['Julia Lauer', 'conference', 'Industry conference', '2026-11-12', '2026-11-13', ''],
    ['Danny Wymer', 'office', 'In office', '2026-11-09', '2026-11-09', ''],
    ['Madison Fox', 'customer', 'Client kickoff', '2026-11-11', '2026-11-11', '14:00'],
    ['Mihika Kapoor', 'office', 'In office', '2026-11-16', '2026-11-16', ''],
    ['Matan Amir', 'conference', 'Industry conference', '2026-11-19', '2026-11-20', ''],
    ['Lainie Yallen', 'onsite', 'Client onsite', '2026-11-04', '2026-11-05', ''],
    ['Lainie Yallen', 'conference', 'Industry conference', '2026-12-02', '2026-12-03', ''],
    ['Lainie Yallen', 'office', 'In office', '2026-11-16', '2026-11-16', ''],
    ['Eileen Smith', 'customer', 'Customer check-in', '2026-11-05', '2026-11-05', '11:00'],
    ['Eileen Smith', 'conference', 'Industry conference', '2026-12-09', '2026-12-10', ''],
    ['Eileen Smith', 'office', 'In office', '2026-11-10', '2026-11-10', ''],
    ['Julia Lauer', 'customer', 'Renewal call', '2026-11-17', '2026-11-17', '13:00'],
    ['Julia Lauer', 'onsite', 'Client onsite', '2026-12-01', '2026-12-02', ''],
    ['Julia Lauer', 'office', 'In office', '2026-11-23', '2026-11-23', ''],
    ['Danny Wymer', 'customer', 'Customer QBR', '2026-11-12', '2026-11-12', '15:00'],
    ['Danny Wymer', 'onsite', 'Client onsite', '2026-11-24', '2026-11-25', ''],
    ['Danny Wymer', 'conference', 'Industry conference', '2026-12-02', '2026-12-03', ''],
    ['Madison Fox', 'onsite', 'Client onsite', '2026-11-18', '2026-11-19', ''],
    ['Madison Fox', 'conference', 'Industry conference', '2026-11-12', '2026-11-13', ''],
    ['Madison Fox', 'office', 'In office', '2026-11-03', '2026-11-03', ''],
    ['Mihika Kapoor', 'customer', 'Prospect demo', '2026-11-09', '2026-11-09', '09:30'],
    ['Mihika Kapoor', 'onsite', 'Client onsite', '2026-11-30', '2026-12-01', ''],
    ['Mihika Kapoor', 'conference', 'Industry conference', '2026-12-09', '2026-12-10', ''],
    ['Matan Amir', 'customer', 'Customer kickoff', '2026-11-23', '2026-11-23', '16:00'],
    ['Matan Amir', 'onsite', 'Client onsite', '2026-11-04', '2026-11-05', ''],
    ['Matan Amir', 'office', 'In office', '2026-11-11', '2026-11-11', ''],
    ['Joon Sung Park', 'customer', 'Customer QBR', '2026-11-18', '2026-11-18', '10:30'],
    ['Joon Sung Park', 'onsite', 'Client onsite', '2026-12-07', '2026-12-08', ''],
    ['Joon Sung Park', 'conference', 'Industry conference', '2026-11-19', '2026-11-20', ''],
    ['Joon Sung Park', 'office', 'In office', '2026-11-24', '2026-11-24', ''],
    ['Michael Bernstein', 'customer', 'Prospect demo', '2026-11-24', '2026-11-24', '11:00'],
    ['Michael Bernstein', 'onsite', 'Client onsite', '2026-11-10', '2026-11-11', ''],
    ['Michael Bernstein', 'conference', 'Industry conference', '2026-12-09', '2026-12-10', ''],
    ['Michael Bernstein', 'office', 'In office', '2026-11-04', '2026-11-04', ''],
  ].map(([person, type, title, start, end, time], i) => ({ id: `sched-${i + 1}`, person, type, title, start, end, time, city: SCHEDULE_CITIES[i], notes: '' }));
}

const POTENTIAL_INVESTORS = [
  {
    "firm": "Index Ventures",
    "link": "https://www.indexventures.com",
    "industry": "AI, infrastructure, security, enterprise",
    "stage": "Seed → Growth",
    "fund": "Index Growth fund",
    "fundSize": "$1.5B (2024) + $700M top-up",
    "fundClosed": "Jul 2026",
    "check": "Up to ~$50M+ at growth",
    "partner": "Shardul Shah",
    "role": "Partner; led Simile's $100M Series A",
    "linkedin": "https://www.linkedin.com/in/shardul-shah-3589062/",
    "linkedinStatus": "Verified",
    "why": "Led Simile's Series A and joined the Series B.",
    "relationship": "Existing investor",
    "source": "https://www.everythingstartups.com/vc-funds/index-ventures"
  },
  {
    "firm": "Greenoaks",
    "link": "https://www.greenoakscap.com",
    "industry": "Concentrated growth bets in AI, enterprise and fintech",
    "stage": "Series B → Late",
    "fund": "Greenoaks Capital Opportunities Fund VI",
    "fundSize": "$2.5B",
    "fundClosed": "Jul 2025",
    "check": "Large, concentrated positions",
    "partner": "Neil Mehta",
    "role": "Founder & Managing Partner",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Neil%20Mehta%20Greenoaks",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Led Simile's $200M Series B; also backs Anthropic.",
    "relationship": "Existing investor",
    "source": "https://thesaasnews.com/news/simile-raises-200m-series-b"
  },
  {
    "firm": "Sequoia Capital",
    "link": "https://sequoiacap.com",
    "industry": "AI, enterprise, frontier tech",
    "stage": "Seed → Growth",
    "fund": "Sequoia Expansion Fund (late-stage, US & Europe)",
    "fundSize": "~$7B",
    "fundClosed": "Apr 2026",
    "check": "Large late-stage checks",
    "partner": "Pat Grady",
    "role": "Co-Steward; long-time head of Sequoia's growth practice",
    "linkedin": "https://www.linkedin.com/in/gradypb/",
    "linkedinStatus": "Verified (public profile link)",
    "why": "Largest-ever late-stage fund, explicitly aimed at AI.",
    "relationship": "Target",
    "source": "https://thenextweb.com/news/sequoia-7-billion-expansion-fund-ai"
  },
  {
    "firm": "Andreessen Horowitz (a16z)",
    "link": "https://a16z.com",
    "industry": "AI apps & infrastructure, defense, bio",
    "stage": "Seed → Growth",
    "fund": "a16z Growth Fund V (also: $1.7B AI Infrastructure fund)",
    "fundSize": "$6.75B",
    "fundClosed": "Jan 2026",
    "check": "Large growth checks",
    "partner": "David George",
    "role": "General Partner; leads a16z Growth",
    "linkedin": "https://www.linkedin.com/in/david-george-32211a6/",
    "linkedinStatus": "Verified (public profile link)",
    "why": "Largest single fund in a16z's $15B raise; AI is the core theme.",
    "relationship": "Target",
    "source": "https://fintool.com/news/andreessen-horowitz-15-billion-venture-capital"
  },
  {
    "firm": "Lightspeed Venture Partners",
    "link": "https://lsvp.com",
    "industry": "AI, enterprise, infrastructure",
    "stage": "Seed → Growth",
    "fund": "Lightspeed Opportunity Fund III (+ Select VI $1.8B)",
    "fundSize": "$3.3B",
    "fundClosed": "Dec 2025",
    "check": "Large growth checks",
    "partner": "Ravi Mhatre",
    "role": "Partner & Co-Founder; led Lightspeed's Anthropic investment",
    "linkedin": "https://www.linkedin.com/in/ravimhatre/",
    "linkedinStatus": "Verified (public profile link)",
    "why": "Half of Opportunity III is reserved for new growth deals.",
    "relationship": "Target",
    "source": "https://www.newcomer.co/p/big-vcs-raise-billions-in-fresh-capital"
  },
  {
    "firm": "Thrive Capital",
    "link": "https://thrivecap.com",
    "industry": "AI, robotics, life sciences, fintech",
    "stage": "Seed → Growth",
    "fund": "Thrive X (growth vehicle)",
    "fundSize": "$9B (of $10B+)",
    "fundClosed": "Feb 2026",
    "check": "$5M to $1B+",
    "partner": "Kareem Zaki",
    "role": "General Partner (healthcare, fintech, software)",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Kareem%20Zaki%20Thrive%20Capital",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "New York firm; healthcare depth aligns with Simile's CVS Health relationship.",
    "relationship": "Target",
    "source": "https://www.newcomer.co/p/big-wins-for-two-of-ventures-most"
  },
  {
    "firm": "Founders Fund",
    "link": "https://foundersfund.com",
    "industry": "AI, defense, deep tech, space",
    "stage": "Seed → Growth",
    "fund": "Founders Fund Growth IV",
    "fundSize": "$6B",
    "fundClosed": "May 2026",
    "check": "~$460M avg per company in prior growth fund",
    "partner": "Napoleon Ta",
    "role": "Partner; leads the growth strategy",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Napoleon%20Ta%20Founders%20Fund",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Concentrated deep-tech growth bets (Anthropic, Anduril).",
    "relationship": "Target",
    "source": "https://thenextweb.com/news/founders-fund-6-billion-ai-venture"
  },
  {
    "firm": "Accel",
    "link": "https://www.accel.com",
    "industry": "AI, cloud/SaaS, fintech",
    "stage": "Seed → Growth",
    "fund": "Accel Leaders Fund V (+ $650M sidecar)",
    "fundSize": "$4B",
    "fundClosed": "Apr 2026",
    "check": "~$200M average check",
    "partner": "Matt Weigand",
    "role": "Partner, Late Stage (AI, Cloud/SaaS)",
    "linkedin": "https://www.linkedin.com/in/matt-weigand-0a929b10",
    "linkedinStatus": "Verified (public profile link)",
    "why": "Built for 20–25 late-stage AI deals; board seat at Nebius.",
    "relationship": "Target",
    "source": "https://thenextweb.com/news/accel-5-billion-fund-ai-anthropic-cursor-venture-capital"
  },
  {
    "firm": "General Catalyst",
    "link": "https://www.generalcatalyst.com",
    "industry": "Applied AI, healthcare, enterprise",
    "stage": "Seed → Growth",
    "fund": "GC Fund XII (in talks to raise ~$10B next)",
    "fundSize": "~$8B",
    "fundClosed": "2024",
    "check": "Seed to growth",
    "partner": "Quentin Clark",
    "role": "Managing Director, AI & enterprise infrastructure",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Quentin%20Clark%20General%20Catalyst",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Former Dropbox/SAP CTO; health-assurance strategy fits Simile's healthcare buyers.",
    "relationship": "Target",
    "source": "https://techcrunch.com/?p=3101491"
  },
  {
    "firm": "Kleiner Perkins",
    "link": "https://www.kleinerperkins.com",
    "industry": "AI, enterprise, hard tech",
    "stage": "Seed → Growth",
    "fund": "KP Select IV",
    "fundSize": "$2.5B",
    "fundClosed": "Mar 2026",
    "check": "Up to $150M+ at growth",
    "partner": "Ilya Fushman",
    "role": "Partner (PhD Applied Physics, Stanford)",
    "linkedin": "https://www.linkedin.com/in/ilyafushman",
    "linkedinStatus": "Verified (public profile link)",
    "why": "Growth fund aimed almost entirely at AI breakouts.",
    "relationship": "Target",
    "source": "https://www.caproasia.com/?p=69593"
  },
  {
    "firm": "ICONIQ Growth",
    "link": "https://www.iconiqcapital.com/growth",
    "industry": "AI, enterprise software",
    "stage": "Series B → Late",
    "fund": "ICONIQ Strategic Partners VII (Fund VIII raising)",
    "fundSize": "$5.75B",
    "fundClosed": "Jul 2024",
    "check": "Nine- to ten-figure checks",
    "partner": "Will Griffith",
    "role": "Founder & Managing Partner, ICONIQ Growth",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Will%20Griffith%20ICONIQ",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Led Anthropic's Series F; partner calls the focus \"all AI, all the time.\"",
    "relationship": "Target",
    "source": "https://aiwiki.ai/wiki/iconiq_capital"
  },
  {
    "firm": "Coatue",
    "link": "https://www.coatue.com",
    "industry": "AI, infrastructure, public/private crossover",
    "stage": "Growth → Late",
    "fund": "Coatue Growth Fund (+ new AI crossover fund)",
    "fundSize": "$7.7B + $1.4B companion",
    "fundClosed": "2025–2026",
    "check": "Large growth checks",
    "partner": "Lucas Swisher",
    "role": "Co-leads Coatue's growth fund",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Lucas%20Swisher%20Coatue",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Co-led Anthropic's Series G; 16 portfolio companies on Forbes AI 50.",
    "relationship": "Target",
    "source": "https://f4.fund/firms/coatue"
  },
  {
    "firm": "Spark Capital",
    "link": "https://www.sparkcapital.com",
    "industry": "AI, enterprise, fintech",
    "stage": "Seed → Growth",
    "fund": "Spark Growth V",
    "fundSize": "Part of $2.3B announced (~$3B target)",
    "fundClosed": "2026",
    "check": "$25M–$100M (Series B/C)",
    "partner": "Yasmin Razavi",
    "role": "General Partner, Growth; Anthropic board member",
    "linkedin": "https://www.linkedin.com/in/yasminrazavi",
    "linkedinStatus": "Verified (public profile link)",
    "why": "First venture firm to back Anthropic; U of T alum.",
    "relationship": "Target",
    "source": "https://dealroom.co/news/126570-spark-capital-seeks-3b-as-early-anthropic-bet-pays-off-100x/"
  },
  {
    "firm": "Bessemer Venture Partners",
    "link": "https://www.bvp.com",
    "industry": "AI across the stack, deep tech",
    "stage": "Seed → Growth",
    "fund": "Century Fund III / growth allocation",
    "fundSize": "$4B (of $5.75B)",
    "fundClosed": "Sep 2026",
    "check": "Large growth rounds",
    "partner": "Byron Deeter",
    "role": "Partner; leads growth allocation",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Byron%20Deeter%20Bessemer",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "New $4B growth pool targets ~two dozen AI-native companies.",
    "relationship": "Target",
    "source": "https://www.bvp.com/news/5-75-billion-to-back-the-founders-building-what-s-next"
  },
  {
    "firm": "Menlo Ventures",
    "link": "https://menlovc.com",
    "industry": "AI infrastructure & AI-native software",
    "stage": "Seed → Growth",
    "fund": "Menlo Inflection IV (Series B+)",
    "fundSize": "Part of $3B",
    "fundClosed": "Jun 2026",
    "check": "Growth checks, Series B+",
    "partner": "Matt Murphy",
    "role": "Partner; led Menlo's Anthropic investment",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Matt%20Murphy%20Menlo%20Ventures",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Runs the Anthology Fund with Anthropic; AI-only mandate.",
    "relationship": "Target",
    "source": "https://www.inkl.com/news/early-anthropic-backer-menlo-lands-3-billion-in-its-largest-ever-haul"
  },
  {
    "firm": "Dragoneer Investment Group",
    "link": "https://www.dragoneer.com",
    "industry": "AI, data infrastructure, growth tech",
    "stage": "Growth → Late",
    "fund": "Dragoneer Opportunities Fund VII (+ $12B evergreen)",
    "fundSize": "$4.3B",
    "fundClosed": "Dec 2025",
    "check": "$50M–$500M",
    "partner": "Marc Stad",
    "role": "Founder & Managing Partner",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Marc%20Stad%20Dragoneer",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Led an $8.3B OpenAI round; one of the largest growth checks in AI.",
    "relationship": "Target",
    "source": "https://www.eaglerockcfo.com/blog/venture-capital-firms/dragoneer-review"
  },
  {
    "firm": "Insight Partners",
    "link": "https://www.insightpartners.com",
    "industry": "Software, AI, data",
    "stage": "Series A → Late",
    "fund": "Insight Fund XIII (+ Opportunities Fund II)",
    "fundSize": "$12.5B",
    "fundClosed": "Jan 2025",
    "check": "$5M–$500M+",
    "partner": "George Mathew",
    "role": "Managing Director, AI & data",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=George%20Mathew%20Insight%20Partners",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Former Alteryx President; leads Insight's AI investing.",
    "relationship": "Target",
    "source": "https://cryptorank.io/news/feed/6524f-insight-partners-flagship-fund-13-raise"
  },
  {
    "firm": "CapitalG (Alphabet)",
    "link": "https://capitalg.com",
    "industry": "AI/ML, data infrastructure, enterprise",
    "stage": "Growth → Late",
    "fund": "CapitalG growth capital (Alphabet-backed)",
    "fundSize": "~$7B AUM",
    "fundClosed": "Evergreen",
    "check": "Growth checks",
    "partner": "Jill Chase",
    "role": "General Partner, leads AI investing",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Jill%20Chase%20CapitalG",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Led Physical Intelligence and Isomorphic Labs; Google/DeepMind access.",
    "relationship": "Target",
    "source": "https://capitalg.com/team/jill-chase/"
  },
  {
    "firm": "Khosla Ventures",
    "link": "https://www.khoslaventures.com",
    "industry": "AI, deep tech, health",
    "stage": "Seed → Growth",
    "fund": "Khosla Opportunity Fund (raising)",
    "fundSize": "~$2.5B (of up to $5.5B, in talks)",
    "fundClosed": "Raising 2026",
    "check": "Opportunity checks for mature companies",
    "partner": "Vinod Khosla",
    "role": "Founder",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Vinod%20Khosla%20Khosla%20Ventures",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "First venture backer of OpenAI; deep-tech thesis.",
    "relationship": "Target",
    "source": "https://pulse2.com/khosla-ventures-reportedly-in-talks-to-raise-5-5-billion-in-new-funds/"
  },
  {
    "firm": "Lux Capital",
    "link": "https://www.luxcapital.com",
    "industry": "Deep tech, frontier science, AI, defense",
    "stage": "Seed → Growth",
    "fund": "Lux Ventures IX",
    "fundSize": "$1.5B",
    "fundClosed": "Jan 2026",
    "check": "Early with follow-through at scale",
    "partner": "Josh Wolfe",
    "role": "Co-Founder & Managing Partner",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Josh%20Wolfe%20Lux%20Capital",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Pure deep-tech and frontier-science specialist.",
    "relationship": "Target",
    "source": "https://techcrunch.com/2026/01/07/lux-capital-lands-1-5-billion-for-its-largest-fund-ever"
  },
  {
    "firm": "Radical Ventures",
    "link": "https://radical.vc",
    "industry": "AI-only (deep learning)",
    "stage": "Seed → Late",
    "fund": "Radical Breakouts Fund (late-stage AI) + $800M growth fund",
    "fundSize": "$1B+ first close",
    "fundClosed": "2026",
    "check": "Lead checks in late-stage AI",
    "partner": "Jordan Jacobs",
    "role": "Co-Founder & Managing Partner; Vector Institute co-founder",
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Jordan%20Jacobs%20Radical%20Ventures",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Deep-learning specialist (Cohere); Fei-Fei Li, an early Simile backer, is a Radical scientific partner.",
    "relationship": "Target",
    "source": "https://betakit.com/radical-ventures-launches-canadas-largest-ai-fund-with-1-billion-usd-first-close/"
  }
];

// Board & Investor Support: one editable table per section.
export const BOARD_SECTIONS = [
  {
    id: 'board-decks', title: 'Board Decks', note: 'One row per quarter, with the deck and a short summary of milestones and challenges.',
    addLabel: 'Add quarter',
    fields: [
      { key: 'quarter', label: 'Quarter', width: 'sm' },
      { key: 'link', label: 'Board Deck', type: 'url' },
      { key: 'milestones', label: 'Major Milestones', type: 'multiline' },
      { key: 'challenges', label: 'Challenges', type: 'multiline' },
    ],
  },
  {
    id: 'investor-updates', title: 'Investor Updates', note: 'Link to each update with its highlights, lowlights and next steps.',
    addLabel: 'Add update',
    fields: [
      { key: 'period', label: 'Update', width: 'sm' },
      { key: 'link', label: 'Link', type: 'url' },
      { key: 'highlights', label: 'Highlights', type: 'multiline' },
      { key: 'lowlights', label: 'Lowlights', type: 'multiline' },
      { key: 'nextSteps', label: 'Next Steps', type: 'multiline' },
    ],
  },
  {
    id: 'pitch-deck', title: 'Pitch Deck', note: 'The current pitch deck, plus older versions for reference.',
    topLink: 'Drive link to past decks',
    addLabel: 'Add version',
    fields: [
      { key: 'version', label: 'Version', width: 'sm' },
      { key: 'link', label: 'Link', type: 'url' },
      { key: 'updated', label: 'Last Updated', type: 'date' },
      { key: 'notes', label: 'Notes', type: 'multiline' },
    ],
  },
  {
    id: 'key-milestones', title: 'Major Milestones', note: 'Links to the latest numbers for revenue, pipeline, headcount and product.',
    addLabel: 'Add milestone',
    fields: [
      { key: 'area', label: 'Milestone', width: 'sm' },
      { key: 'link', label: 'Link', type: 'url' },
      { key: 'summary', label: 'Latest Summary', type: 'multiline' },
      { key: 'updated', label: 'Last Updated', type: 'date' },
    ],
  },
  {
    id: 'data-room', title: 'Data Room Links',
    note: 'Diligence documents and who is cleared to open them. Hover over initials to see names.',
    addLabel: 'Add link',
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'link', label: 'Link', type: 'url' },
      { key: 'people', label: 'Security Clearance', type: 'people' },
    ],
  },
  {
    id: 'investors', title: 'Investors', note: 'Our current investors, the round each joined and who we work with at each firm.',
    addLabel: 'Add investor',
    fields: [
      { key: 'firm', label: 'Firm Name' },
      { key: 'stage', label: 'Round Joined' },
      { key: 'partner', label: 'Partner' },
      { key: 'partnerLinkedin', label: 'Partner LinkedIn', type: 'url' },
      { key: 'partnerEmail', label: 'Partner Email' },
      { key: 'partnerPhone', label: 'Partner Number' },
      { key: 'boardMember', label: 'Board Member' },
      { key: 'observer', label: 'Board Observer' },
      { key: 'observerLinkedin', label: 'Observer LinkedIn', type: 'url' },
      { key: 'terms', label: 'Terms Summary', type: 'multiline' },
    ],
  },
  {
    id: 'potential-investors', title: 'Potential Investors',
    note: 'Growth-stage firms with an AI or deep tech focus that could lead or join our next round. Firms that already invest in us are listed under Investors instead.',
    addLabel: 'Add firm',
    fields: [
      { key: 'firm', label: 'Firm Name' },
      { key: 'link', label: 'Website', type: 'url' },
      { key: 'industry', label: 'Industry Focus', type: 'multiline' },
      { key: 'stage', label: 'Investing Stage' },
      { key: 'fund', label: 'Ideal Fund', type: 'multiline' },
      { key: 'fundSize', label: 'Fund Size' },
      { key: 'fundClosed', label: 'Fund Closed', width: 'sm' },
      { key: 'check', label: 'Typical Check' },
      { key: 'partner', label: 'Potential Partner' },
      { key: 'role', label: 'Partner Role', type: 'multiline' },
      { key: 'linkedin', label: 'Partner LinkedIn', type: 'url' },
      { key: 'linkedinStatus', label: 'LinkedIn Status' },
      { key: 'why', label: 'Why They Fit Simile', type: 'multiline' },
      { key: 'relationship', label: 'Relationship', width: 'sm' },
      { key: 'source', label: 'Source', type: 'url' },
      { key: 'poc', label: 'POC' },
    ],
  },
];

const CURRENT_INVESTORS = [
  ['Index Ventures', 'Series A lead, Series B'],
  ['Greenoaks', 'Series B lead'],
  ['Bain Capital Ventures (BCV)', 'Series A, Series B'],
  ['A*', 'Series A, Series B'],
  ['Hanabi Capital', 'Series A, Series B'],
  ['Factory', 'Series B'],
  ['CVS Health Ventures', 'Series B'],
  ['Definition', 'Series B'],
  ['Itaú Ventures', 'Series B extension'],
  ['Angel investor', ''],
];

// Who we work with at each firm, where we know it.
export const INVESTOR_PARTNERS = {
  'Index Ventures': {
    partner: 'Shardul Shah', partnerLinkedin: 'https://www.linkedin.com/in/shardul-shah-3589062/', boardMember: 'Shardul Shah',
    observer: 'Mark Xu', observerLinkedin: 'https://www.linkedin.com/in/marklxu/',
  },
  'Bain Capital Ventures (BCV)': { partner: 'Aaref Hilaly', partnerLinkedin: 'https://www.linkedin.com/in/aarefhilaly/' },
  'Angel investor': { partner: 'Panos Madamopoulos-Moraris', partnerLinkedin: 'https://www.linkedin.com/in/panosmm/' },
};

export function currentInvestorRows() {
  return CURRENT_INVESTORS.map(([firm, stage], i) => ({ id: `investors-${i + 1}`, firm, stage, ...(INVESTOR_PARTNERS[firm] || {}) }));
}

const firmKey = (name) => (name || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');

// Firms that already invest in us, so they stay off the Potential Investors list.
export function isCurrentInvestor(firm, current = CURRENT_INVESTORS.map(([f]) => f)) {
  return current.some((f) => firmKey(f) === firmKey(firm));
}

// Who at Simile owns the relationship. Only a couple are filled in so far.
export const POTENTIAL_POCS = ['Lainie Yallen', 'Joon Sung Park'];

export function potentialInvestorRows() {
  return POTENTIAL_INVESTORS
    .map((r, i) => ({ id: `potential-investors-${i + 1}`, ...r }))
    .filter((r) => !isCurrentInvestor(r.firm))
    .map((r, i) => ({ ...r, poc: POTENTIAL_POCS[i] || '' }));
}

// Security clearance levels for data room documents, most open first.
export const CLEARANCE = [
  { key: 'all', label: 'All investors' },
  { key: 'lead', label: 'Lead investors' },
  { key: 'board', label: 'Board only' },
];

// [title, clearance, people with access]
const DATA_ROOM = [
  ['Overview deck', 'all', ['Lainie Yallen', 'Joon Sung Park', 'Shardul Shah', 'Mark Xu', 'Aaref Hilaly', 'Mike Volpi', 'Panos Madamopoulos-Moraris']],
  ['Financial model', 'lead', ['Lainie Yallen', 'Joon Sung Park', 'Shardul Shah', 'Mark Xu', 'Aaref Hilaly']],
  ['Cap table', 'lead', ['Lainie Yallen', 'Joon Sung Park', 'Shardul Shah', 'Mark Xu']],
  ['Revenue report', 'all', ['Lainie Yallen', 'Noah Glazov', 'Shardul Shah', 'Mark Xu', 'Aaref Hilaly', 'Mike Volpi', 'Panos Madamopoulos-Moraris']],
  ['Customer contracts', 'lead', ['Lainie Yallen', 'Rory Pan', 'Shardul Shah', 'Mark Xu']],
  ['Product roadmap', 'all', ['Joon Sung Park', 'Lainie Yallen', 'Shardul Shah', 'Mark Xu', 'Aaref Hilaly', 'Panos Madamopoulos-Moraris']],
  ['Board minutes', 'board', ['Lainie Yallen', 'Joon Sung Park', 'Shardul Shah', 'Mark Xu']],
  ['Legal docs', 'lead', ['Lainie Yallen', 'Sanjeev Musuvathy', 'Shardul Shah', 'Mark Xu']],
  ['Hiring plan', 'all', ['Lainie Yallen', 'Ally Waldman', 'Shardul Shah', 'Mark Xu', 'Aaref Hilaly', 'Panos Madamopoulos-Moraris']],
];

export function dataRoomRows() {
  return DATA_ROOM.map(([title, clearance, people], i) => ({ id: `data-room-${i + 1}`, title, link: '', clearance, people: people.join(', ') }));
}

function seedBoardInvestor() {
  const rows = (key, values) => values.map((v, i) => ({ id: `${key}-${i + 1}`, [BOARD_SECTIONS.find((s) => s.id === key).fields[0].key]: v }));
  return {
    'board-decks': rows('board-decks', ['Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026']),
    'investor-updates': rows('investor-updates', ['August 2026', 'September 2026', 'October 2026']),
    investors: currentInvestorRows(),
    'data-room': dataRoomRows(),
    'potential-investors': potentialInvestorRows(),
    'pitch-deck': rows('pitch-deck', ['Current']),
    'key-milestones': rows('key-milestones', ['Revenue', 'Pipeline', 'Headcount', 'Product Updates']),
  };
}

export const CLIENT_INDUSTRIES = [
  'Consumer & Retail', 'Financial Services', 'Travel & Hospitality', 'Media & Entertainment',
  'Automotive', 'Healthcare', 'Telecom',
];

// Column types for Client Materials. "select" columns keep their own list of options.
export const COLUMN_TYPES = [
  { key: 'text', label: 'Text' },
  { key: 'multiline', label: 'Long text' },
  { key: 'number', label: 'Number' },
  { key: 'date', label: 'Date' },
  { key: 'url', label: 'Link' },
  { key: 'select', label: 'Dropdown' },
  { key: 'checkbox', label: 'Checkbox' },
];

export const CLIENT_FIELDS = [
  { key: 'clientName', label: 'Client Name' },
  { key: 'status', label: 'Status' },
  { key: 'driveLink', label: 'Link to Drive', type: 'url' },
  { key: 'clientPoc', label: 'PoC at Client' },
  { key: 'similePoc', label: 'Owner' },
  { key: 'industry', label: 'Industry', type: 'select', options: CLIENT_INDUSTRIES },
  { key: 'testRunning', label: 'Test Running' },
  { key: 'onsiteDate', label: 'Onsite Date', type: 'date' },
  { key: 'onsiteGoal', label: 'Onsite Goal' },
];

const CLIENTS = [
  ['Deloitte', ''],
  ['Wealthfront', 'Financial Services'],
  ['Suntory', 'Consumer & Retail'],
  ['CVS', 'Healthcare'],
  ['Garnett Station Partners', 'Financial Services'],
  ['Gallup', ''],
  ['Itaú', 'Financial Services'],
];

export function clientFields() {
  return CLIENT_FIELDS.map((f) => ({ ...f, ...(f.options ? { options: [...f.options] } : {}) }));
}

export function clientRows() {
  return CLIENTS.map(([clientName, industry], i) => ({ id: `client-${i + 1}`, clientName, industry }));
}

function mkClubs(names) {
  return names.map((name) => ({
    id: uid('club'), name, goal: '', theyGet: '', weGet: '',
    progressCurrent: 0, progressTarget: 100, eventDate: '', partnershipDate: '',
  }));
}

function seedRecruitment() {
  return [
    {
      id: 'rec-tech-stack',
      title: 'Tech Stack',
      metrics: [],
      table: {
        fields: TECH_STACK_FIELDS,
        rows: techStackRows(),
      },
    },
    {
      id: 'rec-schools',
      title: 'School Partnerships',
      note: 'Top schools for deep learning, AI, ML and simulation.',
      entities: [],
      metrics: [],
      table: { fields: SCHOOL_FIELDS, rows: schoolRows() },
    },
    {
      id: 'rec-sponsorships',
      title: 'Event Sponsorships',
      metrics: [
        { id: 'm1', label: 'Budget', target: '$1,000 / in-kind / intros', values: {} },
        { id: 'm2', label: 'Our interest', target: 'Videos, talent', values: {} },
        { id: 'm3', label: 'Type of talent', target: 'Eng / Ops / Sales', values: {} },
        { id: 'm4', label: 'Number of events', note: 'Look at hiring from the same level of talent.', target: null, values: {} },
        { id: 'm5', label: 'Demographic reached', target: null, values: {} },
        { id: 'm6', label: 'Leads (#)', target: '40 per event', values: {} },
        { id: 'm7', label: 'Interviews booked (%)', target: '75%', values: {} },
        { id: 'm8', label: 'Interviews booked (#)', target: '15 per event', values: {} },
      ],
    },
    {
      id: 'rec-attendance',
      title: 'Event Attendance',
      note: 'Conferences and events worth attending, plus the ones Simile and Joon have already been part of.',
      table: { fields: CONFERENCE_FIELDS, groups: CONFERENCE_GROUPS, rows: conferenceRows() },
      entities: [],
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: 100, values: {} },
        { id: 'm2', label: 'Interviews booked (%)', target: '20%', values: {} },
        { id: 'm3', label: 'Interviews booked (#)', target: 20, values: {} },
      ],
    },
    {
      id: 'rec-partnerships',
      title: 'Partnership Events',
      entities: [],
      table: { fields: PARTNER_FIELDS, rows: [] },
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: '30 per event', values: {} },
        { id: 'm2', label: 'Interviews booked (%)', target: '30%', values: {} },
        { id: 'm3', label: 'Interviews booked (#)', target: '9 per event', values: {} },
      ],
    },
    {
      id: 'rec-total',
      title: 'Total',
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: null, values: {} },
        { id: 'm2', label: 'Interviews booked (%)', target: null, values: {} },
        { id: 'm3', label: 'Interviews booked (#)', target: null, values: {} },
      ],
    },
  ];
}

// Office of COO: calendar, inbox, inquiries board and sprints.
export const COO_INBOX = [
  { key: 'investors', label: 'Investors' },
  { key: 'clients', label: 'Client Responses' },
  { key: 'candidates', label: 'Potential Candidates' },
  { key: 'spam', label: 'Spam' },
  { key: 'other', label: 'Other' },
];

// Inquiry columns, matching the Office of COO notes. (Potential issues were folded into Needs attention.)
export const COO_STAGES = [
  { key: 'needed', label: 'Needs Attention' },
  { key: 'solved', label: 'Solved' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'other', label: 'Other' },
];

// Starting status for each example email, in the same order as the inbox list.
const MAIL_STATUS_SEED = ['needs', 'progress', 'progress', 'needs', 'needs', 'done', 'done', 'done'];

export function mailStatusFor(id) {
  const i = Number((/^coo-mail-(\d+)$/.exec(id) || [])[1]) - 1;
  return MAIL_STATUS_SEED[i] || (id.startsWith('coo-mail-other') ? 'done' : 'needs');
}

const OTHER_MAIL = [
  ['other', 'Office manager', 'Holiday party RSVP', '2026-11-04', 'Please RSVP by the 20th and note any dietary needs.'],
  ['other', 'Notion', 'Your weekly workspace digest', '2026-11-03', 'Twelve pages were edited this week.'],
];

export function cooOtherMail() {
  return OTHER_MAIL.map(([category, from, subject, date, summary], i) => ({ id: `coo-mail-other-${i + 1}`, category, from, subject, date, summary, status: 'done' }));
}

// Due dates for the example sprint tasks.
export const SPRINT_TASK_DUE = {
  'sprint-12-t1': '2026-11-12', 'sprint-12-t2': '2026-11-04', 'sprint-12-t3': '2026-11-05', 'sprint-12-t4': '2026-11-09',
  'sprint-11-t1': '2026-10-23', 'sprint-11-t2': '2026-10-27', 'sprint-11-t3': '2026-10-30',
  'sprint-10-t1': '2026-10-08', 'sprint-10-t2': '2026-10-14',
};

// Owners for the example sprint tasks (person ids).
export const SPRINT_TASK_OWNER = {
  'sprint-12-t1': 'person-lainie-yallen', 'sprint-12-t2': 'person-olivia-wang', 'sprint-12-t3': 'person-sanjeev-musuvathy', 'sprint-12-t4': 'person-rory-pan',
  'sprint-11-t1': 'person-lainie-yallen', 'sprint-11-t2': 'person-sanjeev-musuvathy', 'sprint-11-t3': 'person-ally-waldman',
  'sprint-10-t1': 'person-eileen-smith', 'sprint-10-t2': 'person-sanjeev-musuvathy',
};

// A few calendar events for the week of Nov 2, so the week and day views have something to show.
export const COO_WEEK_EVENTS = [
  ['2026-11-02', '09:30', '1:1 with Lainie'],
  ['2026-11-03', '13:00', 'Investor call: Greenoaks'],
  ['2026-11-04', '11:00', 'Offsite venue walkthrough'],
  ['2026-11-05', '15:30', 'Pipeline review with RevOps'],
  ['2026-11-06', '10:00', 'Weekly wrap-up and sprint check-in'],
  ['2026-11-06', '16:00', 'Prep for board deck review'],
];

export function cooWeekEvents() {
  return COO_WEEK_EVENTS.map(([date, time, title], i) => ({ id: `coo-cal-wk-${i + 1}`, date, time, title, notes: '' }));
}

export function seedCoo() {
  const cal = [
    ...COO_WEEK_EVENTS,
    ['2026-11-09', '09:00', 'Weekly ops review'],
    ['2026-11-11', '14:00', 'Board prep with Lainie'],
    ['2026-11-13', '10:00', 'Hiring sync'],
    ['2026-11-18', '', 'Investor update due'],
    ['2026-11-20', '13:00', 'Client check-in: CVS'],
    ['2026-11-24', '11:00', 'Sprint planning'],
  ];
  const mail = [
    ['investors', 'Index Ventures', 'Scheduling the Q4 board meeting', '2026-11-04', 'Asking for three date options in early December.'],
    ['investors', 'Greenoaks', 'Follow-up on the October update', '2026-11-03', 'Wants more detail on pipeline growth.'],
    ['clients', 'CVS', 'Re: Onsite agenda for December', '2026-11-04', 'Confirmed the agenda and added two attendees.'],
    ['clients', 'Wealthfront', 'Re: Pilot results', '2026-11-02', 'Happy with the results and asking about next steps.'],
    ['candidates', 'Ashby', 'New applicant: Chief of Staff', '2026-11-04', 'Strong ops background, five years at a Series C startup.'],
    ['candidates', 'Referral', 'Intro: ML engineer from Stanford', '2026-11-01', 'Referred by an advisor. Open to a call next week.'],
    ['spam', 'Vendor outreach', 'Grow your pipeline 10x this quarter', '2026-11-04', ''],
    ['spam', 'Event promo', 'Last chance for early-bird tickets', '2026-11-02', ''],
    ...OTHER_MAIL,
  ];
  const inquiries = [
    ['needed', 'Offsite venue may be overbooked', 'Operations', 'The hotel has flagged a possible double booking for the December offsite.', 'Olivia Wang', '2026-11-14'],
    ['needed', 'Expense approvals are backed up', 'Finance', 'About 30 expense reports are waiting on approval.', 'Lainie Yallen', '2026-11-10'],
    ['needed', 'Laptops for new hires', 'IT', 'Three new hires start on the 17th and need laptops set up.', 'Matt Smith', '2026-11-12'],
    ['solved', 'Badge access for the NYC office', 'Facilities', 'New badges were issued to the whole team.', 'Sanjeev Musuvathy', '2026-11-03'],
    ['escalated', 'Contract terms with Itaú', 'Legal', 'Itaú asked for changes to the data terms that need sign-off.', 'Lainie Yallen', '2026-11-15'],
    ['other', 'Team photo day', 'People', 'Pick a date for new headshots for the website.', 'Ally Waldman', '2026-11-21'],
  ];
  const sprint = (id, name, start, end, tasks, goal, metrics, notes, team) => ({
    id, name, start, end,
    tasks: tasks.map(([text, done], i) => ({ id: `${id}-t${i + 1}`, text, done, due: SPRINT_TASK_DUE[`${id}-t${i + 1}`] || '', ownerId: SPRINT_TASK_OWNER[`${id}-t${i + 1}`] || null })),
    goal, metrics, notes, team,
  });
  return {
    calendar: [...cooWeekEvents(), ...cal.slice(COO_WEEK_EVENTS.length).map(([date, time, title], i) => ({ id: `coo-cal-${i + 1}`, date, time, title, notes: '' }))],
    inbox: mail.map(([category, from, subject, date, summary], i) => ({ id: `coo-mail-${i + 1}`, category, from, subject, date, summary, status: MAIL_STATUS_SEED[i] || 'needs' })),
    inquiries: inquiries.map(([stage, title, department, description, owner, deadline], i) => ({ id: `coo-inq-${i + 1}`, stage, title, department, description, owner, deadline })),
    currentSprint: sprint('sprint-12', 'Sprint 12', '2026-11-02', '2026-11-13',
      [['Finalize the Q4 board deck', false], ['Book the venue for the December offsite', true], ['Send the October investor update', true], ['Schedule the CVS onsite', false]],
      'Walk into the Q4 board meeting with the deck, numbers and offsite plan locked.',
      'Board deck approved by Lainie. Offsite venue signed. Investor update sent by the 18th.',
      '', ['Lainie Yallen', 'Olivia Wang', 'Madison Fox']),
    pastSprints: [
      sprint('sprint-11', 'Sprint 11', '2026-10-19', '2026-10-30',
        [['Close Series B paperwork', true], ['Set up board deck template', true], ['Plan Q4 hiring', false]],
        'Wrap up the Series B and set up Q4 planning.',
        'All closing documents signed. Q4 hiring plan drafted.',
        'Hiring plan moved to Sprint 12.', ['Lainie Yallen', 'Julia Lauer']),
      sprint('sprint-10', 'Sprint 10', '2026-10-05', '2026-10-16',
        [['Run the NYC customer dinner', true], ['Update investor list', true]],
        'Strengthen customer and investor relationships ahead of the raise.',
        'Dinner held with 12 executives. Investor list updated.',
        '', ['Eileen Smith', 'Danny Wymer']),
    ],
  };
}

export const ROADMAP_NOTE = "This page supports GTM leadership’s operating rhythm. It brings together all action items, meetings and planning cycles, and it automates agendas, pre-reads, meeting notes and follow-through on action items.\n\nThe page is connected to Granola, email and Slack. Agents pull information from these sources, send back action items and notes, and store everything in Google Drive. Quick links also make this an all-in-one page for the team.\n\nThe page is organized into the following sections:\n\n1. Initiatives overview: progress on our current initiatives.\n2. Client materials: quick access to major client materials.\n3. OKRs: the major objectives for each team reporting to the COO.\n4. Calendar: links to the major plans for a bird’s-eye view of what’s coming up and the timelines for each date.\n5. Tracked goals and metrics: the revenue and major deployment metrics the team is working toward. Together, these represent our end vision for the quarter.\n\nClick any objective, whether in the roadmap or the calendar, to see a summary: description, links, owners and connections. The connections show where the information comes from, where it’s used and where it’s stored.";

export const PIPELINE_NOTE = "This page shows our major revenue metrics.\n\nRevenue graph\nAt the top, the graph shows our revenue progression and current rate of growth.\n\nTarget accounts\nThis section tracks our progress with our target accounts. For each account, you’ll see:\n\n• Company name\n• Point of contact\n• Their title\n• Where we are in the sales process\n• Date last updated\n• A link to their materials in Google Drive\n\nTo qualify as a target account, a company must be in the Fortune 100, already be in contact with us and show strong potential to work with us.\n\nLead list\nThese are potential customers we’re working to engage, qualify and connect with the right buyer. We’ve highlighted the larger accounts we’d most like to engage quickly, along with their progress. Click the table to open HubSpot, where all the details live.\n\nAt a glance\nThis section shows the top 5 to 10 accounts and leads we want to focus on right now, the ones that have progressed the most or are moving fastest. Everything here is connected to HubSpot and updates automatically whenever changes are made there. To edit an account, click it to open it in HubSpot, where all its information lives.";

export const SCHEDULE_NOTE = "This page shows the schedules of the leadership and team members I’ll be working with. At the top, the Leadership Schedule Management and Team Management buttons take you straight to each section.\n\nLeadership Schedule Management\nThis section shows each leader’s meetings, who I’ll be working with and which city they’re in. The calendar shows where leaders will be this week, what they’re working on and their major milestones.\n\nI’ll coordinate this with the other EAs and the Chief of Staff so we stay on top of any changes and everyone has a bird’s-eye view of what each team member is doing.\n\nClick any item in the agenda to see more details: who is involved, the purpose of the trip or meeting, the dates, the city and any notes.\n\nTeam Management\nThis section highlights the key milestones for the week. The information is pulled automatically from the GTM Roadmap, so at a glance you can see exactly what we’re working toward this week.\n\nTeam bandwidth\nAt the bottom of the page, you can see each team member’s bandwidth and where they sit in the organization. Click a name or initials to see their full name, department and some of the tasks they’re working on.";

export const COO_NOTE = "Since I’ll be working closely with our COO, Lainie Yallen, this page is fully dedicated to supporting her.\n\nCalendar\nThe calendar shows Lainie’s schedule by month, week and day, along with everything she needs to get done. Click any item for more details.\n\nEmail\nIncoming emails are sorted by keyword into folders: investors, time-sensitive, potential candidates, spam and other. These folders can be adjusted as needed. I’ll go through these emails, escalate what needs her attention and handle what I can on my own. You can also check the status of each email to see how it’s been addressed.\n\nInquiries\nThis section tracks inquiries and issues that come up for leadership. They’re sorted into categories so we can spot problems early:\n\n• Needs attention\n• Solved\n• Escalated\n• Other\n\nThe categories can be adjusted as needed.\n\nAll inquiries live in HubSpot, and this page pulls from it directly. Team members can submit inquiries through Slack, and they go straight into HubSpot, so everything stays in sync. As work progresses, you can drag items between categories to show what’s done and what’s still open. Click any item to see a detailed description of the issue and who it involves.\n\nSprints\nThe current sprint shows the tasks to complete, the goal for the end of the sprint and who is responsible for each task. Past sprints are collapsed, and you can click to see the same details. Any unfinished task from a past sprint automatically moves to the next week unless marked otherwise.\n\nAt the bottom of the section, a visual overview shows sprint progress at a glance.\n\nOverall\nThis page keeps me focused on the exact goals of the people I work with, so I can track them and help us hit them.";

export const BOARD_NOTE = "This page supports fundraising and managing our current board members. It keeps all of our fundraising and board materials in one easy-to-reach place, organized into:\n\n• Board decks\n• Investor updates\n• Pitch decks and recent drafts\n• Major milestones\n• Data room links\n• Current investors\n• Prospective investors\n\nA note on data room access: Only specific people have clearance to access the data room. I don’t have access myself, but the initials of everyone who does are listed here. If you need to check who can view it, this is the place to look.";
export const EVENTS_NOTE = "This page holds all the events and offsites I’ve planned. For each one, you’ll find the details, a description, the tasks still to be done and its progress. Events are grouped by type.\n\nConversations with customer leads are tracked in HubSpot, and each event links directly to the related records in HubSpot.";

// Home: About Naureen.
export const ABOUT_BACKGROUND = "I’ve spent my career so far on the revenue side of early-stage companies, first evaluating them and now building one. In venture capital, I sourced 10+ startups a week and diligenced pre-seed to Series A companies across North America. At Framework, my market, customer and exit analysis on a construction AI company supported a $15M check. My work also focused on deal flow and due diligence, and I supported LP reporting and the administrative side of fundraising. At Alumni, I focused on pre-seed and seed AI and deep tech startups, as well as building their presence within Canada.\n\nAfter graduating from McGill in May, I joined Planned in growth to step into the shoes of the people I’d been trying to support in previous years. My job description was “find problems in the company and solve them, then move to the next thing.” I built a new go-to-market motion from scratch, selling directly to event planners rather than procurement leaders and directors. It reached $2M in pipeline across 10 target cities and led to 12 booked calls a day. I rebuilt customer onboarding, which cut the sales cycle by 40% and lifted participation by 15%. Afterwards, I ran technical recruiting, sourcing 400+ candidates a week. I automated most of the operational work with Claude skills, Granola, Clay and HubSpot: meeting notes, action items, outreach, scheduling and forecasting dashboards. That way, I could focus on each customer or candidate.\n\nSince 2022, I’ve also organized startup events, including North Star, a sold-out 1,000-seat conference that grew sponsorship by $50K, as well as LP dinners, founder dinners and a trip that brought 30 builders from four cities to Toronto Tech Week.";

export const ABOUT_EXPERIENCE = "At Planned, I opened a new revenue line selling directly to event planners instead of director-level buyers. I ran the full funnel for that segment myself: paid ads on Google, LinkedIn and Meta, outbound by email, phone and in person, sales, onboarding and customer success. I also kept Sales, Marketing, Customer Success and Product aligned on what I was learning. I built a system for every stage of the buying journey (awareness, evaluation and a well-timed touchpoint right before the decision) and automated outreach and retargeting to 2,000 to 3,000 prospects a week. I also built the forecasting dashboards we used to track it. The dashboards pulled everything from PostHog on how each user interacted with our ads, website and landing pages, along with their responses from calls, so we could see where each individual user stood. We tracked all of it in HubSpot. At Simile, I’d bring that context to the agendas, pre-reads, notes and action items behind GTM leadership’s operating rhythm. I’m excited to show some of the skills, automations and workflows that can be built on the backend, and to learn from my teammates how they’ve approached it, along with the interpersonal relationships that selling depends on.\n\nMy first role at McGill Ventures was executive assistant to the presidents, as we scaled the team from 7 people to 77. I managed our partnerships with VC firms and startups on their behalf, along with their major events. This meant managing two co-presidents with different priorities, as well as venture capital investors, founders and accelerators with their own priorities, while still building up the McGill Ventures brand. Within a year, I became chief of staff and then president. Along the way, I built the SOPs, templates and processes that took the organization from 7 people to 77, running 15 to 18 events and five programs a year. Across my roles, I’ve represented leaders to the same four groups this role serves: customers, partners, investors and candidates. I believe the key to my success here was nurturing relationships across the ecosystem that really supported sustainable growth for us. I was hands-on with all initiatives, covering responsibilities from ideation, execution and sales to passing the program down to the next leaders or event teardown.\n\nI treat events as part of go-to-market or as a lever to build culture. At Planned, I hosted four events in major cities to build brand awareness, and they also helped us fill two senior roles and one junior role within two weeks. At the same time, I was growing our social media, which took candidate inflow from the occasional applicant to 80 applications overnight per post. I sold out North Star’s 1,000 seats with 23 panelists and grew our sponsorship by $50K. In venture, I ran portfolio showcases, LP dinners and AGMs end to end. For Project Atlas, I raised $25K in corporate sponsorships to bring 30 builders from four cities to Toronto Tech Week and ran nine events with 12 partner firms. I’d bring the same discipline to Simile’s executive customer dinners, sales kickoffs, offsites and conference presence: every guest list, run of show and follow-up built to move a relationship forward.";

export const ABOUT_GOALS = "I want to spend my time with founders who are solving the hardest problems and with teams that hold the highest bar for quality. I’m optimizing for the steepest learning curve and for real impact through the product I work on.\n\nSimile offers exactly that. The chance to work under a COO like Lainie Yallen, who scaled Hebbia 15x in under two years and now leads sales and customer-facing work in the emerging field of simulation for business decision-making, shows me the caliber of talent Simile attracts. I want to contribute my strengths in coordination, organization and events while learning everything I can from the team, and help build a generational company. I know that in the long run I want to be a founder. That’s why working with somebody whose leadership I respect so deeply is important to me. I want to absorb every bit of information in every different type of situation possible.\n\nI also appreciate the nature of Simile’s technology. Since it allows businesses to run their decisions through simulations with 85% accuracy, businesses will not have to use unconscionable human data or spend millions on third-party data. This really advances how business and technology interact, because it would reduce risk on the cybersecurity side. It would increase access to better decision-making on the business side and likely also reduce the cost of doing such deep research on a market. This type of technology is bound to change the world. Now it’s up to the best team to execute on it, and I believe that’s the team at Simile, given their amazing track record and professionalism.";

export const ABOUT_WHY = "This page goes through all the major tasks and responsibilities described in the job description, as well as what I’ve learned from conversations with people on the team. I want to show how I’m approaching the role and what systems I would love to put in place within the first week of joining.";

// Pipeline & Forecasts. Example revenue: $0 at founding (Oct 2025), 5x in the last 5 months, $200M now.
export const REVENUE_HISTORY = [
  ['2025-10', 0], ['2025-11', 0.6e6], ['2025-12', 1.8e6], ['2026-01', 3.8e6], ['2026-02', 7.2e6],
  ['2026-03', 12.5e6], ['2026-04', 19.5e6], ['2026-05', 28.5e6], ['2026-06', 40e6],
  ['2026-07', 55.2e6], ['2026-08', 76.1e6], ['2026-09', 105.1e6], ['2026-10', 145e6], ['2026-11', 200e6],
].map(([month, revenue]) => ({ month, revenue }));

const LEAD_SOURCES = ['Inbound', 'Outbound', 'Event', 'Referral', 'Partner', 'Investor intro'];
const pipelineFields = (statuses) => [
  { key: 'company', label: 'Company Name' },
  { key: 'poc', label: 'PoC' },
  { key: 'buyer', label: 'Buyer' },
  { key: 'status', label: 'Status', type: 'select', options: statuses },
  { key: 'updated', label: 'Last Updated', type: 'date' },
  { key: 'materials', label: 'Link to Materials', type: 'url' },
  { key: 'source', label: 'Lead Source', type: 'select', options: LEAD_SOURCES },
];

export const PIPELINE_SECTIONS = [
  {
    id: 'target-accounts', title: 'Target Accounts', addLabel: 'Add account',
    note: 'Named accounts we are going after. PoC is who owns the account at Simile; Buyer is who signs on their side.',
    fields: pipelineFields(['Meeting booked', 'Demo', 'Proposal sent', 'Closed won', 'Closed lost']),
  },
  {
    id: 'lead-lists', title: 'Lead Lists', addLabel: 'Add lead',
    note: 'New leads to qualify. Move strong ones to Target Accounts.',
    fields: pipelineFields(['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted']),
  },
];

export function seedPipeline() {
  const rows = (prefix, list) => list.map(([company, poc, buyer, status, updated, source], i) => ({ id: `${prefix}-${i + 1}`, company, poc, buyer, status, updated, materials: '', source }));
  return {
    'target-accounts': rows('ta', [
      ['Unilever', 'Danny Wymer', 'VP of Consumer Insights', 'Meeting booked', '2026-11-04', 'Outbound'],
      ['Delta Air Lines', 'Chris Jensen', 'Head of Customer Research', 'Demo', '2026-11-02', 'Event'],
      ['Pfizer', 'Danny Brown', 'Director of Market Research', 'Proposal sent', '2026-11-05', 'Referral'],
      ['Verizon', "Sam O'Meara", 'VP of Customer Experience', 'Demo', '2026-10-30', 'Outbound'],
    ]),
    'lead-lists': rows('ll', [
      ['Nike', 'Noah Glazov', 'Senior Manager, Consumer Insights', 'New', '2026-11-05', 'Inbound'],
      ['Mastercard', 'Lori Ferro', 'Head of Research', 'Contacted', '2026-11-03', 'Event'],
      ['Spotify', 'Conor Leary', 'Director of User Research', 'Qualified', '2026-11-04', 'Inbound'],
      ['Marriott', 'Giorgio Loiacono', 'VP of Guest Insights', 'New', '2026-11-01', 'Investor intro'],
    ]),
  };
}

export function seedData() {
  const year = new Date().getFullYear();
  return {
    companyGoal: { title: 'EoY target', current: 0, target: 100, unit: '%', targetDate: `${year}-12-31` },
    teams: TEAMS,
    people: seedPeople(),
    initiatives: INITIATIVES,
    milestones: seedMilestones(),
    months: seedMonths(),
    weeks: seedWeeks(),
    metrics: seedMetrics(),
    okrs: seedOkrs(),
    docs: seedDocs(),
    recruitment: seedRecruitment(),
    recruitmentVersion: 15,
    clientMaterials: [
      {
        id: 'clients',
        title: 'Clients',
        fields: clientFields(),
        entries: clientRows(),
      },
    ],
    events: seedEvents(),
    boardInvestor: seedBoardInvestor(),
    coo: seedCoo(),
    weeklyMeetings: [],
    pipeline: seedPipeline(),
    leadershipSchedule: seedLeadershipSchedule(),
    scheduleVersion: 4,
    copyVersion: 3,
    consistencyVersion: 1,
    clientVersion: 1,
    docsVersion: 3,
    notesVersion: 7,
    eventsVersion: 2,
    homeVersion: 7,
    pipelineVersion: 1,
    milestonesVersion: 1,
    peopleVersion: 5,
    cooVersion: 7,
    scheduleLeaders: [...LEADERS],
    scheduleTypes: SCHEDULE_TYPES.map((t) => ({ ...t })),
    slackWebhookUrl: '',
    // Home page: About Naureen, Why I Built This and a note for each page card.
    home: { background: ABOUT_BACKGROUND, experience: ABOUT_EXPERIENCE, goals: ABOUT_GOALS, why: ABOUT_WHY },
    pageNotes: {
      recruitment: 'After the chat with Sanjeev, there is a need for hiring support. Here are a couple of ideas I can put together in my first days to start a system for recruiting technical talent. Sourcing and scheduling need to be automated and systemized, while the interviews stay personal, with people engaging candidates and giving us a chance to build relationships with them.\n\nThis page is about bringing top-of-funnel talent to Simile.\n\nA note on events: partnering with others on events is much more interesting, since it has the same impact for far less time and effort. With school partnerships, the goal is to build relationships early, so that when very strong talent comes along, it gets funneled to us quickly.\n\nTo build a successful funnel for Simile, we need several long-term relationships in place. That’s why we’re looking at:\n\n• School partnerships for newcomers\n• Event sponsorships for people already in the ecosystem\n• Event attendance, to understand who we’re getting in front of and whether they’re the right people, whether that’s a future client or a future employee\n• Event partnerships, as our ICPs converge\n• The total count from leads to interviews booked, and the gap between them',
      schedule: SCHEDULE_NOTE,
      documentation: 'This page keeps all the processes, SOPs and helpful links in one place, so they’re easy to find for me, anyone working with me and anyone I need to train. I can just send them this page. It also keeps the history and the lists I used for each of my campaigns. I made it to save time for myself and for anyone I work with.',
      roadmap: ROADMAP_NOTE,
      pipeline: PIPELINE_NOTE,
      coo: COO_NOTE,
      boardInvestor: BOARD_NOTE,
      events: EVENTS_NOTE,
    },
    tasks: seedTasks(),
  };
}
