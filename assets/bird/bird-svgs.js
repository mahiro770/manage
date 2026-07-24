'use strict';

/* ===========================================================
   ひよこ CGイラスト調 SVG（10進化段階）
   卵 → ひよこ → タカ → フクロウ の4原型を土台に、
   拡大率・羽毛・翼の大きさで10段階すべての見た目を変化させる。
=========================================================== */

function birdSvg(stage, uid) {
  const g = (id) => `${id}-${uid}`;

  const defs = `
    <defs>
      <radialGradient id="${g('eggGrad')}" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="55%" stop-color="#f2ead2"/>
        <stop offset="100%" stop-color="#d8c79a"/>
      </radialGradient>
      <linearGradient id="${g('down')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff6b8"/>
        <stop offset="50%" stop-color="#ffdd57"/>
        <stop offset="100%" stop-color="#f0b429"/>
      </linearGradient>
      <linearGradient id="${g('belly')}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fffdf2"/>
        <stop offset="100%" stop-color="#fff2c2"/>
      </linearGradient>
      <linearGradient id="${g('feather')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c9a06a"/>
        <stop offset="50%" stop-color="#8f6435"/>
        <stop offset="100%" stop-color="#5c3f1f"/>
      </linearGradient>
      <linearGradient id="${g('owl')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f2d9a3"/>
        <stop offset="50%" stop-color="#d9a95c"/>
        <stop offset="100%" stop-color="#8a5a2c"/>
      </linearGradient>
      <linearGradient id="${g('phoenix')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff6d6"/>
        <stop offset="35%" stop-color="#ffce54"/>
        <stop offset="70%" stop-color="#ff7a3d"/>
        <stop offset="100%" stop-color="#e6402a"/>
      </linearGradient>
      <linearGradient id="${g('plume')}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fffbe6"/>
        <stop offset="45%" stop-color="#ffb347"/>
        <stop offset="100%" stop-color="#e6402a"/>
      </linearGradient>
      <radialGradient id="${g('eyeGlow')}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fffbe6"/>
        <stop offset="60%" stop-color="#ffcf5c"/>
        <stop offset="100%" stop-color="#c9860f"/>
      </radialGradient>
      <radialGradient id="${g('glow')}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff3b0" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#fff3b0" stop-opacity="0"/>
      </radialGradient>
      <filter id="${g('soft')}" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4"/>
      </filter>
    </defs>`;

  const ground = `<ellipse cx="150" cy="264" rx="74" ry="12" fill="rgba(20,10,10,0.15)"/>`;

  const eye = (cx, cy, r, id, big) => `
    <g class="cg-eye" id="${id}">
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * (big ? 1.15 : 1.05)}" fill="#2a1a06"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.74}" ry="${r * 0.82}" fill="url(#${g('eyeGlow')})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.18}" ry="${r * 0.6}" fill="#1c1206"/>
      <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.32}" r="${r * 0.2}" fill="#fff" opacity="0.9"/>
    </g>`;

  const scaleWrap = (inner, scale, oy) =>
    `<g style="transform:scale(${scale});transform-origin:150px ${oy}px;transform-box:view-box;">${inner}</g>`;

  // ---- テンプレート1：卵（ステージ1〜2） ----
  function eggTemplate(hatching) {
    return `
      ${ground}
      <path d="M64,254 Q94,232 150,236 Q206,232 236,254 Q206,266 150,268 Q94,266 64,254 Z" fill="none" stroke="#9a6a3c" stroke-width="7" stroke-linecap="round" opacity="0.85"/>
      <circle class="cg-glow" cx="150" cy="160" r="${hatching ? 100 : 80}" fill="url(#${g('glow')})" opacity="${hatching ? 0.6 : 0.35}"/>
      <g class="cg-breathe" style="transform-origin:150px 170px">
        <path d="M150,72 C190,72 214,120 214,170 C214,218 186,248 150,248 C114,248 86,218 86,170 C86,120 110,72 150,72 Z"
              fill="url(#${g('eggGrad')})" stroke="#c9b98a" stroke-width="2"/>
        <circle cx="126" cy="130" r="4" fill="#c9b98a" opacity="0.5"/>
        <circle cx="168" cy="150" r="3" fill="#c9b98a" opacity="0.5"/>
        <circle cx="140" cy="190" r="3.5" fill="#c9b98a" opacity="0.5"/>
        <path class="cg-crack" d="M150,96 L160,124 L144,140 L162,160 L150,${hatching ? 190 : 176}"
              fill="none" stroke="#ffe27a" stroke-width="3" stroke-linecap="round" filter="url(#${g('soft')})"/>
        ${hatching ? `<path class="cg-crack" d="M150,190 L170,200 M144,140 L120,150" fill="none" stroke="#ffe27a" stroke-width="2.6" stroke-linecap="round" filter="url(#${g('soft')})"/>` : ''}
      </g>`;
  }

  // ---- テンプレート2：ひな〜ひよこ（ステージ3〜5） ----
  function chickTemplate(fluffLevel, wingOn) {
    return `
      ${ground}
      <g class="cg-breathe" style="transform-origin:150px 206px">
        <ellipse cx="150" cy="214" rx="54" ry="46" fill="url(#${g('down')})"/>
        <ellipse cx="150" cy="228" rx="30" ry="20" fill="url(#${g('belly')})"/>
        <circle cx="150" cy="150" r="40" fill="url(#${g('down')})"/>
        <ellipse cx="150" cy="164" rx="20" ry="13" fill="url(#${g('belly')})"/>
        ${fluffLevel >= 1 ? `<path d="M136,116 Q140,102 146,116" fill="none" stroke="#f0b429" stroke-width="3" stroke-linecap="round"/><path d="M154,114 Q160,98 166,114" fill="none" stroke="#f0b429" stroke-width="3" stroke-linecap="round"/>` : ''}
        <polygon points="140,158 160,158 150,172" fill="#ff9d3d" stroke="#d9711b" stroke-width="1"/>
        ${eye(132, 146, 11, g('eyeL'))}
        ${eye(168, 146, 11, g('eyeR'))}
        ${wingOn ? `
        <ellipse class="cg-wing-l" cx="112" cy="204" rx="18" ry="12" fill="url(#${g('feather')})" style="transform-origin:112px 204px"/>
        <ellipse class="cg-wing-r" cx="188" cy="204" rx="18" ry="12" fill="url(#${g('feather')})" style="transform-origin:188px 204px"/>` : ''}
        <ellipse cx="132" cy="252" rx="9" ry="5" fill="#ff9d3d"/>
        <ellipse cx="168" cy="252" rx="9" ry="5" fill="#ff9d3d"/>
      </g>`;
  }

  // ---- テンプレート3：若鳥〜タカ（ステージ6〜8） ----
  function hawkTemplate(wingScale, sharpEyeOn) {
    return `
      ${ground}
      <g class="cg-breathe" style="transform-origin:150px 196px">
        <g class="cg-wing-l" style="transform-origin:104px 190px;transform:scale(${wingScale});">
          <path d="M104,190 C60,180 36,196 18,168 C48,172 68,160 88,168 C82,182 92,196 104,206 Z" fill="url(#${g('feather')})" stroke="#4a3018" stroke-width="1.5"/>
        </g>
        <g class="cg-wing-r" style="transform-origin:196px 190px;transform:scale(${wingScale});">
          <path d="M196,190 C240,180 264,196 282,168 C252,172 232,160 212,168 C218,182 208,196 196,206 Z" fill="url(#${g('feather')})" stroke="#4a3018" stroke-width="1.5"/>
        </g>
        <path d="M186,232 Q210,238 214,220" fill="none" stroke="url(#${g('feather')})" stroke-width="10" stroke-linecap="round"/>
        <ellipse cx="150" cy="198" rx="56" ry="48" fill="url(#${g('feather')})"/>
        <ellipse cx="150" cy="214" rx="32" ry="24" fill="url(#${g('belly')})"/>
        <circle cx="150" cy="140" r="42" fill="url(#${g('feather')})"/>
        <ellipse cx="150" cy="156" rx="20" ry="14" fill="url(#${g('belly')})"/>
        ${sharpEyeOn ? `<path d="M124,120 L140,126" stroke="#3a2410" stroke-width="3" stroke-linecap="round"/><path d="M176,120 L160,126" stroke="#3a2410" stroke-width="3" stroke-linecap="round"/>` : ''}
        <polygon points="138,146 162,146 150,164" fill="#ffb347" stroke="#a15f2c" stroke-width="1"/>
        ${eye(130, 134, 12, g('eyeL'))}
        ${eye(170, 134, 12, g('eyeR'))}
        <ellipse cx="128" cy="246" rx="9" ry="6" fill="#ffb347"/>
        <ellipse cx="172" cy="246" rx="9" ry="6" fill="#ffb347"/>
      </g>`;
  }

  // ---- テンプレート4：ワシ〜鳳凰（ステージ9〜10） ----
  function phoenixTemplate(phoenixForm, glowOn) {
    const bodyGrad = phoenixForm ? g('phoenix') : g('owl');
    // 尾羽・翼を飾る炎のような羽根
    const plumeFeather = (x1, y1, x2, y2, x3, y3, w) =>
      `<path d="M${x1},${y1} Q${x2},${y2} ${x3},${y3}" fill="none" stroke="url(#${g('plume')})" stroke-width="${w}" stroke-linecap="round"/>`;
    return `
      ${ground}
      <circle class="cg-glow" cx="150" cy="150" r="${phoenixForm ? 130 : 105}" fill="url(#${g('glow')})" opacity="${glowOn ? 0.55 : 0.3}"/>
      ${phoenixForm ? `
      <g class="cg-sparkle" style="transform-origin:150px 50px"><circle cx="150" cy="46" r="4" fill="#fff3b0"/></g>
      <g class="cg-sparkle" style="transform-origin:96px 90px"><circle cx="96" cy="90" r="3" fill="#fff3b0"/></g>
      <g class="cg-sparkle" style="transform-origin:204px 90px"><circle cx="204" cy="90" r="3" fill="#fff3b0"/></g>` : ''}
      <g class="cg-breathe" style="transform-origin:150px 194px">
        ${phoenixForm ? `
        <g class="cg-flicker" style="transform-origin:150px 236px">
          ${plumeFeather(140, 232, 128, 200, 122, 168, 9)}
          ${plumeFeather(150, 236, 150, 198, 150, 160, 10)}
          ${plumeFeather(160, 232, 172, 200, 178, 168, 9)}
        </g>` : `<path d="M184,234 Q212,240 216,220" fill="none" stroke="url(#${bodyGrad})" stroke-width="11" stroke-linecap="round"/>`}
        <g class="cg-wing-l" style="transform-origin:100px 186px">
          <path d="M100,186 C50,178 22,198 2,164 C36,168 60,154 84,164 C76,180 88,196 100,208 Z" fill="url(#${bodyGrad})" stroke="#8a4318" stroke-width="2"/>
          ${phoenixForm ? plumeFeather(60, 176, 34, 156, 14, 132, 6) + plumeFeather(78, 182, 56, 168, 40, 146, 5) : ''}
        </g>
        <g class="cg-wing-r" style="transform-origin:200px 186px">
          <path d="M200,186 C250,178 278,198 298,164 C264,168 240,154 216,164 C224,180 212,196 200,208 Z" fill="url(#${bodyGrad})" stroke="#8a4318" stroke-width="2"/>
          ${phoenixForm ? plumeFeather(240, 176, 266, 156, 286, 132, 6) + plumeFeather(222, 182, 244, 168, 260, 146, 5) : ''}
        </g>
        <ellipse cx="150" cy="196" rx="60" ry="52" fill="url(#${bodyGrad})"/>
        <ellipse cx="150" cy="214" rx="34" ry="26" fill="url(#${g('belly')})"/>
        <circle cx="150" cy="134" r="46" fill="url(#${bodyGrad})"/>
        ${phoenixForm ? `
        <path d="M150,88 Q146,58 150,36" fill="none" stroke="url(#${g('plume')})" stroke-width="7" stroke-linecap="round"/>
        <path d="M134,94 Q122,68 116,48" fill="none" stroke="url(#${g('plume')})" stroke-width="5" stroke-linecap="round"/>
        <path d="M166,94 Q178,68 184,48" fill="none" stroke="url(#${g('plume')})" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="150" cy="150" rx="20" ry="14" fill="url(#${g('belly')})"/>` : `
        <path d="M118,98 L110,74 L134,94 Z" fill="url(#${bodyGrad})"/>
        <path d="M182,98 L190,74 L166,94 Z" fill="url(#${bodyGrad})"/>
        <ellipse cx="150" cy="150" rx="20" ry="14" fill="url(#${g('belly')})"/>`}
        ${eye(128, 130, phoenixForm ? 14 : 13, g('eyeL'), phoenixForm)}
        ${eye(172, 130, phoenixForm ? 14 : 13, g('eyeR'), phoenixForm)}
        <polygon points="138,144 162,144 150,162" fill="#ffb347" stroke="#a15f2c" stroke-width="1"/>
        <ellipse cx="128" cy="248" rx="10" ry="6" fill="#ffb347"/>
        <ellipse cx="172" cy="248" rx="10" ry="6" fill="#ffb347"/>
      </g>`;
  }

  let body;
  if (stage <= 2) {
    body = eggTemplate(stage === 2);
  } else if (stage <= 5) {
    const idx = stage - 3;
    body = scaleWrap(chickTemplate(idx, idx >= 1), [0.82, 0.9, 1][idx], 224);
  } else if (stage <= 8) {
    const idx = stage - 6;
    body = scaleWrap(hawkTemplate([0.6, 0.85, 1][idx], idx === 2), [0.86, 0.94, 1.02][idx], 214);
  } else {
    body = scaleWrap(phoenixTemplate(stage === 10, true), stage === 9 ? 0.94 : 1.08, 208);
  }

  return `<svg class="creature-svg bird-stage-${stage}" viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ひよこ 進化段階${stage}">${defs}${body}</svg>`;
}

const BIRD_STAGE_LABELS = ['卵', 'ひびわれた卵', 'ひな', 'ひよこ', '若鳥(羽ばたき)', '若鳥', 'タカの子', 'タカ', 'ワシ', '鳳凰'];
