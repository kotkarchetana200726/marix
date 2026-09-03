// ORCA Generative UI Adapter & Agent Bridge
// Dynamic HTML/DOM stream Renderer with strict multilingual support

import { COMPONENT_REGISTRY } from '../components/components.js';
import { findMockResponse } from '../data/mockResponses.js';

export class GenerativeUIRenderer {
  constructor(mountElement) {
    this.mountEl = mountElement || document.getElementById('chat-stream-box');
    this.stepsContainer = null;
    this.proseContainer = null;
    this.deckContainer = null;

    if (this.mountEl) {
      this.stepsContainer = this.mountEl.querySelector('.genui-steps');
      this.proseContainer = this.mountEl.querySelector('.genui-prose');
      this.deckContainer  = this.mountEl.querySelector('.genui-card-deck');
    }
  }

  handleEvent(evt) {
    if (!evt || !evt.type) return;

    switch (evt.type) {
      case 'STEP':
        this._renderStep(evt.step, evt.stepIndex);
        break;

      case 'PROSE_DELTA':
        this._renderProseDelta(evt.text);
        break;

      case 'COMPONENT':
        this._mountComponent(evt.componentType, evt.props || evt.data, evt.key);
        break;

      case 'COMPLETE':
        this._finalizeStream(evt);
        break;

      default:
        console.log('[GenerativeUIRenderer] Unhandled event type:', evt.type);
    }
  }

  _renderStep(stepText, index) {
    if (!this.stepsContainer) return;
    const stepEl = document.createElement('div');
    stepEl.className = 'genui-step-item';
    stepEl.style.cssText = 'opacity: 0; transform: translateX(-6px); transition: all 0.25s ease; font-family: var(--font-data); font-size: 0.70rem; color: var(--brass); display: flex; align-items: center; gap: 6px;';
    stepEl.innerHTML = `<span class="beacon-pulse" style="width:4px;height:4px;"></span> <span>[STEP ${index + 1}] ${stepText}</span>`;
    
    this.stepsContainer.appendChild(stepEl);

    requestAnimationFrame(() => {
      stepEl.style.opacity = '1';
      stepEl.style.transform = 'translateX(0)';
    });
  }

  _renderProseDelta(text) {
    if (!this.proseContainer) return;
    this.proseContainer.innerHTML = _formatMarkdown(text);
  }

  _mountComponent(type, props, key) {
    if (!this.deckContainer) return;

    const factory = COMPONENT_REGISTRY[type];
    if (factory) {
      try {
        const node = factory(props || {});
        node.style.cssText = 'opacity: 0; transform: translateY(8px); transition: all 0.3s ease;';
        if (key) node.setAttribute('data-key', key);

        this.deckContainer.appendChild(node);

        requestAnimationFrame(() => {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
        });
      } catch (e) {
        console.warn(`[GenerativeUIRenderer] Failed to mount component "${type}":`, e);
      }
    }
  }

  _finalizeStream(evt) {
    if (this.mountEl) {
      const badge = this.mountEl.querySelector('.genui-status-badge');
      if (badge) {
        badge.textContent = '✓ SYNTHESIS COMPLETE';
        badge.className = 'genui-status-badge panel-badge badge-green';
      }
    }
  }
}

// === GENERATIVE UI AGENT BRIDGE ===
export class GenerativeAgentBridge {
  constructor() {
    this.mode = localStorage.getItem('orca_agent_mode') || 'SIMULATED';
    this.endpointUrl = localStorage.getItem('orca_agent_endpoint') || 'http://localhost:8000/api/orca/reason';
    this.apiKey = localStorage.getItem('orca_agent_key') || '';
  }

  // Entry point — streams events to renderer
  async streamTo(promptText, renderer, userLang) {
    const activeLang = userLang || localStorage.getItem('orca_chat_lang') || localStorage.getItem('orca_fisherman_lang') || 'en';

    // 1. Check Centralized Multilingual Mock Response System first
    const mockMatch = findMockResponse(promptText, activeLang);
    if (mockMatch) {
      return this._streamFromMockMatch(mockMatch, renderer);
    }

    // 2. Fall back to simulated engine matching user language
    return this._streamFromSimulatedEngine(promptText, renderer, activeLang);
  }

