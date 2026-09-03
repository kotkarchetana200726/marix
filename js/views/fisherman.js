// ORCA Marine Bridge Console — Fisherman Persona View (/#/fisherman)
// Ultra-Simple, Practical, Voice-First Marine Safety Companion with Large Verdict Banner & Simplified Map

import { voiceService, FISHERMAN_I18N, prepareSpeechText } from '../services/voiceService.js';
import { findMockResponse } from '../data/mockResponses.js';
import { setGlobalLanguage, t } from '../data/translations.js';

export function renderFishermanView(container, { i18n, soundEngine, currentLang = 'en' }) {
  let activeLang = localStorage.getItem('orca_fisherman_lang') || currentLang || 'en';
  if (!FISHERMAN_I18N[activeLang]) activeLang = 'en';

  const renderContent = () => {
    const dict = FISHERMAN_I18N[activeLang] || FISHERMAN_I18N.en;

    container.innerHTML = `
      <div class="fisherman-view" style="max-width: 860px; margin: 0 auto; padding: 16px;">
        
        <!-- Fisherman Minimal Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid var(--chart-line); padding-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <a href="#/" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; padding: 4px 10px; font-size: 0.75rem;">
                ${dict.change_role || '← Change Role'}
              </a>
              <span class="panel-badge badge-green" style="font-size: 0.70rem;">${dict.role_tag || '🎣 FISHERMAN MODE'}</span>
            </div>
            <h1 class="font-display" style="font-size: 1.5rem; font-weight: 700; color: var(--parchment-bright); margin: 6px 0 0 0;">
              🌊 ${dict.app_title || 'ORCA'} <span style="font-size: 0.95rem; color: var(--brass); font-weight: 400;">— ${dict.app_sub || 'Your Marine Safety Companion'}</span>
            </h1>
          </div>

          <!-- Language Selector -->
          <div class="lang-selector" style="display: flex; gap: 4px; background: rgba(10,16,20,0.8); padding: 4px; border: 1px solid var(--brass); border-radius: var(--radius);">
            <button class="lang-btn ${activeLang === 'en' ? 'active' : ''}" data-flang="en" style="padding: 6px 12px; font-weight: 700;">English</button>
            <button class="lang-btn ${activeLang === 'mr' ? 'active' : ''}" data-flang="mr" style="padding: 6px 12px; font-weight: 700;">मराठी</button>
            <button class="lang-btn ${activeLang === 'hi' ? 'active' : ''}" data-flang="hi" style="padding: 6px 12px; font-weight: 700;">हिन्दी</button>
          </div>
        </div>

        <!-- Voice-First Hero Interface -->
        <div class="bezel-panel" style="padding: 28px 18px; text-align: center; background: rgba(18,27,34,0.9); margin-bottom: 24px; border-top: 4px solid var(--phosphor-green); border-radius: var(--radius);">
          <h2 class="font-display" style="font-size: 1.45rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 14px;">
            ${dict.prompt_heading || 'What would you like to know?'}
          </h2>

          <!-- Dominant Circular Microphone Button -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 18px;">
            <button id="btn-fisherman-mic" class="mic-pulse-btn" style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, var(--phosphor-green) 0%, #3e8e45 100%); border: 4px solid var(--parchment-bright); color: #0A1014; font-size: 2.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 24px rgba(107,203,119,0.5); transition: transform 0.2s ease;">
              🎙️
            </button>
            <div id="mic-status-label" class="font-data text-green" style="font-size: 1.0rem; font-weight: 700; margin-top: 12px;">
              ${dict.mic_btn_idle || 'Tap & Speak'}
            </div>
            <div class="font-body text-muted" style="font-size: 0.82rem; margin-top: 4px;">
              ${dict.mic_sub || 'Ask ORCA in your language (English, Marathi or Hindi)'}
            </div>
          </div>

          <!-- Text Input Fallback -->
          <form id="fisherman-text-form" style="display: flex; gap: 8px; max-width: 520px; margin: 0 auto;">
            <input type="text" id="fisherman-text-input" class="intercom-textarea" placeholder="${dict.input_placeholder || 'Or type your question here...'}" style="height: 42px; padding: 0 14px; font-size: 0.88rem; border-radius: var(--radius);" />
            <button type="submit" class="btn-tactical btn-tactical-green" style="height: 42px; padding: 0 18px; white-space: nowrap; font-size: 0.85rem; font-weight: 700;">
              ${dict.send_btn || 'Ask ORCA'}
            </button>
          </form>
        </div>

        <!-- Touch Quick Questions Grid -->
        <div style="margin-bottom: 24px;">
          <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 10px; text-transform: uppercase;">
            ${activeLang === 'mr' ? '▶ पटकन विचारा — दाबा आणि उत्तर मिळवा' : activeLang === 'hi' ? '▶ तुरंत पूछें — दबाएं और उत्तर पाएं' : '▶ QUICK QUESTIONS — TAP TO ASK'}
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            
            <button class="fisherman-quick-card bezel-panel" data-query="${activeLang === 'mr' ? 'आज मासेमारीसाठी चांगली जागा कुठे आहे?' : activeLang === 'hi' ? 'आज मछली पकड़ने के लिए सबसे अच्छी जगह कहाँ है?' : 'Where is the best place to fish today?'}" style="padding: 14px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.8rem;">🎣</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.90rem;">${t('fishingPotential', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.78rem;">"${dict.q_fishing || 'Is it safe to go fishing today?'}"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-query="${activeLang === 'mr' ? 'उद्या सकाळी मासेमारी करणे सुरक्षित आहे का?' : activeLang === 'hi' ? 'क्या कल सुबह मछली पकड़ना सुरक्षित है?' : 'Is it safe to go fishing tomorrow morning?'}" style="padding: 14px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.8rem;">🌦️</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.90rem;">${t('weather', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.78rem;">"${dict.q_weather || 'Will there be strong winds?'}"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-query="${activeLang === 'mr' ? 'हवामान आणि भरती-ओहोटीची स्थिती कशी आहे?' : activeLang === 'hi' ? 'मौसम और ज्वार-भाटा की स्थिति कैसी है?' : 'What are the tide, weather and sea conditions near my fishing location?'}" style="padding: 14px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.8rem;">🌊</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.90rem;">${t('seaCondition', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.78rem;">"${dict.q_sea || 'How are the waves?'}"</span>
              </div>
            </button>

            <button class="fisherman-quick-card bezel-panel" data-query="${activeLang === 'mr' ? 'काही वादळाचा इशारा आहे का?' : activeLang === 'hi' ? 'क्या कोई चक्रवात या बिजली की चेतावनी है?' : 'Are there any lightning or cyclone alerts in my area?'}" style="padding: 14px; text-align: left; background: rgba(18,27,34,0.75); border: 1px solid var(--chart-line); cursor: pointer; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.8rem;">⚠️</span>
              <div>
                <strong style="display: block; color: var(--parchment-bright); font-size: 0.90rem;">${t('safetyLevel', activeLang)}</strong>
                <span class="text-muted" style="font-size: 0.78rem;">"${dict.q_safety || 'Is there any danger near me?'}"</span>
              </div>
            </button>

          </div>
        </div>

        <!-- SIMPLE VERDICT RESPONSE OUTPUT BOX -->
        <div id="fisherman-response-box" style="display: none; margin-bottom: 24px;"></div>

      </div>
    `;

    // Language Selector Event Handlers
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

    // Voice Microphone Event Handlers
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
              displaySimpleResponse(transcript);
            },
            onError: () => {
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

    // Text Form Event Handlers
    const textForm = container.querySelector('#fisherman-text-form');
    const textInput = container.querySelector('#fisherman-text-input');
    if (textForm) {
      textForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = textInput.value.trim();
        if (!val) return;
        textInput.value = '';
        displaySimpleResponse(val);
      });
    }

    // Quick Question Button Handlers
    container.querySelectorAll('.fisherman-quick-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const queryText = btn.getAttribute('data-query');
        if (soundEngine) soundEngine.playTransmissionSound();
        displaySimpleResponse(queryText);
      });
    });

    // Render Clean Human Verdict & Simplified Map
    function displaySimpleResponse(queryText) {
      const respBox = container.querySelector('#fisherman-response-box');
      if (!respBox) return;

      const mockMatch = findMockResponse(queryText, activeLang);

      // Build Simple Verdict Content
      let verdictTag = '🟢 SAFE';
      let verdictTitle = activeLang === 'mr' ? '🟢 आज मासेमारीसाठी जाऊ शकता' : activeLang === 'hi' ? '🟢 आज मछली पकड़ने जा सकते हैं' : '🟢 SAFE TO GO FISHING TODAY';
      let verdictBg = 'rgba(107,203,119,0.15)';
      let verdictBorder = 'var(--phosphor-green)';
      let verdictColor = 'var(--phosphor-green)';

      let simpleSentence = activeLang === 'mr'
        ? 'PFZ-01 ही मासे पकडण्यासाठी उत्तम जागा आहे. ही जागा तुमच्या ठिकाणापासून सुमारे १८ किमी नैऋत्य दिशेला आहे.'
        : activeLang === 'hi'
        ? 'PFZ-01 मछली पकड़ने के लिए सबसे अच्छी जगह है। यह जगह आपके स्थान से लगभग 18 किमी दक्षिण-पश्चिम में है।'
        : 'PFZ-01 is the best place to fish today. It is located 18 km southwest of your current location.';

      let bullets = activeLang === 'mr'
        ? ['📍 अंतर: १८ किमी नैऋत्य', '🐟 मासे मिळण्याची शक्यता: उत्तम (87%)', '🌊 समुद्र: मध्यम शांत (१.४ मीटर लाटा)']
        : activeLang === 'hi'
        ? ['📍 दूरी: 18 किमी दक्षिण-पश्चिम', '🐟 मछली मिलने की संभावना: अच्छी (87%)', '🌊 समुद्र की स्थिति: मध्यम शांत (1.4 मीटर लहरें)']
        : ['📍 Distance: 18 km Southwest', '🐟 Fishing Chance: Good (87%)', '🌊 Sea Condition: Moderate (1.4 m waves)'];

      let actionAdvice = activeLang === 'mr'
        ? 'निघण्यापूर्वी हवामानाची ताजी माहिती जरूर तपासा.'
        : activeLang === 'hi'
        ? 'निकलने से पहले मौसम की ताजा जानकारी जरूर देखें।'
        : 'Check weather forecast before departure.';

      // Determine verdict type from query
      const qLower = queryText.toLowerCase();
      if (qLower.includes('cyclone') || qLower.includes('storm') || qLower.includes('तूफान') || qLower.includes('वादळ') || qLower.includes('धोका') || qLower.includes('खतरा')) {
        verdictTitle = activeLang === 'mr' ? '🟢 सध्या वादळाचा धोका नाही' : activeLang === 'hi' ? '🟢 अभी तूफान का खतरा नहीं है' : '🟢 NO CYCLONE DANGER AT PRESENT';
        simpleSentence = activeLang === 'mr'
          ? 'तुमच्या परिसरात सध्या कोणताही वादळाचा इशारा नाही.'
          : activeLang === 'hi'
          ? 'आपके क्षेत्र में अभी तूफान की कोई चेतावनी नहीं है।'
          : 'There is no active cyclone or storm alert in your immediate area.';
        bullets = activeLang === 'mr'
          ? ['🌬️ वारा: सामान्य (१८ किमी/तास)', '🌊 लाटा: १.४ मीटर', '⚠️ धोका: कमी']
          : activeLang === 'hi'
          ? ['🌬️ हवा: सामान्य (18 किमी/घंटा)', '🌊 लहरें: 1.4 मीटर', '⚠️ जोखिम: कम']
          : ['🌬️ Wind: Normal (18 km/h)', '🌊 Waves: 1.4 m', '⚠️ Risk: Low'];
      } else if (qLower.includes('restricted') || qLower.includes('avoid') || qLower.includes('न जा') || qLower.includes('जाऊ नका')) {
        verdictTitle = activeLang === 'mr' ? '🔴 या क्षेत्रात जाऊ नका' : activeLang === 'hi' ? '🔴 इस क्षेत्र में न जाएँ' : '🔴 DO NOT ENTER THIS AREA';
        verdictBg = 'rgba(255,107,107,0.15)';
        verdictBorder = 'var(--radar-red)';
        verdictColor = 'var(--radar-red)';
        simpleSentence = activeLang === 'mr'
          ? 'मालवण सागरी संरक्षित क्षेत्रात मासेमारीस मनाई आहे.'
          : activeLang === 'hi'
          ? 'मालवण समुद्री संरक्षित क्षेत्र में मछली पकड़ना मना है।'
          : 'Malvan Marine Protected Area is restricted for fishing.';
      }

      const voiceText = `${verdictTitle.replace(/🟢|🟡|🔴/g, '')}. ${simpleSentence} ${actionAdvice}`;

      respBox.style.display = 'block';
      respBox.innerHTML = `
        <div class="bezel-panel" style="padding: 22px; background: rgba(18,27,34,0.95); border: 2px solid ${verdictBorder}; border-radius: var(--radius);">
          
          <!-- 1. VERY LARGE VERDICT BANNER -->
          <div style="background: ${verdictBg}; border: 1px solid ${verdictBorder}; padding: 14px 18px; border-radius: var(--radius); margin-bottom: 16px; text-align: center;">
            <div style="font-family: var(--font-display); font-size: 1.65rem; font-weight: 800; color: ${verdictColor}; line-height: 1.2;">
              ${verdictTitle}
            </div>
          </div>

          <!-- 2. SIMPLE 1-2 SENTENCE EXPLANATION -->
          <div style="font-family: var(--font-body); font-size: 1.15rem; color: var(--parchment-bright); line-height: 1.6; margin-bottom: 16px; font-weight: 500;">
            ${simpleSentence}
          </div>

          <!-- 3. SIMPLE 2-3 KEY DETAILS -->
          <div style="background: rgba(10,16,20,0.6); padding: 14px; border-radius: var(--radius); border: 1px solid var(--chart-line); margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
            ${bullets.map(b => `<div style="font-family: var(--font-body); font-size: 1.05rem; color: var(--parchment); font-weight: 600;">${b}</div>`).join('')}
          </div>

          <!-- 4. ONE SIMPLE ACTION -->
          <div style="font-family: var(--font-body); font-size: 0.96rem; color: var(--phosphor-amber); font-weight: 700; margin-bottom: 18px; display: flex; align-items: center; gap: 8px;">
            <span>💡</span> <span>${actionAdvice}</span>
          </div>

          <!-- 5. SIMPLIFIED MAP -->
          <div style="margin-bottom: 16px;">
            <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 6px; text-transform: uppercase;">
              🗺️ MAP LOCATION (RATNAGIRI)
            </div>
            <div id="fisherman-simple-map" style="width: 100%; height: 240px; border-radius: var(--radius); border: 1px solid var(--brass); background: var(--bg-void);"></div>
          </div>

          <!-- AUDIO REPLAY BUTTON -->
          <div style="display: flex; gap: 10px; align-items: center;">
            <button id="btn-fisherman-replay" class="btn-tactical btn-tactical-green" style="padding: 10px 18px; font-size: 0.90rem; font-weight: 700;">
              🔊 ${activeLang === 'mr' ? 'उत्तर पुन्हा ऐका' : activeLang === 'hi' ? 'उत्तर पुनः सुनें' : 'Listen Answer Again'}
            </button>
          </div>

        </div>
      `;

      // Mount Simplified Leaflet Map
      requestAnimationFrame(() => {
        if (typeof L !== 'undefined') {
          const mapEl = respBox.querySelector('#fisherman-simple-map');
          if (mapEl) {
            try {
              mapEl.innerHTML = '';
              const map = L.map(mapEl, {
                center: [16.85, 73.18],
                zoom: 9,
                zoomControl: false,
                attributionControl: false
              });

              L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 18, subdomains: 'abcd'
              }).addTo(map);

              const youMarker = activeLang === 'mr' ? '📍 तुमचे ठिकाण' : activeLang === 'hi' ? '📍 आप यहाँ हैं' : '📍 YOU ARE HERE';
              const fishMarker = activeLang === 'mr' ? '🐟 मासेमारी क्षेत्र (PFZ-01)' : activeLang === 'hi' ? '🐟 मछली पकड़ने की जगह (PFZ-01)' : '🐟 GOOD FISHING AREA (PFZ-01)';

              L.marker([16.99, 73.31]).bindPopup(`<b>${youMarker}</b>`).addTo(map);
              L.marker([16.85, 73.18]).bindPopup(`<b>${fishMarker}</b>`).addTo(map).openPopup();

              setTimeout(() => map.invalidateSize(), 150);
            } catch (e) {
              console.warn('[Simplified Map Error]:', e);
            }
          }
        }
      });

      // Speak ONLY the simple human answer (no technical logs!)
      voiceService.speak(voiceText, activeLang);

      const replayBtn = respBox.querySelector('#btn-fisherman-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          voiceService.speak(voiceText, activeLang);
        });
      }

      respBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  renderContent();
}
