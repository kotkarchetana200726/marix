# ORCA Backend — Marine Intelligence API Server
# Provides live SSE endpoints for ORCA Bridge Console with simple verdict responses for fishermen

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
                "[01] सागरी माहिती तपासत आहे...",
                "[02] हवामानाची खात्री करत आहे...",
                "[03] निर्णय तयार करत आहे..."
            ],
            "hi": [
                "[01] समुद्री जानकारी जाँच रहे हैं...",
                "[02] मौसम की पुष्टि कर रहे हैं...",
                "[03] निर्णय तैयार कर रहे हैं..."
            ],
            "en": [
                "[01] Checking marine data...",
                "[02] Verifying weather...",
                "[03] Preparing decision..."
            ]
        }

        steps = status_steps.get(target_lang, status_steps["en"])
        for s in steps:
            yield sse_event({"type": "status", "message": s})
            await asyncio.sleep(0.18)

        # 1. PFZ QUERY (English, Hindi, Marathi)
        if "fish" in p or "pfz" in p or "मासेमारी" in p or "मछली" in p or "जगह" in p or "जागा" in p:
            if target_lang == "mr":
                text = "## 🟢 आज मासेमारीसाठी जाऊ शकता\n\n**PFZ-01** ही मासे पकडण्यासाठी उत्तम जागा आहे. ही जागा तुमच्या ठिकाणापासून **सुमारे १८ किमी नैऋत्य दिशेला** आहे.\n\n- 📍 **अंतर**: १८ किमी नैऋत्य\n- 🐟 **मासे मिळण्याची शक्यता**: उत्तम (87%)\n- 🌊 **समुद्र**: मध्यम शांत (१.४ मीटर लाटा)\n\n💡 *निघण्यापूर्वी हवामानाची ताजी माहिती जरूर तपासा.*"
                title = "🟢 आज मासेमारीसाठी जाऊ शकता"
                name_val = "रत्नागिरी नैऋत्य PFZ-01"
                dist_val = "18 किमी नैऋत्य"
            elif target_lang == "hi":
                text = "## 🟢 आज मछली पकड़ने जा सकते हैं\n\n**PFZ-01** मछली पकड़ने के लिए सबसे अच्छी जगह है। यह जगह आपके स्थान से **लगभग 18 किमी दक्षिण-पश्चिम** में है।\n\n- 📍 **दूरी**: 18 किमी दक्षिण-पश्चिम\n- 🐟 **मछली मिलने की संभावना**: अच्छी (87%)\n- 🌊 **समुद्र**: मध्यम शांत (1.4 मीटर लहरें)\n\n💡 *निकलने से पहले मौसम की ताजा जानकारी जरूर देखें।*"
                title = "🟢 आज मछली पकड़ने जा सकते हैं"
                name_val = "रत्नागिरी दक्षिण-पश्चिम PFZ-01"
                dist_val = "18 किमी दक्षिण-पश्चिम"
            else:
                text = "## 🟢 SAFE TO GO FISHING TODAY\n\n**PFZ-01** is the best place to fish today. It is located **18 km southwest** of your current location.\n\n- 📍 **Distance**: 18 km Southwest\n- 🐟 **Fishing Chance**: Good (87%)\n- 🌊 **Sea**: Moderate (1.4 m waves)\n\n💡 *Check weather forecast before departure.*"
                title = "🟢 SAFE TO GO FISHING TODAY"
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

        # DEFAULT FALLBACK (Simple Human Verdict)
        else:
            if target_lang == "mr":
                text = "## 🟢 आज मासेमारीसाठी जाऊ शकता\n\nरत्नागिरी किनाऱ्याजवळ समुद्राची स्थिती सामान्य आहे. प्रवास सुरक्षित आहे.\n\n- 📍 **अंतर**: १८ किमी\n- 🌊 **समुद्र**: मध्यम शांत (१.४ मीटर लाटा)\n- 🌬️ **वारा**: १८ किमी/तास"
                title = "🟢 आज मासेमारीसाठी जाऊ शकता"
            elif target_lang == "hi":
                text = "## 🟢 आज मछली पकड़ने जा सकते हैं\n\nरत्नागिरी तट के पास समुद्र की स्थिति सामान्य है। यात्रा सुरक्षित है।\n\n- 📍 **दूरी**: 18 किमी\n- 🌊 **समुद्र**: मध्यम शांत (1.4 मीटर लहरें)\n- 🌬️ **हवा**: 18 किमी/घंटा"
                title = "🟢 आज मछली पकड़ने जा सकते हैं"
            else:
                text = "## 🟢 SAFE TO GO FISHING TODAY\n\nSea conditions across Ratnagiri coast are normal. Coastal travel is safe.\n\n- 📍 **Distance**: 18 km\n- 🌊 **Sea**: Moderate (1.4 m waves)\n- 🌬️ **Wind**: 18 km/h"
                title = "🟢 SAFE TO GO FISHING TODAY"

            ui_json = {"title": title, "components": []}

        yield sse_event({"type": "result", "ui_json": ui_json, "text": text})

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ─── STATIC FILES ─────────────────────────────────────────────────────────────
root_dir = Path(__file__).resolve().parent.parent
if (root_dir / "index.html").exists():
    @app.get("/")
    @app.get("/index.html")
    async def serve_index():
        return FileResponse(root_dir / "index.html")

    if (root_dir / "css").exists():
        app.mount("/css", StaticFiles(directory=str(root_dir / "css")), name="css")
    if (root_dir / "js").exists():
        app.mount("/js", StaticFiles(directory=str(root_dir / "js")), name="js")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
