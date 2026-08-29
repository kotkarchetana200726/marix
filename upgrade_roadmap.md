# ORCA Frontend Upgrade Roadmap
## Preparing for AI Agent Backend Integration

The ORCA Bridge Console is live and looking great. This document outlines every frontend upgrade needed to make it **production-ready for AI agent integration**, grouped by priority.

---

> [!NOTE]
> The screenshot confirms the Bridge Console design is fully functional — dark hull background, brass bezels, live GPS clock, radar animation, all working. Now we harden it for the backend.

---

## How AI Agents Will Connect to This Frontend

```
┌──────────────────────────────────────────────────────────────┐
│ ORCA FRONTEND (This Project)                                 │
│                                                              │
│  User Query → GenerativeAgentBridge → SSE/WebSocket         │
│                    ↓                         ↓               │
│           Simulated Engine        Live FastAPI Backend       │
│           (works today)           ─────────────────────      │
│                                   LangChain / CrewAI / ADK  │
│                                   ↓ Tool calls:              │
│                                     INCOIS API               │
│                                     NOAA SST API             │
│                                     IMD Radar                │
│                                     AIS Transponder          │
│                                   ↓ Streams back:            │
│                                     STEP events (CoT)        │
│                                     PROSE_DELTA events       │
│                                     COMPONENT events ← GenUI │
└──────────────────────────────────────────────────────────────┘
```

The frontend's **Generative UI Engine** ([generativeUI.js](file:///c:/Users/yasha/Downloads/MARINE/js/services/generativeUI.js)) is already designed to receive this stream. The upgrades below make that connection **robust, observable, and production-grade**.

---

## Phase 1 — Critical: Backend Connection Infrastructure

These must be built **before** connecting the first agent.

---

### 1.1 · SSE & WebSocket Connection Manager

**What's missing:** The current bridge does a single `fetch()` call. Real agents stream for 20–60 seconds and the connection can drop.

**New file:** `js/services/connectionManager.js`

```javascript
// Needs to handle:
class ConnectionManager {
  connectSSE(url, onEvent)      // Auto-reconnect with exponential backoff
  connectWebSocket(url)         // For real-time map data (AIS vessel positions)
  getConnectionHealth()         // Returns latency, drop count, last heartbeat
  setAuthHeader(token)          // JWT / API key injection
}
```

**Why it matters:** Without this, if the FastAPI server restarts or a network hiccup occurs mid-stream, the chat canvas will silently freeze with no recovery.

---

### 1.2 · Agent Tool-Call Inspector Card

**What's missing:** When your LangChain agent calls a real tool (e.g., `fetch_incois_pfz(lat=17.4, lon=72.3)`), the frontend shows nothing. Users see a gap in reasoning.

**New component:** `js/components/toolCallCard.js`

```
┌─ 🔧 TOOL CALL: fetch_incois_pfz ────────────────────┐
│ INPUT:  lat=17.42, lon=72.35, radius_nm=50           │
│ STATUS: ██████░░░░ EXECUTING... (1.2s)               │
│ OUTPUT: { pfz_zones: [...], confidence: 0.96 }  ✓    │
└──────────────────────────────────────────────────────┘
```

This is a **critical trust element** — it shows mariners the system is actually querying real INCOIS/NOAA data, not hallucinating.

**Agent SSE event format to expect:**
```json
{ "type": "TOOL_CALL", "tool": "fetch_incois_pfz", "args": {...}, "status": "EXECUTING" }
{ "type": "TOOL_RESULT", "tool": "fetch_incois_pfz", "output": {...}, "latency_ms": 1240 }
```

---

### 1.3 · Session & Conversation History Manager

**What's missing:** Every page refresh loses the chat history. Agents need context from previous turns.

**New file:** `js/services/sessionManager.js`

```javascript
class SessionManager {
  saveMessage(role, content, components)  // Persist to IndexedDB
  getHistory(limit = 10)                  // Last N turns for context window
  buildContextPayload()                   // Format history for API: [{role, content}]
  exportSession()                         // Download as JSON for debugging
  clearSession()
}
```

**Why it matters:** If a fisherman asks "Is the Konkan zone still safe?" as a follow-up, the agent needs to know what was said in the previous turn. Without this, every query is stateless.

---

### 1.4 · Real-Time Map WebSocket Layer

**What's missing:** The map shows static mock vessels. Real AIS data updates every 4 seconds.

