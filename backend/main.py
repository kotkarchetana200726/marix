# ORCA Backend — Marine Intelligence API Server
# ==============================================================================
# Provides live endpoints for ORCA Bridge Console:
#   - POST /api/chat       (SSE stream: status -> result with UI components)
#   - GET  /api/pfz        (Live PFZ thermal front points)
#   - GET  /api/geofences  (MPA & restricted zone polygons & hazard perimeters)
#   - POST /api/orca/reason(Legacy Generative UI SSE stream)
#   - GET  /api/health     (System health & adapter status)
#   - Static files serving (Direct UI access at http://localhost:8000/)

import json
import asyncio
import os
from pathlib import Path
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(
    title="ORCA Marine Intelligence API",
    description="Autonomous Marine Intelligence & Bridge Console Backend",
    version="2.4.0"
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── MODELS ───────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: Optional[str] = None
    prompt: Optional[str] = None
    session_id: str = "default"
    lang: str = "en"

# ─── SSE FORMATTER ────────────────────────────────────────────────────────────
def sse_event(data: dict) -> str:
    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"

# ─── DATA FIXTURES (PFZ & GEOFENCES) ──────────────────────────────────────────
PFZ_DATA = [
    {
        "id": "pfz-01",
        "name": "Konkan Thermal Front Alpha (PRIMARY)",
        "lat": 17.42,
        "lng": 72.35,
        "confidence": "96%",
        "sstAnomaly": "-1.4°C",
        "chlorophyll": "3.4 mg/m³",
        "species": ["Indian Mackerel", "Sardinella longiceps", "Yellowfin Tuna"],
        "advisory": "Optimal window 0300Z–1100Z. Deploy purse seine along 65m isobath heading SW at 4 knots.",
        "distanceNm": "25.9",
        "depthM": 65,
        "fuelSavingsEst": "28%"
    },
    {
        "id": "pfz-02",
        "name": "Ratnagiri Pelagic Edge (SECONDARY)",
        "lat": 16.55,
        "lng": 72.85,
        "confidence": "91%",
        "sstAnomaly": "-0.9°C",
        "chlorophyll": "2.8 mg/m³",
        "species": ["Seer Fish (Surmai)", "Squid / Cephalopods", "Horse Mackerel"],
        "advisory": "Favorable current (0.6 kts SE). Strong thermal gradient at 50m isobath.",
        "distanceNm": "17.3",
        "depthM": 48,
        "fuelSavingsEst": "22%"
    }
]

GEOFENCE_DATA = [
    {
        "id": "geo-cyclone-core",
        "name": "Cyclone Varuna Gale Danger Core",
        "type": "hazard",
        "center": [20.8, 68.5],
        "radiusMeters": 180000,
        "colour": "#FF5C5C",
        "description": "52-knot sustained gale winds & 5.8m phenomenal swells. No vessel movement permitted."
    },
    {
        "id": "geo-malvan-mpa",
        "name": "Malvan Marine Sanctuary MPA",
        "type": "protected",
        "latlngs": [[16.02, 73.42], [16.08, 73.48], [16.04, 73.55], [15.98, 73.49]],
        "colour": "#6BCB77",
        "description": "Protected Coral & Ecosystem Reserve. Mechanized trawling strictly prohibited under Wildlife Act."
    },
    {
        "id": "geo-mumbai-high-naval",
        "name": "Mumbai High Offshore Exclusion Zone",
        "type": "restricted",
        "latlngs": [[19.2, 72.6], [19.5, 73.0], [19.0, 73.2], [18.8, 72.8]],
        "colour": "#FF5C5C",
        "description": "Restricted Petroleum & Naval Exercise Sector. Keep 5 nm clearance from oil platforms."
    }
]

# ─── GET /api/pfz ─────────────────────────────────────────────────────────────
@app.get("/api/pfz")
async def get_pfz():
    return PFZ_DATA

# ─── GET /api/geofences ────────────────────────────────────────────────────────
@app.get("/api/geofences")
async def get_geofences():
    return GEOFENCE_DATA

# ─── GET /api/health ──────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {
        "status": "OPERATIONAL",
        "agent_engine": "ORCA_REASONING_V2",
        "version": "2.4.0",
        "adapters": {
            "incois_pfz": "ONLINE (24ms)",
            "noaa_sst": "ONLINE (52ms)",
            "sentinel3_olci": "ONLINE (80ms)",
            "imd_radar": "ONLINE (45ms)",
            "ais_mesh": "ONLINE (18ms)"
        }
    }

