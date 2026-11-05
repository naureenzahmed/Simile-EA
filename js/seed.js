import { addDays, todayISO, uid } from './utils.js';

export const TEAMS = [
  { id: 'team-a', name: 'Team A', color: '#6c8cff' },
  { id: 'team-b', name: 'Team B', color: '#ef6f6c' },
  { id: 'team-c', name: 'Team C', color: '#57c785' },
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

function seedPaidConversions() {
  return [
    {
      id: 'pc-email',
      title: 'Email Outbound',
      metrics: [
        { id: 'm1', label: 'Number of leads', note: 'This would act as an easy way to book the call and would act as a mechanism to reinforce our credibility with case studies.', target: 100, values: {} },
        { id: 'm2', label: 'Number of emails', target: 80, values: {} },
        { id: 'm3', label: 'Number of replies', target: 16, values: {} },
        { id: 'm4', label: '# Meeting Booked', target: 4, values: {} },
      ],
    },
    {
      id: 'pc-linkedin',
      title: 'Ads - LinkedIn',
      metrics: [
        { id: 'm1', label: 'Spend', target: 100, values: {} },
        { id: 'm1b', label: 'Lead List Number', target: null, values: {} },
        { id: 'm2', label: 'CTR creative 1', target: 100, values: {} },
        { id: 'm3', label: 'CTR creative 2', target: 100, values: {} },
        { id: 'm4', label: 'CTR creative 3', target: 100, values: {} },
        { id: 'm5', label: 'CTR creative 4', target: 100, values: {} },
        { id: 'm6', label: 'CTR creative 5', target: 100, values: {} },
        { id: 'm7', label: 'Cost per Meeting', target: 'Under $4', values: {} },
        { id: 'm8', label: '# Meeting Booked', target: 10, values: {} },
      ],
    },
    {
      id: 'pc-google',
      title: 'Ads - Google',
      metrics: [
        { id: 'm1', label: 'Spend', target: 100, values: {} },
        { id: 'm2', label: 'Link to Keywords', target: null, values: {} },
        { id: 'm3', label: 'Link to Headlines', target: null, values: {} },
        { id: 'm4', label: 'Link to Descriptions', target: null, values: {} },
        { id: 'm7', label: 'Cost per Meeting', target: 'Under $4', values: {} },
        { id: 'm8', label: '# Meeting Booked', target: 15, values: {} },
      ],
    },
    {
      id: 'pc-meta',
      title: 'Ads - Meta',
      metrics: [
        { id: 'm1', label: 'Campaign Objective', target: null, values: {} },
        { id: 'm2', label: 'Budget', target: null, values: {} },
        { id: 'm3', label: 'Link to Audience List', target: null, values: {} },
        { id: 'm4', label: 'Optimization Event + Conversion Location', target: null, values: {} },
        { id: 'm5', label: 'Budget/Schedule', target: null, values: {} },
        { id: 'm6', label: 'Bid Strategy', target: null, values: {} },
        { id: 'm7', label: 'Link to Ad Creative', target: null, values: {} },
        { id: 'm8', label: 'Number of Meetings Booked', target: null, values: {} },
      ],
    },
    {
      id: 'pc-chatgpt',
      title: 'Ads - ChatGPT',
      metrics: [
        { id: 'm1', label: 'Creative', target: null, values: {} },
        { id: 'm2', label: 'Targeted Demographic', target: null, values: {} },
        { id: 'm3', label: 'Keywords', target: null, values: {} },
        { id: 'm4', label: 'Contact Hints', target: null, values: {} },
        { id: 'm5', label: 'Cost per Click', target: null, values: {} },
        { id: 'm6', label: 'Impressions', target: null, values: {} },
        { id: 'm7', label: 'Number of Meetings Booked', target: null, values: {} },
      ],
    },
    {
      id: 'pc-seo',
      title: 'SEO/AEO',
      metrics: [
        { id: 'm1', label: '# of Blogs Posted', note: 'Having many blogs helps with AEO, since that’s what AI pulls from.', target: 150, values: {} },
        { id: 'm2', label: 'CTR', note: 'Since this is the metric we pay most based on, we want this as low as possible while keeping CVR as high as possible.', target: null, values: {} },
        { id: 'm3', label: 'CVR', note: 'We want every CTR to convert — highest-performing posts get reused, lowest-performing get changed.', target: null, values: {} },
        { id: 'm4', label: 'Impressions', target: 400, values: {} },
        { id: 'm5', label: 'Clicks', target: 40, values: {} },
        { id: 'm6', label: '# Meeting Booked', target: 15, values: {} },
        { id: 'm7', label: '% Meeting Booked', target: '37.50%', values: {} },
      ],
    },
    {
      id: 'pc-claude-skill',
      title: 'Claude Skill for Posting (LinkedIn and X)',
      metrics: [
        { id: 'm1', label: 'Profiles Connected', target: 5, values: {} },
        { id: 'm2', label: 'Number of Posts', target: 5, values: {} },
        { id: 'm3', label: 'Post Type', note: 'Announcement, Statistic, Change in the Market, Company Culture...', target: null, values: {} },
        { id: 'm4', label: 'Likes', target: 400, values: {} },
        { id: 'm5', label: 'Comments', target: 50, values: {} },
        { id: 'm6', label: 'CTR', target: '20%', values: {} },
      ],
    },
    {
      id: 'pc-reddit',
      title: 'Reddit',
      metrics: [
        { id: 'm1', label: 'Number of Posts', target: '50-100', values: {} },
        { id: 'm2', label: '# Likes', target: 20, values: {} },
        { id: 'm3', label: '# Comments', target: 10, values: {} },
        { id: 'm4', label: '# Replies', target: 5, values: {} },
        { id: 'm5', label: '# Meeting Booked', target: 3, values: {} },
      ],
    },
    {
      id: 'pc-newsletter',
      title: 'New/Blog Features',
      columns: [
        { key: 'g2-leader-procurement', label: 'G2 Spring 2026 Leader in Procurement Orchestration' },
        { key: 'g2-supplier-relationship', label: 'Supplier Relationship Management' },
        { key: 'g2-best-relationship', label: 'Best Relationship' },
        { key: 'g2-best-support-easiest', label: 'Best Support and Easiest to Use' },
        { key: 'gartner-peer-insights', label: 'Gartner Peer Insights' },
      ],
      metrics: [
        { id: 'm1', label: 'Number of Posts', target: 1, values: {} },
        { id: 'm2', label: 'Audience demographic', target: 'Engineer Lead, Head of Product, Product Managers, Engineers, Developers...', values: {} },
        { id: 'm3', label: 'Number of views', target: 200, values: {} },
        { id: 'm4', label: '# Replies', target: 50, values: {} },
        { id: 'm5', label: '# Meeting Booked', target: 10, values: {} },
        { id: 'm6', label: 'Date of Issue', target: null, values: {} },
      ],
    },
    {
      id: 'pc-gifts',
      title: 'Gifts',
      metrics: [
        { id: 'm1', label: 'Gift Type', target: null, values: {} },
        { id: 'm2', label: 'Spend per Unit', target: null, values: {} },
        { id: 'm3', label: 'Meeting Booked', target: null, values: {} },
        { id: 'm4', label: 'Conversion Rate', target: null, values: {} },
      ],
    },
    {
      id: 'pc-review-sites',
      title: 'Review Sites & Channels',
      metrics: [
        { id: 'm1', label: 'G2 Reviews', target: null, values: {} },
        { id: 'm2', label: 'Capterra Reviews', target: null, values: {} },
        { id: 'm3', label: 'TrustRadius Reviews', target: null, values: {} },
        { id: 'm4', label: 'Gartner Peer Insights Reviews', target: null, values: {} },
        { id: 'm5', label: 'Average Rating', target: null, values: {} },
        { id: 'm6', label: '# Meeting Booked', target: null, values: {} },
      ],
    },
    {
      id: 'pc-funnel',
      title: 'Demo, Pricing & Sales',
      metrics: [
        { id: 'm1', label: 'Demo Calls Booked', target: null, values: {} },
        { id: 'm2', label: 'Pricing Negotiations', target: null, values: {} },
        { id: 'm3', label: 'Sales', target: null, values: {} },
      ],
    },
    {
      id: 'pc-daily-summary',
      title: 'Daily Summary',
      metrics: [
        { id: 'm1', label: 'Spend', target: 'Under $100', values: {} },
        { id: 'm2', label: '# Meeting Booked', target: 53, values: {} },
      ],
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

function seedGtmExperiments() {
  const eventFields = [
    { key: 'event', label: 'Event' },
    { key: 'date', label: 'Date' },
    { key: 'goalOfEvent', label: 'Goal of the Event' },
    { key: 'expectedLeadsCreated', label: 'Expected Leads Created' },
    { key: 'leadTargetListLink', label: 'Lead Target List Link' },
    { key: 'notes', label: 'Notes' },
  ];
  return [
    { id: 'gtm-events-attended', title: 'Events Attended', fields: eventFields, entries: [] },
    {
      id: 'gtm-events-created', title: 'Events Created',
      fields: [
        { key: 'event', label: 'Event' },
        { key: 'date', label: 'Date' },
        { key: 'location', label: 'Event Location' },
        { key: 'targetDemographic', label: 'Target Demographic' },
        { key: 'goalOfEvent', label: 'Goal of the Event' },
        { key: 'numberOfAttendees', label: 'Number of Attendees' },
        { key: 'leadsCreated', label: 'Number of Leads Created' },
        { key: 'expectedLeadsCreated', label: 'Expected Leads Created' },
        { key: 'leadCreated', label: 'Lead Created' },
        { key: 'notes', label: 'Notes' },
      ],
      entries: [
        { id: uid('gtmrow'), event: 'Operator Panels', date: '', location: '', targetDemographic: '', goalOfEvent: '', numberOfAttendees: '', leadsCreated: '', expectedLeadsCreated: '', leadCreated: '', notes: 'No product pitch on stage' },
        { id: uid('gtmrow'), event: 'Dinner', date: '', location: '', targetDemographic: '', goalOfEvent: '', numberOfAttendees: '', leadsCreated: '', expectedLeadsCreated: '', leadCreated: '', notes: '' },
        { id: uid('gtmrow'), event: 'Cocktail', date: '', location: '', targetDemographic: '', goalOfEvent: '', numberOfAttendees: '', leadsCreated: '', expectedLeadsCreated: '', leadCreated: '', notes: '' },
        { id: uid('gtmrow'), event: 'CFO Series', date: '', location: '', targetDemographic: '', goalOfEvent: '', numberOfAttendees: '', leadsCreated: '', expectedLeadsCreated: '', leadCreated: '', notes: '' },
      ],
      formats: ['Operator Panels (no product pitch on stage)', 'Roundtables', 'Dinner', 'Cocktail', 'CFO Leadership Series'],
    },
    {
      id: 'gtm-co-hosts', title: 'Co-hosts',
      note: 'People we need to build relationship to add credibility to Simile in this industry',
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'organization', label: 'Organization' },
        { key: 'dateOfEvent', label: 'Date of Event' },
        { key: 'pointOfContact', label: 'Point of Contact' },
        { key: 'locationOfEvent', label: 'Location of Event' },
        { key: 'targetDemographic', label: 'Target Demographic' },
        { key: 'expectedLeadsCreated', label: 'Expected Leads Created' },
        { key: 'linkToAudienceList', label: 'Link to Audience List' },
        { key: 'notes', label: 'Notes' },
      ],
      entries: [],
    },
    {
      id: 'gtm-partnerships', title: 'Partnerships',
      fields: [
        { key: 'partneringOrganization', label: 'Partnering Organization' },
        { key: 'goalOfPartnership', label: 'Goal of Partnership for Simile' },
        { key: 'partnershipContingencies', label: 'Partnership Contingencies' },
        { key: 'linkToPartnershipAgreement', label: 'Link to Partnership Agreement' },
        { key: 'expectedLeadsCreated', label: 'Expected Leads Created' },
      ],
      entries: [],
    },
    {
      id: 'gtm-integrations', title: 'Integrations',
      columns: [
        { key: 'dow-jones', label: 'Dow Jones' },
        { key: 'amazon-business', label: 'Amazon Business' },
        { key: 'shopify', label: 'Shopify' },
        { key: 'chatgpt', label: 'ChatGPT' },
        { key: 'claude', label: 'Claude' },
        { key: 'copilot', label: 'Copilot' },
      ],
      metrics: [
        { id: 'row1', label: 'Status', values: {} },
        { id: 'row2', label: 'Notes', values: {} },
        { id: 'row3', label: 'Goal of Integration', values: {} },
        { id: 'row4', label: 'Expected Leads Created', values: {} },
      ],
    },
  ];
}

function seedTerritoryManagement() {
  return [
    {
      id: 'territory-prospect-companies', title: 'Prospect Companies',
      fields: [
        { key: 'company', label: 'Company' },
        { key: 'employeeCount', label: 'Number of Employees' },
        { key: 'industry', label: 'Industry' },
        { key: 'relevantTeams', label: 'Relevant Teams for Simile' },
        { key: 'status', label: 'Status with Company' },
      ],
      entries: [],
    },
    {
      id: 'territory-conferences-icp', title: 'Conferences with ICP',
      fields: [
        { key: 'conference', label: 'Conference' },
        { key: 'date', label: 'Date' },
        { key: 'icpOverlap', label: 'ICP Overlap' },
        { key: 'notes', label: 'Notes' },
      ],
      entries: [],
    },
    {
      id: 'territory-content-consumed-icp', title: 'Content Consumed by ICP',
      fields: [
        { key: 'contentType', label: 'Content Type' },
        { key: 'title', label: 'Title / Topic' },
        { key: 'source', label: 'Source' },
        { key: 'notes', label: 'Notes' },
      ],
      entries: [],
    },
    {
      id: 'territory-feature-focuses-icp', title: 'Feature Focuses for ICP',
      fields: [
        { key: 'feature', label: 'Feature' },
        { key: 'whyItMatters', label: 'Why It Matters to ICP' },
        { key: 'priority', label: 'Priority' },
        { key: 'notes', label: 'Notes' },
      ],
      entries: [],
    },
    {
      id: 'territory-feedback-calls-icp', title: 'Feedback Calls from ICP',
      fields: [
        { key: 'contact', label: 'Contact' },
        { key: 'company', label: 'Company' },
        { key: 'date', label: 'Date' },
        { key: 'keyTakeaways', label: 'Key Takeaways' },
      ],
      entries: [],
    },
  ];
}

function seedInboundLeads() {
  return {
    rows: [],
    notes: 'This page holds all the leads so they can be consolidated like a CRM, grouped by source. With calendars, flags, and emails, it is easier to understand where these leads are coming from and how they became high-potential leads. In terms of lead sources, for now I have put down:\n•     Email\n•     LinkedIn Ads\n•     Google Ads\n•     SEO\n•     AEO\n•     Reddit\n•     Newsletter referrals\n•     Websites\n•     Conference discussions\n•     Other\nThis can be adjusted and added to as more leads come in and as we better understand our territory and where the lead sources should be coming from.\nThis page is dedicated to understanding:\n\n•     who should be talking to each company\n•     who is a lead\n•     what teams we should be discussing with\n•     who our internal champion is\n•     what their specific needs are that Simile can help achieve\n•     what some buying signals that they have shown\n•     what stage of the discussions they are at\n•     if there are any demos booked that happened or meetings with sales associates\n\nThis will give us a better idea on where in the funnel they sit and what still needs to be done to make them into a customer.',
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
    paidConversions: seedPaidConversions(),
    docs: seedDocs(),
    territoryManagement: seedTerritoryManagement(),
    inboundLeads: seedInboundLeads(),
    gtmExperiments: seedGtmExperiments(),
    slackWebhookUrl: '',
    pageNotes: {
      documentation: 'This houses all the processes, SOPs, and links that would be helpful, so it’s easy access for myself, anyone working with me, and anyone I need to train. I can just send them this document list. It will have all the history and the lists I used for any of my campaigns. This is created for efficiency for myself but also for anyone working with me.',
      territoryManagement: 'Territory management is about really understanding my ICP and where they congregate. This supports understanding my territory and being able to target the highest-potential leads and meet them where they are. This section includes:\n•     Prospect companies\n•     Conferences\n•     The content they consume\n•     Features from news articles that they consume\n•     Any feedback calls\nTruly, this page is dedicated to understanding who I am selling to. This page is dedicated to really understanding how to qualify companies: who at these companies we should speak to and what information we need to keep in mind while trying to reach these people.',
      gtmExperiments: 'This is to track any experiments, the hypothesis behind them, their status, and what was learned. This includes:\n•     Events we have attended as Simile, like conferences\n•     Events we have created, like Simile’s previous operator panels, dinners, cocktails, CFO series, and roundtables\n•     Events we have co-hosted with people we want to build relationships with, to borrow their credibility for Simile’s visibility with our target customers\n•     Partnerships that help us reach our ICP better. For example, partnerships with companies that have overlapping ICPs\n•     Integrations to reach our ideal customer base; the ones we already have are Copilot, Claude, Amazon Business, and Dow Jones, and we’re adding Shopify and others\n\nAny guerrilla marketing or experiments would go in this section to really understand if there is any way that we can scale growth exponentially. This page includes all growth hacks.',
      roadmap: 'This allows anyone working with me to understand timelines on a weekly basis by looking at exactly when I plan on starting initiatives, experiments, or tasks and when I plan on finishing them. It gives a better idea of what’s going on with my progress.\n\nOn top of that, it has goals, metrics, and objectives to really show what the progress is and really understand how much more needs to be done to hit the end goals. It also includes a monthly calendar with deadlines, so there’s a better idea of what needs to happen each month and each day. Working backwards, we can understand what needs to be done.',
      paidConversions: 'This houses all the channels designed to lead to booking a meeting, and we can get into more granular steps like demos, price negotiations, and sales. The main goal is to get them to see the platform and book a meeting with us. This includes:\n•     Email outbound and campaigns\n•     Ads on LinkedIn, Google, Meta, and ChatGPT\n•     SEO and AEO\n•     Posting on LinkedIn or X — depending on where our ICP is, it’ll be adjusted to those social platforms\n•     Reddit, to help not only with getting our name out there but also because a high volume of Reddit posts helps with AEO\n•     News, blogs, and features that our ICP reads\n•     The gifts we give out, as Simile has given out previously\n•     Review sites and channels, and so on\nThen the daily summary of:\n•     How much was spent\n•     How many meetings were booked\n•     How many demo calls were booked\n•     How many companies are in pricing negotiation\n•     How many have closed\n\nEach section of this page is to really narrow down on the funnel of each of the outbound motions and understand where people are dropping off while booking a meeting to help us better address that issue and make sure that the conversion from lead to sales is higher.',
    },
    tasks: seedTasks(),
  };
}