**Upgrade to:** `js/views/map.js` + new `js/services/mapStream.js`

```javascript
// mapStream.js — subscribes to AIS WebSocket and updates Leaflet markers live
class MapStreamService {
  connect(wsUrl)                    // wss://marine-ais.gov.in/live/stream
  onVesselUpdate(mmsi, position)    // Update marker positions
  onHazardUpdate(hazardId, data)    // Update storm circle radius/center
  onPFZUpdate(zoneId, confidence)   // Update PFZ marker opacity/color
}
```

---

## Phase 2 — Agent Observability & Trust

These make the system *inspectable* — crucial for a safety-critical domain.

---

### 2.1 · Multi-Agent Orchestration Visualizer

When you use **CrewAI or LangGraph** with multiple specialized agents (PFZ Agent, Storm Risk Agent, Route Agent), the frontend needs to show which agent is active and which handed off to which.

**New component:** `js/components/agentOrchestrationCard.js`

```
┌─ 🤖 CREW ORCHESTRATION TRACE ─────────────────────────────┐
│                                                             │
│  [1] COORDINATOR AGENT ──────────────────────────── ✓ DONE │
│       └─ Parsed intent: STORM_RISK + PFZ_SEARCH            │
│                                                             │
│  [2] STORM RISK AGENT ───────────────────────── ██░░ 65%   │
│       └─ Tools: IMD Radar, INCOIS Wave Buoy                 │
│       └─ Retrieving: Cyclone Varuna track data...           │
│                                                             │
│  [3] PFZ DISCOVERY AGENT ──────────────────────── QUEUED   │
│       └─ Waiting for storm assessment to complete           │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.2 · Confidence & Explainability Badges

Every data value shown in a card should carry a **source + confidence** tag, pulled from the agent's response.

**Upgrade to:** All card components in [`cards.js`](file:///c:/Users/yasha/Downloads/MARINE/js/components/cards.js)

```
SST: 26.8°C  [NOAA Geo-Polar · 5km · 97% ✓]
              ↑ clicking this shows: data source, timestamp, model used
```

---

### 2.3 · Response Feedback System

Users should be able to flag incorrect agent outputs — this data trains the next model version.

**Add to each agent message bubble:**
```
[👍 ACCURATE]  [👎 INCORRECT]  [⚠️ REPORT HAZARD]  [🔗 SHARE]
```

Feedback posts to: `POST /api/orca/feedback { message_id, rating, correction? }`

---

### 2.4 · Agent Error & Fallback UI

When the backend returns a 500, times out, or the LLM refuses to answer, the UI must degrade gracefully rather than freezing.

**Three states to handle in** [`chat.js`](file:///c:/Users/yasha/Downloads/MARINE/js/views/chat.js):

| Error State | Display |
|---|---|
| Backend 5xx | Show red `⚠️ Reasoning Service Unavailable — Switching to simulation mode` banner |
| LLM rate limit (429) | Show `⏳ Agent capacity reached — retry in 45s` with countdown |
| Network timeout | Show reconnecting indicator with manual retry button |

---

## Phase 3 — UX Upgrades (High Impact)

These make the console feel professional, not prototype.

---

### 3.1 · Streaming Text Cursor & Token Counter

**Upgrade to:** [`generativeUI.js`](file:///c:/Users/yasha/Downloads/MARINE/js/services/generativeUI.js)

While prose is streaming in, show:
- Blinking `▌` cursor after last word (already partially done)
- Live token counter: `[tokens: 0 → 847]` in data font
- Elapsed time: `[time: 0.0s → 4.2s]`
- Tokens-per-second throughput: `[~200 tok/s]`

This tells mariners the system is alive and reasoning — not hung.

---

### 3.2 · Pinnable & Expandable Component Cards

Users should be able to:
- **Pin** a card to the sidebar for reference while asking a follow-up
- **Expand** a card to full-screen (especially the Risk Gauge and PFZ map)
- **Copy** card data as structured JSON for export

```javascript
// Each genui-card-mount gets:
<div class="genui-card-actions">
  <button title="Pin to sidebar">📌</button>
  <button title="Expand full screen">⛶</button>
  <button title="Copy as JSON">📋</button>
