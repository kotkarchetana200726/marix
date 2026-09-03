// ORCA Component Cards Registry
// Dynamic cards for Chat / Generative Canvas and Operational Views

import { createRiskGaugeHTML } from './riskGauge.js';
import { getMarineIcon } from './components.js';

export function createRiskCard(data) {
  const gaugeHtml = createRiskGaugeHTML({
    score: data.riskScore || 50,
    title: data.zoneName || "ZONE HAZARD",
    size: 150
  });

  return `
    <div class="orca-card bezel-panel">
      <div class="orca-card-header">
        <span class="orca-card-title text-amber" style="display:flex;align-items:center;gap:6px;">
          ${getMarineIcon('warning', 18, 'var(--phosphor-amber)')} HAZARD REASONING CARD
        </span>
        <span class="panel-badge ${data.riskScore > 70 ? 'badge-red' : (data.riskScore > 35 ? 'badge-amber' : 'badge-green')}">
          ${data.status || 'ACTIVE'}
        </span>
      </div>
      
      <div style="display: flex; gap: 16px; align-items: center; padding: 6px 0;">
        <div style="flex-shrink: 0;">
          ${gaugeHtml}
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
          <div class="font-data" style="font-size: 0.82rem; font-weight: 700; color: var(--parchment-bright);">
            ${data.title || data.name || 'Maritime Zone Assessment'}
          </div>
          <div style="font-size: 0.82rem; color: var(--parchment); line-height: 1.45;">
            ${data.reasoning || data.description || 'Continuous oceanographic monitoring indicates active environmental gradients.'}
          </div>
          <div class="font-data" style="font-size: 0.70rem; color: var(--muted); margin-top: 4px; display:flex; align-items:center; gap:4px;">
            ${getMarineIcon('compass', 13, 'var(--phosphor-amber)')} COORDS: <span class="text-amber">${data.coordinates || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="orca-card-grid-2">
        <div class="orca-data-cell">
          <div style="display:flex;align-items:center;gap:4px;"><span class="label">Swell / Wave</span></div>
          <span class="val">${data.swell || data.waveHeightMax || '2.4m Moderate'}</span>
        </div>
        <div class="orca-data-cell">
          <div style="display:flex;align-items:center;gap:4px;"><span class="label">Wind Speed</span></div>
          <span class="val">${data.wind || data.windMax || '22 kts'}</span>
        </div>
      </div>
    </div>
  `;
}

