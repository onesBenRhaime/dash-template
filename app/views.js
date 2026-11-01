/* FleetFlow AI — the rest of the app.
   Overview, Approvals inbox, Shipments, Dispatch board, Live routes, Exceptions,
   Customers, Fleet, Reports, Settings tabs, command palette, notifications.
   Depends on helpers and data defined in app.js. */

// ================================================================ data
function rng(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }

const CITY = {
  'Santa Rosa': [150, 46], Richmond: [232, 168], Sacramento: [585, 70], Oakland: [262, 228], Hayward: [318, 296],
  Fremont: [366, 352], 'San Jose': [420, 432], Stockton: [612, 236], Tracy: [520, 300], Livermore: [430, 284],
  Modesto: [660, 360], Salinas: [372, 500], Vallejo: [300, 120],
};

const DRIVERS = [
  ['Luis Hernandez', '#3b6e8f', 9.5, 'available', 'Hayward'], ['Emily Chen', '#a2574c', 0.7, 'driving', 'Fremont'],
  ['Tyler Brooks', '#4f6f52', 3.0, 'driving', 'Oakland'], ['Lauren Diaz', '#7a5c99', 6.2, 'driving', 'Stockton'],
  ['Marcus Reed', '#3b3b44', 4.8, 'driving', 'Oakland'], ['Aisha Khan', '#b07d2b', 10.5, 'available', 'San Jose'],
  ['Diego Ramos', '#5a7d8c', 7.1, 'driving', 'Tracy'], ['Hannah Lee', '#8b5a2b', 2.4, 'on break', 'Livermore'],
  ['Omar Farouk', '#2f6f6a', 8.9, 'available', 'Richmond'], ['Sofia Rossi', '#9a4f7a', 5.5, 'driving', 'Sacramento'],
  ['Ben Carter', '#55606e', 0, 'off duty', 'Oakland'], ['Grace Kim', '#6b7a3a', 11, 'available', 'Fremont'],
].map(([name, c, hos, status, loc], i) => ({ i, name, c, hos, status, loc, init: name.split(' ').map(w => w[0]).join(''), truck: 100 + i * 13 }));

const CUSTOMERS = [
  ['Acme Commerce', 'Dana Whitfield', 'E-commerce', 'Email', 'good'], ['Northline Foods', 'Raj Patel', 'Grocery', 'Phone', 'risk'],
  ['Bayfreight Retail', 'Monica Alvarez', 'Retail', 'Email', 'good'], ['Redwood Supply', 'Tom Becker', 'Building', 'SMS', 'good'],
  ['Coastal Grocers', 'Linh Tran', 'Grocery', 'Email', 'watch'], ['Meridian Pharma', 'Dr. Ellen Park', 'Healthcare', 'Phone', 'good'],
  ['Harbor Home Goods', 'Jake Morales', 'Retail', 'Email', 'good'], ['Summit Electronics', 'Priscilla Ng', 'Electronics', 'Email', 'watch'],
].map(([name, contact, seg, pref, health], i) => {
  const r = rng(i * 31 + 7);
  return { i, name, contact, seg, pref, health, ships: Math.round(40 + r() * 160), ontime: +(91 + r() * 8).toFixed(1), rev: Math.round(60 + r() * 340) * 1000 };
});

const SHIPMENTS = (() => {
  const r = rng(4242);
  const cities = Object.keys(CITY);
  const plan = [...Array(6).fill('unassigned'), ...Array(7).fill('assigned'), ...Array(13).fill('transit'), ...Array(3).fill('delayed'), ...Array(11).fill('delivered')];
  const equips = ['Dry van', 'Reefer', 'Flatbed', 'Dry van', 'Reefer'];
  return plan.map((status, k) => {
    const from = cities[Math.floor(r() * cities.length)];
    let to = cities[Math.floor(r() * cities.length)]; if (to === from) to = cities[(cities.indexOf(from) + 3) % cities.length];
    const h = 6 + Math.floor(r() * 9), m = r() < .5 ? '00' : '30';
    const driver = status === 'unassigned' ? null : DRIVERS[Math.floor(r() * DRIVERS.length)].i;
    return {
      id: 'SF-' + (48140 + k * 7), cust: Math.floor(r() * CUSTOMERS.length), from, to, driver, status,
      progress: status === 'transit' || status === 'delayed' ? .15 + r() * .75 : status === 'delivered' ? 1 : 0,
      pickup: `${String(h).padStart(2, '0')}:${m}`, window: `${h + 3}:00–${h + 5}:00`, eta: `${h + 3}:${String(Math.floor(r() * 60)).padStart(2, '0')}`,
      late: status === 'delayed' ? 20 + Math.floor(r() * 50) : 0, equip: equips[Math.floor(r() * equips.length)],
      weight: Math.round(8 + r() * 34) * 1000, value: Math.round(2 + r() * 14) * 1000, miles: Math.round(18 + r() * 120),
    };
  });
})();
const shipById = (id) => SHIPMENTS.find(s => s.id === id);
// Pin the shipments the rest of the app talks about.
Object.assign(SHIPMENTS[0], { id: 'SF-48305', cust: 0, from: 'Hayward', to: 'San Jose', driver: null, status: 'unassigned' });
Object.assign(SHIPMENTS[13], { id: 'SF-48291', cust: 2, from: 'Fremont', to: 'Sacramento', driver: 1, status: 'transit', progress: .32 });
Object.assign(SHIPMENTS[14], { id: 'SF-48231', cust: 3, from: 'Oakland', to: 'San Jose', driver: 4, status: 'transit', progress: .4 });
Object.assign(SHIPMENTS[26], { id: 'SF-48011', cust: 1, from: 'Stockton', to: 'Oakland', driver: 3, status: 'delayed', late: 45, progress: .6 });
Object.assign(SHIPMENTS[29], { id: 'SF-48613', cust: 4, from: 'Tracy', to: 'Richmond', driver: 6, status: 'delivered' });

window.INBOX = [
  { id: 'q1', agent: 'dispatch', ship: 'SF-48291', who: 'james', age: '12 min', title: 'Move SF-48291 from Emily Chen to Luis Hernandez',
    why: ['Emily has 42 min of drive time left; the delivery needs 1 h 50 min', 'Luis is empty in Hayward, 18 mi closer to the current position', 'Bayfreight’s 14:00–16:00 window is still met with a 35 min buffer'],
    options: [['Luis Hernandez', '14:52', '18 mi', '9.5 h', 94, true], ['Grace Kim', '15:20', '24 mi', '11 h', 81], ['Keep Emily (relay at Tracy)', '16:40', '0 mi', '0.7 h', 42]],
    impact: [['green', 'On time'], ['green', '−6 empty mi'], ['amber', 'Swap at Fremont yard']] },
  { id: 'q2', agent: 'route', ship: 'SF-48231', who: 'sarah', age: '19 min', title: 'Reroute SF-48231 via I-880 S instead of I-680',
    why: ['Lane closure on I-680 S near Sunol; speeds down 38%', 'I-880 S adds 4 mi but saves 22 min at current traffic', 'No low-clearance or hazmat restrictions on the new route'],
    options: [['I-880 S (proposed)', '11:18', '+4 mi', '—', 91, true], ['Stay on I-680 S', '11:40', '0 mi', '—', 58]],
    impact: [['green', '−22 min'], ['amber', '+4 mi'], ['green', 'Window kept']] },
  { id: 'q3', agent: 'exception', ship: 'SF-48613', who: 'priya', age: '26 min', title: 'Reship 3 short pallets to Coastal Grocers',
    why: ['Receiver signed for 21 of 24 pallets; photos confirm shortage', 'The 3 pallets are still at the Tracy cross-dock', 'Coastal Grocers’ SLA requires a fix within 24 h'],
    options: [['Reship tomorrow 07:00 (Diego)', 'Tue 09:30', '—', '—', 88, true], ['Credit $1,860 instead', '—', '—', '—', 61]],
    impact: [['amber', '$480 cost'], ['green', 'SLA met'], ['green', 'Claim avoided']] },
  { id: 'q4', agent: 'customer', ship: 'SF-48011', who: 'priya', age: '41 min', title: 'Offer Northline Foods a $150 credit for a 45 min delay',
    why: ['Second delay for Northline this month; account health is “at risk”', 'Contract allows goodwill credits up to $250 without sales sign-off', 'Raj Patel prefers a phone call for delay notices'],
    options: [['$150 credit + call from Priya', '—', '—', '—', 86, true], ['Apology email only', '—', '—', '—', 54]],
    impact: [['amber', '$150'], ['green', 'Retention risk ↓']] },
  { id: 'q5', agent: 'fleet', ship: 'Unit #142', who: 'kevin', age: '1 h', title: 'Book brake and rotor service for unit #142 ($1,240)',
    why: ['Front pad wear at 22%, rotor scoring flagged by the last inspection', 'Unit #142 is idle Thursday 07:00–12:00', 'Above the $500 autonomous limit, so Kevin approves'],
    options: [['Thu 07:00 · Fremont Fleet Service', 'Thu', '—', '—', 90, true], ['Next week (risk of out-of-service)', '—', '—', '—', 40]],
    impact: [['amber', '$1,240'], ['green', 'Avoids roadside failure']] },
];

window.EXCEPTIONS = [
  { id: 'E-231', ship: 'SF-48613', type: 'Short', sev: 'high', title: '3 pallets short at Coastal Grocers', age: '26 min', fix: 'Reship from Tracy cross-dock tomorrow 07:00 with Diego Ramos. Cost $480.', status: 'Waiting for Priya' },
  { id: 'E-229', ship: 'SF-48011', type: 'Late', sev: 'high', title: '45 min late to Northline Foods', age: '41 min', fix: 'Call Raj Patel, offer a $150 credit, update ETA to 13:15.', status: 'Waiting for Priya' },
  { id: 'E-227', ship: 'SF-48210', type: 'Detention', sev: 'med', title: 'Driver held 52 min at Redwood Supply dock', age: '1 h', fix: 'Bill detention per contract ($75/h after 2 h free). Not yet billable, keep monitoring.', status: 'Monitoring' },
  { id: 'E-226', ship: 'SF-48189', type: 'Damage', sev: 'med', title: 'Crushed corner on 2 cartons (Harbor Home)', age: '1 h', fix: 'Draft claim with receiver photos; notify carrier insurance.', status: 'Claim drafted' },
  { id: 'E-224', ship: 'SF-48168', type: 'Refused', sev: 'high', title: 'Receiver refused delivery: no PO on file', age: '2 h', fix: 'Request PO from Summit Electronics, hold load at San Jose yard overnight.', status: 'Needs owner' },
  { id: 'E-221', ship: 'SF-48154', type: 'Address', sev: 'low', title: 'Missing suite number', age: '2 h', fix: 'Matched suite 210 from the last 3 deliveries. Auto-resolved.', status: 'Auto-resolved', resolved: true },
  { id: 'E-219', ship: 'SF-48147', type: 'Temp', sev: 'med', title: 'Reefer 2.1°F above set point on unit #217', age: '3 h', fix: 'Ask driver to pre-cool and check door seal at next stop; Fleet Agent flagged compressor.', status: 'Driver notified' },
  { id: 'E-216', ship: 'SF-48140', type: 'Late', sev: 'low', title: '12 min late at Meridian Pharma (inside grace)', age: '4 h', fix: 'Inside 15 min grace period. ETA update sent automatically.', status: 'Auto-resolved', resolved: true },
];

