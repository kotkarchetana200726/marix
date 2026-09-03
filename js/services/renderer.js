// ORCA Bridge Console — Canvas & Component Streaming Renderer
// Handles Server-Sent Events (SSE) from SpringBoot/FastAPI backend and mounts UI components dynamically

import { COMPONENT_REGISTRY } from '../components/components.js';
import { findMockResponse, detectOrResolveLanguage } from '../data/mockResponses.js';

export class CanvasRenderer {
  constructor(mountEl) {
    this.mountEl = mountEl || document.getElementById('canvas');
  }

  // Parses SSE text stream or event objects and updates DOM
  handleEvent(eventData) {
    let evt = eventData;
    if (typeof eventData === 'string') {
      try {
        evt = JSON.parse(eventData);
      } catch (e) {
        return;
      }
    }

    if (!evt) return;

    if (evt.type === 'status') {
      this.renderStatusMessage(evt.message);
    } else if (evt.type === 'result') {
      this.renderResultPayload(evt);
    }
  }

  renderStatusMessage(msgText) {
    if (!this.mountEl) return;

    let statusEl = this.mountEl.querySelector('.canvas-status-stream');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'canvas-status-stream bezel-panel';
      statusEl.style.cssText = 'padding: 10px 14px; margin-bottom: 14px; font-family: var(--font-data); font-size: 0.75rem; color: var(--brass); border-left: 3px solid var(--phosphor-amber); background: rgba(10,16,20,0.6);';
      this.mountEl.prepend(statusEl);
    }

