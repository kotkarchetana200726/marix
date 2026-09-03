// ORCA Marine AI — Agent Bridge Service
// Orchestrates multi-agent marine intelligence reasoning with 100% strict multilingual language lock

import { createPFZCard, createWeatherCard, createRiskCard, createRoutePreviewCard, createReasoningLogCard } from '../components/cards.js';
import { PFZ_ZONES, WEATHER_FORECAST, HAZARDS, ROUTE_PRESETS } from '../data/marineData.js';
import { getGlobalLanguage, t } from '../data/translations.js';

export class AgentBridgeService {
  constructor(options = {}) {
    this.mode = options.mode || 'SIMULATED'; 
    this.endpointUrl = options.endpointUrl || '/api/orca/reason';
    this.apiKey = options.apiKey || '';
  }

  async runPipeline(userPrompt, options = {}) {
    const lang = options.lang || getGlobalLanguage();
    const intent = this.detectIntent(userPrompt);
    const plan = this.generatePlanForIntent(intent, userPrompt, lang);

    if (options.onStep) {
      for (let i = 0; i < plan.steps.length; i++) {
        options.onStep(plan.steps[i], i + 1, plan.steps.length);
        await this.delay(220);
      }
    }

    await this.delay(150);

    return {
      intent,
      lang,
      text: plan.prose,
      prose: plan.prose,
      cardsHtml: plan.cardsHtml,
      timestamp: new Date().toISOString()
    };
  }

