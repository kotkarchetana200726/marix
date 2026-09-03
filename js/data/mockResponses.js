// MARIX Marine AI — Centralized Mock Data & Response System
// High-fidelity deterministic responses for hackathon demonstration

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
      "Synthesizing high-yield fishing recommendation..."
    ],
    prose: "**Potential Fishing Zone: HIGH (87% Confidence)**\n\nFavorable fishing conditions expected **35–55 km off the Mumbai coast**. Oceanographic telemetry confirms active thermal front boundaries and high plankton accumulation along the 50m bathymetric contour.\n\n- **Sea Surface Temperature**: 28.4°C\n- **Chlorophyll-a**: 1.82 mg/m³\n- **Wave Height**: 1.2 m (Slight Swell)\n- **Wind Speed**: 14 km/h WNW\n- **Recommendation**: Favorable fishing conditions expected 35–55 km off the Mumbai coast. Target pelagic species in photic zone using purse seine nets.\n\n*Data Sources: INCOIS PFZ Advisories, NOAA SST Blended Satellites, IMD Marine Weather.*",
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
      "Generating small craft navigational advisory..."
    ],
    prose: "**Cyclone Risk Level: MODERATE (Score: 48/100)**\n\nThere is **no active cyclone directly affecting Mumbai** at present. However, **elevated wave activity (2.1–2.8 m)** and sustained winds of **28–35 km/h** are expected over the next 24 hours due to a peripheral swell system.\n\n- **Sea State**: Moderate to Rough\n- **Wave Height**: 2.1–2.8 m\n- **Wind Speed**: 28–35 km/h (WSW Gusts to 42 km/h)\n- **Recommendation**: Small fishing vessels are advised to exercise caution and avoid deep offshore waters (> 30 nm) over the next 24 hours.\n\n*DISCLAIMER: Simulated demonstration advisory. Verify with official Coast Guard / IMD weather bulletins.*",
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
          score: 48,
          riskScore: 48,
          status: "MODERATE RISK",
          zone: "MUMBAI COASTAL & OFFSHORE SECTOR",
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
        type: "recommendation-card",
        props: {
          priority: "ADVISORY",
          heading: "Small Craft Safety Directive",
          text: "Small fishing vessels (< 15m LOA) should avoid deep offshore transit over the next 24 hours. Maintain VHF Channel 16 guard.",
          safeHarbor: "Sassoon Dock / Mumbai Harbour",
          vhf: "VHF CH 16 / 08"
        },
        data: {
          priority: "ADVISORY",
          heading: "Small Craft Safety Directive",
          text: "Small fishing vessels (< 15m LOA) should avoid deep offshore transit over the next 24 hours. Maintain VHF Channel 16 guard.",
          safeHarbor: "Sassoon Dock / Mumbai Harbour",
          vhf: "VHF CH 16 / 08"
        }
      },
      {
        type: "evidence-panel",
        props: {
          title: "CYCLONE RISK REASONING TRACE",
          entries: [
            { label: "IMD Doppler Radar", value: "No cyclone core within 300 km of Mumbai. Peripheral trough active.", confidence: "94%", source: "IMD Weather Radar" },
            { label: "INCOIS Wave Buoy 2304", value: "Swell period 11.2s, wave heights 2.1–2.8 m", confidence: "91%", source: "INCOIS Buoy" }
          ],
          summary: "Moderate risk level confirmed. DEMO NOTICE: Predefined mock telemetry for demonstration.",
          modelVersion: "MARIX DEMO MODE"
        },
        data: {
          title: "CYCLONE RISK REASONING TRACE",
          entries: [
            { label: "IMD Doppler Radar", value: "No cyclone core within 300 km of Mumbai. Peripheral trough active.", confidence: "94%", source: "IMD Weather Radar" },
            { label: "INCOIS Wave Buoy 2304", value: "Swell period 11.2s, wave heights 2.1–2.8 m", confidence: "91%", source: "INCOIS Buoy" }
          ],
          summary: "Moderate risk level confirmed. DEMO NOTICE: Predefined mock telemetry for demonstration.",
          modelVersion: "MARIX DEMO MODE"
        }
      }
    ]
  },

  // ── 3. MUMBAI SEA CONDITION ───────────────────────────────────────────────
  {
    id: "SEA_CONDITION_MUMBAI",
    title: "Mumbai Coastal Sea State & Navigational Condition",
    keywords: ["sea", "condition", "mumbai"],
    match: function(query) {
      const q = query.toLowerCase().trim();
      if ((q.includes("sea condition") || q.includes("sea state") || q.includes("waves")) && q.includes("mumbai")) return true;
      if (q === "what is the sea condition near mumbai" || q === "sea state near mumbai" || q === "mumbai sea status today") return true;
      return false;
    },
    steps: [
      "Polling oceanographic buoy telemetries off Mumbai harbour...",
      "Analyzing wave spectrum, surface wind speed & photic visibility...",
      "Synthesizing sea condition report..."
    ],
    prose: "**Sea State: Moderate (Overall Risk: LOW–MODERATE)**\n\nCurrent sea conditions near Mumbai are **moderate and safe for normal vessel operations**.\n\n- **Sea State**: Moderate\n- **Wave Height**: 1.8 m\n- **Wind Speed**: 18 km/h (NW)\n- **Visibility**: Good (7.8 nm)\n- **Overall Risk**: LOW–MODERATE (Score: 28/100)\n- **Recommendation**: Normal coastal navigation and fishing operations permitted. Exercise standard lookout.\n\n*DEMO DISCLAIMER: Deterministic mock demonstration dataset.*",
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
          score: 28,
          riskScore: 28,
          status: "NOMINAL",
          zone: "MUMBAI COASTAL SECTOR",
          title: "Mumbai Coastal Sea Condition Overview",
          description: "Moderate sea state with 1.8m wave swell and 18 km/h winds. Navigational conditions generally stable.",
          coordinates: "18.96°N, 72.80°E",
          swell: "1.8 m Moderate",
          wind: "18 km/h NW"
        }
      },
      {
        type: "evidence-panel",
        props: {
          title: "SEA STATE TELEMETRY EVIDENCE",
          entries: [
            { label: "Buoy Wave Telemetry", value: "1.8 m wave swell, period 10.1s (Moderate)", confidence: "96%", source: "INCOIS Buoy" },
            { label: "Coastal Anemometer", value: "Wind 18 km/h NW, clear visibility 7.8 nm", confidence: "98%", source: "Mumbai Port Trust" }
          ],
          summary: "Sea conditions nominal. DEMO NOTICE: Predefined mock telemetry for demonstration.",
          modelVersion: "MARIX DEMO MODE"
        },
        data: {
          title: "SEA STATE TELEMETRY EVIDENCE",
          entries: [
            { label: "Buoy Wave Telemetry", value: "1.8 m wave swell, period 10.1s (Moderate)", confidence: "96%", source: "INCOIS Buoy" },
            { label: "Coastal Anemometer", value: "Wind 18 km/h NW, clear visibility 7.8 nm", confidence: "98%", source: "Mumbai Port Trust" }
          ],
          summary: "Sea conditions nominal. DEMO NOTICE: Predefined mock telemetry for demonstration.",
          modelVersion: "MARIX DEMO MODE"
        }
      }
    ]
  },

  // ── 4. POTENTIAL FISHING ZONES (PFZ LIST) ─────────────────────────────────
  {
    id: "POTENTIAL_FISHING_ZONES",
    title: "Regional Potential Fishing Zones (PFZ) Directory",
    keywords: ["potential fishing zones", "pfz", "where are"],
    match: function(query) {
      const q = query.toLowerCase().trim();
      if ((q.includes("where") || q.includes("find") || q.includes("list") || q.includes("show")) && (q.includes("pfz") || q.includes("fishing zone"))) return true;
      if (q === "where are the potential fishing zones" || q === "where are pfz zones located" || q === "potential fishing zones") return true;
      return false;
    },
    steps: [
      "Scanning Copernicus Sentinel-3 OLCI & NOAA Geo-Polar SST datasets...",
      "Isolating high-density chlorophyll-a thermal front convergence zones...",
      "Mapping regional PFZ targets for Mumbai, Ratnagiri, and Goa coasts...",
      "Generating confidence ratings & coordinate advisories..."
    ],
    prose: "**Active Potential Fishing Zones (PFZ) Identification**\n\nMARIX has identified **3 high-yielding Potential Fishing Zones** along the West Coast of India based on thermal front upwelling and chlorophyll-a concentrations:\n\n1. **Mumbai Offshore PFZ Sector Alpha**\n   - Coordinates: `18°52'N, 72°38'E` (40 km offshore)\n   - Confidence: **87%** | Target: Indian Mackerel, Sardinella\n2. **Ratnagiri Offshore PFZ Front Beta**\n   - Coordinates: `16°58'N, 72°42'E` (28 km offshore)\n   - Confidence: **92%** | Target: Kingfish (Surmai), Seer Fish, Squid\n3. **Goa Coastal Upwelling Front Gamma**\n   - Coordinates: `15°24'N, 73°35'E` (18 km offshore)\n   - Confidence: **89%** | Target: Yellowfin Tuna, Anchovies\n\n*DEMO NOTICE: These coordinates and advisories represent MOCK DEMO DATA created for hackathon demonstration.*",
    components: [
      {
        type: "pfz-card",
        props: {
          name: "1. Mumbai Offshore PFZ (Sector Alpha)",
          latLonStr: "18°52'N, 72°38'E",
          sstAnomaly: "-1.1°C Upwelling Front",
          chlorophyll: "1.82 mg/m³",
          confidence: "87%",
          targetSpecies: ["Indian Mackerel", "Sardinella longiceps"],
          distanceNm: "21.6 nm (40 km)",
          depthM: 54,
          fuelSavingsEst: "25%",
          advisory: "Primary front active along 50m bathymetric contour. Favorable window 0400Z–1200Z."
        },
        data: {
          name: "1. Mumbai Offshore PFZ (Sector Alpha)",
          latLonStr: "18°52'N, 72°38'E",
          sstAnomaly: "-1.1°C Upwelling Front",
          chlorophyll: "1.82 mg/m³",
          confidence: "87%",
          targetSpecies: ["Indian Mackerel", "Sardinella longiceps"],
          distanceNm: "21.6 nm (40 km)",
          depthM: 54,
          fuelSavingsEst: "25%",
          advisory: "Primary front active along 50m bathymetric contour. Favorable window 0400Z–1200Z."
        }
      },
      {
        type: "pfz-card",
        props: {
          name: "2. Ratnagiri Offshore PFZ (Front Beta)",
          latLonStr: "16°58'N, 72°42'E",
          sstAnomaly: "-1.4°C Strong Upwelling",
          chlorophyll: "2.95 mg/m³ (Peak Bloom)",
          confidence: "92%",
          targetSpecies: ["Kingfish (Surmai)", "Seer Fish", "Squid"],
          distanceNm: "15.1 nm (28 km)",
          depthM: 48,
          fuelSavingsEst: "32%",
          advisory: "Strong thermal gradient. Deploy purse seine along thermal edge."
        },
        data: {
          name: "2. Ratnagiri Offshore PFZ (Front Beta)",
          latLonStr: "16°58'N, 72°42'E",
          sstAnomaly: "-1.4°C Strong Upwelling",
          chlorophyll: "2.95 mg/m³ (Peak Bloom)",
          confidence: "92%",
          targetSpecies: ["Kingfish (Surmai)", "Seer Fish", "Squid"],
          distanceNm: "15.1 nm (28 km)",
          depthM: 48,
          fuelSavingsEst: "32%",
          advisory: "Strong thermal gradient. Deploy purse seine along thermal edge."
        }
      },
      {
        type: "pfz-card",
        props: {
          name: "3. Goa Coastal PFZ (Front Gamma)",
          latLonStr: "15°24'N, 73°35'E",
          sstAnomaly: "-1.2°C Upwelling",
          chlorophyll: "2.40 mg/m³",
          confidence: "89%",
          targetSpecies: ["Yellowfin Tuna", "Anchovies"],
          distanceNm: "9.7 nm (18 km)",
          depthM: 36,
          fuelSavingsEst: "29%",
          advisory: "Favorable coastal current convergence."
        },
        data: {
          name: "3. Goa Coastal PFZ (Front Gamma)",
          latLonStr: "15°24'N, 73°35'E",
          sstAnomaly: "-1.2°C Upwelling",
          chlorophyll: "2.40 mg/m³",
          confidence: "89%",
          targetSpecies: ["Yellowfin Tuna", "Anchovies"],
          distanceNm: "9.7 nm (18 km)",
          depthM: 36,
          fuelSavingsEst: "29%",
          advisory: "Favorable coastal current convergence."
        }
      },
      {
        type: "evidence-panel",
        props: {
          title: "PFZ SATELLITE EVIDENCE & DISCLAIMER",
          entries: [
            { label: "Copernicus Sentinel-3", value: "Chlorophyll-a optical imagery pass complete", confidence: "93%", source: "ESA Copernicus" },
            { label: "NOAA Geo-Polar SST", value: "Thermal gradient anomaly mapping active", confidence: "90%", source: "NOAA Geo-Polar" }
          ],
          summary: "DEMO NOTICE: All PFZ locations listed above are mock demonstration datasets for hackathon presentation.",
          modelVersion: "MARIX DEMO MODE"
        },
        data: {
          title: "PFZ SATELLITE EVIDENCE & DISCLAIMER",
          entries: [
            { label: "Copernicus Sentinel-3", value: "Chlorophyll-a optical imagery pass complete", confidence: "93%", source: "ESA Copernicus" },
            { label: "NOAA Geo-Polar SST", value: "Thermal gradient anomaly mapping active", confidence: "90%", source: "NOAA Geo-Polar" }
          ],
          summary: "DEMO NOTICE: All PFZ locations listed above are mock demonstration datasets for hackathon presentation.",
          modelVersion: "MARIX DEMO MODE"
        }
      }
    ]
  },

  // ── 5. TODAY'S MARINE SNAPSHOT ────────────────────────────────────────────
  {
    id: "MARINE_SNAPSHOT",
    title: "Daily Marine Intelligence Snapshot & Status Report",
    keywords: ["snapshot", "marine snapshot", "today's marine"],
    match: function(query) {
      const q = query.toLowerCase().trim();
      if (q.includes("snapshot") || q.includes("marine summary") || q.includes("daily status") || q.includes("marine overview")) return true;
      if (q === "give me today's marine snapshot" || q === "today's marine snapshot" || q === "marine snapshot") return true;
      return false;
    },
    steps: [
      "Polling all 6 oceanographic data adapters (INCOIS, NOAA, Sentinel-3, IMD, AIS mesh)...",
      "Aggregating regional SST, chlorophyll, wind, swell & hazard indices...",
      "Generating MARIX Daily Marine Dashboard Snapshot..."
    ],
    prose: "**MARIX Daily Marine Snapshot & Operational Status**\n\nOverall Marine Status: **OPERATIONAL / NOMINAL**\nRegional oceanographic conditions across the Konkan & Arabian Sea quadrant are stable with high biological productivity.\n\n### Ocean Telemetry Highlights:\n- **Sea Surface Temperature (SST)**: 28.3°C (-1.2°C Upwelling Anomaly)\n- **Chlorophyll-a Concentration**: 2.15 mg/m³ (High Bloom)\n- **Surface Wind Velocity**: 16 km/h (WNW)\n- **Significant Wave Height**: 1.5 m (Moderate Swell)\n- **Weather Risk Index**: 34/100 (LOW–MODERATE)\n- **Fishing Potential**: HIGH (88% Confidence)\n- **Overall Status**: SYS NOMINAL — All operational corridors open.\n\n*DEMO DISCLAIMER: Deterministic mock snapshot prepared for hackathon demonstration.*",
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
          score: 34,
          riskScore: 34,
          status: "NOMINAL",
          zone: "ARABIAN SEA / KONKAN QUADRANT",
          title: "Regional Marine Risk Index — Snapshot",
          description: "Low-to-moderate hazard index (34/100). No active storm core within 250 NM. Safe transit across coastal corridors.",
          coordinates: "17.5°N, 72.8°E",
          swell: "1.5 m Moderate",
          wind: "16 km/h WNW"
        }
      },
      {
        type: "pfz-card",
        props: {
          name: "Regional Fishing Potential Summary",
          latLonStr: "17°40'N, 72°30'E",
          sstAnomaly: "-1.2°C Upwelling Anomaly",
          chlorophyll: "2.15 mg/m³",
          confidence: "88%",
          targetSpecies: ["Indian Mackerel", "Sardinella", "Squid"],
          distanceNm: "18.5 nm",
          depthM: 45,
          fuelSavingsEst: "30%",
          advisory: "Optimal fishing conditions along 50m bathymetric contour."
        },
        data: {
          name: "Regional Fishing Potential Summary",
          latLonStr: "17°40'N, 72°30'E",
          sstAnomaly: "-1.2°C Upwelling Anomaly",
          chlorophyll: "2.15 mg/m³",
          confidence: "88%",
          targetSpecies: ["Indian Mackerel", "Sardinella", "Squid"],
          distanceNm: "18.5 nm",
          depthM: 45,
          fuelSavingsEst: "30%",
          advisory: "Optimal fishing conditions along 50m bathymetric contour."
        }
      },
      {
        type: "evidence-panel",
        props: {
          title: "MARINE SNAPSHOT DATA AGGREGATION",
          entries: [
            { label: "INCOIS PFZ Adapter", value: "88% Yield probability on Konkan shelf", confidence: "88%", source: "INCOIS" },
            { label: "NOAA SST Adapter", value: "SST 28.3°C, Chlorophyll-a 2.15 mg/m³", confidence: "94%", source: "NOAA" },
            { label: "IMD Weather Mesh", value: "Wind 16 km/h WNW, Wave height 1.5 m", confidence: "96%", source: "IMD Radar" }
          ],
          summary: "Overall marine status operational. DEMO NOTICE: Predefined mock data for demonstration purposes.",
          modelVersion: "MARIX DEMO MODE"
        },
        data: {
          title: "MARINE SNAPSHOT DATA AGGREGATION",
          entries: [
            { label: "INCOIS PFZ Adapter", value: "88% Yield probability on Konkan shelf", confidence: "88%", source: "INCOIS" },
            { label: "NOAA SST Adapter", value: "SST 28.3°C, Chlorophyll-a 2.15 mg/m³", confidence: "94%", source: "NOAA" },
            { label: "IMD Weather Mesh", value: "Wind 16 km/h WNW, Wave height 1.5 m", confidence: "96%", source: "IMD Radar" }
          ],
          summary: "Overall marine status operational. DEMO NOTICE: Predefined mock data for demonstration purposes.",
          modelVersion: "MARIX DEMO MODE"
        }
      }
    ]
  }
];

/**
 * Match a user query string against the centralized mock dataset.
 * Normalizes input (lowercase, trimmed) and uses keyword/intent rules.
 * 
 * @param {string} userQuery 
 * @returns {object|null} The matched mock response object, or null if no match found.
 */
export function findMockResponse(userQuery) {
  if (!MOCK_MODE || !userQuery || typeof userQuery !== 'string') return null;

  const normalized = userQuery.toLowerCase().trim();
  if (!normalized) return null;

  for (const resp of MOCK_RESPONSES) {
    if (typeof resp.match === 'function' && resp.match(normalized)) {
      console.log(`[MARIX Mock System] Query "${userQuery}" matched mock intent "${resp.id}"`);
      return resp;
    }
  }

  return null;
}
