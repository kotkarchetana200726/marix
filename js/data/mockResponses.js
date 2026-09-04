// MARIX Marine AI — Centralized Multilingual Mock Data & Response System
// STRICT MULTILINGUAL CONTRACT: Marathi in -> 100% Marathi out; Hindi in -> 100% Hindi out; English in -> 100% English out.

import { marineData, sessionMemory, updateSessionMemory } from './marineData.js';
import { mockDataService } from '../services/mockDataService.js';

export const MOCK_MODE = true;

export function detectOrResolveLanguage(queryText, selectedLang) {
  // If user explicitly selected 'mr' or 'hi' in the UI switcher, honor it strictly
  if (selectedLang === 'mr' || selectedLang === 'hi') {
    return selectedLang;
  }

  // Next inspect queryText for Devanagari script (Marathi / Hindi)
  if (queryText && typeof queryText === 'string') {
    const q = queryText.toLowerCase();
    const hasDevanagari = /[\u0900-\u097F]/.test(queryText);

    if (hasDevanagari) {
      const mrWords = ["आहे", "मासेमारी", "कुठे", "झाले", "काय", "जागा", "उद्या", "सकाळी", "भरती", "ओहोटी", "वादळ", "मार्ग", "सांगा", "सागरी", "नैऋत्य", "तपासा", "करा", "शक्यता", "लाटा", "किंवा", "काही", "नाही", "चांगली", "क्षेत्रांमधील", "तुलना", "कमी"];
      const hiWords = ["कहाँ", "है", "मछली", "पकड़ने", "पकड़ना", "जगह", "क्या", "रास्ता", "बताएं", "कल", "सुबह", "मौसम", "ज्वार", "भाटा", "चक्रवात", "जाँचें", "करें", "संभावना", "लहरें", "या", "कोई", "नहीं", "अच्छी", "क्षेत्रों", "तुलना", "कम"];

      let mrScore = 0;
      let hiScore = 0;
      mrWords.forEach(w => { if (q.includes(w)) mrScore++; });
      hiWords.forEach(w => { if (q.includes(w)) hiScore++; });

      if (mrScore > hiScore) return 'mr';
      if (hiScore > mrScore) return 'hi';

      return selectedLang === 'hi' ? 'hi' : 'mr'; // default Devanagari
    }
  }

  return 'en';
}