</div>
```

---

### 3.3 · Voice Input (Ship Intercom Mode)

Mariners at sea use voice. Add a mic button to the intercom bar:

```javascript
// js/services/voiceInput.js
class VoiceInputService {
  startListening()      // Web Speech API — SpeechRecognition
  stopListening()
  getTranscript()       // Auto-fills the textarea
  getLanguage()         // Adapts to EN/HI/MR setting
}
```

Activates with the 🎙️ button. Shows a waveform animation while recording.

---

### 3.4 · Shareable Query Links (Deep Links)

Add URL parameter support so specific queries can be shared:
```
http://localhost:8080/#/chat?query=cyclone+risk+near+Mumbai
```

When the page loads with a `?query=` parameter, it auto-submits that query. Useful for:
- Sharing a specific route assessment between crew members
- Bookmarking frequent operational queries
- Pre-loading the console for demo presentations

---

### 3.5 · Notification System (Toast + Bridge Alarm)

When the backend detects a new hazard while the user is on another page (e.g., browsing the Research charts), show a non-blocking toast:

```
┌─────────────────────────────────────────────────┐
│ 🚨 NEW ALERT: Cyclone Varuna upgraded to Cat 2  │
│    Risk Index jumped from 78 → 92               │
│    [VIEW ALERT]         [DISMISS]                │
└─────────────────────────────────────────────────┘
```

Plays a bridge alarm sound. Linked to the Safety page.

---

### 3.6 · Print / PDF Export of Safety Briefing

For pre-departure vessel safety briefings, allow exporting the current safety view as a formatted PDF:

```javascript
// Uses window.print() with a @media print stylesheet
// Formats: risk gauges as static SVGs, alert feed as table, timestamps in data font
```

---

## Phase 4 — Performance & PWA

---

### 4.1 · Service Worker (Offline Mode)

When a vessel is far offshore with spotty connectivity, the last-known data should still be viewable.

**New file:** `sw.js` (Service Worker)
- Caches: CSS, JS bundles, last agent response, last map tile set
- Shows offline banner: `⚠️ OFFLINE — Displaying cached telemetry from 14:32 UTC`

---

### 4.2 · Virtual Scrolling in Chat History

Long conversations (30+ messages with many component cards each) will lag. Replace the simple `flex` column with a virtual scroller:

```javascript
// Only render cards visible in the viewport + 2 buffer above/below
// Recycles DOM nodes as user scrolls up through history
```

---

### 4.3 · Bundle & Asset Optimization

When ready for production:
- Convert to **Vite** for ES module bundling + tree-shaking
- Lazy-load Leaflet and Chart.js only when those views are mounted
- Use CSS `content-visibility: auto` on off-screen panels

---

## Phase 5 — Security (Before Production)

---

| Area | Upgrade |
|---|---|
| **API Keys** | Never store in `localStorage` — use httpOnly cookies or a secure token vault |
| **CORS** | FastAPI backend must whitelist only the deployed frontend origin |
| **Input Sanitization** | The intercom textarea input must be sanitized before being sent to the agent to prevent prompt injection |
| **Rate Limiting (UI)** | Debounce the transmit button — prevent accidental spam to the expensive LLM API |
| **Content Security Policy** | Add `<meta http-equiv="Content-Security-Policy">` to prevent XSS via injected card HTML |

---

## Implementation Priority Matrix

```
                HIGH IMPACT
                    │
   1.2 Tool Call UI │ 1.1 SSE Manager
   2.1 Agent Orch.  │ 1.3 Session Mgr
   3.5 Toasts       │ 1.4 Map WebSocket
                    │
   ─────────────────┼──────────────────
                    │
   3.3 Voice Input  │ 4.1 Service Worker
   3.2 Pin Cards    │ 3.6 PDF Export
   3.4 Deep Links   │ 4.3 Bundling
                    │
                LOW IMPACT
         EASY ──────┴────── HARD
```

**Do first (before first agent demo):**  `1.1 → 1.2 → 1.3 → 2.4 (error handling) → 3.1 (token counter)`

**Do before hackathon submission:** `3.5 (toasts) → 2.1 (orchestration card) → 3.4 (deep links)`

**Do after winning:** `4.1 (PWA) → 4.3 (Vite) → Phase 5 (security)`

---

> [!TIP]
> The single highest-ROI upgrade for a hackathon judge is **2.1 — the Agent Orchestration Visualizer**. When a judge sees *"Crew Agent #1 → Storm Risk Agent → PFZ Agent → Coordinator synthesizing..."* streaming live, it makes the multi-agent architecture immediately tangible and impressive.
