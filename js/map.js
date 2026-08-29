// ORCA — Marine Intelligence Map Module  (js/map.js)
//
// Standalone Leaflet map with two live backend-fetched layer groups:
//   PFZ layer   ← GET /api/pfz      (points array)
//   Geofence layer ← GET /api/geofences  (polygons / MPA areas)
//
// Expected response shapes:
//
//   GET /api/pfz
//   [
//     {
//       "id": "pfz-01",
//       "name": "Konkan Thermal Front Alpha",
//       "lat": 17.42, "lng": 72.35,
//       "confidence": "96%",
//       "sstAnomaly": "-1.4°C",
//       "chlorophyll": "3.4 mg/m³",
//       "species": ["Indian Mackerel", "Sardinella"],
//       "advisory": "Deploy purse seine along 65m isobath."
//     }, ...
//   ]
//
//   GET /api/geofences
//   [
//     {
//       "id": "mpa-01",
//       "name": "Gulf of Khambhat MPA",
//       "type": "MPA",            // "MPA" | "restricted" | "hazard" | "anchor"
//       "latlngs": [[lat,lng], ...],   // polygon ring (use this OR center+radius)
//       "center": [lat, lng],          // circle alternative
//       "radius": 15000,               // metres (only when using center)
//       "colour": "#FF5C5C",           // optional override
//       "description": "Marine Protected Area. Trawling prohibited."
//     }, ...
//   ]
//
// Usage:
//   import { OrcaMap } from './map.js';
//   const orcaMap = new OrcaMap('leaflet-map');
//   await orcaMap.init();          // fetches layers and renders
//
// Or supply mock data offline:
//   await orcaMap.init({ pfzData: [...], geofenceData: [...] });

const PFZ_ENDPOINT      = '/api/pfz';
const GEOFENCE_ENDPOINT = '/api/geofences';

// Colour palette for geofence types
var GEOFENCE_COLOURS = {
  MPA:        '#6BCB77',   // phosphor-green
  restricted: '#FF5C5C',   // radar-red
  hazard:     '#FF5C5C',
  anchor:     '#C9A66B',   // brass
  default:    '#FFB454',   // phosphor-amber
};

// ─────────────────────────────────────────────────────────────
// MOCK DATA (used when backend is unreachable)
// ─────────────────────────────────────────────────────────────
var MOCK_PFZ = [
  { id: 'pfz-01', name: "Konkan Thermal Front Alpha", lat: 17.42, lng: 72.35, confidence: '96%', sstAnomaly: '-1.4°C', chlorophyll: '3.4 mg/m³', species: ['Indian Mackerel', 'Sardinella longiceps', 'Yellowfin Tuna'], advisory: 'Deploy purse seine along 65m isobath heading SW at 4 knots. Window 0300–1100Z.' },
  { id: 'pfz-02', name: "Ratnagiri-Devgad Pelagic Edge", lat: 16.55, lng: 72.85, confidence: '91%', sstAnomaly: '-0.9°C', chlorophyll: '2.8 mg/m³', species: ['Seer Fish (Surmai)', 'Squid', 'Horse Mackerel'], advisory: 'Favorable 0.6 kt SE current. Strong thermal gradient at 50m isobath.' },
  { id: 'pfz-03', name: "Kochi-Alleppey Chakara Zone", lat: 9.77, lng: 75.82, confidence: '98%', sstAnomaly: '-1.6°C', chlorophyll: '4.2 mg/m³', species: ['Penaeid Prawns', 'Oil Sardine', 'Anchovy'], advisory: 'Exceptional artisanal fishing. Calm waters inside 15m contour.' },
];