  detectIntent(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('pfz') || p.includes('fish') || p.includes('मासेमारी') || p.includes('मछली')) return 'PFZ_QUERY';
    if (p.includes('route') || p.includes('veraval') || p.includes('मार्ग') || p.includes('रास्ता')) return 'ROUTE_OPTIMIZE';
    if (p.includes('sst') || p.includes('chlorophyll') || p.includes('तापमान')) return 'RESEARCH_SST';
    return 'GENERAL_SAFETY';
  }

  generatePlanForIntent(intent, promptText, lang = 'en') {
    switch (intent) {
      case 'PFZ_QUERY': {
        const pfz = PFZ_ZONES[0];
        
        if (lang === 'mr') {
          return {
            steps: [
              "[01] उपग्रह क्लोरोफिल चित्रांचे विश्लेषण करत आहे...",
              "[02] समुद्राच्या तापमानाचा अंदाज घेत आहे...",
              "[03] मासेमारीच्या संभाव्य क्षेत्राची निश्चिती करत आहे..."
            ],
            prose: `रत्नागिरी नैऋत्य भागात **PFZ-01** मासेमारी क्षेत्र आढळले आहे. या ठिकाणी क्लोरोफिलचे प्रमाण **4.7 mg/m³** असून समुद्राचे तापमान **27.9°C** आहे. बांगडा आणि सुरमई माशांचे प्रमाण जास्त आहे.`,
            cardsHtml: [
              createPFZCard({ ...pfz, name: "रत्नागिरी नैऋत्य PFZ-01", advisory: "मासेमारीसाठी उत्तम परिस्थिती." }),
              createWeatherCard({
                pressure: "1011.2 hPa",
                sst: "27.9°C",
                wind: "18 किमी/तास नैऋत्य",
                swell: "1.4m",
                visibility: "7.2 km"
              })
            ].join('')
          };
        }

        if (lang === 'hi') {
          return {
            steps: [
              "[01] उपग्रह क्लोरोफिल छवियों का विश्लेषण किया जा रहा है...",
              "[02] समुद्र के तापमान का आकलन किया जा रहा है...",
              "[03] संभावित मछली पकड़ने के क्षेत्र की पुष्टि की जा रही है..."
            ],
            prose: `रत्नागिरी दक्षिण-पश्चिम क्षेत्र में **PFZ-01** मत्स्य क्षेत्र की पहचान की गई है। यहाँ क्लोरोफिल का स्तर **4.7 mg/m³** और समुद्र का तापमान **27.9°C** है।`,
            cardsHtml: [
              createPFZCard({ ...pfz, name: "रत्नागिरी दक्षिण-पश्चिम PFZ-01", advisory: "मछली पकड़ने के लिए उत्कृष्ट स्थिति।" }),
              createWeatherCard({
                pressure: "1011.2 hPa",
                sst: "27.9°C",
                wind: "18 किमी/घंटा दक्षिण-पश्चिम",
                swell: "1.4m",
                visibility: "7.2 km"
              })
            ].join('')
          };
        }

        return {
          steps: [
            "[01] Filtering satellite multispectral chlorophyll imagery...",
            "[02] Correlating sea surface temperature gradients...",
            "[03] Identifying high-yield fishing zones..."
          ],
          prose: `High-yield Potential Fishing Zone (PFZ-01) isolated off Ratnagiri southwest coast. Chlorophyll-a peak concentration at 4.7 mg/m³ with optimal SST of 27.9°C.`,
          cardsHtml: [
            createPFZCard(pfz),
            createWeatherCard({
              pressure: "1011.2 hPa",
              sst: "27.9°C",
              wind: "18 km/h SW",
              swell: "1.4m",
              visibility: "7.2 km"
            })
          ].join('')
        };
      }

      default: {
        if (lang === 'mr') {
          return {
            steps: [
              "[01] सर्व सागरी डेटा स्रोत तपासले जात आहेत...",
              "[02] हवामान आणि समुद्राच्या परिस्थितीचे मूल्यांकन केले जात आहे...",
              "[03] शिफारस तयार केली जात आहे..."
            ],
            prose: `**ORCA सागरी माहिती प्रणाली** ("${promptText}" साठी)\n\nरत्नागिरी किनाऱ्याजवळ समुद्राची स्थिती मध्यम आहे. समुद्राच्या पृष्ठभागाचे तापमान **28.4°C** आणि लाटांची उंची **1.4 मीटर** आहे.`,
            cardsHtml: [
              createRiskCard({
                riskScore: 21,
                status: "सुरक्षित",
                zoneName: "रत्नागिरी किनारा",
                title: "सागरी स्थिती सामान्य",
                description: "लाटांची उंची 1.4 मीटर. किनाऱ्याजवळ प्रवास सुरक्षित आहे.",
                coordinates: "16.99° N 73.31° E",
                swell: "1.4m",
                wind: "18 किमी/तास"
              })
            ].join('')
          };
        }

        if (lang === 'hi') {
          return {
            steps: [
              "[01] सभी समुद्री डेटा स्रोतों की जाँच की जा रही है...",
              "[02] मौसम और समुद्री परिस्थितियों का मूल्यांकन किया जा रहा है...",
              "[03] सिफारिश तैयार की जा रही है..."
            ],
            prose: `**ORCA समुद्री जानकारी प्रणाली** ("${promptText}" के लिए)\n\nरत्नागिरी तट के पास समुद्र की स्थिति मध्यम है। समुद्र की सतह का तापमान **28.4°C** और लहरों की ऊँचाई **1.4 मीटर** है।`,
            cardsHtml: [
              createRiskCard({
                riskScore: 21,
                status: "सुरक्षित",
                zoneName: "रत्नागिरी तट",
                title: "समुद्री स्थिति सामान्य",
                description: "लहरों की ऊँचाई 1.4 मीटर। तट के पास यात्रा सुरक्षित है।",
                coordinates: "16.99° N 73.31° E",
                swell: "1.4m",
                wind: "18 किमी/घंटा"
              })
            ].join('')
          };
        }

        return {
          steps: [
            "[01] Querying real-time coastal telemetry...",
            "[02] Evaluating sea state and risk scores...",
            "[03] Synthesizing operational advisory..."
          ],
          prose: `**ORCA Marine Intelligence System** for *"${promptText}"*\n\nSea conditions across Ratnagiri sector are moderate. Sea Surface Temp is **28.4°C** with **1.4 m** wave height.`,
          cardsHtml: [
            createRiskCard({
              riskScore: 21,
              status: "SYSTEM READY",
              zoneName: "RATNAGIRI COAST",
              title: "Operational Status Nominal",
              description: "Calm to moderate sea state. Safe for coastal operations.",
              coordinates: "16.99° N 73.31° E",
              swell: "1.4m",
              wind: "18 km/h"
            })
          ].join('')
        };
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
