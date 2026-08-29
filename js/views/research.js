// ORCA Marine Bridge Console — Oceanographic Research (/#research)
// Chart.js trends for SST, Chlorophyll-a, Biomass Yield, and Ecosystem Reasoning Engine

import { RESEARCH_SERIES } from '../data/mockData.js';

export function renderResearchView(container, { i18n, soundEngine }) {
  container.innerHTML = `
    <div class="research-view-container">
      <!-- Section Header -->
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <h1 class="font-display text-parchment-bright" style="font-size: 1.8rem; font-weight: 700; margin-bottom: 2px;">
            Oceanographic Intelligence & Trend Analysis
          </h1>
          <div class="font-data text-muted" style="font-size: 0.75rem;">
            SATELLITE THERMAL COUPLING, UPWELLING CORRELATIONS & PFZ FORMATION
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <span class="telemetry-status-pill">
            <span class="beacon-pulse"></span>
            SENTINEL-3 OLCI & NOAA AVHRR FUSED
          </span>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Chart 1: Sea Surface Temperature & Anomaly -->
        <div class="bezel-panel panel-body">
          <div class="panel-header" style="background: transparent; padding: 0 0 8px 0; border-bottom: 1px solid var(--chart-line);">
            <span class="panel-title">
              <span class="icon">🌡️</span> SEA SURFACE TEMPERATURE (°C) & THERMAL ANOMALY
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
      <div class="bezel-panel panel-body">
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
              02 // DIATOM BLOOM & TROPHIC AGGREGATION
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

  // Chart styling defaults matching Bridge Console
  Chart.defaults.color = '#7C8B93';
  Chart.defaults.font.family = 'IBM Plex Mono, monospace';
  Chart.defaults.font.size = 11;

  // 1. SST Trend Chart
  const sstCanvas = container.querySelector('#chart-sst');
  if (sstCanvas) {
    new Chart(sstCanvas, {
      type: 'line',
      data: {
        labels: RESEARCH_SERIES.dates,
        datasets: [
          {
            label: 'Konkan Shelf SST (°C)',
            data: RESEARCH_SERIES.sstKonkan,
            borderColor: '#FFB454',
            backgroundColor: 'rgba(255, 180, 84, 0.12)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#FFB454',
            pointRadius: 4
          },
          {
            label: 'Thermal Anomaly (°C)',
            data: RESEARCH_SERIES.sstAnomaly,
            borderColor: '#6BCB77',
            borderDash: [4, 4],
            tension: 0.35,
            pointBackgroundColor: '#6BCB77',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } }
        },
        scales: {
          x: { grid: { color: '#1F2C33' } },
          y: { grid: { color: '#1F2C33' } }
        }
      }
    });
  }

  // 2. Chlorophyll & Biomass Chart
  const chloroCanvas = container.querySelector('#chart-chlorophyll');
  if (chloroCanvas) {
    new Chart(chloroCanvas, {
      type: 'bar',
      data: {
        labels: RESEARCH_SERIES.dates,
        datasets: [
          {
            type: 'bar',
            label: 'Chlorophyll-a (mg/m³)',
            data: RESEARCH_SERIES.chlorophyll,
            backgroundColor: 'rgba(107, 203, 119, 0.45)',
            borderColor: '#6BCB77',
            borderWidth: 1
          },
          {
            type: 'line',
            label: 'Fish Catch Index',
            data: RESEARCH_SERIES.pfzCatchYield,
            borderColor: '#C9A66B',
            yAxisID: 'y1',
            tension: 0.3,
            pointBackgroundColor: '#C9A66B'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } }
        },
        scales: {
          x: { grid: { color: '#1F2C33' } },
          y: {
            grid: { color: '#1F2C33' },
            title: { display: true, text: 'mg/m³' }
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Catch Index' }
          }
        }
      }
    });
  }
}
