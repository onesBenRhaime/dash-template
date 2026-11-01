// FleetFlow AI marketing site interactions.
const ic = {
  send: '<path d="M20 4 4 11l7 2 2 7 7-16Z"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  alert: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17v.5"/>',
  msg: '<path d="M21 12a8 8 0 0 1-11.8 7L4 20l1-5A8 8 0 1 1 21 12Z"/>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
};
const svg = (k) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic[k]}</svg>`;

const agents = [
  ['send', 'dispatch', 'Dispatch Agent', 'Matches every load to the right driver, balancing hours of service, distance and customer windows.', '1,284', 'shipments matched today'],
  ['route', 'route', 'Route Agent', 'Watches live traffic and weather and proposes faster, safer routes before trucks get stuck.', '96', 'reroutes proposed'],
  ['alert', 'exception', 'Exception Agent', 'Detects late, short and damaged deliveries, classifies them and prepares the fix.', '31', 'exceptions auto-resolved'],
  ['msg', 'customer', 'Customer Agent', 'Sends accurate ETAs and answers shipper questions in your tone, around the clock.', '128', 'conversations handled'],
  ['truck', 'fleet', 'Fleet Agent', 'Tracks vehicle health and fuel, and books maintenance before a breakdown costs a delivery.', '7', 'health alerts caught'],
  ['chart', 'ops', 'Operations Analyst', 'Turns the day into a plain-English one-pager and answers “why” questions about cost and service.', '12', 'reports published'],
];
document.getElementById('agent-grid').innerHTML = agents.map(([i, id, n, d, v, k]) => `
  <a class="agent reveal" href="app/#/agents/${id}"><div class="ic">${svg(i)}</div><h3>${n}</h3><p>${d}</p>
  <div class="stat"><span>${k}</span><b>${v}</b></div></a>`).join('');

// Autonomy dial demo
const levels = ['Observe', 'Recommend', 'Draft', 'Approve first', 'Autonomous'];
const desc = [
  'Watches and reports. Nothing is changed.',
  'Suggests the best driver with reasons. A dispatcher does the rest.',
  'Prepares the assignment and driver message for one-click send.',
  'Acts as soon as James Whitaker (or his backup) approves.',
  'Acts on its own within guardrails and reports back.',
];
const tasks = [
  ['Assign driver to SF-48305', 0],
  ['Notify Luis in the driver app', 1],
  ['Move SF-48291 off Emily (HOS)', 2],
  ['Cancel shipment SF-48002', 9],
];
function status(lvl, risk) {
  if (risk === 9) return lvl === 0 ? ['no', 'Watching'] : ['no', 'Never alone'];
  if (lvl === 0) return ['no', 'Watching'];
  if (lvl === 1) return ['no', 'Suggested'];
  if (lvl === 2) return ['draft', 'Drafted'];
  if (lvl === 3) return ['ask', 'Asks James'];
  return risk >= 2 ? ['ask', 'Asks James'] : ['auto', 'Done'];
}
let cur = 3;
const dial = document.getElementById('dial');
function renderDial() {
  dial.innerHTML = levels.map((l, i) => `<button class="${i === cur ? 'on' : ''}" data-i="${i}">${l}</button>`).join('');
  document.getElementById('dial-out').innerHTML = tasks.map(([t, r]) => {
    const [c, s] = status(cur, r);
    return `<div class="line">${t}<span class="st ${c}">${s}</span></div>`;
  }).join('');
  document.getElementById('dial-desc').textContent = desc[cur];
}
dial.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { cur = +b.dataset.i; renderDial(); } });
renderDial();

// Kill switch demo
const kill = document.getElementById('kill');
const kb = document.getElementById('kill-btn');
kb.addEventListener('click', () => {
  const p = !kill.classList.contains('is-paused');
  kill.classList.toggle('is-paused', p);
  kb.classList.toggle('paused', p);
  kb.setAttribute('aria-pressed', p);
  kb.setAttribute('aria-label', p ? 'Resume agents' : 'Pause all agents');
  document.getElementById('kill-ic').innerHTML = p ? '<path d="M7 5v14l12-7L7 5Z"/>' : '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
  document.getElementById('kill-status').textContent = p ? 'All 6 agents paused' : 'All agents running';
  document.getElementById('kill-sub').textContent = p ? '14 queued actions moved to a person · logged with your name' : 'Tap to pause the whole fleet';
});

// Reveal on scroll
const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Nav border + hero frame tilt-in (like the video intro)
const nav = document.getElementById('nav');
const frame = document.getElementById('frame');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function onScroll() {
  nav.classList.toggle('scrolled', scrollY > 8);
  if (!reduce && innerWidth > 600) {
    const t = Math.min(1, scrollY / 420);
    frame.style.transform = `rotateX(${14 * (1 - t)}deg) scale(${0.96 + 0.04 * t})`;
  }
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();
