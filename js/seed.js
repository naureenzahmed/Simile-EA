import { addDays, todayISO, uid } from './utils.js';

export const TEAMS = [
  { id: 'team-a', name: 'Team A', color: '#ff7a66' },
  { id: 'team-b', name: 'Team B', color: '#7fb8e6' },
  { id: 'team-c', name: 'Team C', color: '#e0a95a' },
];

export const PEOPLE = [
  { id: 'p1', name: 'Alex', role: 'Engineer', teamId: 'team-a' },
  { id: 'p2', name: 'Sam', role: 'Engineer', teamId: 'team-a' },
  { id: 'p3', name: 'Taylor', role: 'Engineer', teamId: 'team-a' },
  { id: 'p4', name: 'Jordan', role: 'Product Manager', teamId: 'team-a' },
  { id: 'p5', name: 'Riley', role: 'Designer', teamId: 'team-a' },
  { id: 'p6', name: 'Casey', role: 'Product Manager', teamId: 'team-b' },
  { id: 'p7', name: 'Morgan', role: 'Designer', teamId: 'team-b' },
  { id: 'p8', name: 'Drew', role: 'Engineer', teamId: 'team-b' },
  { id: 'p9', name: 'Blake', role: 'Engineer', teamId: 'team-b' },
  { id: 'p10', name: 'Quinn', role: 'Product Manager', teamId: 'team-c' },
  { id: 'p11', name: 'Sage', role: 'Designer', teamId: 'team-c' },
  { id: 'p12', name: 'Reese', role: 'Engineer', teamId: 'team-c' },
];

