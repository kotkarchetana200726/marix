// ORCA Marine AI — Voice Speech Recognition (STT) & Text-to-Speech (TTS) Service
// Multilingual Speech Synthesis and Natural Language Processing for Mariners

export function prepareSpeechText(text, lang = 'en') {
  if (!text) return '';

  // 1. Strip markdown code/headers/bullet symbols/emojis
  let clean = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s?/g, '')
    .replace(/- /g, ' ')
    .replace(/•/g, ' ')
    .replace(/🟢|🟡|🔴|🎣|📍|🧭|🌊|🌡️|🌿|🌬️|🌀|⚡|⛈️|🛡️|💡|📋|✓|⚙/g, '')
    .replace(/\n+/g, '. ')
    .trim();

  // 2. Ensure natural speech transitions
  if (lang === 'mr') {
    clean = clean.replace(/SST/g, 'समुद्राचे तापमान').replace(/PFZ-01/g, 'पी एफ झेड एक');
  } else if (lang === 'hi') {
    clean = clean.replace(/SST/g, 'समुद्र का तापमान').replace(/PFZ-01/g, 'पी एफ जेट एक');
  }

  return clean;
}

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

    const ttsLanguageMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN'
    };

    this.recognition.lang = ttsLanguageMap[lang] || 'en-IN';

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

    const cleanText = prepareSpeechText(text, lang);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const ttsLanguageMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN'
    };

    const targetLocale = ttsLanguageMap[lang] || 'en-IN';
    utterance.lang = targetLocale;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    const primaryLangPrefix = targetLocale.substring(0, 2);
    const voice = voices.find(v => v.lang.startsWith(targetLocale)) || 
                  voices.find(v => v.lang.startsWith(primaryLangPrefix)) || 
                  voices.find(v => v.lang.startsWith('hi')) || 
                  voices.find(v => v.lang.startsWith('en'));
                  
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
    location_val: "Arabian Sea — Ratnagiri Coast (16.99° N 73.31° E)",
    
    // Quick Questions
    q_weather: "Will the weather be safe today?",
    q_sea: "How are the waves?",
    q_fishing: "Is this a good time to go fishing?",
    q_safety: "Is there any danger near me?",
    q_route: "Which route is safer?",

    // Preset Responses
    resp_weather: {
      status: "SAFE",
      badge: "badge-green",
      advice: "Weather is normal near Ratnagiri. Winds are 18 km/h SW with 1.4 m waves. Safe for coastal travel.",
      seaState: "1.4 m Swell",
      wind: "18 km/h SW",
      audio: "Weather is normal near Ratnagiri. Winds are 18 km per hour. Waves are 1.4 metres. Safe for coastal travel."
    },
    resp_sea: {
      status: "NOMINAL",
      badge: "badge-green",
      advice: "Sea is moderately calm with 1.4 metre swells. Next high tide is expected at 2:35 PM.",
      seaState: "1.4 m Swell",
      wind: "18 km/h SW",
      audio: "Sea is moderately calm with 1.4 metre swells. Next high tide is expected at 2:35 PM."
    },
    resp_fishing: {
      status: "HIGH YIELD",
      badge: "badge-green",
      advice: "Good fishing conditions expected 18 km southwest of Ratnagiri. Chlorophyll is high at 4.7 mg/m³.",
      seaState: "1.4 m Swell",
      wind: "18 km/h SW",
      audio: "Good fishing conditions expected 18 kilometres southwest of Ratnagiri."
    },
    resp_safety: {
      status: "MODERATE SAFETY",
      badge: "badge-amber",
      advice: "No active cyclone alert. Isolated thunderstorms possible late afternoon. Monitor advisories before departure.",
      seaState: "1.4 m Swell",
      wind: "18 km/h SW",
      audio: "No active cyclone alert. Isolated thunderstorms possible late afternoon."
    }
  },

  hi: {
    app_title: "ORCA",
    app_sub: "समुद्री सुरक्षा साथी",
    role_tag: "मछुआरा मोड",
    change_role: "← भूमिका बदलें",
    prompt_heading: "आप क्या जानना चाहते हैं?",
    mic_btn_idle: "दबाएं और बोलें",
    mic_btn_listening: "सुन रहे हैं... अब बोलें",
    mic_sub: "अंग्रेजी, हिंदी या मराठी में समुद्र के बारे में कुछ भी पूछें।",
    input_placeholder: "या अपना प्रश्न यहाँ लिखें...",
    send_btn: "ORCA से पूछें",
    quick_title: "त्वरित प्रश्न — पूछने के लिए दबाएं",
    location_label: "📍 आपकी वर्तमान स्थिति:",
    location_val: "अरब सागर — रत्नागिरी तट (16.99° N 73.31° E)",

    q_weather: "क्या आज मौसम सुरक्षित रहेगा?",
    q_sea: "लहरें कैसी हैं?",
    q_fishing: "क्या मछली पकड़ने का अच्छा समय है?",
    q_safety: "क्या पास में कोई खतरा है?",
    q_route: "कौन सा रास्ता सुरक्षित है?",

    resp_weather: {
      status: "सुरक्षित",
      badge: "badge-green",
      advice: "रत्नागिरी के पास मौसम सामान्य है। हवा 18 किमी/घंटा और लहरें 1.4 मीटर हैं। तटीय यात्रा सुरक्षित है।",
      seaState: "1.4 मीटर लहरें",
      wind: "18 किमी/घंटा दक्षिण-पश्चिम",
      audio: "रत्नागिरी के पास मौसम सामान्य है। हवा 18 किलोमीटर प्रति घंटा है। लहरें 1.4 मीटर हैं।"
    },
    resp_sea: {
      status: "सामान्य",
      badge: "badge-green",
      advice: "समुद्र 1.4 मीटर लहरों के साथ मध्यम शांत है। अगला उच्च ज्वार दोपहर 2:35 बजे आने की उम्मीद है।",
      seaState: "1.4 मीटर लहरें",
      wind: "18 किमी/घंटा दक्षिण-पश्चिम",
      audio: "समुद्र 1.4 मीटर लहरों के साथ मध्यम शांत है। अगला उच्च ज्वार दोपहर 2:35 बजे आने की उम्मीद है।"
    },
    resp_fishing: {
      status: "उच्च संभावना",
      badge: "badge-green",
      advice: "रत्नागिरी के 18 किमी दक्षिण-पश्चिम में अच्छी मछली पकड़ने की संभावना है।",
      seaState: "1.4 मीटर लहरें",
      wind: "18 किमी/घंटा दक्षिण-पश्चिम",
      audio: "रत्नागिरी के 18 किलोमीटर दक्षिण-पश्चिम में अच्छी मछली पकड़ने की संभावना है।"
    },
    resp_safety: {
      status: "मध्यम सुरक्षा",
      badge: "badge-amber",
      advice: "कोई चक्रवात अलर्ट नहीं। शाम को गरज के साथ बारिश संभव। प्रस्थान से पहले जांच करें।",
      seaState: "1.4 मीटर लहरें",
      wind: "18 किमी/घंटा दक्षिण-पश्चिम",
      audio: "कोई चक्रवात अलर्ट नहीं है। शाम को बारिश संभव है।"
    }
  },

  mr: {
    app_title: "ORCA",
    app_sub: "सागरी सुरक्षितता सहाय्यक",
    role_tag: "मासेमारी मोड",
    change_role: "← भूमिका बदला",
    prompt_heading: "तुम्हाला काय जाणून घ्यायचे आहे?",
    mic_btn_idle: "दबा आणि बोला",
    mic_btn_listening: "ऐकत आहे... आता बोला",
    mic_sub: "इंग्रजी, हिंदी किंवा मराठीमध्ये समुद्राबद्दल काहीही विचारा.",
    input_placeholder: "किंवा आपला प्रश्न येथे लिहा...",
    send_btn: "ORCA ला विचारा",
    quick_title: "त्वरित प्रश्न — विचारण्यासाठी दाबा",
    location_label: "📍 तुमचे सध्याचे ठिकाण:",
    location_val: "अरबी समुद्र — रत्नागिरी किनारा (16.99° N 73.31° E)",

    q_weather: "आज हवामान सुरक्षित असेल का?",
    q_sea: "लाटा कशा आहेत?",
    q_fishing: "मासेमारीसाठी ही योग्य वेळ आहे का?",
    q_safety: "काही धोका आहे का?",
    q_route: "कोणता मार्ग सुरक्षित आहे?",

    resp_weather: {
      status: "सुरक्षित",
      badge: "badge-green",
      advice: "रत्नागिरी जवळ हवामान सामान्य आहे. वारा 18 किमी/तास आणि लाटा 1.4 मीटर आहेत. प्रवास सुरक्षित आहे.",
      seaState: "1.4 मीटर लाटा",
      wind: "18 किमी/तास नैऋत्य",
      audio: "रत्नागिरी जवळ हवामान सामान्य आहे. वारा 18 किलोमीटर प्रति तास आहे. लाटा 1.4 मीटर आहेत."
    },
    resp_sea: {
      status: "सामान्य",
      badge: "badge-green",
      advice: "समुद्र 1.4 मीटर लाटांसह मध्यम शांत आहे. पुढील मोठी भरती दुपारी 2:35 वाजता अपेक्षित आहे.",
      seaState: "1.4 मीटर लाटा",
      wind: "18 किमी/तास नैऋत्य",
      audio: "समुद्र 1.4 मीटर लाटांसह मध्यम शांत आहे. पुढील मोठी भरती दुपारी 2:35 वाजता अपेक्षित आहे."
    },
    resp_fishing: {
      status: "उच्च शक्यता",
      badge: "badge-green",
      advice: "रत्नागिरीच्या 18 किमी नैऋत्येला मासेमारीसाठी उत्तम परिस्थिती आहे.",
      seaState: "1.4 मीटर लाटा",
      wind: "18 किमी/तास नैऋत्य",
      audio: "रत्नागिरीच्या 18 किलोमीटर नैऋत्येला मासेमारीसाठी उत्तम परिस्थिती आहे."
    },
    resp_safety: {
      status: "मध्यम सुरक्षितता",
      badge: "badge-amber",
      advice: "चक्रीवादळाचा इशारा नाही. संध्याकाळी पावसाची शक्यता आहे. निघण्यापूर्वी तपासणी करा.",
      seaState: "1.4 मीटर लाटा",
      wind: "18 किमी/तास नैऋत्य",
      audio: "चक्रीवादळाचा इशारा नाही. संध्याकाळी पावसाची शक्यता आहे."
    }
  }
};