const VEHICLES = (() => {
  const r = rng(99);
  const types = ['Reefer', 'Dry van', 'Flatbed', 'Dry van', 'Box truck'];
  return Array.from({ length: 12 }, (_, k) => {
    const unit = [217, 142, 88, 104, 117, 130, 156, 169, 182, 195, 208, 221][k];
    const health = unit === 217 ? 64 : unit === 142 ? 58 : unit === 88 ? 79 : Math.round(82 + r() * 17);
    const status = unit === 142 ? 'shop' : k === 9 ? 'shop' : k === 11 ? 'idle' : 'service';
    return { unit, type: unit === 217 ? 'Reefer' : types[k % 5], driver: DRIVERS[k].name, health, fuel: Math.round(18 + r() * 80), odo: Math.round(120 + r() * 380) * 1000,
      next: ['Thu 07:00', 'Nov 9', 'Nov 12', 'Nov 15', 'Nov 18', 'Nov 21'][k % 6], status,
      alert: unit === 217 ? 'Reefer compressor cycling +38%' : unit === 142 ? 'Brake pads 22%' : unit === 88 ? 'DEF low (9%)' : null };
  });
})();

const ui = {
  shipTab: 'all', shipQ: '', exSel: 'E-231', exTab: 'open', inboxSel: 'q1', fleetTab: 'all', routeSel: 'SF-48231', rerouted: false,
  reportQ: null, notifRead: false, integrations: { tms: true, eld: true, slack: true, motive: false, gmail: true, twilio: true, qb: false, dat: false, p44: false },
};

// ================================================================ small helpers
const fmt$ = (n) => '$' + n.toLocaleString('en-US');
const drv = (i, size = 'sm') => { const d = DRIVERS[i]; return `<span class="avatar ${size}" style="background:${d.c}" title="${d.name}">${d.init}</span>`; };
const STATUS = { unassigned: ['gray', 'Unassigned'], assigned: ['accent', 'Assigned'], transit: ['green', 'In transit'], delayed: ['amber', 'Delayed'], delivered: ['gray', 'Delivered'] };
const statusPillS = (s) => `<span class="pill ${STATUS[s][0]}">${STATUS[s][1]}</span>`;

function spark(arr, color = 'var(--accent)', w = 96, h = 30) {
  const mn = Math.min(...arr), mx = Math.max(...arr), sx = w / (arr.length - 1);
  const pts = arr.map((v, i) => `${(i * sx).toFixed(1)},${(h - 3 - ((v - mn) / (mx - mn || 1)) * (h - 6)).toFixed(1)}`);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="spark"><polyline fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" points="${pts.join(' ')}"/></svg>`;
}
const series = (seed, n, base, amp) => { const r = rng(seed); return Array.from({ length: n }, (_, i) => +(base + Math.sin(i / 3) * amp * .4 + (r() - .5) * amp).toFixed(1)); };

function kpi(label, value, sub, cls = '', sp = '') {
  return `<div class="card kpi"><div class="between"><span class="label">${label}</span>${sp}</div>
    <div class="kv num ${cls}">${value}</div><div class="ks">${sub}</div></div>`;
}

