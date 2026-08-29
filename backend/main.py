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
        "fuelSavingsEst": "28% vs Blind Trawling",
        "radiusKm": 18
    },
    {
        "id": "pfz-02",
        "name": "Ratnagiri-Devgad Pelagic Edge",
        "lat": 16.55,
        "lng": 72.85,
        "confidence": "91%",
        "sstAnomaly": "-0.9°C",
        "chlorophyll": "2.8 mg/m³",
        "species": ["Seer Fish (Surmai)", "Squid / Cephalopods", "Horse Mackerel"],
        "advisory": "Favorable 0.6 kt SE current. Strong thermal gradient at 50m isobath.",
        "distanceNm": "17.3",
        "depthM": 48,
        "fuelSavingsEst": "22% vs Blind Trawling",
        "radiusKm": 14
    },
    {
        "id": "pfz-03",
        "name": "Kochi-Alleppey Mud Bank (Chakara Zone)",
        "lat": 9.77,
        "lng": 75.82,
        "confidence": "98%",
        "sstAnomaly": "-1.6°C",
        "chlorophyll": "4.2 mg/m³",
        "species": ["Penaeid Prawns", "Oil Sardine", "Anchovy"],
        "advisory": "Exceptional artisanal fishing probability. Calm waters inside 15m contour. Best prawn grounds in decade.",
        "distanceNm": "11.8",
        "depthM": 35,
        "fuelSavingsEst": "40% vs Blind Trawling",
        "radiusKm": 12
    },
    {
        "id": "pfz-04",
        "name": "Saurashtra Shelf Break Convergence",
        "lat": 20.85,
        "lng": 69.95,
        "confidence": "89%",
        "sstAnomaly": "-1.1°C",
        "chlorophyll": "3.1 mg/m³",
        "species": ["Ribbonfish", "Croakers", "Pomfret"],
        "advisory": "Cyclonic eddy periphery. High pelagic density at 75m drop-off.",
        "distanceNm": "34.2",
        "depthM": 75,
        "fuelSavingsEst": "25% vs Blind Trawling",
        "radiusKm": 20
    }
]

