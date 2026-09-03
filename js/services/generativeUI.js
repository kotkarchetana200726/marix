// ORCA — Generative UI Engine
// 
// This is the core of the Generative UI system. Instead of hardcoded templates,
// the AI agent emits a stream of *component specifications* (JSON), and this 
// renderer dynamically instantiates the correct UI components at runtime.

import { createRiskCard, createPFZCard, createWeatherCard, createVesselAdvisoryCard, createRoutePreviewCard, createReasoningLogCard } from '../components/cards.js';
import { findMockResponse } from '../data/mockResponses.js';

// === COMPONENT REGISTRY ===
const COMPONENT_REGISTRY = {
  RiskCard:         (props) => createRiskCard(props),
  PFZCard:          (props) => createPFZCard(props),
  WeatherCard:      (props) => createWeatherCard(props),
  VesselAdvisory:   (props) => createVesselAdvisoryCard(props),
  RoutePreview:     (props) => createRoutePreviewCard(props),
  ReasoningLog:     (props) => createReasoningLogCard(props.steps || []),
  // Lowercase keys matching backend SSE contract
  'risk-card':           (props) => createRiskCard(props),
  'weather-card':        (props) => createWeatherCard(props),
  'ocean-card':          (props) => createWeatherCard(props),
  'pfz-card':            (props) => createPFZCard(props),
  'alert-card':          (props) => createVesselAdvisoryCard(props),
  'recommendation-card': (props) => createVesselAdvisoryCard(props),
  'evidence-panel':      (props) => createReasoningLogCard(props.entries || props.steps || []),
  // Inline components
  Separator:        ()      => `<hr style="border: none; border-top: 1px solid var(--chart-line); margin: 6px 0;">`,
  AlertBanner:      (props) => `
    <div style="
      padding: 10px 14px; 
      background: rgba(255,92,92,0.1); 
      border: 1px solid var(--radar-red); 
      border-radius: var(--radius);
      font-family: var(--font-data);
      font-size: 0.80rem;
      color: var(--radar-red);
    ">
      ⚠️ <strong>${props.title || 'ALERT'}</strong> — ${props.message || ''}
    </div>
  `,
  InfoPanel:        (props) => `
    <div style="
      padding: 10px 14px;
      background: rgba(201,166,107,0.08);
      border: 1px solid var(--brass-dark);
      border-radius: var(--radius);
      font-size: 0.83rem;
      color: var(--parchment);
      line-height: 1.5;
    ">
      ${props.text || ''}
    </div>
  `,
};

// === GENERATIVE UI RENDERER ===
export class GenerativeUIRenderer {
  constructor(mountEl) {
    this.mountEl = mountEl;     // The DOM container to render into
    this.cards = [];             // Track rendered card elements
  }

  handleEvent(event) {
    switch (event.type) {
      case 'PROSE_DELTA':
        this._updateProse(event.text);
        break;

      case 'STEP':
        this._appendStep(event.step, event.stepIndex);
        break;

      case 'COMPONENT':
        this._mountComponent(event.componentType, event.props, event.key);
        break;

      case 'COMPONENT_BATCH':
        if (Array.isArray(event.components)) {
          event.components.forEach((c, i) => {
            setTimeout(() => {
              this._mountComponent(c.type, c.props, c.key || `batch-${i}`);
            }, i * 180);
          });
        }
        break;

      case 'COMPLETE':
        this._finalize(event);
        break;
    }
  }

  _updateProse(text) {
    const proseEl = this.mountEl.querySelector('.genui-prose');
    if (proseEl) {
      proseEl.innerHTML = _formatMarkdown(text) + '<span class="genui-cursor">▌</span>';
    }
  }

  _appendStep(stepText, idx) {
    const stepsEl = this.mountEl.querySelector('.genui-steps');
    if (stepsEl) {
      const row = document.createElement('div');
      row.className = 'genui-step-row';
      row.innerHTML = `<span class="text-brass">[${String(idx + 1).padStart(2, '0')}]</span> ${stepText}`;
      stepsEl.appendChild(row);
    }
  }

