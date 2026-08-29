// ORCA — Backend Contract Component Registry
//
// THIS FILE IS A STRICT CONTRACT WITH THE SPRING BOOT AI SERVICE.
// Do NOT add, remove, or rename types without coordinating with the backend team.
//
// Backend emits ui_json.components = [ { type: "<key>", data: {...} }, ... ]
// Each key below maps to exactly one render function that returns an HTMLElement.
//
// Supported types (frozen contract):
//   risk-card | weather-card | ocean-card | pfz-card
//   marine-map | alert-card | recommendation-card | evidence-panel

import { createRiskGaugeHTML } from './riskGauge.js';

// ─────────────────────────────────────────────────────────────
// HELPER UTILITIES
// ─────────────────────────────────────────────────────────────

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function dataCell(label, value, valueClass) {
  return `
    <div class="orca-data-cell">
      <span class="label">${label}</span>
      <span class="val ${valueClass || ''}">${value != null ? value : '—'}</span>
    </div>`;
}

function badge(text, colour) {
  return `<span class="panel-badge badge-${colour || 'amber'}">${text}</span>`;
}

function cardHeader(icon, title, badgeHtml) {
  return `
    <div class="orca-card-header">
      <span class="orca-card-title">${icon} ${title}</span>
      ${badgeHtml || ''}
    </div>`;
}

function riskColour(score) {
  if (score >= 70) return 'red';
  if (score >= 40) return 'amber';
  return 'green';
}

// ─────────────────────────────────────────────────────────────
// 1. risk-card
//    data: { score, status, zone, title, description, coordinates, swell, wind }
// ─────────────────────────────────────────────────────────────
function renderRiskCard(data) {
  data = data || {};
  const score  = Number(data.score != null ? data.score : (data.riskScore != null ? data.riskScore : 50));
  const colour = riskColour(score);
  const gaugeHtml = createRiskGaugeHTML({ score, title: data.zone || 'ZONE HAZARD', size: 150 });

  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('⚠️', 'HAZARD RISK ASSESSMENT', badge(data.status || 'ACTIVE', colour))}
    <div style="display:flex;gap:16px;align-items:center;padding:4px 0;">
      <div style="flex-shrink:0;">${gaugeHtml}</div>
      <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
        <div class="font-data" style="font-size:.78rem;font-weight:700;color:var(--parchment-bright);">
          ${data.title || data.name || 'Maritime Zone Assessment'}
        </div>
        <div style="font-size:.80rem;color:var(--parchment);line-height:1.4;">
          ${data.description || data.reasoning || 'Continuous oceanographic monitoring active.'}
        </div>
        <div class="font-data" style="font-size:.68rem;color:var(--muted);margin-top:4px;">
          COORDS: <span class="text-amber">${data.coordinates || 'N/A'}</span>
        </div>
      </div>
    </div>
    <div class="orca-card-grid-2">
      ${dataCell('Swell / Wave', data.swell || data.waveHeightMax || '—')}
      ${dataCell('Wind Speed',   data.wind  || data.windMax      || '—')}
    </div>`;
  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// 2. weather-card
//    data: { pressure, sst, wind, swell, visibility, current, humidity }
// ─────────────────────────────────────────────────────────────
function renderWeatherCard(data) {
  data = data || {};
  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('🌊', 'METEOROLOGICAL TELEMETRY', badge('IMD / INCOIS BUOY', 'amber'))}
    <div class="orca-card-grid-2">
      ${data.pressure  ? dataCell('Barometric Pressure',    data.pressure)            : ''}
      ${data.sst       ? dataCell('Sea Surface Temp',       data.sst)                 : ''}
      ${data.wind      ? dataCell('Wind Direction & Speed', data.wind)                : ''}
      ${data.swell     ? dataCell('Significant Wave Swell', data.swell, 'text-amber') : ''}
      ${data.humidity  ? dataCell('Relative Humidity',      data.humidity)            : ''}
    </div>
    <div style="font-size:.78rem;color:var(--muted);border-top:1px solid var(--chart-line);padding-top:6px;">
      ${data.visibility ? 'Visibility: <span class="font-data text-parchment">' + data.visibility + '</span>' : ''}
      ${data.current    ? ' &bull; Current: <span class="font-data text-parchment">' + data.current + '</span>' : ''}
    </div>`;
  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// 3. ocean-card
