# Dash UI

A dependency-free dashboard kit: **one stylesheet and one script**, no build step, no framework.
About 8 KB + 10 KB gzipped.

```html
<link rel="stylesheet" href="ui/ui.css">
<script src="ui/ui.js"></script>
```

```js
document.body.innerHTML = UI.shell({
  rail: UI.rail({ items: [{ href: '#/', icon: 'grid', label: 'Overview', active: true }] }),
  main: UI.topbar({ title: 'Overview' }) +
        '<div class="kpi-row">' + UI.kpi({ label: 'Revenue', value: '$182K', tone: 'green' }) + '</div>',
});
```

Open [`ui/index.html`](index.html) for a live gallery of every component with copy-paste code,
[`../starter/`](../starter/) for a working dashboard in one file, and [`../app/`](../app/) for a
large example (13 screens).

## Install

Copy the `ui/` folder into your project. That's the whole install.

| File | What it is |
| --- | --- |
| `ui.css` | Tokens, reset, layout and every component style |
| `ui.js` | Classic script: defines `window.UI` (also works with `require`) |
| `ui.mjs` | ES module wrapper: `import UI from './ui/ui.mjs'` |
| `index.html` | The component gallery (not needed at runtime) |

Components return **HTML strings**, so they compose with template literals and work with any
rendering approach — plain DOM, a hash router, or inside a framework's `dangerouslySetInnerHTML`.
Overlays and charts take DOM nodes instead.

> `ui.css` includes a small reset (`box-sizing`, `body` type and background, button/anchor resets).
> Dropping it into an existing app will restyle those basics. To scope it, wrap your markup in a
> container and prefix the file's selectors, or take only the sections you need — it is plain CSS
> with no preprocessor.

## Theming

Every colour in the kit resolves to a CSS variable on `:root`. Override them anywhere and the whole
kit follows, including charts and overlays.

```css
:root {
  --accent: #0f766e;
  --radius: 10px;
  --font: "Söhne", system-ui, sans-serif;
}
```

Dark mode is built in. With no `data-theme` attribute the kit follows the operating system; set the
attribute to pin a theme:

```js
UI.theme.set('dark');     // 'light' | 'dark' | 'auto'
UI.theme.toggle();        // flips between light and dark
UI.theme.restore();       // re-applies the last choice from localStorage
UI.theme.accent('#be123c'); // rebrand at runtime
```

Token groups: **surfaces** (`--bg`, `--surface`, `--card`, `--card-2`, `--chip`, `--line`, `--line-2`,
`--track`, `--track-2`), **text** (`--ink`, `--ink-2`, `--on-ink`, `--muted`, `--muted-2`, `--muted-3`),
**accent** (`--accent-50` … `--accent-600`, `--accent`), **status** (`--green`, `--amber`, `--red`,
each with a `-soft` tint, plus `--amber-ink`, `--live`), and **always-dark** panels (`--dark`,
`--dark-2`, `--dark-line`) that stay dark in both themes. The gallery lists all of them with their
current values.

## API

### Atoms

| Call | Notes |
| --- | --- |
| `UI.btn({ label, icon, variant, size, href, attrs })` | `variant`: `dark`, `accent`, `danger`, `ghost`. `size`: `sm`, `xs`. With `href` it renders an `<a>`. |
| `UI.iconBtn({ icon, label, dot, attrs })` | Round icon button; `dot` adds an unread marker. |
| `UI.pill(text, tone, { plain, icon })` | `tone`: `green`, `amber`, `red`, `accent`, `gray`. `plain` drops the leading dot. |
| `UI.avatar({ name, initials, color, size })` | `size`: `sm`, `lg`. Initials are derived from `name`. |
| `UI.toggle(on, attrs)` | Switch. It renders state only — you handle the click. |
| `UI.seg({ options, value, lock, attrs })` | Segmented control. `lock` is an array of indexes that get a padlock. |
| `UI.meter(filled, total)` / `UI.dots(filled, total)` | Small level indicators. |
| `UI.progress(pct, { className })` | Bar. Add `big` or `sm` for height. |
| `UI.kbd('⌘K')` | Keyboard hint. |

### Blocks

| Call | Notes |
| --- | --- |
| `UI.card(html, { white, className, attrs })` | `white` uses the raised surface with a border. |
| `UI.kpi({ label, value, sub, tone, aside, html })` | Stat tile. `sub` accepts HTML (`<b class="up">+8%</b>`). `aside` is usually a sparkline. |
| `UI.tabs({ tabs, active, act })` | `tabs` are `[key, label, count]` or `{ key, label, count }`. Clicks emit `data-act="<act>" data-tab="<key>"`. |
| `UI.table({ columns, rows, empty, bodyId })` | `rows` are `<tr>` strings, so each cell stays yours. `bodyId` lets you refresh just the `<tbody>`. |
| `UI.field({ label, type, value, options, placeholder, hint, attrs })` | `type`: any input type, `select` (with `options`) or `textarea`. |
| `UI.search({ placeholder, id, value, kbd })` | With `id` it is a live input; without one it is a button that opens the palette. |
| `UI.empty({ icon, title, text, action })` | Empty state. |
| `UI.timeline([{ title, sub, meta, tag, done }])` | Vertical timeline. |