  _mountComponent(type, props, key) {
    const factory = COMPONENT_REGISTRY[type];
    if (!factory) {
      console.warn(`[ORCA GenUI] Unknown component type: "${type}". Skipping.`);
      return;
    }

    const cardHtml = factory(props || {});
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'genui-card-mount';
    cardWrapper.setAttribute('data-component', type);
    cardWrapper.setAttribute('data-key', key || type);
    cardWrapper.innerHTML = cardHtml;
    cardWrapper.style.cssText = 'opacity: 0; transform: translateY(8px); transition: all 0.3s ease;';

    const deckEl = this.mountEl.querySelector('.genui-card-deck');
    if (deckEl) {
      deckEl.appendChild(cardWrapper);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cardWrapper.style.opacity = '1';
          cardWrapper.style.transform = 'translateY(0)';
        });
      });
    }

    this.cards.push(cardWrapper);
  }

  _finalize(event) {
    const proseEl = this.mountEl.querySelector('.genui-prose');
    if (proseEl && event.prose) {
      proseEl.innerHTML = _formatMarkdown(event.prose);
    }

    const stepsEl = this.mountEl.querySelector('.genui-steps');
    if (stepsEl) {
      stepsEl.style.transition = 'opacity 0.5s ease';
      stepsEl.style.opacity = '0.4';
    }

    const badgeEl = this.mountEl.querySelector('.genui-status-badge');
    if (badgeEl) {
      badgeEl.textContent = '✓ REASONING COMPLETE';
      badgeEl.className = 'genui-status-badge panel-badge badge-green';
    }

    if (event.components && Array.isArray(event.components)) {
      event.components.forEach((c, i) => {
        setTimeout(() => {
          this._mountComponent(c.type, c.props, c.key || `final-${i}`);
        }, i * 180);
      });
    }
  }
}

// === GENERATIVE UI AGENT BRIDGE ===
export class GenerativeAgentBridge {
  constructor() {
    this.mode = localStorage.getItem('orca_agent_mode') || 'SIMULATED';
    this.endpointUrl = localStorage.getItem('orca_agent_endpoint') || 'http://localhost:8000/api/orca/reason';
    this.apiKey = localStorage.getItem('orca_agent_key') || '';
  }

  // Entry point — streams events to renderer
  async streamTo(promptText, renderer) {
    // 1. Check Centralized Mock Response System first
    const mockMatch = findMockResponse(promptText);
    if (mockMatch) {
      return this._streamFromMockMatch(mockMatch, renderer);
    }

    // 2. Fall back to standard live API or simulated engine for unmatched queries
    if (this.mode === 'LIVE_API') {
      return this._streamFromLiveAPI(promptText, renderer);
    } else {
      return this._streamFromSimulatedEngine(promptText, renderer);
    }
  }

  // Stream deterministic mock response matching exact user query
  async _streamFromMockMatch(mockMatch, renderer) {
    // 1. Reasoning steps
    for (let i = 0; i < mockMatch.steps.length; i++) {
      await _delay(280);
      renderer.handleEvent({ type: 'STEP', step: mockMatch.steps[i], stepIndex: i });
    }

    await _delay(150);

    // 2. Prose word by word
    const words = mockMatch.prose.split(' ');
    let partial = '';
    for (const word of words) {
      partial += word + ' ';
      await _delay(28);
      renderer.handleEvent({ type: 'PROSE_DELTA', text: partial });
    }

    await _delay(250);

    // 3. Components
    for (let i = 0; i < mockMatch.components.length; i++) {
      await _delay(180);
      renderer.handleEvent({
        type: 'COMPONENT',
        componentType: mockMatch.components[i].type,
        props: mockMatch.components[i].props || mockMatch.components[i].data,
        key: `${mockMatch.components[i].type}-${i}`
      });
    }

    // 4. Signal completion
    await _delay(100);
    renderer.handleEvent({
      type: 'COMPLETE',
      prose: mockMatch.prose,
      components: []
    });
  }

