// ORCA Marine AI — Voice Speech Recognition (STT) & Text-to-Speech (TTS) Service
// Multilingual Speech Synthesis and Natural Language Processing for Mariners

const MR_NUMBER_WORDS = {
  0: 'शून्य', 1: 'एक', 2: 'दोन', 3: 'तीन', 4: 'चार', 5: 'पाच', 6: 'सहा', 7: 'सात', 8: 'आठ', 9: 'नऊ',
  10: 'दहा', 11: 'अकरा', 12: 'बारा', 13: 'तेरा', 14: 'चौदा', 15: 'पंधरा', 16: 'सोळा', 17: 'सतरा', 18: 'अठरा',
  19: 'एकोणीस', 20: 'वीस', 21: 'एकवीस', 22: 'बावीस', 23: 'तेवीस', 24: 'चोवीस', 25: 'पंचवीस', 26: 'सव्वीस',
  27: 'सत्तावीस', 28: 'अठ्ठावीस', 29: 'एकोणतीस', 30: 'तीस', 31: 'एकतीस', 32: 'बत्तीस', 33: 'तेहतीस', 34: 'चौतीस',
  35: 'पस्तीस', 36: 'छत्तीस', 37: 'सदतीस', 38: 'अडतीस', 39: 'एकेचाळीस', 40: 'चाळीस', 48: 'अठ्ठेचाळीस', 50: 'पन्नास',
  60: 'साठ', 70: 'सत्तर', 80: 'ऐंशी', 87: 'सत्यांशी', 90: 'नव्वद', 94: 'चौर्याण्णव', 100: 'शंभर', 220: 'दोनशे वीस'
};

const HI_NUMBER_WORDS = {
  0: 'शून्य', 1: 'एक', 2: 'दो', 3: 'तीन', 4: 'चार', 5: 'पाँच', 6: 'छह', 7: 'सात', 8: 'आठ', 9: 'नौ',
  10: 'दस', 11: 'ग्यारह', 12: 'बारह', 13: 'तेरह', 14: 'चौदह', 15: 'पंद्रह', 16: 'सोलह', 17: 'सत्रह', 18: 'अठारह',
  19: 'उन्नीस', 20: 'बीस', 21: 'इक्कीस', 22: 'बाईस', 23: 'तेईस', 24: 'चौबीस', 25: 'पच्चीस', 26: 'छब्बीस',
  27: 'सत्ताईस', 28: 'अट्ठाईस', 29: 'उनतीस', 30: 'तीस', 31: 'इकत्तीस', 32: 'बत्तीस', 33: 'तैंतीस', 34: 'चौंतीस',
  35: 'पैंतीस', 36: 'छत्तीस', 37: 'सैंतीस', 38: 'अड़तीस', 39: 'उनतालीस', 40: 'चालीस', 48: 'अड़तालीस', 50: 'पचास',
  60: 'साठ', 70: 'सत्तर', 80: 'अस्सी', 87: 'सत्तासी', 90: 'नब्बे', 94: 'चौरानवे', 100: 'सौ', 220: 'दो सौ बीस'
};

const EN_NUMBER_WORDS = {
  0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
  10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen',
  17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty', 22: 'twenty two', 24: 'twenty four',
  28: 'twenty eight', 30: 'thirty', 35: 'thirty five', 40: 'forty', 48: 'forty eight', 50: 'fifty',
  60: 'sixty', 70: 'seventy', 80: 'eighty', 87: 'eighty seven', 90: 'ninety', 94: 'ninety four',
  100: 'one hundred', 220: 'two hundred twenty'
};

export function numToWord(numStr, lang = 'mr') {
  const table = lang === 'mr' ? MR_NUMBER_WORDS : (lang === 'hi' ? HI_NUMBER_WORDS : EN_NUMBER_WORDS);
  const n = parseInt(numStr, 10);
  if (table[n] !== undefined) return table[n];
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    if (table[tens] && table[ones]) return `${table[tens]} ${table[ones]}`;
  }
  return numStr;
}

