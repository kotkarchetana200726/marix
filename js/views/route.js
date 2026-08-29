// ORCA Marine Bridge Console — Route Planner (/#route)
// Side-by-side shortest vs safe route comparison with dual-path Leaflet visualization

import { ROUTE_PRESETS } from '../data/mockData.js';
import { createRiskGaugeHTML, updateRiskGauge } from '../components/riskGauge.js';

export function renderRouteView(container, { i18n, soundEngine }) {
  let activePreset = ROUTE_PRESETS[0];

  container.innerHTML = `
    <div class="route-view-container">
      <!-- Left Route Configuration & Comparison Sidebar -->
      <div class="route-sidebar">
        <div class="panel-header" style="background: transparent; padding: 0; border: none;">
          <span class="panel-title">
            <span class="icon">🚢</span> PARETO ROUTE PLANNER
          </span>
          <span class="panel-badge badge-green">OPTIMIZER READY</span>
        </div>

        <!-- Route Preset Selector -->
        <div class="route-form-group">
          <label class="font-data text-muted" style="font-size: 0.68rem; text-transform: uppercase;">
            TACTICAL PASSAGE PRESET
          </label>
          <select class="route-select" id="route-preset-select">
            ${ROUTE_PRESETS.map(rt => `<option value="${rt.id}">${rt.name}</option>`).join('')}
          </select>
        </div>

        <!-- Ports Display -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div class="orca-data-cell">
            <span class="label">Origin Port</span>
            <span class="val font-data" id="rt-origin-text" style="font-size: 0.72rem;">${activePreset.origin.name}</span>
          </div>
          <div class="orca-data-cell">
            <span class="label">Destination Port</span>
            <span class="val font-data" id="rt-dest-text" style="font-size: 0.72rem;">${activePreset.destination.name}</span>
          </div>
        </div>

        <!-- Side-by-Side Comparison Readout -->
        <div class="route-comparison-card">
          <!-- ORCA Safe Route Column -->
          <div class="comparison-column safe-col">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="font-data text-green" style="font-size: 0.72rem; font-weight: 700;">ORCA SAFE ROUTE</span>
              <span class="panel-badge badge-green">RECOMMENDED</span>
            </div>

            <div id="safe-gauge-container">
              ${createRiskGaugeHTML({ id: 'route-safe-gauge', score: activePreset.safe.riskScore, title: 'RISK INDEX', size: 120 })}
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px; font-family: var(--font-data); font-size: 0.70rem;">
              <div>• Distance: <strong class="text-parchment" id="safe-dist">${activePreset.safe.distanceNm} nm</strong></div>
              <div>• ETA: <strong class="text-parchment" id="safe-eta">${activePreset.safe.etaHours}</strong></div>
              <div>• Fuel: <strong class="text-green" id="safe-fuel">${activePreset.safe.fuelEstLiters}</strong></div>
            </div>

            <div style="font-size: 0.72rem; color: var(--parchment); line-height: 1.3; margin-top: 4px;" id="safe-desc">
              ${activePreset.safe.hazardSummary}
            </div>
          </div>

          <!-- Shortest Hazardous Route Column -->
          <div class="comparison-column hazardous-col">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="font-data text-red" style="font-size: 0.72rem; font-weight: 700;">SHORTEST DIRECT</span>
              <span class="panel-badge badge-red">HAZARDOUS</span>
            </div>

            <div id="short-gauge-container">
              ${createRiskGaugeHTML({ id: 'route-short-gauge', score: activePreset.shortest.riskScore, title: 'RISK INDEX', size: 120 })}
            </div>

            <div style="display: flex; flex-direction: column; gap: 4px; font-family: var(--font-data); font-size: 0.70rem;">
              <div>• Distance: <strong class="text-parchment" id="short-dist">${activePreset.shortest.distanceNm} nm</strong></div>
              <div>• ETA: <strong class="text-parchment" id="short-eta">${activePreset.shortest.etaHours}</strong></div>
              <div>• Fuel: <strong class="text-red" id="short-fuel">${activePreset.shortest.fuelEstLiters}</strong></div>
            </div>

            <div style="font-size: 0.72rem; color: var(--parchment); line-height: 1.3; margin-top: 4px;" id="short-desc">
              ${activePreset.shortest.hazardSummary}
            </div>
          </div>
        </div>

        <button class="btn-tactical btn-tactical-amber" id="btn-export-waypoints" style="margin-top: 8px;">
          🧭 EXPORT WAYPOINTS TO ECDIS
        </button>
      </div>

      <!-- Right Leaflet Map with Dual Route Trajectories -->
      <div style="position: relative; width: 100%; height: 100%;">
        <div id="route-leaflet-map" style="width: 100%; height: 100%; background: #080D11;"></div>

        <!-- Legend Overlay -->
        <div style="position: absolute; bottom: 20px; right: 20px; background: var(--bg-panel-translucent); border: 1px solid var(--brass); border-radius: var(--radius); padding: 8px 12px; font-family: var(--font-data); font-size: 0.70rem; z-index: 50; backdrop-filter: blur(4px); display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 18px; height: 3px; background: var(--phosphor-amber);"></div>
            <span class="text-amber">ORCA Safe Trajectory (Favorable Current)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 18px; height: 2px; background: var(--muted); border-bottom: 1px dashed var(--radar-red);"></div>
            <span class="text-muted">Shortest Direct Course (Storm Hazard)</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize Route Leaflet Map
  const mapEl = container.querySelector('#route-leaflet-map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map(mapEl, {
    center: [18.8, 72.0],
    zoom: 7,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd',
  }).addTo(map);

  const routeLayerGroup = L.layerGroup().addTo(map);

  function drawRoutes(preset) {
    routeLayerGroup.clearLayers();

    // 1. Draw Shortest Hazardous Route (Muted dashed line with red markers)
    const shortPolyline = L.polyline(preset.shortest.waypoints, {
      color: '#7C8B93',
      weight: 2.5,
      dashArray: '6, 6',
      opacity: 0.8
    }).addTo(routeLayerGroup);

    shortPolyline.bindPopup(`
      <div class="map-instrument-popup" style="border-top: 3px solid var(--radar-red);">
        <div class="map-popup-header text-red">SHORTEST DIRECT LINE</div>
        <div>Risk Rating: <strong class="text-red">${preset.shortest.riskScore}/100</strong></div>
        <div>${preset.shortest.hazardSummary}</div>
      </div>
    `);

    // 2. Draw Safe Route (Phosphor Amber solid line with glow)
    const safePolyline = L.polyline(preset.safe.waypoints, {
      color: '#FFB454',
      weight: 4,
      opacity: 0.95
    }).addTo(routeLayerGroup);

    safePolyline.bindPopup(`
      <div class="map-instrument-popup" style="border-top: 3px solid var(--phosphor-green);">
        <div class="map-popup-header text-green">ORCA RECOMMENDED SAFE PASSAGE</div>
        <div>Risk Rating: <strong class="text-green">${preset.safe.riskScore}/100</strong></div>
        <div>${preset.safe.hazardSummary}</div>
      </div>
    `);

    // 3. Add Origin & Destination Markers
    const startIcon = L.divIcon({
      className: 'start-marker',
      html: `<div style="background: var(--phosphor-green); width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px var(--phosphor-green);"></div>`,
      iconSize: [14, 14]
    });

    const endIcon = L.divIcon({
      className: 'end-marker',
      html: `<div style="background: var(--brass); width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px var(--brass);"></div>`,
      iconSize: [14, 14]
    });

    L.marker(preset.origin.coords, { icon: startIcon }).addTo(routeLayerGroup).bindPopup(`<b>ORIGIN:</b> ${preset.origin.name}`);
    L.marker(preset.destination.coords, { icon: endIcon }).addTo(routeLayerGroup).bindPopup(`<b>DESTINATION:</b> ${preset.destination.name}`);

    // Fit map bounds to routes
    map.fitBounds(safePolyline.getBounds().pad(0.2));
  }

  // Initial draw
  drawRoutes(activePreset);

  // Handle Preset Change
  const presetSelect = container.querySelector('#route-preset-select');
  presetSelect.addEventListener('change', (e) => {
    const selected = ROUTE_PRESETS.find(r => r.id === e.target.value);
    if (!selected) return;
    activePreset = selected;

    if (soundEngine) soundEngine.playMechanicalClick();

    // Update Text Data
    container.querySelector('#rt-origin-text').textContent = selected.origin.name;
    container.querySelector('#rt-dest-text').textContent = selected.destination.name;
    container.querySelector('#safe-dist').textContent = `${selected.safe.distanceNm} nm`;
    container.querySelector('#safe-eta').textContent = selected.safe.etaHours;
    container.querySelector('#safe-fuel').textContent = selected.safe.fuelEstLiters;
    container.querySelector('#safe-desc').textContent = selected.safe.hazardSummary;

    container.querySelector('#short-dist').textContent = `${selected.shortest.distanceNm} nm`;
    container.querySelector('#short-eta').textContent = selected.shortest.etaHours;
    container.querySelector('#short-fuel').textContent = selected.shortest.fuelEstLiters;
    container.querySelector('#short-desc').textContent = selected.shortest.hazardSummary;

    // Update Analog Gauges
    const safeGaugeEl = container.querySelector('#route-safe-gauge');
    const shortGaugeEl = container.querySelector('#route-short-gauge');
    if (safeGaugeEl) updateRiskGauge(safeGaugeEl, selected.safe.riskScore);
    if (shortGaugeEl) updateRiskGauge(shortGaugeEl, selected.shortest.riskScore);

    // Redraw map
    drawRoutes(selected);
  });

  const btnExport = container.querySelector('#btn-export-waypoints');
  btnExport.addEventListener('click', () => {
    if (soundEngine) soundEngine.playTacticalChirp();
    btnExport.textContent = '✓ WAYPOINTS EXPORTED TO GPX';
    setTimeout(() => {
      btnExport.textContent = '🧭 EXPORT WAYPOINTS TO ECDIS';
    }, 2500);
  });
}