//    data: { sstAnomaly, chlorophyll, thermoclineDepth, salinity,
//            dissolvedOxygen, ph, currentSpeed, currentDirection, source, summary }
// ─────────────────────────────────────────────────────────────
function renderOceanCard(data) {
  data = data || {};
  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('🌡️', 'OCEANOGRAPHIC DATA PANEL', badge(data.source || 'INCOIS / NOAA', 'amber'))}
    <div class="orca-card-grid-2">
      ${data.sstAnomaly       ? dataCell('SST Anomaly',       data.sstAnomaly,       'text-green') : ''}
      ${data.chlorophyll      ? dataCell('Chlorophyll-a',     data.chlorophyll,      'text-amber') : ''}
      ${data.thermoclineDepth ? dataCell('Thermocline Depth', data.thermoclineDepth)               : ''}
      ${data.salinity         ? dataCell('Salinity',          data.salinity)                       : ''}
      ${data.dissolvedOxygen  ? dataCell('Dissolved O\u2082',   data.dissolvedOxygen)               : ''}
      ${data.ph               ? dataCell('pH Level',          data.ph)                             : ''}
      ${data.currentSpeed     ? dataCell('Current Speed',     data.currentSpeed)                   : ''}
      ${data.currentDirection ? dataCell('Current Direction', data.currentDirection)               : ''}
    </div>
    ${data.summary ? `<div style="font-size:.80rem;color:var(--parchment);border-top:1px solid var(--chart-line);padding-top:8px;line-height:1.5;">${data.summary}</div>` : ''}`;
  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// 4. pfz-card
//    data: { name, latLonStr, sstAnomaly, chlorophyll, confidence,
//            targetSpecies[], distanceNm, depthM, fuelSavingsEst, advisory }
// ─────────────────────────────────────────────────────────────
function renderPfzCard(data) {
  data = data || {};
  const speciesArr = data.targetSpecies || data.species || [];
  const species = speciesArr.map(function(s) {
    return '<span class="panel-badge badge-green" style="font-size:.65rem;margin:2px 3px 2px 0;display:inline-block;">' + s + '</span>';
  }).join('');

  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('🐟', 'POTENTIAL FISHING ZONE (PFZ)', badge((data.confidence || '—') + ' CONFIDENCE', 'green'))}
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <span class="font-display" style="font-size:1.05rem;font-weight:700;color:var(--parchment-bright);">
          ${data.name || 'Thermal Front Advisory'}
        </span>
        <span class="font-data text-amber" style="font-size:.78rem;">
          ${data.latLonStr || data.coordinates || '—'}
        </span>
      </div>
      <div style="font-size:.82rem;color:var(--parchment);line-height:1.4;">
        ${data.advisory || 'High plankton bloom detected. Thermal gradient favorable for aggregation.'}
      </div>
      ${species ? '<div><div class="font-data" style="font-size:.65rem;color:var(--muted);margin-bottom:4px;text-transform:uppercase;">Target Species:</div><div>' + species + '</div></div>' : ''}
      <div class="orca-card-grid-2" style="margin-top:4px;">
        ${data.sstAnomaly     ? dataCell('SST Anomaly',      data.sstAnomaly,     'text-green') : ''}
        ${data.chlorophyll    ? dataCell('Chlorophyll-a',    data.chlorophyll,    'text-amber') : ''}
        ${data.distanceNm != null || data.depthM != null ? dataCell('Distance / Depth', (data.distanceNm || '—') + ' nm / ' + (data.depthM || '—') + 'm') : ''}
        ${data.fuelSavingsEst ? dataCell('Fuel Savings Est.',data.fuelSavingsEst, 'text-green') : ''}
      </div>
    </div>`;
  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// 5. marine-map
