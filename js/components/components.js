// ORCA — Backend Contract Component Registry
//
// THIS FILE IS A STRICT CONTRACT WITH THE SPRING BOOT AI SERVICE.
// Do NOT add, remove, or rename types without coordinating with the backend team.
//
// Supported types (frozen contract):
//   risk-card | weather-card | ocean-card | pfz-card
//   marine-map | alert-card | recommendation-card | evidence-panel

import { createRiskGaugeHTML } from './riskGauge.js';
import { t, getGlobalLanguage } from '../data/translations.js';

// ─────────────────────────────────────────────────────────────
// UNIFIED INLINE SVG ICON LIBRARY
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

// ─── 1. risk-card ─────────────────────────────────────────────
function renderRiskCard(data) {
  data = data || {};
  const lang = getGlobalLanguage();
  const score  = Number(data.score != null ? data.score : (data.riskScore != null ? data.riskScore : 50));
  const colour = riskColour(score);
  const gaugeHtml = createRiskGaugeHTML({ score, title: data.zone || 'ZONE HAZARD', size: 150 });

  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('warning', t('safetyLevel', lang), badge(data.status || t('status', lang), colour))}
    <div style="display:flex;gap:16px;align-items:center;padding:8px 0;">
      <div style="flex-shrink:0;">${gaugeHtml}</div>
      <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
        <div class="font-data" style="font-size:.82rem;font-weight:700;color:var(--parchment-bright);">
          ${data.title || data.name || t('safetyLevel', lang)}
        </div>
        <div style="font-size:.82rem;color:var(--parchment);line-height:1.45;">
          ${data.description || data.reasoning || ''}
        </div>
        <div class="font-data" style="font-size:.70rem;color:var(--muted);margin-top:4px;">
          GPS: <span class="text-amber">${data.coordinates || '16.99° N 73.31° E'}</span>
        </div>
      </div>
    </div>
    <div class="orca-card-grid-2">
      ${dataCell(t('waveHeight', lang), data.swell || data.waveHeightMax || '1.4 m', '', 'wave')}
      ${dataCell(t('windSpeed', lang),   data.wind  || data.windMax      || '18 km/h', '', 'wind')}
    </div>`;
  return wrapper;
}

// ─── 2. weather-card ──────────────────────────────────────────
function renderWeatherCard(data) {
  data = data || {};
  const lang = getGlobalLanguage();
  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('wind', t('weather', lang), badge(t('currentConditions', lang), 'amber'))}
    <div class="orca-card-grid-2">
      ${data.sst       ? dataCell(t('seaSurfaceTemp', lang), data.sst, '', 'thermometer') : ''}
      ${data.wind      ? dataCell(t('windSpeed', lang), data.wind, '', 'compass') : ''}
      ${data.swell     ? dataCell(t('waveHeight', lang), data.swell, 'text-amber', 'wave') : ''}
      ${data.pressure  ? dataCell('Barometric Pressure', data.pressure, '', 'barometer') : ''}
    </div>`;
  return wrapper;
}