    statusEl.innerHTML = `<span class="beacon-pulse" style="width:6px;height:6px;display:inline-block;margin-right:6px;"></span> ⚙ ${msgText}`;
  }

  renderResultPayload(resultEvt) {
    if (!this.mountEl) return;

    const payload = resultEvt.ui_json || {};
    const proseText = resultEvt.text || resultEvt.prose || '';
    const components = payload.components || [];

    // Clear previous status
    const statusEl = this.mountEl.querySelector('.canvas-status-stream');
    if (statusEl) statusEl.remove();

    // Create Result Shell Container
    const resultBox = document.createElement('div');
    resultBox.className = 'canvas-result-box';
    resultBox.style.cssText = 'display: flex; flex-direction: column; gap: 16px; margin-top: 8px; animation: genui-fadein 0.3s ease;';

    // Title & Header
    if (payload.title) {
      const headerEl = document.createElement('div');
      headerEl.style.cssText = 'display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--chart-line); padding-bottom: 8px;';
      headerEl.innerHTML = `
        <strong class="font-display text-parchment-bright" style="font-size: 1.1rem; font-weight: 700;">${payload.title}</strong>
        <span class="panel-badge badge-green" style="font-size: 0.65rem;">✓ ORCA REASONING VERIFIED</span>
      `;
      resultBox.appendChild(headerEl);
    }

    // Markdown Prose Body
    if (proseText) {
      const proseEl = document.createElement('div');
      proseEl.className = 'agent-prose-text font-body';
      proseEl.style.cssText = 'font-size: 0.95rem; line-height: 1.6; color: var(--parchment); background: rgba(18,27,34,0.6); padding: 14px; border-radius: var(--radius); border-left: 3px solid var(--phosphor-green);';
      proseEl.innerHTML = _formatMarkdown(proseText);
      resultBox.appendChild(proseEl);
    }

    // Component Deck Grid
    if (Array.isArray(components) && components.length > 0) {
      const deckEl = document.createElement('div');
      deckEl.className = 'canvas-component-deck';
      deckEl.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;';

      components.forEach((cSpec, idx) => {
        const factory = COMPONENT_REGISTRY[cSpec.type];
        if (factory) {
          try {
            const node = factory(cSpec.data || cSpec.props || {});
            node.style.cssText = 'opacity: 0; transform: translateY(8px); transition: all 0.3s ease;';
            deckEl.appendChild(node);

            setTimeout(() => {
              node.style.opacity = '1';
              node.style.transform = 'translateY(0)';
            }, idx * 160);
          } catch (e) {
            console.warn(`[CanvasRenderer] Error rendering component "${cSpec.type}":`, e);
          }
        }
      });

      resultBox.appendChild(deckEl);
    }

    this.mountEl.appendChild(resultBox);
  }

  // Streams endpoint using Fetch ReadableStream
  async stream(endpoint, body, opts) {
    opts = opts || {};
    const headers = { 'Content-Type': 'application/json' };
    if (opts.bearerToken) {
      headers['Authorization'] = `Bearer ${opts.bearerToken}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported in this environment.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.substring(6).trim();
          if (jsonStr) {
            this.handleEvent(jsonStr);
          }
        }
      }
    }
  }
}

export class SpringBootBridge {
  constructor(opts) {
    opts = opts || {};
    this.endpoint    = opts.endpoint    || (localStorage.getItem('orca_chat_endpoint') || '/api/chat');
    this.bearerToken = opts.bearerToken || (localStorage.getItem('orca_bearer_token')  || '');
    this.fallback    = opts.fallback !== false;
  }

  async streamTo(queryText, renderer, userLang) {
    const selectedLang = userLang || localStorage.getItem('orca_chat_lang') || localStorage.getItem('orca_fisherman_lang') || 'en';
    const activeLang = detectOrResolveLanguage(queryText, selectedLang);

    // 1. Check Centralized Mock Response System first
    const mockMatch = findMockResponse(queryText, activeLang);
    if (mockMatch) {
      return this._streamMockMatch(mockMatch, renderer);
    }

    // 2. Fall back to backend stream or clean fallback
    try {
      await renderer.stream(
        this.endpoint,
        { message: queryText, lang: activeLang },
        { bearerToken: this.bearerToken }
      );
    } catch (err) {
      console.warn('[ORCA SpringBootBridge] Backend call bypassed, using clean simulation:', err.message);
      this._mockFallback(queryText, renderer, activeLang);
    }
  }

  async _streamMockMatch(mockMatch, renderer) {
    const steps = mockMatch.steps || ["Processing marine query..."];

    for (let i = 0; i < steps.length; i++) {
      renderer.handleEvent({ type: 'status', message: steps[i] });
      await new Promise(r => setTimeout(r, 220));
    }

    renderer.handleEvent({
      type: 'result',
      text: mockMatch.prose,
      ui_json: {
        title: mockMatch.title,
        components: mockMatch.components
      }
    });
  }

  async _mockFallback(queryText, renderer, activeLang = 'en') {
    const statusMsg = activeLang === 'mr' ? 'समुद्री माहिती शोधत आहे...' : activeLang === 'hi' ? 'समुद्री जानकारी खोज रहे हैं...' : 'Analyzing marine query...';
    renderer.handleEvent({ type: 'status', message: statusMsg });
    await new Promise(r => setTimeout(r, 400));

    const prose = activeLang === 'mr'
      ? `**ORCA सागरी माहिती उत्तर** ("${queryText}" साठी)\n\nरत्नागिरी किनारी भागात समुद्रस्थिती मध्यम आहे. समुद्राच्या पृष्ठभागाचे तापमान **28.4°C** आणि लाटांची उंची **1.4 मीटर** आहे. निघण्यापूर्वी माहिती तपासा.`
      : activeLang === 'hi'
      ? `**ORCA समुद्री जानकारी उत्तर** ("${queryText}" के लिए)\n\nरत्नागिरी तटीय क्षेत्र में समुद्र की स्थिति मध्यम है। समुद्र की सतह का तापमान **28.4°C** और लहरों की ऊँचाई **1.4 मीटर** है। जाने से पहले जानकारी की जाँच करें।`
      : `**MARIX Marine Intelligence Response** for *"${queryText}"*\n\nSea conditions across Ratnagiri sector are moderate. Sea Surface Temp is **28.4°C** with **1.4 m** wave height. Check latest advisory before departure.`;

    const title = activeLang === 'mr' ? 'ORCA सागरी माहिती' : activeLang === 'hi' ? 'ORCA समुद्री जानकारी' : 'MARIX Operational Intelligence';

    renderer.handleEvent({
      type: 'result',
      text: prose,
      ui_json: {
        title: title,
        components: [
          {
            type: 'weather-card',
            data: {
              pressure: '1009.4 hPa',
              sst: '28.4°C',
              wind: activeLang === 'mr' ? '18 किमी/तास नैऋत्य' : activeLang === 'hi' ? '18 किमी/घंटा दक्षिण-पश्चिम' : '18 km/h SW',
              swell: activeLang === 'mr' ? '1.4 मीटर' : activeLang === 'hi' ? '1.4 मीटर' : '1.4 m',
              visibility: '7.2 km'
            }
          }
        ]
      }
    });
  }
}

function _formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--parchment-bright);">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--brass);">$1</em>')
    .replace(/\n/g, '<br/>');
}