var MOCK_GEOFENCES = [
  { id: 'hz-01', name: 'Tropical Depression Varuna — Gale Core', type: 'hazard', center: [20.80, 68.50], radius: 185000, description: 'Sustained 52-kt winds. All vessels evacuate. Port Warning Signal No. 8 hoisted.' },
  { id: 'hz-02', name: 'Tropical Depression Varuna — Warning Zone', type: 'hazard', center: [20.50, 68.80], radius: 350000, colour: 'rgba(255,92,92,.4)', description: 'Extended gale-force wind radius. Small craft must seek immediate shelter.' },
  { id: 'mpa-01', name: 'Gulf of Khambhat Marine Protected Area', type: 'MPA', latlngs: [[22.2,72.2],[22.8,72.9],[22.5,73.4],[21.9,73.1],[21.6,72.5]], description: 'Marine Protected Area. Commercial trawling strictly prohibited.' },
  { id: 'mpa-02', name: 'Malvan Marine Sanctuary', type: 'MPA', latlngs: [[16.05,73.45],[16.12,73.55],[16.08,73.62],[15.98,73.56],[15.95,73.48]], description: 'Protected coral reef zone. No anchoring, fishing, or diving without permit.' },
  { id: 'rz-01', name: 'Mumbai Naval Exercise Zone', type: 'restricted', latlngs: [[19.2,72.6],[19.5,73.0],[19.0,73.2],[18.8,72.8]], description: 'Naval exercise area. Entry prohibited 0600–1800Z. Monitor VHF CH 16.' },
];

// ─────────────────────────────────────────────────────────────
// POPUP BUILDERS
// ─────────────────────────────────────────────────────────────
function pfzPopupHtml(pfz) {
  var speciesHtml = (pfz.species || []).map(function(s) {
    return '<span class="panel-badge badge-green" style="font-size:.62rem;margin:2px 3px 2px 0;display:inline-block;">' + s + '</span>';
  }).join('');

  return [
    '<div class="map-instrument-popup">',
    '  <div class="map-popup-header">🐟 ' + pfz.name + '</div>',
    '  <div class="map-popup-row">',
    '    <span class="text-muted">BIOMASS CONFIDENCE:</span>',
    '    <span class="text-green">' + (pfz.confidence || '—') + '</span>',
    '  </div>',
    '  <div class="map-popup-row">',
    '    <span class="text-muted">SST ANOMALY:</span>',
    '    <span class="text-green">' + (pfz.sstAnomaly || '—') + '</span>',
    '  </div>',
    '  <div class="map-popup-row">',
    '    <span class="text-muted">CHLOROPHYLL-A:</span>',
    '    <span class="text-amber">' + (pfz.chlorophyll || '—') + '</span>',
    '  </div>',
    speciesHtml ? '  <div style="margin-top:6px;">' + speciesHtml + '</div>' : '',
    '  <div style="margin-top:6px;padding-top:4px;border-top:1px solid var(--chart-line);font-size:.68rem;color:var(--parchment);">',
    '    ' + (pfz.advisory || ''),
    '  </div>',
    '</div>',
  ].join('');
}

function geofencePopupHtml(gf) {
  var typeColor = GEOFENCE_COLOURS[gf.type] || GEOFENCE_COLOURS.default;
  var icon = gf.type === 'MPA' ? '🛡️' : (gf.type === 'restricted' ? '⛔' : '⚠️');
  return [
    '<div class="map-instrument-popup" style="border-top:3px solid ' + typeColor + ';">',
    '  <div class="map-popup-header" style="color:' + typeColor + ';">' + icon + ' ' + gf.name + '</div>',
    '  <div class="map-popup-row">',
    '    <span class="text-muted">TYPE:</span>',
    '    <span style="color:' + typeColor + ';">' + (gf.type || 'restricted').toUpperCase() + '</span>',
    '  </div>',
    '  <div style="margin-top:6px;padding-top:4px;border-top:1px solid var(--chart-line);font-size:.68rem;color:var(--parchment);">',
    '    ' + (gf.description || ''),
    '  </div>',
    '</div>',
  ].join('');
}

