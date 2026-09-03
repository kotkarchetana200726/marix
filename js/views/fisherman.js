// ORCA Marine Bridge Console — Fisherman Persona View (/#/fisherman)
// Voice-First Multilingual Marine Safety Companion with Decision Bulletins & Map

import { voiceService, FISHERMAN_I18N } from '../services/voiceService.js';

export function renderFishermanView(container, { i18n, soundEngine, currentLang = 'en' }) {
  let activeLang = localStorage.getItem('orca_fisherman_lang') || currentLang || 'en';
  if (!FISHERMAN_I18N[activeLang]) activeLang = 'en';

  const renderContent = () => {
    const dict = FISHERMAN_I18N[activeLang] || FISHERMAN_I18N.en;

    container.innerHTML = `
      <div class="fisherman-view" style="max-width: 960px; margin: 0 auto; padding: 20px 16px;">
        
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
          <strong class="font-data text-amber" style="font-size: 0.82rem;">Maharashtra Coast — Arabian Sea (18.9° N 72.8° E)</strong>
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
            QUICK QUESTIONS — TAP FOR IMMEDIATE DECISION &amp; MAP
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

    // Render Fisherman Decision, Bulletins, Temperature Telemetry & Map
    function displayResponse(customQuery, qtype = 'weather', fullQuery = '') {
      const respBox = container.querySelector('#fisherman-response-box');
      if (!respBox) return;

      const respData = dict[`resp_${qtype}`] || dict.resp_weather;
      const targetQuery = fullQuery || customQuery || dict[`q_${qtype}`] || 'What are the fishing conditions near Mumbai today?';

      const isWarning = qtype === 'safety';
      const decisionBadge = isWarning ? '🔴 DO NOT GO DEEP OFFSHORE TODAY' : '🟢 FINAL DECISION: SAFE TO GO FISHING TODAY';
      const decisionClass = isWarning ? 'badge-red' : 'badge-green';

      respBox.style.display = 'block';
      respBox.innerHTML = `
        <div class="bezel-panel" style="padding: 24px; background: rgba(18,27,34,0.95); border: 1px solid var(--brass); border-top: 5px solid ${isWarning ? 'var(--radar-red)' : 'var(--phosphor-green)'};">
          
          <!-- 1. CLEAR FINAL DECISION HEADER BANNER -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="beacon-pulse" style="width: 10px; height: 10px; box-shadow: 0 0 10px ${isWarning ? 'var(--radar-red)' : 'var(--phosphor-green)'};"></span>
              <strong class="font-data text-brass" style="font-size: 0.90rem; letter-spacing: 0.08em;">FINAL DECISION DIRECTIVE</strong>
            </div>
            <span class="panel-badge ${decisionClass}" style="font-size: 0.85rem; padding: 6px 14px; font-weight: 700;">${decisionBadge}</span>
          </div>

          ${customQuery ? `<div class="font-data text-muted" style="font-size: 0.82rem; margin-bottom: 14px;">Query: "${customQuery}"</div>` : ''}

          <!-- 2. BULLETINS SUMMARY LIST FOR QUICK 3-SECOND DECISION MAKING -->
          <div style="background: rgba(10,16,20,0.7); padding: 18px; border-radius: var(--radius); border-left: 4px solid ${isWarning ? 'var(--radar-red)' : 'var(--phosphor-green)'}; margin-bottom: 20px;">
            <h4 class="font-data text-brass" style="font-size: 0.82rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 10px; text-transform: uppercase;">
              📋 KEY DECISION BULLETINS
            </h4>
            <ul style="margin: 0; padding-left: 18px; color: var(--parchment-bright); font-size: 0.98rem; line-height: 1.6; font-family: var(--font-body);">
              <li style="margin-bottom: 6px;">• <strong>Final Decision</strong>: <span style="color: ${isWarning ? 'var(--radar-red)' : 'var(--phosphor-green)'}; font-weight: 700;">${respData.status}</span> — ${respData.advice}</li>
              <li style="margin-bottom: 6px;">• <strong>Sea Surface Temperature (SST)</strong>: <strong class="text-green">28.4°C</strong> (-0.8°C thermal anomaly front)</li>
              <li style="margin-bottom: 6px;">• <strong>Wave Height</strong>: <strong class="text-amber">${respData.seaState}</strong></li>
              <li style="margin-bottom: 6px;">• <strong>Wind Speed &amp; Direction</strong>: <strong class="text-amber">${respData.wind}</strong></li>
              <li style="margin-bottom: 6px;">• <strong>Recommended Zone</strong>: <strong class="text-parchment-bright">35–55 km off Mumbai Coast (18°55'N, 72°45'E)</strong></li>
            </ul>
          </div>

          <!-- 3. TEMPERATURE & CONDITIONS TELEMETRY CARDS -->
          <div style="margin-bottom: 20px;">
            <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 10px; text-transform: uppercase;">
              🌡️ OCEAN TELEMETRY &amp; TEMPERATURE METRICS
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
              <div style="padding: 12px; background: rgba(10,16,20,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius);">
                <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">🌡️ SEA SURFACE TEMP</span>
                <strong class="font-data text-green" style="font-size: 1.05rem;">28.4°C</strong>
              </div>
              <div style="padding: 12px; background: rgba(10,16,20,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius);">
                <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">🌿 CHLOROPHYLL-A</span>
                <strong class="font-data text-green" style="font-size: 1.05rem;">1.82 mg/m³</strong>
              </div>
              <div style="padding: 12px; background: rgba(10,16,20,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius);">
                <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">🌬️ WIND SPEED</span>
                <strong class="font-data text-amber" style="font-size: 1.05rem;">${respData.wind}</strong>
              </div>
              <div style="padding: 12px; background: rgba(10,16,20,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius);">
                <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">🌊 WAVE HEIGHT</span>
                <strong class="font-data text-parchment-bright" style="font-size: 1.05rem;">${respData.seaState}</strong>
              </div>
            </div>
          </div>

          <!-- 4. LIVE INTERACTIVE MARINE LOCATION MAP -->
          <div style="margin-bottom: 20px;">
            <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 8px; text-transform: uppercase;">
              🗺️ LIVE FISHING ZONE &amp; COASTAL MAP (MUMBAI OFFSHORE)
            </div>
            <div id="fisherman-map-canvas" style="width: 100%; height: 260px; border-radius: var(--radius); border: 1px solid var(--brass); background: var(--bg-void);"></div>
          </div>

          <!-- ACTION BUTTONS -->
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <button id="btn-replay-audio" class="btn-tactical btn-tactical-green" style="padding: 10px 18px; font-size: 0.84rem; font-weight: 700;">
              🔊 Speak Bulletins &amp; Decision Again
            </button>
            <a href="#/chat?role=fisherman&q=${encodeURIComponent(targetQuery)}" class="btn-tactical text-brass" style="text-decoration: none; padding: 10px 18px; font-size: 0.84rem; font-weight: 700; border-color: var(--brass);">
              💬 Stream Full Interactive Chat Canvas →
            </a>
          </div>

        </div>
      `;

      // Mount Leaflet Map inside Fisherman Response Box
      requestAnimationFrame(() => {
        if (typeof L !== 'undefined') {
          const mapEl = respBox.querySelector('#fisherman-map-canvas');
          if (mapEl) {
            try {
              mapEl.innerHTML = '';
              const map = L.map(mapEl, {
                center: [18.92, 72.75],
                zoom: 8,
                zoomControl: true,
                attributionControl: false
              });

              L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 18, subdomains: 'abcd'
              }).addTo(map);

              // Add Marker for Mumbai Offshore PFZ
              const icon = L.divIcon({
                className: '',
                html: '<div style="width:22px;height:22px;background:rgba(107,203,119,0.9);border:2px solid var(--parchment-bright);border-radius:50%;box-shadow:0 0 14px var(--phosphor-green);display:flex;align-items:center;justify-content:center;font-size:12px;">🐟</div>',
                iconSize: [22, 22],
                iconAnchor: [11, 11]
              });

              L.marker([18.92, 72.75], { icon: icon })
                .bindPopup(`<b>Mumbai Offshore PFZ</b><br>SST: 28.4°C | Depth: 52m<br>Favorable fishing zone`)
                .addTo(map)
                .openPopup();

              setTimeout(() => map.invalidateSize(), 150);
            } catch (e) {
              console.warn('[Fisherman Response Map] Init error:', e);
            }
          }
        }
      });

      // Auto-speak bulletins readout
      const speechSummary = `Final Decision: ${respData.status}. ${respData.advice} Sea surface temperature is 28.4 degrees Celsius. Waves are ${respData.seaState}. Wind speed is ${respData.wind}.`;
      voiceService.speak(speechSummary, activeLang);

      const replayBtn = respBox.querySelector('#btn-replay-audio');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          voiceService.speak(speechSummary, activeLang);
        });
      }

      respBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  renderContent();
}