# ─── POST /api/chat (SPRING BOOT CONTRACT SSE WITH MOCK SYSTEM) ────────────────
@app.post("/api/chat")
async def chat_sse(req: ChatRequest):
    query = req.message or req.prompt or ""
    
    async def event_generator():
        p = query.lower().strip()
        
        # Progressive Status Events
        yield sse_event({"type": "status", "message": "Connecting to INCOIS & IMD Doppler weather mesh..."})
        await asyncio.sleep(0.3)
        
        yield sse_event({"type": "status", "message": "Analyzing bathymetry & oceanic thermal gradients..."})
        await asyncio.sleep(0.3)
        
        yield sse_event({"type": "status", "message": "Synthesizing multimodal reasoning & UI components..."})
        await asyncio.sleep(0.3)

        # ── DEMO INTENT MATCHERS ──────────────────────────────────────────────

        # 1. MUMBAI FISHING CONDITIONS
        if ((("fish" in p or "pfz" in p) and "mumbai" in p) or 
            p in ["fishing conditions in mumbai", "is fishing good near mumbai", "mumbai fishing forecast"]):
            ui_json = {
                "title": "Mumbai Offshore Fishing Conditions Assessment",
                "components": [
                    {
                        "type": "pfz-card",
                        "data": {
                            "name": "Mumbai Offshore High-Yield Fishing Zone",
                            "latLonStr": "18°55'N, 72°45'E",
                            "sstAnomaly": "28.4°C (-0.8°C Anomaly)",
                            "chlorophyll": "1.82 mg/m³ (High Bloom)",
                            "confidence": "87%",
                            "targetSpecies": ["Pelagic Fishes", "Indian Mackerel", "Sardinella"],
                            "distanceNm": "24.5 nm (35–55 km)",
                            "depthM": 52,
                            "fuelSavingsEst": "28%",
                            "advisory": "Favorable fishing conditions expected 35–55 km off the Mumbai coast. Deploy gear along 50m isobath."
                        }
                    },
                    {
                        "type": "weather-card",
                        "data": {
                            "pressure": "1010.4 hPa",
                            "sst": "28.4°C",
                            "wind": "14 km/h WNW",
                            "swell": "1.2 m @ 9.5s",
                            "visibility": "8.5 nm (Good)"
                        }
                    },
                    {
                        "type": "evidence-panel",
                        "data": {
                            "title": "EVIDENCE TRACE & TELEMETRY SOURCES",
                            "entries": [
                                {"label": "INCOIS PFZ Feed", "value": "High-yield thermal front identified 35–55 km off Mumbai", "confidence": "87%", "source": "INCOIS Advisory"},
                                {"label": "NOAA SST Satellite", "value": "Sea Surface Temp: 28.4°C | Chlorophyll-a: 1.82 mg/m³", "confidence": "92%", "source": "NOAA Geo-Polar"},
                                {"label": "IMD Weather Mesh", "value": "Wind: 14 km/h WNW | Wave Height: 1.2 m", "confidence": "95%", "source": "IMD Radar"}
                            ],
                            "summary": "Favorable fishing conditions verified off Mumbai. DEMO NOTICE: Predefined mock data for demonstration.",
                            "modelVersion": "MARIX DEMO MODE"
                        }
                    }
                ]
            }
            text = "**Potential Fishing Zone: HIGH (87% Confidence)**\n\nFavorable fishing conditions expected **35–55 km off the Mumbai coast**. Thermal gradient analysis confirms plankton aggregation along 50m contour.\n\n- **SST**: 28.4°C\n- **Chlorophyll-a**: 1.82 mg/m³\n- **Wave Height**: 1.2 m\n- **Wind Speed**: 14 km/h WNW\n- **Recommendation**: Favorable fishing conditions expected 35–55 km off the Mumbai coast."

        # 2. MUMBAI CYCLONE RISK
        elif (("cyclone" in p or "storm" in p or "threat" in p) and "mumbai" in p):
            ui_json = {
                "title": "Mumbai Regional Cyclone & Sea State Risk Assessment",
                "components": [
                    {
                        "type": "risk-card",
                        "data": {
                            "score": 48,
                            "riskScore": 48,
                            "status": "MODERATE RISK",
                            "zone": "MUMBAI COASTAL & OFFSHORE SECTOR",
                            "title": "Cyclone & Sea Hazard Advisory — Mumbai Coast",
                            "description": "No active cyclone directly affecting Mumbai. Elevated wave activity (2.1–2.8 m) and wind gusts expected over next 24 hours.",
                            "coordinates": "18.98°N, 72.82°E",
                            "swell": "2.1–2.8 m Moderate-Rough",
                            "wind": "28–35 km/h WSW"
                        }
                    },
                    {
                        "type": "weather-card",
                        "data": {
                            "pressure": "1005.8 hPa",
                            "sst": "28.1°C",
                            "wind": "28–35 km/h WSW",
                            "swell": "2.1–2.8 m @ 11.2s",
                            "visibility": "5.2 nm (Moderate Squall)"
                        }
                    },
                    {
                        "type": "recommendation-card",
                        "data": {
                            "priority": "ADVISORY",
                            "heading": "Small Craft Safety Directive",
                            "text": "Small fishing vessels (< 15m LOA) should avoid deep offshore transit over the next 24 hours. Maintain VHF Channel 16 guard.",
                            "safeHarbor": "Sassoon Dock / Mumbai Harbour",
                            "vhf": "VHF CH 16 / 08"
                        }
                    },
                    {
                        "type": "evidence-panel",
                        "data": {
                            "title": "CYCLONE RISK REASONING TRACE",
                            "entries": [
                                {"label": "IMD Radar", "value": "No cyclone core directly affecting Mumbai. Trough active.", "confidence": "94%", "source": "IMD Radar"},
                                {"label": "INCOIS Buoy", "value": "Wave height 2.1–2.8 m over next 24h", "confidence": "91%", "source": "INCOIS"}
                            ],
                            "summary": "Moderate risk confirmed. DEMO NOTICE: Simulated demonstration advisory.",
                            "modelVersion": "MARIX DEMO MODE"
                        }
                    }
                ]
            }
            text = "**Cyclone Risk Level: MODERATE (Score: 48/100)**\n\nThere is **no active cyclone directly affecting Mumbai**. However, **elevated wave activity (2.1–2.8 m)** and winds of **28–35 km/h** are expected over the next 24 hours.\n\n- **Sea State**: Moderate to Rough\n- **Wave Height**: 2.1–2.8 m\n- **Wind Speed**: 28–35 km/h\n- **Recommendation**: Small fishing vessels advised to exercise caution."

        # 3. MUMBAI SEA CONDITION
        elif (("sea condition" in p or "sea state" in p or "waves" in p) and "mumbai" in p):
            ui_json = {
                "title": "Mumbai Coastal Sea State & Navigational Condition",
                "components": [
                    {
                        "type": "weather-card",
                        "data": {
                            "pressure": "1009.2 hPa",
                            "sst": "28.2°C",
                            "wind": "18 km/h NW",
                            "swell": "1.8 m @ 10.1s",
                            "visibility": "Good (7.8 nm)"
                        }
                    },
                    {
                        "type": "risk-card",
                        "data": {
                            "score": 28,
                            "riskScore": 28,
                            "status": "NOMINAL",
                            "zone": "MUMBAI COASTAL SECTOR",
                            "title": "Mumbai Coastal Sea Condition Overview",
                            "description": "Moderate sea state with 1.8m wave swell and 18 km/h winds. Navigational conditions generally stable.",
                            "coordinates": "18.96°N, 72.80°E",
                            "swell": "1.8 m Moderate",
                            "wind": "18 km/h NW"
                        }
                    },
                    {
                        "type": "evidence-panel",
                        "data": {
                            "title": "SEA STATE TELEMETRY EVIDENCE",
                            "entries": [
                                {"label": "Buoy Wave Telemetry", "value": "1.8 m wave swell, period 10.1s (Moderate)", "confidence": "96%", "source": "INCOIS Buoy"},
                                {"label": "Coastal Anemometer", "value": "Wind 18 km/h NW, clear visibility 7.8 nm", "confidence": "98%", "source": "Mumbai Port"}
                            ],
                            "summary": "Sea conditions nominal. DEMO NOTICE: Simulated demonstration telemetry.",
                            "modelVersion": "MARIX DEMO MODE"
                        }
                    }
                ]
            }
            text = "**Sea State: Moderate (Overall Risk: LOW–MODERATE)**\n\nCurrent sea conditions near Mumbai are **moderate and safe for normal vessel operations**.\n\n- **Sea State**: Moderate\n- **Wave Height**: 1.8 m\n- **Wind Speed**: 18 km/h\n- **Visibility**: Good (7.8 nm)\n- **Overall Risk**: LOW–MODERATE (28/100)\n- **Recommendation**: Normal coastal navigation and fishing permitted."

        # 4. POTENTIAL FISHING ZONES LIST
        elif (("where" in p or "find" in p or "list" in p or "show" in p) and ("pfz" in p or "fishing zone" in p)):
            ui_json = {
                "title": "Regional Potential Fishing Zones (PFZ) Directory",
                "components": [
                    {
                        "type": "pfz-card",
                        "data": {
                            "name": "1. Mumbai Offshore PFZ (Sector Alpha)",
                            "latLonStr": "18°52'N, 72°38'E",
                            "sstAnomaly": "-1.1°C Upwelling Front",
                            "chlorophyll": "1.82 mg/m³",
                            "confidence": "87%",
                            "targetSpecies": ["Indian Mackerel", "Sardinella longiceps"],
                            "distanceNm": "21.6 nm (40 km)",
                            "depthM": 54,
                            "fuelSavingsEst": "25%",
                            "advisory": "Primary front active along 50m bathymetric contour."
                        }
                    },
                    {
                        "type": "pfz-card",
                        "data": {
                            "name": "2. Ratnagiri Offshore PFZ (Front Beta)",
                            "latLonStr": "16°58'N, 72°42'E",
                            "sstAnomaly": "-1.4°C Strong Upwelling",
                            "chlorophyll": "2.95 mg/m³",
                            "confidence": "92%",
                            "targetSpecies": ["Kingfish (Surmai)", "Seer Fish", "Squid"],
                            "distanceNm": "15.1 nm (28 km)",
                            "depthM": 48,
                            "fuelSavingsEst": "32%",
                            "advisory": "Strong thermal gradient. Deploy purse seine along edge."
                        }
                    },
                    {
                        "type": "pfz-card",
                        "data": {
                            "name": "3. Goa Coastal PFZ (Front Gamma)",
                            "latLonStr": "15°24'N, 73°35'E",
                            "sstAnomaly": "-1.2°C Upwelling",
                            "chlorophyll": "2.40 mg/m³",
                            "confidence": "89%",
                            "targetSpecies": ["Yellowfin Tuna", "Anchovies"],
                            "distanceNm": "9.7 nm (18 km)",
                            "depthM": 36,
                            "fuelSavingsEst": "29%",
                            "advisory": "Favorable coastal current convergence."
                        }
                    },
                    {
                        "type": "evidence-panel",
                        "data": {
                            "title": "PFZ SATELLITE EVIDENCE & DISCLAIMER",
                            "entries": [
                                {"label": "Copernicus Sentinel-3", "value": "Chlorophyll-a optical imagery pass complete", "confidence": "93%", "source": "ESA"},
                                {"label": "NOAA Geo-Polar SST", "value": "Thermal gradient anomaly mapping active", "confidence": "90%", "source": "NOAA"}
                            ],
                            "summary": "DEMO NOTICE: All PFZ locations listed above represent mock demonstration data for hackathon presentation.",
                            "modelVersion": "MARIX DEMO MODE"
                        }
                    }
                ]
            }
            text = "**Active Potential Fishing Zones (PFZ) Directory**\n\n1. **Mumbai Offshore PFZ**: `18°52'N, 72°38'E` (87% confidence)\n2. **Ratnagiri Offshore PFZ**: `16°58'N, 72°42'E` (92% confidence)\n3. **Goa Coastal PFZ**: `15°24'N, 73°35'E` (89% confidence)\n\n*DEMO NOTICE: Coordinates and advisories represent MOCK DEMO DATA.*"

        # 5. MARINE SNAPSHOT
        elif ("snapshot" in p or "marine summary" in p or "daily status" in p or "marine overview" in p):
            ui_json = {
                "title": "Daily Marine Intelligence Snapshot & Status Report",
                "components": [
                    {
                        "type": "weather-card",
                        "data": {
                            "pressure": "1009.4 hPa",
                            "sst": "28.3°C",
                            "wind": "16 km/h WNW",
                            "swell": "1.5 m @ 10.4s",
                            "visibility": "8.0 nm (Clear)"
                        }
                    },
                    {
                        "type": "risk-card",
                        "data": {
                            "score": 34,
                            "riskScore": 34,
                            "status": "NOMINAL",
                            "zone": "ARABIAN SEA / KONKAN QUADRANT",
                            "title": "Regional Marine Risk Index — Snapshot",
                            "description": "Low-to-moderate hazard index (34/100). No active storm core within 250 NM. Safe transit across coastal corridors.",
                            "coordinates": "17.5°N, 72.8°E",
                            "swell": "1.5 m Moderate",
                            "wind": "16 km/h WNW"
                        }
                    },
                    {
                        "type": "pfz-card",
                        "data": {
                            "name": "Regional Fishing Potential Summary",
                            "latLonStr": "17°40'N, 72°30'E",
                            "sstAnomaly": "-1.2°C Upwelling Anomaly",
                            "chlorophyll": "2.15 mg/m³",
                            "confidence": "88%",
                            "targetSpecies": ["Indian Mackerel", "Sardinella", "Squid"],
                            "distanceNm": "18.5 nm",
                            "depthM": 45,
                            "fuelSavingsEst": "30%",
                            "advisory": "Optimal fishing conditions along 50m bathymetric contour."
                        }
                    },
                    {
                        "type": "evidence-panel",
                        "data": {
                            "title": "MARINE SNAPSHOT DATA AGGREGATION",
                            "entries": [
                                {"label": "INCOIS PFZ Adapter", "value": "88% Yield probability on Konkan shelf", "confidence": "88%", "source": "INCOIS"},
                                {"label": "NOAA SST Adapter", "value": "SST 28.3°C, Chlorophyll-a 2.15 mg/m³", "confidence": "94%", "source": "NOAA"},
                                {"label": "IMD Weather Mesh", "value": "Wind 16 km/h WNW, Wave height 1.5 m", "confidence": "96%", "source": "IMD Radar"}
                            ],
                            "summary": "Overall marine status operational. DEMO NOTICE: Predefined mock data for demonstration purposes.",
                            "modelVersion": "MARIX DEMO MODE"
                        }
                    }
                ]
            }
            text = "**MARIX Daily Marine Snapshot & Operational Status**\n\nOverall Marine Status: **OPERATIONAL / NOMINAL**\n\n- **SST**: 28.3°C\n- **Chlorophyll-a**: 2.15 mg/m³\n- **Wind Speed**: 16 km/h WNW\n- **Wave Height**: 1.5 m\n- **Weather Risk**: 34/100 (LOW–MODERATE)\n- **Fishing Potential**: HIGH (88%)\n- **Overall Status**: OPERATIONAL / SYS NOMINAL"

        # DEFAULT FALLBACK FOR UNMATCHED QUERIES (Preserves existing API behaviour)
        else:
            ui_json = {
                "title": f"ORCA Intelligence Directive — {query[:30]}",
                "components": [
                    {
                        "type": "weather-card",
                        "data": {
                            "pressure": "1009.6 hPa",
                            "sst": "28.1°C",
                            "wind": "18 kts WNW",
                            "swell": "1.6m Moderate",
                            "visibility": "7.2 nm"
                        }
                    },
                    {
                        "type": "evidence-panel",
                        "data": {
                            "title": "REASONING INFERENCE TRACE",
                            "entries": [
                                {"label": "Telemetry Query", "value": query, "confidence": "95%", "source": "User Query"}
                            ],
                            "summary": "Standard reasoning pipeline executed.",
                            "modelVersion": "MARIX LIVE REASONING v2.4"
                        }
                    }
                ]
            }
            text = f"**MARIX Marine Intelligence Response** for *\"{query}\"*\n\nAll data adapters synchronized. Regional weather and oceanographic telemetry active across coastal sector."

        yield sse_event({"type": "result", "ui_json": ui_json, "text": text})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

