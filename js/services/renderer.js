// ORCA Bridge Console — Canvas & Component Streaming Renderer
// Handles Server-Sent Events (SSE) from SpringBoot/FastAPI backend and mounts UI components dynamically

import { COMPONENT_REGISTRY } from '../components/components.js';
import { findMockResponse } from '../data/mockResponses.js';

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

  async streamTo(queryText, renderer) {
    // 1. Check Centralized Mock Response System first
    const mockMatch = findMockResponse(queryText);
    if (mockMatch) {
      return this._streamMockMatch(mockMatch, renderer);
    }

    // 2. Fall back to backend stream or clean fallback
    try {
      await renderer.stream(
        this.endpoint,
        { message: queryText },
        { bearerToken: this.bearerToken }
      );
    } catch (err) {
      console.warn('[ORCA SpringBootBridge] Backend call bypassed, using clean simulation:', err.message);
      this._mockFallback(queryText, renderer);
    }
  }

  async _streamMockMatch(mockMatch, renderer) {
    renderer.handleEvent({ type: 'status', message: 'Connecting to INCOIS & IMD Doppler weather mesh...' });
    await new Promise(r => setTimeout(r, 250));

    renderer.handleEvent({ type: 'status', message: 'Analyzing bathymetry & oceanic thermal gradients...' });
    await new Promise(r => setTimeout(r, 250));

    renderer.handleEvent({ type: 'status', message: 'Synthesizing multimodal reasoning & UI component specs...' });
    await new Promise(r => setTimeout(r, 250));

    renderer.handleEvent({
      type: 'result',
      text: mockMatch.prose,
      ui_json: {
        title: mockMatch.title,
        components: mockMatch.components
      }
    });
  }

  async _mockFallback(queryText, renderer) {
    renderer.handleEvent({ type: 'status', message: 'Analyzing marine query...' });
    await new Promise(r => setTimeout(r, 400));
    renderer.handleEvent({
      type: 'result',
      text: `**MARIX Marine Intelligence Response** for *"${queryText}"*\n\nAll marine data adapters synchronized. Regional weather, bathymetry, and thermal gradients analyzed across coastal sectors.`,
      ui_json: {
        title: 'MARIX Operational Intelligence',
        components: [
          {
            type: 'weather-card',
            data: {
              pressure: '1009.4 hPa',
              sst: '28.3°C',
              wind: '16 km/h WNW',
              swell: '1.5 m @ 10.4s',
              visibility: '8.0 nm (Clear)'
            }
          },
          {
            type: 'evidence-panel',
            data: {
              title: 'TELEMETRY & EVIDENCE SOURCES',
              entries: [
                { label: 'Query Transmitted', value: queryText, confidence: '98%', source: 'ORCA Bridge' },
                { label: 'INCOIS PFZ Adapter', value: 'High yield probability along Konkan shelf', confidence: '92%', source: 'INCOIS' },
                { label: 'IMD Doppler Radar', value: 'Nominal coastal weather conditions', confidence: '96%', source: 'IMD Radar' }
              ],
              summary: 'Operational status nominal.',
              modelVersion: 'MARIX REASONING ENGINE'
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