// ─── 3. pfz-card ──────────────────────────────────────────────
function renderPfzCard(data) {
  data = data || {};
  const lang = getGlobalLanguage();
  const speciesArr = data.targetSpecies || data.species || [];
  const species = speciesArr.map(function(s) {
    return '<span class="panel-badge badge-green" style="font-size:.68rem;margin:2px 4px 2px 0;display:inline-block;">' + s + '</span>';
  }).join('');

  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('fish', t('fishingPotential', lang), badge((data.confidence || '87%') + ' ' + t('confidence', lang), 'green'))}
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px;">
        <span class="font-display" style="font-size:1.08rem;font-weight:700;color:var(--parchment-bright);">
          ${data.name || 'PFZ-01'}
        </span>
        <span class="font-data text-amber" style="font-size:.80rem;display:inline-flex;align-items:center;gap:4px;">
          ${getMarineIcon('compass', 13, 'var(--phosphor-amber)')} ${data.latLonStr || data.coordinates || '16°51\'N, 73°10\'E'}
        </span>
      </div>
      <div style="font-size:.84rem;color:var(--parchment);line-height:1.45;">
        ${data.advisory || ''}
      </div>
      ${species ? '<div style="margin-top:2px;"><div class="font-data" style="font-size:.65rem;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;">' + t('targetSpecies', lang) + ':</div><div>' + species + '</div></div>' : ''}
      <div class="orca-card-grid-2" style="margin-top:4px;">
        ${data.sstAnomaly  ? dataCell(t('seaSurfaceTemp', lang), data.sstAnomaly, 'text-green', 'thermometer') : ''}
        ${data.chlorophyll ? dataCell(t('chlorophyll', lang),    data.chlorophyll, 'text-amber', 'water') : ''}
        ${data.distanceNm  ? dataCell(t('distance', lang),       data.distanceNm, '', 'compass') : ''}
      </div>
    </div>`;
  return wrapper;
}

// ─── 4. marine-map ────────────────────────────────────────────
function renderMarineMap(data) {
  data = data || {};
  const mapId = 'inline-map-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('map', data.label || 'LIVE MAP CHART', badge('LEAFLET MAP', 'amber'))}
    <div id="${mapId}" style="width:100%;height:280px;border-radius:var(--radius);border:1px solid var(--chart-line);overflow:hidden;background:var(--bg-void);"></div>`;

  requestAnimationFrame(function() {
    if (typeof L === 'undefined') return;
    const mapEl = wrapper.querySelector('#' + mapId);
    if (!mapEl) return;

    const center = data.center || [16.99, 73.31];
    const zoom   = data.zoom   || 8;

    const map = L.map(mapEl, { center: center, zoom: zoom, zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18, subdomains: 'abcd' }).addTo(map);

    (data.markers || []).forEach(function(m) {
      var icon = L.divIcon({
        className: '',
        html: '<div style="width:24px;height:24px;background:rgba(18,27,34,.95);border:2px solid var(--phosphor-amber);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--phosphor-amber);font-size:12px;box-shadow:0 0 10px rgba(255,180,84,.5);">' + (m.icon || '📍') + '</div>',
        iconSize: [24, 24], iconAnchor: [12, 12]
      });
      L.marker(m.latlng, { icon: icon }).bindPopup(m.popup || '').addTo(map);
    });

    setTimeout(() => map.invalidateSize(), 150);
  });

  return wrapper;
}

// ─── 5. alert-card ────────────────────────────────────────────
function renderAlertCard(data) {
  data = data || {};
  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('warning', data.title || 'MARINE ALERT', badge(data.level || 'INFO', 'amber'))}
    <div style="font-size:.88rem;color:var(--parchment-bright);line-height:1.5;">${data.message || ''}</div>`;
  return wrapper;
}

// ─── 6. recommendation-card ──────────────────────────────────
function renderRecommendationCard(data) {
  data = data || {};
  const lang = getGlobalLanguage();
  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('shield', t('recommendation', lang), badge(data.priority || t('recommended', lang), 'green'))}
    <div style="font-size:.88rem;color:var(--parchment);line-height:1.5;">${data.text || ''}</div>`;
  return wrapper;
}

// ─── 7. evidence-panel ────────────────────────────────────────
function renderEvidencePanel(data) {
  data = data || {};
  const lang = getGlobalLanguage();
  const wrapper = el('div', 'orca-card bezel-panel');
  wrapper.innerHTML = `
    ${cardHeader('brain', data.title || t('keyBulletins', lang), badge('TELEMETRY EVIDENCE', 'amber'))}
    <div style="font-size:.82rem;color:var(--parchment);line-height:1.5;">${data.summary || ''}</div>`;
  return wrapper;
}

export const COMPONENT_REGISTRY = {
  'risk-card': renderRiskCard,
  'weather-card': renderWeatherCard,
  'ocean-card': renderWeatherCard,
  'pfz-card': renderPfzCard,
  'marine-map': renderMarineMap,
  'alert-card': renderAlertCard,
  'recommendation-card': renderRecommendationCard,
  'evidence-panel': renderEvidencePanel,
  'route-preview-card': renderRecommendationCard
};