export const MOCK_RESPONSES = [

  // ───────────────────────────────────────────────────────────────────────────
  // 1. RESTRICTED ZONE / ACTIVE HAZARDS (Highest priority)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "RESTRICTED_ZONE",
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("hazard") || s.includes("restricted") || s.includes("danger") || s.includes("prohibit") ||
             s.includes("naval") || s.includes("drill") || s.includes("firing") || s.includes("elevated marine risk") ||
             s.includes("धोका") || s.includes("प्रतिबंधित") || s.includes("धोके") || s.includes("नौदल") || s.includes("सराव") ||
             s.includes("खतरा") || s.includes("खतरे") || s.includes("नौसेना") || s.includes("अभ्यास") || s.includes("जोखिम");
    },
    steps: {
      en: ["[01] Checking maritime security zones...", "[02] Scanning active naval warnings...", "[03] Generating hazard advisory..."],
      mr: ["[01] सागरी सुरक्षा क्षेत्रांची तपासणी करत आहे...", "[02] नौदल सूचना तपासत आहे...", "[03] धोका इशारा तयार करत आहे..."],
      hi: ["[01] समुद्री सुरक्षा क्षेत्रों की जाँच की जा रही है...", "[02] नौसेना चेतावनियों को स्कैन किया जा रहा है...", "[03] चेतावनी तैयार की जा रही है..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🔴 सागरी धोके आणि प्रतिबंधित क्षेत्रे",
          verdict_tag: "🔴 RESTRICTED",
          verdict_title: "🔴 प्रतिबंधित क्षेत्र इशारा: नेव्हल एक्सरसाइज झोन",
          simple_sentence: "रत्नागिरीच्या पश्चिमेस ३५ सागरी मैलांवर नौदलाचा सराव सुरू असल्याने त्या भागात जाण्यास सक्त मनाई आहे.",
          bullets: ["⛔ क्षेत्र: नेव्हल एक्सरसाइज झोन (झोन ब्राव्हो)", "📍 अंतर: ३५ सागरी मैल पश्चिम", "⏰ वेळ: पुढील २४ तास लागू", "🚨 प्रवेश: सक्त मनाई"],
          action_advice: "सर्व जहाजांनी व बोटींनी हा परिसर टाळून दक्षिण मार्गाने प्रवास करावा.",
          speech_text: "सावधान. रत्नागिरीच्या पश्चिमेस ३५ सागरी मैलांवर नौदलाचा सराव सुरू असल्याने त्या भागात जाण्यास सक्त मनाई आहे. सर्व बोटींनी हा परिसर टाळून दक्षिणेकडील मार्गाने प्रवास करावा.",
          prose: "**🔴 सागरी धोके आणि प्रतिबंधित क्षेत्र इशारा**\n\nरत्नागिरीच्या पश्चिमेस **३५ सागरी मैल** अंतरावर 'झोन ब्राव्हो' मध्ये नौदल सराव चालू आहे.\n\n### 📋 मुख्य सुरक्षा माहिती\n- ⛔ **क्षेत्र**: **नेव्हल एक्सरसाइज झोन (झोन ब्राव्हो)**\n- 📍 **अंतर**: **३५ सागरी मैल पश्चिम**\n- ⏰ **कालावधी**: **पुढील २४ तास लागू**\n- 🚨 **प्रवेश**: **सक्त मनाई (Restricted Zone)**\n\nसर्व जहाजांनी हा परिसर टाळावा.",
          components: [
            {
              type: "marine-map",
              data: {
                label: "प्रतिबंधित क्षेत्र नकाशा",
                center: [16.99, 72.8],
                zoom: 8,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "रत्नागिरी बंदर" },
                  { latlng: [16.99, 72.8], icon: "⛔", popup: "प्रतिबंधित क्षेत्र (झोन ब्राव्हो)" }
                ]
              }
            }
          ]
        };
      }
      if (targetLang === 'hi') {
        return {
          title: "🔴 समुद्री खतरे और प्रतिबंधित क्षेत्र",
          verdict_tag: "🔴 RESTRICTED",
          verdict_title: "🔴 प्रतिबंधित क्षेत्र चेतावनी: नौसेना अभ्यास क्षेत्र",
          simple_sentence: "रत्नागिरी के पश्चिम में 35 समुद्री मील दूर नौसेना अभ्यास जारी है, उस क्षेत्र में जाना सख्त मना है।",
          bullets: ["⛔ क्षेत्र: नौसेना अभ्यास क्षेत्र (ज़ोन ब्रावो)", "📍 दूरी: 35 समुद्री मील पश्चिम", "⏰ समय: अगले 24 घंटे लागू", "🚨 प्रवेश: पूर्ण प्रतिबंध"],
          action_advice: "सभी नाविकों को इस क्षेत्र से दूर रहने और दक्षिणी मार्ग अपनाने की सलाह दी जाती है।",
          speech_text: "सावधान. रत्नागिरी के पश्चिम में 35 समुद्री मील दूर नौसेना अभ्यास जारी है, उस क्षेत्र में जाना सख्त मना है। सभी नाविक इस क्षेत्र से दूर रहें और दक्षिणी मार्ग अपनाएं।",
          prose: "**🔴 समुद्री खतरे और प्रतिबंधित क्षेत्र चेतावनी**\n\nरत्नागिरी के पश्चिम में **35 समुद्री मील** पर 'ज़ोन ब्रावो' में नौसेना अभ्यास जारी है।\n\n### 📋 मुख्य सुरक्षा विवरण\n- ⛔ **क्षेत्र**: **नौसेना अभ्यास क्षेत्र (ज़ोन ब्रावो)**\n- 📍 **दूरी**: **35 समुद्री मील पश्चिम**\n- ⏰ **अवधि**: **अगले 24 घंटे लागू**\n- 🚨 **प्रवेश**: **सख्त मना (Restricted Zone)**",
          components: [
            {
              type: "marine-map",
              data: {
                label: "प्रतिबंधित क्षेत्र मानचित्र",
                center: [16.99, 72.8],
                zoom: 8,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "रत्नागिरी बंदरगाह" },
                  { latlng: [16.99, 72.8], icon: "⛔", popup: "प्रतिबंधित क्षेत्र (ज़ोन ब्रावो)" }
                ]
              }
            }
          ]
        };
      }
      return {
        title: "🔴 Active Marine Hazards & Restricted Zones",
        verdict_tag: "🔴 RESTRICTED",
        verdict_title: "🔴 Restricted Area Notice: Naval Live Fire Exercise",
        simple_sentence: "Zone Bravo, located 35 nautical miles west of Ratnagiri, is strictly prohibited due to active naval firing drills.",
        bullets: ["⛔ Zone: Naval Firing Exercise Area (Zone Bravo)", "📍 Distance: 35 NM West", "⏰ Duration: Next 24 hours", "🚨 Entry: Strictly Prohibited"],
        action_advice: "All vessels must maintain a 10-nautical-mile buffer and divert via southern waypoint corridor.",
        speech_text: "Alert. Zone Bravo, located 35 nautical miles west of Ratnagiri, is strictly prohibited due to active naval firing drills. All vessels must divert via southern waypoint corridor.",
        prose: "**🔴 Active Marine Hazards & Restricted Zone Notice**\n\nNaval firing drills are active in **Zone Bravo**, 35 NM west of Ratnagiri.\n\n### 📋 KEY RESTRICTION BULLETINS\n- ⛔ **Zone**: **Zone Bravo (Live Fire Drill)**\n- 📍 **Location**: **35 NM West of Ratnagiri**\n- ⏰ **Duration**: **Active next 24 hours**\n- 🚨 **Status**: **STRICTLY PROHIBITED TO COMMERCIAL TRAFFIC**",
        components: [
          {
            type: "marine-map",
            data: {
              label: "HAZARD ZONE MAP",
              center: [16.99, 72.8],
              zoom: 8,
              markers: [
                { latlng: [16.99, 73.31], icon: "⚓", popup: "Ratnagiri Port" },
                { latlng: [16.99, 72.8], icon: "⛔", popup: "Zone Bravo (Restricted)" }
              ]
            }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. CYCLONE / LIGHTNING ALERT
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "CYCLONE_ALERT",
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("cyclone") || s.includes("lightning") || s.includes("storm") || s.includes("squall") ||
             s.includes("चक्रीवादळ") || s.includes("वादळ") || s.includes("विजा") ||
             s.includes("चक्रवात") || s.includes("बिजली") || s.includes("तूफान") || s.includes("आंधी") ||
             ((s.includes("alert") || s.includes("चेतावनी") || s.includes("इशारा")) && !s.includes("route") && !s.includes("मार्ग") && !s.includes("रास्ता"));
    },
    steps: {
      en: ["[01] Interrogating IMD Doppler Radar feeds...", "[02] Tracking atmospheric low pressure zones...", "[03] Compiling alert summary..."],
      mr: ["[01] हवामान डॉपलर रडार तपासत आहे...", "[02] हवेचा दाब आणि वादळाची शक्यता मोजत आहे...", "[03] इशारा अहवाल तयार करत आहे..."],
      hi: ["[01] डॉपलर रडार डेटा की जाँच की जा रही है...", "[02] कम दबाव वाले क्षेत्रों की निगरानी की जा रही है...", "[03] चेतावनी रिपोर्ट तैयार की जा रही है..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🟡 हवामान आणि वादळ इशारा स्थिती",
          verdict_tag: "🟡 MODERATE",
          verdict_title: "🟡 कोणताही चक्रीवादळाचा इशारा नाही — हलक्या विजांची शक्यता",
          simple_sentence: "रत्नागिरी आणि सिंधुदुर्ग किनारपट्टीवर सध्या कोणताही चक्रीवादळाचा इशारा नाही, मात्र संध्याकाळी हलक्या विजा चमकण्याची शक्यता आहे.",
          bullets: ["🌀 चक्रीवादळ: कोणताही इशारा नाही (सुरक्षित)", "⚡ विजा: संध्याकाळी ४ नंतर हलकी शक्यता", "🌬️ वाऱ्याचा वेग: १८ ते २२ किमी/तास", "🌊 समुद्राची स्थिती: मध्यम शांत"],
          action_advice: "संध्याकाळपूर्वी सुरक्षित किनाऱ्यावर परतण्याची दक्षता घ्या.",
          speech_text: "रत्नागिरी आणि सिंधुदुर्ग किनारपट्टीवर सध्या कोणताही चक्रीवादळाचा इशारा नाही. समुद्राची स्थिती मध्यम असून संध्याकाळी हलक्या विजा चमकण्याची शक्यता आहे. दुपारी तीन वाजेपूर्वी किनाऱ्यावर परतावे.",
          prose: "**🟡 हवामान आणि वादळ इशारा स्थिती**\n\nरत्नागिरी किनारपट्टीवर सध्या **कोणताही चक्रीवादळ इशारा नाही**.\n\n### 📋 मुख्य हवामान माहिती\n- 🌀 **चक्रीवादळ इशारा**: **नाही (सामान्य स्थिती)**\n- ⚡ **विजांची शक्यता**: **दुपारी १६:०० नंतर हलकी शक्यता**\n- 🌬️ **वाऱ्याचा वेग**: **१८-२२ किमी/तास**\n- 🌊 **लाटांची स्थिती**: **१.४ मीटर (मध्यम)**\n\nदुपारी १५:०० पूर्वी किनाऱ्यावर परतणे श्रेयस्कर राहील.",
          components: [
            {
              type: "weather-card",
              data: { sst: "28.4°C", wind: "18 किमी/तास नैऋत्य", swell: "1.4 मीटर", pressure: "1009.4 hPa" }
            }
          ]
        };
      }
      if (targetLang === 'hi') {
        return {
          title: "🟡 मौसम और चक्रवात चेतावनी स्थिति",
          verdict_tag: "🟡 MODERATE",
          verdict_title: "🟡 कोई चक्रवात चेतावनी नहीं — हल्की बिजली की संभावना",
          simple_sentence: "रत्नागिरी तट पर वर्तमान में कोई चक्रवात चेतावनी नहीं है, लेकिन शाम को हल्की बिजली चमकने की संभावना है।",
          bullets: ["🌀 चक्रवात: कोई चेतावनी नहीं (सामान्य)", "⚡ बिजली: शाम 4 बजे के बाद हल्की संभावना", "🌬️ हवा की गति: 18-22 किमी/घंटा", "🌊 समुद्र: मध्यम शांत"],
          action_advice: "शाम से पहले सुरक्षित बंदरगाह पर लौटने की सलाह दी जाती है।",
          speech_text: "रत्नागिरी तट पर वर्तमान में कोई चक्रवात चेतावनी नहीं है। समुद्र की स्थिति मध्यम शांत है। शाम को हल्की बिजली चमकने की संभावना है। दोपहर 3 बजे से पहले लौटने की सलाह दी जाती है।",
          prose: "**🟡 मौसम और चक्रवात चेतावनी स्थिति**\n\nरत्नागिरी तट पर वर्तमान में **कोई चक्रवात चेतावनी नहीं है**।\n\n### 📋 मुख्य मौसम विवरण\n- 🌀 **चक्रवात चेतावनी**: **नहीं (सामान्य)**\n- ⚡ **बिजली की संभावना**: **शाम 16:00 के बाद हल्की**\n- 🌬️ **हवा की गति**: **18-22 किमी/घंटा दक्षिण-पश्चिम**\n- 🌊 **लहरें**: **1.4 मीटर (मध्यम)**\n\nदोपहर 15:00 बजे से पहले लौटने की सलाह दी जाती है।",
          components: [
            {
              type: "weather-card",
              data: { sst: "28.4°C", wind: "18 किमी/घंटा दक्षिण-पश्चिम", swell: "1.4 मीटर", pressure: "1009.4 hPa" }
            }
          ]
        };
      }
      return {
        title: "🟡 Cyclone & Lightning Alert Status",
        verdict_tag: "🟡 MODERATE",
        verdict_title: "🟡 No Cyclone Alert Active — Isolated Evening Squalls",
        simple_sentence: "There is currently no cyclone warning active along the Ratnagiri sector. Isolated lightning is possible after 4:00 PM.",
        bullets: ["🌀 Cyclone Alert: None Active", "⚡ Lightning Risk: Isolated after 16:00 hrs", "🌬️ Wind Speed: 18 to 22 km/h SW", "🌊 Sea State: Moderate (1.4 m)"],
        action_advice: "Plan fishing trips for morning hours and return to harbor before 15:00 hrs.",
        speech_text: "There is currently no cyclone warning active along the Ratnagiri sector. Wave swells are 1.4 metres and wind is 18 kilometres per hour. Return to harbor before 3:00 PM.",
        prose: "**🟡 Cyclone & Lightning Alert Status**\n\nNo tropical cyclone warnings are currently active for Ratnagiri.\n\n### 📋 KEY WEATHER BULLETINS\n- 🌀 **Cyclone Status**: **NO THREAT ACTIVE**\n- ⚡ **Lightning Probability**: **Low / Isolated after 16:00**\n- 🌬️ **Wind Speed**: **18-22 km/h SW**\n- 🌊 **Wave Swells**: **1.4 m (Moderate)**\n\nReturn to port by 15:00 hrs to avoid squalls.",
        components: [
          {
            type: "weather-card",
            data: { sst: "28.4°C", wind: "18 km/h SW", swell: "1.4 m", pressure: "1009.4 hPa" }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. SAFEST ROUTE / NAVIGATION OPTIMIZATION (Must match before SEA_SAFETY)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "ROUTE_OPTIMIZE",
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("route") || s.includes("navigation") || s.includes("path") || s.includes("corridor") || s.includes("waypoint") ||
             s.includes("मार्ग") || s.includes("जलमार्ग") || s.includes("रस्ता") ||
             s.includes("रास्ता");
    },
    steps: {
      en: ["[01] Analyzing navigational bathymetry...", "[02] Calculating minimum fuel corridor...", "[03] Rendering optimized waypoint plan..."],
      mr: ["[01] सागरी खोली आणि जलमार्गाचे विश्लेषण करत आहे...", "[02] इंधनाची बचत करणारा सुरक्षित मार्ग शोधत आहे...", "[03] प्रवासाचा नकाशा तयार करत आहे..."],
      hi: ["[01] जलमार्ग और गहराई का विश्लेषण किया जा रहा है...", "[02] न्यूनतम ईंधन वाला सुरक्षित रास्ता खोजा जा रहा है...", "[03] नेविगेशन रूट तैयार किया जा रहा है..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🧭 सर्वात सुरक्षित सागरी जलमार्ग",
          verdict_tag: "🟢 OPTIMAL",
          verdict_title: "🟢 शिफारस केलेला मार्ग: नैऋत्य जलमार्ग (PFZ-01 कडे)",
          simple_sentence: "रत्नागिरी बंदरावरून २२० अंशांवर नैऋत्य दिशेने जाणारा मार्ग सर्वात सुरक्षित असून यात सुमारे २८% इंधनाची बचत होते.",
          bullets: ["🧭 दिशा: २२०° नैऋत्य (Southwest)", "📍 अंतर: १८ किमी (९.७ सागरी मैल)", "⛽ इंधन बचत: अंदाजे २८%", "🌊 लाटा: १.४ मीटर"],
          action_advice: "उत्तरी खडकाळ भाग टाळून थेट दक्षिणेकडील चॅनलने प्रवास करा.",
          speech_text: "रत्नागिरी बंदरावरून नैऋत्य दिशेने जाणारा २२० अंशांचा मार्ग सर्वात सुरक्षित आहे. यामध्ये १८ किलोमीटर अंतरावर सुमारे २८ टक्के इंधनाची बचत होईल. थेट दक्षिणेकडील चॅनलने प्रवास करावा.",
          prose: "**🧭 सर्वात सुरक्षित सागरी जलमार्ग (रत्नागिरी ते PFZ-01)**\n\nसध्याच्या वाऱ्याचा आणि लाटांचा विचार करता **२२०° नैऋत्य दिशेचा मार्ग** सर्वोत्तम आहे.\n\n### 📋 जलमार्ग माहिती\n- 🧭 **दिशा / हेडिंग**: **२२०° SW**\n- 📍 **अंतर**: **१८ किमी (९.७ NM)**\n- ⛽ **अंदाजे इंधन बचत**: **२८%**\n- ⏱️ **प्रवासाचा वेळ**: **सुमारे १ तास १५ मिनिटे**\n\nउत्तरी खडकाळ परिसर टाळून मुख्य चॅनलने प्रवास करा.",
          components: [
            {
              type: "marine-map",
              data: {
                label: "अनुकूलित जलमार्ग नकाशा",
                center: [16.9, 73.25],
                zoom: 10,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "रत्नागिरी बंदर" },
                  { latlng: [16.85, 73.18], icon: "🎯", popup: "लक्ष्य: PFZ-01 (18 किमी नैऋत्य)" }
                ]
              }
            }
          ]
        };
      }
      if (targetLang === 'hi') {
        return {
          title: "🧭 सबसे सुरक्षित समुद्री मार्ग",
          verdict_tag: "🟢 OPTIMAL",
          verdict_title: "🟢 अनुशंसित मार्ग: दक्षिण-पश्चिम जलमार्ग (PFZ-01 की ओर)",
          simple_sentence: "रत्नागिरी बंदरगाह से 220 डिग्री दक्षिण-पश्चिम दिशा का मार्ग सबसे सुरक्षित है और इससे लगभग 28% ईंधन की बचत होती है।",
          bullets: ["🧭 दिशा: 220° दक्षिण-पश्चिम (SW)", "📍 दूरी: 18 किमी (9.7 समुद्री मील)", "⛽ ईंधन बचत: लगभग 28%", "🌊 लहरें: 1.4 मीटर"],
          action_advice: "उत्तरी उथले क्षेत्रों से बचें और मुख्य चैनल का पालन करें।",
          speech_text: "रत्नागिरी बंदरगाह से 220 डिग्री दक्षिण-पश्चिम दिशा का मार्ग सबसे सुरक्षित है। 18 किलोमीटर दूरी में लगभग 28 प्रतिशत ईंधन की बचत होगी। मुख्य चैनल से यात्रा करें।",
          prose: "**🧭 सबसे सुरक्षित समुद्री मार्ग (रत्नागिरी से PFZ-01)**\n\nहवा और लहरों के प्रवाह को ध्यान में रखते हुए **220° दक्षिण-पश्चिम मार्ग** सर्वोत्तम है।\n\n### 📋 मार्ग विवरण\n- 🧭 **दिशा**: **220° SW**\n- 📍 **दूरी**: **18 किमी (9.7 NM)**\n- ⛽ **अनुमानित ईंधन बचत**: **28%**\n- ⏱️ **यात्रा समय**: **लगभग 1 घंटा 15 मिनट**",
          components: [
            {
              type: "marine-map",
              data: {
                label: "नेविगेशन रूट मैप",
                center: [16.9, 73.25],
                zoom: 10,
                markers: [
                  { latlng: [16.99, 73.31], icon: "⚓", popup: "रत्नागिरी बंदरगाह" },
                  { latlng: [16.85, 73.18], icon: "🎯", popup: "गंतव्य: PFZ-01" }
                ]
              }
            }
          ]
        };
      }
      return {
        title: "🧭 Safest Marine Navigation Route",
        verdict_tag: "🟢 OPTIMAL",
        verdict_title: "🟢 Recommended Route: 220° Southwest Channel",
        simple_sentence: "The safest transit corridor from Ratnagiri Harbor is heading 220° SW toward PFZ-01, yielding a 28% fuel saving.",
        bullets: ["🧭 Heading: 220° Southwest", "📍 Distance: 18 km (9.7 NM)", "⛽ Fuel Savings: ~28%", "🌊 Swells: 1.4 m"],
        action_advice: "Steer clear of northern reef shoals and navigate within main acoustic channel.",
        speech_text: "The safest navigation route from Ratnagiri is heading 220 degrees southwest toward PFZ-01 with a 28 percent fuel saving and 1.4 metre swells.",
        prose: "**🧭 Safest Marine Navigation Route (Ratnagiri to PFZ-01)**\n\nTaking current swells and wind drift into account, **220° SW heading** provides optimal clearance.\n\n### 📋 NAVIGATION DETAILS\n- 🧭 **Heading**: **220° SW**\n- 📍 **Distance**: **18 km (9.7 NM)**\n- ⛽ **Fuel Conservation**: **~28%**\n- ⏱️ **Estimated Transit Time**: **1 hour 15 minutes**",
        components: [
          {
            type: "marine-map",
            data: {
              label: "OPTIMIZED ROUTE MAP",
              center: [16.9, 73.25],
              zoom: 10,
              markers: [
                { latlng: [16.99, 73.31], icon: "⚓", popup: "Ratnagiri Port" },
                { latlng: [16.85, 73.18], icon: "🎯", popup: "Destination: PFZ-01" }
              ]
            }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. TIDE, WEATHER & SEA CONDITIONS
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "TIDE_WEATHER",
    match: function(q) {
      const s = q.toLowerCase();
      if (s.includes("tomorrow") || s.includes("morning") || s.includes("कल") || s.includes("उद्या") || s.includes("safe to go") || s.includes("सुरक्षित आहे का") || s.includes("सुरक्षित है क्या") || s.includes("route") || s.includes("मार्ग") || s.includes("रास्ता") || s.includes("रस्ता")) {
        return false;
      }
      return s.includes("tide") || s.includes("weather") || s.includes("wave") || s.includes("swell") || s.includes("condition") ||
             s.includes("हवामान") || s.includes("भरती") || s.includes("ओहोटी") || s.includes("लाटा") ||
             s.includes("मौसम") || s.includes("ज्वार") || s.includes("भाटा") || s.includes("लहरें");
    },
    steps: {
      en: ["[01] Reading tidal harmonic telemetry...", "[02] Fetching coastal atmospheric station data...", "[03] Compiling marine conditions report..."],
      mr: ["[01] भरती-ओहोटी माहिती तपासत आहे...", "[02] किनारी हवामान केंद्राचा डेटा घेत आहे...", "[03] सविस्तर अहवाल तयार करत आहे..."],
      hi: ["[01] ज्वार-भाटा डेटा की जाँच की जा रही है...", "[02] तटीय मौसम केंद्र का डेटा लिया जा रहा है...", "[03] विस्तृत समुद्री रिपोर्ट तैयार की जा रही है..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🌊 हवामान, भरती-ओहोटी आणि समुद्राची स्थिती",
          verdict_tag: "🟢 MODERATE",
          verdict_title: "🟢 समुद्राची स्थिती मध्यम शांत (१.४m लाटा, २८.४°C पाणी)",
          simple_sentence: "रत्नागिरी परिसरात समुद्राचे तापमान २८.४°C, वाऱ्याचा वेग १८ किमी/तास आणि मोठी भरती दुपारी २:३५ वाजता आहे.",
          bullets: ["🌊 लाटा: १.४ मीटर (मध्यम शांत)", "🌊 भरती: दुपारी २:३५ वाजता (३.९ मीटर)", "🌬️ वारा: १८ किमी/तास नैऋत्य", "🌡️ समुद्र तापमान: २८.४°C"],
          action_advice: "दुपारी भरतीच्या वेळी किनाऱ्यावर बोटी लावताना काळजी घ्या.",
          speech_text: "रत्नागिरी परिसरात समुद्राची स्थिती मध्यम शांत आहे. समुद्राचे तापमान २८.४ अंश असून लाटांची उंची १.४ मीटर आहे. वाऱ्याचा वेग १८ किलोमीटर प्रति तास आहे आणि मोठी भरती दुपारी २ वाजून ३५ मिनिटांनी आहे.",
          prose: "**🌊 हवामान, भरती-ओहोटी आणि समुद्राची स्थिती**\n\nरत्नागिरी किनारी भागात हवामान आणि समुद्राची स्थिती **मध्यम व अनुकूल** आहे.\n\n### 📋 मुख्य हवामान तपशील\n- 🌊 **लाटांची उंची**: **१.४ मीटर (मध्यम)**\n- 🌊 **भरती वेळा**: **सकाळी ०८:१४ (३.८m) | दुपारी १४:३५ (३.९m)**\n- 🌊 **ओहोटी वेळा**: **दुपारी १४:०५ (०.६m)**\n- 🌬️ **वाऱ्याचा वेग**: **१८ किमी/तास नैऋत्य**\n- 🌡️ **समुद्र तापमान**: **२८.४°C**\n- 🧭 **दृष्यमानता**: **७.२ किमी**",
          components: [
            {
              type: "weather-card",
              data: { sst: "28.4°C", wind: "18 किमी/तास नैऋत्य", swell: "1.4 मीटर", pressure: "1009.4 hPa", visibility: "7.2 km" }
            }
          ]
        };
      }
      if (targetLang === 'hi') {
        return {
          title: "🌊 मौसम, ज्वार-भाटा और समुद्र की स्थिति",
          verdict_tag: "🟢 MODERATE",
          verdict_title: "🟢 समुद्र की स्थिति मध्यम शांत (1.4m लहरें, 28.4°C जल तापमान)",
          simple_sentence: "रत्नागिरी क्षेत्र में समुद्र का तापमान 28.4°C, हवा की गति 18 किमी/घंटा और उच्च ज्वार दोपहर 2:35 बजे है।",
          bullets: ["🌊 लहरें: 1.4 मीटर (मध्यम शांत)", "🌊 ज्वार: दोपहर 2:35 बजे (3.9 मीटर)", "🌬️ हवा: 18 किमी/घंटा दक्षिण-पश्चिम", "🌡️ जल तापमान: 28.4°C"],
          action_advice: "दोपहर के समय नावों को बांधते समय उच्च ज्वार का ध्यान रखें।",
          speech_text: "रत्नागिरी क्षेत्र में समुद्र की स्थिति मध्यम शांत है। समुद्र का तापमान 28.4 डिग्री और लहरें 1.4 मीटर हैं। हवा की गति 18 किलोमीटर प्रति घंटा है और उच्च ज्वार दोपहर 2 बजकर 35 मिनट पर है।",
          prose: "**🌊 मौसम, ज्वार-भाटा और समुद्र की स्थिति**\n\nरत्नागिरी तटीय क्षेत्र में मौसम और समुद्र की स्थिति **मध्यम और अनुकूल** है।\n\n### 📋 मुख्य मौसम विवरण\n- 🌊 **लहरों की ऊँचाई**: **1.4 मीटर (मध्यम)**\n- 🌊 **ज्वार का समय**: **सुबह 08:14 (3.8m) | दोपहर 14:35 (3.9m)**\n- 🌊 **भाटा का समय**: **दोपहर 14:05 (0.6m)**\n- 🌬️ **हवा की गति**: **18 किमी/घंटा दक्षिण-पश्चिम**\n- 🌡️ **समुद्र का तापमान**: **28.4°C**\n- 🧭 **दृश्यता**: **7.2 किमी**",
          components: [
            {
              type: "weather-card",
              data: { sst: "28.4°C", wind: "18 किमी/घंटा दक्षिण-पश्चिम", swell: "1.4 मीटर", pressure: "1009.4 hPa", visibility: "7.2 km" }
            }
          ]
        };
      }
      return {
        title: "🌊 Tide, Weather & Sea Conditions",
        verdict_tag: "🟢 MODERATE",
        verdict_title: "🟢 Sea Conditions Moderate & Calm (1.4m Swells, 28.4°C SST)",
        simple_sentence: "Ratnagiri sea state is moderate with 1.4 m waves, 18 km/h southwest winds, and high tide at 2:35 PM.",
        bullets: ["🌊 Swells: 1.4 m (Moderate)", "🌊 High Tide: 2:35 PM (3.9 m)", "🌬️ Wind: 18 km/h SW", "🌡️ SST: 28.4°C"],
        action_advice: "Secure mooring lines during afternoon high tide cycle.",
        speech_text: "Sea conditions across Ratnagiri sector are moderate and calm. Waves are 1.4 metres, wind speed is 18 kilometres per hour, and high tide is at 2:35 PM.",
        prose: "**🌊 Tide, Weather & Sea Conditions**\n\nCoastal waters across the Ratnagiri sector are **moderate and favorable**.\n\n### 📋 CURRENT TELEMETRY\n- 🌊 **Wave Height**: **1.4 m (Moderate)**\n- 🌊 **High Tides**: **08:14 AM (3.8m) | 02:35 PM (3.9m)**\n- 🌊 **Low Tide**: **02:05 PM (0.6m)**\n- 🌬️ **Wind Speed**: **18 km/h SW**\n- 🌡️ **SST**: **28.4°C**\n- 🧭 **Visibility**: **7.2 km**",
        components: [
          {
            type: "weather-card",
            data: { sst: "28.4°C", wind: "18 km/h SW", swell: "1.4 m", pressure: "1009.4 hPa", visibility: "7.2 km" }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. SEA SAFETY / TOMORROW MORNING SAFETY
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "SEA_SAFETY",
    match: function(q) {
      const s = q.toLowerCase();
      if (s.includes("route") || s.includes("मार्ग") || s.includes("रास्ता") || s.includes("रस्ता") || s.includes("navigation")) {
        return false;
      }
      return s.includes("tomorrow") || s.includes("morning") ||
             s.includes("safe") || s.includes("safety") ||
             s.includes("उद्या") || s.includes("सकाळी") || s.includes("सुरक्षित") ||
             s.includes("कल") || s.includes("सुबह") || s.includes("सुरक्षा");
    },
    steps: {
      en: ["[01] Polling IMD radar & wave forecast models...", "[02] Assessing swell period & wind gust projections...", "[03] Evaluating maritime safety index...", "[04] Formulating departure safety directive..."],
      mr: ["[01] हवामान आणि लाटांच्या अंदाजांची तपासणी करत आहे...", "[02] वाऱ्याचा वेग आणि लाटांच्या उंचीचे मूल्यमापन करत आहे...", "[03] सागरी सुरक्षितता निर्देशांकाची पडताळणी करत आहे...", "[04] प्रवासाची सुरक्षितता शिफारस तयार करत आहे..."],
      hi: ["[01] मौसम और लहरों के पूर्वानुमान की जाँच की जा रही है...", "[02] हवा की गति और लहरों की ऊँचाई का मूल्यांकन किया जा रहा है...", "[03] समुद्री सुरक्षा सूचकांक की पुष्टि की जा रही है...", "[04] प्रस्थान सुरक्षा सिफारिश तैयार की जा रही है..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      if (targetLang === 'mr') {
        return {
          title: "🟢 समुद्र प्रवास सुरक्षितता शिफारस",
          verdict_tag: "🟢 SAFE",
          verdict_title: "🟢 उद्या सकाळी मासेमारी करणे सुरक्षित आहे",
          simple_sentence: "उद्या सकाळी ०६:०० ते दुपारी १४:०० दरम्यान समुद्राची स्थिती मध्यम शांत असून मासेमारी करणे सुरक्षित आहे.",
          bullets: ["🟢 निर्णय: किनारी मासेमारीसाठी सुरक्षित", "🌬️ वाऱ्याचा वेग: १८ किमी/तास नैऋत्य", "🌊 लाटांची उंची: १.४ मीटर (मध्यम)", "🌊 मोठी भरती: दुपारी २:३५ वाजता"],
          action_advice: "दुपारी १५:०० पूर्वी किनाऱ्यावर परतण्याचा सल्ला दिला जातो.",
          speech_text: "उद्या सकाळी रत्नागिरी किनाऱ्याजवळ मासेमारी करणे सुरक्षित आहे. वाऱ्याचा वेग १८ किलोमीटर प्रति तास आणि लाटांची उंची सुमारे १.४ मीटर राहण्याचा अंदाज आहे. दुपारी ३ वाजेपूर्वी किनाऱ्यावर परतावे.",
          prose: "**🟢 समुद्र प्रवास सुरक्षितता शिफारस**\n\nउद्या सकाळी रत्नागिरी किनाऱ्याजवळ मासेमारी करणे **सुरक्षित आहे**.\n\nसकाळी 06:00 ते दुपारी 14:00 दरम्यान वाऱ्याचा वेग **18 किमी/तास** आणि लाटांची उंची **1.4 मीटर** राहण्याचा अंदाज आहे.\n\n### 📋 मुख्य निर्णय माहिती\n- 🟢 **अंतिम निर्णय**: **किनारी मासेमारीसाठी सुरक्षित**\n- 🌬️ **वाऱ्याचा वेग**: **18 किमी/तास नैऋत्य**\n- 🌊 **लाटांची उंची**: **1.4 मीटर**\n- 🌊 **भरतीची वेळ**: **दुपारी 2:35 वाजता (मोठी भरती)**\n- ⚠️ **इशारा**: दुपारी 15:00 पूर्वी किनाऱ्यावर परतावे.",
          components: [
            {
              type: "weather-card",
              data: { sst: "28.4°C", wind: "18 किमी/तास नैऋत्य", swell: "1.4 मीटर", pressure: "1009.4 hPa" }
            }
          ]
        };
      }
      if (targetLang === 'hi') {
        return {
          title: "🟢 समुद्र यात्रा सुरक्षा सिफारिश",
          verdict_tag: "🟢 SAFE",
          verdict_title: "🟢 कल सुबह मछली पकड़ना सुरक्षित है",
          simple_sentence: "कल सुबह 06:00 से दोपहर 14:00 बजे तक समुद्र की स्थिति मध्यम शांत रहेगी और मछली पकड़ना सुरक्षित है।",
          bullets: ["🟢 निर्णय: तटीय मछली पकड़ने के लिए सुरक्षित", "🌬️ हवा की गति: 18 किमी/घंटा दक्षिण-पश्चिम", "🌊 लहरों की ऊँचाई: 1.4 मीटर", "🌊 उच्च ज्वार: दोपहर 2:35 बजे"],
          action_advice: "दोपहर 15:00 बजे से पहले लौटने की सलाह दी जाती है।",
          speech_text: "कल सुबह रत्नागिरी तट के पास मछली पकड़ना सुरक्षित है। हवा की गति 18 किलोमीटर प्रति घंटा और लहरों की ऊँचाई 1.4 मीटर रहने का अनुमान है। दोपहर 3 बजे से पहले लौटने की सलाह दी जाती है।",
          prose: "**🟢 समुद्र यात्रा सुरक्षा सिफारिश**\n\nकल सुबह रत्नागिरी तट के पास मछली पकड़ना **सुरक्षित है**।\n\nसुबह 06:00 से दोपहर 14:00 बजे के बीच हवा की गति **18 किमी/घंटा** और लहरों की ऊँचाई **1.4 मीटर** रहने का अनुमान है।\n\n### 📋 मुख्य निर्णय बुलेटिन\n- 🟢 **अंतिम निर्णय**: **तटीय मछली पकड़ने के लिए सुरक्षित**\n- 🌬️ **हवा की गति**: **18 किमी/घंटा दक्षिण-पश्चिम**\n- 🌊 **लहरों की ऊँचाई**: **1.4 मीटर**\n- 🌊 **ज्वार का समय**: **दोपहर 2:35 बजे (उच्च ज्वार)**\n- ⚠️ **चेतावनी**: दोपहर 15:00 बजे से पहले लौटने की सलाह दी जाती है।",
          components: [
            {
              type: "weather-card",
              data: { sst: "28.4°C", wind: "18 किमी/घंटा दक्षिण-पश्चिम", swell: "1.4 मीटर", pressure: "1009.4 hPa" }
            }
          ]
        };
      }
      return {
        title: "🟢 Marine Safety Directive — Tomorrow Morning",
        verdict_tag: "🟢 SAFE",
        verdict_title: "🟢 Safe for Coastal Fishing Tomorrow Morning",
        simple_sentence: "Fishing near the Ratnagiri coast tomorrow morning between 06:00 AM and 02:00 PM is safe with 1.4 m swells.",
        bullets: ["🟢 Final Decision: Safe for coastal fishing", "🌬️ Wind Speed: 18 km/h SW", "🌊 Wave Swell: 1.4 m", "🌊 High Tide: 2:35 PM"],
        action_advice: "Return to shore by 3:00 PM before evening squalls.",
        speech_text: "Fishing near the Ratnagiri coast tomorrow morning is safe with 18 kilometres per hour wind and 1.4 metre swells. Return to shore by 3:00 PM.",
        prose: "**🟢 Marine Safety Directive — Tomorrow Morning**\n\nFishing near the Ratnagiri coast tomorrow morning is **SAFE**.\n\nBetween 06:00 AM and 02:00 PM, wind speeds will hover around **18 km/h SW** with wave swells at **1.4 meters**.\n\n### 📋 KEY DECISION BULLETINS\n- 🟢 **Final Decision**: **SAFE FOR COASTAL FISHING**\n- 🌬️ **Wind Speed**: **18 km/h SW**\n- 🌊 **Wave Swell**: **1.4 m**\n- 🌊 **High Tide**: **2:35 PM**\n- ⚠️ **Advisory**: Return to shore by 3:00 PM.",
        components: [
          {
            type: "weather-card",
            data: { sst: "28.4°C", wind: "18 km/h SW", swell: "1.4 m", pressure: "1009.4 hPa" }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. SST & CHLOROPHYLL RESEARCH QUERY & REGION COMPARISON
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "RESEARCH_SST",
    match: function(q) {
      const s = q.toLowerCase();
      return s.includes("chlorophyll") || s.includes("sst") || s.includes("productivity") || s.includes("decline") ||
             s.includes("declined") || s.includes("compare") || s.includes("regions") || s.includes("biomass") ||
             s.includes("upwelling") || s.includes("temperature") ||
             s.includes("क्लोरोफिल") || s.includes("तापमान") || s.includes("उत्पादकता") || s.includes("तुलना") ||
             s.includes("कमी झाली") || s.includes("क्षेत्रांमधील") ||
             s.includes("कम हुई") || s.includes("क्षेत्रों");
    },
    steps: {
      en: ["[01] Ingesting MODIS & Sentinel-3 satellite passes...", "[02] Computing thermal front boundaries...", "[03] Synthesizing oceanographic bulletin..."],
      mr: ["[01] उपग्रह क्लोरोफिल डेटा तपासत आहे...", "[02] समुद्राच्या पृष्ठभागाचे तापमान मोजत आहे...", "[03] संशोधन अहवाल तयार करत आहे..."],
      hi: ["[01] उपग्रह क्लोरोफिल डेटा प्राप्त किया जा रहा है...", "[02] समुद्र सतह तापमान का विश्लेषण किया जा रहा है...", "[03] अनुसंधान रिपोर्ट तैयार की जा रही है..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      const s = q.toLowerCase();
      const isCompareOrDecline = s.includes("compare") || s.includes("तुलना") || s.includes("three") || s.includes("तीन") ||
                                s.includes("decline") || s.includes("कमी") || s.includes("कम");

      if (targetLang === 'mr') {
        if (isCompareOrDecline) {
          return {
            title: "📊 तिन्ही सागरी क्षेत्रांची मासेमारी क्षमता तुलना",
            verdict_tag: "🟢 COMPARATIVE ANALYSIS",
            verdict_title: "🟢 PFZ-02 (९१%) आणि PFZ-01 (८७%) मध्ये सर्वाधिक मासेमारी क्षमता",
            simple_sentence: "रत्नागिरी नैऋत्य (PFZ-01) मध्ये ८७% आणि रत्नागिरी-देवगड (PFZ-02) मध्ये ९१% अशी उच्च मासेमारी क्षमता असून पोरबंदर क्षेत्रात ८९% क्षमता नोंदवली गेली आहे.",
            bullets: [
              "📍 PFZ-01 (रत्नागिरी नैऋत्य): ८७% संभाव्यता | ४.७ mg/m³ क्लोरोफिल | १८ किमी",
              "📍 PFZ-02 (देवगड सागरी पट्टा): ९१% संभाव्यता | २.८ mg/m³ क्लोरोफिल | ३२ किमी",
              "📍 PFZ-03 (पोरबंदर ऑफशोअर): ८९% संभाव्यता | ३.१ mg/m³ क्लोरोफिल | ७६ किमी"
            ],
            action_advice: "जवळच्या अंतरासाठी आणि इंधन बचतीसाठी PFZ-01 सर्वोत्तम पर्याय आहे.",
            speech_text: "तिन्ही क्षेत्रांच्या विश्लेषणात रत्नागिरी-देवगड क्षेत्रात ९१ टक्के आणि रत्नागिरी नैऋत्य क्षेत्रात ८७ टक्के अशी उच्च मासेमारी क्षमता आढळली आहे. जवळच्या अंतरासाठी १८ किलोमीटर अंतरावरील पी एफ झेड एक सर्वोत्तम आहे.",
            prose: "**📊 तिन्ही सागरी क्षेत्रांची मासेमारी क्षमता तुलना**\n\nउपग्रह डेटा विश्लेषणानुसार तिन्ही क्षेत्रांमधील स्थिती:\n\n### 📋 क्षेत्रवार तुलना अहवाल\n- 📍 **PFZ-01 (रत्नागिरी नैऋत्य)**: **८७% संभाव्यता** | क्लोरोफिल: **४.७ mg/m³** | अंतर: **१८ किमी** | मुख्य मासे: बांगडा, सुरमई\n- 📍 **PFZ-02 (देवगड सागरी पट्टा)**: **९१% संभाव्यता** | क्लोरोफिल: **२.८ mg/m³** | अंतर: **३२ किमी** | मुख्य मासे: सुरमई, स्क्विड\n- 📍 **PFZ-03 (पोरबंदर ऑफशोअर)**: **८९% संभाव्यता** | क्लोरोफिल: **३.१ mg/m³** | अंतर: **७६ किमी** | मुख्य मासे: पापलेट, कोळंबी\n\nइंधन बचत आणि सुरक्षिततेसाठी **PFZ-01** सर्वात योग्य आहे.",
            components: [
              {
                type: "pfz-card",
                data: {
                  name: "रत्नागिरी-देवगड सागरी पट्टा (PFZ-02)",
                  latLonStr: "16°33'N, 72°51'E",
                  sstAnomaly: "27.3°C",
                  chlorophyll: "2.8 mg/m³",
                  confidence: "91%",
                  targetSpecies: ["सुरमई", "स्क्विड"],
                  distanceNm: "32 किमी",
                  depthM: 48,
                  fuelSavingsEst: "22%",
                  advisory: "उच्च बायोमास निर्देशांक (८८/१००)."
                }
              }
            ]
          };
        }

        return {
          title: "🔬 सागरी क्लोरोफिल आणि समुद्र पृष्ठभाग तापमान (SST)",
          verdict_tag: "🟢 HIGH BIOMASS",
          verdict_title: "🟢 रत्नागिरी नैऋत्य क्षेत्रात उच्च क्लोरोफिल (४.७ mg/m³)",
          simple_sentence: "रत्नागिरीच्या नैऋत्य भागात २७.९°C तापमान आणि ४.७ mg/m³ क्लोरोफिलमुळे समृद्ध सागरी जीवसृष्टी आढळते.",
          bullets: ["🌿 क्लोरोफिल: ४.७ mg/m³ (उच्च)", "🌡️ तापमान (SST): २७.९°C", "🐟 प्रमुख मासे: बांगडा, तारली, सुरमई", "📍 केंद्र: १६°५१' उत्तर, ७३°१०' पूर्व"],
          action_advice: "थर्मल फ्रंट सीमारेषेवर माशांचे मोठे थवे जमा झालेले आहेत.",
          speech_text: "रत्नागिरीच्या नैऋत्य भागात समुद्राचे तापमान २७.९ अंश असून क्लोरोफिलचे प्रमाण ४.७ मिलीग्राम प्रति घनमीटर आहे. या भागात माशांची मोठी उत्पादकता दिसून येत आहे.",
          prose: "**🔬 सागरी क्लोरोफिल आणि SST विश्लेषण**\n\nउपग्रह डेटा दर्शवतो की रत्नागिरी नैऋत्य क्षेत्रात **अपवेलिंग फ्रंट** तयार झाले आहे.\n\n### 📋 वैज्ञानिक निरीक्षणे\n- 🌿 **क्लोरोफिल**: **४.७ mg/m³ (उच्च)**\n- 🌡️ **SST**: **२७.९°C**\n- 🐟 **बायोमास निर्देशांक**: **९४ / १००**\n- 📍 **स्थान**: **१६°५१'N, ७३°१०'E**",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "रत्नागिरी नैऋत्य क्लोरोफिल केंद्र",
                latLonStr: "16°51'N, 73°10'E",
                sstAnomaly: "27.9°C",
                chlorophyll: "4.7 mg/m³",
                confidence: "87%",
                targetSpecies: ["बांगडा", "तारली", "सुरमई"],
                distanceNm: "18 किमी नैऋत्य",
                depthM: 48,
                fuelSavingsEst: "28%",
                advisory: "उच्च क्लोरोफिल घनता."
              }
            }
          ]
        };
      }

      if (targetLang === 'hi') {
        if (isCompareOrDecline) {
          return {
            title: "📊 तीनों समुद्री क्षेत्रों की मत्स्य क्षमता तुलना",
            verdict_tag: "🟢 COMPARATIVE ANALYSIS",
            verdict_title: "🟢 PFZ-02 (91%) और PFZ-01 (87%) में उच्चतम मत्स्य क्षमता",
            simple_sentence: "रत्नागिरी दक्षिण-पश्चिम (PFZ-01) में 87% और रत्नागिरी-देवगढ़ (PFZ-02) में 91% उच्च मत्स्य क्षमता दर्ज की गई है।",
            bullets: [
              "📍 PFZ-01 (रत्नागिरी दक्षिण-पश्चिम): 87% संभावना | 4.7 mg/m³ क्लोरोफिल | 18 किमी",
              "📍 PFZ-02 (देवगढ़ क्षेत्र): 91% संभावना | 2.8 mg/m³ क्लोरोफिल | 32 किमी",
              "📍 PFZ-03 (पोरबंदर अपतटीय): 89% संभावना | 3.1 mg/m³ क्लोरोफिल | 76 किमी"
            ],
            action_advice: "निकटतम दूरी और ईंधन बचत के लिए PFZ-01 सर्वोत्तम है।",
            speech_text: "तीनों क्षेत्रों के विश्लेषण में रत्नागिरी-देवगढ़ क्षेत्र में 91 प्रतिशत और रत्नागिरी दक्षिण-पश्चिम क्षेत्र में 87 प्रतिशत उच्च मत्स्य क्षमता है। निकटतम दूरी के लिए 18 किलोमीटर पर स्थित पी एफ जेट एक सर्वोत्तम है।",
            prose: "**📊 तीनों समुद्री क्षेत्रों की मत्स्य क्षमता तुलना**\n\nउपग्रह डेटा के आधार पर तीनों क्षेत्रों का तुलनात्मक विश्लेषण:\n\n### 📋 क्षेत्रवार तुलना विवरण\n- 📍 **PFZ-01 (रत्नागिरी दक्षिण-पश्चिम)**: **87% संभावना** | क्लोरोफिल: **4.7 mg/m³** | दूरी: **18 किमी**\n- 📍 **PFZ-02 (देवगढ़ समुद्री क्षेत्र)**: **91% संभावना** | क्लोरोफिल: **2.8 mg/m³** | दूरी: **32 किमी**\n- 📍 **PFZ-03 (पोरबंदर अपतटीय)**: **89% संभावना** | क्लोरोफिल: **3.1 mg/m³** | दूरी: **76 किमी**",
            components: [
              {
                type: "pfz-card",
                data: {
                  name: "रत्नागिरी-देवगढ़ समुद्री क्षेत्र (PFZ-02)",
                  latLonStr: "16°33'N, 72°51'E",
                  sstAnomaly: "27.3°C",
                  chlorophyll: "2.8 mg/m³",
                  confidence: "91%",
                  targetSpecies: ["सुरमई", "स्क्विड"],
                  distanceNm: "32 किमी",
                  depthM: 48,
                  fuelSavingsEst: "22%",
                  advisory: "उच्च बायोमास इंडेक्स (88/100)।"
                }
              }
            ]
          };
        }

        return {
          title: "🔬 समुद्री क्लोरोफिल और समुद्र सतह तापमान (SST)",
          verdict_tag: "🟢 HIGH BIOMASS",
          verdict_title: "🟢 रत्नागिरी दक्षिण-पश्चिम में उच्च क्लोरोफिल (4.7 mg/m³)",
          simple_sentence: "रत्नागिरी के दक्षिण-पश्चिम में 27.9°C तापमान और 4.7 mg/m³ क्लोरोफिल स्तर से समृद्ध समुद्री जीवन पाया जाता है।",
          bullets: ["🌿 क्लोरोफिल: 4.7 mg/m³ (उच्च)", "🌡️ तापमान: 27.9°C", "🐟 मुख्य प्रजातियां: बांगड़ा, तारली, सुरमई", "📍 स्थान: 16°51'N, 73°10'E"],
          action_advice: "थर्मल फ्रंट पर उच्च मछली सांद्रता है।",
          speech_text: "रत्नागिरी के दक्षिण-पश्चिम क्षेत्र में समुद्र का तापमान 27.9 डिग्री और क्लोरोफिल का स्तर 4.7 मिलीग्राम प्रति घन मीटर है। यहाँ उच्च मछली उत्पादकता दर्ज की गई है।",
          prose: "**🔬 समुद्री क्लोरोफिल और SST विश्लेषण**\n\nउपग्रह विश्लेषण के अनुसार रत्नागिरी दक्षिण-पश्चिम क्षेत्र में **अपवेलिंग फ्रंट** सक्रिय है।\n\n### 📋 वैज्ञानिक अवलोकन\n- 🌿 **क्लोरोफिल**: **4.7 mg/m³ (उच्च)**\n- 🌡️ **SST**: **27.9°C**\n- 🐟 **बायोमास इंडेक्स**: **94 / 100**\n- 📍 **स्थान**: **16°51'N, 73°10'E**",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "रत्नागिरी दक्षिण-पश्चिम क्लोरोफिल हब",
                latLonStr: "16°51'N, 73°10'E",
                sstAnomaly: "27.9°C",
                chlorophyll: "4.7 mg/m³",
                confidence: "87%",
                targetSpecies: ["बांगड़ा", "तारली", "सुरमई"],
                distanceNm: "18 किमी दक्षिण-पश्चिम",
                depthM: 48,
                fuelSavingsEst: "28%",
                advisory: "उच्च क्लोरोफिल क्षेत्र।"
              }
            }
          ]
        };
      }

      if (isCompareOrDecline) {
        return {
          title: "📊 Comparative Biomass Analysis across Monitored Zones",
          verdict_tag: "🟢 COMPARATIVE ANALYSIS",
          verdict_title: "🟢 PFZ-02 (91%) & PFZ-01 (87%) Lead Coastal Biomass Index",
          simple_sentence: "Satellite telemetry confirms PFZ-02 Devgad Pelagic Edge leads with 91% confidence, followed closely by PFZ-01 Ratnagiri Southwest at 87%.",
          bullets: [
            "📍 PFZ-01 (Ratnagiri SW): 87% Potential | 4.7 mg/m³ Chlorophyll | 18 km",
            "📍 PFZ-02 (Devgad Pelagic): 91% Potential | 2.8 mg/m³ Chlorophyll | 32 km",
            "📍 PFZ-03 (Porbandar Beta): 89% Potential | 3.1 mg/m³ Chlorophyll | 76 km"
          ],
          action_advice: "PFZ-01 provides the optimal fuel-to-yield ratio at 18 km distance.",
          speech_text: "Comparative analysis indicates PFZ-02 Devgad Pelagic Edge leads with 91 percent confidence, followed by PFZ-01 Ratnagiri Southwest at 87 percent. For immediate access, PFZ-01 at 18 kilometres is optimal.",
          prose: "**📊 Comparative Biomass Analysis across Monitored Zones**\n\nSatellite telemetry comparison for active fishing sectors:\n\n### 📋 COMPARATIVE SECTOR METRICS\n- 📍 **PFZ-01 (Ratnagiri SW)**: **87% Confidence** | Chlorophyll: **4.7 mg/m³** | Distance: **18 km** | Key Target: Mackerel, Kingfish\n- 📍 **PFZ-02 (Devgad Pelagic)**: **91% Confidence** | Chlorophyll: **2.8 mg/m³** | Distance: **32 km** | Key Target: Seer Fish, Squid\n- 📍 **PFZ-03 (Porbandar Beta)**: **89% Confidence** | Chlorophyll: **3.1 mg/m³** | Distance: **76 km** | Key Target: Pomfret, Ribbon Fish\n\n**PFZ-01** provides the highest fuel savings (~28%) for artisanal fleets.",
          components: [
            {
              type: "pfz-card",
              data: {
                name: "Devgad Pelagic Edge (PFZ-02)",
                latLonStr: "16°33'N, 72°51'E",
                sstAnomaly: "27.3°C",
                chlorophyll: "2.8 mg/m³",
                confidence: "91%",
                targetSpecies: ["Seer Fish", "Squid"],
                distanceNm: "32 km",
                depthM: 48,
                fuelSavingsEst: "22%",
                advisory: "High biomass index (88/100)."
              }
            }
          ]
        };
      }

      return {
        title: "🔬 Sea Surface Temperature & Chlorophyll-a Analysis",
        verdict_tag: "🟢 HIGH BIOMASS",
        verdict_title: "🟢 Elevated Chlorophyll (4.7 mg/m³) Southwest of Ratnagiri",
        simple_sentence: "An active thermal upwelling front 18 km SW of Ratnagiri shows 27.9°C SST and 4.7 mg/m³ chlorophyll-a concentration.",
        bullets: ["🌿 Chlorophyll-a: 4.7 mg/m³ (High)", "🌡️ SST: 27.9°C (-1.4°C anomaly)", "🐟 Target Species: Mackerel, Sardinella, Kingfish", "📍 Coordinates: 16°51'N, 73°10'E"],
        action_advice: "Optimal biomass density concentrated along the northwest thermal gradient.",
        speech_text: "Satellite observations indicate an active thermal upwelling front southwest of Ratnagiri with 27.9 degrees sea temperature and 4.7 milligrams per cubic metre chlorophyll concentration.",
        prose: "**🔬 SST & Chlorophyll-a Oceanographic Bulletin**\n\nThermal gradient analysis reveals an active **upwelling boundary**.\n\n### 📋 SATELLITE TELEMETRY\n- 🌿 **Chlorophyll-a**: **4.7 mg/m³**\n- 🌡️ **SST**: **27.9°C (-1.4°C anomaly)**\n- 🐟 **Biomass Index**: **94 / 100**\n- 📍 **Front Center**: **16°51'N, 73°10'E**",
        components: [
          {
            type: "pfz-card",
            data: {
              name: "Ratnagiri Southwest Chlorophyll Core",
              latLonStr: "16°51'N, 73°10'E",
              sstAnomaly: "27.9°C",
              chlorophyll: "4.7 mg/m³",
              confidence: "87%",
              targetSpecies: ["Indian Mackerel", "Sardinella", "Kingfish"],
              distanceNm: "18 km SW",
              depthM: 48,
              fuelSavingsEst: "28%",
              advisory: "Optimal fishing window 04:00 - 11:00 AM."
            }
          }
        ]
      };
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. POTENTIAL FISHING ZONE (PFZ) / WHERE TO FISH TODAY
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "FISH_PFZ",
    match: function(q) {
      const s = q.toLowerCase();
      return (s.includes("fish") && (s.includes("where") || s.includes("place") || s.includes("spot") || s.includes("zone") || s.includes("today") || s.includes("best") || s.includes("catch"))) ||
             s.includes("pfz") || s.includes("nearest") ||
             s.includes("जागा") || s.includes("कुठे") || s.includes("सर्वोत्तम जागा") || s.includes("चांगली जागा") ||
             s.includes("जगह") || s.includes("कहाँ") || s.includes("मत्स्य क्षेत्र") || s.includes("अच्छी जगह") ||
             s.includes("मासेमारी") || s.includes("मछली पकड़ने") || s.includes("मछली");
    },
    steps: {
      en: ["[01] Querying all marine data sources...", "[02] Analyzing potential fishing zones...", "[03] Evaluating weather & sea state...", "[04] Identifying optimal fishing location..."],
      mr: ["[01] सर्व सागरी डेटा स्रोत तपासले जात आहेत...", "[02] संभाव्य मासेमारी क्षेत्रांचे विश्लेषण केले जात आहे...", "[03] हवामान आणि समुद्राच्या परिस्थितीचे मूल्यांकन केले जात आहे...", "[04] सर्वोत्तम मासेमारी क्षेत्र ओळखले जात आहे..."],
      hi: ["[01] सभी समुद्री डेटा स्रोतों की जाँच की जा रही है...", "[02] संभावित मछली पकड़ने वाले क्षेत्रों का विश्लेषण किया जा रहा है...", "[03] मौसम और समुद्री परिस्थितियों का मूल्यांकन किया जा रहा है...", "[04] सर्वोत्तम क्षेत्र की पहचान की जा रही है..."]
    },
    getAnswer: function(q, targetLang = 'en') {
      updateSessionMemory('PFZ-01', 'Ratnagiri Coast', 'fisherman');

      if (targetLang === 'mr') {
        return {
          title: "🎣 संभाव्य मासेमारी क्षेत्र (PFZ-01)",
          verdict_tag: "🟢 EXCELLENT",
          verdict_title: "🟢 आज मासेमारीसाठी सर्वोत्तम जागा: PFZ-01 (१८ किमी नैऋत्य)",
          simple_sentence: "आज मासेमारीसाठी सर्वात चांगला परिसर तुमच्या सध्याच्या ठिकाणापासून सुमारे १८ किमी नैऋत्य दिशेला असलेला PFZ-01 आहे.",
          bullets: ["🎣 मासे मिळण्याची शक्यता: उच्च (८७%)", "📍 अंतर: १८ किमी नैऋत्य", "🐟 प्रमुख मासे: बांगडा, तारली, सुरमई", "🌊 लाटा: १.४ मीटर"],
          action_advice: "सकाळी ०४:०० ते ११:०० दरम्यान मासेमारीसाठी सर्वोत्तम वेळ आहे.",
          speech_text: "आज मासेमारीसाठी सर्वात चांगला परिसर तुमच्या सध्याच्या ठिकाणापासून सुमारे १८ किलोमीटर नैऋत्य दिशेला असलेला पी एफ झेड एक आहे. मासे मिळण्याची शक्यता ८७ टक्के आहे. समुद्रात जाण्यापूर्वी ताजे हवामान तपासा.",
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
          verdict_tag: "🟢 EXCELLENT",
          verdict_title: "🟢 आज मछली पकड़ने की सर्वोत्तम जगह: PFZ-01 (18 किमी दक्षिण-पश्चिम)",
          simple_sentence: "आज मछली पकड़ने के लिए सबसे अच्छा क्षेत्र आपके वर्तमान स्थान से लगभग 18 किमी दक्षिण-पश्चिम में स्थित PFZ-01 है।",
          bullets: ["🎣 संभावना: उच्च (87%)", "📍 दूरी: 18 किमी दक्षिण-पश्चिम", "🐟 प्रमुख मछलियां: बांगड़ा, तारली, सुरमई", "🌊 लहरें: 1.4 मीटर"],
          action_advice: "सुबह 04:00 से 11:00 बजे के बीच मछली पकड़ने का सबसे अच्छा समय है।",
          speech_text: "आज मछली पकड़ने के लिए सबसे अच्छा क्षेत्र आपके वर्तमान स्थान से लगभग 18 किलोमीटर दक्षिण-पश्चिम में स्थित पी एफ जेट एक है। यहाँ मछली पकड़ने की संभावना 87 प्रतिशत है। समुद्र में जाने से पहले मौसम की ताजा जानकारी लें।",
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
        verdict_tag: "🟢 EXCELLENT",
        verdict_title: "🟢 Best Fishing Spot Today: PFZ-01 (18 km SW)",
        simple_sentence: "The best place to fish today is PFZ-01, located 18 km southwest of your current location with 87% confidence.",
        bullets: ["🎣 Potential: High (87%)", "📍 Distance: 18 km SW", "🐟 Species: Indian Mackerel, Sardine, Kingfish", "🌊 Swells: 1.4 m"],
        action_advice: "Optimal fishing window is between 04:00 and 11:00 AM.",
        speech_text: "The best place to fish today is PFZ-01, located 18 kilometres southwest of Ratnagiri with 87 percent fishing potential. Check weather advisories before departure.",
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
  }

];

export function findMockResponse(queryText, userSelectedLang = 'en') {
  if (!MOCK_MODE || !queryText) return null;
  const targetLang = detectOrResolveLanguage(queryText, userSelectedLang);
  const q = queryText.toLowerCase().trim();

  // 1. Primary: Match specific categorized responses with precise intent models
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
          components: ans.components,
          verdict_tag: ans.verdict_tag || '🟢 SAFE',
          verdict_title: ans.verdict_title || ans.title,
          simple_sentence: ans.simple_sentence || (ans.prose ? ans.prose.split('\n\n')[0].replace(/\*\*/g, '') : ''),
          bullets: ans.bullets || [],
          action_advice: ans.action_advice || '',
          speech_text: ans.speech_text || ans.simple_sentence || (ans.prose ? ans.prose.split('\n\n')[0].replace(/\*\*/g, '') : '')
        };
      }
    }
  }

  // 2. Secondary: Redirect query through mockDataService
  const jsonResponse = mockDataService.findResponse(queryText, targetLang);
  if (jsonResponse) {
    return jsonResponse;
  }

  // 3. Fallback
  return mockDataService.generateFallbackResponse(queryText, targetLang);
}