export function expandNumbersToWords(text, lang = 'mr') {
  if (!text) return '';
  let s = text;

  // Convert Devanagari numerals ०-९ to ASCII 0-9 first
  const devaNumerals = ['०','१','२','३','४','५','६','७','८','९'];
  devaNumerals.forEach((ch, idx) => {
    s = s.replaceAll(ch, String(idx));
  });

  // Time expressions e.g. 14:35, 15:00, 2:35 PM, 06:00
  if (lang === 'mr') {
    s = s.replace(/(\d{1,2}):(\d{2})/g, (m, h, min, offset, fullStr) => {
      const hour = parseInt(h, 10);
      const minute = parseInt(min, 10);
      const before = fullStr.substring(Math.max(0, offset - 15), offset);
      const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      let prefix = '';
      if (!/सकाळी|दुपारी|संध्याकाळी|रात्री/.test(before)) {
        prefix = hour < 12 ? 'सकाळी ' : (hour < 17 ? 'दुपारी ' : (hour < 20 ? 'संध्याकाळी ' : 'रात्री '));
      }
      const minText = minute === 0 ? ' वाजता' : ` वाजून ${numToWord(minute, 'mr')} मिनिटे`;
      return `${prefix}${numToWord(hour12, 'mr')}${minText}`;
    });
  } else if (lang === 'hi') {
    s = s.replace(/(\d{1,2}):(\d{2})/g, (m, h, min, offset, fullStr) => {
      const hour = parseInt(h, 10);
      const minute = parseInt(min, 10);
      const before = fullStr.substring(Math.max(0, offset - 15), offset);
      const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      let prefix = '';
      if (!/सुबह|दोपहर|शाम|रात/.test(before)) {
        prefix = hour < 12 ? 'सुबह ' : (hour < 17 ? 'दोपहर ' : (hour < 20 ? 'शाम ' : 'रात '));
      }
      const minText = minute === 0 ? ' बजे' : ` बजकर ${numToWord(minute, 'hi')} मिनट`;
      return `${prefix}${numToWord(hour12, 'hi')}${minText}`;
    });
  } else {
    s = s.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi, (m, h, min, ampm) => {
      const hour = parseInt(h, 10);
      const minute = parseInt(min, 10);
      const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const period = ampm ? ampm.toUpperCase() : (hour < 12 ? 'AM' : 'PM');
      const minText = minute === 0 ? "o'clock" : numToWord(minute, 'en');
      return `${numToWord(hour12, 'en')} ${minText} ${period}`;
    });
  }

  // Percentages e.g. 87%
  s = s.replace(/(\d+)\s*%/g, (m, d) => {
    const word = numToWord(d, lang);
    const unit = lang === 'mr' ? 'टक्के' : (lang === 'hi' ? 'प्रतिशत' : 'percent');
    return `${word} ${unit}`;
  });

  // Decimal numbers e.g. 1.4, 28.4, 27.9, 4.7
  s = s.replace(/(\d+)\.(\d+)/g, (m, a, b) => {
    const sep = lang === 'mr' ? ' पॉईंट ' : (lang === 'hi' ? ' दशमलव ' : ' point ');
    return `${numToWord(a, lang)}${sep}${numToWord(b, lang)}`;
  });

  // Standalone numbers e.g. 18, 35, 220
  s = s.replace(/\b(\d+)\b/g, (m, d) => numToWord(d, lang));

  return s;
}

