// MARIX Marine AI — Centralized Multilingual Mock Data & Response System
// STRICT MULTILINGUAL CONTRACT: Marathi in -> 100% Marathi out; Hindi in -> 100% Hindi out; English in -> 100% English out.

import { marineData, sessionMemory, updateSessionMemory } from './marineData.js';

export const MOCK_MODE = true;

export function detectOrResolveLanguage(queryText, selectedLang) {
  // Priority 1: Explicitly selected language in UI (mr, hi, en)
  if (selectedLang === 'mr' || selectedLang === 'hi' || selectedLang === 'en') {
    return selectedLang;
  }

  // Priority 2 & 3: Script & Text keyword detection
  if (queryText && typeof queryText === 'string') {
    const q = queryText.toLowerCase();
    const hasDevanagari = /[\u0900-\u097F]/.test(queryText);

    if (hasDevanagari) {
      if (q.includes("आहे") || q.includes("मासेमारी") || q.includes("कुठे") || q.includes("झाले") || q.includes("काय") || q.includes("सुरक्षित") || q.includes("जागा")) {
        return 'mr';
      }
      if (q.includes("कहाँ") || q.includes("है") || q.includes("मछली") || q.includes("जगह") || q.includes("क्या") || q.includes("सुरक्षित") || q.includes("रास्ता")) {
        return 'hi';
      }
      return 'mr'; // Default Devanagari to mr if ambiguous
    }
  }

  return 'en';
}