  // Stream deterministic mock response matching exact user query & language contract
  async _streamFromMockMatch(mockMatch, renderer) {
    // 1. Reasoning steps
    for (let i = 0; i < mockMatch.steps.length; i++) {
      await _delay(250);
      renderer.handleEvent({ type: 'STEP', step: mockMatch.steps[i], stepIndex: i });
    }

    await _delay(150);

    // 2. Prose word by word
    const words = mockMatch.prose.split(' ');
    let partial = '';
    for (const word of words) {
      partial += word + ' ';
      await _delay(24);
      renderer.handleEvent({ type: 'PROSE_DELTA', text: partial });
    }

    await _delay(200);

    // 3. Components
    for (let i = 0; i < mockMatch.components.length; i++) {
      await _delay(150);
      renderer.handleEvent({
        type: 'COMPONENT',
        componentType: mockMatch.components[i].type,
        props: mockMatch.components[i].props || mockMatch.components[i].data,
        key: `${mockMatch.components[i].type}-${i}`
      });
    }

    // 4. Signal completion
    await _delay(100);
    renderer.handleEvent({
      type: 'COMPLETE',
      prose: mockMatch.prose,
      components: []
    });

    return {
      text: mockMatch.prose,
      prose: mockMatch.prose,
      lang: mockMatch.targetLang
    };
  }

  async _streamFromSimulatedEngine(promptText, renderer, activeLang = 'en') {
    const steps = activeLang === 'mr' 
      ? ["समुद्राची स्थिती तपासत आहे...", "हवामान विश्लेषण करत आहे...", "उत्तर तयार करत आहे..."]
      : activeLang === 'hi'
      ? ["समुद्र की स्थिति जाँच रहे हैं...", "मौसम विश्लेषण कर रहे हैं...", "उत्तर तैयार कर रहे हैं..."]
      : ["Analyzing marine conditions...", "Evaluating safety risks...", "Synthesizing answer..."];

    for (let i = 0; i < steps.length; i++) {
      await _delay(250);
      renderer.handleEvent({ type: 'STEP', step: steps[i], stepIndex: i });
    }

    await _delay(150);

    const prose = activeLang === 'mr'
      ? `**ORCA सागरी माहिती उत्तर** ("${promptText}" साठी)\n\nरत्नागिरी आणि कोकण किनारी भागातील समुद्राची स्थिती मध्यम आहे. समुद्राच्या पृष्ठभागाचे तापमान **28.4°C** असून लाटांची उंची **1.4 मीटर** आहे. प्रवास करण्यापूर्वी ताजी माहिती तपासा.`
      : activeLang === 'hi'
      ? `**ORCA समुद्री जानकारी उत्तर** ("${promptText}" के लिए)\n\nरत्नागिरी और कोंकण तटीय क्षेत्र में समुद्र की स्थिति मध्यम है। समुद्र की सतह का तापमान **28.4°C** और लहरों की ऊँचाई **1.4 मीटर** है। जाने से पहले जानकारी की जाँच करें।`
      : `**ORCA Marine Intelligence Response** for *"${promptText}"*\n\nSea conditions across Ratnagiri sector are moderate. Sea Surface Temp is **28.4°C** with **1.4 m** wave height. Check latest advisory before departure.`;

    const words = prose.split(' ');
    let partial = '';
    for (const word of words) {
      partial += word + ' ';
      await _delay(24);
      renderer.handleEvent({ type: 'PROSE_DELTA', text: partial });
    }

    await _delay(200);

    renderer.handleEvent({
      type: 'COMPONENT',
      componentType: 'weather-card',
      props: {
        pressure: '1009.4 hPa',
        sst: '28.4°C',
        wind: activeLang === 'mr' ? '18 किमी/तास नैऋत्य' : activeLang === 'hi' ? '18 किमी/घंटा दक्षिण-पश्चिम' : '18 km/h SW',
        swell: activeLang === 'mr' ? '1.4 मीटर' : activeLang === 'hi' ? '1.4 मीटर' : '1.4 m',
        visibility: '7.2 km'
      },
      key: 'weather-card-sim'
    });

    renderer.handleEvent({ type: 'COMPLETE', prose: prose });

    return {
      text: prose,
      prose: prose,
      lang: activeLang
    };
  }
}

function _delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function _formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--parchment-bright);">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--brass);">$1</em>')
    .replace(/\n/g, '<br/>');
}
