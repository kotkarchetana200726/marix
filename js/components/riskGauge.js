// ORCA Marine Bridge Console — Signature Component: Visual Risk Gauge
// Semi-circular SVG Gauge & Gradient Risk Indicator (CSS/SVG only - No Chart Library)

export function createRiskGaugeHTML({
  id = `gauge-${Math.random().toString(36).substr(2, 9)}`,
  score = 0, // 0 to 100
  title = "RISK INDEX",
  size = 180,
  showTitle = true,
  showReadout = true
} = {}) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  
  // Semi-circular gauge needle angle:
  // 0 -> -90 deg (left), 50 -> 0 deg (top), 100 -> +90 deg (right)
  const needleAngle = -90 + (clampedScore / 100) * 180;
  
  let category = "LOW";
  let statusColor = "var(--phosphor-green)";
  let badgeClass = "badge-green";
  
  if (clampedScore >= 75) {
    category = "EXTREME";
    statusColor = "var(--radar-red)";
    badgeClass = "badge-red";
  } else if (clampedScore >= 50) {
    category = "HIGH";
    statusColor = "var(--radar-red)";
    badgeClass = "badge-red";
  } else if (clampedScore >= 30) {
    category = "MODERATE";
    statusColor = "var(--phosphor-amber)";
    badgeClass = "badge-amber";
  }

  // Ticks generation for semi-circle arc (0 to 100)
  let ticksSVG = "";
  for (let i = 0; i <= 100; i += 10) {
    const isMajor = i % 20 === 0;
    const angle = -90 + (i / 100) * 180;
    const rad = angle * (Math.PI / 180);
    
    const rOuter = 78;
    const rInner = isMajor ? 66 : 72;
    
    const x1 = 100 + rOuter * Math.sin(rad);
    const y1 = 100 - rOuter * Math.cos(rad);
    const x2 = 100 + rInner * Math.sin(rad);
    const y2 = 100 - rInner * Math.cos(rad);
    
    const strokeColor = i < 30 ? "#6BCB77" : (i < 60 ? "#FFB454" : "#FF5C5C");
    ticksSVG += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${isMajor ? 2.2 : 1.2}" opacity="${isMajor ? 0.9 : 0.5}"/>`;
    
    if (isMajor) {
      const rText = 54;
      const xt = 100 + rText * Math.sin(rad);
      const yt = 100 - rText * Math.cos(rad) + 3;
      ticksSVG += `<text x="${xt.toFixed(1)}" y="${yt.toFixed(1)}" font-family="var(--font-data)" font-size="7.5" font-weight="700" fill="#7C8B93" text-anchor="middle">${i}</text>`;
    }
  }

  return `
    <div class="risk-gauge-container" id="${id}" data-score="${clampedScore}" style="max-width: ${size}px; width:100%; display:flex; flex-direction:column; align-items:center;">
      ${showTitle ? `<div class="panel-badge ${badgeClass}" style="margin-bottom: 6px; font-size:0.68rem;">${title}</div>` : ''}
      
      <div style="position:relative; width:${size}px; height:${Math.round(size * 0.65)}px; overflow:hidden;">
        <svg viewBox="0 0 200 120" width="100%" height="100%" style="display:block;">
          <defs>
            <linearGradient id="gaugeBgGrad-${id}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#6BCB77" />
              <stop offset="35%" stop-color="#FFB454" />
              <stop offset="70%" stop-color="#FF5C5C" />
              <stop offset="100%" stop-color="#D92626" />
            </linearGradient>
            <filter id="glow-${id}">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Outer Brass Frame Arc -->
          <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="var(--chart-line)" stroke-width="12" stroke-linecap="round"/>
          <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="url(#gaugeBgGrad-${id})" stroke-width="8" stroke-linecap="round" opacity="0.88"/>

          <!-- Graduated Ticks -->
          <g class="gauge-ticks">
            ${ticksSVG}
          </g>

          <!-- Center Score Readout -->
          <text x="100" y="86" font-family="var(--font-data)" font-size="22" font-weight="800" fill="${statusColor}" text-anchor="middle" filter="url(#glow-${id})">${clampedScore}</text>
          <text x="100" y="98" font-family="var(--font-data)" font-size="7.5" font-weight="700" fill="#7C8B93" text-anchor="middle" letter-spacing="0.5">/ 100 HAZARD</text>

          <!-- Rotating Needle -->
          <g class="risk-gauge-needle" id="needle-${id}" style="transform-origin: 100px 100px; transform: rotate(${needleAngle}deg); transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);">
            <polygon points="97.5,100 100,22 102.5,100 100,108" fill="${statusColor}" />
            <circle cx="100" cy="100" r="7" fill="var(--bg-panel)" stroke="${statusColor}" stroke-width="2.5"/>
            <circle cx="100" cy="100" r="3" fill="${statusColor}"/>
          </g>
        </svg>
      </div>

      ${showReadout ? `
        <div class="risk-gauge-readout" style="text-align:center; margin-top:2px;">
          <span class="risk-gauge-category" id="cat-${id}" style="font-family:var(--font-data); font-weight:700; font-size:0.75rem; color:${statusColor}; letter-spacing:0.08em;">${category} RISK</span>
        </div>
      ` : ''}
    </div>
  `;
}

export function updateRiskGauge(gaugeContainerEl, newScore) {
  if (!gaugeContainerEl) return;
  const clampedScore = Math.max(0, Math.min(100, Math.round(newScore)));
  const needleAngle = -90 + (clampedScore / 100) * 180;
  
  const needleEl = gaugeContainerEl.querySelector('.risk-gauge-needle');
  const catEl = gaugeContainerEl.querySelector('.risk-gauge-category');
  
  if (needleEl) {
    needleEl.style.transform = `rotate(${needleAngle}deg)`;
  }
  
  let category = "LOW";
  let statusColor = "var(--phosphor-green)";
  
  if (clampedScore >= 75) {
    category = "EXTREME";
    statusColor = "var(--radar-red)";
  } else if (clampedScore >= 50) {
    category = "HIGH";
    statusColor = "var(--radar-red)";
  } else if (clampedScore >= 30) {
    category = "MODERATE";
    statusColor = "var(--phosphor-amber)";
  }
  
  if (catEl) {
    catEl.textContent = `${category} RISK`;
    catEl.style.color = statusColor;
  }
  gaugeContainerEl.setAttribute('data-score', clampedScore);
}
