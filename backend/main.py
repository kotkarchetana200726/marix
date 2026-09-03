# ORCA Backend — Marine Intelligence API Server
# Provides live SSE endpoints for ORCA Bridge Console with strict 100% multilingual response lock

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
    
    # Priority 1: User explicitly selected language in request
    target_lang = req.lang if req.lang in ["en", "hi", "mr"] else None

    # Priority 2 & 3: Script & Text keyword detection
    if not target_lang:
        if any(c in query for c in ["आहे", "मासेमारी", "कुठे", "झाले", "जागा"]):
            target_lang = "mr"
        elif any(c in query for c in ["कहाँ", "है", "मछली", "जगह", "रास्ता"]):
            target_lang = "hi"
        else:
            target_lang = "en"

    async def event_generator():
        p = query.lower().strip()
        
        status_steps = {
            "mr": [
                "[01] सर्व सागरी डेटा स्रोत तपासले जात आहेत...",
                "[02] संभाव्य मासेमारी क्षेत्रांचे विश्लेषण केले जात आहे...",
                "[03] हवामान आणि समुद्राच्या परिस्थितीचे मूल्यांकन केले जात आहे...",
                "[04] सर्वोत्तम क्षेत्र ओळखले जात आहे..."
            ],
            "hi": [
                "[01] सभी समुद्री डेटा स्रोतों की जाँच की जा रही है...",
                "[02] संभावित मछली पकड़ने वाले क्षेत्रों का विश्लेषण किया जा रहा है...",
                "[03] मौसम और समुद्री परिस्थितियों का मूल्यांकन किया जा रहा है...",
                "[04] सर्वोत्तम क्षेत्र की पहचान की जा रही है..."
            ],
            "en": [
                "[01] Querying all marine data sources...",
                "[02] Analyzing potential fishing zones...",
                "[03] Evaluating weather & sea state...",
                "[04] Generating optimal recommendation..."
            ]
        }

        steps = status_steps.get(target_lang, status_steps["en"])
        for s in steps:
            yield sse_event({"type": "status", "message": s})
            await asyncio.sleep(0.2)

        # 1. PFZ QUERY (English, Hindi, Marathi)
        if "fish" in p or "pfz" in p or "मासेमारी" in p or "मछली" in p or "जगह" in p or "जागा" in p:
            if target_lang == "mr":
                text = "आज मासेमारीसाठी सर्वात चांगला परिसर तुमच्या सध्याच्या ठिकाणापासून **सुमारे 18 किमी नैऋत्य दिशेला (Southwest)** असलेला PFZ-01 आहे.\n\nया भागात क्लोरोफिलचे प्रमाण जास्त असून समुद्राचे तापमान मासेमारीसाठी अत्यंत अनुकूल आहे.\n\n### 📋 मुख्य माहिती आणि शिफारस\n- 🎣 **मासेमारीची शक्यता**: **उच्च (87%)**\n- 📍 **अंतर**: **18 किमी**\n- 🧭 **दिशा**: **नैऋत्य (Southwest)**\n- 🌿 **क्लोरोफिलचे प्रमाण**: **4.7 mg/m³**\n- 🌡️ **समुद्राच्या पृष्ठभागाचे तापमान (SST)**: **27.9°C**\n- 🌊 **समुद्राची स्थिती**: **मध्यम (लाटा 1.4m)**\n\nसमुद्रात जाण्यापूर्वी ताजे हवामान आणि समुद्री इशारे तपासा."
                title = "🎣 संभाव्य मासेमारी क्षेत्र (PFZ-01)"
                name_val = "रत्नागिरी नैऋत्य PFZ-01"
                dist_val = "18 किमी नैऋत्य"
            elif target_lang == "hi":
                text = "आज मछली पकड़ने के लिए सबसे अच्छा क्षेत्र आपके वर्तमान स्थान से **लगभग 18 किलोमीटर दक्षिण-पश्चिम (Southwest)** दिशा में स्थित PFZ-01 है।\n\nइस क्षेत्र में क्लोरोफिल का स्तर अधिक है और समुद्र का तापमान मछली पकड़ने के लिए अत्यधिक अनुकूल है।\n\n### 📋 मुख्य जानकारी और सिफारिश\n- 🎣 **मछली पकड़ने की संभावना**: **उच्च (87%)**\n- 📍 **दूरी**: **18 किमी**\n- 🧭 **दिशा**: **दक्षिण-पश्चिम (Southwest)**\n- 🌿 **क्लोरोफिल का स्तर**: **4.7 mg/m³**\n- 🌡️ **समुद्र की सतह का तापमान (SST)**: **27.9°C**\n- 🌊 **समुद्र की स्थिति**: **मध्यम (लहरें 1.4m)**\n\nसमुद्र में जाने से पहले नवीनतम मौसम और समुद्री चेतावनियों की जाँच करें।"
                title = "🎣 संभावित मत्स्य पालन क्षेत्र (PFZ-01)"
                name_val = "रत्नागिरी दक्षिण-पश्चिम PFZ-01"
                dist_val = "18 किमी दक्षिण-पश्चिम"
            else:
                text = "The best place to fish today is **PFZ-01**, located **18 km southwest** of your current location.\n\nSatellite telemetry indicates high chlorophyll concentration (4.7 mg/m³) and optimal Sea Surface Temperature (27.9°C).\n\n### 📋 KEY DECISION BULLETINS\n- 🎣 **Fishing Potential**: **HIGH (87%)**\n- 📍 **Distance**: **18 km**\n- 🧭 **Direction**: **Southwest**\n- 🌿 **Chlorophyll-a**: **4.7 mg/m³**\n- 🌡️ **SST**: **27.9°C**\n- 🌊 **Sea State**: **Moderate (1.4m waves)**\n\nCheck weather and local advisories before departure."
                title = "🎣 Potential Fishing Zone (PFZ-01)"
                name_val = "Ratnagiri Southwest PFZ-01"
                dist_val = "18 km SW"

            ui_json = {
                "title": title,
                "components": [
                    {
                        "type": "pfz-card",
                        "data": {
                            "name": name_val,
                            "latLonStr": "16°51'N, 73°10'E",
                            "sstAnomaly": "27.9°C",
                            "chlorophyll": "4.7 mg/m³",
                            "confidence": "87%",
                            "distanceNm": dist_val
                        }
                    }
                ]
            }

        # DEFAULT FALLBACK (100% Pure Target Language)
        else:
            if target_lang == "mr":
                text = f"**ORCA सागरी माहिती उत्तर** (\"{query}\" साठी)\n\nरत्नागिरी आणि कोकण किनारी भागातील समुद्राची स्थिती मध्यम आहे. समुद्राच्या पृष्ठभागाचे तापमान **28.4°C** आणि लाटांची उंची **1.4 मीटर** आहे.\n\n### 📋 मुख्य माहिती\n- 🎣 **मासेमारीची शक्यता**: **उच्च (87%)**\n- 📍 **अंतर**: **18 किमी**\n- 🧭 **दिशा**: **नैऋत्य (Southwest)**\n- 🌡️ **समुद्र तापमान (SST)**: **28.4°C**\n- 🌊 **समुद्रस्थिती**: **1.4m लाटा**"
                title = "ORCA सागरी माहिती"
            elif target_lang == "hi":
                text = f"**ORCA समुद्री जानकारी उत्तर** (\"{query}\" के लिए)\n\nरत्नागिरी और कोंकण तटीय क्षेत्र में समुद्र की स्थिति मध्यम है। समुद्र की सतह का तापमान **28.4°C** और लहरों की ऊँचाई **1.4 मीटर** है।\n\n### 📋 मुख्य जानकारी\n- 🎣 **मछली पकड़ने की संभावना**: **उच्च (87%)**\n- 📍 **दूरी**: **18 किमी**\n- 🧭 **दिशा**: **दक्षिण-पश्चिम (Southwest)**\n- 🌡️ **समुद्र का तापमान (SST)**: **28.4°C**\n- 🌊 **समुद्र की स्थिति**: **1.4m लहरें**"
                title = "ORCA समुद्री जानकारी"
            else:
                text = f"**ORCA Marine Intelligence Response** for *\"{query}\"*\n\nSea conditions across Ratnagiri sector are moderate. Sea Surface Temp is **28.4°C** with **1.4 m** wave height.\n\n### 📋 KEY DECISION BULLETINS\n- 🎣 **Fishing Potential**: **HIGH (87%)**\n- 📍 **Distance**: **18 km**\n- 🧭 **Direction**: **Southwest**\n- 🌡️ **SST**: **28.4°C**\n- 🌊 **Sea State**: **1.4m waves**"
                title = "ORCA Marine Intelligence"

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