  async _streamFromLiveAPI(promptText, renderer) {
    try {
      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
        },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!response.body) throw new Error('No streaming response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          try {
            const event = JSON.parse(line.replace('data: ', ''));
            renderer.handleEvent(event);
          } catch (e) {
            console.warn('[ORCA GenUI] SSE parse error:', e);
          }
        }
      }
    } catch (err) {
      console.warn('[ORCA GenUI] Live API failed, using simulated engine:', err.message);
      await this._streamFromSimulatedEngine(promptText, renderer);
    }
  }

  async _streamFromSimulatedEngine(promptText, renderer) {
    const intent = _detectIntent(promptText);
    const plan = _generateResponsePlan(intent);

    for (let i = 0; i < plan.steps.length; i++) {
      await _delay(380);
      renderer.handleEvent({ type: 'STEP', step: plan.steps[i], stepIndex: i });
    }

    await _delay(200);

    const words = plan.prose.split(' ');
    let partial = '';
    for (const word of words) {
      partial += word + ' ';
      await _delay(38);
      renderer.handleEvent({ type: 'PROSE_DELTA', text: partial });
    }

    await _delay(300);

    for (let i = 0; i < plan.components.length; i++) {
      await _delay(220);
      renderer.handleEvent({
        type: 'COMPONENT',
        componentType: plan.components[i].type,
        props: plan.components[i].props,
        key: `${plan.components[i].type}-${i}`
      });
    }

    await _delay(100);
    renderer.handleEvent({
      type: 'COMPLETE',
      prose: plan.prose,
      components: []
    });
  }
}

function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function _formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--parchment-bright);">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--brass);">$1</em>');
}

function _detectIntent(prompt) {
  const p = prompt.toLowerCase();
  if (p.match(/cyclone|storm|wave|gale|mumbai|swell|weather|wind/)) return 'STORM_RISK';
  if (p.match(/fish|pfz|catch|konkan|yield|sardinella|tuna|mackerel/)) return 'PFZ_SEARCH';
  if (p.match(/route|veraval|ratnagiri|navigation|port|course|waypoint/)) return 'ROUTE_OPTIMIZE';
  if (p.match(/sst|chlorophyll|upwelling|temperature|bloom|research/)) return 'RESEARCH_SST';
  return 'GENERAL_STATUS';
}

