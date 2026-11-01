/* FleetFlow AI — product prototype.
   Vanilla JS, hash-routed, no build step. */

// ---------------------------------------------------------------- icons
const P = {
  logo: '<path d="M5 19V9a4 4 0 0 1 4-4h10"/><path d="M9 19v-6a2 2 0 0 1 2-2h8"/><circle cx="17" cy="17" r="2"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16"/>',
  send: '<path d="M20 4 4 11l7 2 2 7 7-16Z"/>',
  box: '<path d="M4 8 12 4l8 4v8l-8 4-8-4V8Z"/><path d="m4 8 8 4 8-4M12 12v8"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  alert: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17v.5"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
  bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  play: '<path d="M7 5v14l12-7L7 5Z"/>',
  shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2Z"/>',
  msg: '<path d="M21 12a8 8 0 0 1-11.8 7L4 20l1-5A8 8 0 1 1 21 12Z"/>',
  ban: '<circle cx="12" cy="12" r="8"/><path d="m6.5 6.5 11 11"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  building: '<path d="M4 20V5l8-2v17M12 8l8 2v10M2 20h20M7 8h2M7 12h2M7 16h2M15 13h2M15 16h2"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
  plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  inbox: '<path d="M4 13 6.5 5h11L20 13v6H4v-6Z"/><path d="M4 13h4.5l1 2h5l1-2H20"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"/><path d="M9 4v14M15 6v14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  filter: '<path d="M4 5h16l-6 8v6l-4-1v-5L4 5Z"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  fuel: '<path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h12M4 10h10M14 8l3 3v6a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/>',
  sparkles: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
};
const icon = (n, s = 16, sw = 1.8) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

// ---------------------------------------------------------------- data
const LEVELS = ['Observe', 'Recommend', 'Draft', 'Approve first', 'Autonomous'];
const LEVEL_DESC = [
  'Watches and reports only. Never acts.',
  'Suggests actions with reasons.',
  'Prepares messages and plans for review.',
  'Acts after a named person approves.',
  'Acts within guardrails and reports back.',
];

const PEOPLE = {
  james: { name: 'James Whitaker', i: 'JW', c: '#3b3b44' },
  priya: { name: 'Priya Nair', i: 'PN', c: '#a2574c' },
  kevin: { name: "Kevin O'Brien", i: 'KO', c: '#5a7d8c' },
  sarah: { name: 'Sarah Bennett', i: 'SB', c: '#7a5c99' },
  chris: { name: 'Chris Gray', i: 'CG', c: '#4f6f52' },
  you: { name: 'Alex Morgan', i: 'AM', c: '#8b5a2b' },
};
const av = (k, size = '') => { const p = PEOPLE[k]; return `<span class="avatar ${size}" style="background:${p.c}" title="${p.name}">${p.i}</span>`; };

const AGENTS = [
  { id: 'dispatch', name: 'Dispatch Agent', ic: 'send', status: 'needs', needs: 1,
    desc: 'Assigns loads and balances driver capacity across the Bay Area.',
    m: [['1,284', 'Shipments matched'], ['412', 'Actions today']],
    last: ['9:41', 'Proposed SF-48305 for Luis Hernandez', 'wait'], level: 3,
    mission: 'Assigns every load to the right driver at the right time, balancing hours of service, distance and customer windows.',
    version: 'Dispatch & assignment · Policy v3.2' },
  { id: 'route', name: 'Route Agent', ic: 'route', status: 'needs', needs: 1,
    desc: 'Watches live traffic and proposes faster, safer routes.',
    m: [['214', 'Vehicles on road'], ['96', 'Reroutes proposed']],
    last: ['9:32', 'Proposed I-880 reroute for SF-48231', 'wait'], level: 1,
    mission: 'Keeps every truck on the fastest safe route, re-planning around traffic, weather and road closures as they happen.',
    version: 'Routing · Policy v2.7' },
  { id: 'exception', name: 'Exception Agent', ic: 'alert', status: 'needs', needs: 1,
    desc: 'Detects, classifies and resolves delivery exceptions.',
    m: [['24', 'Open exceptions'], ['31', 'Auto-resolved']],
    last: ['9:20', 'Prepared reshipping for SF-48613', 'wait'], level: 3,
    mission: 'Catches late, damaged and refused deliveries early, classifies them, and prepares the fix before a customer has to call.',
    version: 'Exceptions · Policy v1.9' },
  { id: 'customer', name: 'Customer Agent', ic: 'msg', status: 'active',
    desc: 'Sends ETA updates and answers customer questions.',
    m: [['128', 'Conversations'], ['42', 'Messages sent']],
    last: ['9:28', 'Sent ETA update to Acme Commerce', 'auto'], level: 2,
    mission: 'Keeps every shipper and receiver informed with accurate ETAs and clear answers, in your tone of voice.',
    version: 'Customer comms · Policy v4.0' },
  { id: 'fleet', name: 'Fleet Agent', ic: 'truck', status: 'active',
    desc: 'Tracks vehicle health, fuel and maintenance risk.',
    m: [['86', 'Vehicles'], ['7', 'Health alerts']],
    last: ['10:14', 'Flagged reefer drift on unit #217', 'auto'], level: 1,
    mission: 'Watches telematics across the fleet and books maintenance before a breakdown turns into a missed delivery.',
    version: 'Fleet health · Policy v2.1' },
  { id: 'ops', name: 'Operations Analyst', ic: 'chart', status: 'idle',
    desc: 'Explains performance and answers questions in plain English.',
    m: [['12', 'Reports today'], ['4', 'New insights']],
    last: ['09:02', 'Published the daily ops one-pager', 'auto'], level: 0,
    mission: 'Turns the day’s operations into plain-English reports and answers “why” questions about cost, service and capacity.',
    version: 'Reporting · Policy v1.3' },
];

