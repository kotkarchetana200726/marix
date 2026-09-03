// ORCA Marine Bridge Console — Marine Business Persona (/#route)
// Marine Operations Intelligence, Pareto Route Planner & Operational Risk Decision Support

import { ROUTE_PRESETS } from '../data/mockData.js';

export function renderRouteView(container, { i18n, soundEngine }) {
  let activePreset = ROUTE_PRESETS[0];

  container.innerHTML = `
    <div class="route-view-container" style="display: flex; flex-direction: column; gap: 16px;">
      
      <!-- Stakeholder Header & Persona Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--chart-line); padding-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="#/" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; padding: 4px 12px; font-size: 0.78rem;">
            ← Change Role
          </a>
          <span class="panel-badge badge-amber" style="font-size: 0.70rem;">🚢 MARINE BUSINESS &amp; SHIPPING OPERATOR</span>
        </div>

        <div class="telemetry-status-pill">
          <span class="beacon-pulse"></span>
          PARETO ROUTE OPTIMIZER &amp; FUEL EFFICIENCY ACTIVE
        </div>
      </div>

      <!-- Business Hero Header -->
      <div class="bezel-panel" style="padding: 24px 20px; background: rgba(18,27,34,0.85); border-top: 3px solid var(--phosphor-amber);">
        <h1 class="font-display text-parchment-bright" style="font-size: 1.9rem; font-weight: 700; margin-bottom: 4px;">
          MARINE OPERATIONS INTELLIGENCE
        </h1>
        <div class="font-body text-parchment" style="font-size: 0.95rem; margin-bottom: 16px;">
          Make safer and smarter operational decisions.
        </div>

        <!-- Operational Decision Summary -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 16px;">
          <div style="padding: 12px 14px; background: rgba(10,16,20,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">OPERATIONAL RISK</span>
            <strong class="font-data text-amber" style="font-size: 1.05rem;">MODERATE (19 vs 84)</strong>
          </div>
          <div style="padding: 12px 14px; background: rgba(10,16,20,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">ROUTE CONDITIONS</span>
            <strong class="font-data text-parchment-bright" style="font-size: 0.88rem;">24kt Wind, 2.4m Swell, Good Vis</strong>
          </div>
          <div style="padding: 12px 14px; background: rgba(10,16,20,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">OPERATIONAL IMPACT</span>
            <strong class="font-data text-amber" style="font-size: 0.88rem;">Potential Delay / Caution Required</strong>
          </div>
          <div style="padding: 12px 14px; background: rgba(10,16,20,0.6); border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <span class="font-data text-muted" style="font-size: 0.68rem; display: block;">ORCA RECOMMENDATION</span>
            <strong class="font-data text-green" style="font-size: 0.85rem;">Monitor conditions before committing to route</strong>
          </div>
        </div>

        <!-- Business Quick Questions -->
        <div class="font-data text-brass" style="font-size: 0.70rem; letter-spacing: 0.10em; margin-bottom: 10px; font-weight: 700; text-transform: uppercase;">
          ▶ BUSINESS DECISION PROMPTS — CLICK TO TRANSMIT
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="#/chat?role=business&q=Is+this+route+safe+today%3F" class="btn-tactical btn-tactical-amber" style="text-decoration: none; font-size: 0.76rem;">
            🧭 Route Risk: "Is this route safe today?"
          </a>
          <a href="#/chat?role=business&q=Could+weather+affect+operations%3F" class="btn-tactical text-brass" style="text-decoration: none; font-size: 0.76rem; border-color: var(--brass);">
            🌦️ Weather Impact: "Could weather affect operations?"
          </a>
          <a href="#/chat?role=business&q=How+are+the+sea+conditions%3F" class="btn-tactical text-brass" style="text-decoration: none; font-size: 0.76rem; border-color: var(--brass);">
            🌊 Sea Conditions: "How are the sea conditions?"
          </a>
          <a href="#/chat?role=business&q=What+risks+should+we+prepare+for%3F" class="btn-tactical text-brass" style="text-decoration: none; font-size: 0.76rem; border-color: var(--brass);">
            ⚠️ Operational Risk: "What risks should we prepare for?"
          </a>
        </div>
      </div>

      <!-- Main Route Planner Grid -->
      <div style="display: grid; grid-template-columns: 340px 1fr; gap: 16px;">
        
        <!-- Left Sidebar -->
        <div class="route-sidebar bezel-panel" style="padding: 16px; display: flex; flex-direction: column; gap: 14px; background: rgba(18,27,34,0.85);">
          <div class="panel-header" style="background: transparent; padding: 0; border: none;">
            <span class="panel-title">
              <span class="icon">🚢</span> PARETO ROUTE COMPARISON
            </span>
            <span class="panel-badge badge-green">OPTIMIZER READY</span>
          </div>

          <!-- Route Preset Selector -->
          <div class="route-form-group">
            <label class="font-data text-muted" style="font-size: 0.68rem; text-transform: uppercase;">
              TACTICAL PASSAGE PRESET
            </label>
            <select class="route-select" id="route-preset-select" style="width: 100%; padding: 8px; background: var(--bg-void); color: var(--parchment-bright); border: 1px solid var(--brass); border-radius: var(--radius); font-family: var(--font-data); font-size: 0.80rem;">
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
          <div class="route-comparison-card" style="display: flex; flex-direction: column; gap: 12px; background: rgba(10,16,20,0.6); padding: 12px; border: 1px solid var(--chart-line); border-radius: var(--radius);">
            <!-- ORCA Safe Route Column -->
            <div class="comparison-column safe-col" style="border-left: 3px solid var(--phosphor-green); padding-left: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="font-data text-green" style="font-size: 0.75rem; font-weight: 700;">ORCA SAFE ROUTE</span>
                <span class="panel-badge badge-green">RECOMMENDED</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px; font-family: var(--font-data); font-size: 0.72rem;">
                <div>Distance: <strong class="text-parchment-bright" id="rt-safe-dist">${activePreset.safeRoute.distanceNm} nm</strong></div>
                <div>ETA: <strong class="text-parchment-bright" id="rt-safe-eta">${activePreset.safeRoute.etaHours}h</strong></div>
                <div>Fuel Est: <strong class="text-green" id="rt-safe-fuel">${activePreset.safeRoute.fuelLitre} L</strong></div>
                <div>Risk Score: <strong class="text-green" id="rt-safe-risk">${activePreset.safeRoute.riskScore}/100</strong></div>
              </div>
            </div>

            <!-- Shortest Hazardous Route Column -->
            <div class="comparison-column hazard-col" style="border-left: 3px solid var(--radar-red); padding-left: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="font-data text-red" style="font-size: 0.75rem; font-weight: 700;">SHORTEST ROUTE</span>
                <span class="panel-badge badge-red">HAZARDOUS</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px; font-family: var(--font-data); font-size: 0.72rem;">
                <div>Distance: <strong class="text-parchment-bright" id="rt-direct-dist">${activePreset.directRoute.distanceNm} nm</strong></div>
                <div>ETA: <strong class="text-parchment-bright" id="rt-direct-eta">${activePreset.directRoute.etaHours}h</strong></div>
                <div>Fuel Est: <strong class="text-red" id="rt-direct-fuel">${activePreset.directRoute.fuelLitre} L</strong></div>
                <div>Risk Score: <strong class="text-red" id="rt-direct-risk">${activePreset.directRoute.riskScore}/100</strong></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Map Display -->
        <div class="bezel-panel" style="padding: 16px; background: rgba(18,27,34,0.85); display: flex; flex-direction: column;">
          <div class="panel-header" style="background: transparent; padding: 0 0 8px 0; border-bottom: 1px solid var(--chart-line); margin-bottom: 10px;">
            <span class="panel-title">
              <span class="icon">🗺️</span> NAVIGATIONAL CORRIDOR &amp; DIVERSION CHART
            </span>
            <span class="panel-badge badge-amber">LIVE LEAFLET CHART</span>
          </div>

          <div id="route-map-canvas" style="width: 100%; height: 420px; border-radius: var(--radius); border: 1px solid var(--chart-line); background: var(--bg-void);"></div>
        </div>

      </div>
    </div>
  `;

  // Initialize Route Leaflet Map
  requestAnimationFrame(() => {
    if (typeof L === 'undefined') return;

    const mapEl = container.querySelector('#route-map-canvas');
    if (!mapEl) return;

    try {
      const map = L.map(mapEl, {
        center: activePreset.mapCenter || [18.5, 72.0],
        zoom: activePreset.mapZoom || 7,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18, subdomains: 'abcd'
      }).addTo(map);

      // Draw Routes
      if (activePreset.safeRoute.waypoints) {
        L.polyline(activePreset.safeRoute.waypoints, { color: '#6BCB77', weight: 4, opacity: 0.9 }).addTo(map);
      }

      if (activePreset.directRoute.waypoints) {
        L.polyline(activePreset.directRoute.waypoints, { color: '#FF5C5C', weight: 3, dashArray: '6,6', opacity: 0.8 }).addTo(map);
      }

      // Add Origin and Destination Markers
      if (activePreset.origin.latlng) {
        L.marker(activePreset.origin.latlng).bindPopup(`<b>${activePreset.origin.name}</b> (Origin)`).addTo(map);
      }
      if (activePreset.destination.latlng) {
        L.marker(activePreset.destination.latlng).bindPopup(`<b>${activePreset.destination.name}</b> (Destination)`).addTo(map);
      }

      setTimeout(() => map.invalidateSize(), 150);
    } catch (e) {
      console.warn('[Route Map] Init error:', e);
    }
  });
}
