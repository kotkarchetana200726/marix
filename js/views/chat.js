// ORCA Marine Bridge Console — Generative Canvas (/#chat)
// Dual-mode: connects to Spring Boot POST /api/chat (SSE) or falls back to simulated engine.

import { GenerativeUIRenderer, GenerativeAgentBridge } from '../services/generativeUI.js';
import { CanvasRenderer, SpringBootBridge } from '../services/renderer.js';

export function renderChatView(container, { i18n, soundEngine }) {
  const bridge       = new GenerativeAgentBridge();
  const sbBridge     = new SpringBootBridge(); // Spring Boot SSE bridge

  container.innerHTML = `
    <div class="chat-canvas-view">      <!-- Message Stream Canvas -->
      <div class="canvas-stream-container" id="chat-stream-box">

        <!-- Tactical Presets (hidden once first query is submitted) -->
        <div class="empty-canvas-panel" id="canvas-empty-state">
          <div style="font-size: 3rem; margin-bottom: 12px;">⚓</div>
          <h2 class="font-display" style="font-size: 1.5rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 8px;">
            Bridge Reasoning Intercom
          </h2>
          <p class="font-data" style="font-size: 0.80rem; color: var(--muted); max-width: 540px; text-align: center; line-height: 1.6; margin-bottom: 24px;">
            Transmit an operational query. ORCA streams its chain-of-thought and then 
            <strong style="color: var(--brass);">dynamically generates the exact UI components</strong> needed to answer.
          </p>
          <div class="font-data text-brass" style="font-size: 0.68rem; letter-spacing: 0.1em; margin-bottom: 12px;">
            ▶ TACTICAL PRESETS — CLICK TO TRANSMIT
          </div>
          <div class="tactical-presets-grid" style="width: 100%; max-width: 700px;">
            <button class="preset-chip-btn" data-query="Assess cyclone alert and sea state hazard near Mumbai coast">
              <span>🌪️</span><span>Cyclone &amp; Sea State (Mumbai)</span>
            </button>
            <button class="preset-chip-btn" data-query="Find high-yield fishing zones with thermal fronts on Konkan coast">
              <span>🐟</span><span>PFZ Discovery (Konkan Coast)</span>
            </button>
            <button class="preset-chip-btn" data-query="Safe route vs shortest route from Veraval to Ratnagiri">
              <span>🚢</span><span>Route Planner (Veraval → Ratnagiri)</span>
            </button>
            <button class="preset-chip-btn" data-query="Analyze SST anomaly and chlorophyll upwelling dynamics">
              <span>🔬</span><span>SST &amp; Upwelling Research</span>
            </button>
          </div>
        </div>

        <!-- Live Message Thread (simulated engine / legacy) -->
        <div id="messages-thread"></div>

        <!-- ══ BACKEND CANVAS ══════════════════════════════════
             #canvas is owned by CanvasRenderer (renderer.js).
             It renders components from the Spring Boot SSE stream.
             The CanvasRenderer clears and repopulates this div on
             each result event; do not manipulate it directly.
        ═══════════════════════════════════════════════════════ -->
        <div id="canvas" style="margin-top: 16px;"></div>

      </div>

      <!-- Ship Intercom Bar (Bottom Anchored) -->
      <div class="intercom-input-bar">
        <div class="intercom-meta-row">
          <div class="intercom-chan-select">
            <span>📻</span>
            <span class="text-brass font-data" style="font-weight: 700;">VHF-CH 16 / MULTIMODAL REASONING BRIDGE</span>
          </div>
          <div class="intercom-tx-indicator" id="tx-status">
            <span class="intercom-tx-dot"></span>
            <span id="tx-status-text" class="font-data" style="font-size: 0.70rem;">TX READY</span>
          </div>
          <button id="btn-clear-log" class="btn-tactical btn-tactical-sm font-data" style="font-size: 0.65rem; padding: 3px 8px;">
            🗑 CLEAR LOG
          </button>
        </div>
        <form class="intercom-form" id="chat-form">
          <textarea
            id="chat-input"
            class="intercom-textarea"
            placeholder="Transmit operational query... (e.g. 'Assess cyclone risk near Mumbai' or 'Find best fishing zones')"
            rows="1"
          ></textarea>
          <button type="submit" class="btn-tactical btn-tactical-amber" style="height: 44px; padding: 0 18px; white-space: nowrap;">
            📡 TRANSMIT
          </button>
        </form>
      </div>
    </div>
  `;

  const streamBox  = container.querySelector('#chat-stream-box');
  const emptyState  = container.querySelector('#canvas-empty-state');
  const thread      = container.querySelector('#messages-thread');
  const canvasEl    = container.querySelector('#canvas');

  // Attach the backend CanvasRenderer to the #canvas div
  const canvasRenderer = new CanvasRenderer(canvasEl);
  const form = container.querySelector('#chat-form');
  const input = container.querySelector('#chat-input');
  const txStatusText = container.querySelector('#tx-status-text');

  // Preset buttons
  container.querySelectorAll('.preset-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (soundEngine) soundEngine.playTacticalBeep();
      submit(btn.getAttribute('data-query'));
    });
  });

  // Enter key in textarea
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    submit(text);
  });

  container.querySelector('#btn-clear-log').addEventListener('click', () => {
    thread.innerHTML = '';
    emptyState.style.display = 'flex';
    if (soundEngine) soundEngine.playMechanicalClick();
  });

  async function submit(promptText) {
    emptyState.style.display = 'none';
    if (soundEngine) soundEngine.playTransmissionSound();

    // ── BACKEND PATH (primary) ─────────────────────────────
    // Streams status → result events from POST /api/chat.
    // CanvasRenderer handles all rendering; no need to touch #canvas manually.
    sbBridge.streamTo(promptText, canvasRenderer).catch(function(e) {
      console.warn('[Chat] SpringBootBridge error:', e);
    });

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // ── 1. USER MESSAGE BUBBLE ──────────────────────────────────────────
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-msg user';
    userBubble.innerHTML = `
      <div class="msg-header" style="justify-content: flex-end;">
        <span class="font-data" style="font-size: 0.68rem;">BRIDGE OFFICER</span>
        <span class="text-muted">•</span>
        <span class="font-data text-muted" style="font-size: 0.68rem;">${timestamp}</span>
      </div>
      <div class="msg-content-user">${_escape(promptText)}</div>
    `;
    thread.appendChild(userBubble);

    // ── 2. AGENT RESPONSE SHELL ─────────────────────────────────────────
    const msgId = `msg-${Date.now()}`;
    const agentBubble = document.createElement('div');
    agentBubble.className = 'chat-msg agent';
    agentBubble.id = msgId;
    agentBubble.innerHTML = `
      <div class="msg-header">
        <span class="beacon-pulse" style="width: 5px; height: 5px;"></span>
        <span class="font-data text-brass" style="font-weight: 700; font-size: 0.72rem;">ORCA REASONING AGENT</span>
        <span class="text-muted">•</span>
        <span class="font-data text-muted" style="font-size: 0.68rem;">${timestamp}</span>
        <span class="genui-status-badge panel-badge badge-amber" style="margin-left: 6px;">⚙ SYNTHESIZING...</span>
      </div>
      <div class="msg-content-agent bezel-panel">

        <!-- Chain-of-Thought Reasoning Trace -->
        <div class="genui-steps font-data" style="
          font-size: 0.70rem; 
          color: var(--brass); 
          display: flex; 
          flex-direction: column; 
          gap: 3px; 
          margin-bottom: 10px;
          padding: 8px 10px;
          background: rgba(10,16,20,0.5);
          border: 1px solid var(--chart-line);
          border-radius: var(--radius);
        "></div>

        <!-- Streaming Prose Answer -->
        <div class="genui-prose agent-prose-text" style="margin-bottom: 14px;">
          <span class="text-muted font-data" style="font-size: 0.78rem; font-style: italic;">Initializing reasoning pipeline...</span>
        </div>

        <!-- Generative UI Component Mount Point -->
        <div class="genui-card-deck" style="
          display: flex; 
          flex-direction: column; 
          gap: 12px;
        "></div>
      </div>
    `;
    thread.appendChild(agentBubble);
    streamBox.scrollTop = streamBox.scrollHeight;

    // ── 3. ATTACH GENERATIVE UI RENDERER TO THIS BUBBLE ─────────────────
    const renderer = new GenerativeUIRenderer(agentBubble);

    // Auto-scroll as content streams in
    const scrollObserver = new MutationObserver(() => {
      streamBox.scrollTop = streamBox.scrollHeight;
    });
    scrollObserver.observe(agentBubble, { childList: true, subtree: true });

    // Update TX status
    txStatusText.textContent = 'TRANSMITTING...';
    txStatusText.style.color = 'var(--phosphor-amber)';

    // ── 4. STREAM AGENT EVENTS → RENDERER ────────────────────────────────
    // Each event could be a prose delta, reasoning step, or a COMPONENT SPEC.
    // The renderer handles all of them — this is the Generative UI loop.
    await bridge.streamTo(promptText, renderer);

    // Done
    txStatusText.textContent = 'TX READY';
    txStatusText.style.color = 'var(--phosphor-green)';
    scrollObserver.disconnect();
    streamBox.scrollTop = streamBox.scrollHeight;

    if (soundEngine) soundEngine.playTacticalChirp();
  }

  function _escape(str) {
    return str.replace(/[&<>'"]/g, t => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t]));
  }
}
