'use strict';

/* ===========================================================
   しょくぶつ CGイラスト調 SVG（10進化段階）
   種 → 苗木 → 若木 → 満開の木 の4原型を土台に、
   拡大率・葉の数・花のつぼみ／開花で
   10段階すべての見た目を変化させる。
=========================================================== */

function plantSvg(stage, uid) {
  const g = (id) => `${id}-${uid}`;

  const defs = `
    <defs>
      <linearGradient id="${g('soil')}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#8a6238"/>
        <stop offset="100%" stop-color="#5c3f22"/>
      </linearGradient>
      <linearGradient id="${g('leaf')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#b6e26a"/>
        <stop offset="55%" stop-color="#6fbf3e"/>
        <stop offset="100%" stop-color="#3d8a26"/>
      </linearGradient>
      <linearGradient id="${g('trunk')}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#b98650"/>
        <stop offset="100%" stop-color="#7a5230"/>
      </linearGradient>
      <radialGradient id="${g('flower')}" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#fff5f8"/>
        <stop offset="60%" stop-color="#ffbfd6"/>
        <stop offset="100%" stop-color="#f47fa8"/>
      </radialGradient>
      <radialGradient id="${g('eyeGlow')}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#eaffd8"/>
        <stop offset="55%" stop-color="#9bd94a"/>
        <stop offset="100%" stop-color="#5e9c1f"/>
      </radialGradient>
      <radialGradient id="${g('glow')}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff3b0" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#fff3b0" stop-opacity="0"/>
      </radialGradient>
    </defs>`;

  const soil = `<ellipse cx="150" cy="256" rx="80" ry="16" fill="url(#${g('soil')})"/>
    <ellipse cx="150" cy="250" rx="80" ry="10" fill="#4a3018" opacity="0.5"/>`;

  const eye = (cx, cy, r, id) => `
    <g class="cg-eye" id="${id}">
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.05}" fill="#2a3a10"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.74}" ry="${r * 0.82}" fill="url(#${g('eyeGlow')})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.15}" ry="${r * 0.6}" fill="#1c2606"/>
      <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.32}" r="${r * 0.2}" fill="#fff" opacity="0.9"/>
    </g>`;

  const leaf = (cx, cy, rx, ry, rot) =>
    `<ellipse class="cg-sway" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${g('leaf')})" stroke="#2f6b1c" stroke-width="1.2" transform="rotate(${rot} ${cx} ${cy})"/>`;

  const flower = (cx, cy, r) => `
    <g class="cg-sparkle" style="transform-origin:${cx}px ${cy}px">
      ${Array.from({ length: 5 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 5;
        return `<ellipse cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" rx="${r * 0.62}" ry="${r * 0.44}" fill="url(#${g('flower')})" transform="rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r})"/>`;
      }).join('')}
      <circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="#ffe27a"/>
    </g>`;

  const scaleWrap = (inner, scale, oy) =>
    `<g style="transform:scale(${scale});transform-origin:150px ${oy}px;transform-box:view-box;">${inner}</g>`;

  // ---- テンプレート1：種（ステージ1〜2） ----
  function seedTemplate(sprouting) {
    return `
      ${soil}
      <circle class="cg-glow" cx="150" cy="240" r="${sprouting ? 60 : 40}" fill="url(#${g('glow')})" opacity="0.5"/>
      <g class="cg-breathe" style="transform-origin:150px 244px">
        <ellipse cx="150" cy="244" rx="16" ry="20" fill="url(#${g('trunk')})" stroke="#4a3018" stroke-width="1.5"/>
        <path d="M142,236 Q150,228 158,236" fill="none" stroke="#fff6e0" stroke-width="2" opacity="0.5"/>
        ${sprouting ? `
        <path d="M150,224 Q146,204 150,190" fill="none" stroke="#6fbf3e" stroke-width="5" stroke-linecap="round"/>
        ${leaf(140, 194, 12, 7, -25)}
        ${leaf(160, 194, 12, 7, 25)}` : ''}
      </g>`;
  }

  // ---- テンプレート2：双葉〜苗木（ステージ3〜5） ----
  function seedlingTemplate(leafCount, trunkOn) {
    return `
      ${soil}
      <g class="cg-breathe" style="transform-origin:150px 240px">
        ${trunkOn
          ? `<path d="M144,250 Q142,210 150,178" fill="none" stroke="url(#${g('trunk')})" stroke-width="10" stroke-linecap="round"/>`
          : `<path d="M148,250 Q146,220 150,196" fill="none" stroke="#6fbf3e" stroke-width="6" stroke-linecap="round"/>`}
        ${leaf(122, 196, 20, 12, -30)}
        ${leaf(178, 196, 20, 12, 30)}
        ${leafCount >= 4 ? leaf(112, 168, 17, 10, -10) : ''}
        ${leafCount >= 4 ? leaf(188, 168, 17, 10, 10) : ''}
        ${leafCount >= 6 ? leaf(150, 150, 20, 13, 0) : ''}
        ${trunkOn ? eye(150, 214, 8, g('faceEye')) : ''}
        ${trunkOn ? `<path d="M144,224 Q150,229 156,224" fill="none" stroke="#3d5a1a" stroke-width="1.8" stroke-linecap="round"/>` : ''}
      </g>`;
  }

  // ---- テンプレート3：若木（ステージ6〜8） ----
  function youngTreeTemplate(canopyLevel, budOn) {
    return `
      ${soil}
      <g class="cg-breathe" style="transform-origin:150px 230px">
        <path d="M138,254 Q134,200 150,160" fill="none" stroke="url(#${g('trunk')})" stroke-width="16" stroke-linecap="round"/>
        <path d="M150,190 Q170,182 180,166" fill="none" stroke="url(#${g('trunk')})" stroke-width="8" stroke-linecap="round"/>
        <path d="M148,206 Q126,198 116,182" fill="none" stroke="url(#${g('trunk')})" stroke-width="8" stroke-linecap="round"/>
        <circle cx="150" cy="140" r="${44 + canopyLevel * 6}" fill="url(#${g('leaf')})"/>
        <circle cx="110" cy="164" r="${26 + canopyLevel * 4}" fill="url(#${g('leaf')})"/>
        <circle cx="190" cy="164" r="${26 + canopyLevel * 4}" fill="url(#${g('leaf')})"/>
        ${budOn ? `
        <ellipse cx="122" cy="150" rx="8" ry="11" fill="url(#${g('flower')})" opacity="0.85"/>
        <ellipse cx="178" cy="150" rx="8" ry="11" fill="url(#${g('flower')})" opacity="0.85"/>
        <ellipse cx="150" cy="112" rx="8" ry="11" fill="url(#${g('flower')})" opacity="0.85"/>` : ''}
        ${eye(134, 138, 10, g('eyeL'))}
        ${eye(166, 138, 10, g('eyeR'))}
        <path d="M140,154 Q150,160 160,154" fill="none" stroke="#2f5a16" stroke-width="2" stroke-linecap="round"/>
      </g>`;
  }

  // ---- テンプレート4：満開（ステージ9〜10） ----
  function bloomTemplate(flowerCount, radiant) {
    return `
      ${soil}
      <circle class="cg-glow" cx="150" cy="140" r="${radiant ? 120 : 90}" fill="url(#${g('glow')})" opacity="${radiant ? 0.55 : 0.35}"/>
      <g class="cg-breathe" style="transform-origin:150px 224px">
        <path d="M136,254 Q130,196 150,152" fill="none" stroke="url(#${g('trunk')})" stroke-width="18" stroke-linecap="round"/>
        <path d="M150,182 Q174,172 186,152" fill="none" stroke="url(#${g('trunk')})" stroke-width="9" stroke-linecap="round"/>
        <path d="M146,196 Q120,186 108,166" fill="none" stroke="url(#${g('trunk')})" stroke-width="9" stroke-linecap="round"/>
        <circle cx="150" cy="128" r="52" fill="url(#${g('leaf')})"/>
        <circle cx="102" cy="156" r="32" fill="url(#${g('leaf')})"/>
        <circle cx="198" cy="156" r="32" fill="url(#${g('leaf')})"/>
        ${flower(150, 96, 14)}
        ${flower(96, 140, 12)}
        ${flower(204, 140, 12)}
        ${flowerCount > 3 ? flower(150, 150, 13) : ''}
        ${flowerCount > 3 ? flower(122, 176, 10) : ''}
        ${flowerCount > 3 ? flower(178, 176, 10) : ''}
        ${eye(134, 126, 10, g('eyeL'))}
        ${eye(166, 126, 10, g('eyeR'))}
        <path d="M140,142 Q150,148 160,142" fill="none" stroke="#2f5a16" stroke-width="2" stroke-linecap="round"/>
      </g>`;
  }

  let body;
  if (stage <= 2) {
    body = seedTemplate(stage === 2);
  } else if (stage <= 5) {
    const idx = stage - 3;
    body = scaleWrap(seedlingTemplate([2, 4, 6][idx], idx === 2), [0.8, 0.9, 1][idx], 244);
  } else if (stage <= 8) {
    const idx = stage - 6;
    body = scaleWrap(youngTreeTemplate(idx, idx === 2), [0.86, 0.94, 1.02][idx], 240);
  } else {
    body = scaleWrap(bloomTemplate(stage === 10 ? 6 : 3, stage === 10), stage === 9 ? 0.94 : 1.05, 234);
  }

  return `<svg class="creature-svg plant-stage-${stage}" viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="しょくぶつ 進化段階${stage}">${defs}${body}</svg>`;
}

const PLANT_STAGE_LABELS = ['種', '発芽', '双葉', '若葉', '苗木', '若木', '青葉の木', 'つぼみの木', '花咲く木', '満開'];
