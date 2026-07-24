'use strict';

/* ===========================================================
   データ定義
=========================================================== */

const STORAGE_KEY = 'studyAppData';

const SPECIES = [
  { id: 'dragon', name: 'ドラゴン', desc: '卵から伝説の竜へ', svgFn: dragonSvg, labels: DRAGON_STAGE_LABELS },
  { id: 'cat', name: 'ネコ', desc: '子猫から百獣の王へ', svgFn: catSvg, labels: CAT_STAGE_LABELS },
  { id: 'plant', name: 'しょくぶつ', desc: '種から満開の花へ', svgFn: plantSvg, labels: PLANT_STAGE_LABELS },
  { id: 'bird', name: 'ひよこ', desc: '卵から大空の王者へ', svgFn: birdSvg, labels: BIRD_STAGE_LABELS },
];

const MAX_STAGE = 10;

function defaultData() {
  return {
    character: { species: null, stage: 0 },
    settings: { wakeTime: '06:30', sleepTime: '23:00', alarmEnabled: false },
    days: {}
  };
}

let data = loadData();
let uidCounter = 1;

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultData(), parsed, {
      character: Object.assign({ species: null, stage: 0 }, parsed.character),
      settings: Object.assign({ wakeTime: '06:30', sleepTime: '23:00', alarmEnabled: false }, parsed.settings),
      days: parsed.days || {}
    });
  } catch (e) {
    console.error('データ読み込みに失敗しました', e);
    return defaultData();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ===========================================================
   日付ユーティリティ
=========================================================== */

function pad(n) { return String(n).padStart(2, '0'); }

function todayStr(d) {
  d = d || new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateStrOf(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getOrCreateDay(dateStr) {
  if (!data.days[dateStr]) {
    data.days[dateStr] = { items: [], finalized: false, achievementRate: null, goalTotal: 0, workedTotal: 0 };
  }
  return data.days[dateStr];
}

/* ===========================================================
   タイマー関連
=========================================================== */

function elapsedSecondsOf(item) {
  let sec = item.workedSeconds;
  if (item.runningSince) sec += (Date.now() - item.runningSince) / 1000;
  return sec;
}

function stopItemTimer(item) {
  if (item.runningSince) {
    item.workedSeconds += (Date.now() - item.runningSince) / 1000;
    item.runningSince = null;
  }
}

function startItemTimer(dateStr, itemId) {
  const day = data.days[dateStr];
  if (!day || day.finalized) return;
  day.items.forEach(stopItemTimer);
  const item = day.items.find(i => i.id === itemId);
  if (item) item.runningSince = Date.now();
  saveData();
  renderToday();
}

function pauseItemTimer(dateStr, itemId) {
  const day = data.days[dateStr];
  if (!day) return;
  const item = day.items.find(i => i.id === itemId);
  if (item) stopItemTimer(item);
  saveData();
  renderToday();
}

function deleteItem(dateStr, itemId) {
  const day = data.days[dateStr];
  if (!day || day.finalized) return;
  day.items = day.items.filter(i => i.id !== itemId);
  saveData();
  renderToday();
}

/* ===========================================================
   キャラクター進化
=========================================================== */

function speciesDef(id) {
  return SPECIES.find(s => s.id === id);
}

function charVisualMarkup(def, stage, uid) {
  return def.svgFn(Math.max(1, Math.min(MAX_STAGE, stage)), uid);
}

function charLabel(def, stage) {
  return def.labels[Math.max(1, Math.min(MAX_STAGE, stage)) - 1];
}

function applyEvolution(rate) {
  if (!data.character.species) return;
  if (rate >= 100) {
    data.character.stage = Math.min(MAX_STAGE, data.character.stage + 1);
  } else if (rate < 80) {
    data.character.stage = Math.max(1, data.character.stage - 1);
  }
}

/* ===========================================================
   確定（達成率計算・進化反映）
=========================================================== */

function finalizeDay(dateStr) {
  const day = data.days[dateStr];
  if (!day || day.finalized) return;
  day.items.forEach(stopItemTimer);

  const goalTotal = day.items.reduce((s, i) => s + i.goalMinutes, 0);
  const workedTotalMinutes = day.items.reduce((s, i) => s + elapsedSecondsOf(i), 0) / 60;

  day.goalTotal = goalTotal;
  day.workedTotal = Math.round(workedTotalMinutes);

  if (goalTotal > 0) {
    const rate = (workedTotalMinutes / goalTotal) * 100;
    day.achievementRate = rate;
    applyEvolution(rate);
  } else {
    day.achievementRate = null;
  }
  day.finalized = true;
  saveData();
}

function checkRollover() {
  const today = todayStr();
  Object.keys(data.days).sort().forEach(dateStr => {
    if (dateStr < today && !data.days[dateStr].finalized) {
      finalizeDay(dateStr);
    }
  });
}

/* ===========================================================
   レンダリング：ヘッダー（キャラクター）
=========================================================== */

let lastRenderedCharKey = null;

function playEvoAnimation(direction) {
  const stageEl = document.getElementById('charHeroStage');
  const burst = document.getElementById('evoBurst');
  stageEl.classList.remove('evo-pop', 'evo-down');
  void stageEl.offsetWidth; // reflow to restart animation
  if (direction === 'up') {
    stageEl.classList.add('evo-pop');
    burst.innerHTML = '';
    const colors = ['#ff9f43', '#ffd479', '#0071e3', '#ffe27a'];
    for (let i = 0; i < 14; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
      const dist = 60 + Math.random() * 40;
      spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      spark.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      spark.style.background = colors[i % colors.length];
      burst.appendChild(spark);
    }
    burst.classList.remove('play');
    void burst.offsetWidth;
    burst.classList.add('play');
  } else if (direction === 'down') {
    stageEl.classList.add('evo-down');
  }
}

function renderHeader() {
  const stage = data.character.stage;
  const species = data.character.species;
  const stageContainer = document.getElementById('charHeroStage');
  const uid = 'hero';

  if (species) {
    const def = speciesDef(species);
    stageContainer.innerHTML = charVisualMarkup(def, stage, uid);
    document.getElementById('headerCharName').textContent = def.name;
    document.getElementById('headerCharForm').textContent = charLabel(def, stage);
  } else {
    stageContainer.innerHTML = '<div class="char-hero-placeholder">🥚</div>';
    document.getElementById('headerCharName').textContent = '未選択';
    document.getElementById('headerCharForm').textContent = '';
  }

  document.getElementById('stageLabel').textContent = `Lv.${stage}/${MAX_STAGE}`;
  document.getElementById('stageBarFill').style.width = `${(stage / MAX_STAGE) * 100}%`;

  const info = document.getElementById('settingsCharInfo');
  if (info) {
    info.textContent = species
      ? `${speciesDef(species).name}（${charLabel(speciesDef(species), stage)} ・ Lv.${stage}/${MAX_STAGE}）`
      : '未選択';
  }

  const key = `${species}-${stage}`;
  if (lastRenderedCharKey !== null && lastRenderedCharKey !== key) {
    const prevStage = parseInt(lastRenderedCharKey.split('-')[1], 10);
    if (species && lastRenderedCharKey.split('-')[0] === species) {
      if (stage > prevStage) playEvoAnimation('up');
      else if (stage < prevStage) playEvoAnimation('down');
    }
  }
  lastRenderedCharKey = key;
}

/* ===========================================================
   レンダリング：今日の学習
=========================================================== */

function formatHMS(totalSeconds) {
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(ss)}`;
}

function renderToday() {
  const dateStr = todayStr();
  const day = getOrCreateDay(dateStr);

  document.getElementById('todayDateLabel').textContent = `今日の目標（${dateStr}）`;

  const list = document.getElementById('itemList');
  list.innerHTML = '';

  day.items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'item-row' + (item.runningSince ? ' running' : '');
    li.dataset.id = item.id;

    const elapsed = elapsedSecondsOf(item);
    const goalSeconds = item.goalMinutes * 60;
    const pct = goalSeconds > 0 ? Math.min(100, (elapsed / goalSeconds) * 100) : 0;

    li.innerHTML = `
      <div class="item-info">
        <div class="item-title"></div>
        <div class="item-goal">目標: ${Math.floor(item.goalMinutes / 60)}時間${item.goalMinutes % 60}分</div>
        <div class="item-progress-bar"><div class="item-progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="item-timer" data-timer-id="${item.id}">${formatHMS(elapsed)}</div>
      <div class="item-actions">
        ${item.runningSince
          ? `<button class="btn-pause" data-action="pause" data-id="${item.id}">☕ 休憩</button>`
          : `<button class="btn-start" data-action="start" data-id="${item.id}" ${day.finalized ? 'disabled' : ''}>▶ 開始</button>`}
        <button class="btn-delete" data-action="delete" data-id="${item.id}" ${day.finalized ? 'disabled' : ''}>削除</button>
      </div>
    `;
    li.querySelector('.item-title').textContent = item.title;
    list.appendChild(li);
  });

  const goalTotal = day.items.reduce((s, i) => s + i.goalMinutes, 0);
  const workedTotal = day.items.reduce((s, i) => s + elapsedSecondsOf(i), 0) / 60;
  const rate = goalTotal > 0 ? Math.min(999, (workedTotal / goalTotal) * 100) : 0;

  document.getElementById('todaySummary').innerHTML = `
    <span>目標合計: ${Math.round(goalTotal)}分</span>
    <span>実績合計: ${Math.round(workedTotal)}分</span>
    <span>達成率: ${goalTotal > 0 ? rate.toFixed(0) + '%' : '-'}</span>
  `;

  const finalizeBtn = document.getElementById('finalizeBtn');
  if (day.finalized) {
    finalizeBtn.disabled = true;
    finalizeBtn.textContent = '✅ 本日は確定済みです';
  } else {
    finalizeBtn.disabled = day.items.length === 0;
    finalizeBtn.textContent = '✅ 今日の記録を確定してキャラクターに反映する';
  }
}

function updateRunningTimersOnly() {
  const dateStr = todayStr();
  const day = data.days[dateStr];
  if (!day) return;
  let needsFullRender = false;
  day.items.forEach(item => {
    if (item.runningSince) {
      const el = document.querySelector(`.item-timer[data-timer-id="${item.id}"]`);
      if (el) {
        el.textContent = formatHMS(elapsedSecondsOf(item));
        const row = el.closest('.item-row');
        const fill = row && row.querySelector('.item-progress-fill');
        if (fill) {
          const goalSeconds = item.goalMinutes * 60;
          const pct = goalSeconds > 0 ? Math.min(100, (elapsedSecondsOf(item) / goalSeconds) * 100) : 0;
          fill.style.width = `${pct}%`;
        }
      } else {
        needsFullRender = true;
      }
    }
  });
  if (needsFullRender) renderToday();
}

/* ===========================================================
   レンダリング：月間達成率
=========================================================== */

let viewYear, viewMonth; // viewMonth: 1-12

function renderMonthly() {
  document.getElementById('monthLabel').textContent = `${viewYear}年${viewMonth}月`;
  const tbody = document.getElementById('monthlyTableBody');
  tbody.innerHTML = '';

  const today = todayStr();
  const dCount = daysInMonth(viewYear, viewMonth);
  let sumRate = 0, countRate = 0;

  for (let d = 1; d <= dCount; d++) {
    const dateStr = dateStrOf(viewYear, viewMonth, d);
    const day = data.days[dateStr];
    const tr = document.createElement('tr');

    if (!day || day.items.length === 0) {
      tr.innerHTML = `<td>${d}日</td><td>-</td><td>-</td><td>-</td><td>記録なし</td>`;
    } else {
      const goalTotal = day.finalized ? day.goalTotal : day.items.reduce((s, i) => s + i.goalMinutes, 0);
      const workedTotal = day.finalized ? day.workedTotal : Math.round(day.items.reduce((s, i) => s + elapsedSecondsOf(i), 0) / 60);
      let rate = day.finalized ? day.achievementRate : (goalTotal > 0 ? (workedTotal / goalTotal) * 100 : null);

      let rateText = '-', rateClass = '';
      if (rate !== null && rate !== undefined) {
        rateText = rate.toFixed(0) + '%';
        rateClass = rate >= 100 ? 'rate-good' : (rate >= 80 ? 'rate-warn' : 'rate-bad');
        if (dateStr === today && !day.finalized) rateText += '（進行中）';
        if (day.finalized) {
          sumRate += rate;
          countRate++;
        }
      }

      const status = day.finalized ? '確定済み' : (dateStr === today ? '本日・未確定' : '未確定');

      tr.innerHTML = `<td>${d}日</td><td>${Math.round(goalTotal)}</td><td>${Math.round(workedTotal)}</td>` +
        `<td class="rate-cell ${rateClass}">${rateText}</td><td>${status}</td>`;
    }
    tbody.appendChild(tr);
  }

  const avgEl = document.getElementById('monthAvg');
  avgEl.textContent = countRate > 0
    ? `月間平均達成率（確定分）: ${(sumRate / countRate).toFixed(1)}%`
    : '確定済みの記録がまだありません';
}

/* ===========================================================
   キャラクター選択オーバーレイ
=========================================================== */

function buildSpeciesList(onPick) {
  const container = document.getElementById('speciesList');
  container.innerHTML = '';
  SPECIES.forEach(sp => {
    const card = document.createElement('div');
    card.className = 'species-card';
    card.innerHTML = `
      <div class="species-preview-pair">
        <div class="species-thumb sm">${charVisualMarkup(sp, 1, `card-${sp.id}-start`)}</div>
        <span class="species-arrow">→</span>
        <div class="species-thumb sm final">${charVisualMarkup(sp, MAX_STAGE, `card-${sp.id}-final`)}</div>
      </div>
      <div class="species-preview-caption">進化後の姿もチラ見せ</div>
      <div class="species-name">${sp.name}</div>
      <div class="species-desc">${sp.desc}</div>
    `;
    card.addEventListener('click', () => onPick(sp.id));
    container.appendChild(card);
  });
}

function showCharSelect(isChange) {
  document.getElementById('resetWarning').style.display = isChange ? 'block' : 'none';
  document.getElementById('cancelCharSelectBtn').style.display = isChange ? 'inline-block' : 'none';
  buildSpeciesList(speciesId => {
    data.character = { species: speciesId, stage: 1 };
    saveData();
    hideCharSelect();
    renderHeader();
    renderToday();
  });
  document.getElementById('charSelectOverlay').classList.remove('hidden');
}

function hideCharSelect() {
  document.getElementById('charSelectOverlay').classList.add('hidden');
}

/* ===========================================================
   アラーム
=========================================================== */

let audioCtx = null;
let alarmOscInterval = null;

function playBeep() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.value = 0.15;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  setTimeout(() => osc.stop(), 350);
}

function startAlarmSound() {
  playBeep();
  if (alarmOscInterval) clearInterval(alarmOscInterval);
  alarmOscInterval = setInterval(playBeep, 700);
}

function stopAlarmSound() {
  if (alarmOscInterval) {
    clearInterval(alarmOscInterval);
    alarmOscInterval = null;
  }
}

let lastAlarmMinute = null;

function checkAlarm() {
  if (!data.settings.alarmEnabled) return;
  const now = new Date();
  const hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if (hm === lastAlarmMinute) return; // 同じ分での連続発火を防止

  if (hm === data.settings.wakeTime) {
    lastAlarmMinute = hm;
    triggerAlarm('⏰ 起床の時間です！');
  } else if (hm === data.settings.sleepTime) {
    lastAlarmMinute = hm;
    triggerAlarm('🌙 就寝の時間です！');
  }
}

function triggerAlarm(message) {
  document.getElementById('alarmMessage').textContent = message;
  document.getElementById('alarmBanner').classList.remove('hidden');
  startAlarmSound();
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(message);
  }
}

function stopAlarm() {
  document.getElementById('alarmBanner').classList.add('hidden');
  stopAlarmSound();
}

/* ===========================================================
   設定タブ
=========================================================== */

function renderSettings() {
  document.getElementById('wakeTimeInput').value = data.settings.wakeTime;
  document.getElementById('sleepTimeInput').value = data.settings.sleepTime;
  document.getElementById('alarmEnabledInput').checked = data.settings.alarmEnabled;
  renderHeader();
  renderEvoGallery();
  renderPreviewAllGallery();
}

/* ===========================================================
   進化の過程ギャラリー
=========================================================== */

function renderEvoGallery() {
  const gallery = document.getElementById('evoGallery');
  if (!gallery) return;

  if (!data.character.species) {
    gallery.innerHTML = '';
    return;
  }

  const def = speciesDef(data.character.species);
  const stage = data.character.stage;

  const items = Array.from({ length: MAX_STAGE }, (_, i) => {
    const s = i + 1;
    return { s, unlocked: stage >= s, isCurrent: stage === s };
  });

  gallery.innerHTML = `
    <div class="evo-gallery-title">進化の過程</div>
    <div class="evo-gallery-row">
      ${items.map(it => `
        <div class="evo-stage-item ${it.unlocked ? 'unlocked' : 'locked'} ${it.isCurrent ? 'current' : ''}">
          <div class="evo-stage-thumb">${it.unlocked ? charVisualMarkup(def, it.s, `gallery-${def.id}-${it.s}`) : '<div class="evo-locked-icon">🔒</div>'}</div>
          <div class="evo-stage-label">${it.unlocked ? def.labels[it.s - 1] : '？？？'}</div>
          <div class="evo-stage-range">Lv.${it.s}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ===========================================================
   テスト用：全キャラクター進化プレビュー
=========================================================== */

let previewAllVisible = false;

function renderPreviewAllGallery() {
  const gallery = document.getElementById('previewAllGallery');
  if (!gallery) return;

  if (!previewAllVisible) {
    gallery.innerHTML = '';
    return;
  }

  gallery.innerHTML = SPECIES.map(def => `
    <div class="preview-species-block">
      <div class="preview-species-title">${def.name}</div>
      <div class="preview-stage-row">
        ${Array.from({ length: MAX_STAGE }, (_, i) => {
          const s = i + 1;
          return `
            <div class="preview-stage-item">
              <div class="preview-stage-thumb">${charVisualMarkup(def, s, `preview-${def.id}-${s}`)}</div>
              <div class="preview-stage-lv">Lv.${s}</div>
              <div class="preview-stage-label">${def.labels[s - 1]}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

/* ===========================================================
   タブ切り替え
=========================================================== */

function switchTab(tabName) {
  const buttons = Array.from(document.querySelectorAll('.tab-btn'));
  const activeIndex = buttons.findIndex(b => b.dataset.tab === tabName);
  buttons.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${tabName}`));
  const indicator = document.getElementById('tabsIndicator');
  if (indicator && activeIndex >= 0) {
    indicator.style.transform = `translateX(${activeIndex * 100}%)`;
  }
  if (tabName === 'monthly') renderMonthly();
  if (tabName === 'settings') renderSettings();
  if (tabName === 'today') renderToday();
}

/* ===========================================================
   イベント登録
=========================================================== */

function initEvents() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('itemForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('itemTitle').value.trim();
    const h = parseInt(document.getElementById('itemGoalH').value, 10) || 0;
    const m = parseInt(document.getElementById('itemGoalM').value, 10) || 0;
    if (!title || (h === 0 && m === 0)) return;

    const dateStr = todayStr();
    const day = getOrCreateDay(dateStr);
    if (day.finalized) { alert('本日の記録は確定済みのため、追加できません。'); return; }

    day.items.push({
      id: uidCounter++,
      title,
      goalMinutes: h * 60 + m,
      workedSeconds: 0,
      runningSince: null
    });
    saveData();
    document.getElementById('itemForm').reset();
    document.getElementById('itemGoalH').value = 0;
    document.getElementById('itemGoalM').value = 30;
    renderToday();
  });

  document.getElementById('itemList').addEventListener('click', e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    const dateStr = todayStr();
    if (btn.dataset.action === 'start') startItemTimer(dateStr, id);
    if (btn.dataset.action === 'pause') pauseItemTimer(dateStr, id);
    if (btn.dataset.action === 'delete') {
      if (confirm('この項目を削除しますか？')) deleteItem(dateStr, id);
    }
  });

  document.getElementById('finalizeBtn').addEventListener('click', () => {
    const dateStr = todayStr();
    if (!confirm('今日の記録を確定します。確定後は編集できません。よろしいですか？')) return;
    finalizeDay(dateStr);
    renderHeader();
    renderToday();
  });

  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 1) { viewMonth = 12; viewYear--; }
    renderMonthly();
  });
  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 12) { viewMonth = 1; viewYear++; }
    renderMonthly();
  });

  document.getElementById('changeCharBtn').addEventListener('click', () => {
    if (confirm('キャラクターを変更すると進化段階が1に戻ります。よろしいですか？')) {
      showCharSelect(true);
    }
  });
  document.getElementById('cancelCharSelectBtn').addEventListener('click', hideCharSelect);

  document.getElementById('previewAllBtn').addEventListener('click', e => {
    previewAllVisible = !previewAllVisible;
    e.target.textContent = previewAllVisible ? '🔍 プレビューを隠す' : '🔍 全キャラクターの進化をプレビュー';
    renderPreviewAllGallery();
  });

  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    data.settings.wakeTime = document.getElementById('wakeTimeInput').value || '06:30';
    data.settings.sleepTime = document.getElementById('sleepTimeInput').value || '23:00';
    data.settings.alarmEnabled = document.getElementById('alarmEnabledInput').checked;
    saveData();
    if (data.settings.alarmEnabled && window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    alert('設定を保存しました。');
  });

  document.getElementById('alarmStopBtn').addEventListener('click', stopAlarm);
}

/* ===========================================================
   初期化
=========================================================== */

function init() {
  const now = new Date();
  viewYear = now.getFullYear();
  viewMonth = now.getMonth() + 1;

  // 既存データから uidCounter を復元
  Object.values(data.days).forEach(day => {
    day.items.forEach(item => { if (item.id >= uidCounter) uidCounter = item.id + 1; });
  });

  checkRollover();
  initEvents();
  renderHeader();
  renderToday();

  if (!data.character.species) {
    showCharSelect(false);
  }

  setInterval(() => {
    updateRunningTimersOnly();
  }, 1000);

  setInterval(() => {
    checkRollover();
    checkAlarm();
  }, 5000);
}

document.addEventListener('DOMContentLoaded', init);
