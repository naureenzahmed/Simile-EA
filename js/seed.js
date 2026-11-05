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
        description: 'Example task description — replace with the real scope of work.',
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
      id: 'docs-logins', title: 'Software Login',
      fields: [
        { key: 'name', label: 'Software Name' },
        { key: 'loginProcess', label: 'Login Process' },
        { key: 'adminAccess', label: 'Admin Access' },
        { key: 'useCases', label: 'Use Cases' },
      ],
      entries: [],
    },
    {
      id: 'docs-tofu', title: 'Set Up Instructions',
      entries: [
        { id: 'tofu-1', title: 'Setting up HubSpot sequences', url: '', notes: '' },
        { id: 'tofu-2', title: 'Setting up HeyReach sequences', url: '', notes: '' },
        { id: 'tofu-3', title: 'Setting up Google Ads', url: '', notes: '' },
        { id: 'tofu-4', title: 'Setting up LinkedIn ads', url: '', notes: '' },
        { id: 'tofu-5', title: 'Setting up Meta ads', url: '', notes: '' },
        { id: 'tofu-6', title: 'Setting up ChatGPT Ads', url: '', notes: '' },
      ],
    },
    {
      id: 'docs-sales-pitch', title: 'Sales & Pitch Documents',
      entries: [
        { id: 'sales-doc-1', title: 'Sales Document', url: '', notes: '' },
        { id: 'pitch-doc-1', title: 'Pitch Document', url: '', notes: '' },
        { id: 'demos-doc-1', title: 'Demos Documents', url: '', notes: '' },
        { id: 'marketing-materials-1', title: 'Marketing Materials', url: '', notes: '' },
        { id: 'one-pager-1', title: 'One Pager', url: '', notes: '' },
      ],
    },
    {
      id: 'docs-ads-materials', title: 'Ads Materials',
      entries: [
        { id: 'ad-creatives-google', title: 'Ad Creatives - Google', url: '', notes: '' },
        { id: 'ad-creatives-meta', title: 'Ad Creatives - Meta', url: '', notes: '' },
        { id: 'ad-creatives-chatgpt', title: 'Ad Creatives - ChatGPT', url: '', notes: '' },
        { id: 'ad-creatives-linkedin', title: 'Ad Creatives - LinkedIn', url: '', notes: '' },
      ],
    },
    {
      id: 'docs-ads-audiences', title: 'Ads Audiences Lists',
      entries: [
        { id: 'ad-audience-google', title: 'Google', url: '', notes: '' },
        { id: 'ad-audience-meta', title: 'Meta', url: '', notes: '' },
        { id: 'ad-audience-chatgpt', title: 'ChatGPT', url: '', notes: '' },
        { id: 'ad-audience-linkedin', title: 'LinkedIn', url: '', notes: '' },
      ],
    },
  ];
}

// Columns of the Client Materials "Clients" table.
export const TECH_STACK_FIELDS = [
  { key: 'software', label: 'Software' },
  { key: 'description', label: 'Description', multiline: true },
  { key: 'cost', label: 'Cost', multiline: true },
];

const TECH_STACK = [
  ['Grokbot', 'Grokbot will be able to reach ideal candidates and automate messaging them. Grokbot allows you to reach LinkedIn (used by sales and ops people heavily) and X (used heavily by engineers and technical people). It will also be able to scrape through new publications and research to find the appropriate people in highly technical fields.', '$30/mo (SuperGrok). Grok Business is $30/user/mo, SuperGrok Lite $10/mo, SuperGrok Heavy $300/mo, Enterprise custom.'],
  ['Apollo', 'Apollo can support quick email pulling.', '$49–$119/user/mo billed yearly (Basic $49, Professional $79, Organization $119); about $59–$149 billed monthly. Free plan available. Credits, add-ons and overages can raise the total a lot.'],
  ['Juicebox', 'Juicebox can run through LinkedIn, Github, Google Scholar and 30 more data sources. We will be able to reach business oriented profiles just as much deep science.', 'About $99–$179/seat/mo billed yearly (Starter $99, or $119 monthly; Growth $179). Agents add-on $199/agent/mo. Unlimited searches; contact/export credits capped at 500/mo (Starter) or 1,500/mo (Growth). Prices changed July 2026.'],
  ['Claude', 'Claude skills can be utilized to connect all of these software and automate the information transfer. Additionally, Claude skills can send the interviewer brief summaries right before the meeting and the appropriate interview questions. An alternative would be Gumloop.', '$20–$25/user/mo for most people (Pro $20, Team Standard $25). Max 5x $100/mo, Max 20x $200/mo, Team Premium $125/user/mo.'],
  ['Gem', 'Gem is an Applicant Tracking System (ATS). Once the ideal process is put in, email, scheduling and communication tracking is all automated.', 'Most expensive item. Custom quote based on company headcount; Startups plan $270/mo. Median buyer pays about $25,700/yr (SMB average ~$19,800/yr, enterprise average ~$94,600/yr).'],
];

export function techStackRows() {
  return TECH_STACK.map(([software, description, cost], i) => ({ id: `tech-${i + 1}`, software, description, cost }));
}