const CAPS = {
  dispatch: [
    ['send', 'Assign drivers to new loads', 'Match unassigned loads with available drivers', 3],
    ['route', 'Reassign active loads', 'Move a load to another driver mid-route', 3],
    ['bell', 'Notify drivers', 'Send dispatch instructions to the driver app', 4],
    ['cal', 'Change pickup appointments', 'Request a new dock time from the shipper', 2],
    ['ban', 'Cancel shipments', 'Cancel or put a shipment on hold', 0],
  ],
};
const defaultCaps = (a) => [
  ['spark', 'Recommend next best action', 'Suggest what to do with reasons', Math.max(1, a.level)],
  ['msg', 'Message drivers and customers', 'Send routine updates', a.level],
  ['wrench', 'Change live operations', 'Edit plans that are already in motion', Math.max(0, a.level - 1)],
  ['ban', 'Cancel shipments', 'Cancel or put a shipment on hold', 0],
];

const GUARDRAILS = [
  ['Respect hours of service', 'Keep a 2h buffer on every assignment', true],
  ['Protect customer windows', 'Replan if pickup would miss the window', true],
  ['Detours over 15 mi need approval', 'Applies to loads above $5K', true],
  ['Prefer drivers with customer history', 'Weighted 20% in the match score', true],
  ['Allow overtime up to $250 a day', 'Off until payroll policy is approved', false],
];

const DECISIONS = [
  ['james', 'Proposed moving SF-48291 off Emily', 'Waiting for James · 12 min ago', ['amber', 'Pending']],
  ['james', 'Split SF-48120 final stop to Luis', 'Overridden by James · 34 min ago', ['gray', 'Kept original plan']],
  ['priya', 'Matched Lauren Diaz to SF-48340 pickup', 'Approved by Priya · 1 h ago', ['green', 'On time']],
  ['sarah', 'Swapped trailers on SF-48302', 'Approved by Sarah · 2 h ago', ['green', 'Saved 41 mi']],
];

const SANDBOX = {
  stats: [['On time', '96.8%', '+2.6 pts'], ['Empty miles', '−4.1%', '312 fewer miles'], ['Approvals', '38', '7 fewer than live', 'm'], ['Rule breaks', '0', 'Hours and windows held', 'm']],
  changes: [
    ['SF-48077', 'Relay at Stockton instead of paying overtime', ['green', 'Saves $210']],
    ['SF-48092', 'Gave the load to Luis, 8 mi closer to pickup', ['green', '−8 empty mi']],
    ['SF-48131', 'Wanted an 18 mi detour, blocked by your 15 mi limit', ['amber', 'Blocked']],
    ['SF-48160', 'Same driver, left 20 min earlier to beat I-80 traffic', ['green', 'On time']],
    ['SF-48172', 'Held a load for a driver with this customer’s history', ['green', '+1 match score']],
    ['SF-48188', 'Asked James before moving a $7.2K load', ['accent', 'Needs approval']],
  ],
};

const APPROVERS = [
  ['Dispatch and routing', 'james', 'Backup: Sarah Bennett'],
  ['Customer messages', 'priya', 'Backup: Chris Gray'],
  ['Maintenance $500 to $2,500', 'kevin', 'Backup: Sarah Bennett'],
  ['One-off spend over $2,500', 'sarah', 'Backup: none'],
];

const PERMS = [
  ['send', 'Assign and reassign drivers', 'Dispatch Agent', 3],
  ['msg', 'Send routine ETA updates', 'Customer Agent · inside window', 4],
  ['cal', 'Rebook deliveries', 'Customer Agent', 3],
  ['wrench', 'Book preventive maintenance', 'Fleet Agent · under $500', 4],
  ['x', 'Cancel shipments', 'All agents', 0],
];

const POLICIES = [
  ['Require a reason on overrides', 'Improves agent learning', true],
  ['Explain every recommendation', 'What happened, why, impact', true],
  ['Daily digest to approvers', 'Sent at 6:00 PM local time', false],
];

const SOURCES = [
  ['TMS', 'McLeod TMS', 'Loads, rates, customers', '#0f766e', true],
  ['ELD', 'Samsara ELD', 'Hours of service, GPS, faults', '#1d4ed8', true],
  ['WMS', 'Warehouse system', 'Dock appointments', '#9333ea', true],
  ['$', 'Payroll', 'Overtime and pay rules', '#b45309', false],
];

