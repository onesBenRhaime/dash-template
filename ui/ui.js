/*!
 * Dash UI — a dependency-free dashboard kit (components + overlays + charts).
 * Pairs with ui/ui.css. Exposes `window.UI`; also works via CommonJS or
 * `import UI from './ui/ui.mjs'`.
 *
 * Components return HTML strings, so they compose with template literals and
 * work with any rendering approach. Overlays and charts take DOM nodes.
 */
(function (root, factory) {
  var UI = factory();
  if (typeof module === 'object' && module.exports) module.exports = UI;
  root.UI = UI;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------------------------------------------------------------- dom
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var attrs = function (o) {
    if (!o) return '';
    return Object.keys(o).filter(function (k) { return o[k] != null && o[k] !== false; })
      .map(function (k) { return o[k] === true ? k : k + '="' + esc(o[k]) + '"'; }).join(' ');
  };

  // ---------------------------------------------------------------- icons
  // 24x24, stroked. Add your own with UI.addIcons({ name: '<path .../>' }).
  var icons = {
    grid: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    inbox: '<path d="M4 13 6.5 5h11L20 13v6H4v-6Z"/><path d="M4 13h4.5l1 2h5l1-2H20"/>',
    box: '<path d="M4 8 12 4l8 4v8l-8 4-8-4V8Z"/><path d="m4 8 8 4 8-4M12 12v8"/>',
    send: '<path d="M20 4 4 11l7 2 2 7 7-16Z"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
    map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"/><path d="M9 4v14M15 6v14"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    alert: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17v.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    check: '<path d="m5 12 4.5 4.5L19 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-1v-5L4 5Z"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
    msg: '<path d="M21 12a8 8 0 0 1-11.8 7L4 20l1-5A8 8 0 1 1 21 12Z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    play: '<path d="M7 5v14l12-7L7 5Z"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z"/>',
    sparkles: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    fwd: '<path d="M9 6l6 6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
    building: '<path d="M4 20V5l8-2v17M12 8l8 2v10M2 20h20M7 8h2M7 12h2M7 16h2M15 13h2M15 16h2"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2Z"/>',
    fuel: '<path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h12M4 10h10M14 8l3 3v6a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
    thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/>',
    ban: '<circle cx="12" cy="12" r="8"/><path d="m6.5 6.5 11 11"/>',
    globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
    logo: '<path d="M5 19V9a4 4 0 0 1 4-4h10"/><path d="M9 19v-6a2 2 0 0 1 2-2h8"/><circle cx="17" cy="17" r="2"/>',
  };
  var icon = function (name, size, stroke) {
    size = size || 16;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
      (stroke || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || '') + '</svg>';
  };

  // ---------------------------------------------------------------- theme
  var theme = {
    get: function () { return document.documentElement.getAttribute('data-theme') || 'auto'; },
    set: function (mode) {
      if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', mode);
      try { localStorage.setItem('ui-theme', mode); } catch (e) {}
      return mode;
    },
    toggle: function () {
      var dark = matchMedia('(prefers-color-scheme: dark)').matches;
      var now = theme.get();
      var effective = now === 'auto' ? (dark ? 'dark' : 'light') : now;
      return theme.set(effective === 'dark' ? 'light' : 'dark');
    },
    restore: function () {
      var saved = null;
      try { saved = localStorage.getItem('ui-theme'); } catch (e) {}
      if (saved) theme.set(saved);
      return theme.get();
    },
    /** Rebrand at runtime: UI.theme.accent('#e5484d') */
    accent: function (hex) { document.documentElement.style.setProperty('--accent', hex); },
  };

  // ---------------------------------------------------------------- atoms
  var btn = function (o) {
    o = o || {};
    var cls = ['btn', o.variant || '', o.size || '', o.className || ''].filter(Boolean).join(' ');
    var inner = (o.icon ? icon(o.icon, o.iconSize || 14, o.iconStroke) : '') + (o.label ? esc(o.label) : '');
    if (o.href) return '<a class="' + cls + '" href="' + esc(o.href) + '" ' + attrs(o.attrs) + '>' + inner + '</a>';
    return '<button class="' + cls + '" type="' + (o.type || 'button') + '" ' + attrs(o.attrs) + '>' + inner + '</button>';
  };
  var iconBtn = function (o) {
    o = o || {};
    return '<button class="icon-btn" type="button" aria-label="' + esc(o.label || '') + '" ' + attrs(o.attrs) + '>' +
      icon(o.icon, o.size || 18) + (o.dot ? '<span class="ping"></span>' : '') + '</button>';
  };
  var pill = function (text, tone, opt) {
    opt = opt || {};
    return '<span class="pill ' + (tone || 'gray') + (opt.plain ? ' plain' : '') + '">' +
      (opt.icon ? icon(opt.icon, 11, 2.2) : '') + esc(text) + '</span>';
  };
  var avatar = function (o) {
    o = o || {};
    var initials = o.initials || String(o.name || '?').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
    return '<span class="avatar ' + (o.size || '') + '" style="background:' + esc(o.color || '#3b3b44') + '"' +
      (o.name ? ' title="' + esc(o.name) + '"' : '') + '>' + esc(initials) + '</span>';
  };
  var toggle = function (on, extra) {
    return '<button type="button" class="toggle' + (on ? ' on' : '') + '" ' + (extra || '') + '></button>';
  };
  var seg = function (o) {
    var value = o.value, lock = o.lock || [];
    return '<div class="seg" ' + (o.attrs || '') + '>' + o.options.map(function (label, i) {
      var isLock = lock.indexOf(i) > -1;
      return '<button type="button" data-l="' + i + '" class="' + (i === value ? 'on lvl-' + i : '') + '">' +
        (isLock ? icon('lock', 11, 2.2) : '') + esc(label) + '</button>';
    }).join('') + '</div>';
  };
  var meter = function (filled, total) {
    total = total || 5;
    var cells = '';
    for (var i = 0; i < total; i++) cells += '<i class="' + (i < filled ? 'f' : '') + '"></i>';
    return '<div class="abar" style="grid-template-columns:repeat(' + total + ',1fr)">' + cells + '</div>';
  };
  var dots = function (filled, total) {
    total = total || 5;
    var cells = '';
    for (var i = 0; i < total; i++) cells += '<i class="' + (i < filled ? 'f' : '') + '"></i>';
    return '<span class="lvl-dots">' + cells + '</span>';
  };
  var progress = function (pct, o) {
    o = o || {};
    return '<div class="prog ' + (o.className || '') + '"><i style="width:' + Math.max(0, Math.min(100, pct)) + '%"></i></div>';
  };
  var kbd = function (k) { return '<span class="kbd">' + esc(k) + '</span>'; };

  // ---------------------------------------------------------------- blocks
  var card = function (body, o) {
    o = o || {};
    return '<div class="card ' + (o.white ? 'white ' : '') + (o.className || '') + '" ' + attrs(o.attrs) + '>' + body + '</div>';
  };
  var kpi = function (o) {
    return card('<div class="between"><span class="label">' + esc(o.label) + '</span>' + (o.aside || '') + '</div>' +
      '<div class="kv num ' + (o.tone || '') + '">' + (o.html || esc(o.value)) + '</div>' +
      '<div class="ks">' + (o.sub || '') + '</div>', { className: 'kpi' });
  };
  var tabs = function (o) {
    return '<div class="tabs">' + o.tabs.map(function (t) {
      var key = t.key != null ? t.key : t[0], label = t.label != null ? t.label : t[1], count = t.count != null ? t.count : t[2];
      return '<button type="button" class="' + (key === o.active ? 'on' : '') + '" data-act="' + esc(o.act || 'tab') +
        '" data-tab="' + esc(key) + '">' + esc(label) + (count != null ? '<span>' + count + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  };
  var field = function (o) {
    var input;
    if (o.type === 'select') {
      input = '<select class="text" ' + attrs(o.attrs) + '>' + (o.options || []).map(function (v) {
        var val = v && v.value != null ? v.value : v, lab = v && v.label != null ? v.label : v;
        return '<option value="' + esc(val) + '"' + (val === o.value ? ' selected' : '') + '>' + esc(lab) + '</option>';
      }).join('') + '</select>';
    } else if (o.type === 'textarea') {
      input = '<textarea class="input" ' + attrs(o.attrs) + ' placeholder="' + esc(o.placeholder || '') + '">' + esc(o.value || '') + '</textarea>';
    } else {
      input = '<input class="text" type="' + (o.type || 'text') + '" value="' + esc(o.value == null ? '' : o.value) +
        '" placeholder="' + esc(o.placeholder || '') + '" ' + attrs(o.attrs) + '>';
    }
    return '<label class="field"><span>' + esc(o.label) + '</span>' + input + (o.hint ? '<small>' + esc(o.hint) + '</small>' : '') + '</label>';
  };
  var search = function (o) {
    o = o || {};
    var ph = o.placeholder || 'Search…';
    var badge = o.kbd === false ? '' : kbd(o.kbd || '\u2318K');
    if (o.id) {
      return '<label class="search">' + icon('search', 14) + '<input id="' + esc(o.id) + '" placeholder="' + esc(ph) +
        '" value="' + esc(o.value || '') + '" aria-label="' + esc(o.label || ph) + '">' + badge + '</label>';
    }
    return '<button type="button" class="search" ' + attrs(o.attrs || { 'data-act': 'palette' }) + '>' + icon('search', 14) +
      '<span style="flex:1;text-align:left;font-size:12px">' + esc(ph) + '</span>' + badge + '</button>';
  };
  var table = function (o) {
    var body = o.rows && o.rows.length ? o.rows.join('')
      : '<tr><td colspan="' + o.columns.length + '" class="empty">' + esc(o.empty || 'Nothing here yet.') + '</td></tr>';
    return '<div class="table-wrap"><table><thead><tr>' +
      o.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') +
      '</tr></thead><tbody' + (o.bodyId ? ' id="' + esc(o.bodyId) + '"' : '') + '>' + body + '</tbody></table></div>';
  };
  var empty = function (o) {
    return '<div class="card empty-big">' + icon(o.icon || 'check', 28, 2.2) + '<h3>' + esc(o.title) + '</h3>' +
      (o.text ? '<p>' + esc(o.text) + '</p>' : '') + (o.action || '') + '</div>';
  };
  var timeline = function (items) {
    return '<ol class="timeline">' + items.map(function (it) {
      return '<li class="' + (it.done ? 'done' : '') + '"><i></i><div class="grow"><b>' + esc(it.title) + '</b>' +
        (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + (it.tag || '') + '</div>' +
        (it.meta ? '<span class="muted num">' + esc(it.meta) + '</span>' : '') + '</li>';
    }).join('') + '</ol>';
  };

  // ---------------------------------------------------------------- shell
  var rail = function (o) {
    o = o || {};
    var link = function (it) {
      if (it.sep) return '<div class="sep"></div>';
      if (it.spacer) return '<div class="spacer"></div>';
      return '<a href="' + esc(it.href || '#') + '" class="' + (it.active ? 'on ' : '') + (it.className || '') +
        '" title="' + esc(it.label) + '" aria-label="' + esc(it.label) + '" ' + attrs(it.attrs) + '>' +
        icon(it.icon, 18) + (it.badge ? '<span class="dot">' + esc(it.badge) + '</span>' : '') + '</a>';
    };
    return '<nav class="rail">' +
      (o.logo ? '<a href="' + esc(o.logo.href || '#') + '" class="logo" title="' + esc(o.logo.label || 'Home') +
        '" aria-label="' + esc(o.logo.label || 'Home') + '">' + icon(o.logo.icon || 'logo', 18, 2.2) + '</a>' : '') +
      (o.items || []).map(link).join('') +
      (o.footer ? o.footer.map(link).join('') : '') +
      (o.avatar || '') + '</nav>';
  };
  var topbar = function (o) {
    return '<header class="top"><div>' +
      (o.crumb ? '<div class="crumb">' + o.crumb + '</div>' : '') +
      '<h1 class="title">' + (o.back ? '<a class="back" href="' + esc(o.back) + '" aria-label="Back">' + icon('back', 18) + '</a>' : '') +
      o.title + '</h1></div><div class="actions">' + (o.actions || '') + '</div></header>';
  };
  var shell = function (o) {
    return '<div class="shell">' + (o.rail || '') + '<main class="main"><div class="view">' + (o.main || '') + '</div></main></div>';
  };

  // ---------------------------------------------------------------- overlays
  var closeModal = function () { var m = $('.scrim:not(.drawer-scrim):not(.palette-scrim)'); if (m) m.remove(); };
  var closeDrawer = function () { var d = $('.drawer-scrim'); if (d) d.remove(); };
  var closePopover = function () { var p = $('.notifs'); if (p) p.remove(); };

  var overlay = function (cls, inner, o) {
    o = o || {};
    var s = document.createElement('div');
    s.className = 'scrim ' + cls;
    s.innerHTML = inner;
    s.addEventListener('click', function (e) {
      if (e.target === s || (e.target.closest && e.target.closest('[data-close]'))) s.remove();
    });
    document.body.appendChild(s);
    if (o.onMount) o.onMount(s);
    var focus = s.querySelector('[autofocus], button, textarea, input');
    if (focus && o.focus !== false) focus.focus();
    return s;
  };
  var modal = function (html, o) {
    closeModal();
    return overlay('', '<div class="modal" role="dialog" aria-modal="true">' + html + '</div>', o);
  };
  var drawer = function (html, o) {
    closeDrawer();
    return overlay('drawer-scrim', '<aside class="drawer" role="dialog" aria-modal="true">' + html + '</aside>', o);
  };
  /** Anchored panel, e.g. a notification list under a bell button. */
  var popover = function (anchor, html, o) {
    o = o || {};
    closePopover();
    var p = document.createElement('div');
    p.className = 'notifs ' + (o.className || '');
    p.innerHTML = html;
    document.body.appendChild(p);
    var r = anchor.getBoundingClientRect();
    p.style.top = (r.bottom + 8) + 'px';
    p.style.right = Math.max(12, innerWidth - r.right) + 'px';
    return p;
  };
  var confirm = function (o) {
    return modal(
      '<div class="mh"><h3>' + esc(o.title) + '</h3>' + (o.text ? '<p>' + esc(o.text) + '</p>' : '') +
      '<button class="close" type="button" data-close aria-label="Close">' + icon('x', 16) + '</button></div>' +
      (o.body ? '<div class="mb">' + o.body + '</div>' : '') +
      '<div class="mf">' + (o.note ? '<span class="note">' + icon('shield', 13) + esc(o.note) + '</span>' : '') +
      btn({ label: o.cancelLabel || 'Cancel', attrs: { 'data-close': true } }) +
      btn({ label: o.confirmLabel || 'Confirm', variant: o.danger ? 'danger' : 'accent', attrs: { 'data-ui-confirm': true } }) +
      '</div>',
      { onMount: function (s) {
        var b = s.querySelector('[data-ui-confirm]');
        if (b) b.onclick = function () { s.remove(); if (o.onConfirm) o.onConfirm(s); };
      } });
  };

  var toast = function (msg, o) {
    o = typeof o === 'function' ? { undo: o } : (o || {});
    var old = $('.toast'); if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span class="ok">' + icon(o.icon || 'check', 12, 3) + '</span>' + esc(msg) +
      (o.undo ? '<button type="button">' + esc(o.undoLabel || 'Undo') + '</button>' : '');
    document.body.appendChild(t);
    if (o.undo) t.querySelector('button').onclick = function () { o.undo(); t.remove(); };
    setTimeout(function () { t.remove(); }, o.duration || 3600);
    return t;
  };

  /**
   * Command palette. items: [{ title, sub, icon, run }]
   * Opens on ⌘K/Ctrl+K when UI.shortcuts is wired, or call UI.palette() directly.
   */
  var palette = function (o) {
    o = o || {};
    if ($('.palette')) return;
    closeDrawer(); closeModal();
    var all = typeof o.items === 'function' ? o.items() : (o.items || []);
    var idx = 0, shown = [];
    var s = overlay('palette-scrim',
      '<div class="palette" role="dialog" aria-label="Command palette"><div class="pin">' + icon('search', 16) +
      '<input placeholder="' + esc(o.placeholder || 'Search…') + '" aria-label="Search">' + kbd('esc') +
      '</div><div class="pres"></div></div>', { focus: false });
    var input = s.querySelector('input'), res = s.querySelector('.pres');
    var draw = function () {
      var q = input.value.trim().toLowerCase();
      shown = (q ? all.filter(function (x) { return (x.title + ' ' + (x.sub || '')).toLowerCase().indexOf(q) > -1; })
        : all.slice(0, o.initial || 15)).slice(0, o.max || 30);
      idx = Math.min(idx, Math.max(0, shown.length - 1));
      res.innerHTML = shown.length ? shown.map(function (x, k) {
        return '<button type="button" class="pi ' + (k === idx ? 'on' : '') + '" data-k="' + k + '">' +
          icon(x.icon || 'arrow', 14) + '<span class="grow">' + esc(x.title) + '</span><small>' + esc(x.sub || '') + '</small></button>';
      }).join('') : '<div class="empty">No results</div>';
      var on = res.querySelector('.on'); if (on) on.scrollIntoView({ block: 'nearest' });
    };
    var pick = function (k) { var x = shown[k]; s.remove(); if (x && x.run) x.run(); };
    input.addEventListener('input', function () { idx = 0; draw(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, shown.length - 1); draw(); e.preventDefault(); }
      if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); draw(); e.preventDefault(); }
      if (e.key === 'Enter') pick(idx);
      if (e.key === 'Escape') s.remove();
    });
    s.addEventListener('click', function (e) {
      var b = e.target.closest('.pi');
      if (b) pick(+b.dataset.k);
    });
    draw(); input.focus();
    return s;
  };

  // ---------------------------------------------------------------- charts
  /** Deterministic pseudo-random series, handy for placeholder data. */
  var series = function (seed, n, base, amp) {
    var s = seed, out = [];
    var rnd = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (var i = 0; i < n; i++) out.push(+(base + Math.sin(i / 3) * amp * 0.4 + (rnd() - 0.5) * amp).toFixed(1));
    return out;
  };
  var sparkline = function (arr, o) {
    o = o || {};
    var w = o.width || 96, h = o.height || 30;
    var mn = Math.min.apply(null, arr), mx = Math.max.apply(null, arr), sx = w / (arr.length - 1);
    var pts = arr.map(function (v, i) {
      return (i * sx).toFixed(1) + ',' + (h - 3 - ((v - mn) / (mx - mn || 1)) * (h - 6)).toFixed(1);
    });
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" class="spark">' +
      '<polyline fill="none" stroke="' + (o.color || 'var(--accent)') + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" points="' +
      pts.join(' ') + '"/></svg>';
  };
  var lineChart = function (data, o) {
    o = o || {};
    var w = o.width || 640, h = o.height || 180;
    var mn = o.min != null ? o.min : Math.min.apply(null, data);
    var mx = o.max != null ? o.max : Math.max.apply(null, data);
    var sx = w / (data.length - 1), color = o.color || 'var(--accent)';
    var uid = 'lg' + w + h;
    var y = function (v) { return h - 8 - ((v - mn) / (mx - mn)) * (h - 16); };
    var pts = data.map(function (v, i) { return [i * sx, y(v)]; });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    return '<svg viewBox="0 0 ' + w + ' ' + (h + 18) + '" class="lchart" preserveAspectRatio="none">' +
      '<defs><linearGradient id="' + uid + '" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0" stop-color="' + (o.fill || 'var(--accent-600)') + '" stop-opacity=".22"/>' +
      '<stop offset="1" stop-color="' + (o.fill || 'var(--accent-600)') + '" stop-opacity="0"/></linearGradient></defs>' +
      [0, 0.5, 1].map(function (f) {
        return '<line x1="0" x2="' + w + '" y1="' + (8 + f * (h - 16)) + '" y2="' + (8 + f * (h - 16)) + '" stroke="var(--line)"/>';
      }).join('') +
      (o.target != null ? '<line x1="0" x2="' + w + '" y1="' + y(o.target) + '" y2="' + y(o.target) +
        '" stroke="var(--amber)" stroke-dasharray="4 4"/><text x="4" y="' + (y(o.target) + 13) + '" class="ct tl">' +
        esc(o.targetLabel || ('Target ' + o.target)) + '</text>' : '') +
      '<path d="' + d + ' L ' + w + ' ' + h + ' L 0 ' + h + ' Z" fill="url(#' + uid + ')"/>' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="' + pts[pts.length - 1][0] + '" cy="' + pts[pts.length - 1][1] + '" r="4" fill="' + color +
      '" stroke="var(--surface)" stroke-width="2"/>' +
      (o.labels || []).map(function (l) {
        return '<text x="' + Math.min(Math.max(l[0] * sx, 14), w - 14) + '" y="' + (h + 14) + '" text-anchor="middle" class="ct">' + esc(l[1]) + '</text>';
      }).join('') + '</svg>';
  };
  var donut = function (parts, size, stroke) {
    size = size || 120; stroke = stroke || 14;
    var r = (size - stroke) / 2, c = 2 * Math.PI * r;
    var total = parts.reduce(function (a, p) { return a + p[0]; }, 0), off = 0;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" style="transform:rotate(-90deg)">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--chip)" stroke-width="' + stroke + '"/>' +
      parts.map(function (p) {
        var len = (p[0] / total) * c;
        var seg = '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + p[1] +
          '" stroke-width="' + stroke + '" stroke-dasharray="' + (len - 2) + ' ' + (c - len + 2) +
          '" stroke-dashoffset="' + (-off) + '" stroke-linecap="butt"/>';
        off += len; return seg;
      }).join('') + '</svg>';
  };
  var ring = function (value, size) {
    size = size || 44;
    var col = value >= 85 ? 'var(--green)' : value >= 70 ? 'var(--amber)' : 'var(--red)';
    return '<span class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
      donut([[value, col], [100 - value, 'transparent']], size, 5) + '<b>' + value + '</b></span>';
  };
  /**
   * Stacked bar chart with a hover tooltip.
   * mount(el, data, { series: [{key, className}], label(d) })
   */
  var barChart = function (el, data, o) {
    if (!el) return;
    o = o || {};
    var keys = o.series || [{ key: 'value' }];
    var max = o.max || Math.max.apply(null, data.map(function (d) {
      return keys.reduce(function (a, k) { return a + (d[k.key] || 0); }, 0);
    }));
    el.innerHTML = data.map(function (d, i) {
      return '<div class="bar" data-i="' + i + '">' + keys.map(function (k) {
        return '<i class="' + (k.className || '') + '" style="height:' + ((d[k.key] || 0) / max) * 100 + '%"></i>';
      }).join('') + '</div>';
    }).join('') + '<div class="tip"></div>';
    var tip = el.querySelector('.tip');
    el.addEventListener('mousemove', function (e) {
      var bar = e.target.closest('.bar'); if (!bar) return;
      var d = data[+bar.dataset.i];
      var r = el.getBoundingClientRect(), b = bar.getBoundingClientRect();
      tip.innerHTML = o.label ? o.label(d) : keys.map(function (k) {
        return '<div class="between"><span>' + esc(k.key) + '</span><b>' + esc(d[k.key]) + '</b></div>';
      }).join('');
      tip.style.left = Math.min(Math.max(b.left - r.left + b.width / 2, 75), r.width - 75) + 'px';
      tip.classList.add('show');
    });
    el.addEventListener('mouseleave', function () { tip.classList.remove('show'); });
  };

  // ---------------------------------------------------------------- router
  /**
   * Hash router. resolve(root, sub) returns the view HTML; chrome(html, root, sub)
   * optionally wraps it in a shell. Returns { rerender, go }.
   */
  var router = function (o) {
    var mountSel = o.mount || '#app';
    var render = function () {
      var h = location.hash.replace(/^#\/?/, '') || o.fallback || '';
      var parts = h.split('/');
      var root = parts[0] || o.fallback || '';
      var sub = parts[1];
      var html = o.resolve(root, sub);
      var el = $(mountSel);
      el.innerHTML = o.chrome ? o.chrome(html, root, sub) : html;
      if (o.after) o.after(root, sub);
    };
    var api = {
      render: render,
      rerender: function () { var y = window.scrollY; render(); window.scrollTo(0, y); },
      go: function (hash) { location.hash = hash; },
    };
    window.addEventListener('hashchange', function () {
      closeModal(); closeDrawer(); closePopover();
      render();
      window.scrollTo(0, 0);
    });
    return api;
  };

  /**
   * Keyboard shortcuts. Keys: 'mod+k', '?', or a 'g o' style sequence.
   * Ignores keystrokes typed into inputs.
   */
  var shortcuts = function (map) {
    var pending = 0, prefix = '';
    document.addEventListener('keydown', function (e) {
      var k = e.key.toLowerCase();
      var mod = e.metaKey || e.ctrlKey;
      if (mod) {
        var combo = 'mod+' + k;
        if (map[combo]) { e.preventDefault(); map[combo](e); }
        return;
      }
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      if (map[e.key]) { map[e.key](e); return; }
      if (pending && Date.now() - pending < 1200) {
        var seq = prefix + ' ' + k;
        pending = 0;
        if (map[seq]) map[seq](e);
        return;
      }
      if (Object.keys(map).some(function (m) { return m.indexOf(k + ' ') === 0; })) {
        pending = Date.now(); prefix = k;
      }
    });
  };

  // ---------------------------------------------------------------- misc
  var downloadCSV = function (filename, header, rows) {
    var csv = [header].concat(rows).map(function (r) {
      return r.map(function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    return rows.length;
  };

  // Global behaviour, skipped when there is no DOM (tests, SSR).
  if (typeof document !== 'undefined') {
    // Escape closes any overlay.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); closeDrawer(); closePopover(); }
    });
    // A click outside a popover (and outside its [data-popover] trigger) closes it.
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.notifs') && !e.target.closest('[data-popover]')) closePopover();
    });
  }

  return {
    version: '1.0.0',
    $: $, $$: $$, esc: esc, attrs: attrs,
    icons: icons, icon: icon,
    addIcons: function (more) { Object.keys(more).forEach(function (k) { icons[k] = more[k]; }); },
    theme: theme,
    btn: btn, iconBtn: iconBtn, pill: pill, avatar: avatar, toggle: toggle, seg: seg,
    meter: meter, dots: dots, progress: progress, kbd: kbd,
    card: card, kpi: kpi, tabs: tabs, field: field, search: search, table: table,
    empty: empty, timeline: timeline,
    rail: rail, topbar: topbar, shell: shell,
    modal: modal, closeModal: closeModal, drawer: drawer, closeDrawer: closeDrawer,
    popover: popover, closePopover: closePopover, confirm: confirm, toast: toast, palette: palette,
    series: series, sparkline: sparkline, lineChart: lineChart, donut: donut, ring: ring, barChart: barChart,
    router: router, shortcuts: shortcuts, downloadCSV: downloadCSV,
  };
});
