// ORCA Marine Bridge Console — Signature Component: Analog Risk Gauge
// Precision SVG dial with brass bezel, graduated arc, danger sectors & rotating needle

export function createRiskGaugeHTML({
  id = `gauge-${Math.random().toString(36).substr(2, 9)}`,
  score = 0, // 0 to 100
  title = "RISK INDEX",
  size = 180,
  showTitle = true,
  showReadout = true
} = {}) {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  
  // Needle angle: 0 maps to -135deg (bottom-left), 100 maps to +135deg (bottom-right)
  const needleAngle = -135 + (clampedScore / 100) * 270;
  
  // Determine severity category and color
  let category = "OPTIMAL";
  let statusColor = "var(--phosphor-green)";
  let badgeClass = "badge-green";
  
  if (clampedScore > 70) {
    category = "CRITICAL HAZARD";
    statusColor = "var(--radar-red)";
    badgeClass = "badge-red";
  } else if (clampedScore > 35) {
    category = "ADVISORY / ELEVATED";
    statusColor = "var(--phosphor-amber)";
    badgeClass = "badge-amber";
  }

  // Generate tick marks (Major ticks every 20, minor ticks every 5)
  let ticksSVG = "";
  for (let i = 0; i <= 100; i += 5) {
    const isMajor = i % 20 === 0;
    const tickAngle = -135 + (i / 100) * 270;
    const rad = (tickAngle - 90) * (Math.PI / 180);
    
    const rOuter = 82;
    const rInner = isMajor ? 68 : 74;
    
    const x1 = 100 + rOuter * Math.cos(rad);
    const y1 = 100 + rOuter * Math.sin(rad);
    const x2 = 100 + rInner * Math.cos(rad);
    const y2 = 100 + rInner * Math.sin(rad);
    
    const strokeColor = i <= 35 ? "#6BCB77" : (i <= 70 ? "#FFB454" : "#FF5C5C");
    const strokeWidth = isMajor ? 2.2 : 1.0;
    
    ticksSVG += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${strokeWidth}" opacity="${isMajor ? 0.9 : 0.5}"/>`;
    
    if (isMajor) {
      const rText = 58;
      const xt = 100 + rText * Math.cos(rad);
      const yt = 100 + rText * Math.sin(rad) + 3;
      ticksSVG += `<text x="${xt.toFixed(1)}" y="${yt.toFixed(1)}" font-family="var(--font-data)" font-size="7" font-weight="600" fill="#7C8B93" text-anchor="middle">${i}</text>`;
    }
  }

  return `
    <div class="risk-gauge-container" id="${id}" data-score="${clampedScore}" style="max-width: ${size}px;">
      ${showTitle ? `<div class="panel-badge ${badgeClass}" style="margin-bottom: 4px;">${title}</div>` : ''}
      
      <svg class="risk-gauge-svg" viewBox="0 0 200 200" width="${size}" height="${size}">
        <defs>
          <!-- Outer Brass Ring Gradient -->
          <linearGradient id="brassGrad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E6C894" />
            <stop offset="50%" stop-color="#8C6F3D" />
            <stop offset="100%" stop-color="#C9A66B" />
          </linearGradient>
          
          <!-- Inner Dial Shadow Gradient -->
          <radialGradient id="dialFaceGrad-${id}" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stop-color="#0E171D" />
            <stop offset="95%" stop-color="#080D11" />
            <stop offset="100%" stop-color="#040608" />
          </radialGradient>

          <!-- Needle Gradient -->
          <linearGradient id="needleGrad-${id}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFE094" />
            <stop offset="100%" stop-color="#FF5C5C" />
          </linearGradient>
        </defs>

        <!-- Outer Brass Bezel Frame -->
        <circle cx="100" cy="100" r="96" fill="none" stroke="url(#brassGrad-${id})" stroke-width="4" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"/>
        <circle cx="100" cy="100" r="92" fill="none" stroke="#24333B" stroke-width="1"/>
        
        <!-- Dial Face Background -->
        <circle cx="100" cy="100" r="90" fill="url(#dialFaceGrad-${id})"/>

        <!-- Color Sector Arcs (Green, Amber, Red) -->
        <!-- Green Safe Arc: -135deg to -40.5deg -->
        <path d="M 40.8 159.2 A 84 84 0 0 1 73.6 20.3" fill="none" stroke="#6BCB77" stroke-width="3" stroke-dasharray="2,2" opacity="0.8"/>
        <!-- Amber Moderate Arc: -40.5deg to +54deg -->
        <path d="M 73.6 20.3 A 84 84 0 0 1 168.0 49.5" fill="none" stroke="#FFB454" stroke-width="3" stroke-dasharray="2,2" opacity="0.8"/>
        <!-- Red Danger Arc: +54deg to +135deg -->
        <path d="M 168.0 49.5 A 84 84 0 0 1 159.2 159.2" fill="none" stroke="#FF5C5C" stroke-width="4" opacity="0.9"/>

        <!-- Graduated Ticks & Numbers -->
        <g class="gauge-ticks">
          ${ticksSVG}
        </g>

        <!-- Center Label Engraving -->
        <text x="100" y="130" font-family="var(--font-data)" font-size="8" font-weight="700" fill="#7C8B93" text-anchor="middle" letter-spacing="1">ORCA MARITIME</text>
        <text x="100" y="142" font-family="var(--font-data)" font-size="6" fill="#C9A66B" text-anchor="middle" letter-spacing="0.5">SCALE 0 - 100</text>

        <!-- Rotating Analog Needle -->
        <g class="risk-gauge-needle" id="needle-${id}" style="transform: rotate(${needleAngle}deg);">
          <!-- Needle Body (Tapered) -->
          <polygon points="98,100 100,24 102,100 100,116" fill="url(#brassGrad-${id})" />
          <line x1="100" y1="24" x2="100" y2="40" stroke="#FF5C5C" stroke-width="2.5" stroke-linecap="round" />
          <!-- Needle Counterweight -->
          <circle cx="100" cy="110" r="5" fill="#8C6F3D" />
        </g>

        <!-- Center Brass Hub / Pivot Cap -->
        <circle cx="100" cy="100" r="10" fill="url(#brassGrad-${id})" stroke="#0A1014" stroke-width="1.5"/>
        <circle cx="100" cy="100" r="4" fill="#0A1014"/>
      </svg>

      ${showReadout ? `
        <div class="risk-gauge-readout">
          <span class="risk-gauge-value" id="val-${id}" style="color: ${statusColor};">${clampedScore}</span>
          <span class="risk-gauge-category text-muted" id="cat-${id}">${category}</span>
        </div>
      ` : ''}
    </div>
  `;
}

