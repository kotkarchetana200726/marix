// ORCA — Canvas Renderer
//
// Connects to POST /api/chat on the Spring Boot backend via a ReadableStream,
// parses Server-Sent Events, and drives the #canvas div in the Generative Canvas view.
//
// SSE event shapes (from backend):
//   { "type": "status",  "message": "Checking weather..." }
//   { "type": "result",  "ui_json": { "title": "...", "components": [{ "type": "risk-card", "data": {...} }] }, "text": "..." }

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
// SKELETON UI LOADING DECK — "The dashboard is forming..."
// ─────────────────────────────────────────────────────────────
function buildSkeletonDeck() {
  var div = document.createElement('div');
  div.id = 'canvas-skeleton-deck';
  div.style.cssText = 'display:flex;flex-direction:column;gap:12px;margin-top:12px;';
  div.innerHTML = `
    <div class="orca-skeleton-card bezel-panel" style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div class="orca-skeleton-line" style="width:40%;height:14px;"></div>
        <div class="orca-skeleton-line" style="width:20%;height:12px;"></div>
      </div>
      <div style="display:flex;gap:16px;align-items:center;">
        <div class="orca-skeleton-circle" style="width:90px;height:60px;border-radius:60px 60px 0 0;"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
          <div class="orca-skeleton-line" style="width:70%;height:14px;"></div>
          <div class="orca-skeleton-line" style="width:95%;height:10px;"></div>
          <div class="orca-skeleton-line" style="width:50%;height:10px;"></div>
        </div>
      </div>
    </div>
    <div class="orca-skeleton-card bezel-panel" style="padding:16px;">
      <div class="orca-skeleton-line" style="width:45%;height:14px;margin-bottom:12px;"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div class="orca-skeleton-line" style="height:38px;"></div>
        <div class="orca-skeleton-line" style="height:38px;"></div>
      </div>
    </div>
  `;
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
    '  ✓ ORCA RESULT',
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
    'font-size:.84rem;color:var(--parchment);line-height:1.55;',
    'padding:10px 14px;margin-bottom:12px;',
    'border-left:2px solid var(--chart-line);',
  ].join('');
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
  div.innerHTML = '🚨 <strong>TRANSMISSION ERROR</strong> — ' + (message || 'Unknown error. Check backend connection.');
  return div;
}

// ─────────────────────────────────────────────────────────────
// CANVAS RENDERER CLASS
// ─────────────────────────────────────────────────────────────
export class CanvasRenderer {
  constructor(canvasEl) {
    this._canvas    = canvasEl;
    this._statusBar = null;
    this._streaming = false;

    this._injectKeyframes();
    this._renderEmptyState();
  }

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

    console.debug('[ORCA Renderer] Unrecognised event type "' + event.type + '" — ignored.');
  }

  reset() {
    this._streaming = false;
    this._hideStatusBar();
    this._renderEmptyState();
  }

  async _consumeSSEStream(readableBody) {
    var reader  = readableBody.getReader();
    var decoder = new TextDecoder('utf-8');
    var buffer  = '';

    while (true) {
      var chunk = await reader.read();
      if (chunk.done) break;

      buffer += decoder.decode(chunk.value, { stream: true });
      var parts = buffer.split('\n\n');
      buffer = parts.pop();

      for (var i = 0; i < parts.length; i++) {
        var raw = parts[i].trim();
        if (!raw) continue;

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

    if (this._canvas.children.length === 0 ||
        (this._canvas.children.length === 1 && this._canvas.querySelector('#canvas-status-bar'))) {
      this._hideStatusBar();
      this._renderEmptyState();
    }
  }

  _renderResult(uiJson, text) {
    var components = uiJson.components || [];

    if (uiJson.title) {
      this._canvas.appendChild(buildTitleBar(uiJson.title));
    }

    if (text) {
      this._canvas.appendChild(buildProseBlock(text));
    }

    if (components.length === 0) {
      this._canvas.appendChild(buildEmptyState());
      return;
    }

    var deck = document.createElement('div');
    deck.id = 'canvas-component-deck';
    deck.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
    this._canvas.appendChild(deck);

    components.forEach(function(spec, idx) {
      // Staggered 180ms entrance animation per specification
      setTimeout(function() {
        var compEl = renderComponent(spec);
        if (!compEl) return;

        compEl.style.cssText += ';opacity:0;transform:translateY(8px);transition:opacity 0.22s ease, transform 0.22s ease;';
        deck.appendChild(compEl);

        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            compEl.style.opacity = '1';
            compEl.style.transform = 'translateY(0)';
          });
        });
      }, idx * 180);
    });
  }

  _renderEmptyState() {
    this._clearCanvas();
    this._canvas.appendChild(buildEmptyState());
  }

  _clearCanvas() {
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
      this._canvas.insertBefore(this._statusBar, this._canvas.firstChild);
    }
    this._statusBar.style.display = 'flex';
    var textEl = this._statusBar.querySelector('#canvas-status-text');
    if (textEl) textEl.textContent = message;

    // Show skeleton loading deck while status bar is active
    if (!this._canvas.querySelector('#canvas-skeleton-deck')) {
      this._canvas.appendChild(buildSkeletonDeck());
    }
  }

  _hideStatusBar() {
    if (this._statusBar) {
      this._statusBar.style.display = 'none';
    }
    var skel = this._canvas.querySelector('#canvas-skeleton-deck');
    if (skel) {
      this._canvas.removeChild(skel);
    }
  }

  _injectKeyframes() {
    if (document.getElementById('orca-renderer-styles')) return;
    var style = document.createElement('style');
    style.id = 'orca-renderer-styles';
    style.textContent = [
      '@keyframes orca-radar-spin {',
      '  from { transform: rotate(0deg); }',
      '  to   { transform: rotate(360deg); }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  #canvas-radar-sweep { animation: none !important; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
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
                'Start Spring Boot or FastAPI backend at localhost:8000',
              ],
              summary: 'No live data available. All components above are mock placeholders.',
            }
          }
        ]
      }
    });
  }
}
