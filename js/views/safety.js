// ORCA Marine Bridge Console — Government & Coastal Authority Persona (/#safety)
// Coastal Risk & Response Center, Risk Gauges, Alert feeds, and Situation Summary

import { MONITORED_ZONES, ACTIVE_ALERTS } from '../data/mockData.js';
import { createRiskGaugeHTML } from '../components/riskGauge.js';

export function renderSafetyView(container, { i18n, soundEngine }) {
  const gaugesHtml = MONITORED_ZONES.map((zone, idx) => {
    const gauge = createRiskGaugeHTML({
      id: `safety-zone-gauge-${idx}`,
      score: zone.riskScore,
      title: zone.status,
      size: 140
    });

    return `
      <div class="bezel-panel panel-body" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;">
        <div class="font-data" style="font-size: 0.82rem; font-weight: 700; color: var(--parchment-bright);">
          ${zone.name}
        </div>
        <div class="font-data text-muted" style="font-size: 0.65rem;">
          ${zone.coordinates}
        </div>
        
        <div style="margin: 4px 0;">
          ${gauge}
        </div>

        <div style="width: 100%; border-top: 1px solid var(--chart-line); padding-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-family: var(--font-data); font-size: 0.68rem;">
          <div style="text-align: left;">
            <span class="text-muted">WIND:</span> <span class="text-amber">${zone.wind.split(' ')[0]}</span>
          </div>
          <div style="text-align: right;">
            <span class="text-muted">SWELL:</span> <span class="${zone.riskScore > 70 ? 'text-red' : 'text-green'}">${zone.swell.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const alertsHtml = ACTIVE_ALERTS.map(alert => `
    <div class="alert-card-item severity-${alert.severity}" data-severity="${alert.severity}">
      <div class="alert-item-header">
        <span class="panel-badge ${alert.severity === 'CRITICAL' ? 'badge-red' : (alert.severity === 'HIGH' ? 'badge-amber' : 'badge-green')}">
          ${alert.severity} // ${alert.category}
        </span>
        <span class="font-data text-amber" style="font-size: 0.70rem; font-weight: 700;">
          RISK SCORE: ${alert.riskGaugeScore}/100
        </span>
      </div>

      <h4 class="font-display" style="font-size: 1.0rem; font-weight: 700; color: var(--parchment-bright); margin: 6px 0 4px 0;">
        ${alert.title}
      </h4>

      <p style="font-size: 0.82rem; color: var(--parchment); line-height: 1.45; margin-bottom: 8px;">
        ${alert.description}
      </p>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--chart-line); padding-top: 6px; font-family: var(--font-data); font-size: 0.68rem;">
        <span class="text-muted">ISSUED: <strong class="text-parchment">${alert.issuedUtc}</strong></span>
        <span class="text-amber">AREA: ${alert.coordinates}</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="safety-view-container">
      
      <!-- Stakeholder Header & Persona Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--chart-line); padding-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="#/" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; padding: 4px 12px; font-size: 0.78rem;">
            ← Change Role
          </a>
          <span class="panel-badge badge-red" style="font-size: 0.70rem;">🛡️ GOVERNMENT &amp; COASTAL AUTHORITY CENTER</span>
        </div>

        <div class="telemetry-status-pill">
          <span class="beacon-pulse" style="box-shadow: 0 0 8px var(--radar-red);"></span>
          COASTAL DEFENSE &amp; EMERGENCY WATCH ACTIVE
        </div>
      </div>

      <!-- Hero Header -->
      <div class="bezel-panel" style="padding: 20px; background: rgba(18,27,34,0.85); margin-bottom: 20px; border-top: 3px solid var(--radar-red);">
        <h1 class="font-display text-parchment-bright" style="font-size: 1.8rem; font-weight: 700; margin-bottom: 4px;">
          Coastal Intelligence Center
        </h1>
        <div class="font-data text-muted" style="font-size: 0.78rem; margin-bottom: 14px;">
          Monitor marine risks, active alerts, coastal weather warnings &amp; situation awareness.
        </div>

        <!-- AI Situation Summary -->
        <div style="padding: 12px 14px; background: rgba(255,92,92,0.08); border: 1px solid var(--radar-red); border-radius: var(--radius); font-size: 0.85rem; color: var(--parchment); line-height: 1.5; margin-bottom: 14px;">
          <span class="font-data text-red" style="font-size: 0.70rem; font-weight: 700; letter-spacing: 0.08em; display: block; margin-bottom: 2px;">
            ⚠️ AI SITUATION SUMMARY
          </span>
          Marine risk along Maharashtra coast is currently moderate, primarily driven by strong winds and 2.1–2.8m waves. No active cyclone directly affecting Mumbai, but small craft advisory remains hoisted.
        </div>

        <!-- Authority Action Quick Queries -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="#/chat?q=Is+there+a+cyclone+risk+near+Mumbai%3F" class="btn-tactical btn-tactical-amber" style="text-decoration: none; font-size: 0.75rem;">
            🚨 "What are today's major marine risks?"
          </a>
          <a href="#/chat?q=Summarize+current+coastal+conditions" class="btn-tactical text-brass" style="text-decoration: none; font-size: 0.75rem; border-color: var(--brass);">
            📋 "Summarize coastal conditions"
          </a>
          <a href="#/chat?q=Which+areas+require+attention%3F" class="btn-tactical text-brass" style="text-decoration: none; font-size: 0.75rem; border-color: var(--brass);">
            📍 "Which areas require attention?"
          </a>
        </div>
      </div>

      <!-- Regional Risk Gauges Strip -->
      <div style="margin-bottom: 24px;">
        <div class="font-data text-brass" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 10px; text-transform: uppercase;">
          REGIONAL HAZARD GAUGES BY SECTOR
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
          ${gaugesHtml}
        </div>
      </div>

      <!-- Active Alerts Feed -->
      <div class="safety-feed-section bezel-panel panel-body">
        <div class="panel-header" style="background: transparent; padding: 0 0 10px 0; border-bottom: 1px solid var(--chart-line); margin-bottom: 14px;">
          <span class="panel-title">
            <span class="icon">📢</span> ACTIVE COASTAL HAZARD ALERTS &amp; DIRECTIVES
          </span>
          <span class="panel-badge badge-red">${ACTIVE_ALERTS.length} ACTIVE DISPATCHES</span>
        </div>

        <div class="alerts-feed-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
          ${alertsHtml}
        </div>
      </div>

    </div>
  `;
}