// Activity log rows: [time, agentId, action, ref, reason, approval{kind,who}, result[color,text]]
const LOG = [
  ['10:42', 'exception', 'Proposed reshipping', 'SF-48613', 'Driver closed for inventory; 3 pallets short on delivery', ['wait', 'priya'], ['amber', 'Pending approval']],
  ['10:38', 'exception', 'Opened exception', 'SF-48610', 'Driver idle at geofence over 35 min, no scan at receiver', ['auto', 'Auto · policy E-1'], ['green', 'Classified: Detention']],
  ['10:31', 'route', 'Recommended reroute', 'SF-48231', 'Congestion on I-80 E; 1 lane closed, speed down 38%', ['wait', 'sarah'], ['amber', 'Pending approval']],
  ['10:27', 'dispatch', 'Proposed reassignment', 'SF-48291', 'Emily is 42 min from HOS limit; Luis is 18 mi closer', ['wait', 'james'], ['amber', 'Pending approval']],
  ['10:22', 'customer', 'Sent ETA update', 'SF-48305', 'Window unchanged; routine update at 50% of route', ['auto', 'Auto · policy C-2'], ['green', 'Delivered, read 9:58']],
  ['10:14', 'fleet', 'Flagged reefer drift', 'Unit #217', 'Compressor cycling 38% longer than baseline', ['auto', 'Auto · alert only'], ['green', 'Email sent']],
  ['10:09', 'dispatch', 'Reassigned load', 'SF-48277', 'Tyler Brooks 12 min closer, 3 h HOS left', ['ok', 'james'], ['green', 'Picked up on time']],
  ['10:02', 'customer', 'Requested POD photo', 'SF-48250', 'Receiver confirmed by SMS, signature missing', ['auto', 'Auto · policy C-4'], ['green', 'Waiting on driver']],
  ['09:55', 'dispatch', 'Split final stop', 'SF-48120', 'Earlier ETA would land inside the 1 h buffer', ['over', 'james'], ['gray', 'Kept original plan']],
  ['09:49', 'route', 'Recommended stops reorder', 'SF-48197', 'Saves 6.2 mi and keeps all 4 windows', ['ok', 'sarah'], ['green', 'Saved 6.2 mi']],
  ['09:41', 'customer', 'Answered booking question', 'Acme Commerce', 'Confirmed Tuesday liftgate capacity for 8 pallets', ['auto', 'Auto · policy C-1'], ['green', 'Customer replied']],
  ['09:36', 'customer', 'Sent 28 ETA updates', 'Batch', 'All windows unchanged; routine morning update', ['auto', 'Auto · policy C-2'], ['green', '28 delivered']],
  ['09:30', 'fleet', 'Booked brake inspection', 'Unit #142', 'Pad wear at 22%; next service window is Thursday', ['auto', 'Auto · under $500'], ['green', 'Booked Thu 7:00']],
  ['09:24', 'ops', 'Published daily one-pager', 'Report', 'On-time 95.1%, empty miles −3.4% week over week', ['auto', 'Auto · read only'], ['green', 'Sent to 9 people']],
  ['09:18', 'exception', 'Filed damage claim draft', 'SF-48054', 'Receiver photo shows crushed corner on 2 cartons', ['ok', 'priya'], ['green', 'Claim filed']],
  ['09:11', 'dispatch', 'Matched new load', 'SF-48340', 'Lauren Diaz has history with this receiver', ['ok', 'priya'], ['green', 'On time']],
  ['09:04', 'route', 'Recommended departure shift', 'SF-48160', 'Leaving 20 min earlier avoids I-80 peak', ['over', 'sarah'], ['gray', 'Driver on break']],
  ['08:57', 'fleet', 'Flagged low DEF level', 'Unit #088', 'DEF at 9%; next stop has a fuel island', ['auto', 'Auto · alert only'], ['green', 'Driver refilled']],
  ['08:50', 'customer', 'Drafted delay notice', 'SF-48011', 'Exception E-224 adds 45 min; customer prefers phone', ['ok', 'priya'], ['green', 'Called by Priya']],
  ['08:42', 'exception', 'Auto-resolved address issue', 'SF-48002', 'Suite number missing; matched from last 3 deliveries', ['auto', 'Auto · policy E-3'], ['green', 'Delivered']],
];

// ---------------------------------------------------------------- state
const state = {
  paused: false,
  pauseInfo: null,
  levels: Object.fromEntries(AGENTS.map(a => [a.id, a.level])),
  caps: {},
  defaultLevel: 3,
  perms: PERMS.map(p => p[3]),
  guards: GUARDRAILS.map(g => g[2]),
  policies: POLICIES.map(p => p[2]),
  sources: SOURCES.map(s => s[4]),
  agentOn: Object.fromEntries(AGENTS.map(a => [a.id, true])),
  dirty: false,
  log: { agent: 'all', decision: 'any', outcome: 'any', q: '', page: 1 },
};
const agentById = (id) => AGENTS.find(a => a.id === id);
const capsFor = (id) => {
  if (!state.caps[id]) {
    const base = CAPS[id] || defaultCaps(agentById(id));
    state.caps[id] = base.map(c => ({ ic: c[0], name: c[1], sub: c[2], level: c[3], orig: c[3] }));
  }
  return state.caps[id];
};

// ---------------------------------------------------------------- helpers
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const abar = (n) => `<div class="abar">${[0, 1, 2, 3, 4].map(i => `<i class="${i < n ? 'f' : ''}"></i>`).join('')}</div>`;
const dots = (n) => `<span class="lvl-dots">${[0, 1, 2, 3, 4].map(i => `<i class="${i < n ? 'f' : ''}"></i>`).join('')}</span>`;
const seg = (level, attrs) => `<div class="seg" ${attrs}>${LEVELS.map((l, i) =>
  `<button type="button" data-l="${i}" class="${i === level ? 'on lvl-' + i : ''}">${i === 3 ? icon('lock', 11, 2.2) : ''}${l}</button>`).join('')}</div>`;

function statusPill(a) {
  if (state.paused || !state.agentOn[a.id]) return '<span class="pill gray">Paused</span>';
  if (a.status === 'needs') return `<span class="pill amber">Needs you · ${a.needs}</span>`;
  if (a.status === 'active') return '<span class="pill green">Active</span>';
  return '<span class="pill gray">Idle</span>';
}

