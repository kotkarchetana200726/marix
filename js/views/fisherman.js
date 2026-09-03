// ORCA Marine Bridge Console — Fisherman Persona View (/#/fisherman)
// Voice-First Multilingual Marine Safety Companion with Strict Language Lock

import { voiceService, FISHERMAN_I18N, prepareSpeechText } from '../services/voiceService.js';
import { findMockResponse } from '../data/mockResponses.js';
import { setGlobalLanguage, t } from '../data/translations.js';

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
                ${dict.change_role || '← Change Role'}
              </a>
              <span class="panel-badge badge-green" style="font-size: 0.70rem;">${dict.role_tag || '🎣 FISHERMAN MODE'}</span>
              
              <!-- Direct Link to Full Chat Section -->
              <a href="#/chat?role=fisherman" class="btn-tactical btn-tactical-sm btn-tactical-green" style="text-decoration: none; padding: 4px 12px; font-size: 0.75rem; font-weight: 700;">
                ${dict.open_chat || '💬 Open Chat Section →'}
              </a>
            </div>
            <h1 class="font-display" style="font-size: 1.6rem; font-weight: 700; color: var(--parchment-bright); margin: 6px 0 0 0;">
              🌊 ${dict.app_title || 'ORCA'} <span style="font-size: 1.0rem; color: var(--brass); font-weight: 400;">— ${dict.app_sub || 'Your Marine Safety Companion'}</span>
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
          <span class="font-data" style="font-size: 0.78rem; color: var(--muted);">${dict.location_label || '📍 Your Current Location:'}</span>
          <strong class="font-data text-amber" style="font-size: 0.82rem;">${dict.location_val || 'Arabian Sea — Ratnagiri Coast (16.99° N 73.31° E)'}</strong>
        </div>

        <!-- Voice-First Hero Interface -->
        <div class="bezel-panel" style="padding: 32px 20px; text-align: center; background: rgba(18,27,34,0.9); margin-bottom: 28px; border-top: 4px solid var(--phosphor-green);">
          <h2 class="font-display" style="font-size: 1.55rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 18px;">
            ${dict.prompt_heading || 'What would you like to know?'}
          </h2>

          <!-- Dominant Circular Microphone Button -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px;">
            <button id="btn-fisherman-mic" class="mic-pulse-btn" style="width: 110px; height: 110px; border-radius: 50%; background: linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%); border: 4px solid var(--parchment-bright); color: #0A1014; font-size: 3.0rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 28px rgba(107,203,119,0.5); transition: transform 0.2s ease;">
              🎙️
            </button>
            <div id="mic-status-label" class="font-data text-green" style="font-size: 1.0rem; font-weight: 700; margin-top: 14px;">
              ${dict.mic_btn_idle || 'Tap & Speak'}
            </div>
            <div class="font-body text-muted" style="font-size: 0.84rem; margin-top: 4px;">
              ${dict.mic_sub || 'Ask ORCA in your language (English, Marathi or Hindi)'}
            </div>
          </div>

          <!-- Text Input Fallback -->
          <form id="fisherman-text-form" style="display: flex; gap: 8px; max-width: 580px; margin: 0 auto;">
            <input type="text" id="fisherman-text-input" class="intercom-textarea" placeholder="${dict.input_placeholder || 'Or type your question here...'}" style="height: 44px; padding: 0 14px; font-size: 0.90rem; border-radius: var(--radius);" />
            <button type="submit" class="btn-tactical btn-tactical-green" style="height: 44px; padding: 0 20px; white-space: nowrap; font-size: 0.88rem; font-weight: 700;">
              ${dict.send_btn || 'Ask ORCA'}
            </button>
          </form>
        </div>

        <!-- Touch Quick Questions Grid -->
        <div style="margin-bottom: 28px;">
          <div class="font-data text-brass" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 14px; text-transform: uppercase;">
            ${dict.quick_title || 'QUICK QUESTIONS — TAP FOR IMMEDIATE DECISION & MAP'}
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            
            <button class="fisherman-quick-card bezel-panel" data-qtype="fishing" data-query="${activeLang === 'mr' ? 'आज मासेमारीसाठी चांगली जागा कुठे आहे?' : activeLang === 'hi' ? 'आज मछली पकड़ने के लिए सबसे अच्छी जगह कहाँ है?' : 'Where is the nearest Potential Fishing Zone today?'}" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">🎣</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">${t('fishingPotential', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"${dict.q_fishing || 'Is it safe to go fishing today?'}"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-qtype="weather" data-query="${activeLang === 'mr' ? 'उद्या सकाळी मासेमारी करणे सुरक्षित आहे का?' : activeLang === 'hi' ? 'क्या कल सुबह मछली पकड़ना सुरक्षित है?' : 'Is it safe to go fishing tomorrow morning?'}" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">🌦️</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">${t('weather', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"${dict.q_weather || 'Will there be strong winds?'}"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-qtype="sea" data-query="${activeLang === 'mr' ? 'हवामान आणि भरती-ओहोटीची स्थिती कशी आहे?' : activeLang === 'hi' ? 'मौसम और ज्वार-भाटा की स्थिति कैसी है?' : 'What are the tide, weather and sea conditions near my fishing location?'}" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">🌊</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">${t('seaCondition', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"${dict.q_sea || 'How are the waves?'}"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-qtype="safety" data-query="${activeLang === 'mr' ? 'काही वादळाचा इशारा आहे का?' : activeLang === 'hi' ? 'क्या कोई चक्रवात या बिजली की चेतावनी है?' : 'Are there any lightning or cyclone alerts in my area?'}" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">⚠️</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">${t('safetyLevel', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"${dict.q_safety || 'Is there any danger near me?'}"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-qtype="route" data-query="${activeLang === 'mr' ? 'सुरक्षित मार्ग कोणता आहे?' : activeLang === 'hi' ? 'सबसे सुरक्षित रास्ता कौन सा है?' : 'What is the safest route to the fishing zone?'}" style="padding: 16px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.0rem;">🧭</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.96rem; margin-bottom: 2px;">${t('recommendation', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.80rem;">"${dict.q_route || 'Which route is safer?'}"</span>
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
          setGlobalLanguage(lang);
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
          micStatusLabel.textContent = dict.mic_btn_idle || "Tap & Speak";
          micBtn.style.transform = 'scale(1)';
        } else {
          micStatusLabel.textContent = dict.mic_btn_listening || "Listening... Speak now";
          micBtn.style.transform = 'scale(1.1)';
          if (soundEngine) soundEngine.playTacticalBeep();

          voiceService.startListening({
            lang: activeLang,
            onResult: (transcript) => {
              micStatusLabel.textContent = dict.mic_btn_idle || "Tap & Speak";
              micBtn.style.transform = 'scale(1)';
              displayResponse(transcript);
            },
            onError: (err) => {
              console.warn('[Fisherman Voice STT Error]:', err);
              micStatusLabel.textContent = dict.mic_btn_idle || "Tap & Speak";
              micBtn.style.transform = 'scale(1)';
            },
            onEnd: () => {
              micStatusLabel.textContent = dict.mic_btn_idle || "Tap & Speak";
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
        displayResponse(val);
      });
    }

    // Quick Question Button Bindings
    container.querySelectorAll('.fisherman-quick-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const queryText = btn.getAttribute('data-query');
        if (soundEngine) soundEngine.playTransmissionSound();
        displayResponse(queryText);
      });
    });

    // Render Fisherman Decision, Bulletins, Temperature Telemetry & Map in STRICT Target Language
    function displayResponse(queryText) {
      const respBox = container.querySelector('#fisherman-response-box');
      if (!respBox) return;

      const mockMatch = findMockResponse(queryText, activeLang);

      const title = mockMatch ? mockMatch.title : t('orcaTitle', activeLang);
      const prose = mockMatch ? mockMatch.prose : (activeLang === 'mr' ? 'माहिती प्रक्रिया सुरू आहे...' : activeLang === 'hi' ? 'जानकारी प्रसंस्करण जारी है...' : 'Processing marine query...');

      respBox.style.display = 'block';
      respBox.innerHTML = `
        <div class="bezel-panel" style="padding: 24px; background: rgba(18,27,34,0.95); border: 1px solid var(--brass); border-top: 5px solid var(--phosphor-green);">
          
          <!-- 1. CLEAR FINAL DECISION HEADER BANNER -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="beacon-pulse" style="width: 10px; height: 10px;"></span>
              <strong class="font-data text-brass" style="font-size: 0.90rem; letter-spacing: 0.08em;">${t('finalDecision', activeLang)}</strong>
            </div>
            <span class="panel-badge badge-green" style="font-size: 0.85rem; padding: 6px 14px; font-weight: 700;">${t('safe', activeLang).toUpperCase()}</span>
          </div>

          <div class="font-data text-muted" style="font-size: 0.82rem; margin-bottom: 14px;">Query: "${queryText}"</div>

          <!-- 2. BULLETINS SUMMARY LIST IN EXACT TARGET LANGUAGE -->
          <div style="background: rgba(10,16,20,0.7); padding: 18px; border-radius: var(--radius); border-left: 4px solid var(--phosphor-green); margin-bottom: 20px;">
            <div style="font-family: var(--font-body); font-size: 1.05rem; color: var(--parchment-bright); line-height: 1.6;">
              ${prose.replace(/\n/g, '<br/>')}
            </div>
          </div>

          <!-- 3. LIVE INTERACTIVE MAP -->
          <div style="margin-bottom: 20px;">
            <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 8px; text-transform: uppercase;">
              🗺️ LIVE MAP (RATNAGIRI COAST)
            </div>
            <div id="fisherman-map-canvas" style="width: 100%; height: 260px; border-radius: var(--radius); border: 1px solid var(--brass); background: var(--bg-void);"></div>
          </div>

          <!-- ACTION BUTTONS -->
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <button id="btn-replay-audio" class="btn-tactical btn-tactical-green" style="padding: 10px 18px; font-size: 0.84rem; font-weight: 700;">
              🔊 ${activeLang === 'mr' ? 'उत्तर पुन्हा ऐका' : activeLang === 'hi' ? 'उत्तर पुनः सुनें' : 'Listen Answer Again'}
            </button>
            <a href="#/chat?role=fisherman&q=${encodeURIComponent(queryText)}" class="btn-tactical text-brass" style="text-decoration: none; padding: 10px 18px; font-size: 0.84rem; font-weight: 700; border-color: var(--brass);">
              ${dict.open_chat || '💬 Open Full Chat →'}
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
                center: [16.85, 73.18],
                zoom: 9,
                zoomControl: true,
                attributionControl: false
              });

              L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 18, subdomains: 'abcd'
              }).addTo(map);

              L.marker([16.99, 73.31]).bindPopup('Ratnagiri Coast').addTo(map);
              L.marker([16.85, 73.18]).bindPopup('PFZ-01 High Yield Zone').addTo(map).openPopup();

              setTimeout(() => map.invalidateSize(), 150);
            } catch (e) {
              console.warn('[Fisherman Map Error]:', e);
            }
          }
        }
      });

      // Auto-speak response in EXACT target language (using prepareSpeechText internally)
      voiceService.speak(prose, activeLang);

      const replayBtn = respBox.querySelector('#btn-replay-audio');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          voiceService.speak(prose, activeLang);
        });
      }

      respBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  renderContent();
}