// ─────────────────────────────────────────────────────────────
// ORCA MAP CLASS
// ─────────────────────────────────────────────────────────────
export class OrcaMap {
  /**
   * @param {string|HTMLElement} containerIdOrEl  ID string or DOM element for the map div.
   * @param {object} [opts]
   * @param {[number,number]} [opts.center]   Default [18.5, 72.2]
   * @param {number}          [opts.zoom]     Default 7
   * @param {string}          [opts.pfzEndpoint]       Override API endpoint
   * @param {string}          [opts.geofenceEndpoint]  Override API endpoint
   * @param {Function}        [opts.onInspect]   Called with (title, text) on marker/polygon click
   */
  constructor(containerIdOrEl, opts) {
    this._containerIdOrEl = containerIdOrEl;
    opts = opts || {};
    this._center           = opts.center          || [18.5, 72.2];
    this._zoom             = opts.zoom            || 7;
    this._pfzEndpoint      = opts.pfzEndpoint     || PFZ_ENDPOINT;
    this._geofenceEndpoint = opts.geofenceEndpoint|| GEOFENCE_ENDPOINT;
    this._onInspect        = opts.onInspect       || null;

    this.map              = null;
    this._pfzLayer        = null;
    this._geofenceLayer   = null;
  }

  // ── Public API ────────────────────────────────────────────

  /**
   * Initialize the map, fetch data, and mount layers.
   * Gracefully falls back to mock data if the backend is unreachable.
   *
   * @param {{ pfzData?: object[], geofenceData?: object[] }} [mockOverride]
   *   Supply to skip network calls entirely (useful for dev / unit testing).
   */
  async init(mockOverride) {
    if (typeof L === 'undefined') {
      console.error('[OrcaMap] Leaflet (L) is not loaded. Add the Leaflet script before map.js.');
      return;
    }

    var el = typeof this._containerIdOrEl === 'string'
      ? document.getElementById(this._containerIdOrEl)
      : this._containerIdOrEl;

    if (!el) {
      console.error('[OrcaMap] Container element not found:', this._containerIdOrEl);
      return;
    }

    this._buildMap(el);

    var pfzData      = null;
    var geofenceData = null;

    if (mockOverride) {
      pfzData      = mockOverride.pfzData      || MOCK_PFZ;
      geofenceData = mockOverride.geofenceData || MOCK_GEOFENCES;
    } else {
      // Fetch both in parallel; fall back individually
      var results = await Promise.allSettled([
        this._fetch(this._pfzEndpoint),
        this._fetch(this._geofenceEndpoint),
      ]);

      pfzData      = results[0].status === 'fulfilled' ? results[0].value : null;
      geofenceData = results[1].status === 'fulfilled' ? results[1].value : null;

      if (!pfzData) {
        console.warn('[OrcaMap] GET ' + this._pfzEndpoint + ' failed — using mock PFZ data.');
        pfzData = MOCK_PFZ;
      }
      if (!geofenceData) {
        console.warn('[OrcaMap] GET ' + this._geofenceEndpoint + ' failed — using mock geofence data.');
        geofenceData = MOCK_GEOFENCES;
      }
    }

    this._populatePFZLayer(pfzData);
    this._populateGeofenceLayer(geofenceData);
  }

  /**
   * Reload PFZ data from the backend and refresh the layer.
   * Useful for a "refresh" button.
   */
  async refreshPFZ() {
    try {
      var data = await this._fetch(this._pfzEndpoint);
      if (this._pfzLayer) this._pfzLayer.clearLayers();
      this._populatePFZLayer(data);
    } catch (e) {
      console.warn('[OrcaMap] PFZ refresh failed:', e);
    }
  }

  /**
   * Reload geofence data from the backend and refresh the layer.
   */
  async refreshGeofences() {
    try {
      var data = await this._fetch(this._geofenceEndpoint);
      if (this._geofenceLayer) this._geofenceLayer.clearLayers();
      this._populateGeofenceLayer(data);
    } catch (e) {
      console.warn('[OrcaMap] Geofence refresh failed:', e);
    }
  }

  /** Toggle PFZ layer on/off. Returns current visibility state. */
  togglePFZ(show) {
    if (!this._pfzLayer || !this.map) return false;
    var visible = show != null ? show : !this.map.hasLayer(this._pfzLayer);
    if (visible) this.map.addLayer(this._pfzLayer);
    else         this.map.removeLayer(this._pfzLayer);
    return visible;
  }

