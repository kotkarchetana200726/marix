// ORCA Marine Bridge Console — Safety & Emergency Operations (/#safety)
// Regional Risk Gauge bank, real-time alert feed & protocol directives

import { MONITORED_ZONES, ACTIVE_ALERTS } from '../data/mockData.js';
import { createRiskGaugeHTML } from '../components/riskGauge.js';

export function renderSafetyView(container, { i18n, soundEngine }) {
  // Generate Regional Risk Gauges HTML
  const gaugesHtml = MONITORED_ZONES.map((zone, idx) => {
    const gauge = createRiskGaugeHTML({
      id: `safety-zone-gauge-${idx}`,
      score: zone.riskScore,
      title: zone.status,
      size: 140
    });

    return `
      <div class="bezel-panel panel-body" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;">
        <div class="font-data" style="font-size: 0.82rem; font-weight: 700; color: var(--parchment-bright);">
          ${zone.name}
        </div>
        <div class="font-data text-muted" style="font-size: 0.65rem;">
          ${zone.coordinates}
        </div>
        
        <div style="margin: 4px 0;">
          ${gauge}
        </div>

        <div style="width: 100%; border-top: 1px solid var(--chart-line); padding-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-family: var(--font-data); font-size: 0.68rem;">
          <div style="text-align: left;">
            <span class="text-muted">WIND:</span> <span class="text-amber">${zone.wind.split(' ')[0]}</span>
          </div>
          <div style="text-align: right;">
            <span class="text-muted">SWELL:</span> <span class="${zone.riskScore > 70 ? 'text-red' : 'text-green'}">${zone.swell.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Generate Alert Feed items
  const alertsHtml = ACTIVE_ALERTS.map(alert => `
    <div class="alert-card-item severity-${alert.severity}" data-severity="${alert.severity}">
      <div class="alert-item-header">
        <span class="panel-badge ${alert.severity === 'CRITICAL' ? 'badge-red' : (alert.severity === 'HIGH' ? 'badge-amber' : 'badge-green')}">
          ${alert.severity} // ${alert.category}
        </span>
        <span class="font-data text-amber" style="font-size: 0.70rem; font-weight: 700;">
          RISK SCORE: ${alert.riskGaugeScore}/100
        </span>
      </div>

      <div class="alert-item-title">${alert.title}</div>
      <div class="alert-item-desc">${alert.description}</div>

      <div style="background: rgba(10, 16, 20, 0.6); padding: 8px 10px; border-radius: var(--radius); border-left: 2px solid var(--brass); margin-top: 4px;">
        <span class="font-data text-brass" style="font-size: 0.68rem; font-weight: 700;">DIRECTIVE: </span>
        <span style="font-size: 0.78rem; color: var(--parchment-bright);">${alert.actionRequired}</span>
      </div>

      <div class="alert-item-meta">
        <span>📍 COORDS: <strong class="text-parchment">${alert.coordinates}</strong></span>
        <span>🛰️ SOURCE: <strong>${alert.source}</strong></span>
        <span>⏱️ <strong>${alert.timestamp}</strong></span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="safety-view-container">
      <!-- Section Header -->
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <h1 class="font-display text-parchment-bright" style="font-size: 1.8rem; font-weight: 700; margin-bottom: 2px;">
            Safety & Marine Hazard Operations
          </h1>
          <div class="font-data text-muted" style="font-size: 0.75rem;">
            CONTINUOUS MULTI-ZONE INSTRUMENT TELEMETRY & EMERGENCY FEEDS
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <span class="telemetry-status-pill">
            <span class="beacon-pulse" style="background: var(--radar-red);"></span>
            1 CRITICAL CYCLONE CORE
          </span>
          <span class="telemetry-status-pill">
            <span class="beacon-pulse"></span>
            BUOY MESH ONLINE
          </span>
        </div>
      </div>

      <!-- Regional Risk Gauge Array -->
      <div>
        <div class="font-data text-brass" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 8px;">
          ▶ MONITORED MARITIME BASINS (ANALOG RISK DIALS)
        </div>
        <div class="safety-top-grid">
          ${gaugesHtml}
        </div>
      </div>

      <!-- Live Emergency Alerts Feed & Emergency Action Cards -->
      <div class="safety-feed-section">
        <!-- Left: Alert Feed -->
        <div class="bezel-panel">
          <div class="panel-header">
            <span class="panel-title">
              <span class="icon">🚨</span> ACTIVE MARITIME BROADCASTS
            </span>
            
            <!-- Severity Filter Buttons -->
            <div style="display: flex; gap: 4px;" id="alert-filters">
              <button class="btn-tactical btn-tactical-sm active" data-filter="ALL">ALL</button>
              <button class="btn-tactical btn-tactical-sm text-red" data-filter="CRITICAL">CRITICAL</button>
              <button class="btn-tactical btn-tactical-sm text-amber" data-filter="HIGH">HIGH</button>
              <button class="btn-tactical btn-tactical-sm text-green" data-filter="ADVISORY">ADVISORY</button>
            </div>
          </div>

          <div class="panel-body">
            <div class="alert-feed-list" id="alerts-list-container">
              ${alertsHtml}
            </div>
          </div>
        </div>

        <!-- Right: SOS / Rescue Telemetry Directives -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="bezel-panel panel-body" style="background: rgba(255, 92, 92, 0.08); border-color: var(--radar-red);">
            <div class="font-data text-red" style="font-size: 0.78rem; font-weight: 700; margin-bottom: 6px;">
              ⚠️ MARITIME DISTRESS PROTOCOL
            </div>
            <div style="font-size: 0.82rem; color: var(--parchment); line-height: 1.5;">
              Coast Guard Maritime Rescue Coordination Centre (MRCC Mumbai) is broadcasting on MF DSC 2187.5 kHz and VHF CH 16.
            </div>
            <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 6px;">
              <a href="tel:1554" class="btn-tactical btn-tactical-red" style="width: 100%;">
                📞 CALL COAST GUARD (1554)
              </a>
              <button class="btn-tactical btn-tactical-amber" id="btn-broadcast-ack" style="width: 100%;">
                📻 ACKNOWLEDGE BROADCAST
              </button>
            </div>
          </div>

          <div class="bezel-panel panel-body">
            <div class="font-data text-amber" style="font-size: 0.75rem; font-weight: 700; margin-bottom: 6px;">
              📡 SENSOR ADAPTER HEALTH
            </div>
            <div style="font-family: var(--font-data); font-size: 0.72rem; color: var(--muted); display: flex; flex-direction: column; gap: 4px;">
              <div>• INCOIS Coastal Buoys: <span class="text-green">SYNCHRONIZED (99.9%)</span></div>
              <div>• IMD Doppler Radar: <span class="text-green">ONLINE (68ms)</span></div>
              <div>• NOAA Satellite SST: <span class="text-green">PASS COMPLETE</span></div>
              <div>• AIS Vessel Mesh: <span class="text-amber">CONGESTION DETECTED</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Severity Filter Logic
  const filterBtns = container.querySelectorAll('#alert-filters button');
  const alertCards = container.querySelectorAll('.alert-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      if (soundEngine) soundEngine.playMechanicalClick();

      alertCards.forEach(card => {
        const sev = card.getAttribute('data-severity');
        if (filter === 'ALL' || sev === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const btnAck = container.querySelector('#btn-broadcast-ack');
  if (btnAck) {
    btnAck.addEventListener('click', () => {
      if (soundEngine) soundEngine.playTacticalChirp();
      btnAck.textContent = '✓ BROADCAST LOGGED';
      btnAck.classList.remove('btn-tactical-amber');
      btnAck.classList.add('btn-tactical-green');
    });
  }
}