export const INITIATIVES = [
  { id: 'init-1', name: 'Initiative 1', teamId: 'team-a', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
  { id: 'init-2', name: 'Initiative 2', teamId: 'team-b', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
  { id: 'init-3', name: 'Initiative 3', teamId: 'team-c', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
];

const TASK_STATUSES = ['Backlog', 'Ready', 'In progress', 'In design', 'Committed', 'Done'];

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function seedTasks() {
  const tasks = [];
  INITIATIVES.forEach((init) => {
    const teamPeople = PEOPLE.filter((p) => p.teamId === init.teamId);
    const count = randomInt(2, 4);
    for (let i = 1; i <= count; i++) {
      const startOffset = randomInt(-21, 45);
      const duration = randomInt(3, 12);
      const assignee = teamPeople.length ? teamPeople[randomInt(0, teamPeople.length - 1)] : null;
      tasks.push({
        id: uid('task'),
        title: `Task ${i}`,
        description: 'Example task description. Replace it with the real scope of work.',
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

function seedMilestones() {
  return [
    { id: 'ms1', date: addDays(todayISO(), -30), title: 'Milestone 1', teamId: 'team-a' },
    { id: 'ms2', date: addDays(todayISO(), -10), title: 'Milestone 2', teamId: 'team-b' },
    { id: 'ms3', date: addDays(todayISO(), 20), title: 'Milestone 3', teamId: 'team-c' },
    { id: 'ms4', date: addDays(todayISO(), 60), title: 'Milestone 4', teamId: 'team-a' },
  ];
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
    { id: 'metric-a', name: 'Metric A', teamId: 'team-a', target: 'Target', values: {} },
    { id: 'metric-b', name: 'Metric B', teamId: 'team-b', target: 'Target', values: {} },
    { id: 'metric-c', name: 'Metric C', teamId: 'team-c', target: 'Target', values: {} },
  ];
}

function seedOkrs() {
  return [
    {
      id: 'okr-company', objective: 'Sector Objective 1', teamId: null,
      keyResults: [
        { id: 'kr-co-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 90), assigneeIds: [] },
        { id: 'kr-co-2', title: 'Key result 2', current: 0, target: 100, deadline: addDays(todayISO(), 60), assigneeIds: [] },
      ],
    },
    {
      id: 'okr-1', objective: 'Objective 1', teamId: 'team-a',
      keyResults: [
        { id: 'kr-1-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: ['p1', 'p4'] },
        { id: 'kr-1-2', title: 'Key result 2', current: 0, target: 100, deadline: addDays(todayISO(), 45), assigneeIds: ['p2'] },
      ],
    },
    {
      id: 'okr-2', objective: 'Objective 2', teamId: 'team-b',
      keyResults: [{ id: 'kr-2-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: ['p6', 'p8'] }],
    },
    {
      id: 'okr-3', objective: 'Objective 3', teamId: 'team-c',
      keyResults: [{ id: 'kr-3-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: ['p10', 'p12'] }],
    },
  ];
}

function seedDocs() {
  return [
    {
      id: 'docs-logins', title: 'Software Logins',
      fields: [
        { key: 'name', label: 'Software Name' },
        { key: 'loginProcess', label: 'Login Process' },
        { key: 'adminAccess', label: 'Admin Access' },
        { key: 'useCases', label: 'Use Cases' },
      ],
      entries: [],
    },
    {
      id: 'docs-tofu', title: 'Setup Instructions',
      entries: [
        { id: 'tofu-1', title: 'Setting up HubSpot sequences', url: '', notes: '' },
        { id: 'tofu-2', title: 'Setting up HeyReach sequences', url: '', notes: '' },
        { id: 'tofu-3', title: 'Setting up Google Ads', url: '', notes: '' },
        { id: 'tofu-4', title: 'Setting up LinkedIn Ads', url: '', notes: '' },
        { id: 'tofu-5', title: 'Setting up Meta Ads', url: '', notes: '' },
        { id: 'tofu-6', title: 'Setting up ChatGPT Ads', url: '', notes: '' },
      ],
    },
    {
      id: 'docs-sales-pitch', title: 'Sales & Pitch Documents',
      entries: [
        { id: 'sales-doc-1', title: 'Sales Document', url: '', notes: '' },
        { id: 'pitch-doc-1', title: 'Pitch Document', url: '', notes: '' },
        { id: 'demos-doc-1', title: 'Demo Documents', url: '', notes: '' },
        { id: 'marketing-materials-1', title: 'Marketing Materials', url: '', notes: '' },
        { id: 'one-pager-1', title: 'One-Pager', url: '', notes: '' },
      ],
    },
    {
      id: 'docs-ads-materials', title: 'Ad Materials',
      entries: [
        { id: 'ad-creatives-google', title: 'Ad Creatives: Google', url: '', notes: '' },
        { id: 'ad-creatives-meta', title: 'Ad Creatives: Meta', url: '', notes: '' },
        { id: 'ad-creatives-chatgpt', title: 'Ad Creatives: ChatGPT', url: '', notes: '' },
        { id: 'ad-creatives-linkedin', title: 'Ad Creatives: LinkedIn', url: '', notes: '' },
      ],
    },
    {
      id: 'docs-ads-audiences', title: 'Ad Audience Lists',
      entries: [
        { id: 'ad-audience-google', title: 'Google', url: '', notes: '' },
        { id: 'ad-audience-meta', title: 'Meta', url: '', notes: '' },
        { id: 'ad-audience-chatgpt', title: 'ChatGPT', url: '', notes: '' },
        { id: 'ad-audience-linkedin', title: 'LinkedIn', url: '', notes: '' },
      ],
    },
  ];
}

// Columns of the Recruitment Tech Stack table.
export const TECH_STACK_FIELDS = [
  { key: 'software', label: 'Software' },
  { key: 'description', label: 'Description', multiline: true },
  { key: 'cost', label: 'Cost', multiline: true },
];

const TECH_STACK = [
  ['Grokbot', 'Grokbot will reach ideal candidates and automate messages to them. It covers LinkedIn, where sales and ops people spend most of their time, and X, where engineers and technical people are most active. It can also scan new publications and research to find the right people in highly technical fields.', '$30/mo for SuperGrok. Grok Business is $30/user/mo, SuperGrok Lite is $10/mo, SuperGrok Heavy is $300/mo and Enterprise is custom.'],
  ['Apollo', 'Apollo makes it quick to pull email addresses.', '$49–$119/user/mo billed yearly (Basic is $49, Professional is $79 and Organization is $119), or about $59–$149 billed monthly. There is a free plan. Credits, add-ons and overages can raise the total a lot.'],
  ['Juicebox', 'Juicebox searches LinkedIn, GitHub, Google Scholar and 30 more data sources, so we can reach business-oriented profiles just as easily as deep science ones.', 'About $99–$179/seat/mo billed yearly (Starter is $99, or $119 billed monthly, and Growth is $179). The Agents add-on is $199/agent/mo. Searches are unlimited, but contact and export credits are capped at 500/mo on Starter and 1,500/mo on Growth. Prices changed in July 2026.'],
  ['Claude', 'Claude skills can connect all of these tools and automate the handoff of information between them. They can also send each interviewer a short summary and the right interview questions just before the meeting. Gumloop is an alternative.', '$20–$25/user/mo for most people (Pro is $20 and Team Standard is $25). Max 5x is $100/mo, Max 20x is $200/mo and Team Premium is $125/user/mo.'],
  ['Gem', 'Gem is an applicant tracking system (ATS). Once the ideal process is set up, email, scheduling and communication tracking are all automated.', 'The most expensive item. Pricing is a custom quote based on company headcount, and the Startups plan is $270/mo. The median buyer pays about $25,700/yr (the SMB average is about $19,800/yr and the enterprise average is about $94,600/yr).'],
];

export function techStackRows() {
  return TECH_STACK.map(([software, description, cost], i) => ({ id: `tech-${i + 1}`, software, description, cost }));
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

export const EVENT_TYPES = ['GTM Offsite', 'Sales Kickoff', 'Executive Customer Dinner', 'Industry Event', 'Other'];
export const EVENT_STATUSES = ['Idea', 'Planning', 'Confirmed', 'Completed', 'Cancelled'];
export const EVENT_PHASES = [
  { key: 'pre', label: 'Before the Event' },
  { key: 'during', label: 'During the Event' },
  { key: 'after', label: 'After the Event' },
];

const EVENT_CHECKLIST = {
  pre: [
    'Lead list of target accounts',
    'Booth presentation and materials',
    'Booth staffing, scripts and run-of-show',
  ],
  during: [
    'Wi-Fi and connection confirmed with the event organizer',
    'Lead list on hand',
    'Calendar open for call bookings',
    'HubSpot ready to track every conversation',
  ],
  after: [
    'Follow-ups on every conversation',
    'Marketing recap of our attendance',
  ],
};

export function eventChecklist(eventId) {
  const out = {};
  for (const phase of EVENT_PHASES) {
    out[phase.key] = EVENT_CHECKLIST[phase.key].map((text, i) => ({ id: `${eventId}-${phase.key}-${i + 1}`, text, done: false }));
  }
  return out;
}

function seedEvents() {
  return [
    ['evt-gtm-offsite', 'Q1 GTM Offsite', 'GTM Offsite', 'Two-day offsite for sales, marketing and customer success to agree on 2027 targets, territories and plays.', '2027-01-14', 'Napa, CA', 'Planning'],
    ['evt-sales-kickoff', '2027 Sales Kickoff', 'Sales Kickoff', 'Annual kickoff covering the product roadmap, the new pitch, enablement sessions and awards.', '2027-02-03', 'San Francisco, CA', 'Planning'],
    ['evt-exec-dinner', 'NYC Executive Customer Dinner', 'Executive Customer Dinner', 'Private dinner for about 12 customer and prospect executives to build relationships and hear feedback.', '2026-12-03', 'New York, NY', 'Confirmed'],
    ['evt-industry', 'Industry Conference (booth)', 'Industry Event', 'Booth at a large industry conference to meet target accounts and book follow-up calls.', '2027-03-10', 'Las Vegas, NV', 'Idea'],
  ].map(([id, name, type, description, date, location, status]) => ({
    id, name, type, description, date, location, status, checklist: eventChecklist(id),
  }));
}

export const LEADERS = ['Lainie', 'Eileen', 'Julia', 'Olivia', 'Madison', 'Mihika', 'Matan', 'Joon', 'Michael'];
export const SCHEDULE_TYPES = [
  { key: 'customer', label: 'Customer meeting', color: '#ff7a66' },
  { key: 'onsite', label: 'Onsite', color: '#7fb8e6' },
  { key: 'conference', label: 'Conference', color: '#e0a95a' },
  { key: 'office', label: 'In office', color: '#7cc49a' },
];

export function seedLeadershipSchedule() {
  return [
    ['Lainie', 'customer', 'Customer QBR', '2026-11-10', '2026-11-10', '10:00'],
    ['Eileen', 'onsite', 'Client onsite', '2026-11-17', '2026-11-18', ''],
    ['Julia', 'conference', 'Industry conference', '2026-11-12', '2026-11-13', ''],
    ['Olivia', 'office', 'In office (SF)', '2026-11-09', '2026-11-09', ''],
    ['Madison', 'customer', 'Prospect intro call', '2026-11-11', '2026-11-11', '14:00'],
    ['Mihika', 'office', 'In office (NYC)', '2026-11-16', '2026-11-16', ''],
    ['Matan', 'conference', 'Industry conference', '2026-11-19', '2026-11-20', ''],
    ['Lainie', 'onsite', 'Client onsite', '2026-11-04', '2026-11-05', ''],
    ['Lainie', 'conference', 'Industry conference', '2026-12-02', '2026-12-03', ''],
    ['Lainie', 'office', 'In office (SF)', '2026-11-16', '2026-11-16', ''],
    ['Eileen', 'customer', 'Customer check-in', '2026-11-05', '2026-11-05', '11:00'],
    ['Eileen', 'conference', 'Industry conference', '2026-12-09', '2026-12-10', ''],
    ['Eileen', 'office', 'In office (SF)', '2026-11-10', '2026-11-10', ''],
    ['Julia', 'customer', 'Renewal call', '2026-11-17', '2026-11-17', '13:00'],
    ['Julia', 'onsite', 'Client onsite', '2026-12-01', '2026-12-02', ''],
    ['Julia', 'office', 'In office (NYC)', '2026-11-23', '2026-11-23', ''],
    ['Olivia', 'customer', 'Customer QBR', '2026-11-12', '2026-11-12', '15:00'],
    ['Olivia', 'onsite', 'Client onsite', '2026-11-24', '2026-11-25', ''],
    ['Olivia', 'conference', 'Industry conference', '2026-12-02', '2026-12-03', ''],
    ['Madison', 'onsite', 'Client onsite', '2026-11-18', '2026-11-19', ''],
    ['Madison', 'conference', 'Industry conference', '2026-11-12', '2026-11-13', ''],
    ['Madison', 'office', 'In office (SF)', '2026-11-03', '2026-11-03', ''],
    ['Mihika', 'customer', 'Prospect demo', '2026-11-09', '2026-11-09', '09:30'],
    ['Mihika', 'onsite', 'Client onsite', '2026-11-30', '2026-12-01', ''],
    ['Mihika', 'conference', 'Industry conference', '2026-12-09', '2026-12-10', ''],
    ['Matan', 'customer', 'Customer kickoff', '2026-11-23', '2026-11-23', '16:00'],
    ['Matan', 'onsite', 'Client onsite', '2026-11-04', '2026-11-05', ''],
    ['Matan', 'office', 'In office (NYC)', '2026-11-11', '2026-11-11', ''],
    ['Joon', 'customer', 'Customer QBR', '2026-11-18', '2026-11-18', '10:30'],
    ['Joon', 'onsite', 'Client onsite', '2026-12-07', '2026-12-08', ''],
    ['Joon', 'conference', 'Industry conference', '2026-11-19', '2026-11-20', ''],
    ['Joon', 'office', 'In office (SF)', '2026-11-24', '2026-11-24', ''],
    ['Michael', 'customer', 'Prospect demo', '2026-11-24', '2026-11-24', '11:00'],
    ['Michael', 'onsite', 'Client onsite', '2026-11-10', '2026-11-11', ''],
    ['Michael', 'conference', 'Industry conference', '2026-12-09', '2026-12-10', ''],
    ['Michael', 'office', 'In office (NYC)', '2026-11-04', '2026-11-04', ''],
  ].map(([person, type, title, start, end, time], i) => ({ id: `sched-${i + 1}`, person, type, title, start, end, time, notes: '' }));
}

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
    id: 'investors', title: 'Investors', note: 'Our VCs and who we work with at each firm.',
    addLabel: 'Add investor',
    fields: [
      { key: 'firm', label: 'Firm Name' },
      { key: 'link', label: 'Link', type: 'url' },
      { key: 'industry', label: 'Industry' },
      { key: 'stage', label: 'Stage', width: 'sm' },
      { key: 'poc', label: 'PoC' },
    ],
  },
  {
    id: 'pitch-deck', title: 'Pitch Deck', note: 'The current pitch deck, plus older versions for reference.',
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
];

function seedBoardInvestor() {
  const rows = (key, values) => values.map((v, i) => ({ id: `${key}-${i + 1}`, [BOARD_SECTIONS.find((s) => s.id === key).fields[0].key]: v }));
  return {
    'board-decks': rows('board-decks', ['Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026']),
    'investor-updates': rows('investor-updates', ['August 2026', 'September 2026', 'October 2026']),
    investors: [],
    'pitch-deck': rows('pitch-deck', ['Current']),
    'key-milestones': rows('key-milestones', ['Revenue', 'Pipeline', 'Headcount', 'Product Updates']),
  };
}

export const CLIENT_FIELDS = [
  { key: 'clientName', label: 'Client Name' },
  { key: 'status', label: 'Status' },
  { key: 'driveLink', label: 'Link to Drive' },
  { key: 'clientPoc', label: 'PoC at Client' },
  { key: 'similePoc', label: 'PoC at Simile' },
  { key: 'industry', label: 'Industry' },
  { key: 'testRunning', label: 'Test Running' },
  { key: 'onsiteDate', label: 'Onsite Date', type: 'date' },
  { key: 'onsiteGoal', label: 'Onsite Goal' },
];

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
      entities: [
        { name: 'Socratica Symposium', links: [] },
        { name: 'GenAI Genesis', links: [] },
        { name: 'Hack the North', links: [] },
        { name: 'MILA ALL-IN', links: [] },
      ],
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
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: '40 per event', values: {} },
        { id: 'm2', label: 'Interviews booked (%)', target: '37.5%', values: {} },
        { id: 'm3', label: 'Interviews booked (#)', target: '15 per event', values: {} },
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

export function seedData() {
  const year = new Date().getFullYear();
  return {
    companyGoal: { title: 'EoY target', current: 0, target: 100, unit: '%', targetDate: `${year}-12-31` },
    teams: TEAMS,
    people: PEOPLE,
    initiatives: INITIATIVES,
    milestones: seedMilestones(),
    months: seedMonths(),
    weeks: seedWeeks(),
    metrics: seedMetrics(),
    okrs: seedOkrs(),
    docs: seedDocs(),
    recruitment: seedRecruitment(),
    recruitmentVersion: 8,
    clientMaterials: [
      {
        id: 'clients',
        title: 'Clients',
        fields: CLIENT_FIELDS,
        entries: [],
      },
    ],
    events: seedEvents(),
    boardInvestor: seedBoardInvestor(),
    leadershipSchedule: seedLeadershipSchedule(),
    scheduleVersion: 3,
    copyVersion: 1,
    scheduleLeaders: [...LEADERS],
    scheduleTypes: SCHEDULE_TYPES.map((t) => ({ ...t })),
    slackWebhookUrl: '',
    pageNotes: {
      recruitment: 'This page is about bringing top-of-funnel talent to Simile.\n\nA note on events: partnering with others on events is much more interesting, since it has the same impact for far less time and effort. With school partnerships, the goal is to build relationships early, so that when very strong talent comes along, it gets funneled to us quickly.\n\nTo build a successful funnel for Simile, we need several long-term relationships in place. That’s why we’re looking at:\n\n• School partnerships for newcomers\n• Event sponsorships for people already in the ecosystem\n• Event attendance, to understand who we’re getting in front of and whether they’re the right people, whether that’s a future client or a future employee\n• Event partnerships, as our ICPs converge\n• The total count from leads to interviews booked, and the gap between them',
      operations: 'This page shows every team milestone and each teammate’s capacity. It also shows team composition, so when a project changes or the direction shifts, the work can go to a teammate who has room for it. Anyone newly onboarded can see who’s working on what, how much capacity everyone has and who they can go to for support at any time.',
      documentation: 'This page keeps all the processes, SOPs and helpful links in one place, so they’re easy to find for me, anyone working with me and anyone I need to train. I can just send them this page. It also keeps the history and the lists I used for each of my campaigns. I made it to save time for myself and for anyone I work with.',
      roadmap: 'This lets anyone working with me follow my timeline week by week, with exactly when I plan to start and finish each initiative, experiment or task. It gives a clear picture of my progress.\n\nIt also has goals, metrics and objectives that show where things stand and how much more needs to happen to hit the end goals. The monthly calendar of deadlines shows what needs to happen each month and each day, so we can work backwards from the goals.',
    },
    tasks: seedTasks(),
  };
}