function toast(msg, undo) {
  $('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="ok">${icon('check', 12, 3)}</span>${esc(msg)}${undo ? '<button type="button">Undo</button>' : ''}`;
  document.body.appendChild(t);
  if (undo) t.querySelector('button').onclick = () => { undo(); t.remove(); };
  setTimeout(() => t.remove(), 3600);
}

// ---------------------------------------------------------------- chrome
function rail(route) {
  const pending = (window.INBOX || []).length;
  const openEx = (window.EXCEPTIONS || []).filter(x => !x.resolved).length;
  const items = [
    ['#/overview', 'grid', 'Overview', route === 'overview'],
    ['#/agents', 'sparkles', 'AI agents', route.startsWith('agents')],
    ['#/inbox', 'inbox', 'Approvals', route === 'inbox', '', pending],
    ['#/shipments', 'box', 'Shipments', route === 'shipments', 'hide-sm'],
    ['#/dispatch', 'send', 'Dispatch board', route === 'dispatch', 'hide-sm'],
    ['#/routes', 'route', 'Live routes', route === 'routes', 'hide-sm'],
    ['#/exceptions', 'alert', 'Exceptions', route === 'exceptions', 'hide-sm', openEx],
  ];
  const items2 = [
    ['#/customers', 'users', 'Customers', route === 'customers', 'hide-sm'],
    ['#/fleet', 'truck', 'Fleet', route === 'fleet', 'hide-sm'],
    ['#/reports', 'chart', 'Reports', route === 'reports', 'hide-sm'],
    ['#/activity', 'list', 'Activity log', route === 'activity', 'hide-sm'],
  ];
  const link = ([h, ic, label, on, cls = '', badge]) =>
    `<a href="${h}" class="${on ? 'on' : ''} ${cls}" title="${label}" aria-label="${label}">${icon(ic, 18)}${badge ? `<span class="dot">${badge}</span>` : ''}</a>`;
  return `<nav class="rail">
    <a href="../" class="logo" title="FleetFlow AI home" aria-label="FleetFlow AI home">${icon('logo', 18, 2.2)}</a>
    ${items.map(link).join('')}
    <div class="sep"></div>
    ${items2.map(link).join('')}
    <div class="spacer"></div>
    ${link(['#/settings', 'settings', 'Settings', route === 'settings'])}
    <a href="#" data-act="help" class="hide-sm" title="Help & shortcuts" aria-label="Help">${icon('help', 18)}</a>
    <span class="avatar" style="background:${PEOPLE.you.c}" title="${PEOPLE.you.name}">${PEOPLE.you.i}</span>
  </nav>`;
}

function topbar({ crumb, title, back, actions }) {
  return `<header class="top">
    <div>
      <div class="crumb">${crumb}</div>
      <h1 class="title">${back ? `<a class="back" href="${back}" aria-label="Back">${icon('back', 18)}</a>` : ''}${title}</h1>
    </div>
    <div class="actions">${actions}
      <button class="icon-btn" type="button" data-act="notifs" aria-label="Notifications">${icon('bell', 18)}<span class="ping"></span></button>
    </div>
  </header>`;
}
const searchBox = (ph = 'Search shipments, drivers…', id = '') => !id
  ? `<button type="button" class="search" data-act="palette">${icon('search', 14)}<span style="flex:1;text-align:left;font-size:12px">${ph}</span><span class="kbd">⌘K</span></button>`
  : `<label class="search">${icon('search', 14)}<input ${id ? `id="${id}"` : ''} placeholder="${ph}" aria-label="Search"><span class="kbd">⌘K</span></label>`;
const pauseBtn = () => state.paused
  ? `<button class="btn accent" type="button" data-act="resume">${icon('play', 13, 2.2)}Resume agents</button>`
  : `<button class="btn dark" type="button" data-act="pause">${icon('pause', 13, 2.2)}Pause all agents</button>`;
const pausedBanner = () => state.paused ? `<div class="paused-banner">${icon('pause', 15, 2.2)}
  <span><b>All agents are paused</b> ${esc(state.pauseInfo.until)} · “${esc(state.pauseInfo.reason || 'No reason given')}” · by ${PEOPLE.you.name}</span>
  <button class="btn" type="button" data-act="resume">${icon('play', 12, 2.2)}Resume now</button></div>` : '';

// ---------------------------------------------------------------- views
function viewAgents() {
  const waiting = state.paused ? 0 : AGENTS.reduce((n, a) => n + (a.needs || 0), 0);
  return `${topbar({
    crumb: 'All agents', title: 'AI agents',
    actions: `${searchBox()}
      <a class="btn" href="#/activity">${icon('list', 14)}Activity log</a>
      <a class="btn" href="#/settings">${icon('shield', 14)}Permissions</a>
      ${pauseBtn()}`,
  })}
  ${pausedBanner()}
  <section class="hero ${state.paused ? 'paused' : ''}">
    <div>
      <div class="eyebrow"><span class="chip">${icon('sparkles', 13)}</span><span class="live"></span>${state.paused ? '6 agents paused' : '6 agents active · Live'}</div>
      <h2><b>1,912 actions today.</b> 94% needed no human, and ${waiting || 'no'} decision${waiting === 1 ? ' is' : 's are'} waiting for you.</h2>
      <div class="stats">
        <div><div class="label">Time saved</div><div class="v num">38h</div></div>
        <div><div class="label">Accuracy</div><div class="v num">97.4%</div></div>
        <div><div class="label">Override rate</div><div class="v num">2.1%</div></div>
        <div><div class="label">Waiting for you</div><div class="v num amber">${waiting}</div></div>
      </div>
    </div>
    <div class="panel"><div class="ph"><span class="live"></span>Runs on its own</div><ul>
      ${['Match loads', 'Schedule shipments', 'Draft messages', 'Generate reports', 'Flag exceptions'].map(x => `<li>${icon('check', 12, 2.4)}${x}</li>`).join('')}
    </ul></div>
    <div class="panel ask"><div class="ph">${icon('lock', 13, 2.2)}Asks you first</div><ul>
      ${['Rerouting', 'Driver reassignment', 'Customer compensation', 'Schedule changes', 'Shipment cancellation'].map(x => `<li>${icon('shield', 12, 2.2)}${x}</li>`).join('')}
    </ul></div>
  </section>
  <section class="grid3">
    ${AGENTS.map(a => {
      const lv = state.levels[a.id];
      return `<article class="agent ${state.paused || !state.agentOn[a.id] ? 'is-paused' : ''}" data-go="#/agents/${a.id}" tabindex="0" role="link" aria-label="Open ${a.name}">
        <div class="between"><span class="ic">${icon(a.ic, 15, 2)}</span>${statusPill(a)}</div>
        <div><div class="name">${a.name}</div><div class="desc">${a.desc}</div></div>
        <div class="metrics">${a.m.map(([v, k]) => `<div><div class="v num">${v}</div><div class="k">${k}</div></div>`).join('')}</div>
        <div class="last"><span class="t">${a.last[0]}</span><span class="x">${a.last[1]}</span>
          <span class="mini-tag ${a.last[2]}">${a.last[2] === 'wait' ? 'Waiting' : 'Auto'}</span></div>
        <div class="foot"><div class="between"><span>Autonomy</span><b>${LEVELS[lv]}</b></div>${abar(lv + 1)}</div>
      </article>`;
    }).join('')}
  </section>`;
}

function chartData(seed) {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 30 }, (_, i) => {
    const weekend = i % 7 === 5 || i % 7 === 6;
    const auto = Math.round((weekend ? 120 : 300) + rnd() * 140);
    const ap = Math.round((weekend ? 6 : 14) + rnd() * 18);
    return { auto, ap, day: new Date(2026, 9, 3 + i) };
  });
}