export function devanagariToPhonetic(text) {
  if (!text) return '';
  const DEVA_CONSONANTS = {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'f', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'ळ': 'l', 'क्ष': 'ksh', 'ज्ञ': 'gy'
  };

  const DEVA_VOWELS = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah', 'ऑ': 'o', 'ॲ': 'a'
  };

  const DEVA_MATRAS = {
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h', 'ॉ': 'o', 'ॅ': 'a'
  };

  let out = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const ch = text[i];

    if (DEVA_VOWELS[ch]) {
      out += DEVA_VOWELS[ch];
      continue;
    }

    if (DEVA_MATRAS[ch]) {
      if (out.endsWith('a') && ch !== 'ं' && ch !== 'ँ' && ch !== 'ः') {
        out = out.slice(0, -1);
      }
      out += DEVA_MATRAS[ch];
      continue;
    }

    if (ch === '्') {
      if (out.endsWith('a')) {
        out = out.slice(0, -1);
      }
      continue;
    }

    if (DEVA_CONSONANTS[ch]) {
      const nextChar = (i + 1 < len) ? text[i + 1] : '';
      const isNextMatra = !!DEVA_MATRAS[nextChar];
      const isNextVirama = (nextChar === '्');
      const isWordEnd = (i + 1 === len || /\s|[.,!?]/.test(nextChar));

      let c = DEVA_CONSONANTS[ch];
      if (!isNextMatra && !isNextVirama && !isWordEnd) {
        c += 'a';
      }
      out += c;
      continue;
    }

    out += ch;
  }

  return out.replace(/\s+/g, ' ').trim();
}

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
    .replace(/\[\d+\][^\n]*/g, '') // Strip step logs like [01] ...
    .replace(/Initializing marine response\.\.\./gi, '')
    .replace(/सागरी माहिती तपासत आहे\.\.\./g, '')
    .replace(/समुद्री जानकारी जाँच रहे हैं\.\.\./g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '') // Standard Unicode Emojis & Variation Selectors
    .replace(/🟢|🟡|🔴|🎣|📍|🧭|🌊|🌡️|🌿|🌬️|🌀|⚡|⛈️|🛡️|💡|📋|✓|⚙|⚓|🐟|🚢|🔬|⏱️|⛽|⛔|👮|🪸/g, '')
    .replace(/\n+/g, '. ')
    .trim();

  // 2. Localized speech acronym & unit expansion
  if (lang === 'mr') {
    clean = clean
      .replace(/SST/gi, 'समुद्राचे तापमान')
      .replace(/PFZ-01/gi, 'पी एफ झेड एक')
      .replace(/PFZ-02/gi, 'पी एफ झेड दोन')
      .replace(/PFZ-03/gi, 'पी एफ झेड तीन')
      .replace(/PFZ/gi, 'संभाव्य मासेमारी क्षेत्र')
      .replace(/km\/h|किमी\/तास/gi, ' किलोमीटर प्रति तास ')
      .replace(/km|किमी/gi, ' किलोमीटर ')
      .replace(/([0-9\u0966-\u096F.]+)\s*m\b/gi, '$1 मीटर')
      .replace(/\bSW\b/gi, 'नैऋत्य')
      .replace(/\bNM\b/gi, 'सागरी मैल')
      .replace(/°C/g, ' अंश ')
      .replace(/mg\/m³/g, ' मिलीग्राम ');
  } else if (lang === 'hi') {
    clean = clean
      .replace(/SST/gi, 'समुद्र का तापमान')
      .replace(/PFZ-01/gi, 'पी एफ जेट एक')
      .replace(/PFZ-02/gi, 'पी एफ जेट दो')
      .replace(/PFZ-03/gi, 'पी एफ जेट तीन')
      .replace(/PFZ/gi, 'मत्स्य क्षेत्र')
      .replace(/km\/h|किमी\/घंटा/gi, ' किलोमीटर प्रति घंटा ')
      .replace(/km|किमी/gi, ' किलोमीटर ')
      .replace(/([0-9\u0966-\u096F.]+)\s*m\b/gi, '$1 मीटर')
      .replace(/\bSW\b/gi, 'दक्षिण-पश्चिम')
      .replace(/\bNM\b/gi, 'समुद्री मील')
      .replace(/°C/g, ' डिग्री ')
      .replace(/mg\/m³/g, ' मिलीग्राम ');
  } else {
    clean = clean
      .replace(/SST/gi, 'Sea Surface Temperature')
      .replace(/PFZ-01/gi, 'P F Z one')
      .replace(/PFZ/gi, 'Potential Fishing Zone')
      .replace(/km\/h/gi, ' kilometres per hour ')
      .replace(/km\b/gi, ' kilometres ')
      .replace(/(\d+)\s*m\b/gi, '$1 metres')
      .replace(/\bSW\b/gi, 'southwest')
      .replace(/\bNM\b/gi, 'nautical miles')
      .replace(/°C/g, ' degrees Celsius ')
      .replace(/mg\/m³/g, ' milligrams per cubic metre ');
  }

  // 3. Convert all numbers to spoken words so TTS engines never read isolated digits
  clean = expandNumbersToWords(clean, lang);

  return clean.replace(/\s+/g, ' ').trim();
}

