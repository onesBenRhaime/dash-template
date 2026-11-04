# Dash Template

A reusable dashboard UI kit, plus a full product built with it.

Plain HTML, CSS and JavaScript. No build step, no dependencies, nothing to install.

| Folder | What it is | Open |
| --- | --- | --- |
| **`ui/`** | **The kit.** One stylesheet, one script, 58 icons, light and dark themes. Copy this folder into any project. | [Component gallery](ui/index.html) · [API docs](ui/README.md) |
| **`starter/`** | A working dashboard in a single file — rail, router, KPIs, table, drawer, CSV export, command palette. Copy it to start something new. | [Starter app](starter/index.html) |
| **`app/`** | FleetFlow AI: a 13-screen logistics CRM run by six AI agents. The large example that proves the kit. | [Full app](app/index.html) |
| **`index.html`** | Marketing site for FleetFlow, with the live product embedded. | [Landing page](index.html) |

```bash
python3 -m http.server 8000
```

Then open `localhost:8000/ui/` for the gallery, `/starter/` for the starter, or `/app/` for the app.

## Using the kit in your own project

Copy `ui/` and point two tags at it:

```html
<link rel="stylesheet" href="ui/ui.css">
<script src="ui/ui.js"></script>
```

```js
document.body.innerHTML = UI.shell({
  rail: UI.rail({
    logo: { href: '#/', icon: 'logo', label: 'Home' },
    items: [
      { href: '#/', icon: 'grid', label: 'Overview', active: true },
      { href: '#/orders', icon: 'box', label: 'Orders', badge: 4 },
    ],
    avatar: UI.avatar({ name: 'Alex Morgan', color: '#8b5a2b' }),
  }),
  main: UI.topbar({
    crumb: 'Finance',
    title: 'Overview',
    actions: UI.btn({ label: 'New invoice', icon: 'plus', variant: 'dark' }),
  }) + `<div class="kpi-row">
    ${UI.kpi({ label: 'Revenue', value: '$182.4K', sub: '<b class="up">+8.2%</b> vs average' })}
    ${UI.kpi({ label: 'On time', value: '96.1%', tone: 'green', sub: '<b class="up">+1.4 pts</b>' })}
  </div>`,
});
```

Everything else — buttons, tables, drawers, modals, the command palette, charts, the router and
keyboard shortcuts — is in [`ui/README.md`](ui/README.md). `UI` also works as a CommonJS module, and
`ui/ui.mjs` exports it as an ES module.

### Rebranding

Every colour is a CSS variable on `:root`, so one override re-themes the whole kit:

```css
:root { --accent: #0f766e; --radius: 10px; --font: "Söhne", system-ui, sans-serif; }
```

Dark mode follows the operating system by default; `UI.theme.set('dark' | 'light' | 'auto')` pins it
and `UI.theme.accent('#be123c')` changes the brand colour at runtime.

## The example app (`app/`)

FleetFlow AI — "AI agents that ask before they act". Six agents cover dispatch, routes, exceptions,
customers, fleet and reporting. State lives in memory, so approvals, assignments and toggles carry
across screens until you reload.

| Route | Screen |
| --- | --- |
| `#/overview` | KPIs with sparklines, live network map, decisions waiting, agent activity, fleet health |
| `#/agents` | Agent overview; `#/agents/:id` adds per-capability autonomy, a 30-day chart, guardrails and a policy sandbox |
| `#/inbox` | Approvals: the agent's reasoning, scored options, approve or override (override needs a reason) |
| `#/shipments` | Table with status tabs and search; a row opens a detail drawer |
| `#/dispatch` | Kanban board with drag and drop and one-click assignment |
| `#/routes` | Animated map, route list, approve the proposed reroute |
| `#/exceptions` | Severity list, prepared fix, evidence, approve or escalate |
| `#/customers` | Accounts with health; drawer with the agent's message thread |
| `#/fleet` | Vehicles with health rings and the maintenance schedule |
| `#/reports` | Ask-the-analyst answers, on-time trend, cost per mile, lane margins |
| `#/activity` | Filterable log with CSV export |
| `#/settings/:tab` | Organization, Team, Notifications, Integrations, AI & automation, Billing, Security |

Global: **⌘K / Ctrl+K** command palette, notifications, pause-all-agents, new shipment, `?` for
shortcuts, `g` + letter to jump between screens.

`app/app.css` holds only FleetFlow's own layouts (hero, agent cards, dispatch board, map, fleet
cards). Everything reusable lives in `ui/ui.css`.

## Deploying

Any static host works — GitHub Pages, Netlify, Vercel, Cloudflare Pages. For GitHub Pages:
Settings → Pages → deploy from this branch, root folder.

## Credits

The product UI was designed from a concept by **ui.iliasmiah000** on Instagram. Credit them, or
change the visual style enough to make it your own, before showing this publicly.

This repository has no licence file. Add one before sharing the kit, otherwise default copyright
applies and others cannot legally reuse it.
