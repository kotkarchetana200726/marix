// ORCA Marine AI — Voice Speech Recognition (STT) & Text-to-Speech (TTS) Service
// Multilingual Speech Synthesis and Natural Language Processing for Mariners

export class VoiceService {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.recognition = null;
    this.isListening = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  isRecognitionSupported() {
    return !!this.recognition;
  }

  startListening({ onResult, onError, onEnd, lang = 'en' }) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN'
    };

    this.recognition.lang = langMap[lang] || 'en-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      if (onError) onError(e.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }

  speak(text, lang = 'en') {
    if (!this.synth || !text) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    // Strip markdown formatting for speech
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/#/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'hi-IN' // Fallback to hi-IN if mr-IN voice is unavailable on client
    };

    utterance.lang = langMap[lang] || 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = this.synth.getVoices();
    const voice = voices.find(v => v.lang.startsWith(langMap[lang])) || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Global Singleton Instance
export const voiceService = new VoiceService();

// Multilingual Content for Fisherman Persona
export const FISHERMAN_I18N = {
  en: {
    app_title: "ORCA",
    app_sub: "Your Marine Safety Companion",
    role_tag: "FISHERMAN MODE",
    change_role: "← Change Role",
    prompt_heading: "What would you like to know?",
    mic_btn_idle: "Tap and speak",
    mic_btn_listening: "Listening... Speak now",
    mic_sub: "Ask ORCA anything about the sea in English, Hindi or Marathi.",
    input_placeholder: "Or type your question here...",
    send_btn: "Ask ORCA",
    quick_title: "QUICK QUESTIONS — TAP TO ASK",
    location_label: "📍 Your Current Location:",
    location_val: "Arabian Sea — Maharashtra Coast (16.7° N 73.7° E)",
    
    // Quick Questions
    q_weather: "Will the weather be safe today?",
    q_sea: "How are the waves?",
    q_fishing: "Is this a good time to go fishing?",
    q_safety: "Is there any danger near me?",
    q_route: "Which route is safer?",

    // Preset Responses
    resp_weather: {
      status: "SAFE FOR COASTAL TRAVEL",
      badge: "badge-green",
      seaState: "Moderate (1.2m Swell)",
      wind: "14 km/h WNW",
      visibility: "Good (8.5 nm)",
      advice: "Weather is safe for coastal fishing today. Winds are moderate. Small boats should remain within 35 km of coast.",
      audio: "Weather is safe for coastal fishing today. Winds are moderate at 14 kilometers per hour."
    },
    resp_sea: {
      status: "MODERATE SEA STATE",
      badge: "badge-green",
      seaState: "1.8 m Wave Swell",
      wind: "18 km/h NW",
      visibility: "Good (7.8 nm)",
      advice: "Waves are moderate at 1.8 meters. Sea conditions are safe for normal transit.",
      audio: "Waves are moderate at 1.8 meters. Sea conditions are safe for normal transit."
    },
    resp_fishing: {
      status: "HIGH FISHING POTENTIAL",
      badge: "badge-green",
      seaState: "Good (1.2m Swell)",
      wind: "14 km/h",
      visibility: "Clear",
      advice: "Excellent time for fishing! High plankton bloom detected 35 to 55 kilometers off Mumbai coast. Target Mackerel and Sardines.",
      audio: "Excellent time for fishing! High plankton bloom detected 35 to 55 kilometers off Mumbai coast."
    },
    resp_safety: {
      status: "NO ACTIVE DANGER NEARBY",
      badge: "badge-green",
      seaState: "Moderate",
      wind: "16 km/h",
      visibility: "Clear",
      advice: "No cyclone or storm warnings near your area today. Coastal waters are clear.",
      audio: "No cyclone or storm warnings near your area today. Coastal waters are clear."
    },
    resp_route: {
      status: "COASTAL ROUTE SAFE",
      badge: "badge-green",
      seaState: "1.5m Swell",
      wind: "16 km/h",
      visibility: "Good",
      advice: "Coastal route following the 50m depth line is safe and saves fuel today.",
      audio: "Coastal route following the 50m depth line is safe and saves fuel today."
    }
  },

  hi: {
    app_title: "ओर्का (ORCA)",
    app_sub: "आपका समुद्री सुरक्षा साथी",
    role_tag: "मछुआरा मोड (FISHERMAN)",
    change_role: "← भूमिका बदलें",
    prompt_heading: "आज आप क्या जानना चाहते हैं?",
    mic_btn_idle: "माइक दबाएं और बोलें",
    mic_btn_listening: "सुन रहे हैं... अब बोलिए",
    mic_sub: "समुद्र के बारे में हिंदी, मराठी या अंग्रेजी में कुछ भी पूछें।",
    input_placeholder: "या अपना सवाल यहां टाइप करें...",
    send_btn: "पूछें",
    quick_title: "त्वरित प्रश्न — उत्तर पाने के लिए दबाएं",
    location_label: "📍 आपका स्थान:",
    location_val: "अरब सागर — महाराष्ट्र तट (16.7° N 73.7° E)",

    q_weather: "क्या आज मौसम सुरक्षित रहेगा?",
    q_sea: "समुद्र में लहरें कैसी हैं?",
    q_fishing: "क्या आज मछली पकड़ने का अच्छा समय है?",
    q_safety: "क्या मेरे पास कोई खतरा या तूफान है?",
    q_route: "कौन सा रास्ता सुरक्षित है?",

    resp_weather: {
      status: "तटीय यात्रा के लिए सुरक्षित",
      badge: "badge-green",
      seaState: "सामान्य (1.2 मीटर लहरें)",
      wind: "14 किमी/घंटा",
      visibility: "उत्तम (8.5 किमी)",
      advice: "आज तटीय मछली पकड़ने के लिए मौसम सुरक्षित है। हवाएं सामान्य हैं। छोटी नावें तट से 35 किमी के भीतर रहें।",
      audio: "आज तटीय मछली पकड़ने के लिए मौसम सुरक्षित है। हवाएं सामान्य हैं।"
    },
    resp_sea: {
      status: "सामान्य समुद्र स्थिति",
      badge: "badge-green",
      seaState: "1.8 मीटर लहरें",
      wind: "18 किमी/घंटा",
      visibility: "अच्छी",
      advice: "समुद्र में लहरें 1.8 मीटर हैं। सामान्य यात्रा के लिए समुद्र सुरक्षित है।",
      audio: "समुद्र में लहरें 1.8 मीटर हैं। सामान्य यात्रा के लिए समुद्र सुरक्षित है।"
    },
    resp_fishing: {
      status: "मछली पकड़ने के लिए उत्तम समय",
      badge: "badge-green",
      seaState: "अनुकूल",
      wind: "14 किमी/घंटा",
      visibility: "साफ",
      advice: "मछली पकड़ने का बहुत अच्छा समय है! मुंबई तट से 35 से 55 किमी दूर प्रचुर मात्रा में मछलियां मौजूद हैं।",
      audio: "मछली पकड़ने का बहुत अच्छा समय है! मुंबई तट से 35 से 55 किमी दूर प्रचुर मछलियां मौजूद हैं।"
    },
    resp_safety: {
      status: "पास में कोई खतरा नहीं है",
      badge: "badge-green",
      seaState: "सामान्य",
      wind: "16 किमी/घंटा",
      visibility: "साफ",
      advice: "आज आपके क्षेत्र के पास कोई चक्रवात या तूफान की चेतावनी नहीं है। समुद्र शांत है।",
      audio: "आज आपके क्षेत्र के पास कोई चक्रवात या तूफान की चेतावनी नहीं है। समुद्र शांत है।"
    },
    resp_route: {
      status: "तटीय मार्ग सुरक्षित है",
      badge: "badge-green",
      seaState: "1.5 मीटर",
      wind: "16 किमी/घंटा",
      visibility: "अच्छी",
      advice: "तट के साथ 50 मीटर गहराई वाला मार्ग आज सुरक्षित है और ईंधन बचाता है।",
      audio: "तट के साथ 50 मीटर गहराई वाला मार्ग आज सुरक्षित है और ईंधन बचाता है।"
    }
  },

  mr: {
    app_title: "ओर्का (ORCA)",
    app_sub: "तुमचा सागरी सुरक्षा सोबती",
    role_tag: "मासेमार मोड (FISHERMAN)",
    change_role: "← भूमिका बदला",
    prompt_heading: "आज तुम्हाला काय जाणून घ्यायचे आहे?",
    mic_btn_idle: "माईक दाबा आणि बोला",
    mic_btn_listening: "ऐकत आहे... आता बोला",
    mic_sub: "समुद्राबद्दल मराठी, हिंदी किंवा इंग्रजीत काहीही विचारा.",
    input_placeholder: "किंवा तुमचा प्रश्न येथे टाईप करा...",
    send_btn: "विचारा",
    quick_title: "त्वरित प्रश्न — उत्तर मिळवण्यासाठी दाबा",
    location_label: "📍 तुमचे स्थान:",
    location_val: "अरबी समुद्र — महाराष्ट्र किनारपट्टी (16.7° N 73.7° E)",

    q_weather: "आज हवामान सुरक्षित राहील का?",
    q_sea: "समुद्रात लाटा कशा आहेत?",
    q_fishing: "आज मासेमारीसाठी चांगली वेळ आहे का?",
    q_safety: "माझ्या जवळ काही धोका किंवा वादळ आहे का?",
    q_route: "कोणता मार्ग सुरक्षित आहे?",

    resp_weather: {
      status: "किनारपट्टी प्रवासासाठी सुरक्षित",
      badge: "badge-green",
      seaState: "मध्यम (1.2 मीटर लाटा)",
      wind: "14 किमी/तास",
      visibility: "उत्तम",
      advice: "आज किनारपट्टीवर मासेमारीसाठी हवामान सुरक्षित आहे. लहान बोटींनी किनार्यापासून 35 किमीच्या आत राहावे.",
      audio: "आज किनारपट्टीवर मासेमारीसाठी हवामान सुरक्षित आहे. लहान बोटींनी किनार्यापासून 35 किमीच्या आत राहावे."
    },
    resp_sea: {
      status: "मध्यम समुद्र स्थिती",
      badge: "badge-green",
      seaState: "1.8 मीटर लाटा",
      wind: "18 किमी/तास",
      visibility: "छाण",
      advice: "समुद्रात लाटा 1.8 मीटर आहेत. प्रवास सुरक्षित आहे.",
      audio: "समुद्रात लाटा 1.8 मीटर आहेत. प्रवास सुरक्षित आहे."
    },
    resp_fishing: {
      status: "मासेमारीसाठी उत्तम वेळ",
      badge: "badge-green",
      seaState: "अनुकूल",
      wind: "14 किमी/तास",
      visibility: "स्पष्ट",
      advice: "मासेमारीसाठी उत्तम वेळ! मुंबई किनारपट्टीपासून 35 ते 55 किमी अंतरावर मुबलक मासे आढळले आहेत.",
      audio: "मासेमारीसाठी उत्तम वेळ! मुंबई किनारपट्टीपासून 35 ते 55 किमी अंतरावर मुबलक मासे आढळले आहेत."
    },
    resp_safety: {
      status: "जवळ कोणताही धोका नाही",
      badge: "badge-green",
      seaState: "सामान्य",
      wind: "16 किमी/तास",
      visibility: "स्पष्ट",
      advice: "आज तुमच्या परिसरात चक्रीवादळाचा कोणताही इशारा नाही. समुद्र शांत आहे.",
      audio: "आज तुमच्या परिसरात चक्रीवादळाचा कोणताही इशारा नाही. समुद्र शांत आहे."
    },
    resp_route: {
      status: "किनारपट्टी मार्ग सुरक्षित आहे",
      badge: "badge-green",
      seaState: "1.5 मीटर",
      wind: "16 किमी/तास",
      visibility: "उत्तम",
      advice: "किनारपट्टीला लागून असलेला 50 मीटर खोलीचा मार्ग सुरक्षित आहे आणि इंधन वाचवतो.",
      audio: "किनारपट्टीला लागून असलेला 50 मीटर खोलीचा मार्ग सुरक्षित आहे आणि इंधन वाचवतो."
    }
  }
};
