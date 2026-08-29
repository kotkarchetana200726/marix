// ORCA Agent Bridge Service
// Coordinates multimodal reasoning with AI Agents (Mock SSE Streamer + Live API Adapter)

import { PFZ_ZONES, MONITORED_ZONES, ACTIVE_ALERTS, ROUTE_PRESETS } from '../data/mockData.js';
import { 
  createRiskCard, 
  createPFZCard, 
  createWeatherCard, 
  createVesselAdvisoryCard, 
  createRoutePreviewCard, 
  createReasoningLogCard 
} from '../components/cards.js';

export class AgentBridgeService {
  constructor() {
    this.mode = localStorage.getItem('orca_agent_mode') || 'SIMULATED'; // 'SIMULATED' or 'LIVE_API'
    this.endpointUrl = localStorage.getItem('orca_agent_endpoint') || 'http://localhost:8000/api/orca/reason';
    this.apiKey = localStorage.getItem('orca_agent_key') || '';
  }

  setMode(mode) {
    this.mode = mode;
    localStorage.setItem('orca_agent_mode', mode);
  }

  setEndpoint(url, key = '') {
    this.endpointUrl = url;
    this.apiKey = key;
    localStorage.setItem('orca_agent_endpoint', url);
    localStorage.setItem('orca_agent_key', key);
  }

