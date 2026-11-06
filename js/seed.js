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
  ['Disney Accelerator 2026', 'Simile', '', '2026', '', 'A startup program, not a conference. Simile was one of three companies in this year’s five-company group, with FieldAI and Physical Intelligence, that worked on park operations and guest experience.', 'https://www.kentertechhub.com/disney-accel-2026-en/'],
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
  ['Hannover Messe 2027', 'Simulation and digital twins', 'Europe', 'Apr 5–8, 2027', 'Hannover, Germany', 'The main event for industrial AI and digital twins, with a focus on industrial IoT, digital twin and AI solutions.', 'https://www.hannovermesse.de/en/for-visitors/opening-hours/'],
  ['Digital Twins and Applications Europe 2027 (IET)', 'Simulation and digital twins', 'Europe', 'Jun 8–9, 2027', 'Madrid, Spain', 'Covers energy, manufacturing and smart cities. Paper submissions are due Jan 30, 2027.', 'https://digitaltwins.theiet.org/dta-europe-2027'],
  ['EUROSIM', 'Simulation and digital twins', 'Europe', '2026 edition held', 'Genova, Italy', 'The conference of the Federation of European Simulation Societies. The 2026 edition was in Genova.', 'https://easychair.org/cfp/topic?tid=17638670'],
  ['IEEE Digital Twin Conference', 'Simulation and digital twins', 'Europe', 'Sep 7–11, 2026', 'Rende, Italy', 'The 2026 edition was in Rende.', 'https://swc-ieee-2026.github.io/digitaltwin'],
];

export function conferenceRows() {
  return CONFERENCES.map(([event, category, region, dates, location, details, link], i) => ({ id: `conf-${i + 1}`, event, category, region, dates, location, details, link }));
}

