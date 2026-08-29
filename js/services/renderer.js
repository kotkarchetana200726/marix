// ORCA — Canvas Renderer
//
// Connects to POST /api/chat on the Spring Boot backend via a ReadableStream,
// parses Server-Sent Events, and drives the #canvas div in the Generative Canvas view.
//
// SSE event shapes (from backend):
//   { "type": "status",  "message": "Checking weather..." }
//   { "type": "result",  "ui_json": { "title": "...", "components": [{ "type": "risk-card", "data": {...} }] }, "text": "..." }
//
// Usage:
//   import { CanvasRenderer } from '../services/renderer.js';
//   const renderer = new CanvasRenderer(document.getElementById('canvas'));
//   await renderer.stream('/api/chat', { message: 'Assess cyclone risk' });

import { renderComponent } from '../components/components.js';

// ─────────────────────────────────────────────────────────────
// EMPTY STATE — shown when canvas has no content
// ─────────────────────────────────────────────────────────────
function buildEmptyState() {
  var div = document.createElement('div');
  div.id = 'canvas-empty-state';
  div.style.cssText = [
    'display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'min-height:260px;padding:40px 20px;text-align:center;',
    'border:1px dashed var(--chart-line);border-radius:var(--radius);',
    'background:rgba(18,27,34,.4);',
  ].join('');
  div.innerHTML = [
    '<div style="font-size:3rem;margin-bottom:12px;opacity:.6;">⚓</div>',
    '<h2 class="font-display" style="font-size:1.2rem;font-weight:700;',
    '  color:var(--brass);margin-bottom:8px;letter-spacing:.04em;">',
    '  INSTRUMENT PANEL INACTIVE',
    '</h2>',
    '<p class="font-data" style="font-size:.75rem;color:var(--muted);',
    '  max-width:420px;line-height:1.6;">',
    '  Transmit an operational query via the intercom below. ORCA will stream',
    '  its reasoning and dynamically generate the appropriate instruments.',
    '</p>',
    '<div style="margin-top:20px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">',
    '  <div class="font-data" style="font-size:.62rem;letter-spacing:.12em;',
    '       color:var(--chart-line);border:1px solid var(--chart-line);',
    '       padding:4px 10px;border-radius:2px;">AWAITING TX</div>',
    '  <div class="font-data" style="font-size:.62rem;letter-spacing:.12em;',
    '       color:var(--chart-line);border:1px solid var(--chart-line);',
    '       padding:4px 10px;border-radius:2px;">VHF CH 16</div>',
    '</div>',
  ].join('');
  return div;
}

// ─────────────────────────────────────────────────────────────
// STATUS BAR — progressive "status" messages while waiting
// ─────────────────────────────────────────────────────────────
function buildStatusBar() {
  var bar = document.createElement('div');
  bar.id = 'canvas-status-bar';
  bar.style.cssText = [
    'display:none;',
    'align-items:center;gap:10px;',
    'padding:10px 14px;',
    'border:1px solid var(--chart-line);',
    'border-radius:var(--radius);',
    'background:rgba(10,16,20,.7);',
    'font-family:var(--font-data);font-size:.72rem;color:var(--brass);',
    'margin-bottom:14px;',
  ].join('');

  // Radar sweep animation indicator
  bar.innerHTML = [
    '<div id="canvas-radar-sweep" style="',
    '  width:22px;height:22px;flex-shrink:0;',
    '  border-radius:50%;',
    '  background:conic-gradient(from 0deg, transparent 70%, var(--phosphor-amber) 100%);',
    '  animation:orca-radar-spin 1.2s linear infinite;',
    '"></div>',
    '<span id="canvas-status-text">Initializing reasoning pipeline...</span>',
  ].join('');

  return bar;
}

