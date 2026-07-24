'use strict';

/* ===========================================================
   ネコ CGイラスト調 SVG（10進化段階）
   子猫 → 成猫 → トラ → ライオン の4原型を土台に、
   拡大率・ヒゲ・しま模様・たてがみの有無で
   10段階すべての見た目を変化させる。
=========================================================== */

function catSvg(stage, uid) {
  const g = (id) => `${id}-${uid}`;

  const defs = `
    <defs>
      <linearGradient id="${g('fur')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffd9a0"/>
        <stop offset="50%" stop-color="#f0a85c"/>
        <stop offset="100%" stop-color="#c97b3d"/>
      </linearGradient>
      <linearGradient id="${g('belly')}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fffaf0"/>
        <stop offset="100%" stop-color="#ffe9c2"/>
      </linearGradient>
      <radialGradient id="${g('eyeGlow')}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#eaffd8"/>
        <stop offset="55%" stop-color="#9bd94a"/>
        <stop offset="100%" stop-color="#5e9c1f"/>
      </radialGradient>
      <linearGradient id="${g('mane')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f7cf6a"/>
        <stop offset="100%" stop-color="#c9861b"/>
      </linearGradient>
      <radialGradient id="${g('glow')}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff3b0" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#fff3b0" stop-opacity="0"/>
      </radialGradient>
    </defs>`;

  const ground = `<ellipse cx="150" cy="264" rx="72" ry="12" fill="rgba(20,10,10,0.15)"/>`;

  const eye = (cx, cy, r, closed, id) => closed
    ? `<path d="M${cx - r},${cy} Q${cx},${cy + r * 0.5} ${cx + r},${cy}" fill="none" stroke="#5a3a1a" stroke-width="2.4" stroke-linecap="round"/>`
    : `<g class="cg-eye" id="${id}">
        <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.05}" fill="#3a2410"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.74}" ry="${r * 0.82}" fill="url(#${g('eyeGlow')})"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.15}" ry="${r * 0.6}" fill="#1c1206"/>
        <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.32}" r="${r * 0.2}" fill="#fff" opacity="0.9"/>
      </g>`;

  const whiskers = (len) => `
    <g stroke="#fff" stroke-width="1.6" opacity="0.85" stroke-linecap="round">
      <path d="M112,168 L${112 - len},164"/><path d="M112,176 L${112 - len},178"/><path d="M112,184 L${112 - len},192"/>
      <path d="M188,168 L${188 + len},164"/><path d="M188,176 L${188 + len},178"/><path d="M188,184 L${188 + len},192"/>
    </g>`;

  const scaleWrap = (inner, scale, oy) =>
    `<g style="transform:scale(${scale});transform-origin:150px ${oy}px;transform-box:view-box;">${inner}</g>`;

  const ears = (tuftOn) => `
    <path d="M108,110 L92,64 L134,96 Z" fill="url(#${g('fur')})" stroke="#a15f2c" stroke-width="1.5"/>
    <path d="M192,110 L208,64 L166,96 Z" fill="url(#${g('fur')})" stroke="#a15f2c" stroke-width="1.5"/>
    <path d="M112,102 L102,76 L128,96 Z" fill="#ffe0c2" opacity="0.7"/>
    <path d="M188,102 L198,76 L172,96 Z" fill="#ffe0c2" opacity="0.7"/>
    ${tuftOn ? `<path d="M92,64 L86,48" stroke="#a15f2c" stroke-width="2.5" stroke-linecap="round"/><path d="M208,64 L214,48" stroke="#a15f2c" stroke-width="2.5" stroke-linecap="round"/>` : ''}`;

  // ---- テンプレート1：生まれたて子猫（ステージ1〜2） ----
  function newbornTemplate(eyesOpen) {
    return `
      ${ground}
      <circle class="cg-glow" cx="150" cy="190" r="70" fill="url(#${g('glow')})" opacity="0.4"/>
      <g class="cg-breathe" style="transform-origin:150px 210px">
        <ellipse cx="150" cy="216" rx="52" ry="38" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="228" rx="30" ry="18" fill="url(#${g('belly')})"/>
        <path d="M196,222 Q222,220 220,200" fill="none" stroke="url(#${g('fur')})" stroke-width="10" stroke-linecap="round"/>
        <circle cx="150" cy="176" r="38" fill="url(#${g('fur')})"/>
        <path d="M124,158 L114,132 L140,150 Z" fill="url(#${g('fur')})"/>
        <path d="M176,158 L186,132 L160,150 Z" fill="url(#${g('fur')})"/>
        ${eye(136, 176, 8, !eyesOpen, g('eyeL'))}
        ${eye(164, 176, 8, !eyesOpen, g('eyeR'))}
        <ellipse cx="150" cy="188" rx="4" ry="3" fill="#e88" opacity="0.8"/>
      </g>`;
  }

  // ---- テンプレート2：子猫〜成猫（ステージ3〜5） ----
  function kittenTemplate(whiskerLen, collarOn) {
    return `
      ${ground}
      <g class="cg-breathe" style="transform-origin:150px 200px">
        <path d="M198,224 Q234,222 230,192 Q246,220 214,238 Q192,244 186,226 Z" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="206" rx="60" ry="46" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="222" rx="36" ry="24" fill="url(#${g('belly')})"/>
        <ellipse cx="122" cy="250" rx="13" ry="8" fill="url(#${g('fur')})"/>
        <ellipse cx="178" cy="250" rx="13" ry="8" fill="url(#${g('fur')})"/>
        <circle cx="150" cy="146" r="46" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="164" rx="22" ry="14" fill="url(#${g('belly')})"/>
        ${ears(false)}
        ${eye(130, 144, 11, false, g('eyeL'))}
        ${eye(170, 144, 11, false, g('eyeR'))}
        <path d="M144,160 Q150,166 156,160" fill="none" stroke="#5a3a1a" stroke-width="2" stroke-linecap="round"/>
        ${whiskerLen > 0 ? whiskers(whiskerLen) : ''}
        ${collarOn ? `<path d="M120,178 Q150,192 180,178" fill="none" stroke="#e0524f" stroke-width="6" stroke-linecap="round"/><circle cx="150" cy="190" r="5" fill="#ffd54f"/>` : ''}
      </g>`;
  }

  // ---- テンプレート3：山猫〜トラ（ステージ6〜8） ----
  function tigerTemplate(stripeLevel) {
    const stripes = stripeLevel > 0 ? `
      <g stroke="#5a3212" stroke-width="4" stroke-linecap="round" opacity="${stripeLevel === 2 ? 1 : 0.6}">
        <path d="M110,150 Q120,140 116,124"/>
        <path d="M190,150 Q180,140 184,124"/>
        <path d="M105,190 Q118,182 112,168"/>
        <path d="M195,190 Q182,182 188,168"/>
        ${stripeLevel === 2 ? '<path d="M150,96 L150,116"/><path d="M132,224 Q150,232 168,224"/>' : ''}
      </g>` : '';
    return `
      ${ground}
      <g class="cg-breathe" style="transform-origin:150px 196px">
        <path d="M202,222 Q244,218 238,182 Q258,216 220,238 Q196,246 188,224 Z" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="202" rx="66" ry="52" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="220" rx="40" ry="27" fill="url(#${g('belly')})"/>
        <ellipse cx="118" cy="250" rx="15" ry="9" fill="url(#${g('fur')})"/>
        <ellipse cx="182" cy="250" rx="15" ry="9" fill="url(#${g('fur')})"/>
        <circle cx="150" cy="138" r="50" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="158" rx="24" ry="16" fill="url(#${g('belly')})"/>
        ${ears(stripeLevel === 2)}
        ${stripes}
        ${eye(126, 134, 12, false, g('eyeL'))}
        ${eye(174, 134, 12, false, g('eyeR'))}
        <path d="M140,152 Q150,158 160,152" fill="none" stroke="#5a3a1a" stroke-width="2.2" stroke-linecap="round"/>
        ${whiskers(18)}
      </g>`;
  }

  // ---- テンプレート4：ライオン（ステージ9〜10） ----
  function lionTemplate(maneScale, crownOn) {
    return `
      ${ground}
      <circle class="cg-glow" cx="150" cy="150" r="105" fill="url(#${g('glow')})" opacity="0.4"/>
      <g class="cg-breathe" style="transform-origin:150px 190px">
        <path d="M204,220 Q248,214 244,176 Q266,212 224,236 Q198,246 190,222 Z" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="200" rx="68" ry="54" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="220" rx="42" ry="28" fill="url(#${g('belly')})"/>
        <ellipse cx="116" cy="250" rx="16" ry="10" fill="url(#${g('fur')})"/>
        <ellipse cx="184" cy="250" rx="16" ry="10" fill="url(#${g('fur')})"/>
        <g style="transform:scale(${maneScale});transform-origin:150px 130px;">
          ${Array.from({ length: 16 }).map((_, i) => {
            const a = (Math.PI * 2 * i) / 16;
            const x1 = 150 + Math.cos(a) * 46, y1 = 130 + Math.sin(a) * 46;
            const x2 = 150 + Math.cos(a) * 74, y2 = 130 + Math.sin(a) * 74;
            return `<path d="M${x1},${y1} L${x2},${y2}" stroke="url(#${g('mane')})" stroke-width="14" stroke-linecap="round"/>`;
          }).join('')}
        </g>
        <circle cx="150" cy="130" r="44" fill="url(#${g('fur')})"/>
        <ellipse cx="150" cy="148" rx="22" ry="15" fill="url(#${g('belly')})"/>
        ${eye(128, 126, 12, false, g('eyeL'))}
        ${eye(172, 126, 12, false, g('eyeR'))}
        <path d="M138,144 Q150,150 162,144" fill="none" stroke="#5a3a1a" stroke-width="2.2" stroke-linecap="round"/>
        ${whiskers(20)}
        ${crownOn ? `<polygon points="150,74 158,92 142,92" fill="url(#${g('mane')})"/>` : ''}
      </g>`;
  }

  let body;
  if (stage <= 2) {
    body = newbornTemplate(stage === 2);
  } else if (stage <= 5) {
    const idx = stage - 3;
    body = scaleWrap(kittenTemplate([0, 10, 16][idx], idx === 2), [0.8, 0.9, 1][idx], 220);
  } else if (stage <= 8) {
    const idx = stage - 6;
    body = scaleWrap(tigerTemplate(idx), [0.86, 0.94, 1.02][idx], 214);
  } else {
    body = scaleWrap(lionTemplate(stage === 9 ? 0.55 : 1, stage === 10), stage === 9 ? 0.92 : 1.05, 208);
  }

  return `<svg class="creature-svg cat-stage-${stage}" viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ネコ 進化段階${stage}">${defs}${body}</svg>`;
}

const CAT_STAGE_LABELS = ['子猫(誕生)', '子猫', 'わんぱく子猫', '若猫', '成猫', '山猫', '若トラ', 'トラ', '若ライオン', '百獣の王'];