  // Stream generator that yields reasoning chunks and UI component cards
  async *streamQuery(promptText, onChunk) {
    if (this.mode === 'LIVE_API') {
      try {
        const response = await fetch(this.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
          },
          body: JSON.stringify({ prompt: promptText })
        });

        if (!response.ok) {
          throw new Error(`Agent API returned status ${response.status}`);
        }

        const data = await response.json();
        yield data;
        return;
      } catch (err) {
        console.warn('Live API connection failed, falling back to simulated bridge:', err);
      }
    }

    // Simulated Reasoning Engine matching the prompt intent
    const intent = this.detectIntent(promptText);
    const mockPlan = this.generatePlanForIntent(intent, promptText);

    // 1. Stream Chain of Thought step by step
    for (let i = 0; i < mockPlan.steps.length; i++) {
      await this.delay(350);
      if (onChunk) {
        onChunk({ type: 'STEP', step: mockPlan.steps[i], stepIndex: i });
      }
    }

    // 2. Stream Agent Prose Text
    const words = mockPlan.prose.split(' ');
    let currentProse = '';
    for (let word of words) {
      currentProse += word + ' ';
      await this.delay(40);
      if (onChunk) {
        onChunk({ type: 'PROSE_DELTA', text: currentProse });
      }
    }

    // 3. Emit rendered component cards
    await this.delay(200);
    yield {
      type: 'COMPLETE',
      prose: mockPlan.prose,
      steps: mockPlan.steps,
      cardsHtml: mockPlan.cardsHtml
    };
  }

  detectIntent(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('cyclone') || p.includes('storm') || p.includes('wave') || p.includes('mumbai') || p.includes('risk')) {
      return 'STORM_RISK';
    } else if (p.includes('fish') || p.includes('pfz') || p.includes('catch') || p.includes('konkan') || p.includes('yield')) {
      return 'PFZ_SEARCH';
    } else if (p.includes('route') || p.includes('veraval') || p.includes('ratnagiri') || p.includes('navigation') || p.includes('port')) {
      return 'ROUTE_OPTIMIZE';
    } else if (p.includes('sst') || p.includes('chlorophyll') || p.includes('upwelling') || p.includes('temperature') || p.includes('research')) {
      return 'RESEARCH_SST';
    }
    return 'GENERAL_MARITIME';
  }

  generatePlanForIntent(intent, originalPrompt) {
    switch (intent) {
      case 'STORM_RISK': {
        const zone = MONITORED_ZONES[0]; // Arabian Sea North
        const alert = ACTIVE_ALERTS[0];
        return {
          steps: [
            "Querying Doppler Weather Radar feed & INCOIS Ocean Wave buoy network...",
            "Computing barometric gradient and squall propagation vectors...",
            "Evaluating cyclone risk coefficient for North Arabian Sea sector..."
          ],
          prose: `ORCA Bridge Reasoning Engine has completed real-time assessment for **${originalPrompt}**. Doppler radar reflects Tropical Depression Varuna escalating at 14 knots with central pressure dropping to 988 hPa. Significant wave heights exceed 4.8m in Sector 2A with peak gusts to 65 knots. Small craft and non-ice-class vessels must immediately abort open transit and seek shelter in Ratnagiri or Mumbai inner anchorage.`,
          cardsHtml: [
            createRiskCard({
              riskScore: 84,
              status: "CRITICAL ALERT",
              zoneName: "NORTH ARABIAN SEA",
              title: "Tropical Depression Varuna (Hazard Index 84/100)",
              description: "Severe sea-state escalation with breaking swells. Gale warning active.",
              coordinates: "20°48'N, 68°30'E",
              swell: "4.8m - 6.1m Violent",
              wind: "52 kts (Gale Force)"
            }),
            createWeatherCard({
              pressure: "988.4 hPa (Rapid Fall)",
              sst: "29.4°C (+1.8° Anomaly)",
              wind: "52 kts WNW",
              swell: "5.4m @ 14.8s",
              visibility: "1.2 nm (Heavy Squalls)"
            }),
            createVesselAdvisoryCard({
              priority: "CRITICAL",
              heading: "Emergency Harbor Divert Order",
              text: "Suspend all fishing and towing operations. Plot course 120° towards Ratnagiri Port approaches. Maintain continuous watch on VHF CH 16.",
              safeHarbor: "Ratnagiri Anchorage (Safe Water Mark)",
              vhf: "VHF CH 16 / DSC MF 2187.5 kHz"
            })
          ].join('')
        };
      }

      case 'PFZ_SEARCH': {
        const pfz = PFZ_ZONES[0]; // Konkan Thermal Front
        return {
          steps: [
            "Filtering Copernicus Sentinel-3 OLCI multispectral chlorophyll imagery...",
            "Correlating thermal fronts with sea surface temperature gradient...",
            "Generating fish biomass concentration and species yield probabilities..."
          ],
          prose: `High-yield Potential Fishing Zone (PFZ) isolated along the **Konkan Shelf (Thermal Front Alpha)**. A strong upwelling front with negative SST anomaly (-1.4°C) is generating peak chlorophyll-a concentrations of 3.4 mg/m³. Pelagic fish schools (Indian Mackerel, Sardinella, and Yellowfin Tuna) are heavily concentrated along the 65-meter isobath. Projected fuel savings are 28% compared to unguided trawling.`,
          cardsHtml: [
            createPFZCard(pfz),
            createWeatherCard({
              pressure: "1011.2 hPa",
              sst: "26.8°C (Upwelling Front)",
              wind: "12 kts NW (Favorable)",
              swell: "1.2m Slight",
              visibility: "8.0 nm (Clear)"
            }),
            createRiskCard({
              riskScore: 21,
              status: "SAFE FOR FISHING",
              zoneName: "KONKAN SHELF",
              title: "Konkan Alpha Fishing Perimeter",
              description: "Calm sea state with slight swell. Excellent operational conditions for purse seiners and trawlers.",
              coordinates: "17°25'N, 72°21'E",
              swell: "1.2m",
              wind: "12 kts"
            })
          ].join('')
        };
      }

      case 'ROUTE_OPTIMIZE': {
        const route = ROUTE_PRESETS[0];
        return {
          steps: [
            "Extracting bathymetric contours & restricted naval exercise sectors...",
            "Simulating multi-objective Pareto front (Minimum Risk vs Fuel vs Time)...",
            "Plotting safe waypoint corridor around gale perimeter..."
          ],
          prose: `Route optimization complete between **${route.origin.name}** and **${route.destination.name}**. The direct shortest course directly crosses a gale-force storm cell with 5.5m rogue swells and an unacceptable risk score of **84/100**. ORCA has generated a safe coastal waypoint diversion that reduces risk to **19/100** while saving approximately 530 Liters of fuel by exploiting coastal lee currents.`,
          cardsHtml: [
            createRoutePreviewCard({
              origin: "Veraval Port",
              destination: "Ratnagiri Port"
            }),
            createRiskCard({
              riskScore: 19,
              status: "SAFE PASSAGE",
              zoneName: "COASTAL CORRIDOR",
              title: "ORCA Recommended Safe Route",
              description: "Leverages bathymetric lee shelter. Skirts fishing zone Alpha for opportunistic catch.",
              coordinates: "Via Waypoints 20.6°N, 71.4°E → 18.4°N, 72.8°E",
              swell: "1.8m Moderate",
              wind: "16 kts"
            })
          ].join('')
        };
      }

      case 'RESEARCH_SST': {
        return {
          steps: [
            "Querying NOAA Geo-Polar 5km Blended SST archive...",
            "Computing 30-day thermal anomaly moving averages...",
            "Evaluating thermocline displacement and chlorophyll-a coupling..."
          ],
          prose: `Oceanographic analysis indicates an intensified coastal upwelling cycle along the West Coast of India. The thermal anomaly has shifted to -1.5°C over the past 10 days, displacing the thermocline to 18m below surface level. This has triggered a 300% increase in primary biomass synthesis, making this the most productive biological window of the current monsoon transition.`,
          cardsHtml: [
            createReasoningLogCard([
              "NOAA Geo-Polar SST: 26.5°C recorded at Buoy CB-02 (-1.8°C deviation from 10yr baseline)",
              "Sentinel-3 OLCI: Chlorophyll-a index peaked at 4.2 mg/m³",
              "Biomass Yield Model: Positive correlation with Pelagic catch volume (R² = 0.92)",
              "Recommendation: Deploy acoustic fish finders along 50m bathymetric contour"
            ]),
            createPFZCard(PFZ_ZONES[1])
          ].join('')
        };
      }

      default: {
        return {
          steps: [
            "Parsing maritime operational command...",
            "Querying real-time coastal telemetry and AIS vessel positions...",
            "Synthesizing navigational advisory..."
          ],
          prose: `ORCA Bridge Console is actively monitoring maritime space. All sensor adapters (INCOIS, NOAA, Sentinel-3, IMD Radar, and AIS) are synchronized with sub-second latency. No anomalous distress transmissions detected in your immediate quadrant. Select a tactical preset or input specific coordinate queries below.`,
          cardsHtml: [
            createRiskCard({
              riskScore: 28,
              status: "SYSTEM READY",
              zoneName: "LOCAL QUADRANT",
              title: "Operational Status Nominal",
              description: "All automated vessel monitoring sensors reporting nominal telemetry.",
              coordinates: "18°58'N, 72°49'E",
              swell: "1.6m",
              wind: "15 kts"
            })
          ].join('')
        };
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
