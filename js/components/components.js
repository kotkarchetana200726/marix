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
// UNIFIED INLINE SVG ICON LIBRARY (Pure SVG - No External Dependencies)
// ─────────────────────────────────────────────────────────────

export function getMarineIcon(name, size = 16, strokeColor = 'currentColor') {
  const s = size;
  const c = strokeColor;
  
  const icons = {
    thermometer: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
    wind: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`,
    compass: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    wave: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
    waveform: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h3l3-9 4 18 3-12 2 4h3"/></svg>`,
    eye: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    water: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    warning: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    barometer: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12l3-5"/><path d="M12 7v1"/></svg>`,
    fish: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c.94-2.07 3.08-3.5 5.5-3.5 3.5 0 6.5 3 8 5-1.5 2-4.5 5-8 5-2.42 0-4.56-1.43-5.5-3.5"/><path d="M2 12l4.5-3.5L4 12l2.5 3.5L2 12z"/><circle cx="15.5" cy="11.5" r="1.5"/></svg>`,
    shield: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    map: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 15 22 22 18 22 2 15 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="15" y1="6" x2="15" y2="22"/></svg>`,
    brain: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04"/></svg>`,
    ship: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.14"/><path d="M12 10V4.5"/><path d="M12 4.5L16 2v4.5H12z"/></svg>`
  };

  return icons[name] || icons.warning;
}

// ─────────────────────────────────────────────────────────────
// HELPER UTILITIES
// ─────────────────────────────────────────────────────────────

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function dataCell(label, value, valueClass, iconName) {
  const iconHtml = iconName ? `<span class="data-cell-icon">${getMarineIcon(iconName, 14, 'var(--muted)')}</span>` : '';
  return `
    <div class="orca-data-cell">
      <div style="display:flex; align-items:center; gap:5px;">
        ${iconHtml}
        <span class="label">${label}</span>
      </div>
      <span class="val ${valueClass || ''}">${value != null ? value : '—'}</span>
    </div>`;
}

function badge(text, colour) {
  return `<span class="panel-badge badge-${colour || 'amber'}">${text}</span>`;
}