// ─────────────────────────────────────────────────────────────
// RESULT TITLE BAR
// ─────────────────────────────────────────────────────────────
function buildTitleBar(title) {
  var bar = document.createElement('div');
  bar.className = 'canvas-result-title';
  bar.style.cssText = [
    'display:flex;align-items:center;gap:10px;',
    'padding:8px 12px;margin-bottom:12px;',
    'border:1px solid var(--brass);',
    'border-left:3px solid var(--phosphor-amber);',
    'border-radius:var(--radius);',
    'background:rgba(201,166,107,.06);',
  ].join('');
  bar.innerHTML = [
    '<span class="font-data" style="font-size:.65rem;color:var(--phosphor-amber);letter-spacing:.1em;flex-shrink:0;">',
    '  &#10003; ORCA RESULT',
    '</span>',
    '<span class="font-display" style="font-size:.90rem;font-weight:700;color:var(--parchment);">',
    '  ' + (title || 'Analysis Complete'),
    '</span>',
  ].join('');
  return bar;
}

// ─────────────────────────────────────────────────────────────
// PROSE BLOCK — the text answer accompanying the components
// ─────────────────────────────────────────────────────────────
function buildProseBlock(text) {
  var div = document.createElement('div');
  div.className = 'canvas-prose';
  div.style.cssText = [
    'font-size:.83rem;color:var(--parchment);line-height:1.55;',
    'padding:10px 14px;margin-bottom:12px;',
    'border-left:2px solid var(--chart-line);',
  ].join('');
  // Simple **bold** → <strong> markdown
  div.innerHTML = (text || '').replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--parchment-bright);">$1</strong>');
  return div;
}

// ─────────────────────────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────────────────────────
function buildErrorBlock(message) {
  var div = document.createElement('div');
  div.style.cssText = [
    'padding:12px 14px;border:1px solid var(--radar-red);',
    'border-top:3px solid var(--radar-red);',
    'border-radius:var(--radius);background:rgba(255,92,92,.08);',
    'font-family:var(--font-data);font-size:.78rem;color:var(--radar-red);',
  ].join('');
  div.innerHTML = '&#128680; <strong>TRANSMISSION ERROR</strong> — ' + (message || 'Unknown error. Check backend connection.');
  return div;
}

// ─────────────────────────────────────────────────────────────
// CANVAS RENDERER CLASS
// ─────────────────────────────────────────────────────────────
export class CanvasRenderer {
  /**
   * @param {HTMLElement} canvasEl  The #canvas div to render into.
   *                                Managed exclusively by this renderer.
   */
  constructor(canvasEl) {
    this._canvas    = canvasEl;
    this._statusBar = null;
    this._streaming = false;

    this._injectKeyframes();
    this._renderEmptyState();
  }

  // ── Public API ────────────────────────────────────────────