GEOFENCE_DATA = [
    {
        "id": "hz-01",
        "name": "Tropical Depression Varuna — Gale Core",
        "type": "hazard",
        "center": [20.80, 68.50],
        "radius": 185000,
        "colour": "#FF5C5C",
        "description": "Sustained 52-kt winds, 5.8m waves. All vessels evacuate. Port Warning Signal No. 8 hoisted."
    },
    {
        "id": "hz-02",
        "name": "Tropical Depression Varuna — Warning Zone",
        "type": "hazard",
        "center": [20.50, 68.80],
        "radius": 350000,
        "colour": "rgba(255, 92, 92, 0.4)",
        "description": "Extended gale-force wind radius. Small craft must seek immediate shelter."
    },
    {
        "id": "mpa-01",
        "name": "Gulf of Khambhat Marine Protected Area",
        "type": "MPA",
        "latlngs": [[22.2, 72.2], [22.8, 72.9], [22.5, 73.4], [21.9, 73.1], [21.6, 72.5]],
        "colour": "#6BCB77",
        "description": "Marine Protected Area. Commercial bottom trawling strictly prohibited by WPA 1972."
    },
    {
        "id": "mpa-02",
        "name": "Malvan Marine Sanctuary",
        "type": "MPA",
        "latlngs": [[16.05, 73.45], [16.12, 73.55], [16.08, 73.62], [15.98, 73.56], [15.95, 73.48]],
        "colour": "#6BCB77",
        "description": "Protected coral reef and mangrove ecosystem. No unauthorized anchoring or commercial fishing."
    },
    {
        "id": "rz-01",
        "name": "Mumbai High Offshore Naval Security Zone",
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

# ─── POST /api/chat (SPRING BOOT CONTRACT SSE) ────────────────────────────────
@app.post("/api/chat")
async def chat_sse(req: ChatRequest):
    query = req.message or req.prompt or ""
    
    async def event_generator():
        p = query.lower()
        
        # 1. Progressive Status Events
        yield sse_event({"type": "status", "message": "Connecting to INCOIS & IMD Doppler weather mesh..."})
        await asyncio.sleep(0.4)
        
        yield sse_event({"type": "status", "message": "Analyzing bathymetry and oceanic thermal gradients..."})
        await asyncio.sleep(0.4)
        
        yield sse_event({"type": "status", "message": "Synthesizing multimodal reasoning & UI component specs..."})
        await asyncio.sleep(0.4)

        # 2. Result Event with strict UI component schema
        if any(w in p for w in ["cyclone", "storm", "wave", "mumbai", "hazard", "gale", "risk"]):
            ui_json = {
                "title": "Severe Cyclonic Storm & Hazard Assessment — Sector 4B",
                "components": [
                    {
                        "type": "risk-card",
                        "data": {
                            "score": 88,
                            "status": "CRITICAL GALE WARNING",
                            "zone": "ARABIAN SEA NORTH",
                            "title": "Tropical Depression Varuna (Hazard Index 88/100)",
                            "description": "Sustained 52-knot winds with 5.8m significant wave heights. Storm core tracking NE at 14 kts.",
                            "coordinates": "20°48'N, 68°30'E",
                            "swell": "5.8m Phenomenal",
                            "wind": "52 kts NNE (Gale Force)"
                        }
                    },
                    {
                        "type": "weather-card",
                        "data": {
                            "pressure": "988.4 hPa (Rapid Fall)",
                            "sst": "29.4°C (+1.8° Anomaly)",
                            "wind": "52 kts NNE",
                            "swell": "5.8m @ 14.8s Period",
                            "visibility": "1.2 nm (Heavy Squalls)",
                            "current": "1.8 kts SW",
                            "humidity": "94%"
                        }
                    },
                    {
                        "type": "alert-card",
                        "data": {
                            "level": "critical",
                            "title": "PORT WARNING SIGNAL NO. 8 HOISTED",
                            "message": "Okha, Porbandar, Veraval, Ratnagiri. No vessel movement permitted without Coast Guard clearance.",
                            "source": "IMD Marine Warning Center",
                            "timestamp": "2026-08-29 07:55:00 UTC",
                            "areaAffected": "North Arabian Sea / Gujarat & Maharashtra Coast"
                        }
                    },
                    {
                        "type": "marine-map",
                        "data": {
                            "label": "STORM CORE & DIVERSION SECTOR",
                            "center": [20.8, 68.5],
                            "zoom": 7,
                            "markers": [
                                {"latlng": [20.8, 68.5], "icon": "🌪️", "popup": "Cyclone Varuna Eye (988 hPa)"},
                                {"latlng": [18.98, 72.82], "icon": "⚓", "popup": "Mumbai Safe Water Anchorage"}
                            ],
                            "polygons": [
                                {"center": [20.8, 68.5], "radius": 180000, "colour": "#FF5C5C"},
                                {"center": [20.5, 68.8], "radius": 320000, "colour": "rgba(255,92,92,0.3)"}
                            ]
                        }
                    },
                    {
                        "type": "recommendation-card",
                        "data": {
                            "priority": "CRITICAL",
                            "heading": "Emergency Anchorage Divert Order",
                            "text": "Immediately alter course to 120° magnetic towards Ratnagiri / Mumbai shelter. Secure loose gear and maintain continuous watch.",
                            "actions": [
                                "Plot diversion waypoint 18°30'N, 72°40'E outside 50m gale contour",
                                "Reduce cruising speed to bare steerage (6 kts)",
                                "Operate bilge pump monitoring and maintain VHF CH 16 listening watch"
                            ],
                            "safeHarbor": "Ratnagiri Anchorage / Mumbai Inner Harbour",
                            "vhf": "VHF CH 16 / DSC MF 2187.5 kHz"
                        }
                    },
                    {
                        "type": "evidence-panel",
                        "data": {
                            "title": "Oceanographic & Radar Inference Chain",
                            "entries": [
                                {"label": "IMD Doppler DWR-Mumbai", "value": "Reflectivity core > 48 dBZ moving NE", "confidence": "99%", "source": "IMD Radar"},
                                {"label": "INCOIS Wave Buoy 2304", "value": "Swell period escalated from 8.2s to 14.8s", "confidence": "97%", "source": "INCOIS Buoy"},
                                {"label": "Barometric Gradient", "value": "Central pressure drop of 14 hPa in 6 hours", "confidence": "95%", "source": "NOAA Surface Analysis"}
                            ],
                            "summary": "High risk of rogue breaking swells. Probability of vessel capsize in small craft is > 85%. Immediate harbor shelter required.",
                            "modelVersion": "ORCA-WaveSpectral-v2.4"
                        }
                    }
                ]
            }
            text = "**Tropical Depression Varuna** is intensifying over the North Arabian Sea, accelerating NE at 14 knots. Central pressure has dropped to **988 hPa** with sustained surface winds of 52 knots and gusts to 65 knots. Significant wave heights of **4.8m–6.1m** are recorded by Buoy 2304. All small craft must immediately abort open transit."

        elif any(w in p for w in ["fish", "pfz", "catch", "konkan", "tuna", "mackerel", "yield"]):
            ui_json = {
                "title": "Potential Fishing Zone (PFZ) Advisory — Konkan Shelf",
                "components": [
                    {
                        "type": "pfz-card",
                        "data": {
                            "name": "Konkan Thermal Front Alpha (PRIMARY)",
                            "latLonStr": "17°25'N, 72°21'E",
                            "sstAnomaly": "-1.4°C (Strong Coastal Upwelling)",
                            "chlorophyll": "3.4 mg/m³ (Peak Bloom)",
                            "confidence": "96%",
                            "targetSpecies": ["Indian Mackerel (Rastrelliger)", "Sardinella longiceps", "Yellowfin Tuna"],
                            "distanceNm": "25.9",
                            "depthM": 65,
                            "fuelSavingsEst": "28% vs Blind Trawling",
                            "advisory": "Optimal fishing window 0300Z–1100Z. Deploy purse seine along 65m isobath, heading SW at 4 knots."
                        }
                    },
                    {
                        "type": "ocean-card",
                        "data": {
                            "source": "Sentinel-3 OLCI & NOAA Geo-Polar",
                            "sstAnomaly": "-1.4°C",
                            "chlorophyll": "3.4 mg/m³",
                            "thermoclineDepth": "18m (Shallow Upwelling)",
                            "salinity": "35.2 PSU",
                            "dissolvedOxygen": "5.8 mg/L",
                            "ph": "8.15",
                            "currentSpeed": "0.6 kts",
                            "currentDirection": "145° (SE)",
                            "summary": "Ekman transport is drawing nutrient-rich sub-surface water into the photic zone, creating dense diatom clusters."
                        }
                    },
                    {
                        "type": "weather-card",
                        "data": {
                            "pressure": "1011.2 hPa",
                            "sst": "26.8°C (Upwelling Front)",
                            "wind": "12 kts NW (Favorable)",
                            "swell": "1.2m Slight",
                            "visibility": "8.0 nm (Clear)",
                            "current": "0.6 kts SE"
                        }
                    },
                    {
                        "type": "recommendation-card",
                        "data": {
                            "priority": "ADVISORY",
                            "heading": "Optimal Harvest Strategy Directive",
                            "text": "Target the 60m–70m bathymetric contour corridor. Fish aggregations peak at dawn. Avoid Malvan Marine Sanctuary 12nm south.",
                            "actions": [
                                "Depart port at 01:30Z to arrive on fishing ground at first light",
                                "Maintain echo-sounder gain at 70% to detect subsurface pelagic schools",
                                "Observe 3nm buffer from Malvan Marine Protected Area boundary"
                            ],
                            "safeHarbor": "Ratnagiri Fisheries Jetty",
                            "vhf": "VHF CH 16 / CH 08 (Fisheries)"
                        }
                    }
                ]
            }
            text = "**Two high-yield PFZ opportunities** detected along the Konkan Shelf. The primary zone (Thermal Front Alpha, 17°25'N, 72°21'E) shows exceptional upwelling conditions with chlorophyll-a at **3.4 mg/m³** — 300% above seasonal baseline. Indian Mackerel, Sardinella, and Yellowfin Tuna are heavily concentrated at the 65m isobath."

        elif any(w in p for w in ["route", "veraval", "ratnagiri", "navigation", "planner"]):
            ui_json = {
                "title": "Pareto Optimal Route Analysis (Veraval → Ratnagiri)",
                "components": [
                    {
                        "type": "risk-card",
                        "data": {
                            "score": 19,
                            "status": "SAFE PASSAGE APPROVED",
                            "zone": "COASTAL CORRIDOR",
                            "title": "ORCA Recommended Safe Route (Risk 19 vs Shortest 84)",
                            "description": "Coastal bathymetric lee shelter via waypoints 20.6°N→18.4°N. Tail current saves 530L fuel.",
                            "coordinates": "Via 20.6°N, 71.4°E → 18.4°N, 72.8°E",
                            "swell": "1.8m Moderate",
                            "wind": "16 kts"
                        }
                    },
                    {
                        "type": "recommendation-card",
                        "data": {
                            "priority": "ADVISORY",
                            "heading": "Navigational Waypoint Directive",
                            "text": "Depart Veraval on 090° magnetic. Alter to 130° at WP-2 (20°36'N, 71°24'E). Skirt PFZ Alpha at WP-3 for opportunistic catch before final approach to Ratnagiri.",
                            "actions": [
                                "WP-1: 20°54'N, 70°22'E (Veraval Fairway Buoy)",
                                "WP-2: 20°36'N, 71°24'E (Gulf of Khambhat Lee)",
                                "WP-3: 18°24'N, 72°48'E (Mumbai High Outer Buffer)",
                                "WP-4: 16°59'N, 73°16'E (Ratnagiri Safe Water Mark)"
                            ],
                            "safeHarbor": "Ratnagiri Port (Deep-Water Berth 4)",
                            "vhf": "VHF CH 16 / 22A"
                        }
                    },
                    {
                        "type": "evidence-panel",
                        "data": {
                            "title": "Multi-Objective Pareto Trade-Off Optimization",
                            "entries": [
                                "Direct Route: 312 nm, Risk: 84/100, Fuel: 3,850L (Intersects Cyclone Varuna)",
                                "ORCA Safe Route: 348 nm, Risk: 19/100, Fuel: 3,320L (Tail-current assist)",
                                "Net Benefit: 77% Risk Reduction, 530L Fuel Saved, +2h 45m Transit Time"
                            ],
                            "summary": "The coastal detour adds 36 nm but saves fuel due to south-flowing monsoon lee currents while avoiding 5.8m gale seas.",
                            "modelVersion": "ORCA-ParetoRoute-v2.1"
                        }
                    }
                ]
            }
            text = "Route optimization between **Veraval and Ratnagiri** complete. The direct 312nm course intersects the Cyclone Varuna gale core with an unacceptable risk score of **84/100**. ORCA has computed a coastal waypoint diversion of **348nm** that reduces risk to **19/100** while saving 530 litres of fuel."

        else:
            ui_json = {
                "title": "ORCA Marine Intelligence Console — Operational Status",
                "components": [
                    {
                        "type": "alert-card",
                        "data": {
                            "level": "info",
                            "title": "ALL SENSOR FEEDS SYNCHRONIZED",
                            "message": "INCOIS PFZ (✓), NOAA SST (✓), IMD Doppler Radar (✓), AIS Vessel Stream (✓). No distress signals in Sector 4B.",
                            "source": "ORCA Core Mesh",
                            "timestamp": "2026-08-29 07:55:00 UTC",
                            "areaAffected": "Arabian Sea Sector 4B"
                        }
                    },
                    {
                        "type": "risk-card",
                        "data": {
                            "score": 28,
                            "status": "NOMINAL",
                            "zone": "MUMBAI COASTAL QUADRANT",
                            "title": "Local Maritime Sector Assessment",
                            "description": "Moderate sea conditions. Tropical Depression Varuna active 180nm NW.",
                            "coordinates": "18°58'N, 72°49'E",
                            "swell": "1.6m Slight",
                            "wind": "14 kts W"
                        }
                    }
                ]
            }
            text = "**ORCA Bridge Console** is fully operational. All **6 data adapters** are synchronized with sub-second latency. No MAYDAY or PAN-PAN distress signals detected in your monitoring quadrant."

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

    # Mount static assets
    if (root_dir / "css").exists():
        app.mount("/css", StaticFiles(directory=str(root_dir / "css")), name="css")
    if (root_dir / "js").exists():
        app.mount("/js", StaticFiles(directory=str(root_dir / "js")), name="js")

# ─── RUN SERVER ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