function cardHeader(iconName, title, badgeHtml) {
  const iconSvg = getMarineIcon(iconName, 18, 'var(--brass)');
  return `
    <div class="orca-card-header">
      <span class="orca-card-title" style="display:flex; align-items:center; gap:8px;">
        ${iconSvg} <span>${title}</span>
      </span>
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
    ${cardHeader('warning', 'HAZARD RISK ASSESSMENT', badge(data.status || 'ACTIVE', colour))}
    <div style="display:flex;gap:16px;align-items:center;padding:8px 0;">
      <div style="flex-shrink:0;">${gaugeHtml}</div>
      <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
        <div class="font-data" style="font-size:.82rem;font-weight:700;color:var(--parchment-bright);">
          ${data.title || data.name || 'Maritime Zone Assessment'}
        </div>
        <div style="font-size:.82rem;color:var(--parchment);line-height:1.45;">
          ${data.description || data.reasoning || 'Continuous oceanographic monitoring active.'}
        </div>
        <div class="font-data" style="font-size:.70rem;color:var(--muted);margin-top:4px;">
          COORDS: <span class="text-amber">${data.coordinates || 'N/A'}</span>
        </div>
      </div>
    </div>
    <div class="orca-card-grid-2">
      ${dataCell('Swell / Wave', data.swell || data.waveHeightMax || '—', '', 'wave')}
      ${dataCell('Wind Speed',   data.wind  || data.windMax      || '—', '', 'wind')}
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
    ${cardHeader('wind', 'METEOROLOGICAL TELEMETRY', badge('IMD / INCOIS BUOY', 'amber'))}
    <div class="orca-card-grid-2">
      ${data.pressure  ? dataCell('Barometric Pressure',    data.pressure, '', 'barometer')            : ''}
      ${data.sst       ? dataCell('Sea Surface Temp',       data.sst, '', 'thermometer')                 : ''}
      ${data.wind      ? dataCell('Wind Direction & Speed', data.wind, '', 'compass')                : ''}
      ${data.swell     ? dataCell('Significant Wave Swell', data.swell, 'text-amber', 'wave') : ''}
      ${data.humidity  ? dataCell('Relative Humidity',      data.humidity, '', 'water')            : ''}
    </div>
    <div style="font-size:.78rem;color:var(--muted);border-top:1px solid var(--chart-line);padding-top:8px;margin-top:6px;display:flex;gap:14px;flex-wrap:wrap;align-items:center;">
      ${data.visibility ? '<span style="display:inline-flex;align-items:center;gap:4px;">' + getMarineIcon('eye', 14, 'var(--muted)') + ' Visibility: <strong class="font-data text-parchment">' + data.visibility + '</strong></span>' : ''}
      ${data.current    ? '<span style="display:inline-flex;align-items:center;gap:4px;">' + getMarineIcon('water', 14, 'var(--muted)') + ' Current: <strong class="font-data text-parchment">' + data.current + '</strong></span>' : ''}
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
    ${cardHeader('water', 'OCEANOGRAPHIC DATA PANEL', badge(data.source || 'INCOIS / NOAA', 'amber'))}
    <div class="orca-card-grid-2">
      ${data.sstAnomaly       ? dataCell('SST Anomaly',       data.sstAnomaly,       'text-green', 'thermometer') : ''}
      ${data.chlorophyll      ? dataCell('Chlorophyll-a',     data.chlorophyll,      'text-amber', 'water') : ''}
      ${data.thermoclineDepth ? dataCell('Thermocline Depth', data.thermoclineDepth, '', 'waveform')               : ''}
      ${data.salinity         ? dataCell('Salinity',          data.salinity, '', 'water')                       : ''}
      ${data.dissolvedOxygen  ? dataCell('Dissolved O₂',   data.dissolvedOxygen, '', 'water')               : ''}
      ${data.ph               ? dataCell('pH Level',          data.ph, '', 'barometer')                             : ''}
      ${data.currentSpeed     ? dataCell('Current Speed',     data.currentSpeed, '', 'wave')                   : ''}
      ${data.currentDirection ? dataCell('Current Direction', data.currentDirection, '', 'compass')               : ''}
    </div>
    ${data.summary ? `<div style="font-size:.82rem;color:var(--parchment);border-top:1px solid var(--chart-line);padding-top:8px;margin-top:8px;line-height:1.5;">${data.summary}</div>` : ''}`;
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
    return '<span class="panel-badge badge-green" style="font-size:.68rem;margin:2px 4px 2px 0;display:inline-block;">' + s + '</span>';
  }).join('');

  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('fish', 'POTENTIAL FISHING ZONE (PFZ)', badge((data.confidence || '—') + ' CONFIDENCE', 'green'))}
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px;">
        <span class="font-display" style="font-size:1.08rem;font-weight:700;color:var(--parchment-bright);">
          ${data.name || 'Thermal Front Advisory'}
        </span>
        <span class="font-data text-amber" style="font-size:.80rem;display:inline-flex;align-items:center;gap:4px;">
          ${getMarineIcon('compass', 13, 'var(--phosphor-amber)')} ${data.latLonStr || data.coordinates || '—'}
        </span>
      </div>
      <div style="font-size:.84rem;color:var(--parchment);line-height:1.45;">
        ${data.advisory || 'High plankton bloom detected. Thermal gradient favorable for aggregation.'}
      </div>
      ${species ? '<div style="margin-top:2px;"><div class="font-data" style="font-size:.65rem;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;">Target Species:</div><div>' + species + '</div></div>' : ''}
      <div class="orca-card-grid-2" style="margin-top:4px;">
        ${data.sstAnomaly     ? dataCell('SST Anomaly',      data.sstAnomaly,     'text-green', 'thermometer') : ''}
        ${data.chlorophyll    ? dataCell('Chlorophyll-a',    data.chlorophyll,    'text-amber', 'water') : ''}
        ${data.distanceNm != null || data.depthM != null ? dataCell('Distance / Depth', (data.distanceNm || '—') + ' nm / ' + (data.depthM || '—') + 'm', '', 'compass') : ''}
        ${data.fuelSavingsEst ? dataCell('Fuel Savings Est.',data.fuelSavingsEst, 'text-green', 'ship') : ''}
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
    ${cardHeader('map', data.label || 'MARINE CHART OVERLAY', badge('LIVE CHART', 'amber'))}
    <div id="${mapId}" style="
      width:100%;height:280px;border-radius:var(--radius);
      border:1px solid var(--chart-line);overflow:hidden;
      background:var(--bg-void);">
    </div>
    <div class="font-data text-muted" style="font-size:.68rem;margin-top:6px;display:flex;justify-content:space-between;align-items:center;">
      <span>OPERATING AREA CHART</span>
      <span>WGS-84 • CartoDB Dark Matter</span>
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
        html: '<div style="width:24px;height:24px;background:rgba(18,27,34,.95);border:2px solid var(--phosphor-amber);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--phosphor-amber);font-size:12px;box-shadow:0 0 10px rgba(255,180,84,.5);">' + (m.icon || '📍') + '</div>',
        iconSize: [24, 24], iconAnchor: [12, 12],
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
    critical: { border: 'var(--radar-red)',      bg: 'rgba(255,92,92,.10)',    text: 'var(--radar-red)',      iconName: 'warning', badgeCls: 'red'   },
    warning:  { border: 'var(--phosphor-amber)', bg: 'rgba(255,180,84,.08)',   text: 'var(--phosphor-amber)', iconName: 'warning', badgeCls: 'amber' },
    info:     { border: 'var(--brass)',           bg: 'rgba(201,166,107,.08)', text: 'var(--brass)',          iconName: 'shield',  badgeCls: 'amber' },
  };
  var p = palettes[level] || palettes.warning;

  var wrapper = el('div', 'orca-card');
  wrapper.style.cssText = 'border:1px solid ' + p.border + ';border-top:3px solid ' + p.border + ';border-radius:var(--radius);background:' + p.bg + ';padding:14px 16px;display:flex;flex-direction:column;gap:8px;';
  wrapper.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span class="font-data" style="font-size:.78rem;font-weight:700;color:${p.text};letter-spacing:.06em;display:flex;align-items:center;gap:6px;">
        ${getMarineIcon(p.iconName, 16, p.text)} ${(data.title || 'ALERT').toUpperCase()}
      </span>
      ${badge(level.toUpperCase(), p.badgeCls)}
    </div>
    <div style="font-size:.85rem;color:var(--parchment);line-height:1.48;">
      ${data.message || ''}
    </div>
    <div class="font-data" style="font-size:.68rem;color:var(--muted);display:flex;gap:16px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,0.06);padding-top:6px;">
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
    return '<div style="display:flex;gap:8px;font-family:var(--font-data);font-size:.74rem;line-height:1.45;"><span class="text-amber" style="font-weight:700;flex-shrink:0;">[' + String(i+1).padStart(2,'0') + ']</span><span style="color:var(--parchment);">' + a + '</span></div>';
  }).join('');

  var wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('ship', 'TACTICAL RECOMMENDATION', badge(data.priority || 'ADVISORY', badgeCls))}
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div class="font-display" style="font-size:.98rem;font-weight:700;color:var(--brass);">
        ${data.heading || 'Bridge Navigation Directive'}
      </div>
      <div style="font-size:.84rem;color:var(--parchment);line-height:1.48;">
        ${data.text || ''}
      </div>
      ${actionsHtml ? '<div style="display:flex;flex-direction:column;gap:6px;background:rgba(10,16,20,.6);border:1px solid var(--chart-line);border-radius:var(--radius);padding:10px 12px;"><div class="font-data text-brass" style="font-size:.68rem;letter-spacing:.08em;margin-bottom:4px;">► ACTION SEQUENCE</div>' + actionsHtml + '</div>' : ''}
    </div>
    ${(data.safeHarbor || data.vhf) ? '<div class="orca-card-grid-2" style="margin-top:6px;">' + (data.safeHarbor ? dataCell('Safe Harbor', data.safeHarbor, 'text-green', 'shield') : '') + (data.vhf ? dataCell('VHF Channel', data.vhf, 'text-amber', 'ship') : '') + '</div>' : ''}`;
  return wrapper;
}

// ─────────────────────────────────────────────────────────────
// 8. evidence-panel
//    STRICT REQUIREMENT: NO RAW JSON STRINGS EXPOSED TO USER.
//    data: { title, entries:[string | { label, value, confidence, source }],
//            summary, modelVersion }
// ─────────────────────────────────────────────────────────────
function renderEvidencePanel(data) {
  data = data || {};
  var entriesArr = data.entries || data.steps || [];
  
  // Format each evidence item cleanly without JSON stringifying
  var entries = entriesArr.map(function(entry, i) {
    if (typeof entry === 'string') {
      // Clean string entry
      return `
        <div class="evidence-item-row" style="display:flex;gap:10px;font-family:var(--font-data);font-size:.75rem;line-height:1.45;padding:8px 10px;border-bottom:1px solid rgba(36,51,59,.5);background:rgba(14,23,29,0.3);border-radius:3px;margin-bottom:4px;">
          <span class="text-amber" style="font-weight:700;flex-shrink:0;">[${String(i+1).padStart(2,'0')}]</span>
          <span style="color:var(--parchment);">${entry}</span>
        </div>`;
    }
    
    // Object entry with key/value pairs
    var labelStr = entry.label || entry.key || entry.title || `Evidence Item #${i+1}`;
    var valStr = entry.value || entry.description || entry.detail || '';
    if (typeof valStr === 'object') {
      // Formatted key-value list instead of JSON string!
      valStr = Object.entries(valStr).map(([k, v]) => `<span class="text-muted">${k}:</span> <strong class="text-parchment">${v}</strong>`).join(' • ');
    }

    var confTag = entry.confidence ? `<span class="panel-badge badge-green" style="font-size:.60rem;padding:2px 6px;">${entry.confidence}</span>` : '';
    var srcTag  = entry.source ? `<span class="text-muted font-data" style="font-size:.68rem;">SOURCE: ${entry.source}</span>` : '';

    return `
      <div class="evidence-item-card" style="display:flex;flex-direction:column;gap:4px;padding:8px 12px;border:1px solid var(--chart-line);border-radius:var(--radius);background:rgba(18,27,34,0.6);margin-bottom:6px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="font-data text-brass" style="font-size:.72rem;font-weight:700;">[${String(i+1).padStart(2,'0')}] ${labelStr}</span>
          ${confTag}
        </div>
        <div style="font-family:var(--font-data);font-size:.75rem;color:var(--parchment);line-height:1.45;">${valStr}</div>
        ${srcTag ? `<div style="text-align:right;margin-top:2px;">${srcTag}</div>` : ''}
      </div>`;
  }).join('');

  var wrapper = el('div', 'orca-card bezel-panel');
  wrapper.style.cssText = 'background:#080D11;border-color:var(--chart-line);';
  wrapper.innerHTML = `
    ${cardHeader('brain', 'EVIDENCE PANEL — AGENT REASONING TRACE', badge(data.modelVersion || 'VALIDATED', 'amber'))}
    ${data.title ? `<div class="font-data text-amber" style="font-size:.75rem;margin-bottom:10px;font-weight:600;">${data.title}</div>` : ''}
    <div style="display:flex;flex-direction:column;">
      ${entries || '<div class="text-muted font-data" style="font-size:.75rem;padding:8px 0;">No raw evidence entries logged.</div>'}
    </div>
    ${data.summary ? `
      <div style="margin-top:12px;padding:10px 12px;background:rgba(201,166,107,.08);border:1px solid var(--brass);border-radius:var(--radius);font-size:.82rem;color:var(--parchment);line-height:1.5;">
        <span class="font-data text-brass" style="font-size:.70rem;font-weight:700;letter-spacing:.06em;display:block;margin-bottom:2px;">► SYNTHESIS SUMMARY</span>
        ${data.summary}
      </div>` : ''}`;
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
