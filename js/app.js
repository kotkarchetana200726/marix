// ORCA Marine Bridge Console — Master Bootstrapper
// Manages global state, Web Audio API sound synthesis, i18n localization, and route orchestration

import { I18N } from './data/mockData.js';
import { mockDataService } from './services/mockDataService.js';
import { Router } from './router.js';
import { renderLandingView } from './views/landing.js';
import { renderFishermanView } from './views/fisherman.js';
import { renderChatView } from './views/chat.js';
import { renderMapView } from './views/map.js';
import { renderSafetyView } from './views/safety.js';
import { renderRouteView } from './views/route.js';
import { renderResearchView } from './views/research.js';
import { renderAdminView } from './views/admin.js';

// Procedural Web Audio API Sound Synthesizer
class BridgeSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playMechanicalClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  playTacticalBeep() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  playTacticalChirp() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1240, this.audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  playTransmissionSound() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch (e) {}
  }
}

class OrcaBridgeApp {
  constructor() {
    this.currentLang = localStorage.getItem('orca_lang') || 'en';
    this.soundEngine = new BridgeSoundEngine();
    this.router = null;
  }

  init() {
    mockDataService.ensureLoaded();
    this.bindStaticUI();
    this.startLiveClocks();

    const routes = {
      '/': renderLandingView,
      '/fisherman': renderFishermanView,
      '/chat': renderChatView,
      '/map': renderMapView,
      '/safety': renderSafetyView,
      '/route': renderRouteView,
      '/research': renderResearchView,
      '/admin': renderAdminView
    };

    this.router = new Router(routes, {
      i18n: I18N[this.currentLang] || I18N.en,
      soundEngine: this.soundEngine,
      currentLang: this.currentLang
    });

    this.router.init();
    this.updateStaticTranslations();
  }

  bindStaticUI() {
    // Sound Toggle Button
    const audioBtn = document.getElementById('btn-sound-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isSoundOn = this.soundEngine.toggleSound();
        audioBtn.classList.toggle('sound-on', isSoundOn);
        audioBtn.innerHTML = isSoundOn ? '🔊' : '🔇';
        if (isSoundOn) this.soundEngine.playTacticalBeep();
      });
    }

    // Language Switcher Buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang && lang !== this.currentLang) {
          this.setLanguage(lang);
          this.soundEngine.playMechanicalClick();
        }
      });
    });

    // Console Rail navigation sound feedback
    const navLinks = document.querySelectorAll('.rail-nav-item');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.soundEngine.playMechanicalClick();
      });
    });
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('orca_lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    this.updateStaticTranslations();

    if (this.router) {
      this.router.options.i18n = I18N[lang] || I18N.en;
      this.router.options.currentLang = lang;
      this.router.refresh();
    }
  }

  updateStaticTranslations() {
    const dict = I18N[this.currentLang] || I18N.en;
    const titleEl = document.getElementById('brand-title-text');
    const subEl = document.getElementById('brand-sub-text');
    if (titleEl) titleEl.innerHTML = `ORCA <span>CONSOLE</span>`;
    if (subEl) subEl.textContent = dict.system_subtitle;
  }

  startLiveClocks() {
    const clockEl = document.getElementById('telemetry-clock');
    const coordEl = document.getElementById('telemetry-gps');

    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substr(11, 8) + ' UTC';
      if (clockEl) clockEl.textContent = timeStr;
    };

    updateClock();
    setInterval(updateClock, 1000);

    let baseLat = 18.9812;
    let baseLon = 72.8245;
    setInterval(() => {
      const latOffset = (Math.random() - 0.5) * 0.0004;
      const lonOffset = (Math.random() - 0.5) * 0.0004;
      baseLat += latOffset;
      baseLon += lonOffset;
      if (coordEl) {
        coordEl.textContent = `${baseLat.toFixed(4)}°N, ${baseLon.toFixed(4)}°E`;
      }
    }, 4000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.OrcaApp = new OrcaBridgeApp();
  window.OrcaApp.init();
});