# ─── POST /api/orca/reason (LEGACY SIMULATED BRIDGE FORMAT) ───────────────────
@app.post("/api/orca/reason")
async def reason_legacy(request: ChatRequest):
    async def legacy_stream():
        yield sse_event({"type": "STEP", "step": "Querying INCOIS & IMD Doppler weather mesh...", "stepIndex": 0})
        await asyncio.sleep(0.3)
        yield sse_event({"type": "STEP", "step": "Computing oceanographic risk coefficient...", "stepIndex": 1})
        await asyncio.sleep(0.3)
        yield sse_event({"type": "PROSE_DELTA", "text": "**ORCA reasoning pipeline complete.** Telemetry synchronized."})
        await asyncio.sleep(0.2)
        yield sse_event({"type": "COMPONENT", "componentType": "RiskCard", "props": {"riskScore": 32, "status": "NOMINAL", "zoneName": "LOCAL SECTOR", "title": "Marine Zone Nominal", "description": "Conditions normal."}})
        await asyncio.sleep(0.2)
        yield sse_event({"type": "COMPLETE", "prose": "ORCA analysis complete."})

    return StreamingResponse(
        legacy_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

# ─── STATIC FILES (SERVE FRONTEND ROOT DIRECTORY) ─────────────────────────────
root_dir = Path(__file__).resolve().parent.parent

if (root_dir / "index.html").exists():
    @app.get("/")
    async def serve_index():
        return FileResponse(root_dir / "index.html")

    if (root_dir / "css").exists():
        app.mount("/css", StaticFiles(directory=str(root_dir / "css")), name="css")
    if (root_dir / "js").exists():
        app.mount("/js", StaticFiles(directory=str(root_dir / "js")), name="js")

# ─── RUN SERVER ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
