// ORCA Marine Bridge Console — Landing View (/# or /#/)
// Stakeholder-Centric Persona Selection Landing Experience

export function renderLandingView(container, { i18n, soundEngine }) {
  container.innerHTML = `
    <div class="landing-view" style="max-width: 1280px; margin: 0 auto; padding: 24px 20px;">
      
      <!-- Top Telemetry Status Strip -->
      <div class="telemetry-status-strip bezel-panel" style="margin-bottom: 28px; padding: 10px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: rgba(10,16,20,0.85); border-left: 3px solid var(--phosphor-amber);">
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div class="telemetry-pill" style="display: flex; align-items: center; gap: 6px; font-family: var(--font-data); font-size: 0.72rem;">
            <span class="beacon-pulse" style="width:6px; height:6px;"></span>
            <span class="text-green" style="font-weight: 700;">ORCA CORE ONLINE</span>
          </div>
          <span class="text-muted">•</span>
          <div class="telemetry-pill" style="display: flex; align-items: center; gap: 6px; font-family: var(--font-data); font-size: 0.72rem;">
            <span class="text-brass" style="font-weight: 700;">4 STAKEHOLDER FRONTENDS ACTIVE</span>
          </div>
        </div>
        
        <div class="font-data text-muted" style="font-size: 0.68rem; letter-spacing: 0.08em;">
          TAGLINE: <span class="text-brass">ONE OCEAN. DIFFERENT DECISIONS. ONE INTELLIGENT PLATFORM.</span>
        </div>
      </div>

      <!-- Welcome Hero Section -->
      <div class="hero-welcome-box" style="text-align: center; margin-bottom: 36px; padding: 28px 24px; background: rgba(18,27,34,0.4); border-radius: var(--radius); border: 1px dashed rgba(201,166,107,0.25); backdrop-filter: blur(8px);">
        <div style="font-size: 3.2rem; margin-bottom: 8px;">⚓</div>
        <h1 class="font-display" style="font-size: 2.8rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 6px; line-height: 1.15;">
          <span style="color: var(--brass);">ORCA</span>
        </h1>
        <h2 class="font-display" style="font-size: 1.35rem; color: var(--phosphor-amber); font-weight: 600; margin-bottom: 14px;">
          Intelligent Marine Operations
        </h2>
        <p class="font-body text-parchment" style="font-size: 1.0rem; max-width: 680px; margin: 0 auto 16px auto; line-height: 1.6; font-style: italic;">
          Understand the ocean. Make safer decisions. Act with confidence.
        </p>
        <div style="display: inline-block; padding: 5px 16px; background: rgba(107,203,119,0.12); border: 1px solid var(--phosphor-green); border-radius: 20px; font-family: var(--font-data); font-size: 0.75rem; color: var(--phosphor-green); font-weight: 700; letter-spacing: 0.08em;">
          ONE ORCA CORE — FOUR STAKEHOLDER EXPERIENCES
        </div>
      </div>

      <!-- STAKEHOLDER SELECTION GRID (EXACTLY 4 CARDS) -->
      <div style="margin-bottom: 40px;">
        <h2 class="font-display" style="font-size: 1.5rem; font-weight: 700; color: var(--parchment-bright); text-align: center; margin-bottom: 24px; letter-spacing: 0.04em;">
          How can ORCA help you?
        </h2>

        <div class="stakeholder-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
          
          <!-- CARD 1 — FISHERMAN -->
          <div class="stakeholder-card bezel-panel" style="padding: 24px; background: rgba(18,27,34,0.85); border: 1px solid var(--chart-line); border-top: 4px solid var(--phosphor-green); border-radius: var(--radius); display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.25s ease;" onclick="window.location.hash='#/chat?role=fisherman'">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(107,203,119,0.15); border: 1px solid var(--phosphor-green); display: flex; align-items: center; justify-content: center; font-size: 1.7rem; color: var(--phosphor-green);">
                  🎣
                </div>
                <span class="panel-badge badge-green" style="font-size: 0.65rem;">VOICE FIRST</span>
              </div>
              <h3 class="font-display" style="font-size: 1.4rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 8px;">
                Fisherman
              </h3>
              <p class="font-body text-muted" style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">
                Simple marine answers, safety guidance and voice assistance in English, Hindi, or Marathi.
              </p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="#/chat?role=fisherman" class="btn-tactical btn-tactical-green" style="text-decoration: none; text-align: center; padding: 12px 18px; font-weight: 700; font-size: 0.88rem; display: block;" onclick="event.stopPropagation();">
                I'm a Fisherman →
              </a>
              <a href="#/fisherman" class="btn-tactical text-brass" style="text-decoration: none; text-align: center; padding: 6px 12px; font-size: 0.75rem; display: block; border-color: var(--brass);" onclick="event.stopPropagation();">
                🎙️ Simple Voice Mode
              </a>
            </div>
          </div>

          <!-- CARD 2 — RESEARCHER -->
          <div class="stakeholder-card bezel-panel" style="padding: 24px; background: rgba(18,27,34,0.85); border: 1px solid var(--chart-line); border-top: 4px solid var(--brass); border-radius: var(--radius); display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.25s ease;" onclick="window.location.hash='#/research'">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(201,166,107,0.15); border: 1px solid var(--brass); display: flex; align-items: center; justify-content: center; font-size: 1.7rem; color: var(--brass);">
                  🔬
                </div>
                <span class="panel-badge badge-amber" style="font-size: 0.65rem;">DATA RICH</span>
              </div>
              <h3 class="font-display" style="font-size: 1.4rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 8px;">
                Marine Researcher
              </h3>
              <p class="font-body text-muted" style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">
                Explore marine data, evidence and research insights with AI oceanographic analysis.
              </p>
            </div>
            <a href="#/research" class="btn-tactical text-brass" style="text-decoration: none; text-align: center; padding: 12px 18px; font-weight: 700; font-size: 0.88rem; display: block; border-color: var(--brass);" onclick="event.stopPropagation();">
              I'm a Researcher →
            </a>
          </div>

          <!-- CARD 3 — GOVERNMENT / AUTHORITY -->
          <div class="stakeholder-card bezel-panel" style="padding: 24px; background: rgba(18,27,34,0.85); border: 1px solid var(--chart-line); border-top: 4px solid var(--radar-red); border-radius: var(--radius); display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.25s ease;" onclick="window.location.hash='#/safety'">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(255,92,92,0.15); border: 1px solid var(--radar-red); display: flex; align-items: center; justify-content: center; font-size: 1.7rem; color: var(--radar-red);">
                  🛡️
                </div>
                <span class="panel-badge badge-red" style="font-size: 0.65rem;">COASTAL CONTROL</span>
              </div>
              <h3 class="font-display" style="font-size: 1.4rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 8px;">
                Government &amp; Authority
              </h3>
              <p class="font-body text-muted" style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">
                Monitor risks, alerts and coastal conditions for rapid situation awareness and safety directives.
              </p>
            </div>
            <a href="#/safety" class="btn-tactical btn-tactical-amber" style="text-decoration: none; text-align: center; padding: 12px 18px; font-weight: 700; font-size: 0.88rem; display: block;" onclick="event.stopPropagation();">
              I'm an Authority →
            </a>
          </div>

          <!-- CARD 4 — MARINE BUSINESS -->
          <div class="stakeholder-card bezel-panel" style="padding: 24px; background: rgba(18,27,34,0.85); border: 1px solid var(--chart-line); border-top: 4px solid var(--phosphor-amber); border-radius: var(--radius); display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.25s ease;" onclick="window.location.hash='#/route'">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(255,180,84,0.15); border: 1px solid var(--phosphor-amber); display: flex; align-items: center; justify-content: center; font-size: 1.7rem; color: var(--phosphor-amber);">
                  🚢
                </div>
                <span class="panel-badge badge-amber" style="font-size: 0.65rem;">OPERATIONS</span>
              </div>
              <h3 class="font-display" style="font-size: 1.4rem; font-weight: 700; color: var(--parchment-bright); margin-bottom: 8px;">
                Marine Business
              </h3>
              <p class="font-body text-muted" style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">
                Improve routes, operations and marine decisions using fuel-optimal Pareto intelligence.
              </p>
            </div>
            <a href="#/route" class="btn-tactical btn-tactical-amber" style="text-decoration: none; text-align: center; padding: 12px 18px; font-weight: 700; font-size: 0.88rem; display: block;" onclick="event.stopPropagation();">
              I'm a Marine Operator →
            </a>
          </div>

        </div>
      </div>

      <!-- Operational System Footer -->
      <div style="border-top: 1px solid var(--chart-line); padding-top: 20px; text-align: center; font-family: var(--font-data); font-size: 0.75rem; color: var(--muted);">
        ORCA REASONING CORE v2.4 • MULTI-AGENT ADAPTIVE PRESENTATION LAYER
      </div>

    </div>
  `;

  // Attach interactive hover sounds if sound engine available
  if (soundEngine) {
    container.querySelectorAll('.stakeholder-card').forEach(card => {
      card.addEventListener('mouseenter', () => soundEngine.playMechanicalClick());
      card.addEventListener('click', () => soundEngine.playTacticalChirp());
    });
  }
}
