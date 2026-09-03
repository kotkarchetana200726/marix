// MARIX Marine AI — Centralized Mock Data & Response System
// High-fidelity deterministic responses referencing marineData for all 4 stakeholders

import { marineData, sessionMemory, updateSessionMemory } from './marineData.js';

export const MOCK_MODE = true;

export const MOCK_RESPONSES = [

  // ───────────────────────────────────────────────────────────────────────────
  // 🎣 FISHERMAN DEMO RESPONSES
  // ───────────────────────────────────────────────────────────────────────────

  // F-1. PFZ QUESTION (English, Marathi, Hindi)
  {
    id: "FISH_PFZ",
    persona: "fisherman",
    keywords: ["nearest potential fishing zone", "fishing zone today", "where is the nearest", "मासेमारीसाठी चांगली जागा", "मछली पकड़ने के लिए सबसे अच्छी जगह"],
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("nearest") && s.includes("zone")) ||
             (s.includes("fishing") && (s.includes("where") || s.includes("today"))) ||
             s.includes("मासेमारी") || s.includes("मछली पकड़ने");
    },
    steps: [
      "Checking sea conditions...",
      "Checking weather...",
      "Checking safety..."
    ],
    getAnswer: function(q, lang = 'en') {
      updateSessionMemory('PFZ-01', 'Ratnagiri Coast', 'fisherman');

      if (lang === 'mr' || q.includes("मासेमारी")) {
        return {
          title: "🎣 Potential Fishing Zone (संभाव्य मासेमारी क्षेत्र)",
          prose: "तुमच्या सध्याच्या ठिकाणापासून **सुमारे 18 किमी नैऋत्य दिशेला (Southwest)** चांगली मासेमारीची शक्यता असलेला भाग (PFZ-01) आहे. या भागात क्लोरोफिलचे प्रमाण जास्त (**4.7 mg/m³**) असून समुद्राचे तापमान (**27.9°C**) अनुकूल आहे.\n\n### 📋 KEY BULLETINS SUMMARY\n- **अंतर (Distance)**: 18 km (Southwest)\n- **मासेमारी शक्यता (Fish Potential)**: **HIGH (उच्च)**\n- **विश्वासार्हता (PFZ Confidence)**: **87%**\n- **क्लोरोफिल (Chlorophyll)**: **4.7 mg/m³**\n- **समुद्र तापमान (SST)**: **27.9°C**\n\n*टीप: कृपया समुद्रात जाण्यापूर्वी हवामान इ इशारा तपासा.*",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "Ratnagiri Southwest High-Yield Zone (PFZ-01)",
                latLonStr: "16°51'N, 73°10'E",
                sstAnomaly: "27.9°C (Optimal SST)",
                chlorophyll: "4.7 mg/m³ (Peak Bloom)",
                confidence: "87%",
                targetSpecies: ["Pelagic Fishes", "Indian Mackerel", "Sardinella"],
                distanceNm: "9.7 nm (18 km SW)",
                depthM: 48,
                fuelSavingsEst: "28%",
                advisory: "Favorable fishing conditions 18 km SW of Ratnagiri. Proceed with caution."
              }
            },
            {
              type: "marine-map",
              data: {
                label: "POTENTIAL FISHING ZONE (PFZ-01) MAP",
                center: [16.85, 73.18],
                zoom: 9,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "Your Location (Ratnagiri)" },
                  { latlng: [16.85, 73.18], icon: "🐟", popup: "PFZ-01: High Potential (18 km SW)" }
                ]
              }
            }
          ]
        };
      }

      if (lang === 'hi' || q.includes("मछली")) {
        return {
          title: "🎣 Potential Fishing Zone (संभावित मत्स्य पालन क्षेत्र)",
          prose: "आपकी वर्तमान स्थिति से **लगभग 18 किलोमीटर दक्षिण-पश्चिम (Southwest)** दिशा में मछली पकड़ने के लिए अनुकूल क्षेत्र (PFZ-01) है। यहाँ क्लोरोफिल का स्तर अधिक (**4.7 mg/m³**) है और समुद्र का तापमान (**27.9°C**) अनुकूल है।\n\n### 📋 KEY BULLETINS SUMMARY\n- **दूरी (Distance)**: 18 km (Southwest)\n- **मत्स्य संभावना (Fish Potential)**: **HIGH (उच्च)**\n- **PFZ कॉन्फिडेंस**: **87%**\n- **क्लोरोफिल (Chlorophyll)**: **4.7 mg/m³**\n- **समुद्र तापमान (SST)**: **27.9°C**\n\n*सलाह: सावधानी से आगे बढ़ें और मौसम की चेतावनी देखते रहें।*",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "Ratnagiri Southwest Zone (PFZ-01)",
                latLonStr: "16°51'N, 73°10'E",
                sstAnomaly: "27.9°C (Optimal SST)",
                chlorophyll: "4.7 mg/m³ (Peak Bloom)",
                confidence: "87%",
                targetSpecies: ["Pelagic Fishes", "Indian Mackerel", "Sardinella"],
                distanceNm: "9.7 nm (18 km SW)",
                depthM: 48,
                fuelSavingsEst: "28%",
                advisory: "Favorable fishing conditions 18 km SW of Ratnagiri. Proceed with caution."
              }
            },
            {
              type: "marine-map",
              data: {
                label: "POTENTIAL FISHING ZONE (PFZ-01) MAP",
                center: [16.85, 73.18],
                zoom: 9,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "Your Location (Ratnagiri)" },
                  { latlng: [16.85, 73.18], icon: "🐟", popup: "PFZ-01: High Potential (18 km SW)" }
                ]
              }
            }
          ]
        };
      }

      // English
      return {
        title: "🎣 Potential Fishing Zone (PFZ-01)",
        prose: "The nearest high-potential fishing zone (**PFZ-01**) is about **18 km southwest** of your current location. The area shows high chlorophyll concentration and a suitable sea-surface temperature, indicating favourable fishing conditions.\n\n### 📋 KEY DECISION BULLETINS\n- **Distance & Bearing**: **18 km Southwest**\n- **Fish Potential**: **HIGH**\n- **PFZ Confidence**: **87%**\n- **Chlorophyll-a**: **4.7 mg/m³**\n- **Sea Surface Temp (SST)**: **27.9°C**\n- **Recommendation**: Proceed with caution and monitor marine alerts before setting sail.",
        components: [
          {
            type: "pfz-card",
            data: {
              name: "Ratnagiri Southwest High-Yield Zone (PFZ-01)",
              latLonStr: "16°51'N, 73°10'E",
              sstAnomaly: "27.9°C (Optimal SST)",
              chlorophyll: "4.7 mg/m³ (Peak Bloom)",
              confidence: "87%",
              targetSpecies: ["Pelagic Fishes", "Indian Mackerel", "Sardinella"],
              distanceNm: "9.7 nm (18 km SW)",
              depthM: 48,
              fuelSavingsEst: "28%",
              advisory: "Favorable fishing conditions 18 km SW of Ratnagiri. Proceed with caution."
            }
          },
          {
            type: "weather-card",
            data: {
              pressure: "1009.8 hPa",
              sst: "27.9°C",
              wind: "18 km/h SW",
              swell: "1.4 m @ 7.0s",
              visibility: "7.2 km (Good)"
            }
          },
          {
            type: "marine-map",
            data: {
              label: "POTENTIAL FISHING ZONE (PFZ-01) LOCATION",
              center: [16.85, 73.18],
              zoom: 9,
              markers: [
                { latlng: [16.99, 73.31], icon: "⚓", popup: "Your Location (Ratnagiri Coast)" },
                { latlng: [16.85, 73.18], icon: "🐟", popup: "PFZ-01: High Potential (18 km SW)" }
              ]
            }
          }
        ]
      };
    }
  },

  // F-2. SEA SAFETY QUESTION
  {
    id: "FISH_SAFETY",
    persona: "fisherman",
    keywords: ["safe to go fishing", "tomorrow morning", "sea safety"],
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("safe") && s.includes("fishing")) || s.includes("tomorrow morning");
    },
    steps: [
      "Checking sea conditions...",
      "Checking weather forecast...",
      "Checking safety alerts..."
    ],
    getAnswer: function() {
      return {
        title: "🛡️ Marine Sea Safety Directive",
        prose: "### 🟡 SAFETY LEVEL: MODERATE (PROCEED WITH CAUTION)\n\nTomorrow morning is expected to have **moderate sea conditions**. Winds may reach around **18 km/h** and wave height may reach **1.4 metres**. No major cyclone alert is active in the area. Fishing is possible, but you should monitor weather and marine advisories before departure.\n\n### 📋 KEY SAFETY BULLETINS\n- **Safety Level**: **MODERATE**\n- **Wave Height**: **1.4 m**\n- **Wind Speed**: **18 km/h SW**\n- **Cyclone Alert**: **None**\n- **Recommendation**: Monitor conditions before departure. Exercise responsible caution.",
        components: [
          {
            type: "risk-card",
            data: {
              score: 35,
              riskScore: 35,
              status: "MODERATE SAFETY",
              zone: "RATNAGIRI COASTAL SECTOR",
              title: "Sea Safety Directive — Moderate Conditions",
              description: "Winds 18 km/h SW, wave height 1.4m. No active cyclone. Safe for departure with continuous weather monitoring.",
              coordinates: "16.99°N, 73.31°E",
              swell: "1.4 m Moderate",
              wind: "18 km/h SW"
            }
          },
          {
            type: "weather-card",
            data: {
              pressure: "1009.6 hPa",
              sst: "28.4°C",
              wind: "18 km/h SW",
              swell: "1.4 m @ 7.0s",
              visibility: "7.2 km"
            }
          },
          {
            type: "marine-map",
            data: {
              label: "COASTAL SAFETY MONITORING MAP",
              center: [16.99, 73.31],
              zoom: 8,
              markers: [
                { latlng: [16.99, 73.31], icon: "🟢", popup: "Ratnagiri Sector: Moderate Sea State (1.4m waves)" }
              ]
            }
          }
        ]
      };
    }
  },

  // F-3. CURRENT SEA CONDITIONS
  {
    id: "FISH_CONDITIONS",
    persona: "fisherman",
    keywords: ["tide", "weather and sea conditions", "near my fishing location"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("tide") || (s.includes("sea") && s.includes("condition"));
    },
    steps: [
      "Checking sea conditions...",
      "Checking weather...",
      "Checking tide schedule..."
    ],
    getAnswer: function() {
      return {
        title: "🌊 Tide, Weather & Sea Conditions",
        prose: "Near your current location (**Ratnagiri Coast**), the sea is **moderately calm**. The water temperature is **28.4°C**, wave height is around **1.4 metres** and wind is coming from the southwest at approximately **18 km/h**. The next high tide is expected around **2:35 PM**.\n\n### 📋 KEY CONDITIONS BULLETINS\n- 🌊 **Sea**: Wave Height **1.4 m** | Sea State: **Moderate**\n- 🌡 **Ocean**: Sea Surface Temp (SST): **28.4°C**\n- 💨 **Wind**: **18 km/h** (Direction: **SW**)\n- 🌙 **Tide**: High Tide: **2:35 PM** | Low Tide: **9:10 PM** (Height: 2.1 m)",
        components: [
          {
            type: "weather-card",
            data: {
              pressure: "1009.4 hPa",
              sst: "28.4°C",
              wind: "18 km/h SW",
              swell: "1.4 m @ 7.0s",
              visibility: "7.2 km"
            }
          },
          {
            type: "evidence-panel",
            data: {
              title: "TIDE & TELEMETRY READOUT",
              entries: [
                { label: "High Tide", value: "2:35 PM (14:35)", confidence: "100%", source: "INCOIS Tide Gauge" },
                { label: "Low Tide", value: "9:10 PM (21:10)", confidence: "100%", source: "INCOIS Tide Gauge" },
                { label: "Sea Surface Temp", value: "28.4°C", confidence: "96%", source: "NOAA Satellite" }
              ],
              summary: "Sea state moderate. High tide expected at 2:35 PM.",
              modelVersion: "MARIX TELEMETRY"
            }
          },
          {
            type: "marine-map",
            data: {
              label: "RATNAGIRI TIDE & SEA MONITORING STATION",
              center: [16.99, 73.31],
              zoom: 8,
              markers: [
                { latlng: [16.99, 73.31], icon: "🌊", popup: "Ratnagiri Tide Gauge (High Tide 2:35 PM)" }
              ]
            }
          }
        ]
      };
    }
  },

  // F-4. LIGHTNING / CYCLONE ALERT
  {
    id: "FISH_ALERT",
    persona: "fisherman",
    keywords: ["lightning or cyclone", "alerts in my area", "thunderstorm"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("lightning") || s.includes("cyclone") || s.includes("hazard");
    },
    steps: [
      "Checking weather radar...",
      "Checking cyclone track...",
      "Checking safety alerts..."
    ],
    getAnswer: function() {
      return {
        title: "⚡ Hazard & Alert Assessment",
        prose: "There is **currently no cyclone alert** for your area. However, **isolated thunderstorms are possible later today**. I recommend checking the latest marine advisory before going offshore.\n\n### 📋 ALERT SUMMARY\n- 🌀 **Cyclone Status**: 🟢 **No active alert**\n- ⚡ **Lightning Risk**: 🟡 **Low**\n- ⛈️ **Thunderstorm Risk**: 🟡 **Possible later today**\n- **Advisory**: Maintain VHF listening watch and avoid isolated storm cells.",
        components: [
          {
            type: "alert-card",
            data: {
              level: "info",
              title: "Thunderstorm Caution — Coastal Sector",
              message: "Cyclone: 🟢 No active alert | Lightning Risk: 🟡 Low | Isolated thunderstorms possible late afternoon.",
              source: "IMD Marine Radar",
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
            }
          },
          {
            type: "marine-map",
            data: {
              label: "COASTAL THUNDERSTORM RADAR MONITORING",
              center: [16.99, 73.31],
              zoom: 8,
              markers: [
                { latlng: [16.99, 73.31], icon: "⚡", popup: "Isolated thunderstorm probability late afternoon" }
              ]
            }
          }
        ]
      };
    }
  },

  // F-5. SAFEST ROUTE
  {
    id: "FISH_ROUTE",
    persona: "fisherman",
    keywords: ["safest route to the fishing zone", "which route is safer", "safe route"],
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("route") && (s.includes("safe") || s.includes("fishing")));
    },
    steps: [
      "Checking wave conditions along corridors...",
      "Checking restricted perimeters...",
      "Calculating safe passage..."
    ],
    getAnswer: function() {
      return {
        title: "🧭 Recommended Safe Corridor",
        prose: "The **southwest route (Route B)** is currently the preferred option. It avoids the higher-wave region detected to the west and keeps a safe distance from the restricted marine zone.\n\n### 📋 ROUTE BULLETINS\n- **Selected Corridor**: **Southwest Safe Corridor (Route B)**\n- **Waypoints**: Current Location → Safe Corridor → **PFZ-01**\n- **Distance**: **18 km**\n- **Risk Level**: **Low–Moderate**\n- **Restricted Zone**: **Avoided (12.4 km clearance)**",
        components: [
          {
            type: "route-preview-card",
            data: {
              name: "Southwest Safe Passage to PFZ-01",
              origin: "Ratnagiri Coast",
              destination: "PFZ-01 (18 km SW)",
              distanceNm: "9.7 nm (18 km)",
              riskLevel: "Low–Moderate",
              avoidanceArea: "Malvan Marine Protected Area",
              fuelEstimate: "24 Litres"
            }
          },
          {
            type: "marine-map",
            data: {
              label: "RECOMMENDED SAFE PASSAGE CORRIDOR MAP",
              center: [16.92, 73.25],
              zoom: 9,
              markers: [
                { latlng: [16.99, 73.31], icon: "⚓", popup: "Current Location" },
                { latlng: [16.85, 73.18], icon: "🏁", popup: "PFZ-01 Destination" }
              ]
            }
          }
        ]
      };
    }
  },

  // F-6. GEOFENCING / RESTRICTED AREA
  {
    id: "FISH_GEOFENCE",
    persona: "fisherman",
    keywords: ["approaching any restricted area", "restricted area", "geofencing"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("restricted") || s.includes("geofence") || s.includes("boundary");
    },
    steps: [
      "Checking vessel GPS coordinates...",
      "Querying restricted zone polygon layer...",
      "Evaluating perimeter clearance..."
    ],
    getAnswer: function() {
      return {
        title: "🚧 Geofencing & Restricted Zone Monitor",
        prose: "### 🟢 CURRENT STATUS: OUTSIDE RESTRICTED ZONE\n\nYou are currently **outside restricted waters**. The nearest predefined restricted zone (**Marine Protected Area — Malvan Coral Sanctuary**) is approximately **12.4 km** away. ORCA will notify you if your vessel approaches the boundary.\n\n### 📋 GEOFENCE BULLETINS\n- **Vessel Status**: 🟢 **Outside Restricted Zone**\n- **Nearest Restricted Area**: **Marine Protected Area (Malvan Sanctuary)**\n- **Distance**: **12.4 km**\n- **Clearance Status**: **Safe**",
        components: [
          {
            type: "recommendation-card",
            data: {
              priority: "INFO",
              heading: "Geofence Perimeter Status",
              text: "Vessel position verified. Maintain 5 km clearance from Malvan MPA sanctuary boundary.",
              safeHarbor: "Ratnagiri Port",
              vhf: "VHF CH 16"
            }
          },
          {
            type: "marine-map",
            data: {
              label: "GEOFENCING & MPA BOUNDARY MAP",
              center: [16.50, 73.35],
              zoom: 8,
              markers: [
                { latlng: [16.99, 73.31], icon: "⛵", popup: "Your Vessel Position" },
                { latlng: [16.05, 73.46], icon: "🚧", popup: "Marine Protected Area (12.4 km away)" }
              ]
            }
          }
        ]
      };
    }
  },

  // F-7. CONTEXTUAL FOLLOW-UP QUESTION ("Is it safe to go there?")
  {
    id: "FISH_FOLLOWUP",
    persona: "fisherman",
    keywords: ["is it safe to go there", "go there", "safe to go there"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("there") && (s.includes("safe") || s.includes("go"));
    },
    steps: [
      "Checking last referenced location (PFZ-01)...",
      "Checking wave conditions along route...",
      "Evaluating overall trip risk..."
    ],
    getAnswer: function() {
      const topic = sessionMemory.lastTopic || 'PFZ-01';
      return {
        title: `🛡️ Transit Safety to ${topic}`,
        prose: `The route to **${topic}** currently has **moderate risk**. Wave height is around **1.4 metres** and no major cyclone alert is active in the sector.\n\n### 📋 TRANSIT SAFETY BULLETINS\n- **Destination**: **${topic} (18 km SW)**\n- **Risk Level**: **Moderate**\n- **Wave Height**: **1.4 m**\n- **Cyclone Threat**: **None**\n- **Recommendation**: Safe for transit. Maintain normal coastal safety precautions.`,
        components: [
          {
            type: "risk-card",
            data: {
              score: 35,
              riskScore: 35,
              status: "MODERATE RISK",
              zoneName: `${topic} APPROACH CORRIDOR`,
              title: `Transit Safety Assessment — ${topic}`,
              description: `Route to ${topic} clear of active storms. 1.4m wave height.`,
              coordinates: "16.85°N, 73.18°E",
              swell: "1.4 m Moderate",
              wind: "18 km/h SW"
            }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🔬 RESEARCHER DEMO RESPONSES
  // ───────────────────────────────────────────────────────────────────────────

  // R-1. CHLOROPHYLL & SST REGIONS
  {
    id: "RESEARCH_CHLOROPHYLL",
    persona: "researcher",
    keywords: ["chlorophyll concentration", "favourable sea surface temperature", "high chlorophyll"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("chlorophyll") || (s.includes("regions") && s.includes("sst"));
    },
    steps: [
      "Intent Agent → Earth Observation Agent",
      "Satellite Data Agent (Copernicus Sentinel-3 OLCI & NOAA AVHRR)",
      "SST & Chlorophyll Fusion Agent",
      "Trophic Productivity Model",
      "Synthesizing Research Insights"
    ],
    getAnswer: function() {
      return {
        title: "🔬 Marine Research Insight — Chlorophyll & SST Analysis",
        prose: "Three oceanographic zones currently show favorable indicators along the Maharashtra-Goa shelf:\n\n- **PFZ-01**: Highest combined indicator (**Chlorophyll: 4.7 mg/m³**, **SST: 27.9°C**, Potential: **HIGH**)\n- **PFZ-02**: Moderate potential (**Chlorophyll: 3.5 mg/m³**, **SST: 28.1°C**, Potential: **MODERATE**)\n- **PFZ-03**: Lower chlorophyll concentration (**Chlorophyll: 2.1 mg/m³**, **SST: 29.0°C**, Potential: **LOW**)",
        components: [
          {
            type: "evidence-panel",
            data: {
              title: "PFZ SATELLITE COMPARISON DECK",
              entries: [
                { label: "PFZ-01 (SW Front)", value: "Chl: 4.7 mg/m³ | SST: 27.9°C | Potential: HIGH", confidence: "87%", source: "Sentinel-3 OLCI" },
                { label: "PFZ-02 (Malvan Shelf)", value: "Chl: 3.5 mg/m³ | SST: 28.1°C | Potential: MODERATE", confidence: "76%", source: "NOAA AVHRR" },
                { label: "PFZ-03 (Dabhol Front)", value: "Chl: 2.1 mg/m³ | SST: 29.0°C | Potential: LOW", confidence: "58%", source: "MODIS-Aqua" }
              ],
              summary: "PFZ-01 represents the primary thermal front boundary.",
              modelVersion: "ORCA MULTIMODAL OCEAN CORE"
            }
          },
          {
            type: "marine-map",
            data: {
              label: "SATELLITE CHLOROPHYLL & SST MAP",
              center: [16.8, 73.2],
              zoom: 8,
              markers: [
                { latlng: [16.85, 73.18], icon: "🔬", popup: "PFZ-01: Chl 4.7 mg/m³, SST 27.9°C" },
                { latlng: [16.30, 73.22], icon: "🔬", popup: "PFZ-02: Chl 3.5 mg/m³, SST 28.1°C" },
                { latlng: [17.50, 73.05], icon: "🔬", popup: "PFZ-03: Chl 2.1 mg/m³, SST 29.0°C" }
              ]
            }
          }
        ]
      };
    }
  },

  // R-2. PRODUCTIVITY DECLINE
  {
    id: "RESEARCH_DECLINE",
    persona: "researcher",
    keywords: ["productivity declined", "decline", "fish productivity"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("productivity") || s.includes("decline");
    },
    steps: [
      "Intent Agent → Historical Climatology Agent",
      "Decadal SST Anomaly Tracker",
      "Trophic Cascade Evaluator",
      "Formulating Correlational Hypotheses"
    ],
    getAnswer: function() {
      return {
        title: "📊 Coastal Productivity Analysis",
        prose: "The observed variation in fish productivity **may be associated with** changes in chlorophyll concentration, sea-surface temperature, and seasonal ocean conditions. In the simulated dataset, chlorophyll concentration decreased by approximately **18%** over the previous observation period while SST increased by **0.8°C**.\n\n### 📋 PRODUCTIVITY METRICS\n- **Chlorophyll**: Previous: `3.4 mg/m³` → Current: `2.8 mg/m³` (**-18%**)\n- **Sea Surface Temp (SST)**: Previous: `27.6°C` → Current: `28.4°C` (**+0.8°C**)\n- **Potential Associated Factors**:\n  - Reduced chlorophyll density\n  - SST thermal variation\n  - Seasonal upwelling shifts",
        components: [
          {
            type: "evidence-panel",
            data: {
              title: "CORRELATIONAL FACTOR EVIDENCE",
              entries: [
                { label: "Chlorophyll Delta", value: "3.4 -> 2.8 mg/m³ (-18%)", confidence: "89%", source: "Sentinel-3" },
                { label: "SST Delta", value: "27.6 -> 28.4°C (+0.8°C)", confidence: "94%", source: "NOAA AVHRR" }
              ],
              summary: "Simulated dataset indicates correlational trend. Further sampling advised.",
              modelVersion: "ORCA OCEANOGRAPHY CORE"
            }
          }
        ]
      };
    }
  },

  // R-3. REGION COMPARISON
  {
    id: "RESEARCH_COMPARE",
    persona: "researcher",
    keywords: ["compare the fishing potential", "compare regions", "three regions"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("compare") && (s.includes("region") || s.includes("potential"));
    },
    steps: [
      "Intent Agent → Spatial Comparison Agent",
      "Multi-Region Telemetry Aggregator",
      "Synthesizing Comparative Matrix"
    ],
    getAnswer: function() {
      return {
        title: "📈 Regional Fishing Potential Comparison",
        prose: "### 📊 REGIONAL COMPARISON MATRIX\n\n| Region | Chlorophyll (mg/m³) | SST (°C) | Potential |\n|---|---|---|---|\n| **PFZ-01** | **4.7** | **27.9°C** | **HIGH** |\n| **PFZ-02** | **3.5** | **28.1°C** | **MODERATE** |\n| **PFZ-03** | **2.1** | **29.0°C** | **LOW** |\n\n**Conclusion**: PFZ-01 exhibits the strongest oceanographic indicators for pelagic aggregation along the Konkan shelf.",
        components: [
          {
            type: "evidence-panel",
            data: {
              title: "REGIONAL MATRIX DECK",
              entries: [
                { label: "PFZ-01", value: "Chl 4.7 | SST 27.9°C | HIGH", confidence: "87%", source: "INCOIS / MODIS" },
                { label: "PFZ-02", value: "Chl 3.5 | SST 28.1°C | MODERATE", confidence: "76%", source: "INCOIS / MODIS" },
                { label: "PFZ-03", value: "Chl 2.1 | SST 29.0°C | LOW", confidence: "58%", source: "INCOIS / MODIS" }
              ],
              summary: "PFZ-01 ranked primary target zone.",
              modelVersion: "ORCA COMPARATIVE CORE"
            }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🛡️ GOVERNMENT / COASTAL AUTHORITY RESPONSES
  // ───────────────────────────────────────────────────────────────────────────

  // G-1. COASTAL RISK MONITOR
  {
    id: "GOVT_RISK",
    persona: "government",
    keywords: ["elevated marine risk", "coastal areas", "current risk"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("risk") && (s.includes("area") || s.includes("coastal") || s.includes("elevated"));
    },
    steps: [
      "Intent Agent → Coastal Hazard Radar Agent",
      "Regional Sector Risk Evaluator",
      "Vessel Traffic Safety Agent",
      "Synthesizing Situation Directives"
    ],
    getAnswer: function() {
      return {
        title: "🛡️ Coastal Risk Monitor — Regional Status",
        prose: "The **Western Coastal Sector** currently shows the highest simulated risk due to stronger winds and increased wave height. Two additional sectors maintain moderate risk due to potential thunderstorms.\n\n### 📋 COASTAL RISK MONITOR\n- 🔴 **High Risk**: Western Sector (Elevated waves 2.8m)\n- 🟡 **Moderate Risk**: Sector B, Sector C (Thunderstorm probability)\n- 🟢 **Low Risk**: Sector D, Sector E (Nominal conditions)",
        components: [
          {
            type: "risk-card",
            data: {
              score: 62,
              riskScore: 62,
              status: "HIGH RISK — WEST SECTOR",
              zone: "WESTERN COASTAL CORRIDOR",
              title: "Regional Hazard Alert — Western Sector",
              description: "Elevated waves 2.8m and wind gusts. Caution hoisted for small craft.",
              coordinates: "17.10°N, 72.90°E",
              swell: "2.8 m Rough",
              wind: "28 km/h SW"
            }
          },
          {
            type: "marine-map",
            data: {
              label: "COASTAL RISK SECTOR MAP",
              center: [17.0, 73.0],
              zoom: 7,
              markers: [
                { latlng: [17.10, 72.90], icon: "🔴", popup: "Western Sector: HIGH RISK (2.8m waves)" },
                { latlng: [16.50, 73.20], icon: "🟡", popup: "Sector B: MODERATE RISK" },
                { latlng: [16.20, 73.40], icon: "🟢", popup: "Sector D: LOW RISK" }
              ]
            }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🚢 MARITIME BUSINESS RESPONSES
  // ───────────────────────────────────────────────────────────────────────────

  // B-1. BUSINESS ROUTE RECOMMENDATION
  {
    id: "BIZ_ROUTE",
    persona: "business",
    keywords: ["safest route for my vessel", "route recommendation", "business route"],
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("route") && (s.includes("vessel") || s.includes("business") || s.includes("safest")));
    },
    steps: [
      "Intent Agent → Maritime Route Optimizer",
      "Wave & Fuel Dynamics Agent",
      "Restricted Perimeter Check",
      "Generating Pareto Route Plan"
    ],
    getAnswer: function() {
      return {
        title: "🚢 Operational Route Recommendation",
        prose: "The **Southern Corridor (Route B)** currently provides the lower-risk passage. It avoids the higher-wave region detected to the west and maintains a safe distance from the restricted marine zone.\n\n### 📋 ROUTE EVALUATION MATRIX\n- **Route A (Direct Western)**: Risk: 🔴 **HIGH** | Wave: `2.8 m` | **Avoid**\n- **Route B (Southern Corridor)**: Risk: 🟢 **LOW–MODERATE** | Wave: `1.4 m` | **Recommended ✓**",
        components: [
          {
            type: "route-preview-card",
            data: {
              name: "Southern Corridor (Route B) — Pareto Optimal",
              origin: "Ratnagiri Port",
              destination: "Offshore Sector",
              distanceNm: "9.7 nm",
              riskLevel: "LOW-MODERATE",
              avoidanceArea: "Western High-Wave Sector & Malvan MPA",
              fuelEstimate: "24 Litres"
            }
          },
          {
            type: "marine-map",
            data: {
              label: "PARETO OPTIMAL ROUTE COMPARISON MAP",
              center: [16.90, 73.25],
              zoom: 9,
              markers: [
                { latlng: [16.99, 73.31], icon: "🚢", popup: "Ratnagiri Departure" },
                { latlng: [16.85, 73.18], icon: "🏁", popup: "Southern Corridor Destination" }
              ]
            }
          }
        ]
      };
    }
  }

];

export function findMockResponse(queryText, lang = 'en') {
  if (!MOCK_MODE || !queryText) return null;
  const q = queryText.toLowerCase().trim();

  for (const resp of MOCK_RESPONSES) {
    if (typeof resp.match === 'function' && resp.match(q)) {
      if (typeof resp.getAnswer === 'function') {
        const ans = resp.getAnswer(q, lang);
        return {
          id: resp.id,
          persona: resp.persona,
          steps: resp.steps,
          title: ans.title,
          prose: ans.prose,
          components: ans.components
        };
      }
    }
  }

  return null;
}