// Dynamic update function to smoothly animate needle to new score
export function updateRiskGauge(gaugeContainerEl, newScore) {
  if (!gaugeContainerEl) return;
  const clampedScore = Math.max(0, Math.min(100, Math.round(newScore)));
  const needleAngle = -135 + (clampedScore / 100) * 270;
  
  const needleEl = gaugeContainerEl.querySelector('.risk-gauge-needle');
  const valEl = gaugeContainerEl.querySelector('.risk-gauge-value');
  const catEl = gaugeContainerEl.querySelector('.risk-gauge-category');
  
  if (needleEl) {
    needleEl.style.transform = `rotate(${needleAngle}deg)`;
  }
  
  let category = "OPTIMAL";
  let statusColor = "var(--phosphor-green)";
  
  if (clampedScore > 70) {
    category = "CRITICAL HAZARD";
    statusColor = "var(--radar-red)";
  } else if (clampedScore > 35) {
    category = "ADVISORY / ELEVATED";
    statusColor = "var(--phosphor-amber)";
  }
  
  if (valEl) {
    valEl.textContent = clampedScore;
    valEl.style.color = statusColor;
  }
  if (catEl) {
    catEl.textContent = category;
  }
  gaugeContainerEl.setAttribute('data-score', clampedScore);
}
