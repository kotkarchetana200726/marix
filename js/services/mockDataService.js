// ORCA Marine Intelligence — Central Mock Data Service
// Loads and redirects queries through mock_stakeholder_data.json with synchronous fallback

class MockDataService {
  constructor() {
    this.data = null;
    this.jsonPath = './js/data/mock_stakeholder_data.json';
    this.isLoaded = false;
    this.loadPromise = this.init();
  }

  async init() {
    try {
      const resp = await fetch(this.jsonPath);
      if (resp.ok) {
        this.data = await resp.json();
        this.isLoaded = true;
        console.log('[MockDataService] Successfully loaded mock_stakeholder_data.json');
        return this.data;
      }
    } catch (e) {
      console.warn('[MockDataService] Fetch failed, initializing from fallback cache:', e);
    }
    this.data = this.getFallbackData();
    this.isLoaded = true;
    return this.data;
  }

  async ensureLoaded() {
    if (!this.isLoaded) {
      await this.loadPromise;
    }
    return this.data;
  }

  getDataSync() {
    if (!this.data) {
      this.data = this.getFallbackData();
      this.isLoaded = true;
    }
    return this.data;
  }

  getStakeholderData(stakeholderId) {
    const d = this.getDataSync();
    return d.stakeholders ? d.stakeholders[stakeholderId] || null : null;
  }

  getAllStakeholders() {
    const d = this.getDataSync();
    return d.stakeholders || {};
  }

  getMonitoredZones() {
    const d = this.getDataSync();
    return d.monitored_zones || [];
  }

  getPFZZones() {
    const fisher = this.getStakeholderData('fisherman');
    return fisher ? fisher.pfz_zones || [] : [];
  }

  getRoutePresets() {
    const capt = this.getStakeholderData('captain_route');
    return capt ? capt.route_presets || [] : [];
  }

  getActiveAlerts() {
    const safety = this.getStakeholderData('disaster_safety');
    return safety ? safety.active_alerts || [] : [];
  }

  getHazardZones() {
    const safety = this.getStakeholderData('disaster_safety');
    return safety ? safety.hazard_zones || [] : [];
  }

  getAdapters() {
    const admin = this.getStakeholderData('system_admin');
    return admin ? admin.adapters || [] : [];
  }

  findResponse(queryText, lang = 'en') {
    const d = this.getDataSync();
    const responses = d.mock_responses || [];
    const q = (queryText || '').toLowerCase().trim();

    // Check matching keywords in JSON
    for (const resp of responses) {
      const match = resp.match_keywords.some(kw => q.includes(kw.toLowerCase()));
      if (match) {
        const targetLang = (lang === 'mr' || lang === 'hi' || lang === 'en') ? lang : 'en';
        const steps = (resp.steps && resp.steps[targetLang]) ? resp.steps[targetLang] : (resp.steps?.en || []);
        const ans = (resp.answers && resp.answers[targetLang]) ? resp.answers[targetLang] : (resp.answers?.en || {});

        return {
          id: resp.id,
          targetLang: targetLang,
          steps: steps,
          title: ans.title || 'ORCA Intelligence',
          prose: ans.prose || '',
          components: ans.components || [],
          verdict_tag: ans.verdict_tag || '🟢 SAFE',
          verdict_title: ans.verdict_title || ans.title || '🟢 Marine Assessment',
          simple_sentence: ans.simple_sentence || (ans.prose ? ans.prose.split('\n\n')[0].replace(/\*\*/g, '') : ''),
          bullets: ans.bullets || [],
          action_advice: ans.action_advice || 'Check weather forecasts before departure.',
          speech_text: ans.speech_text || ans.simple_sentence || ''
        };
      }
    }

    // Return null if no specific mock response in JSON so that callers can evaluate MOCK_RESPONSES
    return null;
  }

  generateFallbackResponse(queryText, targetLang) {
    const steps = targetLang === 'mr'
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
          "[02] Evaluating weather & sea state parameters...",
          "[03] Formulating stakeholder response..."
        ];

    const verdict_title = targetLang === 'mr'
      ? '🟢 रत्नागिरी सागरी स्थिती: मध्यम शांत (१.४m लाटा)'
      : targetLang === 'hi'
      ? '🟢 रत्नागिरी समुद्री स्थिति: मध्यम शांत (1.4m लहरें)'
      : '🟢 Ratnagiri Coast: Moderate & Calm (1.4m waves)';

    const simple_sentence = targetLang === 'mr'
      ? 'रत्नागिरी आणि कोकण किनारी भागात समुद्राची स्थिती मध्यम शांत आहे. समुद्राचे तापमान २८.४°C असून लाटांची उंची सुमारे १.४ मीटर आहे.'
      : targetLang === 'hi'
      ? 'रत्नागिरी और कोंकण तट पर समुद्र की स्थिति मध्यम शांत है। समुद्र का तापमान 28.4°C और लहरों की ऊँचाई 1.4 मीटर है।'
      : 'Sea conditions along Ratnagiri and Konkan coast are moderate and calm with 1.4m waves and 28.4°C water temperature.';

    const bullets = targetLang === 'mr'
      ? ['📍 क्षेत्र: रत्नागिरी किनारी पट्टा', '🌊 लाटा: १.४ मीटर (मध्यम)', '🌬️ वारा: १८ किमी/तास नैऋत्य', '🌡️ पाणी तापमान: २८.४°C']
      : targetLang === 'hi'
      ? ['📍 क्षेत्र: रत्नागिरी तटीय क्षेत्र', '🌊 लहरें: 1.4 मीटर (मध्यम)', '🌬️ हवा: 18 किमी/घंटा दक्षिण-पश्चिम', '🌡️ जल तापमान: 28.4°C']
      : ['📍 Area: Ratnagiri Coastal Sector', '🌊 Waves: 1.4 m (Moderate)', '🌬️ Wind: 18 km/h SW', '🌡️ SST: 28.4°C'];

