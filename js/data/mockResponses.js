// MARIX Marine AI — Centralized Mock Data & Response System
// High-fidelity deterministic responses for hackathon demonstration with bulletins & map

export const MOCK_MODE = true; // Set to false to disable mock mode and use live backend APIs

export const MOCK_RESPONSES = [
  // ── 1. MUMBAI FISHING CONDITIONS ──────────────────────────────────────────
  {
    id: "MUMBAI_FISHING",
    title: "Mumbai Offshore Fishing Conditions Assessment",
    keywords: ["fishing", "mumbai"],
    match: function(query) {
      const q = query.toLowerCase().trim();
      if ((q.includes("fish") || q.includes("pfz")) && q.includes("mumbai")) return true;
      if (q === "fishing conditions in mumbai" || q === "is fishing good near mumbai" || q === "mumbai fishing forecast") return true;
      return false;
    },
    steps: [
      "Normalizing query: Fishing conditions near Mumbai coast...",
      "Querying INCOIS PFZ thermal front advisory dataset (87% confidence)...",
      "Fetching NOAA SST Geo-Polar satellite telemetry (28.4°C)...",
      "Analyzing IMD marine weather radar vectors (Wind 14 km/h, Wave 1.2 m)...",
      "Synthesizing final decision & bulletins summary..."
    ],
    prose: "### 🟢 FINAL DECISION DIRECTIVE: SAFE TO GO FISHING TODAY\n\nFavorable fishing conditions expected **35–55 km off the Mumbai coast**. Oceanographic telemetry confirms active thermal front boundaries and high plankton accumulation along the 50m bathymetric contour.\n\n### 📋 KEY DECISION BULLETINS\n- **Final Decision**: 🟢 SAFE FOR COASTAL & OFFSHORE FISHING (87% Confidence)\n- **Sea Surface Temperature (SST)**: **28.4°C** (-0.8°C thermal anomaly front)\n- **Chlorophyll-a Concentration**: **1.82 mg/m³** (High plankton bloom)\n- **Wave Height**: **1.2 m** (Slight Swell)\n- **Wind Speed & Direction**: **14 km/h WNW**\n- **Recommended Fishing Zone**: **35–55 km off Mumbai Coast (18°55'N, 72°45'E)**\n\n*Data Sources: INCOIS PFZ Advisories, NOAA SST Blended Satellites, IMD Marine Weather.*",
    components: [
      {
        type: "pfz-card",
        props: {
          name: "Mumbai Offshore High-Yield Fishing Zone",
          latLonStr: "18°55'N, 72°45'E",
          sstAnomaly: "28.4°C (-0.8°C Anomaly)",
          chlorophyll: "1.82 mg/m³ (High Bloom)",
          confidence: "87%",
          targetSpecies: ["Pelagic Fishes", "Indian Mackerel", "Sardinella"],
          distanceNm: "24.5 nm (35–55 km)",
          depthM: 52,
          fuelSavingsEst: "28%",
          advisory: "Favorable fishing conditions expected 35–55 km off the Mumbai coast. Deploy gear along 50m isobath."
        },
        data: {
          name: "Mumbai Offshore High-Yield Fishing Zone",
          latLonStr: "18°55'N, 72°45'E",
          sstAnomaly: "28.4°C (-0.8°C Anomaly)",
          chlorophyll: "1.82 mg/m³ (High Bloom)",
          confidence: "87%",
          targetSpecies: ["Pelagic Fishes", "Indian Mackerel", "Sardinella"],
          distanceNm: "24.5 nm (35–55 km)",
          depthM: 52,
          fuelSavingsEst: "28%",
          advisory: "Favorable fishing conditions expected 35–55 km off the Mumbai coast. Deploy gear along 50m isobath."
        }
      },
      {
        type: "weather-card",
        props: {
          pressure: "1010.4 hPa",
          sst: "28.4°C",
          wind: "14 km/h WNW",
          swell: "1.2 m @ 9.5s",
          visibility: "8.5 nm (Good)"
        },
        data: {
          pressure: "1010.4 hPa",
          sst: "28.4°C",
          wind: "14 km/h WNW",
          swell: "1.2 m @ 9.5s",
          visibility: "8.5 nm (Good)"
        }
      },
      {
        type: "marine-map",
        props: {
          label: "MUMBAI OFFSHORE PFZ & FISHING ZONE",
          center: [18.92, 72.75],
          zoom: 8,
          markers: [
            { latlng: [18.92, 72.75], icon: "🐟", popup: "Mumbai Offshore PFZ (SST 28.4°C)" }
          ]
        },
        data: {
          label: "MUMBAI OFFSHORE PFZ & FISHING ZONE",
          center: [18.92, 72.75],
          zoom: 8,
          markers: [
            { latlng: [18.92, 72.75], icon: "🐟", popup: "Mumbai Offshore PFZ (SST 28.4°C)" }
          ]
        }
      },
      {
        type: "evidence-panel",
        props: {
          title: "EVIDENCE TRACE & TELEMETRY SOURCES",
          entries: [
            { label: "INCOIS PFZ Feed", value: "High-yield thermal front identified 35–55 km off Mumbai", confidence: "87%", source: "INCOIS Advisory" },
            { label: "NOAA SST Satellite", value: "Sea Surface Temp: 28.4°C | Chlorophyll-a: 1.82 mg/m³", confidence: "92%", source: "NOAA Geo-Polar" },
            { label: "IMD Weather Mesh", value: "Wind: 14 km/h WNW | Wave Height: 1.2 m", confidence: "95%", source: "IMD Radar" }
          ],
          summary: "Favorable fishing conditions verified off Mumbai. DEMO NOTICE: This is deterministic mock telemetry prepared for hackathon demonstration.",
          modelVersion: "MARIX DEMO MODE"
        },
        data: {
          title: "EVIDENCE TRACE & TELEMETRY SOURCES",
          entries: [
            { label: "INCOIS PFZ Feed", value: "High-yield thermal front identified 35–55 km off Mumbai", confidence: "87%", source: "INCOIS Advisory" },
            { label: "NOAA SST Satellite", value: "Sea Surface Temp: 28.4°C | Chlorophyll-a: 1.82 mg/m³", confidence: "92%", source: "NOAA Geo-Polar" },
            { label: "IMD Weather Mesh", value: "Wind: 14 km/h WNW | Wave Height: 1.2 m", confidence: "95%", source: "IMD Radar" }
          ],
          summary: "Favorable fishing conditions verified off Mumbai. DEMO NOTICE: This is deterministic mock telemetry prepared for hackathon demonstration.",
          modelVersion: "MARIX DEMO MODE"
        }
      }
    ]
  },

  // ── 2. MUMBAI CYCLONE RISK ────────────────────────────────────────────────
  {
    id: "CYCLONE_MUMBAI",
    title: "Mumbai Regional Cyclone & Sea State Risk Assessment",
    keywords: ["cyclone", "mumbai"],
    match: function(query) {
      const q = query.toLowerCase().trim();
      if ((q.includes("cyclone") || q.includes("storm") || q.includes("threat")) && q.includes("mumbai")) return true;
      return false;
    },
    steps: [
      "Accessing IMD Doppler weather radar & regional storm tracking mesh...",
      "Evaluating barometric pressure trends & wind shear fields near Mumbai...",
      "Computing vessel hazard risk index (Score 48 / MODERATE)...",
      "Generating final decision & small craft advisory bulletins..."
    ],
    prose: "### 🟡 FINAL DECISION DIRECTIVE: EXERCISE CAUTION NEAR COAST\n\nThere is **no active cyclone directly affecting Mumbai** at present. However, **elevated wave activity (2.1–2.8 m)** and sustained winds of **28–35 km/h** are expected over the next 24 hours.\n\n### 📋 KEY DECISION BULLETINS\n- **Final Decision**: 🟡 MODERATE RISK — SMALL VESSELS AVOID DEEP WATER\n- **Sea Surface Temperature (SST)**: **28.1°C**\n- **Sea State**: Moderate to Rough\n- **Wave Height**: **2.1–2.8 m** (Elevated Swell)\n- **Wind Speed**: **28–35 km/h** WSW (Gusts to 42 km/h)\n- **Recommendation**: Small fishing vessels advised to remain within 20 km of coast and monitor VHF CH 16.\n\n*DISCLAIMER: Simulated demonstration advisory. Verify with official Coast Guard / IMD weather bulletins.*",
    components: [
      {
        type: "risk-card",
        props: {
          riskScore: 48,
          status: "MODERATE RISK",
          zoneName: "MUMBAI COASTAL & OFFSHORE SECTOR",
          title: "Cyclone & Sea Hazard Advisory — Mumbai Coast",
          description: "No active cyclone directly affecting Mumbai. Elevated wave activity (2.1–2.8 m) and wind gusts expected over next 24 hours.",
          coordinates: "18.98°N, 72.82°E",
          swell: "2.1–2.8 m Moderate-Rough",
          wind: "28–35 km/h WSW"
        },
        data: {
          riskScore: 48,
          score: 48,
          status: "MODERATE RISK",
          zoneName: "MUMBAI COASTAL & OFFSHORE SECTOR",
          title: "Cyclone & Sea Hazard Advisory — Mumbai Coast",
          description: "No active cyclone directly affecting Mumbai. Elevated wave activity (2.1–2.8 m) and wind gusts expected over next 24 hours.",
          coordinates: "18.98°N, 72.82°E",
          swell: "2.1–2.8 m Moderate-Rough",
          wind: "28–35 km/h WSW"
        }
      },
      {
        type: "weather-card",
        props: {
          pressure: "1005.8 hPa",
          sst: "28.1°C",
          wind: "28–35 km/h WSW",
          swell: "2.1–2.8 m @ 11.2s",
          visibility: "5.2 nm (Moderate Squall)"
        },
        data: {
          pressure: "1005.8 hPa",
          sst: "28.1°C",
          wind: "28–35 km/h WSW",
          swell: "2.1–2.8 m @ 11.2s",
          visibility: "5.2 nm (Moderate Squall)"
        }
      },
      {
        type: "marine-map",
        props: {
          label: "MUMBAI COASTAL RISK SECTOR & HAZARD AREA",
          center: [18.98, 72.82],
          zoom: 8,
          markers: [
            { latlng: [18.98, 72.82], icon: "⚠️", popup: "Moderate Swell Hazard Area (2.1-2.8m)" }
          ]
        },
        data: {
          label: "MUMBAI COASTAL RISK SECTOR & HAZARD AREA",
          center: [18.98, 72.82],
          zoom: 8,
          markers: [
            { latlng: [18.98, 72.82], icon: "⚠️", popup: "Moderate Swell Hazard Area (2.1-2.8m)" }
          ]
        }
      },
      {
        type: "recommendation-card",
        props: {
          priority: "ADVISORY",
          heading: "Small Craft Safety Directive",
          text: "Small fishing vessels (< 15m LOA) should avoid deep offshore transit over the next 24 hours. Maintain VHF Channel 16 guard.",
          actions: [
            "Remain within 20 km of coast",
            "Monitor VHF Channel 16 listening watch",
            "Check barometric pressure before setting sail"
          ],
          safeHarbor: "Sassoon Dock / Mumbai Harbour",
          vhf: "VHF CH 16 / 08"
        },
        data: {
          priority: "ADVISORY",
          heading: "Small Craft Safety Directive",
          text: "Small fishing vessels (< 15m LOA) should avoid deep offshore transit over the next 24 hours. Maintain VHF Channel 16 guard.",
          actions: [
            "Remain within 20 km of coast",
            "Monitor VHF Channel 16 listening watch",
            "Check barometric pressure before setting sail"
          ],
          safeHarbor: "Sassoon Dock / Mumbai Harbour",
          vhf: "VHF CH 16 / 08"
        }
      }
    ]
  },

  // ── 3. MUMBAI SEA CONDITION ───────────────────────────────────────────────
  {
    id: "SEA_CONDITION_MUMBAI",
    title: "Mumbai Coastal Sea State & Navigational Condition",
    keywords: ["sea condition", "mumbai"],
    match: function(query) {
      const q = query.toLowerCase().trim();
      if ((q.includes("sea condition") || q.includes("sea state") || q.includes("wave")) && q.includes("mumbai")) return true;
      return false;
    },
    steps: [
      "Polling INCOIS directional wave buoy telemetry (1.8 m swell)...",
      "Analyzing coastal wind velocity & visibility vectors...",
      "Evaluating overall marine risk coefficient (28 / LOW-MODERATE)...",
      "Synthesizing final decision bulletins..."
    ],
    prose: "### 🟢 FINAL DECISION DIRECTIVE: SEA CONDITIONS NOMINAL\n\nCurrent sea conditions near Mumbai are **moderate and safe for normal coastal vessel operations**.\n\n### 📋 KEY DECISION BULLETINS\n- **Final Decision**: 🟢 NOMINAL — SAFE FOR COASTAL NAVIGATION\n- **Sea Surface Temperature (SST)**: **28.2°C**\n- **Sea State**: Moderate Swell\n- **Wave Height**: **1.8 m** (@ 10.1s Period)\n- **Wind Speed**: **18 km/h NW**\n- **Visibility**: **Good (7.8 nm)**\n- **Overall Risk Score**: **28 / 100 (LOW–MODERATE)**\n- **Recommendation**: Normal coastal transit and fishing permitted within safety limits.",
    components: [
      {
        type: "weather-card",
        props: {
          pressure: "1009.2 hPa",
          sst: "28.2°C",
          wind: "18 km/h NW",
          swell: "1.8 m @ 10.1s",
          visibility: "Good (7.8 nm)"
        },
        data: {
          pressure: "1009.2 hPa",
          sst: "28.2°C",
          wind: "18 km/h NW",
          swell: "1.8 m @ 10.1s",
          visibility: "Good (7.8 nm)"
        }
      },
      {
        type: "risk-card",
        props: {
          riskScore: 28,
          status: "NOMINAL",
          zoneName: "MUMBAI COASTAL SECTOR",
          title: "Mumbai Coastal Sea Condition Overview",
          description: "Moderate sea state with 1.8m wave swell and 18 km/h winds. Navigational conditions generally stable.",
          coordinates: "18.96°N, 72.80°E",
          swell: "1.8 m Moderate",
          wind: "18 km/h NW"
        },
        data: {
          riskScore: 28,
          score: 28,
          status: "NOMINAL",
          zoneName: "MUMBAI COASTAL SECTOR",
          title: "Mumbai Coastal Sea Condition Overview",
          description: "Moderate sea state with 1.8m wave swell and 18 km/h winds. Navigational conditions generally stable.",
          coordinates: "18.96°N, 72.80°E",
          swell: "1.8 m Moderate",
          wind: "18 km/h NW"
        }
      },
      {
        type: "marine-map",
        props: {
          label: "MUMBAI SEA STATE MONITORING LOCATION",
          center: [18.96, 72.80],
          zoom: 8,
          markers: [
            { latlng: [18.96, 72.80], icon: "🌊", popup: "Mumbai Sea State Buoy (1.8m Swell, 28.2°C SST)" }
          ]
        },
        data: {
          label: "MUMBAI SEA STATE MONITORING LOCATION",
          center: [18.96, 72.80],
          zoom: 8,
          markers: [
            { latlng: [18.96, 72.80], icon: "🌊", popup: "Mumbai Sea State Buoy (1.8m Swell, 28.2°C SST)" }
          ]
        }
      }
    ]
  },

  // ── 4. POTENTIAL FISHING ZONES DIRECTORY ─────────────────────────────────
  {
    id: "POTENTIAL_FISHING_ZONES",
    title: "Regional Potential Fishing Zones (PFZ) Directory",
    keywords: ["where are", "pfz", "potential fishing zones"],
    match: function(query) {
      const q = query.toLowerCase().trim();
      if ((q.includes("where") || q.includes("find") || q.includes("list")) && (q.includes("pfz") || q.includes("fishing zone"))) return true;
      return false;
    },
    steps: [
      "Accessing Copernicus Sentinel-3 OLCI ocean color satellite imagery...",
      "Extracting active thermal front coordinates & chlorophyll anomalies...",
      "Compiling ranked regional Potential Fishing Zone advisories...",
      "Synthesizing final decision bulletins & zone map..."
    ],
    prose: "### 🟢 FINAL DECISION DIRECTIVE: 3 ACTIVE PFZ ZONES IDENTIFIED\n\nHigh-yield fishing opportunities identified across Maharashtra and Konkan shelf zones.\n\n### 📋 KEY DECISION BULLETINS\n- **1. Mumbai Offshore PFZ**: `18°52'N, 72°38'E` | SST: **28.4°C** | Confidence: **87%** | Yield: **HIGH**\n- **2. Ratnagiri Offshore PFZ**: `16°58'N, 72°42'E` | SST: **27.8°C** | Confidence: **92%** | Yield: **VERY HIGH**\n- **3. Goa Coastal PFZ**: `15°24'N, 73°35'E` | SST: **28.1°C** | Confidence: **89%** | Yield: **HIGH**\n- **Target Depth**: 36m to 54m bathymetric contours\n- **Target Species**: Indian Mackerel, Sardinella, Kingfish (Surmai)\n\n*DEMO NOTICE: Coordinates and advisories represent mock demonstration data for hackathon presentation.*",
    components: [
      {
        type: "pfz-card",
        props: {
          name: "1. Mumbai Offshore PFZ (Sector Alpha)",
          latLonStr: "18°52'N, 72°38'E",
          sstAnomaly: "28.4°C (-1.1°C Anomaly)",
          chlorophyll: "1.82 mg/m³",
          confidence: "87%",
          targetSpecies: ["Indian Mackerel", "Sardinella longiceps"],
          distanceNm: "21.6 nm (40 km)",
          depthM: 54,
          fuelSavingsEst: "25%",
          advisory: "Primary front active along 50m bathymetric contour."
        },
        data: {
          name: "1. Mumbai Offshore PFZ (Sector Alpha)",
          latLonStr: "18°52'N, 72°38'E",
          sstAnomaly: "28.4°C (-1.1°C Anomaly)",
          chlorophyll: "1.82 mg/m³",
          confidence: "87%",
          targetSpecies: ["Indian Mackerel", "Sardinella longiceps"],
          distanceNm: "21.6 nm (40 km)",
          depthM: 54,
          fuelSavingsEst: "25%",
          advisory: "Primary front active along 50m bathymetric contour."
        }
      },
      {
        type: "pfz-card",
        props: {
          name: "2. Ratnagiri Offshore PFZ (Front Beta)",
          latLonStr: "16°58'N, 72°42'E",
          sstAnomaly: "27.8°C (-1.4°C Anomaly)",
          chlorophyll: "2.95 mg/m³",
          confidence: "92%",
          targetSpecies: ["Kingfish (Surmai)", "Seer Fish", "Squid"],
          distanceNm: "15.1 nm (28 km)",
          depthM: 48,
          fuelSavingsEst: "32%",
          advisory: "Strong thermal gradient. Deploy purse seine along edge."
        },
        data: {
          name: "2. Ratnagiri Offshore PFZ (Front Beta)",
          latLonStr: "16°58'N, 72°42'E",
          sstAnomaly: "27.8°C (-1.4°C Anomaly)",
          chlorophyll: "2.95 mg/m³",
          confidence: "92%",
          targetSpecies: ["Kingfish (Surmai)", "Seer Fish", "Squid"],
          distanceNm: "15.1 nm (28 km)",
          depthM: 48,
          fuelSavingsEst: "32%",
          advisory: "Strong thermal gradient. Deploy purse seine along edge."
        }
      },
      {
        type: "marine-map",
        props: {
          label: "REGIONAL POTENTIAL FISHING ZONES MAP",
          center: [17.5, 72.8],
          zoom: 7,
          markers: [
            { latlng: [18.86, 72.63], icon: "🐟", popup: "Mumbai Offshore PFZ (87% conf, SST 28.4°C)" },
            { latlng: [16.96, 72.70], icon: "🐟", popup: "Ratnagiri Offshore PFZ (92% conf, SST 27.8°C)" },
            { latlng: [15.40, 73.58], icon: "🐟", popup: "Goa Coastal PFZ (89% conf, SST 28.1°C)" }
          ]
        },
        data: {
          label: "REGIONAL POTENTIAL FISHING ZONES MAP",
          center: [17.5, 72.8],
          zoom: 7,
          markers: [
            { latlng: [18.86, 72.63], icon: "🐟", popup: "Mumbai Offshore PFZ (87% conf, SST 28.4°C)" },
            { latlng: [16.96, 72.70], icon: "🐟", popup: "Ratnagiri Offshore PFZ (92% conf, SST 27.8°C)" },
            { latlng: [15.40, 73.58], icon: "🐟", popup: "Goa Coastal PFZ (89% conf, SST 28.1°C)" }
          ]
        }
      }
    ]
  },

  // ── 5. TODAY'S MARINE SNAPSHOT ───────────────────────────────────────────
  {
    id: "MARINE_SNAPSHOT",
    title: "Daily Marine Intelligence Snapshot & Status Report",
    keywords: ["snapshot", "marine snapshot", "today's marine"],
    match: function(query) {
      const q = query.toLowerCase().trim();
      if (q.includes("snapshot") || q.includes("marine summary") || q.includes("daily status") || q.includes("marine overview")) return true;
      return false;
    },
    steps: [
      "Polling all 6 data adapters (INCOIS, NOAA, Sentinel-3, IMD, AIS)...",
      "Aggregating regional temperature, wave & wind telemetry...",
      "Computing overall coastal risk index (34 / LOW-MODERATE)...",
      "Synthesizing final decision bulletins..."
    ],
    prose: "### 🟢 FINAL DECISION DIRECTIVE: OVERALL MARINE STATUS OPERATIONAL\n\nCoastal conditions across Maharashtra and Konkan sectors are **nominal and safe for routine marine operations**.\n\n### 📋 KEY DECISION BULLETINS\n- **Overall Marine Status**: 🟢 OPERATIONAL / SYS NOMINAL\n- **Sea Surface Temperature (SST)**: **28.3°C**\n- **Chlorophyll-a Concentration**: **2.15 mg/m³**\n- **Wave Height**: **1.5 m** (@ 10.4s Swell)\n- **Wind Speed & Direction**: **16 km/h WNW**\n- **Weather Risk Index**: **34 / 100 (LOW–MODERATE)**\n- **Fishing Yield Potential**: **HIGH (88%)**",
    components: [
      {
        type: "weather-card",
        props: {
          pressure: "1009.4 hPa",
          sst: "28.3°C",
          wind: "16 km/h WNW",
          swell: "1.5 m @ 10.4s",
          visibility: "8.0 nm (Clear)"
        },
        data: {
          pressure: "1009.4 hPa",
          sst: "28.3°C",
          wind: "16 km/h WNW",
          swell: "1.5 m @ 10.4s",
          visibility: "8.0 nm (Clear)"
        }
      },
      {
        type: "risk-card",
        props: {
          riskScore: 34,
          status: "NOMINAL",
          zoneName: "ARABIAN SEA / KONKAN QUADRANT",
          title: "Regional Marine Risk Index — Snapshot",
          description: "Low-to-moderate hazard index (34/100). No active storm core within 250 NM. Safe transit across coastal corridors.",
          coordinates: "17.5°N, 72.8°E",
          swell: "1.5 m Moderate",
          wind: "16 km/h WNW"
        },
        data: {
          riskScore: 34,
          score: 34,
          status: "NOMINAL",
          zoneName: "ARABIAN SEA / KONKAN QUADRANT",
          title: "Regional Marine Risk Index — Snapshot",
          description: "Low-to-moderate hazard index (34/100). No active storm core within 250 NM. Safe transit across coastal corridors.",
          coordinates: "17.5°N, 72.8°E",
          swell: "1.5 m Moderate",
          wind: "16 km/h WNW"
        }
      },
      {
        type: "marine-map",
        props: {
          label: "REGIONAL COASTAL SNAPSHOT MAP",
          center: [17.5, 72.8],
          zoom: 7,
          markers: [
            { latlng: [17.5, 72.8], icon: "⚓", popup: "Konkan Marine Operational Quadrant (SST 28.3°C)" }
          ]
        },
        data: {
          label: "REGIONAL COASTAL SNAPSHOT MAP",
          center: [17.5, 72.8],
          zoom: 7,
          markers: [
            { latlng: [17.5, 72.8], icon: "⚓", popup: "Konkan Marine Operational Quadrant (SST 28.3°C)" }
          ]
        }
      }
    ]
  }
];

export function findMockResponse(queryText) {
  if (!MOCK_MODE || !queryText) return null;
  const q = queryText.toLowerCase().trim();

  for (const resp of MOCK_RESPONSES) {
    if (typeof resp.match === 'function' && resp.match(q)) {
      return resp;
    }
  }

  return null;
}