function lineChart(data, { w = 640, h = 180, min, max, target, color = 'var(--accent)', labels = [] } = {}) {
  const mn = min ?? Math.min(...data), mx = max ?? Math.max(...data), sx = w / (data.length - 1);
  const y = (v) => h - 8 - ((v - mn) / (mx - mn)) * (h - 16);
  const pts = data.map((v, i) => [i * sx, y(v)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return `<svg viewBox="0 0 ${w} ${h + 18}" class="lchart" preserveAspectRatio="none">
    <defs><linearGradient id="lg${w}${h}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6d63ff" stop-opacity=".22"/><stop offset="1" stop-color="#6d63ff" stop-opacity="0"/></linearGradient></defs>
    ${[0, .5, 1].map(f => `<line x1="0" x2="${w}" y1="${8 + f * (h - 16)}" y2="${8 + f * (h - 16)}" stroke="#ececea"/>`).join('')}
    ${target != null ? `<line x1="0" x2="${w}" y1="${y(target)}" y2="${y(target)}" stroke="#e08a00" stroke-dasharray="4 4"/><text x="4" y="${y(target) + 13}" class="ct">Target ${target}%</text>` : ''}
    <path d="${d} L ${w} ${h} L 0 ${h} Z" fill="url(#lg${w}${h})"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="${pts.at(-1)[0]}" cy="${pts.at(-1)[1]}" r="4" fill="${color}" stroke="#fff" stroke-width="2"/>
    ${labels.map(([i, t]) => `<text x="${Math.min(Math.max(i * sx, 14), w - 14)}" y="${h + 14}" text-anchor="middle" class="ct">${t}</text>`).join('')}
  </svg>`;
}

function donut(parts, size = 120, stroke = 14) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, total = parts.reduce((a, p) => a + p[0], 0);
  let off = 0;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#eeeeec" stroke-width="${stroke}"/>
    ${parts.map(([v, col]) => { const len = (v / total) * c; const s = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="${stroke}" stroke-dasharray="${len - 2} ${c - len + 2}" stroke-dashoffset="${-off}" stroke-linecap="butt"/>`; off += len; return s; }).join('')}
  </svg>`;
}

function ring(v, size = 44) {
  const col = v >= 85 ? 'var(--green)' : v >= 70 ? 'var(--amber)' : 'var(--red)';
  return `<span class="ring" style="width:${size}px;height:${size}px">${donut([[v, col], [100 - v, 'transparent']], size, 5)}<b>${v}</b></span>`;
}

// ================================================================ map
const ROUTES = [
  { ship: 'SF-48231', driver: 4, via: ['Oakland', 'Hayward', 'Livermore', 'San Jose'], alt: ['Oakland', 'Hayward', 'Fremont', 'San Jose'], eta: '11:40', status: 'reroute', dur: 26 },
  { ship: 'SF-48291', driver: 1, via: ['Fremont', 'Livermore', 'Tracy', 'Stockton', 'Sacramento'], eta: '16:40', status: 'risk', dur: 34 },
  { ship: 'SF-48011', driver: 3, via: ['Stockton', 'Tracy', 'Livermore', 'Hayward', 'Oakland'], eta: '13:15', status: 'late', dur: 30 },
  { ship: 'SF-48168', driver: 9, via: ['Sacramento', 'Vallejo', 'Richmond'], eta: '12:05', status: 'ok', dur: 22 },
  { ship: 'SF-48196', driver: 6, via: ['Tracy', 'Modesto'], eta: '10:55', status: 'ok', dur: 16 },
  { ship: 'SF-48203', driver: 2, via: ['Richmond', 'Oakland', 'Hayward', 'Fremont'], eta: '11:10', status: 'ok', dur: 24 },
  { ship: 'SF-48217', driver: 7, via: ['Santa Rosa', 'Vallejo', 'Sacramento'], eta: '12:30', status: 'ok', dur: 28 },
  { ship: 'SF-48224', driver: 5, via: ['San Jose', 'Salinas'], eta: '11:50', status: 'ok', dur: 20 },
];
const pathOf = (cities) => cities.map((c, i) => (i ? 'L' : 'M') + CITY[c].join(' ')).join(' ');
const RCOL = { ok: '#0e0e10', reroute: '#4f46e5', risk: '#e08a00', late: '#e5383b' };

function mapSVG({ small = false, sel = null } = {}) {
  const routes = ROUTES.map(r => ({ ...r, status: ui.rerouted && r.status === 'reroute' ? 'ok' : r.status, path: pathOf(r.ship === 'SF-48231' && ui.rerouted ? r.alt : r.via) }));
  return `<svg viewBox="0 0 800 540" class="map ${small ? 'small' : ''}" role="img" aria-label="Live map of active routes">
    <rect width="800" height="540" fill="#f3f3ef"/>
    <path d="M0 0 H118 C108 96 150 178 192 262 C232 340 282 424 300 540 H0 Z" fill="#dfe7ee"/>
    <path d="M176 118 C226 146 214 198 244 238 C276 282 330 334 390 404 C366 414 330 384 300 352 C258 310 222 272 200 232 C180 192 150 160 176 118 Z" fill="#dfe7ee"/>
    <path d="M232 168 C262 150 286 132 312 128 C330 130 320 146 296 156 C276 164 254 176 232 168 Z" fill="#dfe7ee"/>
    <g stroke="#e2e2dc" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${pathOf(['Santa Rosa', 'Vallejo', 'Sacramento'])}"/><path d="${pathOf(['Richmond', 'Oakland', 'Hayward', 'Fremont', 'San Jose', 'Salinas'])}"/>
      <path d="${pathOf(['Oakland', 'Livermore', 'Tracy', 'Stockton', 'Sacramento'])}"/><path d="${pathOf(['Tracy', 'Modesto'])}"/>
      <path d="${pathOf(['Hayward', 'Livermore', 'San Jose'])}"/><path d="${pathOf(['Vallejo', 'Richmond'])}"/>
    </g>
    ${ui.rerouted ? '' : `<path d="${pathOf(ROUTES[0].alt)}" fill="none" stroke="#4f46e5" stroke-width="3" stroke-dasharray="6 6" opacity=".55"/>`}
    ${routes.map(r => `<path d="${r.path}" fill="none" stroke="${RCOL[r.status]}" stroke-width="${sel === r.ship ? 4.5 : 2.5}" stroke-linejoin="round" stroke-linecap="round" opacity="${sel && sel !== r.ship ? .25 : .9}" data-route="${r.ship}" class="rpath"/>`).join('')}
    ${Object.entries(CITY).map(([n, [x, y]]) => `<g><circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#9a9aa2" stroke-width="1.5"/>${small ? '' : `<text x="${x + 8}" y="${y - 7}" class="city">${n}</text>`}</g>`).join('')}
    ${routes.map(r => `<g class="truck" opacity="${sel && sel !== r.ship ? .35 : 1}"><circle r="${small ? 6 : 8}" fill="${RCOL[r.status]}" stroke="#fff" stroke-width="2.5">
      <animateMotion dur="${r.dur}s" repeatCount="indefinite" path="${r.path}" rotate="0"/></circle></g>`).join('')}
  </svg>`;
}

// ================================================================ views
const V = {};

V.overview = () => {
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const counts = Object.keys(STATUS).map(k => [k, SHIPMENTS.filter(s => s.status === k).length]);
  const total = SHIPMENTS.length;
  const cols = { unassigned: '#c9c9cf', assigned: '#a59fff', transit: '#12a150', delayed: '#e08a00', delivered: '#0e0e10' };
  const fleetParts = [[79, 'var(--green)'], [4, 'var(--amber)'], [3, '#c9c9cf']];
  return `${topbar({
    crumb: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }), title: `${hello}, Alex`,
    actions: `${searchBox()}<button class="btn dark" type="button" data-act="new-ship">${icon('plus', 14, 2.4)}New shipment</button>`,
  })}
  ${pausedBanner()}
  <div class="kpi-row">
    ${kpi('Active shipments', '214', '<b class="up">+12</b> vs last Monday', '', spark(series(1, 14, 200, 30)))}
    ${kpi('On-time delivery', '96.1%', '<b class="up">+1.4 pts</b> this week', 'green', spark(series(2, 14, 95, 2), 'var(--green)'))}
    ${kpi('Open exceptions', String(EXCEPTIONS.filter(x => !x.resolved).length), '<b class="down">2 high</b> severity', 'amber', spark(series(3, 14, 22, 8), 'var(--amber)'))}
    ${kpi('Revenue today', '$182.4K', '<b class="up">+8.2%</b> vs avg', '', spark(series(4, 14, 170, 20), 'var(--ink)'))}
  </div>
  <div class="ov-grid">
    <div class="card pad0">
      <div class="between pad"><div><h3 class="h3">Live network</h3><p class="sub">${ROUTES.length} tracked routes · 1 reroute proposed · 1 running late</p></div>
        <a class="btn" href="#/routes">${icon('map', 14)}Open map</a></div>
      <div class="map-wrap">${mapSVG({ small: true })}</div>
    </div>
    <div class="card">
      <div class="between"><h3 class="h3">Needs your decision</h3><a class="link" href="#/inbox">All ${INBOX.length}</a></div>
      <div class="dlist">${INBOX.length ? INBOX.slice(0, 3).map(q => { const a = agentById(q.agent); return `<div class="ditem">
        <span class="ic-sq">${icon(a.ic, 13, 2)}</span><div class="grow"><b>${q.title}</b><small>${a.name} · ${q.age} ago · ${PEOPLE[q.who].name.split(' ')[0]} approves</small>
        <div class="row" style="gap:6px;margin-top:8px"><button class="btn sm accent" type="button" data-act="approve" data-id="${q.id}">Approve</button><a class="btn sm" href="#/inbox/${q.id}">Review</a></div></div></div>`; }).join('')
        : `<div class="empty-mini">${icon('check', 18, 2.4)}<b>All caught up</b><span>Agents will ask when they need you.</span></div>`}</div>
    </div>
  </div>
  <div class="ov-grid3">
    <div class="card">
      <div class="between"><h3 class="h3">Shipments today</h3><a class="link" href="#/shipments">View all</a></div>
      <div class="kv num" style="margin:10px 0 12px">${total}<span class="sub" style="font-size:12px;margin-left:6px">loads scheduled</span></div>
      <div class="stack">${counts.map(([k, n]) => `<i style="flex:${n};background:${cols[k]}" title="${STATUS[k][1]}: ${n}"></i>`).join('')}</div>
      <div class="legend-list">${counts.map(([k, n]) => `<a href="#/shipments" data-act="ship-tab" data-tab="${k}"><i style="background:${cols[k]}"></i>${STATUS[k][1]}<b class="num">${n}</b></a>`).join('')}</div>
    </div>
    <div class="card">
      <div class="between"><h3 class="h3">Agent activity</h3><a class="link" href="#/activity">Log</a></div>
      <div class="feed">${LOG.slice(0, 6).map(r => { const a = agentById(r[1]); return `<div class="fi"><span class="ic-sq sm">${icon(a.ic, 11, 2.2)}</span>
        <div class="grow"><b>${r[2]}</b> <span class="muted">· ${r[3]}</span><small>${a.name} · ${r[0]}</small></div><span class="dot-s ${r[6][0]}"></span></div>`; }).join('')}</div>
    </div>
    <div class="card">
      <div class="between"><h3 class="h3">Fleet health</h3><a class="link" href="#/fleet">Fleet</a></div>
      <div class="donut-wrap">${donut(fleetParts, 132, 14)}<div class="donut-c"><b class="num">86</b><span>vehicles</span></div></div>
      <div class="legend-list">${[['In service', 79, 'var(--green)'], ['In shop', 4, 'var(--amber)'], ['Idle', 3, '#c9c9cf']].map(([l, n, c]) => `<span><i style="background:${c}"></i>${l}<b class="num">${n}</b></span>`).join('')}</div>
      <div class="alert-line">${icon('alert', 13, 2)}7 health alerts · 2 need booking</div>
    </div>
  </div>`;
};

// ---------------------------------------------------------------- inbox
V.inbox = (sub) => {
  if (sub && INBOX.some(q => q.id === sub)) ui.inboxSel = sub;
  if (!INBOX.some(q => q.id === ui.inboxSel)) ui.inboxSel = INBOX[0]?.id;
  const q = INBOX.find(x => x.id === ui.inboxSel);
  const a = q && agentById(q.agent);
  return `${topbar({ crumb: 'AI agents / Approvals', title: 'Approvals',
    actions: `<span class="sub" style="margin-right:6px">${INBOX.length} waiting · avg response 14 min</span>
      ${INBOX.length > 1 ? `<button class="btn" type="button" data-act="approve-all">${icon('check', 14, 2.4)}Approve all recommended</button>` : ''}` })}
  ${pausedBanner()}
  ${!q ? `<div class="card empty-big">${icon('check', 28, 2.2)}<h3>Inbox zero</h3><p>Every decision is made. Agents will ask here when something needs a person.</p><a class="btn" href="#/activity">See what they did</a></div>` : `
  <div class="inbox">
    <div class="qlist">${INBOX.map(x => { const ag = agentById(x.agent); return `<a href="#/inbox/${x.id}" class="qi ${x.id === q.id ? 'on' : ''}">
      <span class="ic-sq">${icon(ag.ic, 13, 2)}</span><div class="grow"><b>${x.title}</b><small>${ag.name} · ${x.ship}</small></div>
      <div class="qmeta"><span class="muted">${x.age}</span>${av(x.who, 'sm')}</div></a>`; }).join('')}</div>
    <div class="card white qdetail">
      <div class="row" style="gap:8px"><span class="pill accent">${a.name}</span><span class="pill gray plain">${q.ship}</span><span class="muted" style="margin-left:auto;font-size:12px">${q.age} ago</span></div>
      <h2 class="qt">${q.title}</h2>
      <div class="impact-row">${q.impact.map(([c, t]) => `<span class="pill ${c}">${t}</span>`).join('')}</div>
      <div class="qsec"><div class="label">Why the agent suggests this</div><ul class="why">${q.why.map(w => `<li>${icon('check', 13, 2.4)}${w}</li>`).join('')}</ul></div>
      <div class="qsec"><div class="label">Options considered</div>
        <div class="opts">${q.options.map(o => `<div class="opt ${o[5] ? 'best' : ''}"><div class="grow"><b>${o[0]}</b>${o[5] ? '<span class="pill accent plain">Recommended</span>' : ''}
          <small>${[o[1] !== '—' ? 'ETA ' + o[1] : '', o[2] !== '—' ? o[2] : '', o[3] !== '—' ? 'HOS ' + o[3] : ''].filter(Boolean).join(' · ') || '&nbsp;'}</small></div>
          <div class="score"><div class="bar"><i style="width:${o[4]}%"></i></div><span class="num">${o[4]}</span></div></div>`).join('')}</div></div>
      <div class="qsec"><div class="label">Override reason (required by policy)</div><textarea class="input" id="ov-reason" placeholder="Optional when approving. Required when overriding."></textarea></div>
      <div class="qact"><span class="note">${icon('shield', 13)}Approver: ${PEOPLE[q.who].name} · you can act as admin</span>
        <button class="btn" type="button" data-act="override" data-id="${q.id}">Override</button>
        <button class="btn accent" type="button" data-act="approve" data-id="${q.id}">${icon('check', 13, 2.4)}Approve</button></div>
    </div>
  </div>`}`;
};

// ---------------------------------------------------------------- shipments
function shipRows() {
  const q = ui.shipQ.toLowerCase();
  const list = SHIPMENTS.filter(s => (ui.shipTab === 'all' || s.status === ui.shipTab) &&
    (!q || `${s.id} ${CUSTOMERS[s.cust].name} ${s.from} ${s.to} ${s.driver != null ? DRIVERS[s.driver].name : ''}`.toLowerCase().includes(q)));
  if (!list.length) return '<tr><td colspan="8" class="empty">No shipments match.</td></tr>';
  return list.map(s => `<tr data-act="ship" data-id="${s.id}" class="click">
    <td><b class="mono">${s.id}</b></td><td>${CUSTOMERS[s.cust].name}</td>
    <td><span class="lane">${s.from}${icon('arrow', 12)}${s.to}</span><small class="muted">${s.miles} mi · ${s.equip}</small></td>
    <td class="num">${s.pickup}</td><td class="num">${s.window}</td>
    <td>${s.driver != null ? `<span class="who">${drv(s.driver)}${DRIVERS[s.driver].name}</span>` : '<span class="pill amber plain">AI suggests Luis</span>'}</td>
    <td>${statusPillS(s.status)}${s.late ? `<small class="late">+${s.late} min</small>` : ''}</td>
    <td style="min-width:110px"><div class="prog ${s.status}"><i style="width:${Math.round(s.progress * 100)}%"></i></div><small class="muted num">${s.status === 'delivered' ? 'Delivered' : s.status === 'unassigned' || s.status === 'assigned' ? 'Pickup ' + s.pickup : 'ETA ' + s.eta}</small></td>
  </tr>`).join('');
}
V.shipments = () => {
  const tabs = [['all', 'All', SHIPMENTS.length], ...Object.keys(STATUS).map(k => [k, STATUS[k][1], SHIPMENTS.filter(s => s.status === k).length])];
  return `${topbar({ crumb: 'Operations / Shipments', title: 'Shipments',
    actions: `<label class="search">${icon('search', 14)}<input id="ship-q" placeholder="Search ID, customer, city…" value="${esc(ui.shipQ)}" aria-label="Search shipments"></label>
      <button class="btn" type="button" data-act="ship-csv">${icon('download', 14)}Export</button>
      <button class="btn dark" type="button" data-act="new-ship">${icon('plus', 14, 2.4)}New shipment</button>` })}
  ${pausedBanner()}
  <div class="tabs">${tabs.map(([k, l, n]) => `<button type="button" class="${ui.shipTab === k ? 'on' : ''}" data-act="ship-tab" data-tab="${k}">${l}<span>${n}</span></button>`).join('')}</div>
  <div class="table-wrap"><table>
    <thead><tr><th>Shipment</th><th>Customer</th><th>Lane</th><th>Pickup</th><th>Window</th><th>Driver</th><th>Status</th><th>Progress</th></tr></thead>
    <tbody id="ship-body">${shipRows()}</tbody></table></div>`;
};

function shipDrawer(id) {
  const s = shipById(id); if (!s) return;
  const c = CUSTOMERS[s.cust];
  const steps = [
    ['Created from EDI 204', 'Customer Agent', '06:12', true],
    ['Driver assigned', s.driver != null ? `Dispatch Agent · approved by James` : 'Waiting for Dispatch Agent', '06:40', s.driver != null],
    ['Picked up', s.driver != null ? DRIVERS[s.driver].name : '', s.pickup, ['transit', 'delayed', 'delivered'].includes(s.status)],
    ['ETA update sent', 'Customer Agent · auto', s.eta, ['transit', 'delayed', 'delivered'].includes(s.status)],
    ['Delivered', 'POD captured', s.eta, s.status === 'delivered'],
  ];
  openDrawer(`
    <div class="dh"><div><div class="crumb">Shipment</div><h3>${s.id}</h3></div>${statusPillS(s.status)}
      <button class="close" type="button" data-close aria-label="Close">${icon('x', 16)}</button></div>
    <div class="db">
      <div class="route-card"><div><span class="label">From</span><b>${s.from}</b><small>Pickup ${s.pickup}</small></div>${icon('arrow', 16)}<div><span class="label">To</span><b>${s.to}</b><small>Window ${s.window}</small></div></div>
      <div class="prog big ${s.status}"><i style="width:${Math.round(s.progress * 100)}%"></i></div>
      ${s.late ? `<div class="paused-banner" style="margin:0">${icon('alert', 14, 2)}Running ${s.late} min late. Exception Agent opened a case and Customer Agent drafted a notice.</div>` : ''}
      <div class="kvgrid">
        <div><span class="label">Customer</span><b>${c.name}</b></div><div><span class="label">Driver</span><b>${s.driver != null ? DRIVERS[s.driver].name : '—'}</b></div>
        <div><span class="label">Equipment</span><b>${s.equip}</b></div><div><span class="label">Weight</span><b>${s.weight.toLocaleString()} lb</b></div>
        <div><span class="label">Distance</span><b>${s.miles} mi</b></div><div><span class="label">Load value</span><b>${fmt$(s.value)}</b></div>
      </div>
      ${s.status === 'unassigned' ? `<div class="suggest">${icon('sparkles', 15)}<div class="grow"><b>Dispatch Agent suggests Luis Hernandez</b><small>94% match · 6 mi away · 9.5 h HOS left</small></div><button class="btn sm accent" type="button" data-act="assign" data-id="${s.id}">Assign</button></div>` : ''}
      <div><div class="label" style="margin-bottom:8px">Timeline</div>
        <ol class="timeline">${steps.map(([t, by, time, done]) => `<li class="${done ? 'done' : ''}"><i></i><div class="grow"><b>${t}</b><small>${by}</small></div><span class="muted num">${done ? time : ''}</span></li>`).join('')}</ol></div>
    </div>
    <div class="df"><a class="btn" href="#/customers">${icon('users', 13)}Customer</a><a class="btn" href="#/routes">${icon('map', 13)}Track</a><button class="btn dark" type="button" data-act="msg-cust" data-id="${s.id}">${icon('msg', 13)}Message customer</button></div>`);
}

// ---------------------------------------------------------------- dispatch board
V.dispatch = () => {
  const cols = [['unassigned', 'Unassigned'], ['assigned', 'Assigned'], ['transit', 'In transit'], ['delivered', 'Delivered']];
  const of = (k) => SHIPMENTS.filter(s => k === 'transit' ? s.status === 'transit' || s.status === 'delayed' : s.status === k);
  return `${topbar({ crumb: 'Operations / Dispatch', title: 'Dispatch board',
    actions: `<span class="pill green">${icon('sparkles', 11)} Dispatch Agent · Approve first</span>
      <button class="btn" type="button" data-act="auto-assign">${icon('bolt', 14)}Assign all suggested</button>
      <button class="btn dark" type="button" data-act="new-ship">${icon('plus', 14, 2.4)}New shipment</button>` })}
  ${pausedBanner()}
  <div class="board-wrap">
    <div class="board">${cols.map(([k, l]) => { const items = of(k); return `<div class="col" data-col="${k}">
      <div class="col-h"><b>${l}</b><span class="count">${items.length}</span></div>
      <div class="col-b">${items.slice(0, k === 'unassigned' ? 20 : 6).map(s => `<div class="tcard" draggable="true" data-ship="${s.id}" data-act="ship" data-id="${s.id}">
        <div class="between"><b class="mono">${s.id}</b>${s.late ? `<span class="pill amber plain">+${s.late}m</span>` : `<span class="muted num">${s.pickup}</span>`}</div>
        <div class="lane">${s.from}${icon('arrow', 11)}${s.to}</div>
        <small class="muted">${CUSTOMERS[s.cust].name} · ${s.equip}</small>
        ${s.driver != null ? `<div class="row" style="gap:6px;margin-top:8px">${drv(s.driver)}<span>${DRIVERS[s.driver].name}</span></div>`
          : `<div class="suggest sm">${icon('sparkles', 12)}<span class="grow">Luis · 94% match</span><button class="btn xs accent" type="button" data-act="assign" data-id="${s.id}">Assign</button></div>`}
        ${k === 'transit' ? `<div class="prog ${s.status}" style="margin-top:8px"><i style="width:${Math.round(s.progress * 100)}%"></i></div>` : ''}
      </div>`).join('')}${k !== 'unassigned' && items.length > 6 ? `<a class="link" href="#/shipments" data-act="ship-tab" data-tab="${k}" style="padding:6px">+${items.length - 6} more</a>` : ''}</div></div>`; }).join('')}</div>
    <aside class="card drivers"><div class="between"><h3 class="h3">Drivers</h3><span class="sub">${DRIVERS.filter(d => d.status === 'available').length} available</span></div>
      ${DRIVERS.map(d => `<div class="drow">${drv(d.i, '')}<div class="grow"><b>${d.name}</b><small>${d.loc} · Truck #${d.truck}</small>
        <div class="hos"><i style="width:${(d.hos / 11) * 100}%" class="${d.hos < 1.5 ? 'low' : d.hos < 4 ? 'mid' : ''}"></i></div></div>
        <div class="dright"><span class="pill ${d.status === 'available' ? 'green' : d.status === 'driving' ? 'accent' : 'gray'} plain">${d.status}</span><small class="num">${d.hos}h HOS</small></div></div>`).join('')}
    </aside>
  </div>`;
};

// ---------------------------------------------------------------- routes
V.routes = () => {
  const r0 = ROUTES.find(r => r.ship === ui.routeSel) || ROUTES[0];
  return `${topbar({ crumb: 'Operations / Live routes', title: 'Live routes',
    actions: `<div class="legend"><span><i style="background:#0e0e10"></i>On time</span><span><i style="background:#4f46e5"></i>Reroute proposed</span><span><i style="background:#e08a00"></i>At risk</span><span><i style="background:#e5383b"></i>Late</span></div>` })}
  ${pausedBanner()}
  <div class="routes">
    <div class="card pad0 map-card">${mapSVG({ sel: ui.routeSel })}
      ${!ui.rerouted ? `<div class="map-pop">${icon('route', 15, 2)}<div class="grow"><b>Route Agent: reroute SF-48231 via I-880 S</b><small>I-680 lane closure near Sunol · saves 22 min · +4 mi</small></div>
        <button class="btn sm" type="button" data-act="route-sel" data-id="SF-48231">Show</button><button class="btn sm accent" type="button" data-act="reroute">Approve</button></div>` : ''}
    </div>
    <aside class="card rlist"><h3 class="h3" style="margin-bottom:6px">Active routes</h3>
      ${ROUTES.map(r => { const s = shipById(r.ship); const st = { ok: ['green', 'On time'], reroute: ['accent', 'Reroute proposed'], risk: ['amber', 'HOS risk'], late: ['red', 'Late'] }[ui.rerouted && r.status === 'reroute' ? 'ok' : r.status];
        return `<button type="button" class="ri ${r.ship === ui.routeSel ? 'on' : ''}" data-act="route-sel" data-id="${r.ship}">${drv(r.driver)}
        <div class="grow"><b>${r.ship}</b><small>${r.via[0]} → ${r.via.at(-1)} · ${DRIVERS[r.driver].name}</small></div>
        <div class="dright"><span class="pill ${st[0]} plain">${st[1]}</span><small class="num">ETA ${r.eta}</small></div></button>`; }).join('')}
      <div class="sel-detail"><div class="label">Selected</div><b>${r0.ship} · ${(s => s ? CUSTOMERS[s.cust].name : 'Customer')(shipById(r0.ship))}</b>
        <small>${(ui.rerouted && r0.ship === 'SF-48231' ? r0.alt : r0.via).join(' → ')}</small>
        <div class="row" style="gap:6px;margin-top:10px"><button class="btn sm" type="button" data-act="ship" data-id="${r0.ship}">Shipment</button><button class="btn sm" type="button" data-act="call" data-id="${r0.driver}">${icon('phone', 12)}Call driver</button></div></div>
    </aside>
  </div>`;
};

// ---------------------------------------------------------------- exceptions
V.exceptions = () => {
  const list = EXCEPTIONS.filter(x => ui.exTab === 'all' || (ui.exTab === 'open' ? !x.resolved : x.resolved));
  if (!list.some(x => x.id === ui.exSel)) ui.exSel = list[0]?.id;
  const x = EXCEPTIONS.find(e => e.id === ui.exSel);
  const open = EXCEPTIONS.filter(e => !e.resolved);
  const sevCol = { high: 'red', med: 'amber', low: 'gray' };
  return `${topbar({ crumb: 'Operations / Exceptions', title: 'Exceptions', actions: searchBox('Search exceptions…') })}
  ${pausedBanner()}
  <div class="kpi-row">
    ${kpi('Open', String(open.length), `${open.filter(e => e.sev === 'high').length} high severity`, 'amber')}
    ${kpi('Auto-resolved today', String(31 + EXCEPTIONS.filter(e => e.resolved).length - 2), 'by Exception Agent', 'green')}
    ${kpi('Avg time to resolve', '18 min', '<b class="up">−9 min</b> vs last month')}
    ${kpi('Customers affected', '5', '2 notified by phone')}
  </div>
  <div class="tabs">${[['open', 'Open', open.length], ['resolved', 'Resolved', EXCEPTIONS.length - open.length], ['all', 'All', EXCEPTIONS.length]].map(([k, l, n]) => `<button type="button" class="${ui.exTab === k ? 'on' : ''}" data-act="ex-tab" data-tab="${k}">${l}<span>${n}</span></button>`).join('')}</div>
  <div class="ex">
    <div class="exlist">${list.map(e => `<button type="button" class="exi ${e.id === ui.exSel ? 'on' : ''}" data-act="ex-sel" data-id="${e.id}">
      <span class="sev ${sevCol[e.sev]}"></span><div class="grow"><b>${e.title}</b><small>${e.id} · ${e.ship} · ${e.age} ago</small></div>
      <span class="pill gray plain">${e.type}</span></button>`).join('') || '<div class="empty">Nothing here.</div>'}</div>
    ${x ? `<div class="card white exd">
      <div class="row" style="gap:8px"><span class="pill ${sevCol[x.sev]}">${x.sev === 'med' ? 'Medium' : x.sev[0].toUpperCase() + x.sev.slice(1)} severity</span><span class="pill gray plain">${x.type}</span><span class="muted" style="margin-left:auto;font-size:12px">${x.id}</span></div>
      <h2 class="qt">${x.title}</h2>
      <div class="kvgrid"><div><span class="label">Shipment</span><b><a class="link" href="#" data-act="ship" data-id="${x.ship}">${x.ship}</a></b></div><div><span class="label">Opened</span><b>${x.age} ago</b></div><div><span class="label">Status</span><b>${x.resolved ? 'Resolved' : x.status}</b></div><div><span class="label">Owner</span><b>Exception Agent</b></div></div>
      <div class="fix">${icon('sparkles', 15)}<div><div class="label">Prepared fix</div><p>${x.fix}</p></div></div>
      <div class="label" style="margin:4px 0 8px">Evidence</div>
      <div class="evidence"><span>${icon('doc', 13)}POD scan</span><span>${icon('pin', 13)}GPS trail</span><span>${icon('msg', 13)}Driver note</span><span>${icon('eye', 13)}2 photos</span></div>
      <div class="qact">${x.resolved ? `<span class="note">${icon('check', 13, 2.4)}Resolved and logged</span><button class="btn" type="button" data-act="ex-reopen" data-id="${x.id}">Reopen</button>`
        : `<span class="note">${icon('shield', 13)}Logged to the audit trail</span><button class="btn" type="button" data-act="ex-escalate" data-id="${x.id}">Escalate</button><button class="btn accent" type="button" data-act="ex-resolve" data-id="${x.id}">${icon('check', 13, 2.4)}Approve fix</button>`}</div>
    </div>` : ''}
  </div>`;
};

// ---------------------------------------------------------------- customers
V.customers = () => `${topbar({ crumb: 'CRM / Customers', title: 'Customers',
  actions: `${searchBox('Search customers…')}<button class="btn dark" type="button" data-act="toast" data-msg="Customer invite sent">${icon('plus', 14, 2.4)}Add customer</button>` })}
  ${pausedBanner()}
  <div class="kpi-row">
    ${kpi('Active accounts', '48', '<b class="up">+3</b> this quarter')}
    ${kpi('Avg on-time', '95.8%', 'across all customers', 'green')}
    ${kpi('Revenue · 30 days', '$1.84M', '<b class="up">+6.1%</b> MoM')}
    ${kpi('At risk', '2', 'Northline Foods, Coastal Grocers', 'amber')}
  </div>
  <div class="table-wrap"><table>
    <thead><tr><th>Customer</th><th>Segment</th><th>Shipments · 30d</th><th>On-time</th><th>Revenue · 30d</th><th>Health</th><th>Prefers</th></tr></thead>
    <tbody>${CUSTOMERS.map(c => `<tr class="click" data-act="cust" data-id="${c.i}">
      <td><div class="row" style="gap:10px"><span class="logo-sq">${c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span><div><b>${c.name}</b><small class="muted" style="display:block">${c.contact}</small></div></div></td>
      <td>${c.seg}</td><td class="num">${c.ships}</td>
      <td><div class="row" style="gap:8px"><div class="prog" style="width:70px"><i style="width:${(c.ontime - 85) / 15 * 100}%"></i></div><span class="num">${c.ontime}%</span></div></td>
      <td class="num">${fmt$(c.rev)}</td>
      <td>${{ good: '<span class="pill green">Healthy</span>', watch: '<span class="pill amber">Watch</span>', risk: '<span class="pill red">At risk</span>' }[c.health]}</td>
      <td>${c.pref}</td></tr>`).join('')}</tbody></table></div>`;

function custDrawer(i) {
  const c = CUSTOMERS[i];
  const ships = SHIPMENTS.filter(s => s.cust === c.i).slice(0, 4);
  const thread = [
    ['them', c.contact, '08:12', `Morning! Can you confirm tomorrow's ${c.seg === 'Grocery' ? 'reefer' : 'dry van'} pickup is still 07:30?`],
    ['agent', 'Customer Agent', '08:12', `Yes, confirmed for 07:30 at your dock 4. Driver and truck details will follow by 06:30 tomorrow.`],
    ['them', c.contact, '09:40', 'Great. Also, any update on the order going out today?'],
    ['agent', 'Customer Agent', '09:41', `It's on its way with an ETA of 11:42, inside your 10:00–12:00 window. I'll ping you if that changes.`],
  ];
  openDrawer(`
    <div class="dh"><div class="row" style="gap:10px"><span class="logo-sq lg">${c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span><div><div class="crumb">${c.seg}</div><h3>${c.name}</h3></div></div>
      <button class="close" type="button" data-close aria-label="Close">${icon('x', 16)}</button></div>
    <div class="db">
      <div class="kvgrid"><div><span class="label">Contact</span><b>${c.contact}</b></div><div><span class="label">Prefers</span><b>${c.pref}</b></div>
        <div><span class="label">On-time · 30d</span><b>${c.ontime}%</b></div><div><span class="label">Revenue · 30d</span><b>${fmt$(c.rev)}</b></div></div>
      <div><div class="label" style="margin-bottom:8px">Conversation</div>
        <div class="thread">${thread.map(([k, who, t, m]) => `<div class="msg ${k}"><div class="mh2">${k === 'agent' ? icon('sparkles', 11) : ''}<b>${who}</b><span>${t}</span></div><p>${m}</p></div>`).join('')}</div>
        <div class="composer"><input class="text" id="cmsg" placeholder="Reply as Alex, or let Customer Agent draft…"><button class="btn sm" type="button" data-act="draft-reply">${icon('sparkles', 12)}Draft</button><button class="btn sm dark" type="button" data-act="send-reply">Send</button></div></div>
      <div><div class="label" style="margin-bottom:8px">Recent shipments</div>${ships.map(s => `<div class="mini-ship" data-act="ship" data-id="${s.id}"><b class="mono">${s.id}</b><span class="grow">${s.from} → ${s.to}</span>${statusPillS(s.status)}</div>`).join('') || '<span class="muted">None this week</span>'}</div>
    </div>`);
}

// ---------------------------------------------------------------- fleet
V.fleet = () => {
  const list = VEHICLES.filter(v => ui.fleetTab === 'all' || (ui.fleetTab === 'alerts' ? v.alert : ui.fleetTab === 'shop' ? v.status === 'shop' : v.type === 'Reefer'));
  return `${topbar({ crumb: 'Assets / Fleet', title: 'Fleet', actions: `${searchBox('Search unit, driver…')}<button class="btn" type="button" data-act="toast" data-msg="Maintenance report sent to Kevin">${icon('doc', 14)}Maintenance report</button>` })}
  ${pausedBanner()}
  <div class="kpi-row">
    ${kpi('Vehicles', '86', '79 in service', '', spark(series(8, 14, 80, 4), 'var(--ink)'))}
    ${kpi('Avg health', '91', '<b class="up">+2</b> vs last month', 'green')}
    ${kpi('Health alerts', '7', '2 need booking', 'amber')}
    ${kpi('Fuel · MPG', '7.4', '<b class="up">+0.3</b> after route tuning')}
  </div>
  <div class="tabs">${[['all', 'All'], ['alerts', 'With alerts'], ['shop', 'In shop'], ['reefer', 'Reefers']].map(([k, l]) => `<button type="button" class="${ui.fleetTab === k ? 'on' : ''}" data-act="fleet-tab" data-tab="${k}">${l}</button>`).join('')}</div>
  <div class="fleet">
    <div class="vgrid">${list.map(v => `<div class="vcard ${v.alert ? 'has-alert' : ''}">
      <div class="between"><div><b>Unit #${v.unit}</b><small class="muted">${v.type} · ${v.driver}</small></div>${ring(v.health)}</div>
      <div class="vrow"><span>${icon('fuel', 12)}Fuel</span><div class="prog sm"><i style="width:${v.fuel}%" class="${v.fuel < 25 ? 'low' : ''}"></i></div><b class="num">${v.fuel}%</b></div>
      <div class="vrow"><span>${icon('clock', 12)}Next service</span><b>${v.next}</b></div>
      <div class="vrow"><span>${icon('route', 12)}Odometer</span><b class="num">${v.odo.toLocaleString()} mi</b></div>
      ${v.alert ? `<div class="valert">${icon('alert', 12, 2)}${v.alert}</div>` : `<div class="vok">${icon('check', 12, 2.4)}No issues</div>`}
      <span class="pill ${v.status === 'shop' ? 'amber' : v.status === 'idle' ? 'gray' : 'green'} plain vstat">${v.status === 'shop' ? 'In shop' : v.status === 'idle' ? 'Idle' : 'In service'}</span>
    </div>`).join('')}</div>
    <aside class="card"><h3 class="h3">Maintenance schedule</h3><p class="sub">Booked by Fleet Agent · Kevin approves over $500</p>
      <ol class="timeline" style="margin-top:12px">${[['Thu 07:00', 'Unit #142', 'Brake + rotor service · $1,240', 'Needs approval', 'amber'], ['Thu 13:00', 'Unit #217', 'Reefer compressor check · $380', 'Booked', 'green'], ['Fri 06:00', 'Unit #088', 'DEF system flush · $160', 'Booked', 'green'], ['Nov 9', 'Unit #104', 'PM-B service · $420', 'Booked', 'green'], ['Nov 12', 'Unit #130', 'Tire rotation · $210', 'Suggested', 'gray']]
        .map(([t, u, d, st, c]) => `<li class="done"><i></i><div class="grow"><b>${u}</b><small>${d}</small><span class="pill ${c} plain" style="margin-top:4px">${st}</span></div><span class="muted num">${t}</span></li>`).join('')}</ol>
    </aside>
  </div>`;
};

// ---------------------------------------------------------------- reports
const ANSWERS = {
  'Why did on-time drop on Oct 21?': ['On Oct 21 on-time fell to 91.2% (−4.3 pts). 61% of the late loads were on the I-680 corridor during a 3-hour closure near Sunol. Route Agent proposed 14 reroutes; 9 were approved, and those loads averaged 3 min late versus 38 min for the 5 that weren’t.', 'Raise Route Agent to Autonomous for detours under 10 mi to recover ~1.8 pts on similar days.'],
  'Which lanes lose us money?': ['Two lanes run below cost: Stockton → Salinas (−$0.21/mi, 38% empty return) and Modesto → Santa Rosa (−$0.08/mi, long detention at receiver). Together they cost about $6.4K last month.', 'Reprice Stockton → Salinas by 9% or pair it with the Salinas → Tracy backhaul from Redwood Supply.'],
  'How much time did agents save this week?': ['Agents completed 12,840 actions this week; 94% needed no human. At an average of 2.6 min per manual action, that’s about 218 hours saved, which is roughly 5.4 dispatcher FTEs.', 'Customer Agent saved the most time (81 h), mostly on routine ETA updates.'],
};
V.reports = () => {
  const ot = series(11, 30, 95.2, 3).map(v => Math.min(99, v)); ot[18] = 91.2;
  const cpm = [2.41, 2.38, 2.36, 2.33, 2.35, 2.29, 2.27, 2.24];
  const saved = [['Customer Agent', 81], ['Dispatch Agent', 64], ['Exception Agent', 37], ['Route Agent', 21], ['Fleet Agent', 9], ['Operations Analyst', 6]];
  const ans = ui.reportQ && (ANSWERS[ui.reportQ] || [`Looking at the last 30 days for “${esc(ui.reportQ)}”: on-time is 96.1% (+1.4 pts), cost per mile is $2.24 (−7%), and agents handled 94% of actions without a person. Ask a more specific question, like a lane, customer or date, for a deeper answer.`, 'Try one of the suggested questions to see a full breakdown.']);
  return `${topbar({ crumb: 'Insights / Reports', title: 'Reports', actions: `<button class="btn" type="button" data-act="toast" data-msg="Daily one-pager scheduled for 6:00 PM">${icon('cal', 14)}Schedule</button><button class="btn dark" type="button" data-act="toast" data-msg="Report exported as PDF">${icon('download', 14)}Export PDF</button>` })}
  ${pausedBanner()}
  <div class="ask card">
    <div class="row" style="gap:10px"><span class="ic-sq accent">${icon('sparkles', 14, 2)}</span><div><b>Ask the Operations Analyst</b><small class="muted" style="display:block">Plain-English answers from your live data, with the numbers behind them</small></div></div>
    <form class="askbar" data-form="ask"><input id="ask-q" placeholder="e.g. Why did on-time drop last Tuesday?" value="${ui.reportQ && !ANSWERS[ui.reportQ] ? esc(ui.reportQ) : ''}" aria-label="Ask a question"><button class="btn accent" type="submit">Ask</button></form>
    <div class="chips">${Object.keys(ANSWERS).map(q => `<button type="button" class="chip ${ui.reportQ === q ? 'on' : ''}" data-act="ask" data-q="${esc(q)}">${q}</button>`).join('')}</div>
    ${ans ? `<div class="answer"><p>${ans[0]}</p><div class="rec">${icon('bolt', 13)}<b>Recommendation:</b> ${ans[1]}</div></div>` : ''}
  </div>
  <div class="rep-grid">
    <div class="card"><div class="between"><div><h3 class="h3">On-time delivery · 30 days</h3><p class="sub">96.1% today · target 95%</p></div><span class="pill green">+1.4 pts</span></div>
      ${lineChart(ot, { min: 89, max: 99, target: 95, labels: [[0, 'Oct 3'], [10, 'Oct 13'], [18, 'Oct 21'], [29, 'Today']] })}</div>
    <div class="card"><div class="between"><div><h3 class="h3">Cost per mile</h3><p class="sub">Weekly · all equipment</p></div><span class="pill green">−7.1%</span></div>
      <div class="vbars">${cpm.map((v, i) => `<div><span class="num">$${v}</span><i style="height:${(v - 2.1) / .35 * 100}%" class="${i === cpm.length - 1 ? 'hl' : ''}"></i><small>W${36 + i}</small></div>`).join('')}</div></div>
    <div class="card"><h3 class="h3">Hours saved by agent · this week</h3><p class="sub">218 h total</p>
      <div class="hbars">${saved.map(([n, h]) => `<div><span>${n}</span><div class="hb"><i style="width:${h / 81 * 100}%"></i></div><b class="num">${h}h</b></div>`).join('')}</div></div>
    <div class="card pad0"><div class="pad"><h3 class="h3">Lane performance</h3><p class="sub">Last 30 days</p></div>
      <table class="mini-table"><thead><tr><th>Lane</th><th>Loads</th><th>On-time</th><th>Margin/mi</th></tr></thead><tbody>
      ${[['Oakland → San Jose', 182, 97.8, .42], ['Fremont → Sacramento', 96, 95.1, .31], ['Tracy → Richmond', 74, 96.4, .27], ['Stockton → Salinas', 41, 92.7, -.21], ['Modesto → Santa Rosa', 28, 93.9, -.08]]
        .map(([l, n, o, m]) => `<tr><td>${l}</td><td class="num">${n}</td><td class="num">${o}%</td><td class="num ${m < 0 ? 'neg' : 'pos'}">${m < 0 ? '−' : '+'}$${Math.abs(m).toFixed(2)}</td></tr>`).join('')}</tbody></table></div>
  </div>
  <div class="card" style="margin-top:12px"><div class="between"><h3 class="h3">Scheduled reports</h3><button class="link" type="button" data-act="toast" data-msg="New report created">+ New report</button></div>
    ${[['Daily ops one-pager', 'Every day · 6:00 PM · 9 recipients', 'Operations Analyst'], ['Weekly customer scorecards', 'Mondays · 8:00 AM · sent to each customer', 'Customer Agent'], ['Monthly lane profitability', '1st of month · Sarah, finance', 'Operations Analyst']]
      .map(([n, w, by]) => `<div class="policy"><span class="ic-sq sm">${icon('doc', 11, 2.2)}</span><div class="txt"><b>${n}</b><span>${w} · by ${by}</span></div><button type="button" class="toggle on" data-act="flip" aria-label="${n}"></button></div>`).join('')}</div>`;
};

V.help = () => V.overview();

// ================================================================ settings tabs
const field = (label, value, type = 'text', hint = '') => `<label class="field"><span>${label}</span>${type === 'select'
  ? `<select class="text">${value.map(v => `<option>${v}</option>`).join('')}</select>` : `<input class="text" type="${type}" value="${esc(value)}">`}${hint ? `<small>${hint}</small>` : ''}</label>`;

const TEAM = [
  ['you', 'alex@northline-logistics.com', 'Admin', 'All', 'Now'], ['james', 'james@northline-logistics.com', 'Dispatcher', 'Dispatch, routing', '2 min ago'],
  ['priya', 'priya@northline-logistics.com', 'Customer success', 'Customer messages, exceptions', '5 min ago'], ['sarah', 'sarah@northline-logistics.com', 'Ops manager', 'Routing, spend > $2,500', '18 min ago'],
  ['kevin', 'kevin@northline-logistics.com', 'Fleet manager', 'Maintenance', '1 h ago'], ['chris', 'chris@northline-logistics.com', 'Viewer', '—', 'Yesterday'],
];
const INTEG = [
  ['tms', 'McLeod TMS', 'Loads, rates and customers', 'TMS', '#0f766e'], ['eld', 'Samsara', 'ELD, GPS and fault codes', 'ELD', '#1d4ed8'],
  ['motive', 'Motive', 'Alternate ELD provider', 'ELD', '#111827'], ['slack', 'Slack', 'Approvals and alerts in channels', 'Chat', '#7c3aed'],
  ['gmail', 'Google Workspace', 'Customer email threads', 'Email', '#dc2626'], ['twilio', 'Twilio', 'SMS to drivers and receivers', 'SMS', '#e11d48'],
  ['qb', 'QuickBooks', 'Invoices and detention billing', 'Finance', '#15803d'], ['dat', 'DAT', 'Load board for backhauls', 'Market', '#b45309'],
  ['p44', 'project44', 'Shipper visibility network', 'Visibility', '#0369a1'],
];
window.SETTINGS_TABS = {
  organization: () => `<div class="card white form">
    <h3 class="h3">Organization</h3><p class="sub">Shown on customer messages, invoices and the driver app.</p>
    <div class="form-grid">${field('Company name', 'Northline Logistics')}${field('Legal entity', 'Northline Logistics LLC')}
      ${field('USDOT number', '3184427')}${field('MC number', 'MC-1129045')}
      ${field('Time zone', ['Pacific Time (US & Canada)', 'Mountain Time', 'Central Time', 'Eastern Time'], 'select')}${field('Units', ['Miles, pounds, °F', 'Kilometres, kg, °C'], 'select')}
      ${field('Headquarters', '1400 Embarcadero, Oakland, CA 94606')}${field('Dispatch hours', 'Mon–Sat · 05:00–21:00', 'text', 'Agents still run outside these hours; approvals go to on-call.')}</div>
    <div class="between" style="margin-top:6px"><div class="row" style="gap:10px"><span class="logo-sq lg">NL</span><div><b>Logo</b><small class="muted" style="display:block">PNG or SVG, at least 256 px</small></div></div><button class="btn" type="button" data-act="toast" data-msg="Logo uploaded">Upload</button></div></div>`,

  team: () => `<div class="card white pad0">
    <div class="between pad"><div><h3 class="h3">Team & roles</h3><p class="sub">${TEAM.length} members · 6 of 10 seats used</p></div><button class="btn dark" type="button" data-act="toast" data-msg="Invite sent">${icon('plus', 13, 2.4)}Invite</button></div>
    <table class="mini-table"><thead><tr><th>Member</th><th>Role</th><th>Approves</th><th>Last active</th></tr></thead><tbody>
    ${TEAM.map(([k, mail, role, ap, last]) => `<tr><td><div class="row" style="gap:10px">${av(k)}<div><b>${PEOPLE[k].name}</b><small class="muted" style="display:block">${mail}</small></div></div></td>
      <td><select class="text sm">${['Admin', 'Ops manager', 'Dispatcher', 'Customer success', 'Fleet manager', 'Viewer'].map(r => `<option ${r === role ? 'selected' : ''}>${r}</option>`).join('')}</select></td><td>${ap}</td><td class="muted">${last}</td></tr>`).join('')}</tbody></table></div>
  <div class="roles">${[['Admin', 'Everything, including billing and AI autonomy limits'], ['Ops manager', 'Approve any agent action, edit guardrails'], ['Dispatcher', 'Approve dispatch and routing, run the board'], ['Viewer', 'Read-only access to dashboards and the log']]
    .map(([r, d]) => `<div class="card"><b>${r}</b><p class="sub">${d}</p></div>`).join('')}</div>`,

  notifications: () => {
    const ev = [['Agent needs approval', [1, 1, 0, 1]], ['Approval waiting over 15 min', [1, 1, 1, 1]], ['High-severity exception', [1, 1, 1, 1]], ['Shipment running late', [1, 0, 0, 1]], ['Agent paused or resumed', [1, 1, 0, 1]], ['Daily ops one-pager', [0, 1, 0, 0]], ['Vehicle health alert', [1, 0, 0, 0]]];
    return `<div class="card white pad0"><div class="pad"><h3 class="h3">Notifications</h3><p class="sub">Choose where you hear about what agents do.</p></div>
    <table class="mini-table matrix"><thead><tr><th>Event</th><th>In-app</th><th>Email</th><th>SMS</th><th>Slack</th></tr></thead><tbody>
    ${ev.map(([n, ch]) => `<tr><td>${n}</td>${ch.map(c => `<td><input type="checkbox" ${c ? 'checked' : ''} aria-label="${n}"></td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="card white form"><h3 class="h3">Quiet hours</h3><p class="sub">Only high-severity items break through.</p>
      <div class="form-grid">${field('From', '21:00', 'time')}${field('To', '05:00', 'time')}${field('On-call approver', ['Sarah Bennett', 'James Whitaker', 'Kevin O\'Brien'], 'select')}${field('Escalate after', ['15 minutes', '30 minutes', '1 hour'], 'select')}</div></div>`;
  },

  integrations: () => `<div><h3 class="h3">Integrations</h3><p class="sub">Agents read through scoped connections. Writes need a capability above Draft.</p></div>
    <div class="integ">${INTEG.map(([k, n, d, cat, col]) => `<div class="card white ig">
      <div class="between"><span class="logo-sq" style="background:${col};color:#fff">${n.slice(0, 2)}</span><span class="pill ${ui.integrations[k] ? 'green' : 'gray'} plain">${ui.integrations[k] ? 'Connected' : cat}</span></div>
      <b>${n}</b><p class="sub">${d}</p>
      <button class="btn sm ${ui.integrations[k] ? '' : 'dark'}" type="button" data-act="integ" data-id="${k}">${ui.integrations[k] ? 'Manage' : 'Connect'}</button></div>`).join('')}</div>`,

  billing: () => `<div class="bill">
    <div class="running"><div class="between"><div><div class="label" style="color:#7d7d88">Current plan</div><b style="font-size:20px">Growth</b></div><span class="pill accent">Annual · −15%</span></div>
      <div style="font-size:30px;letter-spacing:-.02em;margin-top:14px" class="num">$5,074<span style="font-size:13px;color:#9b9ba5"> / month</span></div>
      <p>86 trucks × $59. Renews Jan 14, 2027. All six agents, sandbox and 1-year audit trail included.</p>
      <div class="row" style="gap:8px;margin-top:14px"><button class="btn" type="button" data-act="toast" data-msg="Sales will reach out about Enterprise">Upgrade</button><button class="btn ghost" style="color:#fff" type="button">Change trucks</button></div></div>
    <div class="card white"><h3 class="h3">Usage this month</h3>
      ${[['Trucks', 86, 100], ['Sandbox replays', 42, 100], ['SMS messages', 6120, 10000], ['Seats', 6, 10]].map(([n, v, m]) => `<div class="usage"><div class="between"><span>${n}</span><b class="num">${v.toLocaleString()} / ${m.toLocaleString()}</b></div><div class="prog"><i style="width:${v / m * 100}%"></i></div></div>`).join('')}</div>
    </div>
    <div class="card white pad0"><div class="between pad"><h3 class="h3">Invoices</h3><span class="row sub" style="margin:0;gap:6px">${icon('card', 14)}Visa ending 4242</span></div>
      <table class="mini-table"><thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>
      ${[['INV-2026-010', 'Oct 14, 2026'], ['INV-2026-009', 'Sep 14, 2026'], ['INV-2026-008', 'Aug 14, 2026'], ['INV-2026-007', 'Jul 14, 2026']].map(([n, d]) => `<tr><td class="mono">${n}</td><td>${d}</td><td class="num">$5,074.00</td><td><span class="pill green">Paid</span></td><td><button class="link" type="button" data-act="toast" data-msg="${n}.pdf downloaded">PDF</button></td></tr>`).join('')}</tbody></table></div>`,

  security: () => `<div class="card white"><h3 class="h3">Sign-in</h3>
    ${[['Single sign-on (Okta)', 'Members sign in with your identity provider', true], ['Require two-factor authentication', 'For everyone who can approve agent actions', true], ['Allow sign-in from new countries', 'Unusual locations need admin approval', false]]
      .map(([n, d, on]) => `<div class="policy"><div class="txt"><b>${n}</b><span>${d}</span></div><button type="button" class="toggle ${on ? 'on' : ''}" data-act="flip" aria-label="${n}"></button></div>`).join('')}</div>
    <div class="card white"><div class="between"><h3 class="h3">API keys</h3><button class="btn sm" type="button" data-act="toast" data-msg="New key created · copy it now">${icon('plus', 12, 2.4)}New key</button></div>
      ${[['Production · EDI bridge', 'ff_live_••••8f2a', 'Created Aug 2 · last used 3 min ago'], ['Staging', 'ff_test_••••19cd', 'Created Sep 18 · last used yesterday']].map(([n, k, d]) => `<div class="policy"><div class="txt"><b>${n}</b><span class="mono">${k}</span><span style="display:block">${d}</span></div><button class="btn sm danger" type="button" data-act="toast" data-msg="Key revoked">Revoke</button></div>`).join('')}</div>
    <div class="card white"><h3 class="h3">Active sessions</h3>
      ${[['MacBook Pro · Chrome', 'Oakland, CA · this device'], ['iPhone · FleetFlow app', 'Oakland, CA · 2 h ago']].map(([n, d]) => `<div class="policy"><div class="txt"><b>${n}</b><span>${d}</span></div><button class="link" type="button" data-act="toast" data-msg="Session signed out">Sign out</button></div>`).join('')}
      <div class="policy"><div class="txt"><b>Audit log retention</b><span>Every agent action, approval and setting change</span></div><select class="text sm"><option>1 year</option><option>3 years</option><option>Forever</option></select></div></div>`,
};

// ================================================================ drawer, palette, popovers
function openDrawer(html) {
  closeDrawer();
  const s = document.createElement('div');
  s.className = 'scrim drawer-scrim';
  s.innerHTML = `<aside class="drawer" role="dialog" aria-modal="true">${html}</aside>`;
  s.addEventListener('click', (e) => { if (e.target === s || e.target.closest('[data-close]')) closeDrawer(); });
  document.body.appendChild(s);
}
function closeDrawer() { document.querySelector('.drawer-scrim')?.remove(); }

function paletteItems() {
  const pages = [['Overview', '#/overview', 'grid'], ['AI agents', '#/agents', 'sparkles'], ['Approvals', '#/inbox', 'inbox'], ['Shipments', '#/shipments', 'box'], ['Dispatch board', '#/dispatch', 'send'], ['Live routes', '#/routes', 'route'], ['Exceptions', '#/exceptions', 'alert'], ['Customers', '#/customers', 'users'], ['Fleet', '#/fleet', 'truck'], ['Reports', '#/reports', 'chart'], ['Activity log', '#/activity', 'list'], ['Settings', '#/settings', 'settings']]
    .map(([t, h, i]) => ({ t, i, sub: 'Page', go: () => (location.hash = h) }));
  const acts = [
    { t: 'New shipment', i: 'plus', sub: 'Action', go: () => newShipModal() },
    { t: state.paused ? 'Resume all agents' : 'Pause all agents', i: state.paused ? 'play' : 'pause', sub: 'Action', go: () => { if (state.paused) { state.paused = false; rerender(); toast('Agents resumed'); } else pauseModal(); } },
    { t: 'Export activity log', i: 'download', sub: 'Action', go: () => { location.hash = '#/activity'; setTimeout(exportCSV, 50); } },
  ];
  const agents = AGENTS.map(a => ({ t: a.name, i: a.ic, sub: 'Agent', go: () => (location.hash = '#/agents/' + a.id) }));
  const ships = SHIPMENTS.map(s => ({ t: `${s.id} · ${CUSTOMERS[s.cust].name}`, i: 'box', sub: `${s.from} → ${s.to}`, go: () => shipDrawer(s.id) }));
  const custs = CUSTOMERS.map(c => ({ t: c.name, i: 'users', sub: 'Customer', go: () => { location.hash = '#/customers'; setTimeout(() => custDrawer(c.i), 30); } }));
  return [...acts, ...pages, ...agents, ...custs, ...ships];
}
window.openPalette = function () {
  if (document.querySelector('.palette')) return;
  closeDrawer(); closeModal();
  const all = paletteItems(); let idx = 0, shown = [];
  const s = document.createElement('div');
  s.className = 'scrim palette-scrim';
  s.innerHTML = `<div class="palette" role="dialog" aria-label="Command palette"><div class="pin">${icon('search', 16)}<input placeholder="Search pages, agents, shipments, customers…" aria-label="Search"><span class="kbd">esc</span></div><div class="pres"></div></div>`;
  document.body.appendChild(s);
  const input = s.querySelector('input'), res = s.querySelector('.pres');
  const draw = () => {
    const q = input.value.trim().toLowerCase();
    shown = (q ? all.filter(x => (x.t + ' ' + x.sub).toLowerCase().includes(q)) : all.slice(0, 15)).slice(0, 30);
    idx = Math.min(idx, Math.max(0, shown.length - 1));
    res.innerHTML = shown.length ? shown.map((x, k) => `<button type="button" class="pi ${k === idx ? 'on' : ''}" data-k="${k}">${icon(x.i, 14)}<span class="grow">${esc(x.t)}</span><small>${esc(x.sub)}</small></button>`).join('') : '<div class="empty">No results</div>';
    res.querySelector('.on')?.scrollIntoView({ block: 'nearest' });
  };
  const pick = (k) => { const x = shown[k]; s.remove(); x?.go(); };
  input.addEventListener('input', () => { idx = 0; draw(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, shown.length - 1); draw(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); draw(); e.preventDefault(); }
    if (e.key === 'Enter') pick(idx);
    if (e.key === 'Escape') s.remove();
  });
  s.addEventListener('click', (e) => { const b = e.target.closest('.pi'); if (b) pick(+b.dataset.k); else if (e.target === s) s.remove(); });
  draw(); input.focus();
};

function toggleNotifs(btn) {
  const ex = document.querySelector('.notifs'); if (ex) { ex.remove(); return; }
  const items = [
    ['dispatch', 'Dispatch Agent needs James to approve a reassignment', '12 min ago', '#/inbox/q1'],
    ['route', 'Route Agent proposed a reroute for SF-48231', '19 min ago', '#/inbox/q2'],
    ['exception', 'High severity: 3 pallets short at Coastal Grocers', '26 min ago', '#/exceptions'],
    ['customer', 'Raj Patel (Northline Foods) replied to a delay notice', '41 min ago', '#/customers'],
    ['ops', 'Daily ops one-pager is ready', '9:24', '#/reports'],
  ];
  const p = document.createElement('div');
  p.className = 'notifs';
  p.innerHTML = `<div class="between nh"><b>Notifications</b><button class="link" type="button" data-act="notif-read">Mark all read</button></div>
    ${items.map(([a, t, w, h], k) => `<a href="${h}" class="ni ${!ui.notifRead && k < 3 ? 'unread' : ''}"><span class="ic-sq sm">${icon(agentById(a).ic, 11, 2.2)}</span><div class="grow"><b>${t}</b><small>${w}</small></div></a>`).join('')}
    <a class="nf" href="#/activity">Open activity log</a>`;
  document.body.appendChild(p);
  const r = btn.getBoundingClientRect();
  p.style.top = r.bottom + 8 + 'px';
  p.style.right = Math.max(12, innerWidth - r.right) + 'px';
}

function helpModal() {
  openModal(`<div class="mh"><h3>Help & shortcuts</h3><p>Move around FleetFlow without the mouse.</p><button class="close" type="button" data-close aria-label="Close">${icon('x', 16)}</button></div>
    <div class="mb"><div class="keys">${[['⌘ K', 'Command palette'], ['G then O', 'Overview'], ['G then A', 'AI agents'], ['G then I', 'Approvals'], ['G then S', 'Shipments'], ['G then D', 'Dispatch board'], ['G then R', 'Live routes'], ['G then E', 'Exceptions'], ['Esc', 'Close dialogs']].map(([k, d]) => `<div class="between"><span>${d}</span><span class="kbd">${k}</span></div>`).join('')}</div></div>
    <div class="mf"><span class="note">${icon('help', 13)}Docs and support: help@fleetflow.ai</span><button class="btn" type="button" data-close>Done</button></div>`);
}

function newShipModal() {
  const cities = Object.keys(CITY);
  openModal(`<div class="mh"><h3>New shipment</h3><p>Dispatch Agent will suggest a driver the moment you create it.</p><button class="close" type="button" data-close aria-label="Close">${icon('x', 16)}</button></div>
    <form class="mb" data-form="new-ship">
      <label class="field"><span>Customer</span><select class="text" name="cust">${CUSTOMERS.map(c => `<option value="${c.i}">${c.name}</option>`).join('')}</select></label>
      <div class="two"><label class="field"><span>Origin</span><select class="text" name="from">${cities.map(c => `<option ${c === 'Oakland' ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        <label class="field"><span>Destination</span><select class="text" name="to">${cities.map(c => `<option ${c === 'San Jose' ? 'selected' : ''}>${c}</option>`).join('')}</select></label></div>
      <div class="two"><label class="field"><span>Pickup</span><input class="text" name="pickup" type="time" value="13:30"></label>
        <label class="field"><span>Equipment</span><select class="text" name="equip"><option>Dry van</option><option>Reefer</option><option>Flatbed</option></select></label></div>
      <div class="two"><label class="field"><span>Weight (lb)</span><input class="text" name="weight" type="number" value="22000"></label>
        <label class="field"><span>Load value ($)</span><input class="text" name="value" type="number" value="8500"></label></div>
      <div class="mf" style="margin:4px -22px -16px"><span class="note">${icon('sparkles', 13)}Agents only suggest until you approve</span><button class="btn" type="button" data-close>Cancel</button><button class="btn dark" type="submit">Create shipment</button></div>
    </form>`);
}

// ================================================================ events
function assignShip(id) {
  const s = shipById(id); if (!s || s.driver != null) return;
  s.driver = 0; s.status = 'assigned';
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.notifs') && !e.target.closest('[data-act="notifs"]')) document.querySelector('.notifs')?.remove();
  const el = e.target.closest('[data-act]'); if (!el) return;
  const id = el.dataset.id;
  switch (el.dataset.act) {
    case 'palette': openPalette(); break;
    case 'notifs': toggleNotifs(el); break;
    case 'notif-read': ui.notifRead = true; document.querySelectorAll('.ni.unread').forEach(n => n.classList.remove('unread')); document.querySelectorAll('.ping').forEach(p => p.remove()); break;
    case 'help': e.preventDefault(); helpModal(); break;
    case 'new-ship': newShipModal(); break;
    case 'toast': toast(el.dataset.msg); break;
    case 'flip': el.classList.toggle('on'); break;
    case 'approve': case 'override': {
      const k = INBOX.findIndex(q => q.id === id); if (k < 0) break;
      const reason = document.getElementById('ov-reason')?.value.trim();
      if (el.dataset.act === 'override' && !reason) { const t = document.getElementById('ov-reason'); t.focus(); t.classList.add('err'); toast('Add a reason to override. It helps the agent learn.'); break; }
      const [q] = INBOX.splice(k, 1);
      if (q.ship === 'SF-48231' && el.dataset.act === 'approve') ui.rerouted = true;
      ui.inboxSel = INBOX[Math.min(k, INBOX.length - 1)]?.id;
      if (location.hash.startsWith('#/inbox/')) history.replaceState(null, '', '#/inbox');
      rerender();
      toast(el.dataset.act === 'approve' ? `Approved · ${agentById(q.agent).name} is acting on it` : 'Overridden · reason logged', () => { INBOX.splice(k, 0, q); if (q.ship === 'SF-48231') ui.rerouted = false; rerender(); });
      break;
    }
    case 'approve-all': { const n = INBOX.length; INBOX.splice(0); ui.rerouted = true; rerender(); toast(`${n} recommendations approved`); break; }
    case 'ship': if (!e.target.closest('button[data-act="assign"]')) { e.preventDefault(); shipDrawer(id); } break;
    case 'assign': e.stopPropagation(); assignShip(id); closeDrawer(); rerender(); toast(`${id} assigned to Luis Hernandez · driver notified`); break;
    case 'auto-assign': { const un = SHIPMENTS.filter(s => s.status === 'unassigned'); un.forEach((s, k) => { s.driver = [0, 5, 8, 11][k % 4]; s.status = 'assigned'; }); rerender(); toast(`${un.length} loads assigned to the suggested drivers`); break; }
    case 'ship-tab': ui.shipTab = el.dataset.tab; if (location.hash === '#/shipments') { e.preventDefault(); rerender(); } break;
    case 'ship-csv': toast('Exported shipments.csv'); break;
    case 'msg-cust': closeDrawer(); toast('Customer Agent drafted an update. Find it in the customer thread.'); break;
    case 'route-sel': ui.routeSel = id; rerender(); break;
    case 'reroute': { ui.rerouted = true; const k = INBOX.findIndex(q => q.ship === 'SF-48231'); if (k >= 0) INBOX.splice(k, 1); rerender(); toast('Reroute approved · driver’s navigation updated'); break; }
    case 'call': toast(`Calling ${DRIVERS[+id].name}…`); break;
    case 'ex-tab': ui.exTab = el.dataset.tab; rerender(); break;
    case 'ex-sel': ui.exSel = id; rerender(); break;
    case 'ex-resolve': { const x = EXCEPTIONS.find(z => z.id === id); x.resolved = true; x.status = 'Resolved'; rerender(); toast(`${id} fix approved · Exception Agent is executing`); break; }
    case 'ex-reopen': { const x = EXCEPTIONS.find(z => z.id === id); x.resolved = false; x.status = 'Reopened'; rerender(); break; }
    case 'ex-escalate': toast(`${id} escalated to Sarah Bennett`); break;
    case 'cust': custDrawer(+id); break;
    case 'draft-reply': { const i = document.getElementById('cmsg'); i.value = 'Quick update: everything is on schedule for today. I’ll confirm tomorrow’s driver by 06:30.'; i.focus(); break; }
    case 'send-reply': {
      const i = document.getElementById('cmsg'); if (!i.value.trim()) break;
      const t = document.querySelector('.thread');
      t.insertAdjacentHTML('beforeend', `<div class="msg me"><div class="mh2"><b>Alex Morgan</b><span>now</span></div><p>${esc(i.value)}</p></div>`);
      i.value = ''; t.scrollTop = t.scrollHeight; break;
    }
    case 'fleet-tab': ui.fleetTab = el.dataset.tab; rerender(); break;
    case 'ask': ui.reportQ = el.dataset.q; rerender(); break;
    case 'integ': ui.integrations[id] = !ui.integrations[id]; rerender(); toast(ui.integrations[id] ? 'Connected · agents can now read this source' : 'Disconnected'); break;
  }
});

document.addEventListener('submit', (e) => {
  const f = e.target.closest('[data-form]'); if (!f) return;
  e.preventDefault();
  if (f.dataset.form === 'ask') { ui.reportQ = document.getElementById('ask-q').value.trim() || null; rerender(); }
  if (f.dataset.form === 'new-ship') {
    const d = Object.fromEntries(new FormData(f));
    const id = 'SF-' + (48700 + SHIPMENTS.length);
    SHIPMENTS.unshift({ id, cust: +d.cust, from: d.from, to: d.to, driver: null, status: 'unassigned', progress: 0, pickup: d.pickup, window: 'Today', eta: '—', late: 0, equip: d.equip, weight: +d.weight, value: +d.value, miles: 42 });
    closeModal(); location.hash = '#/dispatch';
    setTimeout(() => toast(`${id} created · Dispatch Agent suggests Luis Hernandez (94% match)`), 60);
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'ship-q') { ui.shipQ = e.target.value; document.getElementById('ship-body').innerHTML = shipRows(); }
  if (e.target.id === 'ov-reason') e.target.classList.remove('err');
});

// "g" then a letter jumps between screens.
let gPending = 0;
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select') || e.metaKey || e.ctrlKey) return;
  if (e.key === 'Escape') { closeDrawer(); document.querySelector('.notifs')?.remove(); }
  const k = e.key.toLowerCase();
  if (gPending && Date.now() - gPending < 1200) {
    const map = { o: 'overview', a: 'agents', i: 'inbox', s: 'shipments', d: 'dispatch', r: 'routes', e: 'exceptions', c: 'customers', f: 'fleet', l: 'activity' };
    if (map[k]) location.hash = '#/' + map[k];
    gPending = 0; return;
  }
  if (k === 'g') gPending = Date.now();
  if (k === '?') helpModal();
});

window.addEventListener('hashchange', closeDrawer);

// Drag and drop on the dispatch board.
window.afterRender = (root) => {
  if (root !== 'dispatch') return;
  let dragId = null;
  document.querySelectorAll('.tcard').forEach(c => c.addEventListener('dragstart', (e) => { dragId = c.dataset.ship; c.classList.add('dragging'); e.dataTransfer.setData('text/plain', dragId); }));
  document.querySelectorAll('.tcard').forEach(c => c.addEventListener('dragend', () => c.classList.remove('dragging')));
  document.querySelectorAll('.col').forEach(col => {
    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('over'); });
    col.addEventListener('dragleave', () => col.classList.remove('over'));
    col.addEventListener('drop', (e) => {
      e.preventDefault(); col.classList.remove('over');
      const s = shipById(dragId); if (!s) return;
      const to = col.dataset.col;
      if (to !== 'unassigned' && s.driver == null) s.driver = 0;
      if (to === 'unassigned') s.driver = null;
      s.status = to; s.progress = to === 'delivered' ? 1 : to === 'transit' ? Math.max(s.progress, .1) : 0; s.late = 0;
      rerender(); toast(`${s.id} moved to ${STATUS[to][1]}`);
    });
  });
};

window.VIEWS = V;