export const EVENT_TYPES = ['GTM Offsite', 'Sales Kickoff', 'Executive Customer Dinner', 'Industry Event', 'Other'];
export const EVENT_STATUSES = ['Idea', 'Planning', 'Confirmed', 'Completed', 'Cancelled'];
export const EVENT_PHASES = [
  { key: 'pre', label: 'Pre-event' },
  { key: 'during', label: 'During' },
  { key: 'after', label: 'After event' },
];

const EVENT_CHECKLIST = {
  pre: [
    'Lead list of target accounts',
    'Booth presentation and materials',
    'Booth staffing, scripts and run-of-show',
  ],
  during: [
    'Follow up with event organiser for Wi-Fi and connection',
    'Lead list',
    'Calendar open for call bookings',
    'HubSpot to track all the conversations',
  ],
  after: [
    'Follow-ups on conversations',
    'Marketing on the recap from our attendance',
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

export const LEADERS = ['Lainie', 'Eileen', 'Julia', 'Olivia', 'Madison', 'Mihika', 'Matan'];
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
  ].map(([person, type, title, start, end, time], i) => ({ id: `sched-${i + 1}`, person, type, title, start, end, time, notes: '' }));
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
      entities: [],
      metrics: [],
    },
    {
      id: 'rec-sponsorships',
      title: 'Event Sponsorships',
      metrics: [
        { id: 'm1', label: 'Budget', target: '$1,000 / in-kind / intros', values: {} },
        { id: 'm2', label: 'Our interest', target: 'Videos, talent', values: {} },
        { id: 'm3', label: 'Type of talent', target: 'Eng / Ops / Sales', values: {} },
        { id: 'm4', label: 'Number of events', note: 'Look at hiring from that same level of talent.', target: null, values: {} },
        { id: 'm5', label: 'Demographic reached', target: null, values: {} },
        { id: 'm6', label: 'Leads (#)', target: '40 per event', values: {} },
        { id: 'm7', label: 'Interview Booked (%)', target: '75%', values: {} },
        { id: 'm8', label: 'Interview Booked (#)', target: '15 per event', values: {} },
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
        { id: 'm2', label: 'Interview Booked (%)', target: '20%', values: {} },
        { id: 'm3', label: 'Interview Booked (#)', target: 20, values: {} },
      ],
    },
    {
      id: 'rec-partnerships',
      title: 'Partnership Events',
      entities: [],
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: '40 per event', values: {} },
        { id: 'm2', label: 'Interview Booked (%)', target: '37.5%', values: {} },
        { id: 'm3', label: 'Interview Booked (#)', target: '15 per event', values: {} },
      ],
    },
    {
      id: 'rec-total',
      title: 'Total',
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: null, values: {} },
        { id: 'm2', label: 'Interview Booked (%)', target: null, values: {} },
        { id: 'm3', label: 'Interview Booked (#)', target: null, values: {} },
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
    recruitmentVersion: 7,
    clientMaterials: [
      {
        id: 'clients',
        title: 'Clients',
        fields: CLIENT_FIELDS,
        entries: [],
      },
    ],
    events: seedEvents(),
    leadershipSchedule: seedLeadershipSchedule(),
    scheduleVersion: 2,
    scheduleLeaders: [...LEADERS],
    scheduleTypes: SCHEDULE_TYPES.map((t) => ({ ...t })),
    slackWebhookUrl: '',
    pageNotes: {
      recruitment: 'This is to bring top-of-funnel talent towards Simile.\n\nA note on events: it’s much more interesting to do events in partnership with others, since it has the same impact with much less effort and time spent. For school partnerships, the goal is to create relationships early, so when there is very strong talent, it gets funneled to us quickly.\n\nTo create a successful funnel for Simile, there need to be multiple long-term relationships put in place. That’s why we’re looking at:\n\n• School partnerships for newcomers\n• Event sponsorships for those already in the ecosystem\n• Event attendance, to really understand who we are getting in front of and whether we are getting in front of the right people — whether that is a potential employee of a future client, or our own future employee\n• Event partnerships, as our ICPs converge\n• Companies to track employees at, as these would be recruiting for more senior roles with the same level of intensity and grit as Simile\n• The count from overview leads into interview booked, and the delta between them',
      operations: 'This page shows all team milestones as well as each teammate’s capacity. It also includes team composition, so any changes in a project or shifts in direction can be easily assigned to a teammate who has the capacity for it. Anyone newly onboarded can see who is working on what, what everyone’s capacity looks like, and who they can reach out to for support at any given time.',
      documentation: 'This houses all the processes, SOPs, and links that would be helpful, so it’s easy access for myself, anyone working with me, and anyone I need to train. I can just send them this document list. It will have all the history and the lists I used for any of my campaigns. This is created for efficiency for myself but also for anyone working with me.',
      roadmap: 'This allows anyone working with me to understand timelines on a weekly basis by looking at exactly when I plan on starting initiatives, experiments, or tasks and when I plan on finishing them. It gives a better idea of what’s going on with my progress.\n\nOn top of that, it has goals, metrics, and objectives to really show what the progress is and really understand how much more needs to be done to hit the end goals. It also includes a monthly calendar with deadlines, so there’s a better idea of what needs to happen each month and each day. Working backwards, we can understand what needs to be done.',
    },
    tasks: seedTasks(),
  };
}
