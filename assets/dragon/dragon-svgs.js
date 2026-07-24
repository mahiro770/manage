'use strict';

/* ===========================================================
   ドラゴン CGイラスト調 SVG（4進化段階）
   グラデーション + 陰影レイヤーで立体感を出し、
   breathing / blink / wing-flap / evolve-burst の
   アニメーションが当たるようパーツをグループ化している。
=========================================================== */

function dragonSvg(stage, uid) {
  const g = (id) => `${id}-${uid}`;

  const defs = `
    <defs>
      <linearGradient id="${g('scaleBody')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff9d6c"/>
        <stop offset="45%" stop-color="#e8583a"/>
        <stop offset="100%" stop-color="#a11f2a"/>
      </linearGradient>
      <linearGradient id="${g('scaleBelly')}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffe9c2"/>
        <stop offset="100%" stop-color="#ffc774"/>
      </linearGradient>
      <linearGradient id="${g('wingMembrane')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffcf94" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#c8481f" stop-opacity="0.9"/>
      </linearGradient>
      <radialGradient id="${g('eggGrad')}" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#fff6e0"/>
        <stop offset="55%" stop-color="#ffd98a"/>
        <stop offset="100%" stop-color="#e08a3c"/>
      </radialGradient>
      <radialGradient id="${g('glow')}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff3b0" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#fff3b0" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${g('eyeGlow')}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fffbe6"/>
        <stop offset="60%" stop-color="#ffe27a"/>
        <stop offset="100%" stop-color="#d68c1e"/>
      </radialGradient>
      <linearGradient id="${g('hornGrad')}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fff2d6"/>
        <stop offset="100%" stop-color="#d8a45c"/>
      </linearGradient>
      <filter id="${g('soft')}" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4"/>
      </filter>
    </defs>`;

  const ground = `<ellipse class="dr-ground" cx="150" cy="266" rx="78" ry="13" fill="rgba(20,10,10,0.18)"/>`;

  const eye = (cx, cy, r, id) => `
    <g class="dr-eye" id="${id}">
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.05}" fill="#2a120a"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.72}" ry="${r * 0.8}" fill="url(#${g('eyeGlow')})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.16}" ry="${r * 0.62}" fill="#2a120a"/>
      <circle cx="${cx - r * 0.32}" cy="${cy - r * 0.35}" r="${r * 0.22}" fill="#fff" opacity="0.9"/>
    </g>`;

  let body = '';

  if (stage === 1) {
    // 卵：巣の中で光る卵、ひびから淡い光
    body = `
      ${ground}
      <path class="dr-nest" d="M60,255 Q90,232 150,236 Q210,232 240,255 Q210,268 150,270 Q90,268 60,255 Z" fill="none" stroke="#9a6a3c" stroke-width="7" stroke-linecap="round" opacity="0.85"/>
      <path class="dr-nest" d="M75,248 Q120,262 150,262 Q180,262 225,248" fill="none" stroke="#8b5e34" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
      <circle class="dr-glow-pulse" cx="150" cy="150" r="95" fill="url(#${g('glow')})"/>
      <g class="dr-body-breathe" style="transform-origin:150px 165px">
        <path d="M150,58 C196,58 222,112 222,168 C222,222 190,254 150,254 C110,254 78,222 78,168 C78,112 104,58 150,58 Z"
              fill="url(#${g('eggGrad')})" stroke="#c97324" stroke-width="2"/>
        <ellipse cx="118" cy="108" rx="20" ry="30" fill="#fff" opacity="0.35"/>
        <ellipse cx="128" cy="150" rx="6" ry="9" fill="#c97324" opacity="0.35" transform="rotate(20 128 150)"/>
        <ellipse cx="172" cy="120" rx="5" ry="8" fill="#c97324" opacity="0.3" transform="rotate(-15 172 120)"/>
        <ellipse cx="160" cy="195" rx="7" ry="10" fill="#c97324" opacity="0.3" transform="rotate(10 160 195)"/>
        <path class="dr-crack" d="M150,80 L162,110 L146,128 L166,150 L150,175" fill="none" stroke="#fff3b0" stroke-width="3.5" stroke-linecap="round" filter="url(#${g('soft')})"/>
      </g>
      <g class="dr-steam">
        <circle cx="126" cy="70" r="4" fill="#fff3b0" opacity="0.7"/>
        <circle cx="150" cy="55" r="5" fill="#fff3b0" opacity="0.6"/>
        <circle cx="176" cy="72" r="4" fill="#fff3b0" opacity="0.7"/>
      </g>`;
  } else if (stage === 2) {
    // 幼竜：大きな頭と目、小さな翼、丸みのある体
    body = `
      ${ground}
      <g class="dr-body-breathe" style="transform-origin:150px 190px">
        <path class="dr-tail" d="M182,220 Q220,222 226,196 Q230,214 210,230 Q196,236 182,224 Z" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="128" cy="242" rx="14" ry="9" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="172" cy="242" rx="14" ry="9" fill="url(#${g('scaleBody')})"/>
        <g class="dr-wing dr-wing-l" id="${g('wingL')}" style="transform-origin:118px 175px">
          <path d="M118,175 C90,160 72,168 62,150 C82,158 96,150 110,158 C104,172 110,182 118,190 Z" fill="url(#${g('wingMembrane')})" stroke="#9c3720" stroke-width="1.5"/>
        </g>
        <g class="dr-wing dr-wing-r" id="${g('wingR')}" style="transform-origin:182px 175px">
          <path d="M182,175 C210,160 228,168 238,150 C218,158 204,150 190,158 C196,172 190,182 182,190 Z" fill="url(#${g('wingMembrane')})" stroke="#9c3720" stroke-width="1.5"/>
        </g>
        <ellipse cx="150" cy="195" rx="58" ry="52" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="150" cy="212" rx="34" ry="26" fill="url(#${g('scaleBelly')})"/>
        <circle cx="150" cy="128" r="50" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="150" cy="146" rx="24" ry="16" fill="url(#${g('scaleBelly')})"/>
        <path d="M136,90 L142,72 L150,92 Z" fill="url(#${g('hornGrad')})"/>
        <path d="M164,90 L158,72 L150,92 Z" fill="url(#${g('hornGrad')})"/>
        ${eye(126, 122, 15, g('eyeL'))}
        ${eye(174, 122, 15, g('eyeR'))}
        <ellipse cx="112" cy="142" rx="10" ry="6" fill="#ff8f6b" opacity="0.55"/>
        <ellipse cx="188" cy="142" rx="10" ry="6" fill="#ff8f6b" opacity="0.55"/>
        <path d="M136,152 Q150,160 164,152" fill="none" stroke="#7a1f12" stroke-width="2.5" stroke-linecap="round"/>
      </g>`;
  } else if (stage === 3) {
    // 若竜：翼が広がり、とげ・体格アップ
    body = `
      ${ground}
      <g class="dr-body-breathe" style="transform-origin:150px 178px">
        <path class="dr-tail" d="M195,232 Q245,226 252,190 Q262,222 232,246 Q208,256 190,238 Z" fill="url(#${g('scaleBody')})"/>
        <g class="dr-wing dr-wing-l" id="${g('wingL')}" style="transform-origin:120px 150px">
          <path d="M120,150 C78,132 50,140 30,108 C60,120 82,110 104,120 C96,96 104,80 92,60 C124,74 132,110 128,140 Z"
                fill="url(#${g('wingMembrane')})" stroke="#9c3720" stroke-width="2"/>
          <path d="M120,150 C100,132 90,110 92,86 M120,150 C90,128 68,122 42,112" fill="none" stroke="#9c3720" stroke-width="1.5" opacity="0.55"/>
        </g>
        <g class="dr-wing dr-wing-r" id="${g('wingR')}" style="transform-origin:180px 150px">
          <path d="M180,150 C222,132 250,140 270,108 C240,120 218,110 196,120 C204,96 196,80 208,60 C176,74 168,110 172,140 Z"
                fill="url(#${g('wingMembrane')})" stroke="#9c3720" stroke-width="2"/>
          <path d="M180,150 C200,132 210,110 208,86 M180,150 C210,128 232,122 258,112" fill="none" stroke="#9c3720" stroke-width="1.5" opacity="0.55"/>
        </g>
        <ellipse cx="115" cy="248" rx="15" ry="10" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="185" cy="248" rx="15" ry="10" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="150" cy="195" rx="62" ry="56" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="150" cy="214" rx="36" ry="30" fill="url(#${g('scaleBelly')})"/>
        <polygon points="150,110 158,124 142,124" fill="url(#${g('hornGrad')})"/>
        <polygon points="164,120 172,132 158,132" fill="url(#${g('hornGrad')})"/>
        <polygon points="136,120 128,132 144,132" fill="url(#${g('hornGrad')})"/>
        <ellipse cx="150" cy="130" rx="46" ry="42" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="150" cy="148" rx="22" ry="15" fill="url(#${g('scaleBelly')})"/>
        <path d="M128,96 L136,76 L146,98 Z" fill="url(#${g('hornGrad')})"/>
        <path d="M172,96 L164,76 L154,98 Z" fill="url(#${g('hornGrad')})"/>
        ${eye(128, 122, 13, g('eyeL'))}
        ${eye(172, 122, 13, g('eyeR'))}
        <path d="M138,150 Q150,157 162,150" fill="none" stroke="#7a1f12" stroke-width="2.5" stroke-linecap="round"/>
      </g>`;
  } else {
    // 成竜：伝説の竜。広い翼、豪華な角、燃える息
    body = `
      ${ground}
      <circle class="dr-glow-pulse" cx="150" cy="150" r="110" fill="url(#${g('glow')})" opacity="0.5"/>
      <g class="dr-body-breathe" style="transform-origin:150px 172px">
        <path class="dr-tail" d="M198,236 Q260,230 272,186 Q286,224 248,254 Q216,266 192,244 Z" fill="url(#${g('scaleBody')})"/>
        <polygon points="264,206 280,212 266,222" fill="url(#${g('hornGrad')})"/>
        <g class="dr-wing dr-wing-l" id="${g('wingL')}" style="transform-origin:122px 142px">
          <path d="M122,142 C68,120 34,128 6,86 C42,102 70,90 98,104 C86,76 96,54 80,28 C122,46 136,92 132,132 Z"
                fill="url(#${g('wingMembrane')})" stroke="#9c3720" stroke-width="2.5"/>
          <path d="M122,142 C98,118 86,90 90,58 M122,142 C86,116 58,108 24,94 M122,142 C104,124 78,116 46,110"
                fill="none" stroke="#9c3720" stroke-width="1.5" opacity="0.55"/>
        </g>
        <g class="dr-wing dr-wing-r" id="${g('wingR')}" style="transform-origin:178px 142px">
          <path d="M178,142 C232,120 266,128 294,86 C258,102 230,90 202,104 C214,76 204,54 220,28 C178,46 164,92 168,132 Z"
                fill="url(#${g('wingMembrane')})" stroke="#9c3720" stroke-width="2.5"/>
          <path d="M178,142 C202,118 214,90 210,58 M178,142 C214,116 242,108 276,94 M178,142 C196,124 222,116 254,110"
                fill="none" stroke="#9c3720" stroke-width="1.5" opacity="0.55"/>
        </g>
        <ellipse cx="118" cy="252" rx="17" ry="11" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="182" cy="252" rx="17" ry="11" fill="url(#${g('scaleBody')})"/>
        <path d="M96,220 Q104,196 128,186" fill="none" stroke="url(#${g('scaleBody')})" stroke-width="14" stroke-linecap="round"/>
        <path d="M204,220 Q196,196 172,186" fill="none" stroke="url(#${g('scaleBody')})" stroke-width="14" stroke-linecap="round"/>
        <ellipse cx="150" cy="196" rx="66" ry="60" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="150" cy="216" rx="38" ry="32" fill="url(#${g('scaleBelly')})"/>
        <circle cx="150" cy="214" r="4.5" fill="#ffe9c2" opacity="0.85"/>
        <circle cx="136" cy="222" r="3.6" fill="#ffe9c2" opacity="0.8"/>
        <circle cx="164" cy="222" r="3.6" fill="#ffe9c2" opacity="0.8"/>
        <circle cx="150" cy="230" r="3.2" fill="#ffe9c2" opacity="0.75"/>
        <polygon points="150,86 160,104 140,104" fill="url(#${g('hornGrad')})"/>
        <path d="M120,102 Q100,80 108,54" fill="none" stroke="url(#${g('hornGrad')})" stroke-width="9" stroke-linecap="round"/>
        <path d="M180,102 Q200,80 192,54" fill="none" stroke="url(#${g('hornGrad')})" stroke-width="9" stroke-linecap="round"/>
        <ellipse cx="150" cy="126" rx="48" ry="44" fill="url(#${g('scaleBody')})"/>
        <ellipse cx="150" cy="144" rx="22" ry="15" fill="url(#${g('scaleBelly')})"/>
        ${eye(128, 118, 13, g('eyeL'))}
        ${eye(172, 118, 13, g('eyeR'))}
        <path d="M136,146 Q150,154 164,146" fill="none" stroke="#5c1508" stroke-width="2.5" stroke-linecap="round"/>
        <g class="dr-flame" transform="translate(150 156)">
          <path d="M-6,0 Q-2,-14 2,-2 Q8,-16 10,-2 Q14,-10 8,4 Q0,10 -6,0 Z" fill="#ffd166" opacity="0.9"/>
          <path d="M-3,0 Q0,-8 3,0 Z" fill="#ff8a3d" opacity="0.9"/>
        </g>
      </g>`;
  }

  return `<svg class="dragon-svg dragon-stage-${stage}" viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ドラゴン 進化段階${stage}">${defs}${body}</svg>`;
}

const DRAGON_STAGE_LABELS = ['卵', '幼竜', '若竜', '伝説の竜'];