// Columns of the Recruitment Partnership Events companies table.
export const PARTNER_FIELDS = [
  { key: 'company', label: 'Company Name' },
  { key: 'event', label: 'Event' },
  { key: 'date', label: 'Date' },
  { key: 'notes', label: 'Notes', multiline: true },
];

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
    out[phase.key] = EVENT_CHECKLIST[phase.key].map((text, i) => ({ id: `${eventId}-${phase.key}-${i + 1}`, text, done: false, link: '', notes: '', owner: '' }));
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
    "linkedin": "https://www.linkedin.com/search/results/people/?keywords=Shardul%20Shah%20Index%20Ventures",
    "linkedinStatus": "Search link (open and confirm the profile)",
    "why": "Led Simile's Series A and joined the Series B.",
    "relationship": "Existing investor",
    "source": "https://www.everythingstartups.com/vc-funds/index-ventures"
  },
  {
    "firm": "Greenoaks",
    "link": "https://www.greenoakscap.com",
    "industry": "Concentrated growth bets in AI, enterprise, fintech",
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
    "fund": "Thrive X – growth vehicle",
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
    id: 'investors', title: 'Investors', note: 'Our current investors, the round each came in on and who we work with at each firm.',
    addLabel: 'Add investor',
    fields: [
      { key: 'firm', label: 'Firm Name' },
      { key: 'stage', label: 'Stage' },
      { key: 'partner', label: 'Partner' },
      { key: 'partnerEmail', label: 'Partner Email' },
      { key: 'partnerPhone', label: 'Partner Number' },
      { key: 'boardMember', label: 'Board Member' },
      { key: 'terms', label: 'Terms Summary', type: 'multiline' },
    ],
  },
  {
    id: 'potential-investors', title: 'Potential Investors',
    note: 'Growth-stage firms with an AI or deep tech focus that could lead or join our next round. Existing investors are marked in the Relationship column.',
    addLabel: 'Add firm',
    fields: [
      { key: 'firm', label: 'Firm Name' },
      { key: 'link', label: 'Website', type: 'url' },
      { key: 'industry', label: 'Industry Focus', type: 'multiline' },
      { key: 'stage', label: 'Stage', width: 'sm' },
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
];

export function currentInvestorRows() {
  return CURRENT_INVESTORS.map(([firm, stage], i) => ({ id: `investors-${i + 1}`, firm, stage }));
}

export function potentialInvestorRows() {
  return POTENTIAL_INVESTORS.map((r, i) => ({ id: `potential-investors-${i + 1}`, ...r }));
}

function seedBoardInvestor() {
  const rows = (key, values) => values.map((v, i) => ({ id: `${key}-${i + 1}`, [BOARD_SECTIONS.find((s) => s.id === key).fields[0].key]: v }));
  return {
    'board-decks': rows('board-decks', ['Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026']),
    'investor-updates': rows('investor-updates', ['August 2026', 'September 2026', 'October 2026']),
    investors: currentInvestorRows(),
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
  { key: 'similePoc', label: 'PoC at Simile' },
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
      table: { fields: CONFERENCE_FIELDS, rows: conferenceRows() },
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

// COO Scheduling: calendar, inbox, inquiries board and sprints.
export const COO_INBOX = [
  { key: 'investors', label: 'Investors' },
  { key: 'clients', label: 'Client Responses' },
  { key: 'candidates', label: 'Potential Candidates' },
  { key: 'spam', label: 'Spam' },
  { key: 'other', label: 'Other' },
];

export const COO_STAGES = [
  { key: 'potential', label: 'Potential Issues' },
  { key: 'needed', label: 'Issues Needed to Be Addressed' },
  { key: 'solved', label: 'Solved' },
  { key: 'escalated', label: 'Escalated to Lainie' },
  { key: 'other', label: 'Other' },
];

const OTHER_MAIL = [
  ['other', 'Office manager', 'Holiday party RSVP', '2026-11-04', 'Please RSVP by the 20th and note any dietary needs.'],
  ['other', 'Notion', 'Your weekly workspace digest', '2026-11-03', 'Twelve pages were edited this week.'],
];

export function cooOtherMail() {
  return OTHER_MAIL.map(([category, from, subject, date, summary], i) => ({ id: `coo-mail-other-${i + 1}`, category, from, subject, date, summary }));
}

export function seedCoo() {
  const cal = [
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
    ['candidates', 'Gem', 'New applicant: Chief of Staff', '2026-11-04', 'Strong ops background, five years at a Series C startup.'],
    ['candidates', 'Referral', 'Intro: ML engineer from Stanford', '2026-11-01', 'Referred by an advisor. Open to a call next week.'],
    ['spam', 'Vendor outreach', 'Grow your pipeline 10x this quarter', '2026-11-04', ''],
    ['spam', 'Event promo', 'Last chance for early-bird tickets', '2026-11-02', ''],
    ...OTHER_MAIL,
  ];
  const inquiries = [
    ['potential', 'Offsite venue may be overbooked', 'Operations', 'The hotel has flagged a possible double booking for the December offsite.', 'Olivia', '2026-11-14'],
    ['needed', 'Expense approvals are backed up', 'Finance', 'About 30 expense reports are waiting on approval.', 'Madison', '2026-11-10'],
    ['needed', 'Laptops for new hires', 'IT', 'Three new hires start on the 17th and need laptops set up.', 'Mihika', '2026-11-12'],
    ['solved', 'Badge access for the NYC office', 'Facilities', 'New badges were issued to the whole team.', 'Julia', '2026-11-03'],
    ['escalated', 'Contract terms with Itaú', 'Legal', 'Itaú asked for changes to the data terms that need sign-off.', 'Lainie', '2026-11-15'],
    ['other', 'Team photo day', 'People', 'Pick a date for new headshots for the website.', 'Eileen', '2026-11-21'],
  ];
  const sprint = (id, name, start, end, tasks, goal, metrics, notes, team) => ({
    id, name, start, end,
    tasks: tasks.map(([text, done], i) => ({ id: `${id}-t${i + 1}`, text, done })),
    goal, metrics, notes, team,
  });
  return {
    calendar: cal.map(([date, time, title], i) => ({ id: `coo-cal-${i + 1}`, date, time, title, notes: '' })),
    inbox: mail.map(([category, from, subject, date, summary], i) => ({ id: `coo-mail-${i + 1}`, category, from, subject, date, summary })),
    inquiries: inquiries.map(([stage, title, department, description, owner, deadline], i) => ({ id: `coo-inq-${i + 1}`, stage, title, department, description, owner, deadline })),
    currentSprint: sprint('sprint-12', 'Sprint 12', '2026-11-02', '2026-11-13',
      [['Finalize the Q4 board deck', false], ['Book the venue for the December offsite', true], ['Send the October investor update', true], ['Schedule the CVS onsite', false]],
      'Walk into the Q4 board meeting with the deck, numbers and offsite plan locked.',
      'Board deck approved by Lainie. Offsite venue signed. Investor update sent by the 18th.',
      '', ['Lainie', 'Olivia', 'Madison']),
    pastSprints: [
      sprint('sprint-11', 'Sprint 11', '2026-10-19', '2026-10-30',
        [['Close Series B paperwork', true], ['Set up board deck template', true], ['Plan Q4 hiring', false]],
        'Wrap up the Series B and set up Q4 planning.',
        'All closing documents signed. Q4 hiring plan drafted.',
        'Hiring plan moved to Sprint 12.', ['Lainie', 'Julia']),
      sprint('sprint-10', 'Sprint 10', '2026-10-05', '2026-10-16',
        [['Run the NYC customer dinner', true], ['Update investor list', true]],
        'Strengthen customer and investor relationships ahead of the raise.',
        'Dinner held with 12 executives. Investor list updated.',
        '', ['Eileen', 'Matan']),
    ],
  };
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
    recruitmentVersion: 12,
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
    leadershipSchedule: seedLeadershipSchedule(),
    scheduleVersion: 3,
    copyVersion: 1,
    clientVersion: 1,
    scheduleLeaders: [...LEADERS],
    scheduleTypes: SCHEDULE_TYPES.map((t) => ({ ...t })),
    slackWebhookUrl: '',
    // Home page: About Naureen, Why I Built This and a note for each page card.
    home: { background: '', experience: '', goals: '', why: '', cardNotes: {} },
    pageNotes: {
      recruitment: 'This page is about bringing top-of-funnel talent to Simile.\n\nA note on events: partnering with others on events is much more interesting, since it has the same impact for far less time and effort. With school partnerships, the goal is to build relationships early, so that when very strong talent comes along, it gets funneled to us quickly.\n\nTo build a successful funnel for Simile, we need several long-term relationships in place. That’s why we’re looking at:\n\n• School partnerships for newcomers\n• Event sponsorships for people already in the ecosystem\n• Event attendance, to understand who we’re getting in front of and whether they’re the right people, whether that’s a future client or a future employee\n• Event partnerships, as our ICPs converge\n• The total count from leads to interviews booked, and the gap between them',
      operations: 'This page shows every team milestone and each teammate’s capacity. It also shows team composition, so when a project changes or the direction shifts, the work can go to a teammate who has room for it. Anyone newly onboarded can see who’s working on what, how much capacity everyone has and who they can go to for support at any time.',
      documentation: 'This page keeps all the processes, SOPs and helpful links in one place, so they’re easy to find for me, anyone working with me and anyone I need to train. I can just send them this page. It also keeps the history and the lists I used for each of my campaigns. I made it to save time for myself and for anyone I work with.',
      roadmap: 'This lets anyone working with me follow my timeline week by week, with exactly when I plan to start and finish each initiative, experiment or task. It gives a clear picture of my progress.\n\nIt also has goals, metrics and objectives that show where things stand and how much more needs to happen to hit the end goals. The monthly calendar of deadlines shows what needs to happen each month and each day, so we can work backwards from the goals.',
    },
    tasks: seedTasks(),
  };
}
