# FleetFlow AI

**AI agents that ask before they act.** A logistics CRM run by six AI agents (dispatch, routes, exceptions, customers, fleet and reporting), plus the marketing site that sells it.

No build step, no dependencies: plain HTML, CSS and JavaScript.

| Path | What it is |
| --- | --- |
| `index.html` | Marketing site: hero with the live product embedded, agents, autonomy dial, sandbox, kill switch, audit log, pricing, FAQ |
| `app/` | Product prototype (hash-routed single-page app) |

## Product screens (`app/`)

Every icon in the sidebar opens a working screen. State is kept in memory, so approvals, assignments and toggles carry across screens until you reload.

| Route | Screen |
| --- | --- |
| `#/overview` | Home: KPIs with sparklines, live network map, "Needs your decision", shipments by status, agent activity, fleet health |
| `#/agents` | AI agents overview (dark KPI banner + six agent cards) |
| `#/agents/:id` | Agent detail: autonomy per capability, 30-day chart, guardrails, recent decisions, **Test in sandbox** |
| `#/inbox` | Approvals: agent reasoning, options scored, approve / override (override requires a reason), undo |
| `#/shipments` | Shipments table with status tabs and search; row opens a drawer with timeline and AI driver suggestion |
| `#/dispatch` | Dispatch board: drag-and-drop columns, one-click "Assign" to the suggested driver, drivers with HOS bars |
| `#/routes` | Live routes: animated trucks on a Bay Area map, route list, approve the proposed reroute |
| `#/exceptions` | Exceptions: severity list, prepared fix, evidence, approve / escalate / reopen |
| `#/customers` | Customer accounts with health; drawer with the Customer Agent conversation and reply composer |
| `#/fleet` | Vehicles with health rings, fuel, alerts and the maintenance schedule |
| `#/reports` | Ask the Operations Analyst, on-time trend, cost per mile, hours saved by agent, lane margins |
| `#/activity` | Activity log with filters, search and CSV export |
| `#/settings/:tab` | Organization, Team & roles, Notifications, Integrations, AI & automation, Billing, Security |

Global: **⌘K / Ctrl+K** command palette, notifications popover, **Pause all agents** modal, **New shipment** form, `?` for shortcuts, `g` + letter to jump (g o, g i, g s, g d, g r, g e…).

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 for the site or http://localhost:8000/app/ for the product.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). For GitHub Pages: Settings → Pages → deploy from this branch, root folder.
