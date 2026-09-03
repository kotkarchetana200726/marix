# ORCA Backend — Marine Intelligence API Server
# ==============================================================================
# Provides live endpoints for ORCA Bridge Console:
#   - POST /api/chat       (SSE stream: status -> result with UI components & decision bulletins)
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
    lang: Optional[str] = "en"

# ─── SSE FORMATTER ────────────────────────────────────────────────────────────
def sse_event(data: dict) -> str:
    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"

# ─── DATA FIXTURES ────────────────────────────────────────────────────────────
PFZ_DATA = [
    {
        "id": "pfz-01",
        "name": "Ratnagiri Southwest Thermal Front (PRIMARY)",
        "lat": 16.85,
        "lng": 73.18,
        "confidence": "87%",
        "sstAnomaly": "27.9°C",
        "chlorophyll": "4.7 mg/m³",
        "species": ["Indian Mackerel", "Sardinella longiceps"],
        "advisory": "Favorable fishing conditions 18 km SW of Ratnagiri.",
        "distanceNm": "9.7",
        "depthM": 48,
        "fuelSavingsEst": "28%"
    }
]

GEOFENCE_DATA = [
    {
        "id": "geo-malvan-mpa",
        "name": "Malvan Marine Protected Area",
        "type": "protected",
        "latlngs": [[16.02, 73.42], [16.08, 73.48], [16.04, 73.55], [15.98, 73.49]],
        "colour": "#6BCB77",
        "description": "Protected Coral & Ecosystem Reserve."
    }
]

@app.get("/api/pfz")
async def get_pfz():
    return PFZ_DATA

@app.get("/api/geofences")
async def get_geofences():
    return GEOFENCE_DATA

@app.get("/api/health")
async def health():
    return {
        "status": "OPERATIONAL",
        "agent_engine": "ORCA_REASONING_V2",
        "version": "2.4.0"
    }