    const action_advice = targetLang === 'mr'
      ? 'प्रवास करण्यापूर्वी ताजी माहिती तपासा आणि सुरक्षित राहा.'
      : targetLang === 'hi'
      ? 'प्रस्थान से पहले ताजा जानकारी देखें और सुरक्षित रहें।'
      : 'Check latest weather advisory before departure and stay safe.';

    const speech_text = targetLang === 'mr'
      ? 'रत्नागिरी किनारी भागात समुद्राची स्थिती मध्यम शांत आहे. समुद्राचे तापमान २८.४ अंश असून लाटांची उंची १.४ मीटर आहे. वाऱ्याचा वेग १८ किलोमीटर प्रति तास आहे. प्रवास करण्यापूर्वी ताजी माहिती तपासा.'
      : targetLang === 'hi'
      ? 'रत्नागिरी तटीय क्षेत्र में समुद्र की स्थिति मध्यम शांत है। समुद्र का तापमान 28.4 डिग्री और लहरें 1.4 मीटर हैं। हवा की गति 18 किलोमीटर प्रति घंटा है। प्रस्थान से पहले जानकारी देखें।'
      : 'Sea conditions along Ratnagiri coast are moderate and calm with 1.4 metre swells and 18 kilometres per hour wind. Check latest advisory before departure.';

    const prose = targetLang === 'mr'
      ? `**ORCA सागरी माहिती**\n\nरत्नागिरी आणि कोकण किनारी भागातील समुद्राची स्थिती मध्यम शांत आहे. समुद्राच्या पृष्ठभागाचे तापमान **२८.४°C** आणि लाटांची उंची **१.४ मीटर** आहे.\n\n### 📋 मुख्य माहिती\n- 🌊 **लाटांची स्थिती**: **१.४m (मध्यम)**\n- 🌬️ **वाऱ्याचा वेग**: **१८ किमी/तास नैऋत्य**\n- 🌡️ **समुद्र तापमान**: **२८.४°C**\n- ⚓ **शिफारस**: **किनारी मासेमारीसाठी सुरक्षित**`
      : targetLang === 'hi'
      ? `**ORCA समुद्री जानकारी**\n\nरत्नागिरी और कोंकण तटीय क्षेत्र में समुद्र की स्थिति मध्यम शांत है। समुद्र की सतह का तापमान **28.4°C** और लहरों की ऊँचाई **1.4 मीटर** है।\n\n### 📋 मुख्य जानकारी\n- 🌊 **लहरों की स्थिति**: **1.4m (मध्यम)**\n- 🌬️ **हवा की गति**: **18 किमी/घंटा दक्षिण-पश्चिम**\n- 🌡️ **समुद्र का तापमान**: **28.4°C**\n- ⚓ **सिफारिश**: **तटीय मछली पकड़ने के लिए सुरक्षित**`
      : `**ORCA Marine Intelligence**\n\nSea conditions across Ratnagiri sector are moderate and calm. Sea Surface Temp is **28.4°C** with **1.4 m** wave height.\n\n### 📋 KEY DECISION BULLETINS\n- 🌊 **Sea State**: **1.4m waves (Moderate)**\n- 🌬️ **Wind**: **18 km/h SW**\n- 🌡️ **SST**: **28.4°C**\n- ⚓ **Verdict**: **SAFE FOR NEARSHORE SAILING**`;

    const title = targetLang === 'mr' ? 'ORCA सागरी माहिती' : targetLang === 'hi' ? 'ORCA समुद्री जानकारी' : 'ORCA Marine Intelligence';

    return {
      id: "JSON_DYNAMIC_FALLBACK",
      targetLang: targetLang,
      steps: steps,
      title: title,
      prose: prose,
      verdict_tag: '🟢 SAFE',
      verdict_title: verdict_title,
      simple_sentence: simple_sentence,
      bullets: bullets,
      action_advice: action_advice,
      speech_text: speech_text,
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

  getFallbackData() {
    return {
      system: { version: "2.0.0", name: "ORCA MARIX Marine Console", mock_mode: true },
      stakeholders: {
        fisherman: {
          id: "fisherman",
          name: "Artisanal & Commercial Fishermen",
          pfz_zones: [
            {
              id: "pfz-01",
              name: "Ratnagiri Southwest PFZ-01",
              coordinates: [16.85, 73.18],
              latLonStr: "16°51'N, 73°10'E",
              distanceKm: 18,
              distanceNm: 9.7,
              depthM: 48,
              sstAnomaly: "-1.4°C",
              sstCurrent: "27.9°C",
              chlorophyll: "4.7 mg/m³",
              confidence: "87%",
              targetSpecies: ["Indian Mackerel", "Sardinella", "Kingfish"],
              fuelSavingsEst: "28%",
              advisory: "High productivity 18 km SW of Ratnagiri."
            }
          ]
        },
        captain_route: {
          id: "captain_route",
          name: "Ship Captain & Marine Route Planner",
          route_presets: []
        },
        disaster_safety: {
          id: "disaster_safety",
          name: "Disaster Management & Safety Officer",
          active_alerts: [],
          hazard_zones: []
        },
        marine_researcher: {
          id: "marine_researcher",
          name: "Oceanographer & Marine Researcher"
        },
        system_admin: {
          id: "system_admin",
          name: "System Administrator & Data Engineer",
          adapters: []
        }
      },
      monitored_zones: [],
      mock_responses: []
    };
  }
}

export const mockDataService = new MockDataService();