  /** Toggle Geofence / MPA / Restricted-zone layer on/off. */
  toggleGeofences(show) {
    if (!this._geofenceLayer || !this.map) return false;
    var visible = show != null ? show : !this.map.hasLayer(this._geofenceLayer);
    if (visible) this.map.addLayer(this._geofenceLayer);
    else         this.map.removeLayer(this._geofenceLayer);
    return visible;
  }

  /** Fly the map viewport to a coordinate. */
  flyTo(latlng, zoom) {
    if (this.map) this.map.flyTo(latlng, zoom || 9);
  }

  /** Force Leaflet to recalculate its tile layout (call after container resize). */
  invalidate() {
    if (this.map) this.map.invalidateSize();
  }

  // ── Private ───────────────────────────────────────────────

  _buildMap(el) {
    this.map = L.map(el, {
      center:           this._center,
      zoom:             this._zoom,
      zoomControl:      false,
      attributionControl: false,
    });

    // Dark CartoDB basemap — matches Bridge Console dark palette
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(this.map);

    // Brass-styled zoom control
    L.control.zoom({ position: 'topleft' }).addTo(this.map);

    // Layer groups (both added to map by default)
    this._pfzLayer      = L.layerGroup().addTo(this.map);
    this._geofenceLayer = L.layerGroup().addTo(this.map);

    // Live coordinate crosshair
    var self = this;
    this.map.on('mousemove', function(e) {
      self._updateCrosshair(e.latlng);
    });
  }

  _populatePFZLayer(pfzArray) {
    if (!Array.isArray(pfzArray)) return;
    var self = this;

    pfzArray.forEach(function(pfz) {
      var lat = pfz.lat || (pfz.coordinates && pfz.coordinates[0]) || (pfz.latlng && pfz.latlng[0]);
      var lng = pfz.lng || (pfz.coordinates && pfz.coordinates[1]) || (pfz.latlng && pfz.latlng[1]);
      if (lat == null || lng == null) return;

      // Glowing green fish icon
      var icon = L.divIcon({
        className: '',
        html: [
          '<div style="',
          '  width:30px;height:30px;',
          '  background:rgba(18,27,34,.92);',
          '  border:2px solid var(--phosphor-green);',
          '  border-radius:50%;',
          '  display:flex;align-items:center;justify-content:center;',
          '  color:var(--phosphor-green);font-size:14px;',
          '  box-shadow:0 0 12px rgba(107,203,119,.5);',
          '  cursor:pointer;',
          '">🐟</div>',
        ].join(''),
        iconSize:   [30, 30],
        iconAnchor: [15, 15],
      });

      var marker = L.marker([lat, lng], { icon: icon });
      marker.bindPopup(pfzPopupHtml(pfz), { maxWidth: 280 });

      marker.on('click', function() {
        if (self._onInspect) {
          self._onInspect(
            pfz.name,
            (pfz.advisory || '') + ' SST Anomaly: ' + (pfz.sstAnomaly || '—') + '. Species: ' + (pfz.species || []).join(', ') + '.'
          );
        }
      });

      marker.addTo(self._pfzLayer);

      // Subtle confidence radius ring (semi-transparent green fill)
      if (pfz.radiusKm || pfz.radius) {
        var radiusM = (pfz.radiusKm ? pfz.radiusKm * 1000 : pfz.radius);
        L.circle([lat, lng], {
          color:       '#6BCB77',
          fillColor:   '#6BCB77',
          fillOpacity: 0.07,
          radius:      radiusM,
          weight:      1,
          dashArray:   '3,5',
        }).addTo(self._pfzLayer);
      }
    });
  }

