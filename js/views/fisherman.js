// ORCA Marine Bridge Console — Fisherman Persona View (/#/fisherman)
// Voice-First Multilingual Marine Safety Companion

import { voiceService, FISHERMAN_I18N } from '../services/voiceService.js';

export function renderFishermanView(container, { i18n, soundEngine, currentLang = 'en' }) {
  let activeLang = localStorage.getItem('orca_fisherman_lang') || currentLang || 'en';
  if (!FISHERMAN_I18N[activeLang]) activeLang = 'en';

  const renderContent = () => {
    const dict = FISHERMAN_I18N[activeLang] || FISHERMAN_I18N.en;

    container.innerHTML = `
      <div class="fisherman-view" style="max-width: 900px; margin: 0 auto; padding: 20px 16px;">
        
        <!-- Fisherman Minimal Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--chart-line); padding-bottom: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <a href="#/" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; padding: 4px 10px; font-size: 0.75rem;">
                ← Change Role
              </a>
              <span class="panel-badge badge-green" style="font-size: 0.70rem;">🎣 FISHERMAN MODE</span>
              
              <!-- Direct Link to Full Chat Section -->
              <a href="#/chat?role=fisherman" class="btn-tactical btn-tactical-sm btn-tactical-green" style="text-decoration: none; padding: 4px 12px; font-size: 0.75rem; font-weight: 700;">
                💬 Open Chat Section →
              </a>
            </div>
            <h1 class="font-display" style="font-size: 1.6rem; font-weight: 700; color: var(--parchment-bright); margin: 6px 0 0 0;">
              🌊 ORCA <span style="font-size: 1.0rem; color: var(--brass); font-weight: 400;">— Your Marine Safety Companion</span>
            </h1>
          </div>

          <!-- Language Selector -->
          <div class="lang-selector" style="display: flex; gap: 6px; background: rgba(10,16,20,0.8); padding: 4px; border: 1px solid var(--brass); border-radius: var(--radius);">
            <button class="lang-btn ${activeLang === 'en' ? 'active' : ''}" data-flang="en" style="padding: 6px 12px; font-weight: 700;">English</button>
            <button class="lang-btn ${activeLang === 'mr' ? 'active' : ''}" data-flang="mr" style="padding: 6px 12px; font-weight: 700;">मराठी</button>
            <button class="lang-btn ${activeLang === 'hi' ? 'active' : ''}" data-flang="hi" style="padding: 6px 12px; font-weight: 700;">हिन्दी</button>
          </div>
        </div>

        <!-- Location Strip -->
        <div style="margin-bottom: 24px; padding: 10px 14px; background: rgba(18,27,34,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <span class="font-data" style="font-size: 0.78rem; color: var(--muted);">📍 Your Location:</span>
          <strong class="font-data text-amber" style="font-size: 0.82rem;">Maharashtra Coast — Arabian Sea (16.7° N 73.7° E)</strong>
        </div>

        <!-- Voice-First Hero Interface -->
        <div class="bezel-panel" style="padding: 32px 20px; text-align: center; background: rgba(18,27,34,0.9); margin-bottom: 28px; border-top: 4px solid var(--phosphor-green);">
          <h2 class="font-display" style="font-size: 1.55rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 18px;">
            What would you like to know?
          </h2>

          <!-- Dominant Circular Microphone Button -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px;">
            <button id="btn-fisherman-mic" class="mic-pulse-btn" style="width: 110px; height: 110px; border-radius: 50%; background: linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%); border: 4px solid var(--parchment-bright); color: #0A1014; font-size: 3.0rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 28px rgba(107,203,119,0.5); transition: transform 0.2s ease;">
              🎙️
            </button>
            <div id="mic-status-label" class="font-data text-green" style="font-size: 1.0rem; font-weight: 700; margin-top: 14px;">
              Tap &amp; Speak
            </div>
            <div class="font-body text-muted" style="font-size: 0.84rem; margin-top: 4px;">
              Ask ORCA in your language (English, Marathi or Hindi)
            </div>
          </div>

          <!-- Text Input Fallback -->
          <form id="fisherman-text-form" style="display: flex; gap: 8px; max-width: 580px; margin: 0 auto;">
            <input type="text" id="fisherman-text-input" class="intercom-textarea" placeholder="Or type your question here..." style="height: 44px; padding: 0 14px; font-size: 0.90rem; border-radius: var(--radius);" />
            <button type="submit" class="btn-tactical btn-tactical-green" style="height: 44px; padding: 0 20px; white-space: nowrap; font-size: 0.88rem; font-weight: 700;">
              Ask ORCA
            </button>
          </form>
        </div>

        <!-- Touch Quick Questions Grid -->
        <div style="margin-bottom: 28px;">
          <div class="font-data text-brass" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 14px; text-transform: uppercase;">
            QUICK QUESTIONS — TAP TO ASK
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            
            <button class="fisherman-quick-card bezel-panel" data-qtype="fishing" data-query="What are the fishing conditions near Mumbai today?" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">🎣</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">Fishing</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"Is it safe to go fishing today?"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-qtype="weather" data-query="What are the fishing conditions near Mumbai today?" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">🌦️</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">Weather</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"Will there be strong winds?"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-qtype="sea" data-query="What is the sea condition near Mumbai?" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">🌊</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">Sea Conditions</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"How are the waves?"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-qtype="safety" data-query="Is there a cyclone risk near Mumbai?" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">⚠️</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">Safety</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"Is there any danger near me?"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-qtype="route" data-query="Safe route vs shortest route from Veraval to Ratnagiri" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">🧭</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">Route</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"Which route is safer?"</span>
              </div>
            </button>

          </div>
        </div>

        <!-- Response Output Box -->
        <div id="fisherman-response-box" style="display: none; margin-bottom: 24px;"></div>

      </div>
    `;

    // Bind Language Switching
    container.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-flang');
        if (lang && lang !== activeLang) {
          activeLang = lang;
          localStorage.setItem('orca_fisherman_lang', lang);
          if (soundEngine) soundEngine.playMechanicalClick();
          renderContent();
        }
      });
    });

    // Microphone STT Bindings
    const micBtn = container.querySelector('#btn-fisherman-mic');
    const micStatusLabel = container.querySelector('#mic-status-label');

    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (voiceService.isListening) {
          voiceService.stopListening();
          micStatusLabel.textContent = "Tap & Speak";
          micBtn.style.transform = 'scale(1)';
        } else {
          micStatusLabel.textContent = "Listening... Speak now";
          micBtn.style.transform = 'scale(1.1)';
          if (soundEngine) soundEngine.playTacticalBeep();

          voiceService.startListening({
            lang: activeLang,
            onResult: (transcript) => {
              micStatusLabel.textContent = "Tap & Speak";
              micBtn.style.transform = 'scale(1)';
              displayResponse(transcript, 'weather', transcript);
            },
            onError: (err) => {
              console.warn('[Fisherman Voice STT Error]:', err);
              micStatusLabel.textContent = "Tap & Speak";
              micBtn.style.transform = 'scale(1)';
            },
            onEnd: () => {
              micStatusLabel.textContent = "Tap & Speak";
              micBtn.style.transform = 'scale(1)';
            }
          });
        }
      });
    }

    // Text Form Submission
    const textForm = container.querySelector('#fisherman-text-form');
    const textInput = container.querySelector('#fisherman-text-input');
    if (textForm) {
      textForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = textInput.value.trim();
        if (!val) return;
        textInput.value = '';
        displayResponse(val, 'weather', val);
      });
    }

    // Quick Question Button Bindings
    container.querySelectorAll('.fisherman-quick-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const qtype = btn.getAttribute('data-qtype');
        const queryText = btn.getAttribute('data-query');
        if (soundEngine) soundEngine.playTransmissionSound();
        displayResponse(null, qtype, queryText);
      });
    });

    // Helper to render simplified human-readable response card + speak audio
    function displayResponse(customQuery, qtype = 'weather', fullQuery = '') {
      const respBox = container.querySelector('#fisherman-response-box');
      if (!respBox) return;

      const respData = dict[`resp_${qtype}`] || dict.resp_weather;
      const targetQuery = fullQuery || customQuery || dict[`q_${qtype}`] || 'What are the fishing conditions near Mumbai today?';

      respBox.style.display = 'block';
      respBox.innerHTML = `
        <div class="bezel-panel" style="padding: 22px; background: rgba(18,27,34,0.95); border: 1px solid var(--brass); border-top: 4px solid var(--phosphor-green);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="beacon-pulse" style="width: 8px; height: 8px;"></span>
              <strong class="font-data text-brass" style="font-size: 0.85rem; letter-spacing: 0.06em;">ORCA ADVICE</strong>
            </div>
            <span class="panel-badge ${respData.badge}" style="font-size: 0.78rem; padding: 4px 10px;">${respData.status}</span>
          </div>

          ${customQuery ? `<div class="font-data text-muted" style="font-size: 0.80rem; margin-bottom: 12px;">Query: "${customQuery}"</div>` : ''}

          <div style="font-family: var(--font-body); font-size: 1.08rem; color: var(--parchment-bright); line-height: 1.5; margin-bottom: 18px; background: rgba(10,16,20,0.6); padding: 16px; border-radius: var(--radius); border-left: 4px solid var(--phosphor-green);">
            "${respData.advice}"
          </div>

          <!-- Current Conditions Cards -->
          <div style="margin-bottom: 16px;">
            <div class="font-data text-muted" style="font-size: 0.70rem; text-transform: uppercase; margin-bottom: 8px;">CURRENT CONDITIONS NEAR YOU</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
              <div style="padding: 10px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);">
                <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">🌬️ WIND</span>
                <strong class="font-data text-amber" style="font-size: 0.95rem;">${respData.wind}</strong>
              </div>
              <div style="padding: 10px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);">
                <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">🌊 WAVES</span>
                <strong class="font-data text-parchment-bright" style="font-size: 0.95rem;">${respData.seaState}</strong>
              </div>
              <div style="padding: 10px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);">
                <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">🌤️ WEATHER</span>
                <strong class="font-data text-green" style="font-size: 0.95rem;">Partly Cloudy</strong>
              </div>
              <div style="padding: 10px; background: rgba(10,16,20,0.5); border: 1px solid var(--chart-line); border-radius: var(--radius);">
                <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">📍 LOCATION</span>
                <strong class="font-data text-parchment-bright" style="font-size: 0.85rem;">Maharashtra Coast</strong>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <!-- SPEAKER REPLAY BUTTON -->
            <button id="btn-replay-audio" class="btn-tactical btn-tactical-green" style="padding: 10px 18px; font-size: 0.82rem; font-weight: 700;">
              🔊 Speak Advice Again
            </button>
            <a href="#/chat?role=fisherman&q=${encodeURIComponent(targetQuery)}" class="btn-tactical text-brass" style="text-decoration: none; padding: 10px 18px; font-size: 0.82rem; font-weight: 700; border-color: var(--brass);">
              💬 Open Live Chat Section →
            </a>
          </div>
        </div>
      `;

      // Auto-speak response using TTS
      voiceService.speak(respData.audio || respData.advice, activeLang);

      const replayBtn = respBox.querySelector('#btn-replay-audio');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          voiceService.speak(respData.audio || respData.advice, activeLang);
        });
      }

      respBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  renderContent();
}