export const MOCK_RESPONSES = [

  // ───────────────────────────────────────────────────────────────────────────
  // 1. PFZ QUESTION (English, Marathi, Hindi)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "FISH_PFZ",
    keywords: ["nearest potential fishing zone", "fishing zone today", "where is the nearest", "मासेमारीसाठी चांगली जागा", "मछली पकड़ने के लिए सबसे अच्छी जगह"],
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("nearest") && (s.includes("zone") || s.includes("pfz"))) ||
             (s.includes("fishing") && (s.includes("where") || s.includes("today") || s.includes("place") || s.includes("location"))) ||
             s.includes("मासेमारी") || s.includes("मछली") || s.includes("पकड़ने") || s.includes("जागा") || s.includes("जगह");
    },
    steps: {
      en: [
        "[01] Querying all marine data sources...",
        "[02] Analyzing potential fishing zones...",
        "[03] Evaluating weather & sea state...",
        "[04] Identifying optimal fishing location..."
      ],
      mr: [
        "[01] सर्व सागरी डेटा स्रोत तपासले जात आहेत...",
        "[02] संभाव्य मासेमारी क्षेत्रांचे विश्लेषण केले जात आहे...",
        "[03] हवामान आणि समुद्राच्या परिस्थितीचे मूल्यांकन केले जात आहे...",
        "[04] सर्वोत्तम मासेमारी क्षेत्र ओळखले जात आहे..."
      ],
      hi: [
        "[01] सभी समुद्री डेटा स्रोतों की जाँच की जा रही है...",
        "[02] संभावित मछली पकड़ने वाले क्षेत्रों का विश्लेषण किया जा रहा है...",
        "[03] मौसम और समुद्री परिस्थितियों का मूल्यांकन किया जा रहा है...",
        "[04] सर्वोत्तम क्षेत्र की पहचान की जा रही है..."
      ]
    },
    getAnswer: function(q, targetLang = 'en') {
      updateSessionMemory('PFZ-01', 'Ratnagiri Coast', 'fisherman');

      if (targetLang === 'mr') {
        return {
          title: "🎣 संभाव्य मासेमारी क्षेत्र (PFZ-01)",
          prose: "आज मासेमारीसाठी सर्वात चांगला परिसर तुमच्या सध्याच्या ठिकाणापासून **सुमारे 18 किमी नैऋत्य दिशेला (Southwest)** असलेला PFZ-01 आहे.\n\nया भागात क्लोरोफिलचे प्रमाण जास्त असून समुद्राचे तापमान मासेमारीसाठी अत्यंत अनुकूल आहे.\n\n### 📋 मुख्य माहिती आणि शिफारस\n- 🎣 **मासेमारीची शक्यता**: **उच्च (87%)**\n- 📍 **अंतर**: **18 किमी**\n- 🧭 **दिशा**: **नैऋत्य (Southwest)**\n- 🌿 **क्लोरोफिलचे प्रमाण**: **4.7 mg/m³**\n- 🌡️ **समुद्राच्या पृष्ठभागाचे तापमान (SST)**: **27.9°C**\n- 🌊 **समुद्राची स्थिती**: **मध्यम (लाटा 1.4m)**\n\nसमुद्रात जाण्यापूर्वी ताजे हवामान आणि समुद्री इशारे तपासा.",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "रत्नागिरी नैऋत्य मासेमारी क्षेत्र (PFZ-01)",
                latLonStr: "16°51'N, 73°10'E",
                sstAnomaly: "27.9°C",
                chlorophyll: "4.7 mg/m³",
                confidence: "87%",
                targetSpecies: ["बांगडा (Mackerel)", "तारली (Sardinella)", "सुरमई"],
                distanceNm: "18 किमी नैऋत्य",
                depthM: 48,
                fuelSavingsEst: "28%",
                advisory: "रत्नागिरीच्या नैऋत्येला 18 किमी अंतरावर अनुकूल मासेमारी स्थिती. सावधानतेने जा."
              }
            },
            {
              type: "marine-map",
              data: {
                label: "मासेमारी क्षेत्र नकाशा (PFZ-01)",
                center: [16.85, 73.18],
                zoom: 9,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "तुमचे ठिकाण (रत्नागिरी)" },
                  { latlng: [16.85, 73.18], icon: "🐟", popup: "PFZ-01: उच्च शक्यता (18 किमी नैऋत्य)" }
                ]
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        return {
          title: "🎣 संभावित मत्स्य पालन क्षेत्र (PFZ-01)",
          prose: "आज मछली पकड़ने के लिए सबसे अच्छा क्षेत्र आपके वर्तमान स्थान से **लगभग 18 किलोमीटर दक्षिण-पश्चिम (Southwest)** दिशा में स्थित PFZ-01 है।\n\nइस क्षेत्र में क्लोरोफिल का स्तर अधिक है और समुद्र का तापमान मछली पकड़ने के लिए अत्यधिक अनुकूल है।\n\n### 📋 मुख्य जानकारी और सिफारिश\n- 🎣 **मछली पकड़ने की संभावना**: **उच्च (87%)**\n- 📍 **दूरी**: **18 किमी**\n- 🧭 **दिशा**: **दक्षिण-पश्चिम (Southwest)**\n- 🌿 **क्लोरोफिल का स्तर**: **4.7 mg/m³**\n- 🌡️ **समुद्र की सतह का तापमान (SST)**: **27.9°C**\n- 🌊 **समुद्र की स्थिति**: **मध्यम (लहरें 1.4m)**\n\nसमुद्र में जाने से पहले नवीनतम मौसम और समुद्री चेतावनियों की जाँच करें।",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "रत्नागिरी दक्षिण-पश्चिम मत्स्य क्षेत्र (PFZ-01)",
                latLonStr: "16°51'N, 73°10'E",
                sstAnomaly: "27.9°C",
                chlorophyll: "4.7 mg/m³",
                confidence: "87%",
                targetSpecies: ["बांगड़ा (Mackerel)", "तारली (Sardinella)", "सुरमई"],
                distanceNm: "18 किमी दक्षिण-पश्चिम",
                depthM: 48,
                fuelSavingsEst: "28%",
                advisory: "रत्नागिरी के 18 किमी दक्षिण-पश्चिम में अच्छी मछली पकड़ने की संभावना है।"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "मत्स्य क्षेत्र मानचित्र (PFZ-01)",
                center: [16.85, 73.18],
                zoom: 9,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "आपकी स्थिति (रत्नागिरी)" },
                  { latlng: [16.85, 73.18], icon: "🐟", popup: "PFZ-01: उच्च संभावना (18 किमी दक्षिण-पश्चिम)" }
                ]
              }
            }
          ]
        };
      }

      return {
        title: "🎣 Potential Fishing Zone (PFZ-01)",
        prose: "The best place to fish today is **PFZ-01**, located **18 km southwest** of your current location.\n\nSatellite telemetry indicates high chlorophyll concentration (4.7 mg/m³) and optimal Sea Surface Temperature (27.9°C).\n\n### 📋 KEY DECISION BULLETINS\n- 🎣 **Fishing Potential**: **HIGH (87%)**\n- 📍 **Distance**: **18 km**\n- 🧭 **Direction**: **Southwest**\n- 🌿 **Chlorophyll-a**: **4.7 mg/m³**\n- 🌡️ **SST**: **27.9°C**\n- 🌊 **Sea State**: **Moderate (1.4m waves)**\n\nCheck weather and local advisories before departure.",
        components: [
          {
            type: "pfz-card",
            data: {
              name: "Ratnagiri Southwest PFZ-01",
              latLonStr: "16°51'N, 73°10'E",
              sstAnomaly: "27.9°C",
              chlorophyll: "4.7 mg/m³",
              confidence: "87%",
              targetSpecies: ["Indian Mackerel", "Sardinella", "Kingfish"],
              distanceNm: "18 km SW",
              depthM: 48,
              fuelSavingsEst: "28%",
              advisory: "High biological productivity 18 km SW of Ratnagiri. Proceed with standard safety protocols."
            }
          },
          {
            type: "marine-map",
            data: {
              label: "FISHING ZONE MAP (PFZ-01)",
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
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. SEA SAFETY / TOMORROW FISHING SAFETY
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "SEA_SAFETY",
    keywords: ["safe to go fishing tomorrow", "safe tomorrow", "is it safe", "उद्या मासेमारी सुरक्षित", "क्या कल सुबह मछली पकड़ना सुरक्षित"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("safe") || s.includes("tomorrow") || s.includes("सुरक्षित") || s.includes("कल") || s.includes("उद्या");
    },
    steps: {
      en: [
        "[01] Polling IMD radar & wave forecast models...",
        "[02] Assessing swell period & wind gust projections...",
        "[03] Evaluating maritime safety index...",
        "[04] Formulating departure safety directive..."
      ],
      mr: [
        "[01] हवामान आणि लाटांच्या अंदाजांची तपासणी करत आहे...",
        "[02] वाऱ्याचा वेग आणि लाटांच्या उंचीचे मूल्यमापन करत आहे...",
        "[03] सागरी सुरक्षितता निर्देशांकाची पडताळणी करत आहे...",
        "[04] प्रवासाची सुरक्षितता शिफारस तयार करत आहे..."
      ],
      hi: [
        "[01] मौसम और लहरों के पूर्वानुमान की जाँच की जा रही है...",
        "[02] हवा की गति और लहरों की ऊँचाई का मूल्यांकन किया जा रहा है...",
        "[03] समुद्री सुरक्षा सूचकांक की पुष्टि की जा रही है...",
        "[04] प्रस्थान सुरक्षा सिफारिश तैयार की जा रही है..."
      ]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🟢 समुद्र प्रवास सुरक्षितता शिफारस",
          prose: "उद्या सकाळी रत्नागिरी किनाऱ्याजवळ मासेमारी करणे **सुरक्षित आहे**.\n\nसकाळी 06:00 ते दुपारी 14:00 दरम्यान वाऱ्याचा वेग **18 किमी/तास** आणि लाटांची उंची **1.4 मीटर** राहण्याचा अंदाज आहे. मोठी भरती दुपारी 2:35 वाजता आहे.\n\n### 📋 मुख्य निर्णय माहिती\n- 🟢 **अंतिम निर्णय**: **किनारी मासेमारीसाठी सुरक्षित**\n- 🌬️ **वाऱ्याचा वेग**: **18 किमी/तास नैऋत्य**\n- 🌊 **लाटांची उंची**: **1.4 मीटर**\n- 🌊 **भरतीची वेळ**: **दुपारी 2:35 वाजता (मोठी भरती)**\n- ⚠️ **इशारा**: संध्याकाळी 16:00 नंतर किंचित वादळी वारे वाहण्याची शक्यता असल्याने दुपारी 15:00 पूर्वी किनाऱ्यावर परतण्याचा सल्ला दिला जातो.",
          components: [
            {
              type: "weather-card",
              data: {
                sst: "28.4°C",
                wind: "18 किमी/तास नैऋत्य",
                swell: "1.4 मीटर",
                pressure: "1009.4 hPa"
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        return {
          title: "🟢 समुद्र यात्रा सुरक्षा सिफारिश",
          prose: "कल सुबह रत्नागिरी तट के पास मछली पकड़ना **सुरक्षित है**।\n\nसुबह 06:00 से दोपहर 14:00 बजे के बीच हवा की गति **18 किमी/घंटा** और लहरों की ऊँचाई **1.4 मीटर** रहने का अनुमान है। उच्च ज्वार दोपहर 2:35 बजे आएगा।\n\n### 📋 मुख्य निर्णय बुलेटिन\n- 🟢 **अंतिम निर्णय**: **तटीय मछली पकड़ने के लिए सुरक्षित**\n- 🌬️ **हवा की गति**: **18 किमी/घंटा दक्षिण-पश्चिम**\n- 🌊 **लहरों की ऊँचाई**: **1.4 मीटर**\n- 🌊 **ज्वार का समय**: **दोपहर 2:35 बजे (उच्च ज्वार)**\n- ⚠️ **चेतावनी**: शाम 16:00 बजे के बाद हल्की हवाएं चलने की संभावना है, इसलिए दोपहर 15:00 बजे से पहले लौटने की सलाह दी जाती है।",
          components: [
            {
              type: "weather-card",
              data: {
                sst: "28.4°C",
                wind: "18 किमी/घंटा दक्षिण-पश्चिम",
                swell: "1.4 मीटर",
                pressure: "1009.4 hPa"
              }
            }
          ]
        };
      }

      return {
        title: "🟢 Marine Safety Directive — Tomorrow Morning",
        prose: "Fishing near the Ratnagiri coast tomorrow morning is **SAFE**.\n\nBetween 06:00 AM and 02:00 PM, wind speeds will hover around **18 km/h SW** with wave swells at **1.4 meters**. High tide is at **2:35 PM**.\n\n### 📋 KEY DECISION BULLETINS\n- 🟢 **Final Decision**: **SAFE FOR COASTAL FISHING**\n- 🌬️ **Wind Speed**: **18 km/h SW**\n- 🌊 **Wave Swell**: **1.4 m**\n- 🌊 **High Tide**: **2:35 PM**\n- ⚠️ **Advisory**: Isolated wind squalls possible after 4:00 PM. Return to shore by 3:00 PM.",
        components: [
          {
            type: "weather-card",
            data: {
              sst: "28.4°C",
              wind: "18 km/h SW",
              swell: "1.4 m",
              pressure: "1009.4 hPa"
            }
          }
        ]
      };
    }
  }

];

export function findMockResponse(queryText, userSelectedLang = 'en') {
  if (!MOCK_MODE || !queryText) return null;
  const targetLang = detectOrResolveLanguage(queryText, userSelectedLang);
  const q = queryText.toLowerCase().trim();

  // Try matching specific dataset patterns
  for (const resp of MOCK_RESPONSES) {
    if (typeof resp.match === 'function' && resp.match(q)) {
      if (typeof resp.getAnswer === 'function') {
        const ans = resp.getAnswer(q, targetLang);
        const steps = (resp.steps && resp.steps[targetLang]) ? resp.steps[targetLang] : (resp.steps?.en || ["[01] Processing marine query..."]);

        return {
          id: resp.id,
          targetLang: targetLang,
          steps: steps,
          title: ans.title,
          prose: ans.prose,
          components: ans.components
        };
      }
    }
  }

  // Dynamic Fallback Generator — 100% Pure Target Language guaranteed for any query
  const fallbackSteps = targetLang === 'mr'
    ? [
        "[01] सर्व सागरी डेटा स्रोत तपासले जात आहेत...",
        "[02] हवामान आणि समुद्राच्या परिस्थितीचे मूल्यांकन केले जात आहे...",
        "[03] उत्तर तयार केले जात आहे..."
      ]
    : targetLang === 'hi'
    ? [
        "[01] सभी समुद्री डेटा स्रोतों की जाँच की जा रही है...",
        "[02] मौसम और समुद्री परिस्थितियों का मूल्यांकन किया जा रहा है...",
        "[03] उत्तर तैयार किया जा रहा है..."
      ]
    : [
        "[01] Querying all marine data sources...",
        "[02] Evaluating weather & sea state...",
        "[03] Generating response..."
      ];

  const fallbackProse = targetLang === 'mr'
    ? `**ORCA सागरी माहिती उत्तर** ("${queryText}" साठी)\n\nरत्नागिरी आणि कोकण किनारी भागातील समुद्राची स्थिती मध्यम आहे. समुद्राच्या पृष्ठभागाचे तापमान **28.4°C** आणि लाटांची उंची **1.4 मीटर** आहे. प्रवास करण्यापूर्वी ताजी माहिती तपासा.\n\n### 📋 मुख्य माहिती\n- 🎣 **मासेमारीची शक्यता**: **उच्च (87%)**\n- 📍 **अंतर**: **18 किमी नैऋत्य**\n- 🧭 **दिशा**: **नैऋत्य (Southwest)**\n- 🌡️ **समुद्र तापमान (SST)**: **28.4°C**\n- 🌊 **समुद्रस्थिती**: **1.4m लाटा**`
    : targetLang === 'hi'
    ? `**ORCA समुद्री जानकारी उत्तर** ("${queryText}" के लिए)\n\nरत्नागिरी और कोंकण तटीय क्षेत्र में समुद्र की स्थिति मध्यम है। समुद्र की सतह का तापमान **28.4°C** और लहरों की ऊँचाई **1.4 मीटर** है। जाने से पहले जानकारी की जाँच करें।\n\n### 📋 मुख्य जानकारी\n- 🎣 **मछली पकड़ने की संभावना**: **उच्च (87%)**\n- 📍 **दूरी**: **18 किमी दक्षिण-पश्चिम**\n- 🧭 **दिशा**: **दक्षिण-पश्चिम (Southwest)**\n- 🌡️ **समुद्र का तापमान (SST)**: **28.4°C**\n- 🌊 **समुद्र की स्थिति**: **1.4m लहरें**`
    : `**ORCA Marine Intelligence Response** for *"${queryText}"*\n\nSea conditions across Ratnagiri sector are moderate. Sea Surface Temp is **28.4°C** with **1.4 m** wave height. Check latest advisory before departure.\n\n### 📋 KEY DECISION BULLETINS\n- 🎣 **Fishing Potential**: **HIGH (87%)**\n- 📍 **Distance**: **18 km SW**\n- 🧭 **Direction**: **Southwest**\n- 🌡️ **SST**: **28.4°C**\n- 🌊 **Sea State**: **1.4m waves**`;

  const fallbackTitle = targetLang === 'mr' ? 'ORCA सागरी माहिती' : targetLang === 'hi' ? 'ORCA समुद्री जानकारी' : 'ORCA Marine Intelligence';

  return {
    id: "DYNAMIC_FALLBACK",
    targetLang: targetLang,
    steps: fallbackSteps,
    title: fallbackTitle,
    prose: fallbackProse,
    components: [
      {
        type: "weather-card",
        data: {
          pressure: "1009.4 hPa",
          sst: "28.4°C",
          wind: targetLang === 'mr' ? "18 किमी/तास नैऋत्य" : targetLang === 'hi' ? "18 किमी/घंटा दक्षिण-पश्चिम" : "18 km/h SW",
          swell: targetLang === 'mr' ? "1.4 मीटर" : targetLang === 'hi' ? "1.4 मीटर" : "1.4 m",
          visibility: "7.2 km"
        }
      }
    ]
  };
}