//    data: { center:[lat,lng], zoom, markers:[], polygons:[], label }
//    Renders a compact inline Leaflet map inside the canvas.
// ─────────────────────────────────────────────────────────────
function renderMarineMap(data) {
  data = data || {};
  const mapId = 'inline-map-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('🗺️', data.label || 'MARINE CHART OVERLAY', badge('LIVE CHART', 'amber'))}
    <div id="${mapId}" style="
      width:100%;height:280px;border-radius:var(--radius);
      border:1px solid var(--chart-line);overflow:hidden;
      background:var(--bg-void);">
    </div>
    <div class="font-data text-muted" style="font-size:.65rem;margin-top:6px;text-align:right;">
      WGS-84 &bull; CartoDB Dark Matter
    </div>`;

  requestAnimationFrame(function() {
    if (typeof L === 'undefined') return;
    const mapEl = wrapper.querySelector('#' + mapId);
    if (!mapEl) return;

    const center = data.center || [18.5, 72.2];
    const zoom   = data.zoom   || 7;

    const map = L.map(mapEl, {
      center: center, zoom: zoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18, subdomains: 'abcd',
    }).addTo(map);

    (data.markers || []).forEach(function(m) {
      var icon = L.divIcon({
        className: '',
        html: '<div style="width:22px;height:22px;background:rgba(18,27,34,.9);border:2px solid var(--phosphor-amber);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--phosphor-amber);font-size:10px;box-shadow:0 0 8px rgba(255,180,84,.4);">' + (m.icon || '📍') + '</div>',
        iconSize: [22, 22], iconAnchor: [11, 11],
      });
      var mk = L.marker(m.latlng || m.coordinates || center, { icon: icon });
      if (m.popup) mk.bindPopup('<div class="map-instrument-popup">' + m.popup + '</div>');
      mk.addTo(map);
    });

    (data.polygons || []).forEach(function(p) {
      var colour = p.colour || '#FF5C5C';
      if (p.radius) {
        L.circle(p.center || center, { color: colour, fillColor: colour, fillOpacity: .18, radius: p.radius, weight: 2, dashArray: '4,6' }).addTo(map);
      } else if (p.latlngs) {
        L.polygon(p.latlngs, { color: colour, fillColor: colour, fillOpacity: .18, weight: 2, dashArray: '4,6' }).addTo(map);
      }
    });

    setTimeout(function() { map.invalidateSize(); }, 80);
  });

  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// 6. alert-card
//    data: { level, title, message, source, timestamp, areaAffected }
//    level: 'critical' | 'warning' | 'info'
// ─────────────────────────────────────────────────────────────
function renderAlertCard(data) {
  data = data || {};
  var level = (data.level || 'warning').toLowerCase();
  var palettes = {
    critical: { border: 'var(--radar-red)',      bg: 'rgba(255,92,92,.10)',    text: 'var(--radar-red)',      icon: '🚨', badgeCls: 'red'   },
    warning:  { border: 'var(--phosphor-amber)', bg: 'rgba(255,180,84,.08)',   text: 'var(--phosphor-amber)', icon: '⚠️', badgeCls: 'amber' },
    info:     { border: 'var(--brass)',           bg: 'rgba(201,166,107,.08)', text: 'var(--brass)',          icon: 'ℹ️', badgeCls: 'amber' },
  };
  var p = palettes[level] || palettes.warning;

  var wrapper = el('div', 'orca-card');
  wrapper.style.cssText = 'border:1px solid ' + p.border + ';border-top:3px solid ' + p.border + ';border-radius:var(--radius);background:' + p.bg + ';padding:12px 14px;display:flex;flex-direction:column;gap:8px;';
  wrapper.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span class="font-data" style="font-size:.72rem;font-weight:700;color:${p.text};letter-spacing:.06em;">
        ${p.icon} ${(data.title || 'ALERT').toUpperCase()}
      </span>
      ${badge(level.toUpperCase(), p.badgeCls)}
    </div>
    <div style="font-size:.83rem;color:var(--parchment);line-height:1.45;">
      ${data.message || ''}
    </div>
    <div class="font-data" style="font-size:.65rem;color:var(--muted);display:flex;gap:16px;flex-wrap:wrap;">
      ${data.source      ? '<span>SOURCE: <strong class="text-parchment">' + data.source    + '</strong></span>' : ''}
      ${data.timestamp   ? '<span>TIME: <strong class="text-parchment">'   + data.timestamp + '</strong></span>' : ''}
      ${data.areaAffected? '<span>AREA: <strong class="text-amber">'        + data.areaAffected + '</strong></span>' : ''}
    </div>`;
  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// 7. recommendation-card
//    data: { priority, heading, text, actions:[], safeHarbor, vhf }
//    priority: 'CRITICAL' | 'ADVISORY' | 'INFO'
// ─────────────────────────────────────────────────────────────
function renderRecommendationCard(data) {
  data = data || {};
  var isCritical = (data.priority || '').toUpperCase() === 'CRITICAL';
  var badgeCls   = isCritical ? 'red' : 'amber';

  var actionsHtml = (data.actions || []).map(function(a, i) {
    return '<div style="display:flex;gap:8px;font-family:var(--font-data);font-size:.72rem;line-height:1.4;"><span class="text-amber" style="font-weight:700;flex-shrink:0;">[' + String(i+1).padStart(2,'0') + ']</span><span style="color:var(--parchment);">' + a + '</span></div>';
  }).join('');

  var wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('🚢', 'TACTICAL RECOMMENDATION', badge(data.priority || 'ADVISORY', badgeCls))}
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div class="font-display" style="font-size:.95rem;font-weight:700;color:var(--brass);">
        ${data.heading || 'Bridge Navigation Directive'}
      </div>
      <div style="font-size:.82rem;color:var(--parchment);line-height:1.45;">
        ${data.text || ''}
      </div>
      ${actionsHtml ? '<div style="display:flex;flex-direction:column;gap:6px;background:rgba(10,16,20,.6);border:1px solid var(--chart-line);border-radius:var(--radius);padding:8px 10px;"><div class="font-data text-brass" style="font-size:.65rem;letter-spacing:.08em;margin-bottom:4px;">&#9658; ACTION SEQUENCE</div>' + actionsHtml + '</div>' : ''}
    </div>
    ${(data.safeHarbor || data.vhf) ? '<div class="orca-card-grid-2" style="margin-top:4px;">' + (data.safeHarbor ? dataCell('Safe Harbor', data.safeHarbor, 'text-green') : '') + (data.vhf ? dataCell('VHF Channel', data.vhf, 'text-amber') : '') + '</div>' : ''}`;
  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// 8. evidence-panel
//    data: { title, entries:[string | { label, value, confidence, source }],
//            summary, modelVersion }
// ─────────────────────────────────────────────────────────────
function renderEvidencePanel(data) {
  data = data || {};
  var entriesArr = data.entries || data.steps || [];
  var entries = entriesArr.map(function(entry, i) {
    if (typeof entry === 'string') {
      return '<div style="display:flex;gap:8px;font-family:var(--font-data);font-size:.72rem;line-height:1.4;padding:4px 0;border-bottom:1px solid rgba(36,51,59,.6);"><span class="text-brass" style="font-weight:700;flex-shrink:0;">[' + String(i+1).padStart(2,'0') + ']</span><span style="color:var(--parchment);">' + entry + '</span></div>';
    }
    var conf = entry.confidence ? '<span class="panel-badge badge-green" style="font-size:.58rem;">' + entry.confidence + '</span>' : '';
    var src  = entry.source     ? '<span class="text-muted" style="font-size:.65rem;"> — ' + entry.source + '</span>' : '';
    return '<div style="display:flex;flex-direction:column;gap:3px;padding:5px 0;border-bottom:1px solid rgba(36,51,59,.6);"><div style="display:flex;justify-content:space-between;align-items:center;"><span class="font-data text-brass" style="font-size:.68rem;font-weight:700;">[' + String(i+1).padStart(2,'0') + '] ' + (entry.label || 'Evidence') + '</span>' + conf + '</div><div style="font-family:var(--font-data);font-size:.72rem;color:var(--parchment);">' + (entry.value || '') + src + '</div></div>';
  }).join('');

  var wrapper = el('div', 'orca-card bezel-panel');
  wrapper.style.cssText = 'background:#080D11;border-color:var(--chart-line);';
  wrapper.innerHTML = `
    ${cardHeader('🧠', 'EVIDENCE PANEL — AGENT REASONING TRACE', badge(data.modelVersion || 'VALIDATED', 'amber'))}
    ${data.title ? '<div class="font-data text-amber" style="font-size:.72rem;margin-bottom:8px;">' + data.title + '</div>' : ''}
    <div style="display:flex;flex-direction:column;">
      ${entries || '<div class="text-muted font-data" style="font-size:.72rem;">No evidence entries.</div>'}
    </div>
    ${data.summary ? '<div style="margin-top:10px;padding:8px 10px;background:rgba(201,166,107,.07);border:1px solid var(--brass);border-radius:var(--radius);font-size:.80rem;color:var(--parchment);line-height:1.45;"><span class="font-data text-brass" style="font-size:.65rem;">&#9658; SYNTHESIS: </span>' + data.summary + '</div>' : ''}`;
  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// COMPONENT REGISTRY — THE STRICT BACKEND CONTRACT
// Keys MUST match exactly what the Spring Boot AI service emits.
// ─────────────────────────────────────────────────────────────
export const COMPONENT_REGISTRY = Object.freeze({
  'risk-card':           renderRiskCard,
  'weather-card':        renderWeatherCard,
  'ocean-card':          renderOceanCard,
  'pfz-card':            renderPfzCard,
  'marine-map':          renderMarineMap,
  'alert-card':          renderAlertCard,
  'recommendation-card': renderRecommendationCard,
  'evidence-panel':      renderEvidencePanel,
});

/**
 * Render a single backend component spec into an HTMLElement.
 * Returns null (and logs a warning) if the type is unknown — does NOT throw.
 *
 * @param {{ type: string, data: object }} spec
 * @returns {HTMLElement|null}
 */
export function renderComponent(spec) {
  var factory = COMPONENT_REGISTRY[spec.type];
  if (!factory) {
    console.warn('[ORCA Components] Unknown type "' + spec.type + '" — skipping. Registered: ' + Object.keys(COMPONENT_REGISTRY).join(', '));
    return null;
  }
  try {
    return factory(spec.data || {});
  } catch (err) {
    console.error('[ORCA Components] Render error for type "' + spec.type + '":', err);
    return null;
  }
}