  _populateGeofenceLayer(gfArray) {
    if (!Array.isArray(gfArray)) return;
    var self = this;

    gfArray.forEach(function(gf) {
      var colour = gf.colour || GEOFENCE_COLOURS[gf.type] || GEOFENCE_COLOURS.default;
      var popupHtml = geofencePopupHtml(gf);
      var layer;

      if (gf.latlngs && gf.latlngs.length >= 3) {
        // Polygon (MPA, restricted zone)
        layer = L.polygon(gf.latlngs, {
          color:       colour,
          fillColor:   colour,
          fillOpacity: 0.15,
          weight:      2,
          dashArray:   gf.type === 'MPA' ? null : '5,6',
        });
      } else if (gf.center && gf.radius) {
        // Circle (hazard zone, storm perimeter)
        layer = L.circle(gf.center, {
          color:       colour,
          fillColor:   colour,
          fillOpacity: 0.13,
          radius:      gf.radius,
          weight:      2,
          dashArray:   '4,6',
        });
      } else {
        return; // skip malformed entry
      }

      layer.bindPopup(popupHtml, { maxWidth: 280 });

      layer.on('click', function() {
        if (self._onInspect) {
          self._onInspect(
            gf.name,
            (gf.type || 'RESTRICTED').toUpperCase() + ': ' + (gf.description || '')
          );
        }
      });

      layer.addTo(self._geofenceLayer);
    });
  }

  _updateCrosshair(latlng) {
    var latEl   = document.getElementById('map-lat');
    var lonEl   = document.getElementById('map-lon');
    var depthEl = document.getElementById('map-depth');
    if (latEl) latEl.textContent = Math.abs(latlng.lat).toFixed(4) + '° ' + (latlng.lat >= 0 ? 'N' : 'S');
    if (lonEl) lonEl.textContent = Math.abs(latlng.lng).toFixed(4) + '° ' + (latlng.lng >= 0 ? 'E' : 'W');
    // Approximate depth estimate from longitude offset (West Coast India shelf profile)
    if (depthEl) {
      var approxDepth = Math.max(12, Math.min(3500, Math.round((73.5 - latlng.lng) * 200 + 30)));
      depthEl.textContent = approxDepth + 'm';
    }
  }

  async _fetch(url) {
    var response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) throw new Error('HTTP ' + response.status + ' from ' + url);
    return response.json();
  }
}

// ─────────────────────────────────────────────────────────────
// CONVENIENCE: wire an OrcaMap into the existing map view
// that uses the #layer-pfz / #layer-geofences toggle checkboxes
// and #map-inspector-panel from views/map.js layout.
// ─────────────────────────────────────────────────────────────
export async function initMapViewWithBackend(container, soundEngine) {
  var orcaMap = new OrcaMap('leaflet-map', {
    onInspect: function(title, text) {
      var nameEl = container.querySelector('#inspector-name');
      var descEl = container.querySelector('#inspector-desc');
      if (nameEl) nameEl.textContent = title;
      if (descEl) descEl.textContent = text;
      if (soundEngine) soundEngine.playTacticalBeep();
    }
  });

  await orcaMap.init();

  // Wire toggles (IDs from views/map.js HTML)
  function wireCheckbox(id, toggleFn) {
    var chk = container.querySelector(id);
    if (!chk) return;
    chk.addEventListener('change', function() {
      toggleFn(chk.checked);
      if (soundEngine) soundEngine.playMechanicalClick();
    });
  }

  wireCheckbox('#layer-pfz',      function(v) { orcaMap.togglePFZ(v); });
  wireCheckbox('#layer-geofences',function(v) { orcaMap.toggleGeofences(v); });
  // Legacy toggle id used in views/map.js:
  wireCheckbox('#layer-hazards',  function(v) { orcaMap.toggleGeofences(v); });

  // Quick-focus buttons
  function wireBtn(id, latlng, zoom) {
    var btn = container.querySelector(id);
    if (btn) btn.addEventListener('click', function() {
      orcaMap.flyTo(latlng, zoom);
      if (soundEngine) soundEngine.playTacticalBeep();
    });
  }
  wireBtn('#btn-focus-mumbai',  [18.98, 72.82], 8);
  wireBtn('#btn-focus-konkan',  [17.42, 72.35], 9);
  wireBtn('#btn-focus-cyclone', [20.80, 68.50], 7);

  // Refresh buttons (optional, if present in HTML)
  var refreshPFZ = container.querySelector('#btn-refresh-pfz');
  if (refreshPFZ) refreshPFZ.addEventListener('click', function() { orcaMap.refreshPFZ(); });

  var refreshGF = container.querySelector('#btn-refresh-geofences');
  if (refreshGF)  refreshGF.addEventListener('click', function() { orcaMap.refreshGeofences(); });

  return orcaMap;
}