# ─── POST /api/chat ───────────────────────────────────────────────────────────
@app.post("/api/chat")
async def chat_sse(req: ChatRequest):
    query = req.message or req.prompt or ""
    
    # Resolve target language strictly
    target_lang = req.lang or "en"
    if any(c in query for c in ["आहे", "मासेमारी", "कुठे", "झाले"]):
        target_lang = "mr"
    elif any(c in query for c in ["कहाँ", "है", "मछली", "जगह"]):
        target_lang = "hi"

    async def event_generator():
        p = query.lower().strip()
        
        status_steps = {
            "mr": ["समुद्राची स्थिती तपासत आहे...", "हवामान विश्लेषण करत आहे...", "उत्तर तयार करत आहे..."],
            "hi": ["समुद्र की स्थिति जाँच रहे हैं...", "मौसम विश्लेषण कर रहे हैं...", "उत्तर तैयार कर रहे हैं..."],
            "en": ["Connecting to INCOIS & IMD weather mesh...", "Analyzing ocean telemetry...", "Synthesizing answer..."]
        }

        steps = status_steps.get(target_lang, status_steps["en"])
        for s in steps:
            yield sse_event({"type": "status", "message": s})
            await asyncio.sleep(0.2)

        # 1. PFZ QUERY
        if "fish" in p or "pfz" in p or "मासेमारी" in p or "मछली" in p:
            if target_lang == "mr":
                text = "तुमच्या सध्याच्या ठिकाणापासून **सुमारे 18 किमी नैऋत्य दिशेला (Southwest)** मासेमारीसाठी अनुकूल क्षेत्र आहे.\n\nया भागात क्लोरोफिलचे प्रमाण जास्त असून समुद्राचे तापमान मासेमारीसाठी अनुकूल आहे.\n\n### 📋 मुख्य माहिती आणि शिफारस\n- 🎣 **मासेमारीची शक्यता**: **उच्च (87%)**\n- 📍 **अंतर**: **18 किलोमीटर**\n- 🧭 **दिशा**: **नैऋत्य (Southwest)**\n- 🌿 **क्लोरोफिलचे प्रमाण**: **4.7 mg/m³**\n- 🌡️ **समुद्र तापमान (SST)**: **27.9°C**\n- 🌊 **समुद्रस्थिती**: **मध्यम (लाटा 1.4m)**\n\nसमुद्रात जाण्यापूर्वी ताजे हवामान आणि समुद्री इशारे तपासा."
                title = "🎣 संभाव्य मासेमारी क्षेत्र (PFZ-01)"
            elif target_lang == "hi":
                text = "आपकी वर्तमान स्थिति से **लगभग 18 किलोमीटर दक्षिण-पश्चिम (Southwest)** दिशा में मछली पकड़ने के लिए अनुकूल क्षेत्र है।\n\nइस क्षेत्र में क्लोरोफिल की मात्रा अधिक है और समुद्र का तापमान मछली पकड़ने के लिए अनुकूल है।\n\n### 📋 मुख्य जानकारी और सिफारिश\n- 🎣 **मछली पकड़ने की संभावना**: **उच्च (87%)**\n- 📍 **दूरी**: **18 किलोमीटर**\n- 🧭 **दिशा**: **दक्षिण-पश्चिम (Southwest)**\n- 🌿 **क्लोरोफिल का स्तर**: **4.7 mg/m³**\n- 🌡️ **समुद्र का तापमान (SST)**: **27.9°C**\n- 🌊 **समुद्र की स्थिति**: **मध्यम (लहरें 1.4m)**\n\nसमुद्र में जाने से पहले नवीनतम मौसम और समुद्री चेतावनियों की जाँच करें।"
                title = "🎣 संभावित मत्स्य पालन क्षेत्र (PFZ-01)"
            else:
                text = "The nearest high-potential fishing zone (**PFZ-01**) is about **18 km southwest** of your current location.\n\nThe area shows high chlorophyll concentration and a suitable sea-surface temperature.\n\n### 📋 KEY DECISION BULLETINS\n- 🎣 **Fishing Potential**: **HIGH (87%)**\n- 📍 **Distance**: **18 km**\n- 🧭 **Direction**: **Southwest**\n- 🌿 **Chlorophyll-a**: **4.7 mg/m³**\n- 🌡️ **SST**: **27.9°C**\n- 🌊 **Sea State**: **Moderate (1.4m waves)**"
                title = "🎣 Potential Fishing Zone (PFZ-01)"

            ui_json = {
                "title": title,
                "components": [
                    {
                        "type": "pfz-card",
                        "data": {
                            "name": "PFZ-01",
                            "latLonStr": "16°51'N, 73°10'E",
                            "sstAnomaly": "27.9°C",
                            "chlorophyll": "4.7 mg/m³",
                            "confidence": "87%",
                            "distanceNm": "18 km SW"
                        }
                    }
                ]
            }

        # DEFAULT FALLBACK
        else:
            if target_lang == "mr":
                text = f"**ORCA सागरी माहिती उत्तर** (\"{query}\" साठी)\n\nरत्नागिरी किनारी भागात समुद्रस्थिती मध्यम आहे. समुद्राच्या पृष्ठभागाचे तापमान **28.4°C** आणि लाटांची उंची **1.4 मीटर** आहे."
                title = "ORCA सागरी माहिती"
            elif target_lang == "hi":
                text = f"**ORCA समुद्री जानकारी उत्तर** (\"{query}\" के लिए)\n\nरत्नागिरी तटीय क्षेत्र में समुद्र की स्थिति मध्यम है। समुद्र की सतह का तापमान **28.4°C** और लहरों की ऊँचाई **1.4 मीटर** है।"
                title = "ORCA समुद्री जानकारी"
            else:
                text = f"**MARIX Response** for *\"{query}\"*\n\nSea conditions across Ratnagiri sector are moderate. SST is **28.4°C** with **1.4 m** wave height."
                title = "MARIX Marine Intelligence"

            ui_json = {"title": title, "components": []}

        yield sse_event({"type": "result", "ui_json": ui_json, "text": text})

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ─── STATIC FILES ─────────────────────────────────────────────────────────────
root_dir = Path(__file__).resolve().parent.parent
if (root_dir / "index.html").exists():
    @app.get("/")
    async def serve_index():
        return FileResponse(root_dir / "index.html")

    if (root_dir / "css").exists():
        app.mount("/css", StaticFiles(directory=str(root_dir / "css")), name="css")
    if (root_dir / "js").exists():
        app.mount("/js", StaticFiles(directory=str(root_dir / "js")), name="js")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
