# ORCA Frontend Build Guide

## 1. Design Direction — "The Bridge Console"

### Why this direction

Most marine-tech UIs default to sky-blue gradients, wave icon sets, and rounded SaaS cards — forgettable, and it undersells ORCA's positioning as a *reasoning* system rather than a dashboard. This UI instead borrows its visual vocabulary from the actual instrument a fisherman or ship's officer would trust: a bridge console — analog gauges, brass-bezeled panels, radar sweeps, and nautical chart paper. It should feel like it's plotting a course, not tracking your steps.

### Token system

**Color** (name → hex → role)

| Token | Hex | Role |
|---|---|---|
| `--bg-void` | `#0A1014` | Page background — the hull |
| `--bg-panel` | `#121B22` | Card / panel background |
| `--brass` | `#C9A66B` | Borders, bezels, dividers |
| `--phosphor-amber` | `#FFB454` | Primary data glow, active state |
| `--phosphor-green` | `#6BCB77` | Safe / low-risk state |
| `--radar-red` | `#FF5C5C` | Danger / high-risk state |
| `--chart-line` | `#24333B` | Grid lines, chart-paper texture |
| `--parchment` | `#E9E2D0` | Primary text |
| `--muted` | `#7C8B93` | Secondary text, captions |

**Type** (3 roles — pick fonts once, don't deviate mid-build)

- **Display** — Fraunces (or Spectral) — used ONLY for the ORCA wordmark and page-level headings. Evokes an engraved brass nameplate. Use with restraint — never for body copy.
- **Body** — Inter / Public Sans — all prose, labels, buttons. Prioritizes legibility for non-technical users (fishermen, disaster-management staff).
- **Data** — IBM Plex Mono / JetBrains Mono — every number: coordinates, risk scores, timestamps, wind speeds, distances. If it's a measurement, it's monospace. This is a hard rule, not a preference — it's what makes the console feel like an instrument instead of an app.

**Layout concept**

```
┌──┬─────────────────────────────┐
│  │                             │
│ ⚓│      main content           │
│ 🗺│      (page-specific)        │
│ 🛡│                             │
│ 🚢│                             │
│ 🔬│                             │
│  │                             │
└──┴─────────────────────────────┘
 console
 rail (icon-only nav)
```

A slim, icon-only left rail — not a top navbar — keeps full width for the map/canvas and reinforces "console" over "app." Collapses to a bottom tab bar on mobile.

**Signature element**

The **Risk Gauge** — an SVG analog dial with a rotating needle, not a progress bar or a colored chip — is the one component every safety-touching page shares. It's the single visual a judge should remember after the demo ends. Build this before anything else in the design system.

**Motion — used functionally, not decoratively**

- Radar-sweep conic-gradient wedge for loading states (pairs naturally with widget loading messages)
- Needle rotation, eased, when the Risk Gauge receives new data
- No scroll-triggered fades, no hover-lift cards — motion stays functional, in keeping with the console framing

### CSS variables — add these to `css/style.css` before anything else

```css
:root {
  --bg-void: #0A1014;
  --bg-panel: #121B22;
  --brass: #C9A66B;
  --phosphor-amber: #FFB454;
  --phosphor-green: #6BCB77;
  --radar-red: #FF5C5C;
  --chart-line: #24333B;
  --parchment: #E9E2D0;
  --muted: #7C8B93;

  --font-display: 'Fraunces', serif;
  --font-body: 'Inter', sans-serif;
  --font-data: 'IBM Plex Mono', monospace;

  --radius: 5px;      /* mechanical, not soft-SaaS */
  --border: 1px solid var(--brass);
}
```

---

## 2. Site Map (multi-page)

| Route | Page | Job |
|---|---|---|
| `/` | Landing | Set the tone, one CTA into the console |
| `/chat` | Generative Canvas | Main screen — chat + streaming component cards |
| `/map` | Marine Map | Full-screen interactive map, layer toggles |
| `/safety` | Safety & Alerts | Active alerts feed, regional risk gauges |
| `/route` | Route Planner | Origin/destination, safe vs shortest comparison |
| `/research` | Research | Historical SST / chlorophyll / PFZ trend charts |
| `/admin` | Data Sources | Live/mock status per data adapter |

**Routing:** vanilla JS with no build step — use a small hash-based router (`#/chat`, `#/map`, ...). No server config needed, works from a single `index.html`, trivial to deploy for a hackathon.

---

## 3. Frontend Tasks

### 3.1 Setup & design system — do this first, the whole team depends on it
- [ ] Scaffold `index.html`, `css/style.css`, `js/app.js`, `js/router.js`
- [ ] Add the CSS variables above to `:root`
- [ ] Load Fraunces + Inter + IBM Plex Mono
- [ ] Build the chart-paper background texture (faint lat/long tick SVG or repeating-linear-gradient)
- [ ] Build the console rail nav (icon-only, active route highlighted in `--phosphor-amber`)
- [ ] Build the Risk Gauge SVG component in isolation, with fake data, before wiring it to anything

### 3.2 Landing (`/`)
- [ ] Hero: one plain-language line stating what ORCA does — no generic stat-card template
- [ ] Single CTA into `/chat`
- [ ] Radar-sweep ambient animation as the page's one moment of motion

### 3.3 Generative Canvas (`/chat`) — build this one first, it's the flagship screen
- [ ] Chat input bar, bottom-anchored, styled like a ship intercom rather than a messaging app
- [ ] Message history panel
- [ ] Renderer + validator wired to the component registry (RiskCard, PFZCard, WeatherCard, MarineMap, etc.)
- [ ] SSE connection so components stream in one at a time
- [ ] Empty state styled as a blank instrument panel, not a generic placeholder

### 3.4 Marine Map (`/map`)
- [ ] Leaflet init inside `<div id="map">`, dark tile layer matched to the console palette
- [ ] Layer toggle switches styled as physical toggles (brass + amber), not iOS-style pills
- [ ] PFZ zone markers, restricted-zone polygons
- [ ] Click-to-inspect popup styled as an instrument readout, not the default Leaflet popup

### 3.5 Safety & Alerts (`/safety`)
- [ ] Alert feed list (cyclone, lightning, high wave) using `--radar-red` for active alerts
- [ ] Regional risk gauges — reuse the Risk Gauge component, one per monitored zone
- [ ] Timestamp + source shown in mono type on every alert — explainability, not decoration

### 3.6 Route Planner (`/route`)
- [ ] Origin/destination inputs
- [ ] Side-by-side comparison: shortest route vs safe route (distance, risk, ETA)
- [ ] Map panel reused from `/map`, rendering two route lines (amber = safe, muted = shortest)

### 3.7 Research (`/research`)
- [ ] SST trend chart (Chart.js, `--chart-line` grid, amber data line)
- [ ] Chlorophyll trend chart
- [ ] PFZ occurrence over time
- [ ] Plain-language correlation summary panel (ties to the Ecosystem "Why?" engine)

### 3.8 Admin / Data Sources (`/admin`)
- [ ] Table of data adapters: source name, status (live/mock), last updated — mono type throughout
- [ ] Manual "refresh" action per source

### 3.9 Cross-cutting
- [ ] Responsive down to mobile (console rail collapses to a bottom tab bar under ~640px)
- [ ] Visible keyboard focus on every interactive element (brass outline, not the browser default)
- [ ] `prefers-reduced-motion` respected — disable the radar sweep and needle easing when set
- [ ] Language switcher (EN / HI / MR) in the console rail footer
- [ ] Contrast check: parchment-on-void and amber-on-void both meet WCAG AA at body-text sizes

---

## 4. Build order — if time runs out, stop after phase 3

1. Design system + console rail + Risk Gauge (the signature element)
2. Generative Canvas (`/chat`) fully working against mock data
3. Safety page (reuses the Risk Gauge, cheap once the canvas works)
4. Marine Map
5. Route Planner
6. Research + Admin — cut these first under time pressure; least demo-critical
