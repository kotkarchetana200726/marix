// MARIX Marine AI — Centralized Multilingual Mock Data & Response System
// STRICT MULTILINGUAL CONTRACT: Marathi in -> 100% Marathi out; Hindi in -> 100% Hindi out; English in -> 100% English out.

import { marineData, sessionMemory, updateSessionMemory } from './marineData.js';

export const MOCK_MODE = true;

export function detectOrResolveLanguage(queryText, selectedLang) {
  // Priority 1: User explicitly selected language in UI
  if (selectedLang === 'mr' || selectedLang === 'hi') {
    return selectedLang;
  }

  // Priority 2 & 3: Script & Text keyword detection
  if (queryText && typeof queryText === 'string') {
    const q = queryText.toLowerCase();
    const hasDevanagari = /[\u0900-\u097F]/.test(queryText);

    if (hasDevanagari) {
      if (q.includes("आहे") || q.includes("मासेमारी") || q.includes("कुठे") || q.includes("झाले") || q.includes("काय") || q.includes("सुरक्षित")) {
        return 'mr';
      }
      if (q.includes("कहाँ") || q.includes("है") || q.includes("मछली") || q.includes("जगह") || q.includes("क्या") || q.includes("सुरक्षित")) {
        return 'hi';
      }
      return 'mr'; // Default Devanagari to mr if ambiguous
    }
  }

  return selectedLang || 'en';
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
             (s.includes("fishing") && (s.includes("where") || s.includes("today"))) ||
             s.includes("मासेमारी") || s.includes("मछली पकड़ने");
    },
    steps: {
      en: ["Checking sea conditions...", "Checking weather...", "Checking safety..."],
      mr: ["समुद्राची स्थिती तपासत आहे...", "हवामान तपासत आहे...", "सुरक्षितता तपासत आहे..."],
      hi: ["समुद्र की स्थिति जाँच रहे हैं...", "मौसम जाँच रहे हैं...", "सुरक्षा की जाँच कर रहे हैं..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      updateSessionMemory('PFZ-01', 'Ratnagiri Coast', 'fisherman');

      if (targetLang === 'mr') {
        return {
          title: "🎣 संभाव्य मासेमारी क्षेत्र (PFZ-01)",
          prose: "तुमच्या सध्याच्या ठिकाणापासून **सुमारे 18 किमी नैऋत्य दिशेला (Southwest)** मासेमारीसाठी अनुकूल क्षेत्र आहे.\n\nया भागात क्लोरोफिलचे प्रमाण जास्त असून समुद्राचे तापमान मासेमारीसाठी अनुकूल आहे.\n\n### 📋 मुख्य माहिती आणि शिफारस\n- 🎣 **मासेमारीची शक्यता**: **उच्च (87%)**\n- 📍 **अंतर**: **18 किलोमीटर**\n- 🧭 **दिशा**: **नैऋत्य (Southwest)**\n- 🌿 **क्लोरोफिलचे प्रमाण**: **4.7 mg/m³**\n- 🌡️ **समुद्राच्या पृष्ठभागाचे तापमान (SST)**: **27.9°C**\n- 🌊 **समुद्रस्थिती**: **मध्यम (लाटा 1.4m)**\n\nसमुद्रात जाण्यापूर्वी ताजे हवामान आणि समुद्री इशारे तपासा.",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "रत्नागिरी नैऋत्य मासेमारी क्षेत्र (PFZ-01)",
                latLonStr: "16°51'N, 73°10'E",
                sstAnomaly: "27.9°C (अनुकूल तापमान)",
                chlorophyll: "4.7 mg/m³ (उच्च प्रमाण)",
                confidence: "87%",
                targetSpecies: ["बांगडा (Mackerel)", "तारली (Sardinella)", "सुरमई"],
                distanceNm: "9.7 nm (18 किमी नैऋत्य)",
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
          prose: "आपकी वर्तमान स्थिति से **लगभग 18 किलोमीटर दक्षिण-पश्चिम (Southwest)** दिशा में मछली पकड़ने के लिए अनुकूल क्षेत्र है।\n\nइस क्षेत्र में क्लोरोफिल की मात्रा अधिक है और समुद्र का तापमान मछली पकड़ने के लिए अनुकूल है।\n\n### 📋 मुख्य जानकारी और सिफारिश\n- 🎣 **मछली पकड़ने की संभावना**: **उच्च (87%)**\n- 📍 **दूरी**: **18 किलोमीटर**\n- 🧭 **दिशा**: **दक्षिण-पश्चिम (Southwest)**\n- 🌿 **क्लोरोफिल का स्तर**: **4.7 mg/m³**\n- 🌡️ **समुद्र की सतह का तापमान (SST)**: **27.9°C**\n- 🌊 **समुद्र की स्थिति**: **मध्यम (लहरें 1.4m)**\n\nसमुद्र में जाने से पहले नवीनतम मौसम और समुद्री चेतावनियों की जाँच करें।",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "रत्नागिरी दक्षिण-पश्चिम मत्स्य क्षेत्र (PFZ-01)",
                latLonStr: "16°51'N, 73°10'E",
                sstAnomaly: "27.9°C (अनुकूल तापमान)",
                chlorophyll: "4.7 mg/m³ (उच्च स्तर)",
                confidence: "87%",
                targetSpecies: ["बांगड़ा (Mackerel)", "तारली (Sardinella)", "सुरमई"],
                distanceNm: "9.7 nm (18 किमी दक्षिण-पश्चिम)",
                depthM: 48,
                fuelSavingsEst: "28%",
                advisory: "रत्नागिरी के दक्षिण-पश्चिम में 18 किमी पर अनुकूल स्थितियाँ। सावधानी से आगे बढ़ें।"
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

      // English
      return {
        title: "🎣 Potential Fishing Zone (PFZ-01)",
        prose: "The nearest high-potential fishing zone (**PFZ-01**) is about **18 km southwest** of your current location.\n\nThe area shows high chlorophyll concentration and a suitable sea-surface temperature, indicating favourable fishing conditions.\n\n### 📋 KEY DECISION BULLETINS\n- 🎣 **Fishing Potential**: **HIGH (87%)**\n- 📍 **Distance**: **18 km**\n- 🧭 **Direction**: **Southwest**\n- 🌿 **Chlorophyll-a**: **4.7 mg/m³**\n- 🌡️ **Sea Surface Temp (SST)**: **27.9°C**\n- 🌊 **Sea State**: **Moderate (1.4m waves)**\n\nProceed with caution and monitor marine alerts before departure.",
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
              label: "POTENTIAL FISHING ZONE (PFZ-01) LOCATION MAP",
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

  // ───────────────────────────────────────────────────────────────────────────
  // 2. SEA SAFETY QUESTION
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "FISH_SAFETY",
    keywords: ["safe to go fishing", "tomorrow morning", "sea safety", "सुरक्षित आहे का", "सुरक्षित है"],
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("safe") && s.includes("fishing")) || s.includes("tomorrow morning") || s.includes("सुरक्षित");
    },
    steps: {
      en: ["Checking sea conditions...", "Checking weather forecast...", "Checking safety alerts..."],
      mr: ["समुद्राची स्थिती तपासत आहे...", "हवामानाचा अंदाज तपासत आहे...", "सुरक्षिततेचे इशारे तपासत आहे..."],
      hi: ["समुद्र की स्थिति जाँच रहे हैं...", "मौसम पूर्वानुमान जाँच रहे हैं...", "सुरक्षा चेतावनी जाँच रहे हैं..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🛡️ समुद्र सुरक्षितता निर्देश",
          prose: "उद्या सकाळी समुद्रात मध्यम परिस्थिती राहण्याची शक्यता आहे. वाऱ्याचा वेग सुमारे **18 किमी/तास** आणि लाटांची उंची **1.4 मीटर** पर्यंत पोहोचू शकते. या भागात कोणताही मोठा चक्रीवादळाचा इशारा नाही. मासेमारी शक्य आहे, परंतु निघण्यापूर्वी हवामानाची ताजी माहिती तपासा.\n\n### 📋 सुरक्षितता माहिती\n- 🛡️ **सुरक्षिततेची पातळी**: **मध्यम (सावधानता बाळगा)**\n- 🌊 **लाटांची उंची**: **1.4 मीटर**\n- 🌬️ **वाऱ्याचा वेग**: **18 किमी/तास (नैऋत्य)**\n- 🌀 **चक्रीवादळाचा इशारा**: **काहीही नाही**\n- 💡 **शिफारस**: निघण्यापूर्वी हवामानाची ताजी परिस्थिती तपासा.",
          components: [
            {
              type: "risk-card",
              data: {
                score: 35,
                riskScore: 35,
                status: "मध्यम सुरक्षितता",
                zone: "रत्नागिरी किनारी भाग",
                title: "समुद्र सुरक्षितता निर्देश — मध्यम परिस्थिती",
                description: "वारा 18 किमी/तास नैऋत्य, लाटांची उंची 1.4 मी. कोणताही चक्रीवादळ इशारा नाही.",
                coordinates: "16.99°N, 73.31°E",
                swell: "1.4 मी मध्यम",
                wind: "18 किमी/तास नैऋत्य"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "किनारी सुरक्षितता नकाशा",
                center: [16.99, 73.31],
                zoom: 8,
                markers: [
                  { latlng: [16.99, 73.31], icon: "🟢", popup: "रत्नागिरी भाग: मध्यम समुद्रस्थिती (1.4m लाटा)" }
                ]
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        return {
          title: "🛡️ समुद्र सुरक्षा निर्देश",
          prose: "कल सुबह समुद्र में मध्यम स्थिति रहने की संभावना है। हवा की गति लगभग **18 किमी/घंटा** और लहरों की ऊँचाई **1.4 मीटर** तक पहुँच सकती है। इस क्षेत्र में कोई बड़ा चक्रवात का अलर्ट सक्रिय नहीं है। मछली पकड़ना संभव है, लेकिन जाने से पहले मौसम की जानकारी की जाँच करें।\n\n### 📋 सुरक्षा जानकारी\n- 🛡️ **सुरक्षा का स्तर**: **मध्यम (सावधानी बरतें)**\n- 🌊 **लहरों की ऊँचाई**: **1.4 मीटर**\n- 🌬️ **हवा की गति**: **18 किमी/घंटा (दक्षिण-पश्चिम)**\n- 🌀 **चक्रवात अलर्ट**: **कोई नहीं**\n- 💡 **सिफारिश**: प्रस्थान करने से पहले नवीनतम मौसम की स्थिति की जाँच करें।",
          components: [
            {
              type: "risk-card",
              data: {
                score: 35,
                riskScore: 35,
                status: "मध्यम सुरक्षा",
                zone: "रत्नागिरी तटीय क्षेत्र",
                title: "समुद्र सुरक्षा निर्देश — मध्यम स्थिति",
                description: "हवा 18 किमी/घंटा दक्षिण-पश्चिम, लहरों की ऊँचाई 1.4 मी। कोई चक्रवात अलर्ट नहीं।",
                coordinates: "16.99°N, 73.31°E",
                swell: "1.4 मी मध्यम",
                wind: "18 किमी/घंटा दक्षिण-पश्चिम"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "तटीय सुरक्षा मानचित्र",
                center: [16.99, 73.31],
                zoom: 8,
                markers: [
                  { latlng: [16.99, 73.31], icon: "🟢", popup: "रत्नागिरी क्षेत्र: मध्यम समुद्र स्थिति (1.4m लहरें)" }
                ]
              }
            }
          ]
        };
      }

      return {
        title: "🛡️ Marine Sea Safety Directive",
        prose: "Tomorrow morning is expected to have **moderate sea conditions**. Winds may reach around **18 km/h** and wave height may reach **1.4 metres**. No major cyclone alert is active in the area. Fishing is possible, but you should monitor weather and marine advisories before departure.\n\n### 📋 KEY SAFETY BULLETINS\n- 🛡️ **Safety Level**: **MODERATE**\n- 🌊 **Wave Height**: **1.4 m**\n- 🌬️ **Wind Speed**: **18 km/h SW**\n- 🌀 **Cyclone Alert**: **None**\n- 💡 **Recommendation**: Monitor conditions before departure.",
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

  // ───────────────────────────────────────────────────────────────────────────
  // 3. CURRENT SEA CONDITIONS
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "FISH_CONDITIONS",
    keywords: ["tide", "weather and sea conditions", "near my fishing location", "भरती-ओहोटी", "मौसम और ज्वार-भाटा"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("tide") || s.includes(" भरती") || s.includes("ज्वार") || (s.includes("sea") && s.includes("condition"));
    },
    steps: {
      en: ["Checking sea conditions...", "Checking weather...", "Checking tide schedule..."],
      mr: ["समुद्राची स्थिती तपासत आहे...", "हवामान तपासत आहे...", "भरती-ओहोटीचे वेळापत्रक तपासत आहे..."],
      hi: ["समुद्र की स्थिति जाँच रहे हैं...", "मौसम जाँच रहे हैं...", "ज्वार-भाटा समय सारणी जाँच रहे हैं..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🌊 भरती-ओहोटी, हवामान आणि समुद्रस्थिती",
          prose: "तुमच्या सध्याच्या ठिकाणाजवळ समुद्र मध्यम शांत आहे. पाण्याचे तापमान **28.4°C** आहे, लाटांची उंची सुमारे **1.4 मीटर** आहे आणि वारा नैऋत्येकडून सुमारे **18 किमी/तास** वेगाने वाहत आहे. पुढील मोठी भरती दुपारी **2:35 वाजता** येण्याची शक्यता आहे.\n\n### 📋 समुद्र आणि हवामान माहिती\n- 🌊 **समुद्रस्थिती**: **लाटांची उंची 1.4 मीटर (मध्यम)**\n- 🌡️ **समुद्र तापमान (SST)**: **28.4°C**\n- 💨 **वाऱ्याचा वेग**: **18 किमी/तास (नैऋत्य)**\n- 🌙 **भरती-ओहोटी**: **मोठी भरती: दुपारी 2:35 | ओहोटी: रात्री 9:10 (उंची: 2.1 मीटर)**",
          components: [
            {
              type: "weather-card",
              data: {
                pressure: "1009.4 hPa",
                sst: "28.4°C",
                wind: "18 किमी/तास नैऋत्य",
                swell: "1.4 मीटर",
                visibility: "7.2 किमी"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "रत्नागिरी भरती-ओहोटी केंद्र नकाशा",
                center: [16.99, 73.31],
                zoom: 8,
                markers: [
                  { latlng: [16.99, 73.31], icon: "🌊", popup: "रत्नागिरी केंद्र (मोठी भरती दुपारी 2:35)" }
                ]
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        return {
          title: "🌊 ज्वार-भाटा, मौसम और समुद्र की स्थिति",
          prose: "आपकी वर्तमान स्थिति के पास समुद्र मध्यम शांत है। पानी का तापमान **28.4°C** है, लहरों की ऊँचाई लगभग **1.4 मीटर** है और हवा दक्षिण-पश्चिम से लगभग **18 किमी/घंटा** की गति से चल रही है। अगला उच्च ज्वार दोपहर **2:35 बजे** आने की उम्मीद है।\n\n### 📋 समुद्र और मौसम की जानकारी\n- 🌊 **समुद्र की स्थिति**: **लहरों की ऊँचाई 1.4 मीटर (मध्यम)**\n- 🌡️ **समुद्र का तापमान (SST)**: **28.4°C**\n- 💨 **हवा की गति**: **18 किमी/घंटा (दक्षिण-पश्चिम)**\n- 🌙 **ज्वार-भाटा**: **उच्च ज्वार: दोपहर 2:35 | निम्न ज्वार: रात 9:10 (ऊँचाई: 2.1 मीटर)**",
          components: [
            {
              type: "weather-card",
              data: {
                pressure: "1009.4 hPa",
                sst: "28.4°C",
                wind: "18 किमी/घंटा दक्षिण-पश्चिम",
                swell: "1.4 मीटर",
                visibility: "7.2 किमी"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "रत्नागिरी ज्वार-भाटा केंद्र मानचित्र",
                center: [16.99, 73.31],
                zoom: 8,
                markers: [
                  { latlng: [16.99, 73.31], icon: "🌊", popup: "रत्नागिरी केंद्र (उच्च ज्वार दोपहर 2:35 बजे)" }
                ]
              }
            }
          ]
        };
      }

      return {
        title: "🌊 Tide, Weather & Sea Conditions",
        prose: "Near your current location (**Ratnagiri Coast**), the sea is **moderately calm**. The water temperature is **28.4°C**, wave height is around **1.4 metres** and wind is coming from the southwest at approximately **18 km/h**. The next high tide is expected around **2:35 PM**.\n\n### 📋 KEY CONDITIONS BULLETINS\n- 🌊 **Sea State**: **Wave Height 1.4 m (Moderate)**\n- 🌡️ **Sea Surface Temp (SST)**: **28.4°C**\n- 💨 **Wind Speed**: **18 km/h SW**\n- 🌙 **Tide**: **High Tide: 2:35 PM | Low Tide: 9:10 PM (Height: 2.1 m)**",
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

  // ───────────────────────────────────────────────────────────────────────────
  // 4. LIGHTNING / CYCLONE ALERT
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "FISH_ALERT",
    keywords: ["lightning or cyclone", "alerts in my area", "thunderstorm", "चक्रीवादळ", "चक्रवात", "विजा"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("lightning") || s.includes("cyclone") || s.includes("चक्रीवादळ") || s.includes("चक्रवात") || s.includes("विजा");
    },
    steps: {
      en: ["Checking weather radar...", "Checking cyclone track...", "Checking safety alerts..."],
      mr: ["हवामान रडार तपासत आहे...", "चक्रीवादळाचा मार्ग तपासत आहे...", "सुरक्षिततेचे इशारे तपासत आहे..."],
      hi: ["मौसम रडार जाँच रहे हैं...", "चक्रवात पथ जाँच रहे हैं...", "सुरक्षा चेतावनी जाँच रहे हैं..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "⚡ धोक्याचा इशारा आणि चक्रीवादळ स्थिती",
          prose: "तुमच्या क्षेत्रासाठी सध्या कोणताही चक्रीवादळाचा इशारा नाही. तथापि, आज संध्याकाळी काही ठिकाणी विजांसह पावसाची शक्यता आहे. समुद्रात जाण्यापूर्वी ताजी माहिती तपासण्याची शिफारस केली जाते.\n\n### 📋 धोक्याचा इशारा\n- 🌀 **चक्रीवादळ स्थिती**: 🟢 **कोणताही सक्रिय इशारा नाही**\n- ⚡ **विजांचा धोका**: 🟡 **कमी**\n- ⛈️ **वादळाची शक्यता**: 🟡 **आज संध्याकाळी शक्यता आहे**",
          components: [
            {
              type: "alert-card",
              data: {
                level: "info",
                title: "वादळ इशारा — किनारी भाग",
                message: "चक्रीवादळ: 🟢 कोणताही इशारा नाही | विजांचा धोका: 🟡 कमी | आज संध्याकाळी विजांसह पावसाची शक्यता.",
                source: "IMD हवामान रडार",
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        return {
          title: "⚡ खतरे की चेतावनी और चक्रवात स्थिति",
          prose: "वर्तमान में आपके क्षेत्र के लिए कोई चक्रवात अलर्ट नहीं है। हालांकि, आज शाम को अलग-थलग स्थानों पर गरज के साथ बारिश की संभावना है। समुद्र में जाने से पहले नवीनतम समुद्री सलाह की जाँच करने की सिफारिश की जाती है।\n\n### 📋 खतरे की चेतावनी\n- 🌀 **चक्रवात स्थिति**: 🟢 **कोई सक्रिय अलर्ट नहीं**\n- ⚡ **बिजली का जोखिम**: 🟡 **कम**\n- ⛈️ **तूफान का जोखिम**: 🟡 **आज शाम को संभावना है**",
          components: [
            {
              type: "alert-card",
              data: {
                level: "info",
                title: "तूफान चेतावनी — तटीय क्षेत्र",
                message: "चक्रवात: 🟢 कोई अलर्ट नहीं | बिजली का जोखिम: 🟡 कम | आज शाम को गरज के साथ बारिश संभव।",
                source: "IMD मौसम रडार",
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
              }
            }
          ]
        };
      }

      return {
        title: "⚡ Hazard & Alert Assessment",
        prose: "There is **currently no cyclone alert** for your area. However, **isolated thunderstorms are possible later today**. I recommend checking the latest marine advisory before going offshore.\n\n### 📋 ALERT SUMMARY\n- 🌀 **Cyclone Status**: 🟢 **No active alert**\n- ⚡ **Lightning Risk**: 🟡 **Low**\n- ⛈️ **Thunderstorm Risk**: 🟡 **Possible later today**",
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
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. SAFEST ROUTE
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "FISH_ROUTE",
    keywords: ["safest route to the fishing zone", "which route is safer", "safe route", "सुरक्षित मार्ग", "सुरक्षित रास्ता"],
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("route") && (s.includes("safe") || s.includes("fishing"))) || s.includes("सुरक्षित मार्ग") || s.includes("सुरक्षित रास्ता");
    },
    steps: {
      en: ["Checking wave conditions along corridors...", "Checking restricted perimeters...", "Calculating safe passage..."],
      mr: ["मार्गावरील लाटांची स्थिती तपासत आहे...", "प्रतिबंधित क्षेत्राची सीमा तपासत आहे...", "सुरक्षित मार्गाची गणना करत आहे..."],
      hi: ["मार्ग पर लहरों की स्थिति जाँच रहे हैं...", "प्रतिबंधित क्षेत्र की सीमा जाँच रहे हैं...", "सुरक्षित मार्ग की गणना कर रहे हैं..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🧭 शिफारस केलेला सुरक्षित मार्ग",
          prose: "नैऋत्येकडील मार्ग (**Southwest Route**) सध्या अधिक योग्य पर्याय आहे. हा मार्ग पश्चिमेकडील जास्त लाटांचा भाग टाळतो आणि संरक्षित समुद्री क्षेत्रापासून सुरक्षित अंतर ठेवतो.\n\n### 📋 सुरक्षित मार्ग माहिती\n- 🧭 **शिफारस केलेला मार्ग**: **नैऋत्य मार्ग (Southwest Route)**\n- 📍 **अंतर**: **18 किलोमीटर**\n- 🛡️ **धोक्याची पातळी**: **कमी ते मध्यम**\n- 🚧 **प्रतिबंधित क्षेत्र**: **सुरक्षितपणे टाळले (12.4 किमी अंतर)**",
          components: [
            {
              type: "route-preview-card",
              data: {
                name: "नैऋत्य सुरक्षित मार्ग (PFZ-01 कडे)",
                origin: "रत्नागिरी किनारा",
                destination: "PFZ-01 (18 किमी नैऋत्य)",
                distanceNm: "9.7 nm (18 किमी)",
                riskLevel: "कमी ते मध्यम",
                avoidanceArea: "मालवण सागरी अभयारण्य",
                fuelEstimate: "24 लीटर"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "सुरक्षित मार्ग नकाशा",
                center: [16.92, 73.25],
                zoom: 9,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "सध्याचे ठिकाण" },
                  { latlng: [16.85, 73.18], icon: "🏁", popup: "PFZ-01 गंतव्य ठिकाण" }
                ]
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        return {
          title: "🧭 अनुशंसित सुरक्षित मार्ग",
          prose: "दक्षिण-पश्चिम मार्ग (**Southwest Route**) वर्तमान में सबसे पसंदीदा विकल्प है। यह पश्चिम में स्थित उच्च-लहर वाले क्षेत्र से बचाता है और प्रतिबंधित समुद्री क्षेत्र से सुरक्षित दूरी बनाए रखता है।\n\n### 📋 सुरक्षित मार्ग जानकारी\n- 🧭 **अनुशंसित मार्ग**: **दक्षिण-पश्चिम मार्ग (Southwest Route)**\n- 📍 **दूरी**: **18 किलोमीटर**\n- 🛡️ **जोखिम का स्तर**: **कम से मध्यम**\n- 🚧 **प्रतिबंधित क्षेत्र**: **सुरक्षित रूप से बचाया गया (12.4 किमी दूरी)**",
          components: [
            {
              type: "route-preview-card",
              data: {
                name: "दक्षिण-पश्चिम सुरक्षित मार्ग (PFZ-01 की ओर)",
                origin: "रत्नागिरी तट",
                destination: "PFZ-01 (18 किमी दक्षिण-पश्चिम)",
                distanceNm: "9.7 nm (18 किमी)",
                riskLevel: "कम से मध्यम",
                avoidanceArea: "मालवन समुद्री अभयारण्य",
                fuelEstimate: "24 लीटर"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "सुरक्षित मार्ग मानचित्र",
                center: [16.92, 73.25],
                zoom: 9,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "वर्तमान स्थिति" },
                  { latlng: [16.85, 73.18], icon: "🏁", popup: "PFZ-01 गंतव्य" }
                ]
              }
            }
          ]
        };
      }

      return {
        title: "🧭 Recommended Safe Corridor",
        prose: "The **southwest route (Route B)** is currently the preferred option. It avoids the higher-wave region detected to the west and keeps a safe distance from the restricted marine zone.\n\n### 📋 ROUTE BULLETINS\n- 🧭 **Recommended Route**: **Southwest Safe Corridor (Route B)**\n- 📍 **Distance**: **18 km**\n- 🛡️ **Risk Level**: **Low–Moderate**\n- 🚧 **Restricted Zone**: **Avoided (12.4 km clearance)**",
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

  // ───────────────────────────────────────────────────────────────────────────
  // 6. GEOFENCING / RESTRICTED AREA
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "FISH_GEOFENCE",
    keywords: ["approaching any restricted area", "restricted area", "geofencing", "प्रतिबंधित क्षेत्र", "प्रतिबंधित"],
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("restricted") || s.includes("geofence") || s.includes("प्रतिबंधित");
    },
    steps: {
      en: ["Checking vessel GPS coordinates...", "Querying restricted zone polygon layer...", "Evaluating perimeter clearance..."],
      mr: ["जीपीएस स्थान तपासत आहे...", "प्रतिबंधित क्षेत्राची सीमा तपासत आहे...", "अंतर मोजत आहे..."],
      hi: ["जीपीएस स्थिति जाँच रहे हैं...", "प्रतिबंधित क्षेत्र की सीमा जाँच रहे हैं...", "दूरी की गणना कर रहे हैं..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🚧 प्रतिबंधित क्षेत्र आणि सुरक्षितता",
          prose: "तुम्ही सध्या प्रतिबंधित क्षेत्राच्या बाहेर आहात. सर्वात जवळील प्रतिबंधित क्षेत्र (**मालवण सागरी अभयारण्य**) सुमारे **12.4 किमी** अंतरावर आहे. तुमची नाव सीमेजवळ गेल्यास ORCA तुम्हाला सूचित करेल.\n\n### 📋 सीमारेषा स्थिती\n- 🟢 **सध्याची स्थिती**: **प्रतिबंधित क्षेत्राच्या बाहेर (सुरक्षित)**\n- 🚧 **जवळचे प्रतिबंधित क्षेत्र**: **मालवण सागरी अभयारण्य**\n- 📍 **अंतर**: **12.4 किलोमीटर**\n- 🛡️ **सुरक्षितता**: **सुरक्षित**",
          components: [
            {
              type: "recommendation-card",
              data: {
                priority: "INFO",
                heading: "प्रतिबंधित क्षेत्र सीमा स्थिती",
                text: "नाव स्थान सत्यापित. मालवण अभयारण्य सीमेपासून 5 किमी अंतर ठेवा.",
                safeHarbor: "रत्नागिरी बंदर",
                vhf: "VHF CH 16"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "प्रतिबंधित क्षेत्र नकाशा",
                center: [16.50, 73.35],
                zoom: 8,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⛵", popup: "तुमची नाव" },
                  { latlng: [16.05, 73.46], icon: "🚧", popup: "मालवण अभयारण्य (12.4 किमी अंतरावर)" }
                ]
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        return {
          title: "🚧 प्रतिबंधित क्षेत्र और सुरक्षा",
          prose: "आप वर्तमान में प्रतिबंधित क्षेत्र के बाहर हैं। निकटतम प्रतिबंधित क्षेत्र (**मालवन समुद्री अभयारण्य**) लगभग **12.4 किमी** दूर है। यदि आपकी नाव सीमा के पास पहुँचती है तो ORCA आपको सूचित करेगा।\n\n### 📋 सीमा स्थिति\n- 🟢 **वर्तमान स्थिति**: **प्रतिबंधित क्षेत्र के बाहर (सुरक्षित)**\n- 🚧 **निकटतम प्रतिबंधित क्षेत्र**: **मालवन समुद्री अभयारण्य**\n- 📍 **दूरी**: **12.4 किलोमीटर**\n- 🛡️ **सुरक्षा**: **सुरक्षित**",
          components: [
            {
              type: "recommendation-card",
              data: {
                priority: "INFO",
                heading: "प्रतिबंधित क्षेत्र सीमा स्थिति",
                text: "नाव स्थिति सत्यापित। मालवन अभयारण्य सीमा से 5 किमी दूरी बनाए रखें।",
                safeHarbor: "रत्नागिरी बंदरगाह",
                vhf: "VHF CH 16"
              }
            },
            {
              type: "marine-map",
              data: {
                label: "प्रतिबंधित क्षेत्र मानचित्र",
                center: [16.50, 73.35],
                zoom: 8,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⛵", popup: "आपकी नाव" },
                  { latlng: [16.05, 73.46], icon: "🚧", popup: "मालवन अभयारण्य (12.4 किमी दूर)" }
                ]
              }
            }
          ]
        };
      }

      return {
        title: "🚧 Geofencing & Restricted Zone Monitor",
        prose: "You are currently **outside restricted waters**. The nearest predefined restricted zone (**Marine Protected Area — Malvan Coral Sanctuary**) is approximately **12.4 km** away. ORCA will notify you if your vessel approaches the boundary.\n\n### 📋 GEOFENCE BULLETINS\n- 🟢 **Vessel Status**: **Outside Restricted Zone**\n- 🚧 **Nearest Restricted Area**: **Marine Protected Area (Malvan Sanctuary)**\n- 📍 **Distance**: **12.4 km**\n- 🛡️ **Clearance**: **Safe**",
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

  // ───────────────────────────────────────────────────────────────────────────
  // 7. CONTEXTUAL FOLLOW-UP QUESTION ("Is it safe to go there?")
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "FISH_FOLLOWUP",
    keywords: ["is it safe to go there", "go there", "safe to go there", "तिथे जाणे सुरक्षित आहे का", "वहाँ जाना सुरक्षित है"],
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("there") && (s.includes("safe") || s.includes("go"))) || s.includes("तिथे जाणे") || s.includes("वहाँ जाना");
    },
    steps: {
      en: ["Checking last referenced location (PFZ-01)...", "Checking wave conditions along route...", "Evaluating overall trip risk..."],
      mr: ["संदर्भित ठिकाण तपासत आहे (PFZ-01)...", "मार्गावरील लाटा तपासत आहे...", "प्रवासाचा धोका मोजत आहे..."],
      hi: ["संदर्भित स्थान जाँच रहे हैं (PFZ-01)...", "मार्ग पर लहरें जाँच रहे हैं...", "यात्रा जोखिम का मूल्यांकन कर रहे हैं..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      const topic = sessionMemory.lastTopic || 'PFZ-01';

      if (targetLang === 'mr') {
        return {
          title: `🛡️ ${topic} कडे प्रवासाची सुरक्षितता`,
          prose: `**${topic}** कडे जाणाऱ्या मार्गावर सध्या **मध्यम धोका** आहे. लाटांची उंची सुमारे **1.4 मीटर** आहे आणि कोणताही चक्रीवादळाचा इशारा नाही. प्रवास करणे शक्य आहे, पण हवामानावर लक्ष ठेवा.\n\n### 📋 प्रवास माहिती\n- 📍 **गंतव्य ठिकाण**: **${topic} (18 किमी नैऋत्य)**\n- 🛡️ **धोक्याची पातळी**: **मध्यम**\n- 🌊 **लाटांची उंची**: **1.4 मीटर**\n- 🌀 **चक्रीवादळ इशारा**: **काहीही नाही**\n- 💡 **शिफारस**: प्रवासासाठी योग्य. नियमित खबरदारी बाळगा.`,
          components: [
            {
              type: "risk-card",
              data: {
                score: 35,
                riskScore: 35,
                status: "मध्यम धोका",
                zone: `${topic} मार्ग`,
                title: `${topic} प्रवास सुरक्षितता`,
                description: `${topic} कडे जाणारा मार्ग स्पष्ट आहे. लाटा 1.4मी.`,
                coordinates: "16.85°N, 73.18°E",
                swell: "1.4 मी मध्यम",
                wind: "18 किमी/तास नैऋत्य"
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        return {
          title: `🛡️ ${topic} यात्रा सुरक्षा`,
          prose: `**${topic}** की ओर जाने वाले मार्ग पर वर्तमान में **मध्यम जोखिम** है। लहरों की ऊँचाई लगभग **1.4 मीटर** है और कोई चक्रवात अलर्ट नहीं है। यात्रा सुरक्षित है, लेकिन मौसम पर नज़र रखें।\n\n### 📋 यात्रा जानकारी\n- 📍 **गंतव्य**: **${topic} (18 किमी दक्षिण-पश्चिम)**\n- 🛡️ **जोखिम स्तर**: **मध्यम**\n- 🌊 **लहरों की ऊँचाई**: **1.4 मीटर**\n- 🌀 **चक्रवात अलर्ट**: **कोई नहीं**\n- 💡 **सिफारिश**: यात्रा संभव है। मानक सावधानियां बरतें।`,
          components: [
            {
              type: "risk-card",
              data: {
                score: 35,
                riskScore: 35,
                status: "मध्यम जोखिम",
                zone: `${topic} मार्ग`,
                title: `${topic} यात्रा सुरक्षा`,
                description: `${topic} मार्ग स्पष्ट। लहरें 1.4मी।`,
                coordinates: "16.85°N, 73.18°E",
                swell: "1.4 मी मध्यम",
                wind: "18 किमी/घंटा दक्षिण-पश्चिम"
              }
            }
          ]
        };
      }

      return {
        title: `🛡️ Transit Safety to ${topic}`,
        prose: `The route to **${topic}** currently has **moderate risk**. Wave height is around **1.4 metres** and no major cyclone alert is active in the sector.\n\n### 📋 TRANSIT SAFETY BULLETINS\n- 📍 **Destination**: **${topic} (18 km SW)**\n- 🛡️ **Risk Level**: **Moderate**\n- 🌊 **Wave Height**: **1.4 m**\n- 🌀 **Cyclone Threat**: **None**\n- 💡 **Recommendation**: Safe for transit. Maintain normal coastal safety precautions.`,
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
  }

];

export function findMockResponse(queryText, userSelectedLang = 'en') {
  if (!MOCK_MODE || !queryText) return null;
  const targetLang = detectOrResolveLanguage(queryText, userSelectedLang);
  const q = queryText.toLowerCase().trim();

  for (const resp of MOCK_RESPONSES) {
    if (typeof resp.match === 'function' && resp.match(q)) {
      if (typeof resp.getAnswer === 'function') {
        const ans = resp.getAnswer(q, targetLang);
        const steps = (resp.steps && resp.steps[targetLang]) ? resp.steps[targetLang] : (resp.steps?.en || ["Processing marine query..."]);

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

  return null;
}
