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
        fields: [
          { key: 'software', label: 'Software' },
          { key: 'description', label: 'Description' },
          { key: 'cost', label: 'Cost' },
        ],
        rows: [],
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
    recruitmentVersion: 5,
    clientMaterials: [
      {
        id: 'clients',
        title: 'Clients',
        fields: CLIENT_FIELDS,
        entries: [],
      },
    ],
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
