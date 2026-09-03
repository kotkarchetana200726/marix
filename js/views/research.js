// ORCA Marine Bridge Console — Marine Researcher Persona (/#research)
// AI Marine Research Workspace, Chart.js trends, evidence & oceanographic insights

import { RESEARCH_SERIES } from '../data/mockData.js';

export function renderResearchView(container, { i18n, soundEngine }) {
  container.innerHTML = `
    <div class="research-view-container">
      
      <!-- Stakeholder Header & Persona Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--chart-line); padding-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="#/" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; padding: 4px 12px; font-size: 0.78rem;">
            ← Change Role
          </a>
          <span class="panel-badge badge-amber" style="font-size: 0.70rem;">🔬 MARINE RESEARCHER WORKSPACE</span>
        </div>

        <div class="telemetry-status-pill">
          <span class="beacon-pulse"></span>
          SENTINEL-3 OLCI &amp; NOAA AVHRR FUSED DATA
        </div>
      </div>

      <!-- Hero Header -->
      <div class="bezel-panel" style="padding: 20px; background: rgba(18,27,34,0.8); margin-bottom: 20px; border-top: 3px solid var(--brass);">
        <h1 class="font-display text-parchment-bright" style="font-size: 1.8rem; font-weight: 700; margin-bottom: 4px;">
          Marine Research Workspace
        </h1>
        <div class="font-data text-muted" style="font-size: 0.78rem; margin-bottom: 14px;">
          Explore oceanographic patterns, satellite thermal coupling, upwelling correlations &amp; AI-generated evidence.
        </div>

        <!-- Research Quick Query Bar -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="#/chat?q=Analyze+current+ocean+conditions+and+SST+anomaly" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; font-size: 0.75rem;">
            🔍 "Analyze current ocean conditions"
          </a>
          <a href="#/chat?q=How+have+wave+conditions+changed+in+this+region%3F" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; font-size: 0.75rem;">
            📈 "How have wave conditions changed?"
          </a>
          <a href="#/chat?q=What+factors+are+contributing+to+today%27s+marine+risk%3F" class="btn-tactical btn-tactical-sm text-brass" style="text-decoration: none; font-size: 0.75rem;">
            🧠 "What factors contribute to marine risk?"
          </a>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Chart 1: Sea Surface Temperature & Anomaly -->
        <div class="bezel-panel panel-body">
          <div class="panel-header" style="background: transparent; padding: 0 0 8px 0; border-bottom: 1px solid var(--chart-line);">
            <span class="panel-title">
              <span class="icon">🌡️</span> SEA SURFACE TEMPERATURE (°C) &amp; THERMAL ANOMALY
            </span>
            <span class="panel-badge badge-amber">30-DAY TREND</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="chart-sst"></canvas>
          </div>
        </div>

        <!-- Chart 2: Chlorophyll-a vs Fish Catch Yield -->
        <div class="bezel-panel panel-body">
          <div class="panel-header" style="background: transparent; padding: 0 0 8px 0; border-bottom: 1px solid var(--chart-line);">
            <span class="panel-title">
              <span class="icon">🌿</span> CHLOROPHYLL-A CONCENTRATION (MG/M³) VS BIOMASS
            </span>
            <span class="panel-badge badge-green">HIGH CORRELATION (R²=0.92)</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="chart-chlorophyll"></canvas>
          </div>
        </div>
      </div>

      <!-- Ecosystem "Why?" Reasoning Engine Panel -->
      <div class="bezel-panel panel-body" style="margin-top: 20px;">
        <div class="panel-header" style="background: transparent; padding: 0 0 10px 0; border-bottom: 1px solid var(--chart-line); margin-bottom: 12px;">
          <span class="panel-title">
            <span class="icon">🧠</span> ECOSYSTEM "WHY?" REASONING ENGINE
          </span>
          <span class="panel-badge badge-amber">MULTIMODAL SYNTHESIS</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
          <div style="background: rgba(10, 16, 20, 0.6); border: 1px solid var(--chart-line); border-radius: var(--radius); padding: 12px;">
            <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
              01 // MONSOON THERMOCLINE DISPLACEMENT
            </div>
            <div style="font-size: 0.82rem; color: var(--parchment); line-height: 1.5;">
              Ekman transport driven by south-westerly monsoon winds produces offshore surface divergence along the Konkan coast. Cold, nutrient-dense sub-surface water (26.5°C) is elevated into the photic zone.
            </div>
          </div>

          <div style="background: rgba(10, 16, 20, 0.6); border: 1px solid var(--chart-line); border-radius: var(--radius); padding: 12px;">
            <div class="font-data text-green" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
              02 // DIATOM BLOOM &amp; TROPHIC AGGREGATION
            </div>
            <div style="font-size: 0.82rem; color: var(--parchment); line-height: 1.5;">
              Upwelled nitrates fuel rapid diatom proliferation, driving chlorophyll-a to 4.2 mg/m³. Herbivorous pelagics (Sardinella longiceps) aggregate within 48 hours of peak bloom.
            </div>
          </div>

          <div style="background: rgba(10, 16, 20, 0.6); border: 1px solid var(--chart-line); border-radius: var(--radius); padding: 12px;">
            <div class="font-data text-amber" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
              03 // PREDICTIVE HARVEST ADVISORY
            </div>
            <div style="font-size: 0.82rem; color: var(--parchment); line-height: 1.5;">
              The thermal gradient edge at 50-70m depth contours represents an optimal target for purse-seine operations with a 96% catch success probability over the next 36 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize Chart.js Graphs
  if (typeof Chart === 'undefined') return;

  const ctxSst = container.querySelector('#chart-sst')?.getContext('2d');
  const ctxChl = container.querySelector('#chart-chlorophyll')?.getContext('2d');

  if (ctxSst) {
    new Chart(ctxSst, {
      type: 'line',
      data: {
        labels: RESEARCH_SERIES.dates,
        datasets: [
          {
            label: 'Sea Surface Temp (°C)',
            data: RESEARCH_SERIES.sst,
            borderColor: '#FFB454',
            backgroundColor: 'rgba(255, 180, 84, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: '10yr Climatological Baseline (°C)',
            data: RESEARCH_SERIES.sstBaseline,
            borderColor: '#7C8B93',
            borderDash: [4, 4],
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#E9E2D0', font: { family: 'IBM Plex Mono', size: 11 } } } },
        scales: {
          x: { ticks: { color: '#7C8B93', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { color: '#19252B' } },
          y: { ticks: { color: '#7C8B93', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { color: '#19252B' } }
        }
      }
    });
  }

  if (ctxChl) {
    new Chart(ctxChl, {
      type: 'bar',
      data: {
        labels: RESEARCH_SERIES.dates,
        datasets: [
          {
            label: 'Chlorophyll-a (mg/m³)',
            data: RESEARCH_SERIES.chlorophyll,
            backgroundColor: 'rgba(107, 203, 119, 0.6)',
            borderColor: '#6BCB77',
            borderWidth: 1
          },
          {
            type: 'line',
            label: 'Biomass Catch Index',
            data: RESEARCH_SERIES.yieldIndex,
            borderColor: '#C9A66B',
            borderWidth: 2,
            fill: false,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#E9E2D0', font: { family: 'IBM Plex Mono', size: 11 } } } },
        scales: {
          x: { ticks: { color: '#7C8B93', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { color: '#19252B' } },
          y: { ticks: { color: '#7C8B93', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { color: '#19252B' } }
        }
      }
    });
  }
}
