// ORCA Marine Bridge Console — Landing View (/# or /#/)
// Atmospheric Bridge Introduction, Radar Sweep Hero, and Direct Gateway

export function renderLandingView(container, { i18n, soundEngine }) {
  container.innerHTML = `
    <div class="landing-view">
      <div class="landing-hero-grid">
        <!-- Left Hero Content -->
        <div class="hero-left">
          <div class="hero-wordmark-plate">
            <span class="beacon-pulse"></span>
            <span class="font-data text-brass" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;">
              ORCA MARITIME REASONING ENGINE v2.4
            </span>
          </div>

          <h1 class="hero-title">
            The Bridge Console for <em>Autonomous Marine Intelligence</em>.
          </h1>

          <p class="hero-prose">
            ${i18n.landing_sub}
          </p>

          <div class="hero-actions">
            <a href="#/chat" id="btn-enter-console" class="btn-tactical btn-tactical-amber" style="padding: 12px 24px; font-size: 0.88rem;">
              <span>⚡</span> ${i18n.enter_console}
            </a>
            <a href="#/map" class="btn-tactical" style="padding: 12px 20px;">
              <span>🗺️</span> ${i18n.view_live_map}
            </a>
            <a href="#/safety" class="btn-tactical" style="padding: 12px 20px;">
              <span>🛡️</span> SAFETY ALERTS
            </a>
          </div>

          <div class="hero-stat-ribbon">
            <div class="stat-item">
              <span class="stat-label">MONITORED MARITIME AREA</span>
              <span class="stat-val">1.2M NM²</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">ACTIVE PFZ THERMAL FRONTS</span>
              <span class="stat-val text-green">4 DETECTED</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">STORM HAZARD INDEX</span>
              <span class="stat-val text-red">78/100 (HIGH)</span>
            </div>
          </div>
        </div>

        <!-- Right Visual: Analog Radar Sweep Display -->
        <div class="hero-right" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="radar-display-bezel">
            <div class="radar-grid-rings"></div>
            <div class="radar-crosshairs"></div>
            <div class="radar-sweep-wedge"></div>
            
            <!-- Simulated Radar Target Blips -->
            <div class="radar-blip" style="top: 32%; left: 65%;" title="PFZ Alpha Thermal Front"></div>
            <div class="radar-blip" style="top: 70%; left: 40%; background: var(--radar-red); box-shadow: 0 0 8px var(--radar-red);" title="Cyclone Depression Varuna"></div>
            <div class="radar-blip" style="top: 48%; left: 52%; background: var(--phosphor-amber); box-shadow: 0 0 8px var(--phosphor-amber);" title="Vessel INS Sagar Vikram"></div>
            <div class="radar-blip" style="top: 25%; left: 30%;" title="Fishing Fleet Alpha"></div>

            <div style="position: absolute; bottom: 12px; font-family: var(--font-data); font-size: 0.65rem; color: var(--brass); letter-spacing: 0.08em;">
              RADAR RANGE: 120 NM
            </div>
          </div>

          <div class="font-data text-muted" style="font-size: 0.72rem; margin-top: 14px; text-align: center;">
            STATION ID: <span class="text-brass">IN-BOM-09</span> • MODE: <span class="text-green">PASSIVE MULTISPECTRAL</span>
          </div>
        </div>
      </div>

      <!-- Quick Operational Highlights -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 30px;">
        <div class="bezel-panel panel-body" style="background: rgba(18,27,34,0.6);">
          <div class="font-data text-amber" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
            01 // REASONING-FIRST CANVAS
          </div>
          <div style="font-size: 0.84rem; color: var(--parchment);">
            Natural language vessel guidance streaming real-time analog risk dials, PFZ thermal coordinates, and weather cards.
          </div>
        </div>

        <div class="bezel-panel panel-body" style="background: rgba(18,27,34,0.6);">
          <div class="font-data text-green" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
            02 // SATELLITE & SENSOR FUSION
          </div>
          <div style="font-size: 0.84rem; color: var(--parchment);">
            Direct integration with INCOIS, NOAA SST Geo-Polar, Sentinel-3 Chlorophyll, and IMD Coastal Doppler radars.
          </div>
        </div>

        <div class="bezel-panel panel-body" style="background: rgba(18,27,34,0.6);">
          <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
            03 // PARETO ROUTE OPTIMIZATION
          </div>
          <div style="font-size: 0.84rem; color: var(--parchment);">
            Evaluates bathymetry and rogue swell fields to generate fuel-optimal routes that avoid cyclone danger cores.
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach interactive sounds
  const enterBtn = container.querySelector('#btn-enter-console');
  if (enterBtn && soundEngine) {
    enterBtn.addEventListener('click', () => {
      soundEngine.playTacticalChirp();
    });
  }
}