export function createPFZCard(data) {
  const speciesBadges = (data.targetSpecies || ['Pelagic Fishes', 'Mackerel'])
    .map(s => `<span class="panel-badge badge-green" style="font-size: 0.68rem; margin-right: 4px; margin-bottom: 4px; display: inline-block;">${s}</span>`)
    .join('');

  return `
    <div class="orca-card bezel-panel">
      <div class="orca-card-header">
        <span class="orca-card-title text-green" style="display:flex;align-items:center;gap:6px;">
          ${getMarineIcon('fish', 18, 'var(--phosphor-green)')} POTENTIAL FISHING ZONE (PFZ)
        </span>
        <span class="panel-badge badge-green">${data.confidence || '95%'} CONFIDENCE</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap:wrap; gap:6px;">
          <span class="font-display" style="font-size: 1.08rem; font-weight: 700; color: var(--parchment-bright);">
            ${data.name || 'Thermal Front Advisory'}
          </span>
          <span class="font-data text-amber" style="font-size: 0.80rem; display:inline-flex; align-items:center; gap:4px;">
            ${getMarineIcon('compass', 13, 'var(--phosphor-amber)')} ${data.latLonStr || '17°25\'N, 72°21\'E'}
          </span>
        </div>

        <div style="font-size: 0.84rem; color: var(--parchment); line-height: 1.45;">
          ${data.advisory || 'High plankton bloom detected by Sentinel-3 OLCI. Thermal gradient favorable for aggregation.'}
        </div>

        <div style="margin-top: 4px;">
          <div class="font-data" style="font-size: 0.65rem; color: var(--muted); margin-bottom: 4px; text-transform: uppercase;">
            Target Species Aggregation:
          </div>
          <div>${speciesBadges}</div>
        </div>

        <div class="orca-card-grid-2" style="margin-top: 6px;">
          <div class="orca-data-cell">
            <span class="label">SST Anomaly</span>
            <span class="val text-green">${data.sstAnomaly || '-1.2°C Upwelling'}</span>
          </div>
          <div class="orca-data-cell">
            <span class="label">Chlorophyll-a</span>
            <span class="val text-amber">${data.chlorophyll || '3.4 mg/m³'}</span>
          </div>
          <div class="orca-data-cell">
            <span class="label">Distance / Depth</span>
            <span class="val">${data.distanceNm || '25.9'} nm / ${data.depthM || '65'}m</span>
          </div>
          <div class="orca-data-cell">
            <span class="label">Fuel Savings Est.</span>
            <span class="val text-green">${data.fuelSavingsEst || '28%'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function createWeatherCard(data) {
  return `
    <div class="orca-card bezel-panel">
      <div class="orca-card-header">
        <span class="orca-card-title text-amber" style="display:flex;align-items:center;gap:6px;">
          ${getMarineIcon('wind', 18, 'var(--phosphor-amber)')} METEOROLOGICAL TELEMETRY
        </span>
        <span class="panel-badge badge-amber">IMD / INCOIS BUOY</span>
      </div>

      <div class="orca-card-grid-2">
        <div class="orca-data-cell">
          <span class="label">Barometric Pressure</span>
          <span class="val">${data.pressure || '1004.2 hPa'}</span>
        </div>
        <div class="orca-data-cell">
          <span class="label">Sea Surface Temp</span>
          <span class="val">${data.sst || '28.4°C'}</span>
        </div>
        <div class="orca-data-cell">
          <span class="label">Wind Direction & Speed</span>
          <span class="val">${data.wind || '24 kts WSW'}</span>
        </div>
        <div class="orca-data-cell">
          <span class="label">Significant Wave Swell</span>
          <span class="val text-amber">${data.swell || '2.8m @ 12.4s'}</span>
        </div>
      </div>

      <div style="font-size: 0.78rem; color: var(--muted); border-top: 1px solid var(--chart-line); padding-top: 8px; margin-top:6px; display:flex; gap:12px;">
        <span>Visibility: <strong class="font-data text-parchment">${data.visibility || '6.5 nm (Moderate Haze)'}</strong></span>
        <span>Current: <strong class="font-data text-parchment">${data.current || '0.9 kts SSE'}</strong></span>
      </div>
    </div>
  `;
}

export function createVesselAdvisoryCard(data) {
  return `
    <div class="orca-card bezel-panel">
      <div class="orca-card-header">
        <span class="orca-card-title text-parchment" style="display:flex;align-items:center;gap:6px;">
          ${getMarineIcon('ship', 18, 'var(--parchment)')} TACTICAL VESSEL ADVISORY
        </span>
        <span class="panel-badge ${data.priority === 'CRITICAL' ? 'badge-red' : 'badge-amber'}">
          ${data.priority || 'ADVISORY'}
        </span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div class="font-display" style="font-size: 0.98rem; font-weight: 700; color: var(--brass);">
          ${data.heading || 'Bridge Navigation Directive'}
        </div>
        <div style="font-size: 0.84rem; color: var(--parchment); line-height: 1.45;">
          ${data.text || 'Reduce vessel cruising speed to 9 knots. Maintain continuous radar guard zone 2.5 nm.'}
        </div>
      </div>

      <div class="orca-card-grid-2" style="margin-top: 6px;">
        <div class="orca-data-cell">
          <span class="label">Recommended Safe Harbor</span>
          <span class="val text-green">${data.safeHarbor || 'Ratnagiri Anchorage'}</span>
        </div>
        <div class="orca-data-cell">
          <span class="label">VHF Emergency Channel</span>
          <span class="val text-amber">${data.vhf || 'CH 16 / 08'}</span>
        </div>
      </div>
    </div>
  `;
}

export function createRoutePreviewCard(data) {
  return `
    <div class="orca-card bezel-panel">
      <div class="orca-card-header">
        <span class="orca-card-title text-amber" style="display:flex;align-items:center;gap:6px;">
          ${getMarineIcon('compass', 18, 'var(--phosphor-amber)')} ROUTE COMPARISON SUMMARY
        </span>
        <a href="#/route" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none;">OPEN PLANNER →</a>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span class="font-data" style="font-size: 0.82rem; font-weight: 700;">
          ${data.origin || 'Veraval'} ➔ ${data.destination || 'Ratnagiri'}
        </span>
        <span class="panel-badge badge-green">36nm SAFE DETOUR</span>
      </div>

      <div class="orca-card-grid-2">
        <div class="orca-data-cell" style="border-left: 2px solid var(--phosphor-green);">
          <span class="label">ORCA Safe Route</span>
          <span class="val text-green">Risk: 19/100</span>
          <span class="font-data" style="font-size: 0.70rem; color: var(--muted);">ETA 29h 15m • Fuel 3320L</span>
        </div>
        <div class="orca-data-cell" style="border-left: 2px solid var(--radar-red);">
          <span class="label">Shortest Route</span>
          <span class="val text-red">Risk: 84/100</span>
          <span class="font-data" style="font-size: 0.70rem; color: var(--muted);">ETA 26h 30m • Intersects Storm</span>
        </div>
      </div>
    </div>
  `;
}

export function createReasoningLogCard(steps) {
  const stepsHtml = steps.map((step, idx) => `
    <div style="display: flex; gap: 8px; font-family: var(--font-data); font-size: 0.75rem; line-height: 1.45;">
      <span class="text-brass" style="font-weight: 700;">[0${idx + 1}]</span>
      <span style="color: var(--parchment);">${step}</span>
    </div>
  `).join('');

  return `
    <div class="orca-card bezel-panel" style="background: #080D11; border-color: var(--chart-line);">
      <div class="orca-card-header">
        <span class="orca-card-title text-muted" style="font-size: 0.72rem; display:flex; align-items:center; gap:6px;">
          ${getMarineIcon('brain', 16, 'var(--muted)')} AGENT CHAIN-OF-THOUGHT INFERENCE TRACE
        </span>
        <span class="panel-badge badge-amber" style="font-size: 0.65rem;">VALIDATED</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; padding: 4px 0;">
        ${stepsHtml}
      </div>
    </div>
  `;
}
