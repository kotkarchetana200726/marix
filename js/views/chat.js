// ORCA Marine Bridge Console — Generative Canvas (/#chat)
// Dual-mode reasoning canvas with persistent tactical location, mini-map panel & voice-first multilingual chat

import { GenerativeUIRenderer, GenerativeAgentBridge } from '../services/generativeUI.js';
import { CanvasRenderer, SpringBootBridge } from '../services/renderer.js';
import { getMarineIcon } from '../components/components.js';
import { voiceService, FISHERMAN_I18N } from '../services/voiceService.js';

export function renderChatView(container, { i18n, soundEngine, currentLang = 'en' }) {
  const bridge       = new GenerativeAgentBridge();
  const sbBridge     = new SpringBootBridge(); // Spring Boot SSE bridge

  // Parse Role & Auto-Query from URL Hash
  const hashParts = window.location.hash.split('?');
  const queryParams = new URLSearchParams(hashParts[1] || '');
  const activeRole = queryParams.get('role') || 'fisherman'; // Default to fisherman mode for high accessibility
  const initialQuery = queryParams.get('q') || '';

  let activeChatLang = localStorage.getItem('orca_chat_lang') || currentLang || 'en';

  const personaTitles = {
    fisherman: { icon: '🛶', title: 'FISHERMAN CHAT MODE', badge: 'badge-green', sub: 'Voice-first simple language, fast advice & marine safety answers.' },
    researcher: { icon: '🔬', title: 'MARINE RESEARCHER WORKSPACE', badge: 'badge-amber', sub: 'Deep oceanographic evidence, satellite trends & research synthesis.' },
    government: { icon: '🛡️', title: 'COASTAL AUTHORITY CENTER', badge: 'badge-red', sub: 'Coastal situation awareness, active hazard alerts & incident monitoring.' },
    business: { icon: '🚢', title: 'MARINE OPERATIONS INTELLIGENCE', badge: 'badge-amber', sub: 'Pareto-optimal route safety, weather impacts & operational decisions.' }
  };

  const roleInfo = personaTitles[activeRole] || personaTitles.fisherman;
  const fDict = FISHERMAN_I18N[activeChatLang] || FISHERMAN_I18N.en;

  container.innerHTML = `
    <div class="chat-canvas-view">
      
      <!-- Main Reasoning Conversation & Canvas Area -->
      <div class="chat-main-area">
        
        <!-- Persona Active Banner & Language Selector -->
        <div class="telemetry-status-strip bezel-panel" style="padding: 10px 16px; background: rgba(18,27,34,0.9); border-left: 4px solid var(--phosphor-green); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <a href="#/" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; padding: 4px 10px; font-size: 0.72rem;">
              ← Change Role
            </a>
            <span style="font-size: 1.2rem;">${roleInfo.icon}</span>
            <strong class="font-data text-parchment-bright" style="font-size: 0.88rem;">${roleInfo.title}</strong>
            <span class="panel-badge ${roleInfo.badge}" style="font-size: 0.65rem;">${activeRole.toUpperCase()}</span>
          </div>

          <!-- Language Selector for Chat & Voice -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="font-data text-muted" style="font-size: 0.70rem;">LANGUAGE:</span>
            <div class="lang-selector" style="display: flex; gap: 4px; background: rgba(10,16,20,0.8); padding: 3px; border: 1px solid var(--brass); border-radius: var(--radius);">
              <button class="chat-lang-btn ${activeChatLang === 'en' ? 'active' : ''}" data-clang="en" style="padding: 4px 10px; font-size: 0.72rem; font-weight: 700;">EN</button>
              <button class="chat-lang-btn ${activeChatLang === 'hi' ? 'active' : ''}" data-clang="hi" style="padding: 4px 10px; font-size: 0.72rem; font-weight: 700;">हिन्दी</button>
              <button class="chat-lang-btn ${activeChatLang === 'mr' ? 'active' : ''}" data-clang="mr" style="padding: 4px 10px; font-size: 0.72rem; font-weight: 700;">मराठी</button>
            </div>
          </div>
        </div>

        <!-- Message Stream Canvas -->
        <div class="canvas-stream-container" id="chat-stream-box">

          <!-- Tactical Presets (hidden once first query is submitted) -->
          <div class="empty-canvas-panel bezel-panel" id="canvas-empty-state" style="padding: 28px 20px; background: rgba(18,27,34,0.65);">
            <div style="font-size: 2.8rem; margin-bottom: 10px; display:flex; justify-content:center;">🛶</div>
            <h2 class="font-display" style="font-size: 1.5rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 6px; text-align: center;">
              ${fDict.prompt_heading || 'What would you like to know?'}
            </h2>
            <p class="font-data" style="font-size: 0.82rem; color: var(--muted); max-width: 580px; text-align: center; line-height: 1.5; margin: 0 auto 20px auto;">
              Press the <strong style="color: var(--phosphor-green);">🎙️ microphone button</strong> below to speak your question in English, Hindi, or Marathi, or select a preset below.
            </p>

            <div class="font-data text-brass" style="font-size: 0.70rem; letter-spacing: 0.10em; text-align: center; margin-bottom: 12px; font-weight: 700; text-transform: uppercase;">
              ▶ ${fDict.quick_title || 'QUICK QUESTIONS — TAP TO ASK'}
            </div>
            
            <div class="tactical-presets-grid" style="width: 100%; max-width: 760px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
              <button class="preset-chip-btn" data-query="What are the fishing conditions near Mumbai today?">
                <span>🌦️</span><span>${fDict.q_weather || 'Will weather be safe today?'}</span>
              </button>
              <button class="preset-chip-btn" data-query="What is the sea condition near Mumbai?">
                <span>🌊</span><span>${fDict.q_sea || 'How are the waves?'}</span>
              </button>
              <button class="preset-chip-btn" data-query="Where are the potential fishing zones?">
                <span>🎣</span><span>${fDict.q_fishing || 'Is this a good time to fish?'}</span>
              </button>
              <button class="preset-chip-btn" data-query="Is there a cyclone risk near Mumbai?">
                <span>⚠️</span><span>${fDict.q_safety || 'Is there any danger near me?'}</span>
              </button>
              <button class="preset-chip-btn" data-query="Safe route vs shortest route from Veraval to Ratnagiri">
                <span>🧭</span><span>${fDict.q_route || 'Which route is safer?'}</span>
              </button>
            </div>
          </div>

          <!-- Live Message Thread -->
          <div id="messages-thread"></div>

          <!-- BACKEND CANVAS (#canvas is owned by CanvasRenderer) -->
          <div id="canvas" style="margin-top: 16px;"></div>

        </div>

        <!-- Ship Intercom Bar (Bottom Anchored) with VOICE MIC BUTTON -->
        <div class="intercom-input-bar">
          <div class="intercom-meta-row">
            <div class="intercom-chan-select">
              <span>📻</span>
              <span class="text-brass font-data" style="font-weight: 700; font-size: 0.72rem;">VHF-CH 16 / MULTIMODAL REASONING BRIDGE</span>
            </div>
            <div class="intercom-tx-indicator" id="tx-status">
              <span class="intercom-tx-dot"></span>
              <span id="tx-status-text" class="font-data" style="font-size: 0.70rem;">TX READY</span>
            </div>
            <button id="btn-clear-log" class="btn-tactical btn-tactical-sm font-data" style="font-size: 0.65rem; padding: 3px 10px;">
              🗑 CLEAR LOG
            </button>
          </div>
          
          <form class="intercom-form" id="chat-form" style="display: flex; align-items: center; gap: 10px;">
            <!-- VOICE MIC BUTTON -->
            <button type="button" id="btn-chat-mic" class="mic-pulse-btn" style="width: 48px; height: 44px; border-radius: var(--radius); background: linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%); border: 1px solid var(--parchment-bright); color: #0A1014; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(107,203,119,0.4); flex-shrink: 0;" title="Tap to speak your query">
              🎙️
            </button>

            <textarea
              id="chat-input"
              class="intercom-textarea"
              placeholder="${fDict.input_placeholder || 'Speak or type your question here...'}"
              rows="1"
            ></textarea>
            
            <button type="submit" class="btn-tactical btn-tactical-green" style="height: 44px; padding: 0 20px; white-space: nowrap; font-size: 0.85rem; font-weight: 700;">
              📡 TRANSMIT
            </button>
          </form>
        </div>
      </div>

      <!-- Persistent Tactical Location & Mini-Map Right Panel -->
      <aside class="chat-location-panel bezel-panel">
        <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--chart-line); padding-bottom: 8px; margin-bottom: 12px;">
          <div style="display:flex; align-items:center; gap:6px;">
            ${getMarineIcon('compass', 16, 'var(--brass)')}
            <span class="font-data text-brass" style="font-weight: 700; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;">CURRENT AREA</span>
          </div>
          <span class="panel-badge badge-green" style="font-size: 0.58rem;">LIVE MONITOR</span>
        </div>

        <div style="margin-bottom: 12px;">
          <div class="font-display" style="font-size: 1.05rem; font-weight: 700; color: var(--parchment-bright);">Arabian Sea</div>
          <div class="font-data text-muted" style="font-size: 0.70rem;">Maharashtra / Konkan Shelf</div>
          <div class="font-data text-amber" style="font-size: 0.75rem; font-weight: 700; margin-top: 2px;">
            📍 16.7° N &nbsp; 73.7° E
          </div>
        </div>

        <!-- Mini-Map Container -->
        <div id="chat-mini-map" class="chat-mini-map-box">
          <div style="position: absolute; inset:0; display:flex; align-items:center; justify-content:center; background: rgba(10,16,20,0.8);">
            <span class="font-data text-muted" style="font-size:0.68rem;">Loading Chart...</span>
          </div>
        </div>

        <!-- Telemetry Summary Cards -->
        <div class="chat-telemetry-mini-grid" style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div style="padding: 8px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <div style="display:flex; align-items:center; gap:4px; font-size: 0.65rem;" class="font-data text-muted">
              ${getMarineIcon('wind', 12, 'var(--phosphor-amber)')} WIND
            </div>
            <div class="font-data text-amber" style="font-size: 0.85rem; font-weight: 700; margin-top: 2px;">24 kts WSW</div>
          </div>

          <div style="padding: 8px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <div style="display:flex; align-items:center; gap:4px; font-size: 0.65rem;" class="font-data text-muted">
              ${getMarineIcon('wave', 12, 'var(--phosphor-amber)')} SWELL
            </div>
            <div class="font-data text-amber" style="font-size: 0.85rem; font-weight: 700; margin-top: 2px;">2.4m @ 11s</div>
          </div>

          <div style="padding: 8px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <div style="display:flex; align-items:center; gap:4px; font-size: 0.65rem;" class="font-data text-muted">
              ${getMarineIcon('thermometer', 12, 'var(--phosphor-green)')} SST
            </div>
            <div class="font-data text-green" style="font-size: 0.85rem; font-weight: 700; margin-top: 2px;">28.2°C</div>
          </div>

          <div style="padding: 8px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <div style="display:flex; align-items:center; gap:4px; font-size: 0.65rem;" class="font-data text-muted">
              ${getMarineIcon('warning', 12, 'var(--radar-red)')} HAZARD
            </div>
            <div class="font-data text-red" style="font-size: 0.85rem; font-weight: 700; margin-top: 2px;">MODERATE</div>
          </div>
        </div>

        <!-- Telemetry Status Footer -->
        <div style="margin-top: 14px; border-top: 1px solid var(--chart-line); padding-top: 8px; font-family: var(--font-data); font-size: 0.65rem; color: var(--muted); display: flex; flex-direction: column; gap: 4px;">
          <div style="display:flex; justify-content:space-between;">
            <span>ORCA CORE:</span> <strong class="text-green">READY</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>ACTIVE AGENTS:</span> <strong class="text-brass">5 / 5 ONLINE</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>AIS RELAY:</span> <strong class="text-parchment">120 NM MESH</strong>
          </div>
        </div>
      </aside>

    </div>
  `;

  const streamBox   = container.querySelector('#chat-stream-box');
  const emptyState  = container.querySelector('#canvas-empty-state');
  const thread      = container.querySelector('#messages-thread');
  const canvasEl    = container.querySelector('#canvas');

  // Attach the backend CanvasRenderer to the #canvas div
  const canvasRenderer = new CanvasRenderer(canvasEl);
  const form = container.querySelector('#chat-form');
  const input = container.querySelector('#chat-input');
  const txStatusText = container.querySelector('#tx-status-text');
  const chatMicBtn = container.querySelector('#btn-chat-mic');

  // Bind Language Switcher in Chat
  container.querySelectorAll('.chat-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const clang = btn.getAttribute('data-clang');
      if (clang && clang !== activeChatLang) {
        activeChatLang = clang;
        localStorage.setItem('orca_chat_lang', clang);
        if (soundEngine) soundEngine.playMechanicalClick();
        renderChatView(container, { i18n, soundEngine, currentLang: clang });
      }
    });
  });

  // Bind Microphone STT (Speech-to-Text) Button inside Chat Intercom Bar
  if (chatMicBtn) {
    chatMicBtn.addEventListener('click', () => {
      if (voiceService.isListening) {
        voiceService.stopListening();
        chatMicBtn.style.transform = 'scale(1)';
        chatMicBtn.style.background = 'linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%)';
      } else {
        chatMicBtn.style.transform = 'scale(1.15)';
        chatMicBtn.style.background = 'linear-gradient(135deg, var(--radar-red) 0%, #c0392b 100%)';
        if (soundEngine) soundEngine.playTacticalBeep();

        voiceService.startListening({
          lang: activeChatLang,
          onResult: (transcript) => {
            chatMicBtn.style.transform = 'scale(1)';
            chatMicBtn.style.background = 'linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%)';
            input.value = transcript;
            submit(transcript);
          },
          onError: (err) => {
            console.warn('[Chat Mic STT Error]:', err);
            chatMicBtn.style.transform = 'scale(1)';
            chatMicBtn.style.background = 'linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%)';
          },
          onEnd: () => {
            chatMicBtn.style.transform = 'scale(1)';
            chatMicBtn.style.background = 'linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%)';
          }
        });
      }
    });
  }

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

  // Initialize Persistent Mini Map
  requestAnimationFrame(() => {
    if (typeof L !== 'undefined') {
      const mapEl = container.querySelector('#chat-mini-map');
      if (mapEl) {
        try {
          mapEl.innerHTML = '';
          const miniMap = L.map(mapEl, {
            center: [16.7, 73.7],
            zoom: 7,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false
          });

          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 18, subdomains: 'abcd'
          }).addTo(miniMap);

          const icon = L.divIcon({
            className: '',
            html: '<div style="width:18px;height:18px;background:rgba(255,180,84,0.9);border:2px solid var(--parchment-bright);border-radius:50%;box-shadow:0 0 10px var(--phosphor-amber);animation:beacon-ping 2s infinite;"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });

          L.marker([16.7, 73.7], { icon: icon }).addTo(miniMap);
          setTimeout(() => { miniMap.invalidateSize(); }, 150);
        } catch (e) {
          console.warn('[Chat Mini-Map] Init error:', e);
        }
      }
    }

    // Auto-trigger initial query if passed in URL
    if (initialQuery) {
      setTimeout(() => {
        submit(decodeURIComponent(initialQuery));
      }, 250);
    }
  });

  async function submit(promptText) {
    emptyState.style.display = 'none';
    if (soundEngine) soundEngine.playTransmissionSound();

    // BACKEND PATH (primary)
    sbBridge.streamTo(promptText, canvasRenderer).catch(function(e) {
      console.warn('[Chat] SpringBootBridge error:', e);
    });

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // 1. USER MESSAGE BUBBLE
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-msg user';
    userBubble.innerHTML = `
      <div class="msg-header" style="justify-content: flex-end;">
        <span class="font-data" style="font-size: 0.68rem;">${activeRole ? activeRole.toUpperCase() + ' USER' : 'BRIDGE OFFICER'}</span>
        <span class="text-muted">•</span>
        <span class="font-data text-muted" style="font-size: 0.68rem;">${timestamp}</span>
      </div>
      <div class="msg-content-user">${_escape(promptText)}</div>
    `;
    thread.appendChild(userBubble);

    // 2. AGENT RESPONSE SHELL
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
          font-size: 0.72rem; 
          color: var(--brass); 
          display: flex; 
          flex-direction: column; 
          gap: 4px; 
          margin-bottom: 12px;
          padding: 10px 12px;
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

    // 3. ATTACH GENERATIVE UI RENDERER TO THIS BUBBLE
    const renderer = new GenerativeUIRenderer(agentBubble);

    // Auto-scroll as content streams in
    const scrollObserver = new MutationObserver(() => {
      streamBox.scrollTop = streamBox.scrollHeight;
    });
    scrollObserver.observe(agentBubble, { childList: true, subtree: true });

    // Update TX status
    txStatusText.textContent = 'TRANSMITTING...';
    txStatusText.style.color = 'var(--phosphor-amber)';

    // 4. STREAM AGENT EVENTS → RENDERER
    await bridge.streamTo(promptText, renderer);

    // Done
    txStatusText.textContent = 'TX READY';
    txStatusText.style.color = 'var(--phosphor-green)';
    scrollObserver.disconnect();
    streamBox.scrollTop = streamBox.scrollHeight;

    // 5. AUTOMATICALLY SPEAK RESPONSE ALOUD (TTS) IN SELECTED LANGUAGE
    const responseProse = agentBubble.querySelector('.genui-prose')?.textContent || '';
    if (responseProse) {
      voiceService.speak(responseProse, activeChatLang);
    }

    if (soundEngine) soundEngine.playTacticalChirp();
  }

  function _escape(str) {
    return str.replace(/[&<>'"]/g, t => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t]));
  }
}
