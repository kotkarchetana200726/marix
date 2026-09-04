// ORCA Marine Bridge Console — Persona Generative Chat Section (/#chat)
// Multilingual, Voice-First, Generative UI Chat Canvas with Central Mock Marine Intelligence Integration

import { GenerativeAgentBridge, GenerativeUIRenderer } from '../services/generativeUI.js';
import { SpringBootBridge, CanvasRenderer } from '../services/renderer.js';
import { voiceService, FISHERMAN_I18N, prepareSpeechText } from '../services/voiceService.js';
import { detectOrResolveLanguage } from '../data/mockResponses.js';
import { setGlobalLanguage } from '../data/translations.js';

export function renderChatView(container, { i18n, soundEngine, persona = 'fisherman', initialQuery = '' }) {
  const bridge = new GenerativeAgentBridge();
  const sbBridge = new SpringBootBridge();

  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const activeRole = urlParams.get('role') || persona || 'fisherman';
  let activeChatLang = localStorage.getItem('orca_chat_lang') || localStorage.getItem('orca_fisherman_lang') || 'en';

  const roleMeta = {
    fisherman: { title: 'FISHERMAN SAFETY CHAT', icon: '🎣', badge: 'badge-green', color: 'var(--phosphor-green)' },
    researcher: { title: 'MARINE RESEARCH WORKSPACE', icon: '🔬', badge: 'badge-amber', color: 'var(--brass)' },
    government: { title: 'COASTAL AUTHORITY CENTER', icon: '🛡️', badge: 'badge-red', color: 'var(--radar-red)' },
    business: { title: 'MARINE BUSINESS OPERATIONS', icon: '🚢', badge: 'badge-amber', color: 'var(--phosphor-amber)' }
  };

  const roleInfo = roleMeta[activeRole] || roleMeta.fisherman;
  const fDict = FISHERMAN_I18N[activeChatLang] || FISHERMAN_I18N.en;

  container.innerHTML = `
    <div class="chat-view-container" style="display: flex; flex-direction: column; height: calc(100vh - 120px); max-width: 1400px; margin: 0 auto; padding: 12px 16px;">
      
      <!-- Top Persona Status Header Strip -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(10,16,20,0.9); padding: 8px 16px; border-bottom: 2px solid ${roleInfo.color}; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="#/" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; padding: 4px 10px; font-size: 0.72rem;">
            ← Change Role
          </a>
          <span style="font-size: 1.2rem;">${roleInfo.icon}</span>
          <strong class="font-data text-parchment-bright" style="font-size: 0.88rem;">${roleInfo.title}</strong>
          <span class="panel-badge ${roleInfo.badge}" style="font-size: 0.65rem;">${activeRole.toUpperCase()}</span>
          
          <span class="font-data text-brass" style="font-size: 0.68rem; opacity: 0.85; border: 1px solid var(--brass); padding: 2px 8px; border-radius: 12px;">
            Demo Mode • Simulated Marine Data
          </span>
        </div>

        <!-- Actions: New Chat Button, Voice Pause Button & Language Selector -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <button id="btn-top-voice-pause" class="btn-tactical text-amber font-data" style="display: none; padding: 5px 12px; font-size: 0.74rem; font-weight: 700; cursor: pointer; align-items: center; gap: 6px;">
            <span>⏸️</span> <span id="top-voice-pause-label">Pause Voice</span>
          </button>
          
          <button id="btn-canvas-new-chat" class="btn-tactical btn-tactical-green font-data" style="padding: 5px 14px; font-size: 0.74rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span>✨</span> <span>+ NEW CHAT</span>
          </button>
          
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="font-data text-muted" style="font-size: 0.70rem;">LANGUAGE:</span>
            <div class="lang-selector" style="display: flex; gap: 4px; background: rgba(10,16,20,0.8); padding: 3px; border: 1px solid var(--brass); border-radius: var(--radius);">
              <button class="chat-lang-btn ${activeChatLang === 'en' ? 'active' : ''}" data-clang="en" style="padding: 4px 10px; font-size: 0.72rem; font-weight: 700;">English</button>
              <button class="chat-lang-btn ${activeChatLang === 'hi' ? 'active' : ''}" data-clang="hi" style="padding: 4px 10px; font-size: 0.72rem; font-weight: 700;">हिन्दी</button>
              <button class="chat-lang-btn ${activeChatLang === 'mr' ? 'active' : ''}" data-clang="mr" style="padding: 4px 10px; font-size: 0.72rem; font-weight: 700;">मराठी</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout Grid: Chat Canvas Left, Persistent Map Right -->
      <div style="display: grid; grid-template-columns: 1fr 340px; gap: 14px; flex: 1; overflow: hidden; margin-top: 10px;">
        
        <!-- Message Stream Canvas -->
        <div class="canvas-stream-container" id="chat-stream-box" style="flex: 1; display: flex; flex-direction: column; overflow-y: auto; padding-right: 6px;">

          <!-- Tactical Presets (hidden once first query is submitted) -->
          <div class="empty-canvas-panel bezel-panel" id="canvas-empty-state" style="padding: 24px 18px; background: rgba(18,27,34,0.65);">
            <div style="font-size: 2.5rem; margin-bottom: 8px; display:flex; justify-content:center;">${roleInfo.icon}</div>
            <h2 class="font-display" style="font-size: 1.4rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 6px; text-align: center;">
              ${activeRole === 'fisherman' ? (fDict.prompt_heading || 'What would you like to know?') : 'ORCA Marine Intelligence Assistant'}
            </h2>
            <p class="font-data" style="font-size: 0.80rem; color: var(--muted); max-width: 580px; text-align: center; line-height: 1.5; margin: 0 auto 16px auto;">
              Ask ORCA any marine question below. Tap the <strong style="color: var(--phosphor-green);">🎙️ microphone button</strong> to speak or select a quick prompt.
            </p>

            <div class="font-data text-brass" style="font-size: 0.70rem; letter-spacing: 0.10em; text-align: center; margin-bottom: 12px; font-weight: 700; text-transform: uppercase;">
              ▶ STAKEHOLDER DEMO QUESTIONS — TAP TO ASK
            </div>
            
            <!-- STAKEHOLDER PERSONA CHIPS -->
            <div class="tactical-presets-grid" id="chat-presets-grid" style="width: 100%; max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
              ${_renderPersonaPresetChips(activeRole, activeChatLang, fDict)}
            </div>
          </div>

          <!-- Canvas Action Strip (Active during conversation) -->
          <div id="canvas-actions-strip" style="display: none; justify-content: space-between; align-items: center; background: rgba(10,16,20,0.9); border: 1px solid var(--chart-line); border-radius: var(--radius); padding: 6px 12px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="beacon-pulse" style="width: 6px; height: 6px;"></span>
              <span class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700;">CANVAS CONVERSATION</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button type="button" id="btn-strip-voice-pause" class="btn-tactical text-amber font-data" style="display: none; padding: 4px 10px; font-size: 0.70rem; font-weight: 700; cursor: pointer;">
                ⏸️ Pause Voice
              </button>
              <button type="button" id="btn-strip-voice-stop" class="btn-tactical text-red font-data" style="display: none; padding: 4px 10px; font-size: 0.70rem; font-weight: 700; cursor: pointer;">
                ⏹️ Stop
              </button>
              <button type="button" id="btn-strip-new-chat" class="btn-tactical btn-tactical-green font-data" style="padding: 4px 12px; font-size: 0.70rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                <span>✨</span> <span>+ NEW CHAT</span>
              </button>
            </div>
          </div>

          <!-- Live Message Thread -->
          <div id="messages-thread"></div>

          <!-- BACKEND CANVAS (#canvas is owned by CanvasRenderer) -->
          <div id="canvas" style="margin-top: 16px;"></div>

        </div>

        <!-- Persistent Right Sidebar: Live Mini Map & Location Telemetry -->
        <div style="display: flex; flex-direction: column; gap: 12px; height: 100%;">
          <div class="bezel-panel" style="padding: 12px; background: rgba(18,27,34,0.85); display: flex; flex-direction: column; flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--chart-line); padding-bottom: 6px; margin-bottom: 8px;">
              <span class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700;">🗺️ LIVE SECTOR MAP</span>
              <span class="panel-badge badge-green" style="font-size: 0.60rem;">RATNAGIRI COAST</span>
            </div>
            
            <div id="chat-mini-map" style="width: 100%; height: 260px; border-radius: var(--radius); border: 1px solid var(--chart-line); background: var(--bg-void); margin-bottom: 10px;"></div>

            <div style="background: rgba(10,16,20,0.6); padding: 10px; border: 1px solid var(--chart-line); border-radius: var(--radius); font-family: var(--font-data); font-size: 0.72rem; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div>SST: <strong class="text-green">28.4°C</strong></div>
              <div>CHLOROPHYLL: <strong class="text-green">2.8 mg/m³</strong></div>
              <div>WIND: <strong class="text-amber">18 km/h SW</strong></div>
              <div>WAVES: <strong class="text-parchment-bright">1.4 m</strong></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Ship Intercom Bar (Bottom Anchored) with VOICE MIC BUTTON -->
      <div class="intercom-input-bar" style="margin-top: 10px;">
        <div class="intercom-meta-row">
          <div class="intercom-chan-select">
            <span>📻</span>
            <span class="text-brass font-data" style="font-weight: 700; font-size: 0.72rem;">VHF-CH 16 / MULTIMODAL REASONING BRIDGE</span>
          </div>
          <div class="intercom-tx-indicator" id="tx-status">
            <span class="intercom-tx-dot"></span>
            <span id="tx-status-text" class="font-data" style="font-size: 0.70rem;">TX READY</span>
          </div>

          <!-- Active Voice Reading Controls (Pause / Stop) -->
          <div id="chat-voice-pill" style="display: none; align-items: center; gap: 6px; background: rgba(10,16,20,0.85); border: 1px solid var(--brass); border-radius: var(--radius); padding: 3px 10px;">
            <span class="beacon-pulse" style="width: 5px; height: 5px; background: var(--phosphor-green);"></span>
            <span id="chat-voice-status" class="font-data text-green" style="font-size: 0.68rem; font-weight: 700;">VOICE: READING</span>
            <button type="button" id="btn-global-voice-pause" class="btn-tactical btn-tactical-sm text-amber" style="padding: 2px 8px; font-size: 0.65rem; cursor: pointer;">⏸️ Pause</button>
            <button type="button" id="btn-global-voice-stop" class="btn-tactical btn-tactical-sm text-red" style="padding: 2px 8px; font-size: 0.65rem; cursor: pointer;">⏹️ Stop</button>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; margin-left: auto;">
            <button type="button" id="btn-new-chat-bottom" class="btn-tactical btn-tactical-green font-data" style="font-size: 0.68rem; padding: 3px 12px; font-weight: 700; cursor: pointer;">
              ✨ + NEW CHAT
            </button>
            <button type="button" id="btn-clear-log" class="btn-tactical btn-tactical-sm font-data" style="font-size: 0.65rem; padding: 3px 10px; cursor: pointer;">
              🗑 CLEAR LOG
            </button>
          </div>
        </div>
        
        <form class="intercom-form" id="chat-form" style="display: flex; align-items: center; gap: 10px;">
          <!-- VOICE MIC BUTTON -->
          <button type="button" id="btn-chat-mic" class="mic-pulse-btn" style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%); border: 2px solid var(--parchment-bright); color: #0A1014; font-size: 1.3rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s ease;">
            🎙️
          </button>

          <input 
            type="text" 
            id="chat-input" 
            class="intercom-textarea" 
            placeholder="${activeRole === 'fisherman' ? (activeChatLang === 'mr' ? 'काहीही विचारा (उदा. उद्या मासेमारी सुरक्षित आहे का?)...' : activeChatLang === 'hi' ? 'कुछ भी पूछें (जैसे क्या कल मछली पकड़ना सुरक्षित है?)...' : 'Ask ORCA in your language (e.g. Is it safe to fish tomorrow?)...') : 'Ask ORCA marine intelligence platform...'}" 
            style="height: 44px; font-size: 0.90rem; padding: 0 14px; flex: 1;"
          />
          
          <button type="submit" class="btn-tactical btn-tactical-green" style="height: 44px; padding: 0 20px; font-weight: 700; font-size: 0.88rem; flex-shrink: 0;">
            TRANSMIT
          </button>
        </form>
      </div>

    </div>
  `;

  // Attach DOM Listeners
  const streamBox = container.querySelector('#chat-stream-box');
  const emptyState = container.querySelector('#canvas-empty-state');
  const thread = container.querySelector('#messages-thread');
  const form = container.querySelector('#chat-form');
  const input = container.querySelector('#chat-input');
  const txStatusText = container.querySelector('#tx-status-text');
  const chatMicBtn = container.querySelector('#btn-chat-mic');
  const canvasMount = container.querySelector('#canvas');
  const canvasRenderer = new CanvasRenderer(canvasMount);

  // Language buttons
  container.querySelectorAll('.chat-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-clang');
      if (lang) {
        activeChatLang = lang;
        localStorage.setItem('orca_chat_lang', lang);
        localStorage.setItem('orca_fisherman_lang', lang);
        setGlobalLanguage(lang);
        if (soundEngine) soundEngine.playMechanicalClick();
        renderChatView(container, { i18n, soundEngine, persona: activeRole, initialQuery: '' });
      }
    });
  });

  // Voice Microphone STT
  if (chatMicBtn) {
    chatMicBtn.addEventListener('click', () => {
      if (voiceService.isListening) {
        voiceService.stopListening();
        chatMicBtn.style.transform = 'scale(1)';
      } else {
        chatMicBtn.style.transform = 'scale(1.15)';
        if (soundEngine) soundEngine.playTacticalBeep();

        voiceService.startListening({
          lang: activeChatLang,
          onResult: (transcript) => {
            chatMicBtn.style.transform = 'scale(1)';
            input.value = transcript;
            submit(transcript);
          },
          onError: () => {
            chatMicBtn.style.transform = 'scale(1)';
          },
          onEnd: () => {
            chatMicBtn.style.transform = 'scale(1)';
          }
        });
      }
    });
  }

  // Preset chip handlers
  container.querySelectorAll('.preset-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (soundEngine) soundEngine.playTacticalBeep();
      submit(btn.getAttribute('data-query'));
    });
  });

  // Enter key
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

  // Central New Chat / Canvas Reset Handler
  function resetToNewChat() {
    voiceService.stopSpeaking();
    thread.innerHTML = '';
    canvasMount.innerHTML = '';
    emptyState.style.display = 'block';
    const canvasStrip = container.querySelector('#canvas-actions-strip');
    if (canvasStrip) canvasStrip.style.display = 'none';
    input.value = '';
    txStatusText.textContent = 'TX READY';
    txStatusText.style.color = 'var(--phosphor-green)';
    const voicePill = container.querySelector('#chat-voice-pill');
    if (voicePill) voicePill.style.display = 'none';
    const topVoiceBtn = container.querySelector('#btn-top-voice-pause');
    if (topVoiceBtn) topVoiceBtn.style.display = 'none';
    if (soundEngine) soundEngine.playMechanicalClick();
    input.focus();
  }

  // Bind All New Chat triggers across canvas & toolbar
  ['#btn-canvas-new-chat', '#btn-strip-new-chat', '#btn-new-chat-bottom', '#btn-clear-log'].forEach(selector => {
    const el = container.querySelector(selector);
    if (el) el.addEventListener('click', resetToNewChat);
  });

  // Global & Canvas Voice Controls
  const globalPauseBtn = container.querySelector('#btn-global-voice-pause');
  const globalStopBtn = container.querySelector('#btn-global-voice-stop');
  const topVoicePauseBtn = container.querySelector('#btn-top-voice-pause');
  const stripVoicePauseBtn = container.querySelector('#btn-strip-voice-pause');
  const stripVoiceStopBtn = container.querySelector('#btn-strip-voice-stop');

  function handleVoiceTogglePause() {
    voiceService.togglePause();
  }

  if (globalPauseBtn) globalPauseBtn.addEventListener('click', handleVoiceTogglePause);
  if (topVoicePauseBtn) topVoicePauseBtn.addEventListener('click', handleVoiceTogglePause);
  if (stripVoicePauseBtn) stripVoicePauseBtn.addEventListener('click', handleVoiceTogglePause);

  if (globalStopBtn) globalStopBtn.addEventListener('click', () => voiceService.stopSpeaking());
  if (stripVoiceStopBtn) stripVoiceStopBtn.addEventListener('click', () => voiceService.stopSpeaking());

  // Listen to voiceService state changes to update all pause buttons seamlessly
  voiceService.onStateChange((state) => {
    const voicePill = container.querySelector('#chat-voice-pill');
    const voiceStatus = container.querySelector('#chat-voice-status');
    const topVoiceBtn = container.querySelector('#btn-top-voice-pause');
    const topPauseLabel = container.querySelector('#top-voice-pause-label');
    const stripPause = container.querySelector('#btn-strip-voice-pause');
    const stripStop = container.querySelector('#btn-strip-voice-stop');

    if (state.speaking) {
      if (voicePill) voicePill.style.display = 'inline-flex';
      if (topVoiceBtn) topVoiceBtn.style.display = 'inline-flex';
      if (stripPause) stripPause.style.display = 'inline-flex';
      if (stripStop) stripStop.style.display = 'inline-flex';

      if (state.paused) {
        if (voiceStatus) {
          voiceStatus.textContent = 'VOICE: PAUSED';
          voiceStatus.className = 'font-data text-amber';
        }
        if (globalPauseBtn) globalPauseBtn.textContent = '▶️ Resume';
        if (topPauseLabel) topPauseLabel.textContent = 'Resume Voice';
        if (stripPause) stripPause.textContent = '▶️ Resume Voice';
        container.querySelectorAll('.btn-chat-pause').forEach(btn => {
          btn.innerHTML = '▶️ Resume';
        });
      } else {
        if (voiceStatus) {
          voiceStatus.textContent = 'VOICE: READING';
          voiceStatus.className = 'font-data text-green';
        }
        if (globalPauseBtn) globalPauseBtn.textContent = '⏸️ Pause';
        if (topPauseLabel) topPauseLabel.textContent = 'Pause Voice';
        if (stripPause) stripPause.textContent = '⏸️ Pause Voice';
        container.querySelectorAll('.btn-chat-pause').forEach(btn => {
          btn.innerHTML = '⏸️ Pause';
        });
      }
    } else {
      if (voicePill) voicePill.style.display = 'none';
      if (topVoiceBtn) topVoiceBtn.style.display = 'none';
      if (stripPause) stripPause.style.display = 'none';
      if (stripStop) stripStop.style.display = 'none';
      if (globalPauseBtn) globalPauseBtn.textContent = '⏸️ Pause';
      if (topPauseLabel) topPauseLabel.textContent = 'Pause Voice';
      if (stripPause) stripPause.textContent = '⏸️ Pause Voice';
      container.querySelectorAll('.btn-chat-pause').forEach(btn => {
        btn.innerHTML = '⏸️ Pause';
      });
    }
  });

  // Persistent Right Mini Map Initialization
  requestAnimationFrame(() => {
    if (typeof L !== 'undefined') {
      const mapEl = container.querySelector('#chat-mini-map');
      if (mapEl) {
        try {
          mapEl.innerHTML = '';
          const miniMap = L.map(mapEl, {
            center: [16.99, 73.31],
            zoom: 8,
            zoomControl: false,
            attributionControl: false
          });

          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 18, subdomains: 'abcd'
          }).addTo(miniMap);

          L.marker([16.99, 73.31]).bindPopup('<b>Ratnagiri Coast Sector</b><br>SST: 28.4°C | Wave: 1.4m').addTo(miniMap);
          setTimeout(() => miniMap.invalidateSize(), 150);
        } catch (e) {
          console.warn('[Chat Map Error]:', e);
        }
      }
    }

    if (initialQuery) {
      setTimeout(() => submit(decodeURIComponent(initialQuery)), 200);
    }
  });

  async function submit(promptText) {
    emptyState.style.display = 'none';
    const canvasStrip = container.querySelector('#canvas-actions-strip');
    if (canvasStrip) canvasStrip.style.display = 'flex';

    if (soundEngine) soundEngine.playTransmissionSound();

    const resolvedLang = detectOrResolveLanguage(promptText, activeChatLang);

    // Stream SSE to backend canvas
    sbBridge.streamTo(promptText, canvasRenderer, resolvedLang).catch(e => console.warn('[SpringBootBridge Error]:', e));

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // 1. User Message
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-msg user';
    userBubble.innerHTML = `
      <div class="msg-header" style="justify-content: flex-end;">
        <span class="font-data" style="font-size: 0.68rem;">${activeRole.toUpperCase()} USER</span>
        <span class="text-muted">•</span>
        <span class="font-data text-muted" style="font-size: 0.68rem;">${timestamp}</span>
      </div>
      <div class="msg-content-user">${_escape(promptText)}</div>
    `;
    thread.appendChild(userBubble);

    const isFisherman = activeRole === 'fisherman';

    // 2. Agent Response Shell
    const agentBubble = document.createElement('div');
    agentBubble.className = 'chat-msg agent';
    agentBubble.innerHTML = `
      <div class="msg-header" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
        <span class="beacon-pulse" style="width: 5px; height: 5px;"></span>
        <span class="font-data text-brass" style="font-weight: 700; font-size: 0.72rem;">${isFisherman ? 'ORCA MARINE ASSISTANT' : 'ORCA REASONING AGENT'} [${resolvedLang.toUpperCase()}]</span>
        <span class="text-muted">•</span>
        <span class="font-data text-muted" style="font-size: 0.68rem;">${timestamp}</span>
        <span class="genui-status-badge panel-badge badge-amber" style="margin-left: 6px;">⚙ ${resolvedLang === 'mr' ? 'उत्तर तयार होत आहे...' : resolvedLang === 'hi' ? 'उत्तर तैयार हो रहा है...' : 'SYNTHESIZING...'}</span>
        
        <div class="agent-voice-toolbar" style="margin-left: auto; display: none; align-items: center; gap: 5px;">
          <button class="btn-chat-speak btn-tactical btn-tactical-sm text-green" style="padding: 2px 8px; font-size: 0.68rem; cursor: pointer;">
            🔊 ${resolvedLang === 'mr' ? 'ऐका' : resolvedLang === 'hi' ? 'सुनें' : 'Listen'}
          </button>
          <button class="btn-chat-pause btn-tactical btn-tactical-sm text-amber" style="padding: 2px 8px; font-size: 0.68rem; cursor: pointer;">
            ⏸️ ${resolvedLang === 'mr' ? 'थांबवा' : resolvedLang === 'hi' ? 'रोकें' : 'Pause'}
          </button>
          <button class="btn-chat-stop btn-tactical btn-tactical-sm text-red" style="padding: 2px 8px; font-size: 0.68rem; cursor: pointer;">
            ⏹️ ${resolvedLang === 'mr' ? 'बंद करा' : resolvedLang === 'hi' ? 'बंद करें' : 'Stop'}
          </button>
        </div>
      </div>
      <div class="msg-content-agent bezel-panel">
        <!-- HIDE TECHNICAL STEPS LOGS FOR FISHERMAN -->
        <div class="genui-steps font-data" style="${isFisherman ? 'display: none;' : 'font-size: 0.72rem; color: var(--brass); display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; padding: 10px 12px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);'}"></div>
        <div class="genui-prose agent-prose-text" style="margin-bottom: 14px;">
          <span class="text-muted font-data" style="font-size: 0.78rem; font-style: italic;">${resolvedLang === 'mr' ? 'सागरी माहिती तपासत आहे...' : resolvedLang === 'hi' ? 'समुद्री जानकारी जाँच रहे हैं...' : 'Initializing marine response...'}</span>
        </div>
        <div class="genui-card-deck" style="display: flex; flex-direction: column; gap: 12px;"></div>
      </div>
    `;
    thread.appendChild(agentBubble);
    streamBox.scrollTop = streamBox.scrollHeight;

    const renderer = new GenerativeUIRenderer(agentBubble);

    txStatusText.textContent = 'TRANSMITTING...';
    txStatusText.style.color = 'var(--phosphor-amber)';

    // Stream events matching exact language contract
    const streamResult = await bridge.streamTo(promptText, renderer, resolvedLang);

    txStatusText.textContent = 'TX READY';
    txStatusText.style.color = 'var(--phosphor-green)';
    streamBox.scrollTop = streamBox.scrollHeight;

    // Reveal Audio Toolbar
    const voiceToolbar = agentBubble.querySelector('.agent-voice-toolbar');
    if (voiceToolbar) voiceToolbar.style.display = 'inline-flex';

    // Automatic TTS readout of exact screen data
    const responseProse = agentBubble.querySelector('.genui-prose')?.textContent || '';
    const screenSpeechText = streamResult?.speech_text || responseProse;

    if (screenSpeechText) {
      voiceService.speak(screenSpeechText, resolvedLang);
    }

    const speakBtn = agentBubble.querySelector('.btn-chat-speak');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        const latestProse = agentBubble.querySelector('.genui-prose')?.textContent || '';
        voiceService.speak(streamResult?.speech_text || latestProse, resolvedLang);
      });
    }

    const pauseBtn = agentBubble.querySelector('.btn-chat-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        voiceService.togglePause();
      });
    }

    const stopBtn = agentBubble.querySelector('.btn-chat-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        voiceService.stopSpeaking();
      });
    }
  }

  function _escape(str) {
    return str.replace(/[&<>'"]/g, t => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t]));
  }
}

function _renderPersonaPresetChips(role, lang, fDict) {
  if (role === 'fisherman') {
    if (lang === 'mr') {
      return `
        <button class="preset-chip-btn" data-query="आज मासेमारीसाठी चांगली जागा कुठे आहे?">
          <span>🎣</span><span>"आज मासेमारीसाठी चांगली जागा कुठे आहे?"</span>
        </button>
        <button class="preset-chip-btn" data-query="उद्या सकाळी मासेमारी करणे सुरक्षित आहे का?">
          <span>🌊</span><span>"उद्या सकाळी मासेमारी करणे सुरक्षित आहे का?"</span>
        </button>
        <button class="preset-chip-btn" data-query="हवामान आणि भरती-ओहोटीची स्थिती कशी आहे?">
          <span>🌦️</span><span>"हवामान आणि भरती-ओहोटीची स्थिती कशी आहे?"</span>
        </button>
        <button class="preset-chip-btn" data-query="काही वादळाचा किंवा विजांचा इशारा आहे का?">
          <span>⚠️</span><span>"काही वादळाचा किंवा विजांचा इशारा आहे का?"</span>
        </button>
        <button class="preset-chip-btn" data-query="सुरक्षित मार्ग कोणता आहे?">
          <span>🧭</span><span>"सुरक्षित मार्ग कोणता आहे?"</span>
        </button>
      `;
    }
    if (lang === 'hi') {
      return `
        <button class="preset-chip-btn" data-query="आज मछली पकड़ने के लिए सबसे अच्छी जगह कहाँ है?">
          <span>🎣</span><span>"आज मछली पकड़ने की सबसे अच्छी जगह कहाँ है?"</span>
        </button>
        <button class="preset-chip-btn" data-query="क्या कल सुबह मछली पकड़ना सुरक्षित है?">
          <span>🌊</span><span>"क्या कल सुबह मछली पकड़ना सुरक्षित है?"</span>
        </button>
        <button class="preset-chip-btn" data-query="मौसम और ज्वार-भाटा की स्थिति कैसी है?">
          <span>🌦️</span><span>"मौसम और ज्वार-भाटा की स्थिति कैसी है?"</span>
        </button>
        <button class="preset-chip-btn" data-query="क्या कोई चक्रवात या बिजली की चेतावनी है?">
          <span>⚠️</span><span>"क्या कोई चक्रवात या बिजली की चेतावनी है?"</span>
        </button>
        <button class="preset-chip-btn" data-query="सबसे सुरक्षित रास्ता कौन सा है?">
          <span>🧭</span><span>"सबसे सुरक्षित रास्ता कौन सा है?"</span>
        </button>
      `;
    }
    return `
      <button class="preset-chip-btn" data-query="Where is the nearest Potential Fishing Zone today?">
        <span>🎣</span><span>"Where is the nearest Potential Fishing Zone today?"</span>
      </button>
      <button class="preset-chip-btn" data-query="Is it safe to go fishing tomorrow morning?">
        <span>🌊</span><span>"Is it safe to go fishing tomorrow morning?"</span>
      </button>
      <button class="preset-chip-btn" data-query="What are the tide, weather and sea conditions near my fishing location?">
        <span>🌦️</span><span>"What are the tide, weather and sea conditions?"</span>
      </button>
      <button class="preset-chip-btn" data-query="Are there any lightning or cyclone alerts in my area?">
        <span>⚠️</span><span>"Are there any lightning or cyclone alerts?"</span>
      </button>
      <button class="preset-chip-btn" data-query="What is the safest route to the fishing zone?">
        <span>🧭</span><span>"What is the safest route to the fishing zone?"</span>
      </button>
    `;
  }

  if (role === 'researcher') {
    if (lang === 'mr') {
      return `
        <button class="preset-chip-btn" data-query="कोणत्या भागात जास्त क्लोरोफिल आणि अनुकूल तापमान आहे?">
          <span>🔬</span><span>"कोणत्या भागात जास्त क्लोरोफिल आणि अनुकूल तापमान आहे?"</span>
        </button>
        <button class="preset-chip-btn" data-query="या भागात माशांची उत्पादकता का कमी झाली आहे?">
          <span>📈</span><span>"या भागात माशांची उत्पादकता का कमी झाली आहे?"</span>
        </button>
        <button class="preset-chip-btn" data-query="तीनही क्षेत्रांमधील मासेमारी क्षमतेची तुलना करा.">
          <span>📊</span><span>"तीनही क्षेत्रांमधील मासेमारी क्षमतेची तुलना करा."</span>
        </button>
      `;
    }
    if (lang === 'hi') {
      return `
        <button class="preset-chip-btn" data-query="किन क्षेत्रों में उच्च क्लोरोफिल और अनुकूल तापमान है?">
          <span>🔬</span><span>"किन क्षेत्रों में उच्च क्लोरोफिल और अनुकूल तापमान है?"</span>
        </button>
        <button class="preset-chip-btn" data-query="इस तटीय क्षेत्र में मछली उत्पादकता क्यों कम हुई है?">
          <span>📈</span><span>"इस तटीय क्षेत्र में मछली उत्पादकता क्यों कम हुई है?"</span>
        </button>
        <button class="preset-chip-btn" data-query="तीनों क्षेत्रों की मत्स्य क्षमता की तुलना करें।">
          <span>📊</span><span>"तीनों क्षेत्रों की मत्स्य क्षमता की तुलना करें।"</span>
        </button>
      `;
    }
    return `
      <button class="preset-chip-btn" data-query="Which regions show high chlorophyll concentration and favourable sea surface temperature?">
        <span>🔬</span><span>"Which regions show high chlorophyll concentration and favourable SST?"</span>
      </button>
      <button class="preset-chip-btn" data-query="Why has fish productivity declined in this coastal region?">
        <span>📈</span><span>"Why has fish productivity declined in this coastal region?"</span>
      </button>
      <button class="preset-chip-btn" data-query="Compare the fishing potential of the three regions.">
        <span>📊</span><span>"Compare the fishing potential of the three regions."</span>
      </button>
    `;
  }

  if (role === 'government') {
    if (lang === 'mr') {
      return `
        <button class="preset-chip-btn" data-query="कोणत्या किनारी भागात सध्या जास्त सागरी धोका आहे?">
          <span>⚠️</span><span>"कोणत्या किनारी भागात सध्या जास्त सागरी धोका आहे?"</span>
        </button>
        <button class="preset-chip-btn" data-query="काही सक्रिय सागरी धोके किंवा प्रतिबंधित क्षेत्रे आहेत का?">
          <span>🚨</span><span>"काही सक्रिय सागरी धोके किंवा प्रतिबंधित क्षेत्रे आहेत का?"</span>
        </button>
      `;
    }
    if (lang === 'hi') {
      return `
        <button class="preset-chip-btn" data-query="किन तटीय क्षेत्रों में वर्तमान में उच्च समुद्री जोखिम है?">
          <span>⚠️</span><span>"किन तटीय क्षेत्रों में वर्तमान में उच्च समुद्री जोखिम है?"</span>
        </button>
        <button class="preset-chip-btn" data-query="क्या कोई सक्रिय समुद्री खतरे या प्रतिबंधित क्षेत्र हैं?">
          <span>🚨</span><span>"क्या कोई सक्रिय समुद्री खतरे या प्रतिबंधित क्षेत्र हैं?"</span>
        </button>
      `;
    }
    return `
      <button class="preset-chip-btn" data-query="Which coastal areas currently have elevated marine risk?">
        <span>⚠️</span><span>"Which coastal areas currently have elevated marine risk?"</span>
      </button>
      <button class="preset-chip-btn" data-query="Are there any active marine hazards?">
        <span>🚨</span><span>"Are there any active marine hazards?"</span>
      </button>
    `;
  }

  if (lang === 'mr') {
    return `
      <button class="preset-chip-btn" data-query="सध्याच्या समुद्राच्या स्थितीत माझ्या जहाजासाठी सर्वात सुरक्षित मार्ग कोणता आहे?">
        <span>🧭</span><span>"माझ्या जहाजासाठी सर्वात सुरक्षित मार्ग कोणता आहे?"</span>
      </button>
    `;
  }
  if (lang === 'hi') {
    return `
      <button class="preset-chip-btn" data-query="वर्तमान समुद्री परिस्थितियों में मेरे जहाज के लिए सबसे सुरक्षित मार्ग कौन सा है?">
        <span>🧭</span><span>"मेरे जहाज के लिए सबसे सुरक्षित मार्ग कौन सा है?"</span>
      </button>
    `;
  }
  return `
    <button class="preset-chip-btn" data-query="What is the safest route for my vessel considering current sea conditions?">
      <span>🧭</span><span>"What is the safest route for my vessel considering current sea conditions?"</span>
    </button>
  `;
}
