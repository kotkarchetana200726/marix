// ORCA Marine Bridge Console — Data Adapters & Agent Config (/#admin)
// Sensor adapter registry, ping actions, and live AI Agent endpoint bridge settings

import { DATA_ADAPTERS } from '../data/mockData.js';
import { AgentBridgeService } from '../services/agentBridge.js';

export function renderAdminView(container, { i18n, soundEngine }) {
  const bridge = new AgentBridgeService();

  const adaptersRows = DATA_ADAPTERS.map((adp, idx) => `
    <tr id="row-adp-${idx}">
      <td>
        <div style="font-weight: 700; color: var(--parchment-bright);">${adp.name}</div>
        <div style="font-size: 0.68rem; color: var(--muted);">${adp.protocol}</div>
      </td>
      <td>
        <span class="panel-badge ${adp.status.includes('LIVE') ? 'badge-green' : 'badge-amber'}" id="status-adp-${idx}">
          ${adp.status}
        </span>
      </td>
      <td class="text-amber" id="lat-adp-${idx}">${adp.latency}</td>
      <td id="pkt-adp-${idx}">${adp.packets}</td>
      <td class="text-muted" style="font-size: 0.70rem;" id="sync-adp-${idx}">${adp.lastSync}</td>
      <td>
        <button class="btn-tactical btn-tactical-sm btn-poll-adp" data-idx="${idx}">
          ⚡ ${i18n.refresh_source || 'POLL'}
        </button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="admin-view-container">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <h1 class="font-display text-parchment-bright" style="font-size: 1.8rem; font-weight: 700; margin-bottom: 2px;">
            Data Adapters & AI Agent Infrastructure
          </h1>
          <div class="font-data text-muted" style="font-size: 0.75rem;">
            TELEMETRY INGESTION PIPELINES & BACKEND LLM AGENT CONFIGURATION
          </div>
        </div>

        <button class="btn-tactical btn-tactical-amber" id="btn-poll-all">
          🔄 POLL ALL ADAPTERS
        </button>
      </div>

      <!-- Live Sensor Adapters Table -->
      <div class="bezel-panel panel-body">
        <div class="panel-header" style="background: transparent; padding: 0 0 10px 0; border-bottom: 1px solid var(--chart-line); margin-bottom: 12px;">
          <span class="panel-title">
            <span class="icon">🛰️</span> MARITIME DATA ADAPTER REGISTRY
          </span>
          <span class="panel-badge badge-green">6/6 ADAPTERS HEALTHY</span>
        </div>

        <div style="overflow-x: auto;">
          <table class="adapters-table">
            <thead>
              <tr>
                <th>DATA ADAPTER SOURCE</th>
                <th>PIPELINE STATUS</th>
                <th>LATENCY</th>
                <th>PACKETS INGESTED</th>
                <th>LAST SYNCHRONIZATION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${adaptersRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- AI Agent Bridge Configuration Panel -->
      <div class="bezel-panel panel-body">
        <div class="panel-header" style="background: transparent; padding: 0 0 10px 0; border-bottom: 1px solid var(--chart-line); margin-bottom: 14px;">
          <span class="panel-title">
            <span class="icon">🤖</span> AI AGENT BACKEND CONNECTION (FASTAPI / LANGCHAIN / CREWAI)
          </span>
          <span class="panel-badge ${bridge.mode === 'LIVE_API' ? 'badge-green' : 'badge-amber'}">
            MODE: ${bridge.mode}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Left: Connection Settings -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="route-form-group">
              <label class="font-data text-brass" style="font-size: 0.70rem; font-weight: 700;">
                OPERATIONAL BRIDGE MODE
              </label>
              <select class="route-select" id="agent-mode-select">
                <option value="SIMULATED" ${bridge.mode === 'SIMULATED' ? 'selected' : ''}>
                  SIMULATION REASONING ENGINE (High-Fidelity Mock Streamer)
                </option>
                <option value="LIVE_API" ${bridge.mode === 'LIVE_API' ? 'selected' : ''}>
                  LIVE BACKEND API (FastAPI / SSE / REST Endpoint)
                </option>
              </select>
            </div>

            <div class="route-form-group">
              <label class="font-data text-muted" style="font-size: 0.70rem;">
                AGENT INFERENCE ENDPOINT URL
              </label>
              <input type="text" class="route-input" id="agent-endpoint-input" value="${bridge.endpointUrl}" placeholder="http://localhost:8000/api/orca/reason">
            </div>

            <div class="route-form-group">
              <label class="font-data text-muted" style="font-size: 0.70rem;">
                BEARER AUTH / API KEY (OPTIONAL)
              </label>
              <input type="password" class="route-input" id="agent-key-input" value="${bridge.apiKey}" placeholder="Bearer orca-sec-key-••••••••">
            </div>

            <div style="display: flex; gap: 10px; margin-top: 6px;">
              <button class="btn-tactical btn-tactical-amber" id="btn-save-agent-cfg">
                💾 SAVE BRIDGE SETTINGS
              </button>
              <button class="btn-tactical" id="btn-test-agent-ping">
                🔌 TEST PING BACKEND
              </button>
            </div>
          </div>

          <!-- Right: Backend Agent Contract Documentation -->
          <div style="background: rgba(10, 16, 20, 0.7); border: 1px solid var(--chart-line); border-radius: var(--radius); padding: 14px; display: flex; flex-direction: column; gap: 8px;">
            <div class="font-data text-amber" style="font-size: 0.75rem; font-weight: 700;">
              📋 AI AGENT REST / SSE CONTRACT
            </div>
            <div style="font-size: 0.80rem; color: var(--parchment); line-height: 1.4;">
              When switched to <strong>LIVE_API</strong>, the Chat Canvas transmits POST requests with <code>{ "prompt": string }</code> and expects either JSON or Server-Sent Events (SSE) streaming reasoning steps and component cards.
            </div>
            <pre style="background: #060A0D; padding: 8px; border: 1px solid var(--chart-line); border-radius: 3px; font-family: var(--font-data); font-size: 0.68rem; color: var(--phosphor-green); overflow-x: auto;">
POST /api/orca/reason
Request: { "prompt": "Assess cyclone risk near Mumbai" }
Response: {
  "type": "COMPLETE",
  "steps": ["Analyzing Doppler radar...", "Evaluating swell..."],
  "prose": "Tropical Depression Varuna active...",
  "cardsHtml": "&lt;div class='orca-card'...&gt;"
}
            </pre>
            <div id="ping-result-msg" class="font-data text-muted" style="font-size: 0.70rem;">
              Agent Bridge Ready.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Poll individual adapter
  const pollButtons = container.querySelectorAll('.btn-poll-adp');
  pollButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-idx');
      if (soundEngine) soundEngine.playTacticalBeep();

      btn.textContent = 'POLLING...';
      const latEl = container.querySelector(`#lat-adp-${idx}`);
      const syncEl = container.querySelector(`#sync-adp-${idx}`);

      setTimeout(() => {
        const randLat = Math.floor(Math.random() * 60 + 15) + 'ms';
        if (latEl) latEl.textContent = randLat;
        if (syncEl) syncEl.textContent = new Date().toISOString().replace('T', ' ').substr(0, 19) + ' UTC';
        btn.textContent = '✓ SYNCD';
        setTimeout(() => {
          btn.textContent = '⚡ POLL';
        }, 1500);
      }, 500);
    });
  });

  // Poll All
  const btnPollAll = container.querySelector('#btn-poll-all');
  btnPollAll.addEventListener('click', () => {
    if (soundEngine) soundEngine.playTacticalChirp();
    btnPollAll.textContent = 'POLLING ALL 6 ADAPTERS...';
    setTimeout(() => {
      pollButtons.forEach(btn => btn.click());
      btnPollAll.textContent = '✓ ALL SOURCES SYNCHRONIZED';
      setTimeout(() => {
        btnPollAll.textContent = '🔄 POLL ALL ADAPTERS';
      }, 2000);
    }, 400);
  });

  // Save Agent Config
  const btnSave = container.querySelector('#btn-save-agent-cfg');
  const modeSelect = container.querySelector('#agent-mode-select');
  const endpointInput = container.querySelector('#agent-endpoint-input');
  const keyInput = container.querySelector('#agent-key-input');
  const pingMsg = container.querySelector('#ping-result-msg');

  btnSave.addEventListener('click', () => {
    if (soundEngine) soundEngine.playTacticalChirp();
    bridge.setMode(modeSelect.value);
    bridge.setEndpoint(endpointInput.value, keyInput.value);
    btnSave.textContent = '✓ SETTINGS SAVED';
    setTimeout(() => {
      btnSave.textContent = '💾 SAVE BRIDGE SETTINGS';
    }, 2000);
  });

  // Test Ping Backend
  const btnPing = container.querySelector('#btn-test-agent-ping');
  btnPing.addEventListener('click', async () => {
    if (soundEngine) soundEngine.playTacticalBeep();
    pingMsg.textContent = 'Pinging backend endpoint ' + endpointInput.value + '...';
    pingMsg.style.color = 'var(--phosphor-amber)';

    if (modeSelect.value === 'SIMULATED') {
      setTimeout(() => {
        pingMsg.textContent = '✓ Simulated Bridge Engine active & responsive (Latency: 0ms).';
        pingMsg.style.color = 'var(--phosphor-green)';
      }, 400);
    } else {
      try {
        const resp = await fetch(endpointInput.value, { method: 'OPTIONS' }).catch(() => null);
        if (resp && resp.ok) {
          pingMsg.textContent = `✓ Backend responded successfully (Status ${resp.status}).`;
          pingMsg.style.color = 'var(--phosphor-green)';
        } else {
          pingMsg.textContent = `⚠️ Endpoint reachable or simulated fallback will be engaged if unavailable.`;
          pingMsg.style.color = 'var(--phosphor-amber)';
        }
      } catch (e) {
        pingMsg.textContent = `⚠️ Could not reach endpoint. Fallback to simulation is ready.`;
        pingMsg.style.color = 'var(--radar-red)';
      }
    }
  });
}