  /**
   * Stream a query to POST /api/chat and render the results.
   * Handles both "status" and "result" SSE events.
   *
   * @param {string} apiUrl         The backend endpoint (e.g. '/api/chat')
   * @param {object} payload        JSON body to POST  (e.g. { message: '...' })
   * @param {object} [opts]
   * @param {string} [opts.bearerToken]  Optional Authorization header value
   * @returns {Promise<void>}
   */
  async stream(apiUrl, payload, opts) {
    if (this._streaming) return;
    this._streaming = true;
    opts = opts || {};

    this._clearCanvas();
    this._showStatusBar('Establishing ORCA reasoning link...');

    var headers = { 'Content-Type': 'application/json' };
    if (opts.bearerToken) headers['Authorization'] = 'Bearer ' + opts.bearerToken;

    try {
      var response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Backend returned HTTP ' + response.status + ' ' + response.statusText);
      }
      if (!response.body) {
        throw new Error('Response body is null — server may not support streaming');
      }

      await this._consumeSSEStream(response.body);

    } catch (err) {
      console.error('[ORCA Renderer] Stream error:', err);
      this._hideStatusBar();
      this._clearCanvas();
      this._canvas.appendChild(buildErrorBlock(err.message));
    } finally {
      this._streaming = false;
    }
  }

  /**
   * Feed a single parsed SSE event object directly.
   * Useful for testing or when the caller owns the stream reader.
   *
   * @param {{ type: string, message?: string, ui_json?: object, text?: string }} event
   */
  handleEvent(event) {
    if (!event || !event.type) return;

    if (event.type === 'status') {
      this._showStatusBar(event.message || 'Processing...');
      return;
    }

    if (event.type === 'result') {
      this._hideStatusBar();
      this._clearCanvas();
      this._renderResult(event.ui_json || {}, event.text || '');
      return;
    }

    // Unknown event types are silently ignored per spec
    console.debug('[ORCA Renderer] Unrecognised event type "' + event.type + '" — ignored.');
  }

  /** Reset the canvas back to the empty state. */
  reset() {
    this._streaming = false;
    this._hideStatusBar();
    this._renderEmptyState();
  }

  // ── Private helpers ───────────────────────────────────────

  async _consumeSSEStream(readableBody) {
    var reader  = readableBody.getReader();
    var decoder = new TextDecoder('utf-8');
    var buffer  = '';

    while (true) {
      var chunk = await reader.read();
      if (chunk.done) break;

      buffer += decoder.decode(chunk.value, { stream: true });

      // SSE messages are separated by blank lines (\n\n)
      var parts = buffer.split('\n\n');
      // Last element may be an incomplete chunk — keep it in buffer
      buffer = parts.pop();

      for (var i = 0; i < parts.length; i++) {
        var raw = parts[i].trim();
        if (!raw) continue;

        // Each SSE message may have multiple "data:" lines
        var dataLines = raw.split('\n').filter(function(l) {
          return l.indexOf('data:') === 0;
        });

        for (var j = 0; j < dataLines.length; j++) {
          var jsonStr = dataLines[j].replace(/^data:\s*/, '');
          if (jsonStr === '[DONE]') continue;
          try {
            var evt = JSON.parse(jsonStr);
            this.handleEvent(evt);
          } catch (e) {
            console.warn('[ORCA Renderer] SSE parse error on line:', jsonStr, e);
          }
        }
      }
    }

    // Flush any remaining buffered data
    if (buffer.trim()) {
      var remaining = buffer.trim().split('\n').filter(function(l) {
        return l.indexOf('data:') === 0;
      });
      for (var k = 0; k < remaining.length; k++) {
        var jsonStr2 = remaining[k].replace(/^data:\s*/, '');
        try {
          var evt2 = JSON.parse(jsonStr2);
          this.handleEvent(evt2);
        } catch (e) { /* ignore */ }
      }
    }

    // If the stream ended without a result event, show empty state
    if (this._canvas.children.length === 0 ||
        (this._canvas.children.length === 1 && this._canvas.querySelector('#canvas-status-bar'))) {
      this._hideStatusBar();
      this._renderEmptyState();
    }
  }

  _renderResult(uiJson, text) {
    var components = uiJson.components || [];

    // Title bar
    if (uiJson.title) {
      this._canvas.appendChild(buildTitleBar(uiJson.title));
    }

    // Prose text answer
    if (text) {
      this._canvas.appendChild(buildProseBlock(text));
    }

    // Component deck
    if (components.length === 0) {
      // No components — render empty state fallback
      this._canvas.appendChild(buildEmptyState());
      return;
    }

    var deck = document.createElement('div');
    deck.id = 'canvas-component-deck';
    deck.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
    this._canvas.appendChild(deck);

    var self = this;
    components.forEach(function(spec, idx) {
      // Staggered mount animation (80ms apart)
      setTimeout(function() {
        var compEl = renderComponent(spec); // returns null for unknown types
        if (!compEl) return;               // skip silently — no crash

        compEl.style.cssText += ';opacity:0;transform:translateY(10px);transition:opacity .3s ease,transform .3s ease;';
        deck.appendChild(compEl);

        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            compEl.style.opacity = '1';
            compEl.style.transform = 'translateY(0)';
          });
        });
      }, idx * 100);
    });
  }

  _renderEmptyState() {
    this._clearCanvas();
    this._canvas.appendChild(buildEmptyState());
  }

  _clearCanvas() {
    // Remove everything except the persistent status bar
    var children = Array.prototype.slice.call(this._canvas.children);
    var self = this;
    children.forEach(function(child) {
      if (child !== self._statusBar) {
        self._canvas.removeChild(child);
      }
    });
  }

  _showStatusBar(message) {
    if (!this._statusBar) {
      this._statusBar = buildStatusBar();
      // Prepend so it always sits above content
      this._canvas.insertBefore(this._statusBar, this._canvas.firstChild);
    }
    this._statusBar.style.display = 'flex';
    var textEl = this._statusBar.querySelector('#canvas-status-text');
    if (textEl) textEl.textContent = message;
  }

  _hideStatusBar() {
    if (this._statusBar) {
      this._statusBar.style.display = 'none';
    }
  }

  /** Inject radar-sweep keyframe CSS once per document. */
  _injectKeyframes() {
    if (document.getElementById('orca-renderer-styles')) return;
    var style = document.createElement('style');
    style.id = 'orca-renderer-styles';
    style.textContent = [
      '@keyframes orca-radar-spin {',
      '  from { transform: rotate(0deg); }',
      '  to   { transform: rotate(360deg); }',
      '}',
      // Respect prefers-reduced-motion
      '@media (prefers-reduced-motion: reduce) {',
      '  #canvas-radar-sweep { animation: none !important; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }
}

// ─────────────────────────────────────────────────────────────
// SPRING BOOT SSE BRIDGE
//
// Drop-in replacement for GenerativeAgentBridge that speaks
// the backend's actual SSE protocol (status / result events)
// and drives a CanvasRenderer.
// ─────────────────────────────────────────────────────────────
export class SpringBootBridge {
  /**
   * @param {object}  [opts]
   * @param {string}  [opts.endpoint]    Default '/api/chat'
   * @param {string}  [opts.bearerToken] Optional auth token
   * @param {boolean} [opts.fallback]    Fall back to mock on error (default true)
   */
  constructor(opts) {
    opts = opts || {};
    this.endpoint    = opts.endpoint    || (localStorage.getItem('orca_chat_endpoint') || '/api/chat');
    this.bearerToken = opts.bearerToken || (localStorage.getItem('orca_bearer_token')  || '');
    this.fallback    = opts.fallback !== false;
  }

  /**
   * Send a query and stream results into a CanvasRenderer.
   *
   * @param {string}        queryText
   * @param {CanvasRenderer} renderer
   */
  async streamTo(queryText, renderer) {
    try {
      await renderer.stream(
        this.endpoint,
        { message: queryText },
        { bearerToken: this.bearerToken }
      );
    } catch (err) {
      console.error('[ORCA SpringBootBridge] Fatal error:', err);
      if (this.fallback) {
        console.warn('[ORCA SpringBootBridge] Falling back to mock response.');
        this._mockFallback(queryText, renderer);
      }
    }
  }

  /** Minimal mock — fires a status then a result with an evidence panel. */
  async _mockFallback(queryText, renderer) {
    renderer.handleEvent({ type: 'status', message: 'Backend offline — using mock data...' });
    await new Promise(function(r) { setTimeout(r, 900); });
    renderer.handleEvent({
      type: 'result',
      text: 'Backend is unreachable. This is a mock fallback response for development.',
      ui_json: {
        title: 'Mock Response (Backend Offline)',
        components: [
          {
            type: 'alert-card',
            data: {
              level: 'warning',
              title: 'Backend Unreachable',
              message: 'Could not connect to ' + (this.endpoint || '/api/chat') + '. Showing mock data. Start the Spring Boot or FastAPI server at localhost:8000.',
              source: 'ORCA Frontend',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            }
          },
          {
            type: 'evidence-panel',
            data: {
              title: 'Query received: ' + queryText,
              entries: [
                'POST /api/chat → connection refused (backend not running)',
                'Fallback mock triggered by SpringBootBridge',
                'Start Spring Boot with: ./mvnw spring-boot:run',
              ],
              summary: 'No live data available. All components above are mock placeholders.',
            }
          }
        ]
      }
    });
  }
}
