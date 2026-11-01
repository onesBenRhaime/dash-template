# FleetFlow AI

**AI agents that ask before they act.** A logistics CRM run by six AI agents (dispatch, routes, exceptions, customers, fleet and reporting), plus the marketing site that sells it.

No build step, no dependencies: plain HTML, CSS and JavaScript.

| Path | What it is |
| --- | --- |
| `index.html` | Marketing site: hero with the live product embedded, agents, autonomy dial, sandbox, kill switch, audit log, pricing, FAQ |
| `app/` | Product prototype (hash-routed single-page app) |

## Product screens (`app/`)

- `#/agents`: **AI agents** overview with a dark KPI banner ("1,912 actions today, 94% needed no human…") and six agent cards showing status, metrics, latest action and autonomy bar
- `#/agents/:id`: **Agent detail** with mission, approval stats, per-capability autonomy controls (Observe → Recommend → Draft → Approve first → Autonomous), a 30-day actions chart with tooltip, guardrails and recent decisions
  - **Test in sandbox**: opens the *Sandbox results* modal, which replays your draft policy on last week's loads, then *Publish draft*
- `#/settings`: **Settings → AI & automation** with the default autonomy level, permissions by capability, data access, global running toggle, approvers and policies
- `#/activity`: **Activity log** with working filters (agent / decision / outcome), search and CSV export
- **Pause all agents**: confirmation modal with impact summary, duration, reason and team notification. Pausing updates every screen, and you can resume or undo it.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 for the site or http://localhost:8000/app/ for the product.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). For GitHub Pages: Settings → Pages → deploy from this branch, root folder.