export class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? (window.speechSynthesis || null) : null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.currentText = '';
    this.currentLang = 'en';
    this.listeners = [];

    if (this.synth) {
      try {
        this.synth.getVoices();
        if (typeof this.synth.onvoiceschanged !== 'undefined') {
          this.synth.onvoiceschanged = () => {
            try { this.synth.getVoices(); } catch (e) {}
          };
        }
      } catch (e) {}
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
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

  speak(text, lang = 'en', onEndCallback = null) {
    if (!this.synth || !text) return;

    // Cancel any ongoing speech
    this.synth.cancel();
    this.isPausedState = false;
    this.currentText = text;
    this.currentLang = lang;

    const cleanText = prepareSpeechText(text, lang);
    const voices = (this.synth.getVoices ? this.synth.getVoices() : []) || [];

    let textToSpeak = cleanText;
    let selectedVoice = null;
    let targetLang = 'en-IN';

    if (lang === 'mr') {
      // 1. Direct Marathi voice
      selectedVoice = voices.find(v => v.lang === 'mr-IN' || v.lang === 'mr' || v.lang.startsWith('mr') || /marathi/i.test(v.name));
      
      // 2. Hindi voice (authentic Devanagari pronunciation on Windows/Chrome/Edge)
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi' || v.lang.startsWith('hi') || /hindi/i.test(v.name) || /हिन्दी/i.test(v.name));
      }

      // 3. Other Indic voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.endsWith('-IN') || v.lang.endsWith('_IN')) && !v.lang.startsWith('en'));
      }

      targetLang = selectedVoice ? selectedVoice.lang : 'mr-IN';
      textToSpeak = cleanText;
    } else if (lang === 'hi') {
      // 1. Direct Hindi voice
      selectedVoice = voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi' || v.lang.startsWith('hi') || /hindi/i.test(v.name) || /हिन्दी/i.test(v.name));

      // 2. Marathi or other Indic voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === 'mr-IN' || v.lang === 'mr' || v.lang.startsWith('mr') || /marathi/i.test(v.name));
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.endsWith('-IN') || v.lang.endsWith('_IN')) && !v.lang.startsWith('en'));
      }

      targetLang = selectedVoice ? selectedVoice.lang : 'hi-IN';
      textToSpeak = cleanText;
    } else {
      // English voice
      selectedVoice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name)) ||
                      voices.find(v => v.lang.startsWith('en-')) ||
                      voices.find(v => v.lang.startsWith('en'));
      targetLang = selectedVoice ? selectedVoice.lang : 'en-IN';
      textToSpeak = cleanText;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.lang = targetLang;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.isPausedState = false;
      this._emitState('speaking');
    };

    utterance.onpause = () => {
      this.isPausedState = true;
      this._emitState('paused');
    };

    utterance.onresume = () => {
      this.isPausedState = false;
      this._emitState('speaking');
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this._emitState('stopped');
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this._emitState('stopped');
    };

    this.synth.speak(utterance);
    this.isSpeakingState = true;
    this._emitState('speaking');
  }

  pause() {
    if (!this.synth) return false;
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isPausedState = true;
      this._emitState('paused');
      return true;
    }
    return false;
  }

  resume() {
    if (!this.synth) return false;
    if (this.synth.paused || this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
      this._emitState('speaking');
      return true;
    }
    return false;
  }

  togglePause() {
    if (!this.synth) return false;
    if (this.synth.paused || this.isPausedState) {
      this.resume();
      return false; // isPaused is false
    } else if (this.synth.speaking || this.isSpeakingState) {
      this.pause();
      return true; // isPaused is true
    }
    return false;
  }

  isSpeaking() {
    return !!(this.synth && (this.synth.speaking || this.isSpeakingState) && !this.synth.paused && !this.isPausedState);
  }

  isPaused() {
    return !!(this.synth && (this.synth.paused || this.isPausedState));
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.isPausedState = false;
    this._emitState('stopped');
  }

  onStateChange(cb) {
    if (typeof cb === 'function') {
      this.listeners.push(cb);
    }
  }

  _emitState(state) {
    this.listeners.forEach(fn => {
      try { fn(state); } catch (e) {}
    });
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