function viewAgent(id) {
  const a = agentById(id);
  if (!a) return viewAgents();
  const caps = capsFor(id);
  const data = chartData(id.length * 97);
  const max = Math.max(...data.map(d => d.auto + d.ap));
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${topbar({
    crumb: `<a href="#/agents">AI agents</a> / ${a.name}`, title: a.name, back: '#/agents',
    actions: `<label class="row" style="gap:8px;font-size:12px;cursor:pointer">
        <button type="button" class="toggle green ${state.agentOn[id] && !state.paused ? 'on' : ''}" data-act="agent-toggle" data-id="${id}" aria-label="Agent active"></button>
        <span>${state.paused ? 'Paused (global)' : state.agentOn[id] ? 'Agent active' : 'Agent paused'}</span></label>
      <button class="btn" type="button" data-act="sandbox" data-id="${id}">${icon('bolt', 14)}Test in sandbox</button>
      <button class="btn dark" type="button" data-act="save">${icon('check', 14, 2.4)}Save changes</button>`,
  })}
  ${pausedBanner()}
  <div class="detail">
    <div style="display:grid;gap:12px;min-width:0">
      <div class="mission"><span class="big-ic">${icon(a.ic, 20, 2)}</span>
        <div><div class="label">${a.version}</div><p>${a.mission}</p></div></div>
      <div class="card">
        <div class="kpis">
          <div><div class="label">Recommendations today</div><div class="v num">42</div><div class="s">Across 1,284 shipments</div></div>
          <div><div class="label">Approved</div><div class="v num green">31</div><div class="s">74% of total</div></div>
          <div><div class="label">Overridden</div><div class="v num">8</div><div class="s">with reasons logged</div></div>
          <div><div class="label">Pending</div><div class="v num amber">3</div><div class="s">oldest 26 min</div></div>
        </div>
        <div class="split"><i style="flex:31;background:var(--green)"></i><i style="flex:8;background:#d9d9dd"></i><i style="flex:3;background:var(--amber)"></i></div>
      </div>
      <div class="card">
        <div class="between" style="margin-bottom:6px"><div><h3 class="h3">What this agent can do</h3>
          <p class="sub">Set autonomy for each capability. Anything above Draft is logged with its reason.</p></div>
          <button class="link" type="button" data-act="reset-caps" data-id="${id}">Reset to policy</button></div>
        <div class="cap">${caps.map((c, i) => `<div class="r ${c.level !== c.orig ? 'changed' : ''}">
          <span class="ci">${icon(c.ic, 14)}</span><div class="txt"><b>${c.name}</b><span>${c.sub}</span></div>
          ${seg(c.level, `data-cap="${i}" data-id="${id}"`)}</div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="between"><h3 class="h3">Agent actions per day · last 30 days</h3>
          <div class="legend"><span><i style="background:var(--ink)"></i>Automatic</span><span><i style="background:#c9c6ff"></i>Needed approval</span></div></div>
        <div class="chart" id="chart">${data.map((d, i) => `<div class="bar" data-i="${i}">
          <i style="height:${(d.auto / max) * 100}%"></i><i class="ap" style="height:${(d.ap / max) * 100}%"></i></div>`).join('')}
          <div class="tip" id="tip"></div></div>
        <div class="axis"><span>${fmt(data[0].day)}</span><span>${fmt(data[10].day)}</span><span>${fmt(data[20].day)}</span><span>Today</span></div>
      </div>
    </div>
    <aside class="side">
      <div class="card">
        <h3 class="h3">Guardrails</h3><p class="sub" style="margin-bottom:6px">Hard limits the agent can never cross</p>
        <div class="guard">${GUARDRAILS.map((g, i) => `<div class="g"><div class="txt"><b>${g[0]}</b><span>${g[1]}</span></div>
          <button type="button" class="toggle ${state.guards[i] ? 'on' : ''}" data-act="guard" data-i="${i}" aria-label="${g[0]}"></button></div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="between"><h3 class="h3">Recent decisions</h3><a class="link" href="#/activity">View all</a></div>
        <div style="margin-top:6px">${DECISIONS.map(d => `<div class="decision">${av(d[0], 'lg')}
          <div><b>${d[1]}</b><small>${d[2]}</small><span class="pill ${d[3][0]}">${d[3][1]}</span></div></div>`).join('')}</div>
      </div>
    </aside>
  </div>`;
}

const SETTINGS_NAV = [['organization', 'building', 'Organization'], ['team', 'users', 'Team & roles'], ['notifications', 'bell', 'Notifications'], ['integrations', 'plug', 'Integrations'], ['ai', 'sparkles', 'AI & automation'], ['billing', 'card', 'Billing'], ['security', 'key', 'Security']];
const settingsNav = (tab) => `<nav class="snav">${SETTINGS_NAV.map(([k, ic, l]) => `<a href="#/settings/${k}" class="${k === tab ? 'on' : ''}">${icon(ic, 15)}${l}</a>`).join('')}</nav>`;
function viewSettings(tab = 'ai') {
  if (tab !== 'ai' && window.SETTINGS_TABS?.[tab]) {
    const label = SETTINGS_NAV.find(n => n[0] === tab)[2];
    return `${topbar({ crumb: `Settings / ${label}`, title: 'Settings',
      actions: `<a class="btn ghost" href="#/activity">${icon('eye', 14)}View audit log</a>
      <button class="btn dark" type="button" data-act="save">${icon('check', 14, 2.4)}Save changes</button>` })}
    ${pausedBanner()}
    <div class="settings two-col">${settingsNav(tab)}<div class="stab" style="min-width:0">${SETTINGS_TABS[tab]()}</div></div>`;
  }
  return `${topbar({
    crumb: 'Settings / AI & automation', title: 'Settings',
    actions: `<a class="btn ghost" href="#/activity">${icon('eye', 14)}View audit log</a>
      <button class="btn dark" type="button" data-act="save">${icon('check', 14, 2.4)}Save changes</button>`,
  })}
  ${pausedBanner()}
  <div class="settings">
    ${settingsNav('ai')}
    <div style="display:grid;gap:14px;min-width:0">
      <div>
        <h3 class="h3">AI & automation</h3>
        <p class="sub">Decide how far each agent can go on its own. Every action above Draft is logged with its reason, data and approver.</p>
      </div>
      <div class="levels">${LEVELS.map((l, i) => `<button type="button" class="level ${state.defaultLevel === i ? 'on' : ''}" data-act="default-level" data-l="${i}">
        ${dots(i + 1)}<b>${l}</b><span>${LEVEL_DESC[i]}</span>${state.defaultLevel === i ? '<span class="def">Default</span>' : ''}</button>`).join('')}</div>
      <div class="card">
        <div class="between" style="margin-bottom:4px"><div><h3 class="h3">Permissions by capability</h3>
          <p class="sub">Applies to all agents. Agent pages can only lower these limits.</p></div>
          <button type="button" class="link" data-act="reset-perms">Reset to recommended</button></div>
        <div class="cap">${PERMS.map((p, i) => `<div class="r ${state.perms[i] !== p[3] ? 'changed' : ''}"><span class="ci">${icon(p[0], 14)}</span>
          <div class="txt"><b>${p[1]}</b><span>${p[2]}</span></div>${seg(state.perms[i], `data-perm="${i}"`)}</div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="between" style="margin-bottom:4px"><div><h3 class="h3">Data access</h3>
          <p class="sub">What agents can read to make decisions. Read-only unless a capability allows writes.</p></div>
          <button type="button" class="link">Manage sources</button></div>
        ${SOURCES.map((s, i) => `<div class="source"><span class="si" style="color:${s[3]}">${s[0]}</span>
          <div style="flex:1"><b style="font-weight:500">${s[1]}</b><div class="sub" style="margin:0">${s[2]}</div></div>
          <button type="button" class="toggle ${state.sources[i] ? 'on' : ''}" data-act="source" data-i="${i}" aria-label="${s[1]}"></button></div>`).join('')}
      </div>
    </div>
    <aside class="side">
      <div class="running">
        <div class="between"><b>${state.paused ? 'All agents paused' : 'All agents running'}</b>
          <button type="button" class="toggle ${state.paused ? '' : 'on'}" data-act="${state.paused ? 'resume' : 'pause'}" aria-label="All agents running"></button></div>
        <div style="color:#7d7d88;font-size:11px;margin-top:2px">${state.paused ? esc(state.pauseInfo.until) : 'Last paused: Sep 12 by Sarah Bennett'}</div>
        <p>Pausing stops every agent at once. Queued actions wait for a person; anything already sent stays sent.</p>
      </div>
      <div class="card">
        <h3 class="h3">Who approves</h3><p class="sub">Named owner per action type, with a backup</p>
        <div style="margin-top:6px">${APPROVERS.map(a => `<div class="approver">${av(a[1], 'lg')}<div>
          <div class="label">${a[0]}</div><b>${PEOPLE[a[1]].name}</b><span>${a[2]}</span></div></div>`).join('')}</div>
      </div>
      <div class="card">
        <h3 class="h3">Policies</h3>
        <div style="margin-top:6px">${POLICIES.map((p, i) => `<div class="policy"><div class="txt"><b>${p[0]}</b><span>${p[1]}</span></div>
          <button type="button" class="toggle ${state.policies[i] ? 'on' : ''}" data-act="policy" data-i="${i}" aria-label="${p[0]}"></button></div>`).join('')}</div>
      </div>
    </aside>
  </div>`;
}

function filteredLog() {
  const f = state.log, q = f.q.trim().toLowerCase();
  return LOG.filter(r => {
    if (f.agent !== 'all' && r[1] !== f.agent) return false;
    if (f.decision === 'auto' && r[5][0] !== 'auto') return false;
    if (f.decision === 'human' && r[5][0] === 'auto') return false;
    if (f.outcome !== 'any' && r[6][0] !== f.outcome) return false;
    if (q && !(r.slice(2, 5).join(' ') + ' ' + agentById(r[1]).name).toLowerCase().includes(q)) return false;
    return true;
  });
}

function approvalCell([kind, who]) {
  if (kind === 'auto') return `<span class="who auto">${icon('bolt', 13)}${who}</span>`;
  const verb = { wait: 'Waiting for', ok: 'Approved by', over: 'Overridden by' }[kind];
  return `<span class="who">${av(who, 'sm')}${verb} ${PEOPLE[who].name.split(' ')[0]}</span>`;
}

function logRows() {
  const rows = filteredLog();
  if (!rows.length) return `<tr><td colspan="6" class="empty">No actions match these filters.</td></tr>`;
  return rows.map(r => {
    const a = agentById(r[1]);
    return `<tr><td class="time">${r[0]}</td>
      <td><a class="agent-link" href="#/agents/${a.id}"><i>${icon(a.ic, 10, 2.4)}</i>${a.name}</a></td>
      <td class="act"><b>${r[2]}</b><span>${r[3]}</span></td>
      <td class="reason">${r[4]}</td>
      <td>${approvalCell(r[5])}</td>
      <td><span class="pill ${r[6][0]}">${r[6][1]}</span></td></tr>`;
  }).join('');
}

function viewActivity() {
  const f = state.log;
  const sel = (key, label, opts) => `<label class="filter"><span>${label}</span><select data-f="${key}">
    ${opts.map(([v, t]) => `<option value="${v}" ${f[key] === v ? 'selected' : ''}>${t}</option>`).join('')}</select>${icon('down', 12)}</label>`;
  return `${topbar({
    crumb: 'AI agents / Activity log', title: 'Activity log', back: '#/agents',
    actions: `${searchBox('Search actions, shipments…', 'log-q')}
      <button class="btn" type="button" data-act="csv">${icon('download', 14)}Export CSV</button>`,
  })}
  ${pausedBanner()}
  <div class="filters">
    <label class="filter"><span>${icon('cal', 13)}</span><select><option>Today</option><option>Yesterday</option><option>Last 7 days</option></select>${icon('down', 12)}</label>
    ${sel('agent', 'Agent', [['all', 'All'], ...AGENTS.map(a => [a.id, a.name.replace(' Agent', '')])])}
    ${sel('decision', 'Decision', [['any', 'Any'], ['auto', 'Automatic'], ['human', 'Human in loop']])}
    ${sel('outcome', 'Outcome', [['any', 'Any'], ['green', 'Completed'], ['amber', 'Pending'], ['gray', 'Overridden']])}
    <div class="summary"><span><b class="num">1,912</b> actions</span><span class="g"><b class="num">1,798</b> automatic</span>
      <span class="a"><b class="num">102</b> approved</span><span class="r"><b class="num">12</b> overridden</span></div>
  </div>
  <div class="table-wrap"><table>
    <thead><tr><th>Time</th><th>Agent</th><th>Action</th><th>Reason</th><th>Approval</th><th>Result</th></tr></thead>
    <tbody id="log-body">${logRows()}</tbody></table></div>
  <div class="pager"><span>Showing <b id="log-count">${filteredLog().length}</b> of 1,912</span>
    <div class="pages">${[1, 2, 3, '…', 96].map(p => `<button type="button" class="${p === 1 ? 'on' : ''}">${p}</button>`).join('')}</div></div>`;
}

// ---------------------------------------------------------------- modals
function openModal(html, onMount) {
  closeModal();
  const s = document.createElement('div');
  s.className = 'scrim';
  s.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  s.addEventListener('click', (e) => { if (e.target === s || e.target.closest('[data-close]')) closeModal(); });
  document.body.appendChild(s);
  onMount?.(s);
  s.querySelector('button, textarea')?.focus();
}
function closeModal() { $('.scrim')?.remove(); }

function sandboxModal(id) {
  const a = agentById(id);
  const changed = capsFor(id).filter(c => c.level !== c.orig).length;
  openModal(`
    <div class="mh"><span class="pill accent">${a.name}</span><h3>Sandbox results</h3>
      <p>Your draft policy${changed ? ` (${changed} change${changed > 1 ? 's' : ''})` : ''} replayed on last week’s real loads. Nothing reached drivers or customers.</p>
      <button class="close" type="button" data-close aria-label="Close">${icon('x', 16)}</button></div>
    <div class="mb">
      <div class="two">
        <div><div class="field-label">Replayed on</div><div class="selectish">${icon('cal', 14)}<span class="grow">Sep 26 to Oct 2 · 1,412 loads</span>${icon('down', 13)}</div></div>
        <div><div class="field-label">Compared with</div><div class="selectish">${icon('shield', 14)}<span class="grow">Live policy v3.2</span>${icon('down', 13)}</div></div>
      </div>
      <div class="four">${SANDBOX.stats.map(s => `<div class="card"><div class="label">${s[0]}</div><div class="v num">${s[1]}</div><div class="s ${s[3] || ''}">${s[2]}</div></div>`).join('')}</div>
      <div><div class="between"><b>6 decisions would change</b><button class="link" type="button" data-act="see-all">See all 6</button></div>
        <div class="changes" id="changes">${SANDBOX.changes.slice(0, 4).map(changeRow).join('')}</div></div>
    </div>
    <div class="mf"><span class="note">${icon('info', 13)}Sandbox runs never touch live data</span>
      <button class="btn ghost" type="button" data-close>Keep editing</button>
      <button class="btn accent" type="button" data-act="publish" data-id="${id}">Publish draft</button></div>`,
    (s) => {
      s.querySelector('[data-act="see-all"]').onclick = (e) => { $('#changes', s).innerHTML = SANDBOX.changes.map(changeRow).join(''); e.target.remove(); };
    });
}
const changeRow = (c) => `<div class="c"><span class="id">${c[0]}</span><span class="tx">${c[1]}</span><span class="pill plain ${c[2][0]}">${c[2][1]}</span></div>`;

function pauseModal() {
  openModal(`
    <div class="mh"><h3>Pause all agents?</h3>
      <p>Every agent stops acting right away. Anything already sent stays sent, and you can resume at any time.</p>
      <button class="close" type="button" data-close aria-label="Close">${icon('x', 16)}</button></div>
    <div class="mb">
      <div class="impact">
        <div class="i"><span class="b">${icon('pause', 13, 2.2)}</span><div><b>6 agents stop</b><span>Dispatch, Route, Exception, Customer, Fleet and the Operations Analyst</span></div></div>
        <div class="i"><span class="b">${icon('clock', 14)}</span><div><b>14 queued actions wait for a person</b><span>They move to your approvals inbox</span></div></div>
        <div class="i"><span class="b" style="color:var(--amber)">${icon('alert', 14, 2)}</span><div><b>2 reroutes lose live updates</b><span>SF-48291 and SF-48297 keep their current route</span></div></div>
      </div>
      <div><div class="field-label">Pause for</div>
        <div class="seg" id="pause-for">${['1 hour', 'Until 6:00 PM', 'Until I resume'].map((t, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-v="${t}">${t}</button>`).join('')}</div></div>
      <div><div class="field-label">Reason · shared with the team</div>
        <textarea class="input" id="pause-reason" placeholder="What looks wrong?">Customer Agent sent two wrong ETAs to Acme Commerce</textarea></div>
      <label class="check"><input type="checkbox" id="pause-tell" checked> Tell the team in the #dispatch channel</label>
    </div>
    <div class="mf"><span class="note">${icon('shield', 13)}Logged to the audit trail with your name</span>
      <button class="btn" type="button" data-close>Cancel</button>
      <button class="btn danger" type="button" data-act="confirm-pause">${icon('pause', 12, 2.2)}Pause all agents</button></div>`,
    (s) => {
      $$('#pause-for button', s).forEach(b => b.onclick = () => { $$('#pause-for button', s).forEach(x => x.classList.toggle('on', x === b)); });
    });
}

// ---------------------------------------------------------------- router
function route() {
  const h = location.hash.replace(/^#\/?/, '') || 'overview';
  const [root, sub] = h.split('/');
  let html;
  if (root === 'agents' && sub) html = viewAgent(sub);
  else if (root === 'agents') html = viewAgents();
  else if (root === 'settings') html = viewSettings(sub || 'ai');
  else if (root === 'activity') html = viewActivity();
  else if (window.VIEWS?.[root]) html = VIEWS[root](sub);
  else html = VIEWS.overview();
  const app = $('#app');
  app.innerHTML = `<div class="shell">${rail(root === 'agents' && sub ? 'agents-detail' : root)}<main class="main"><div class="view">${html}</div></main></div>`;
  mountChart();
  window.afterRender?.(root, sub);
}

function rerender() {
  const y = window.scrollY;
  route();
  window.scrollTo(0, y);
}

function mountChart() {
  const chart = $('#chart'); if (!chart) return;
  const id = location.hash.split('/')[2];
  const data = chartData(id.length * 97);
  const tip = $('#tip');
  chart.addEventListener('mousemove', (e) => {
    const bar = e.target.closest('.bar'); if (!bar) return;
    const d = data[+bar.dataset.i];
    const r = chart.getBoundingClientRect(), b = bar.getBoundingClientRect();
    tip.innerHTML = `<div style="margin-bottom:4px;font-weight:600">${d.day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
      <div class="between"><span>Automatic</span><b>${d.auto}</b></div><div class="between"><span>Needed approval</span><b>${d.ap}</b></div>`;
    tip.style.left = Math.min(Math.max(b.left - r.left + b.width / 2, 75), r.width - 75) + 'px';
    tip.classList.add('show');
  });
  chart.addEventListener('mouseleave', () => tip.classList.remove('show'));
}

// ---------------------------------------------------------------- events
document.addEventListener('click', (e) => {
  const segBtn = e.target.closest('.seg button[data-l]');
  if (segBtn) {
    const segEl = segBtn.parentElement, l = +segBtn.dataset.l;
    if (segEl.dataset.cap != null) capsFor(segEl.dataset.id)[+segEl.dataset.cap].level = l;
    else if (segEl.dataset.perm != null) state.perms[+segEl.dataset.perm] = l;
    state.dirty = true; rerender(); return;
  }
  const go = e.target.closest('[data-go]');
  if (go && !e.target.closest('a,button')) { location.hash = go.dataset.go; return; }

  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  const i = +el.dataset.i;
  switch (act) {
    case 'pause': pauseModal(); break;
    case 'confirm-pause': {
      const until = $('#pause-for .on')?.dataset.v || '1 hour';
      state.paused = true;
      state.pauseInfo = { until: until === 'Until I resume' ? 'until you resume' : until === '1 hour' ? 'for 1 hour' : until.toLowerCase(), reason: $('#pause-reason').value };
      closeModal(); rerender();
      toast('All 6 agents paused. 14 actions moved to your inbox.', () => { state.paused = false; rerender(); });
      break;
    }
    case 'resume': state.paused = false; rerender(); toast('Agents resumed. Queued actions are back with their agents.'); break;
    case 'sandbox': sandboxModal(el.dataset.id); break;
    case 'publish': {
      capsFor(el.dataset.id).forEach(c => { c.orig = c.level; });
      closeModal(); rerender(); toast('Draft published as Policy v3.3 · logged to audit trail'); break;
    }
    case 'save': {
      state.dirty = false;
      Object.values(state.caps).forEach(list => list.forEach(c => { c.orig = c.level; }));
      PERMS.forEach((p, k) => { p[3] = state.perms[k]; });
      rerender(); toast('Changes saved · logged to audit trail'); break;
    }
    case 'reset-caps': capsFor(el.dataset.id).forEach(c => { c.level = c.orig; }); rerender(); break;
    case 'reset-perms': state.perms = PERMS.map(p => p[3]); rerender(); break;
    case 'guard': state.guards[i] = !state.guards[i]; rerender(); break;
    case 'policy': state.policies[i] = !state.policies[i]; rerender(); break;
    case 'source': state.sources[i] = !state.sources[i]; rerender(); break;
    case 'default-level': state.defaultLevel = +el.dataset.l; rerender(); break;
    case 'agent-toggle': if (!state.paused) { state.agentOn[el.dataset.id] = !state.agentOn[el.dataset.id]; rerender(); } break;
    case 'csv': exportCSV(); break;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter' && e.target.matches('[data-go]')) location.hash = e.target.dataset.go;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); window.openPalette?.(); }
});

document.addEventListener('change', (e) => {
  const s = e.target.closest('select[data-f]'); if (!s) return;
  state.log[s.dataset.f] = s.value; refreshLog();
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'log-q') { state.log.q = e.target.value; refreshLog(); }
});
function refreshLog() {
  const b = $('#log-body'); if (!b) return;
  b.innerHTML = logRows(); $('#log-count').textContent = filteredLog().length;
}

function exportCSV() {
  const head = ['time', 'agent', 'action', 'reference', 'reason', 'approval', 'result'];
  const rows = filteredLog().map(r => [r[0], agentById(r[1]).name, r[2], r[3], r[4], r[5][0] === 'auto' ? r[5][1] : `${r[5][0]}:${PEOPLE[r[5][1]].name}`, r[6][1]]);
  const csv = [head, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'fleetflow-activity-log.csv' });
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  toast(`Exported ${rows.length} rows`);
}

// Embedded mode (marketing page iframe): ?embed=1 hides nothing but disables framing padding
if (!new URLSearchParams(location.search).has('embed')) document.body.classList.add('framed');
window.addEventListener('hashchange', () => { closeModal(); route(); window.scrollTo(0, 0); });
// views.js registers the remaining screens; render once every script has run.
document.addEventListener('DOMContentLoaded', route);