### Layout

| Call | Notes |
| --- | --- |
| `UI.shell({ rail, main })` | The app frame your router mounts into. |
| `UI.rail({ logo, items, footer, avatar })` | Icon sidebar. Items accept `{ href, icon, label, active, badge, className, attrs }`, plus `{ sep: true }` and `{ spacer: true }`. Collapses to a bottom bar under 760px. |
| `UI.topbar({ crumb, title, back, actions })` | Page header. `crumb` and `actions` accept HTML. |

CSS helpers: `.kpi-row` (4 tiles), `.cols-2` (wide + narrow), `.cols-3`, `.dlist` / `.ditem`
(icon + title + sub-line + trailing status), `.row`, `.between`, `.grow`, `.muted`, `.num`, `.mono`,
`.label`, `.sub`, `.h3`, `.link`. Add `framed` to `<body>` for the inset, rounded-card look.

### Overlays

```js
UI.toast('Changes saved');
UI.toast('6 agents paused', { undo: () => restore(), duration: 5000 });

UI.modal(html, { onMount: (el) => {} });   // UI.closeModal()
UI.drawer(html);                           // UI.closeDrawer()
UI.popover(anchorEl, html);                // UI.closePopover()

UI.confirm({
  title: 'Pause all agents?',
  text: 'Every agent stops acting right away.',
  danger: true,
  confirmLabel: 'Pause all agents',
  body: UI.field({ label: 'Reason', type: 'textarea' }),
  onConfirm: () => pauseAll(),
});

UI.palette({
  placeholder: 'Search pages and records…',
  items: [{ title: 'Overview', sub: 'Page', icon: 'grid', run: () => (location.hash = '#/') }],
});
```

Escape closes any overlay, a backdrop click closes modals and drawers, and any element with
`data-close` dismisses the overlay it sits in. Clicking outside a popover closes it — put
`data-popover` on the trigger so its own click is not treated as "outside". `items` for the palette
may be an array or a function returning one (useful when the list changes).

Modal and drawer markup uses these parts: `.mh` / `.mb` / `.mf` (modal header, body, footer) and
`.dh` / `.db` / `.df` (drawer). The gallery shows both in full.

### Charts

All inline SVG, coloured from tokens, no dependency.

```js
UI.sparkline(values, { color, width, height })
UI.lineChart(values, { min, max, target, targetLabel, labels: [[index, 'Oct 3']], color })
UI.donut([[79, 'var(--green)'], [4, 'var(--amber)']], size, stroke)
UI.ring(91, size)            // single percentage, colour-coded by value
UI.barChart(el, data, {      // stacked bars with a hover tooltip
  series: [{ key: 'auto' }, { key: 'ap', className: 'ap' }],
  label: (d) => `<div class="between"><span>Automatic</span><b>${d.auto}</b></div>`,
})
UI.series(seed, n, base, amp) // deterministic placeholder data
```

`UI.barChart` fills the element you pass, so give it `<div class="chart" id="x"></div>` with a height.

### Router and shortcuts

```js
const router = UI.router({
  mount: '#app',
  fallback: 'overview',
  resolve: (route, sub) => VIEWS[route] ? VIEWS[route](sub) : VIEWS.overview(),
  chrome: (html, route) => UI.shell({ rail: myRail(route), main: html }),
  after: (route, sub) => mountCharts(),
});
router.render();     // first paint
router.rerender();   // re-render in place, keeping scroll position
router.go('#/invoices');
```

It parses `#/route/sub`, re-renders on `hashchange` and closes open overlays on navigation.

```js
UI.shortcuts({
  'mod+k': () => UI.palette({ items }),   // ⌘K and Ctrl+K
  '?': () => showHelp(),
  'g o': () => (location.hash = '#/overview'),   // press g, then o
});
```

Keystrokes typed into inputs, textareas and selects are ignored.

### Utilities

```js
UI.icon('truck', 18)                 // 58 built-in icons, inherits currentColor
UI.addIcons({ gauge: '<circle .../>' })
UI.esc(userInput)                    // escape for interpolation
UI.$('#id') / UI.$$('.cls')
UI.downloadCSV('rows.csv', header, rows)   // returns the row count
```

Component functions do **not** escape HTML you pass into slots such as `sub`, `actions` or `crumb`,
because those are meant to accept markup. Wrap untrusted values in `UI.esc()`. Plain text arguments
(`label`, `title`, `value`) are escaped for you.

## Browser support

Modern evergreen browsers. The kit uses CSS custom properties, `:is()`-free selectors, flex/grid and
`Element.closest`. No polyfills, no transpiling.

## Licence

This repository has no licence file yet. Add one before publishing or sharing the kit, otherwise
default copyright applies and others cannot legally reuse it.