function _generateResponsePlan(intent) {
  const plans = {
    STORM_RISK: {
      steps: [
        "Polling IMD Doppler Weather Radar mesh (68ms latency)...",
        "Querying INCOIS Wave Buoy 2304 — barometric readings & swell period...",
        "Computing hazard risk coefficient using wave-energy spectral model...",
        "Cross-referencing AIS vessel positions against storm core perimeter..."
      ],
      prose: "**Tropical Depression Varuna** is intensifying over the North Arabian Sea, accelerating NE at 14 knots. Central pressure has dropped to **988 hPa** with sustained surface winds of 52 knots and gusts to 65 knots. Significant wave heights of **4.8m–6.1m** are recorded by Buoy 2304. All small craft must immediately abort transit and seek shelter at Ratnagiri or Mumbai.",
      components: [
        { type: 'RiskCard', props: { riskScore: 88, status: 'CRITICAL', zoneName: 'ARABIAN SEA NORTH', title: 'Tropical Depression Varuna — Active Gale Warning', description: 'Sustained 52-knot winds with 5.8m significant wave heights. Storm core tracking NE at 14 kts.', coordinates: "20°48'N, 68°30'E", swell: '5.8m Phenomenal', wind: '52 kts NNE (Gale)' }},
        { type: 'WeatherCard', props: { pressure: '988 hPa (Rapid Fall)', sst: '29.4°C (+1.8° Anomaly)', wind: '52 kts NNE', swell: '5.8m @ 14.8s Period', visibility: '1.2 nm (Heavy Squall)' }},
        { type: 'AlertBanner', props: { title: 'PORT WARNING SIGNAL NO. 8 HOISTED', message: 'Okha, Porbandar, Veraval, Ratnagiri. No vessel movement permitted without Coast Guard clearance.' }},
        { type: 'VesselAdvisory', props: { priority: 'CRITICAL', heading: 'Emergency Anchorage Divert Order', text: 'Set course 120° magnetic. Reduce speed to bare steerage. Maintain full bilge pump operation. All crew to remain below deck.', safeHarbor: 'Ratnagiri Anchorage (Safe Water Mark)', vhf: 'VHF CH 16 / DSC MF 2187.5 kHz' }},
      ]
    },

    PFZ_SEARCH: {
      steps: [
        "Filtering Copernicus Sentinel-3 OLCI imagery (pass 10:20Z)...",
        "Isolating negative SST anomaly contours along shelf break...",
        "Computing fish biomass probability using trophic cascade model...",
        "Generating ranked PFZ advisories with fuel efficiency estimates..."
      ],
      prose: "**Two high-yield PFZ opportunities** detected along the Konkan Shelf. The primary zone (Thermal Front Alpha, 17°25'N, 72°21'E) shows exceptional upwelling conditions with chlorophyll-a at **3.4 mg/m³** — 300% above seasonal baseline. Indian Mackerel, Sardinella, and Yellowfin Tuna are heavily concentrated at the 65m isobath. Secondary zone (Ratnagiri-Devgad Edge) is also active.",
      components: [
        { type: 'PFZCard', props: { name: 'Konkan Thermal Front Alpha (PRIMARY)', latLonStr: "17°25'N, 72°21'E", sstAnomaly: '-1.4°C (Strong Coastal Upwelling)', chlorophyll: '3.4 mg/m³ (Peak Bloom)', confidence: '96%', targetSpecies: ['Indian Mackerel (Rastrelliger)', 'Sardinella longiceps', 'Yellowfin Tuna'], distanceNm: '25.9', depthM: 65, fuelSavingsEst: '28% vs Blind Trawling', advisory: 'Optimal window 0300Z–1100Z. Deploy purse seine along 65m isobath, heading SW at 4 knots.' }},
        { type: 'PFZCard', props: { name: 'Ratnagiri-Devgad Pelagic Edge (SECONDARY)', latLonStr: "16°33'N, 72°51'E", sstAnomaly: '-0.9°C (Eddy Convergence)', chlorophyll: '2.8 mg/m³ (High)', confidence: '91%', targetSpecies: ['Seer Fish (Surmai)', 'Squid / Cephalopods', 'Horse Mackerel'], distanceNm: '17.3', depthM: 48, fuelSavingsEst: '22% vs Blind Trawling', advisory: 'Favorable current (0.6 kts SE). Strong thermal gradient at 50m isobath.' }},
        { type: 'WeatherCard', props: { pressure: '1011.2 hPa', sst: '26.8°C (Upwelling Front)', wind: '12 kts NW (Favorable)', swell: '1.2m Slight', visibility: '8.0 nm (Clear)', current: '0.6 kts SE' }},
      ]
    },

    ROUTE_OPTIMIZE: {
      steps: [
        "Extracting 50m–200m bathymetric contour corridor from hydrographic charts...",
        "Fetching storm hazard perimeter for Tropical Depression Varuna...",
        "Running multi-objective Pareto optimizer (Risk × Fuel × Time)...",
        "Computing waypoint corridor avoiding Malacca Bank shoals..."
      ],
      prose: "Route optimization between **Veraval and Ratnagiri** complete. The direct 312nm course intersects the Cyclone Varuna gale core with an unacceptable risk score of **84/100**. ORCA has computed a coastal waypoint diversion of **348nm** that reduces risk to **19/100** while *saving 530 litres of fuel* by exploiting the southward lee current behind the continental shelf.",
      components: [
        { type: 'RoutePreview', props: { origin: 'Veraval Port, Gujarat', destination: 'Ratnagiri Port, Maharashtra' }},
        { type: 'RiskCard', props: { riskScore: 19, status: 'SAFE PASSAGE', zoneName: 'COASTAL LEE CORRIDOR', title: 'ORCA Recommended Safe Trajectory', description: 'Coastal bathymetric lee shelter via waypoints 20.6°N→18.4°N. Tail current reduces fuel burn.', coordinates: "Via 20.6°N, 71.4°E → 18.4°N, 72.8°E", swell: '1.8m Moderate', wind: '16 kts' }},
        { type: 'VesselAdvisory', props: { priority: 'ADVISORY', heading: 'Navigational Waypoint Directive', text: 'Depart Veraval on 090° magnetic. Alter to 130° at WP-2 (20°36\'N, 71°24\'E). Skirt PFZ Alpha at WP-3 for opportunistic catch before final approach to Ratnagiri.', safeHarbor: 'Ratnagiri Port (Deep-Water Berth 4)', vhf: 'VHF CH 16 / 22A' }},
      ]
    },

    RESEARCH_SST: {
      steps: [
        "Querying NOAA Geo-Polar 5km Blended SST archive (Aug 1–26)...",
        "Computing 30-day thermal anomaly moving average...",
        "Cross-correlating chlorophyll-a with primary productivity indices...",
        "Invoking Ecosystem Trophic Cascade model v3.1..."
      ],
      prose: "Oceanographic analysis reveals an **intensified upwelling cycle** along the West Indian Shelf. Thermocline depth has shallowed from 42m to **18m** over the past 10 days, driven by Ekman transport. This has elevated cold, nutrient-rich sub-surface water into the photic zone, triggering a **diatom bloom** with chlorophyll-a reaching 4.2 mg/m³ — 300% above seasonal baseline. This is the most productive biological window of the 2026 monsoon transition.",
      components: [
        { type: 'ReasoningLog', props: { steps: [
          "NOAA Geo-Polar SST: 26.5°C at Buoy CB-02 (−1.8°C deviation from 10yr mean)",
          "Sentinel-3 OLCI: Chl-a index = 4.2 mg/m³ (confidence: 97%, cloud-free pass)",
          "Thermocline at 18m → upwelled water in photic zone → diatom bloom triggered",
          "Biomass Yield Model: Pelagic catch volume correlation R²=0.92 (p<0.001)",
          "Optimal harvest window: 36h, targeting 50–70m isobath with purse seine"
        ]}},
        { type: 'PFZCard', props: { name: 'Kochi-Alleppey Mud Bank (Chakara Zone)', latLonStr: "09°46'N, 75°49'E", sstAnomaly: '-1.6°C (Mud Bank Divergence)', chlorophyll: '4.2 mg/m³ (Peak Bloom)', confidence: '98%', targetSpecies: ['Penaeid Prawns', 'Oil Sardine', 'Anchovy'], distanceNm: '11.8', depthM: 35, fuelSavingsEst: '40% vs Blind Trawling', advisory: 'Exceptional artisanal fishing probability. Calm waters inside 15m contour. Best prawn grounds in decade.' }},
      ]
    },

    GENERAL_STATUS: {
      steps: [
        "Polling all 6 data adapters (INCOIS, NOAA, Sentinel-3, IMD, AIS)...",
        "Scanning AIS mesh for distress transmissions...",
        "Computing global maritime risk summary..."
      ],
      prose: "**ORCA Bridge Console** is operational. All **6 data adapters** are synchronized with sub-second latency. No MAYDAY or PAN-PAN distress signals detected in your monitoring quadrant. Arabian Sea North remains elevated at **78/100 risk** due to Tropical Depression Varuna. Konkan Shelf conditions are optimal for fishing operations. Use the tactical presets or transmit a specific query.",
      components: [
        { type: 'InfoPanel', props: { text: '🟢 INCOIS PFZ Feed: Sync OK &nbsp;|&nbsp; 🟢 NOAA SST: Sync OK &nbsp;|&nbsp; 🟢 IMD Doppler: Sync OK &nbsp;|&nbsp; 🟡 AIS Relay: Minor congestion detected' }},
        { type: 'RiskCard', props: { riskScore: 78, status: 'ELEVATED ALERT', zoneName: 'ARABIAN SEA NORTH', title: 'Regional Risk Overview — North Arabian Sea', description: 'Depression Varuna remains active. All vessels north of 19°N advised to seek shelter.', coordinates: "20.8°N, 68.5°E", swell: '4.2m Rough', wind: '38 kts Gale' }},
      ]
    }
  };

  return plans[intent] || plans.GENERAL_STATUS;
}
