'use strict';

const mobileGameLite = window.matchMedia('(pointer: coarse)').matches || innerWidth <= 650;
const gameCount = 10;
const gameFunctions = () => [deploy, teiji, hanko, incident, spec, excel, progress, bugTemple, meeting, shrine];
const gameKey = i => `game${String(i + 1).padStart(2, '0')}`;
const cards = document.getElementById('cards');
const home = document.getElementById('home');
const shell = document.getElementById('shell');
const stage = document.getElementById('stage');
const title = document.getElementById('gameTitle');
const backBtn = document.getElementById('backBtn');
const bgmToggle = document.getElementById('bgmToggle');
const bgmLabel = document.getElementById('bgmLabel');

let currentGameIndex = null;
let screenTextUpdater = null;
let cleanups = [];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setScreenTextUpdater(updater) {
  screenTextUpdater = updater;
}

function setupLanguageSelectors() {
  document.querySelectorAll('[data-language-select]').forEach(select => {
    MudaI18n.list().forEach(locale => {
      const option = document.createElement('option');
      option.value = locale.code;
      option.textContent = locale.name;
      select.appendChild(option);
    });
    select.addEventListener('change', event => MudaI18n.setLanguage(event.target.value));
  });
}

function createCards() {
  for (let i = 0; i < gameCount; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.dataset.gameIndex = String(i);
    card.innerHTML = '<div class="no"></div><h3></h3><p></p><div class="tag"></div>';
    card.addEventListener('click', () => openGame(i));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openGame(i);
      }
    });
    cards.appendChild(card);
  }
}

function renderSiteText() {
  document.title = t('site.documentTitle');
  document.getElementById('siteEyebrow').textContent = t('site.eyebrow');
  document.getElementById('officialLabel').textContent = t('site.officialLabel');
  document.getElementById('officialName').textContent = t('site.officialName');
  document.getElementById('siteTagline').textContent = t('site.tagline');

  const alias = document.getElementById('brandAlias');
  alias.textContent = t('site.brandAlias');
  alias.hidden = !alias.textContent;

  document.querySelectorAll('.languageLabel').forEach(label => {
    label.textContent = t('site.languageLabel');
  });
  document.querySelectorAll('[data-language-select]').forEach(select => {
    select.value = MudaI18n.getLanguage();
    select.setAttribute('aria-label', t('site.languageLabel'));
  });

  const badges = document.getElementById('badges');
  badges.innerHTML = t('site.badges').map(text => `<span class="badge">${escapeHtml(text)}</span>`).join('');

  document.getElementById('aboutTitle').textContent = t('site.aboutTitle');
  document.getElementById('aboutBody').innerHTML = t('site.about')
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');

  document.querySelectorAll('.card').forEach((card, i) => {
    const key = gameKey(i);
    card.querySelector('.no').textContent = t('site.researchNo', { number: String(i + 1).padStart(3, '0') });
    card.querySelector('h3').textContent = t(`${key}.title`);
    card.querySelector('p').textContent = t(`${key}.description`);
    card.querySelector('.tag').textContent = `${t('site.controlsPrefix')}${t(`${key}.controls`)}`;
    card.setAttribute('aria-label', `${t(`${key}.title`)} — ${t(`${key}.description`)}`);
  });

  backBtn.textContent = t('site.back');
  if (currentGameIndex !== null) title.textContent = t(`${gameKey(currentGameIndex)}.title`);
  setBgmUi(bgmStarted);
  if (screenTextUpdater) screenTextUpdater();
}

function renderCulture(i) {
  const key = gameKey(i);
  const culture = t(`${key}.culture`);
  const paragraphs = culture.background.map(text => `<p>${escapeHtml(text)}</p>`).join('');
  const parody = culture.parody.map(text => `<p>${escapeHtml(text)}</p>`).join('');
  stage.className = 'stage cultureStage';
  stage.innerHTML = `
    <article class="cultureCard">
      <div class="eyebrow cultureNumber">${escapeHtml(t('common.cultureNote', { number: String(i + 1).padStart(3, '0') }))}</div>
      <h3>${escapeHtml(culture.heading)}</h3>
      <div class="cultureText">${paragraphs}</div>
      <h4>${escapeHtml(t('common.parodyHeading'))}</h4>
      <div class="cultureText">${parody}</div>
      <p class="culturePunchline">${escapeHtml(culture.punchline)}</p>
      <button class="hugeBtn cultureStart" id="cultureStart">${escapeHtml(t('common.beginResearch'))}</button>
    </article>`;
  document.getElementById('cultureStart').addEventListener('click', () => startGame(i));
}

function showCulture(i) {
  stopHomeBgm();
  cleanup();
  currentGameIndex = i;
  home.style.display = 'none';
  shell.style.display = 'block';
  title.textContent = t(`${gameKey(i)}.title`);
  scrollTo(0, 0);
  setScreenTextUpdater(() => renderCulture(i));
  renderCulture(i);
}

function startGame(i) {
  stopHomeBgm();
  cleanup();
  currentGameIndex = i;
  home.style.display = 'none';
  shell.style.display = 'block';
  title.textContent = t(`${gameKey(i)}.title`);
  scrollTo(0, 0);
  gameFunctions()[i](i);
  overkill();
}

function openGame(i) {
  showCulture(i);
}

backBtn.addEventListener('click', () => {
  cleanup();
  currentGameIndex = null;
  shell.style.display = 'none';
  home.style.display = 'block';
  scrollTo(0, 0);
  if (bgmEnabled) startHomeBgm();
});

function cleanup() {
  cleanups.forEach(fn => {
    try { fn(); } catch (_) {}
  });
  cleanups = [];
  screenTextUpdater = null;
  stage.className = 'stage';
  stage.innerHTML = '';
}

let ac = null;
let master = null;

function ctx() {
  if (!ac) {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -8;
    comp.knee.value = 12;
    comp.ratio.value = 7;
    comp.attack.value = .002;
    comp.release.value = .16;
    master.gain.value = 1;
    master.connect(comp);
    comp.connect(ac.destination);
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

let bgmTimer = null;
let bgmStarted = false;
let bgmEnabled = false;
let bgmBus = null;
let bgmStep = 0;

function bgmVoice(freq, when, dur, type = 'sine', gain = .08, detune = 0) {
  try {
    const a = ctx();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, when);
    o.detune.setValueAtTime(detune, when);
    g.gain.setValueAtTime(.0001, when);
    g.gain.exponentialRampToValueAtTime(Math.max(.0002, gain), when + .012);
    g.gain.exponentialRampToValueAtTime(.0001, when + dur);
    o.connect(g);
    g.connect(bgmBus);
    o.start(when);
    o.stop(when + dur + .03);
  } catch (_) {}
}

function bgmTick() {
  if (!bgmStarted || home.style.display === 'none') return;
  const a = ctx();
  const at = a.currentTime + .03;
  const melody = [293.66, 349.23, 392, 440, 523.25, 440, 392, 349.23, 293.66, 392, 440, 523.25, 587.33, 523.25, 440, 392];
  const bass = [73.42, 73.42, 87.31, 73.42, 98, 87.31, 73.42, 65.41];
  const m = melody[bgmStep % melody.length];
  const b = bass[Math.floor(bgmStep / 2) % bass.length];
  bgmVoice(m, at, .17, bgmStep % 4 === 0 ? 'square' : 'triangle', .068);
  bgmVoice(m * 1.5, at + .006, .12, 'sine', .028, -4);
  bgmVoice(m * .5, at + .012, .18, 'triangle', .018, 3);
  if (bgmStep % 2 === 0) {
    bgmVoice(b, at, .31, 'sawtooth', .07);
    bgmVoice(b * 2, at, .24, 'sine', .032);
  }
  if (bgmStep % 4 === 0) {
    [146.83, 220, 293.66].forEach((f, j) => bgmVoice(f, at + j * .008, .36, 'sine', .028));
    bgmVoice(880, at + .05, .08, 'square', .012);
  }
  if (bgmStep % 4 === 2) [174.61, 261.63, 349.23].forEach((f, j) => bgmVoice(f, at + j * .008, .30, 'triangle', .024));
  if (bgmStep % 2 === 0) bgmVoice(54, at, .07, 'sine', .085);
  else bgmVoice(160, at, .035, 'square', .024);
  if (bgmStep % 8 === 7) bgmVoice(1174.66, at, .12, 'sine', .018);
  bgmStep = (bgmStep + 1) % 64;
}

function setBgmUi(on) {
  if (!bgmToggle) return;
  bgmToggle.classList.toggle('on', on);
  bgmToggle.setAttribute('aria-pressed', String(on));
  if (bgmLabel) bgmLabel.textContent = on ? t('site.bgmStop') : t('site.bgmStart');
}

async function startHomeBgm() {
  if (!bgmEnabled || home.style.display === 'none') return false;
  const a = ctx();
  try {
    if (a.state === 'suspended') await a.resume();
  } catch (_) {}
  if (a.state !== 'running') {
    setBgmUi(false);
    return false;
  }
  if (!bgmBus) {
    bgmBus = ac.createGain();
    bgmBus.gain.value = .46;
    bgmBus.connect(master);
  }
  if (bgmStarted) {
    setBgmUi(true);
    return true;
  }
  bgmStarted = true;
  bgmStep = 0;
  bgmTick();
  bgmTimer = setInterval(bgmTick, 180);
  setBgmUi(true);
  return true;
}

function stopHomeBgm() {
  bgmStarted = false;
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  setBgmUi(false);
}

bgmToggle.addEventListener('click', async event => {
  event.stopPropagation();
  if (bgmStarted) {
    bgmEnabled = false;
    stopHomeBgm();
  } else {
    bgmEnabled = true;
    await startHomeBgm();
  }
});

function tone(f = 440, d = .08, type = 'square', gain = 1, delay = 0, voices = 3) {
  try {
    const a = ctx();
    const start = a.currentTime + delay;
    const ratios = voices === 2 ? [1, 1.5] : [1, 1.25, 1.5];
    ratios.forEach(ratio => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      o.frequency.value = f * ratio;
      const volume = Math.min(1, Math.max(.02, gain)) / ratios.length;
      g.gain.setValueAtTime(volume, start);
      g.gain.exponentialRampToValueAtTime(.0001, start + d);
      o.connect(g);
      g.connect(master);
      o.start(start);
      o.stop(start + d + .03);
    });
  } catch (_) {}
}

function chord(frequencies, d = .1, type = 'square', gain = 1, delay = 0) {
  frequencies.forEach((f, j) => tone(f, d, type, gain, delay + j * .008, 2));
}

function boom() {
  chord([60, 90, 135], .34, 'sawtooth', 1);
  tone(45, .5, 'square', 1, .03, 3);
  shake();
}

function successSound() {
  [[523, .13, 0], [659, .13, .11], [784, .16, .22], [1047, .22, .35], [1319, .18, .53], [1568, .4, .68]]
    .forEach(sound => tone(sound[0], sound[1], 'square', 1, sound[2], 3));
}

function fanfare() {
  successSound();
  confetti(90);
}

function shake() {
  stage.classList.remove('shake');
  void stage.offsetWidth;
  stage.classList.add('shake');
}

function flash() {
  stage.classList.remove('flash');
  void stage.offsetWidth;
  stage.classList.add('flash');
}

function confetti(n = 50) {
  if (mobileGameLite) n = Math.min(n, 18);
  for (let i = 0; i < n; i++) {
    const element = document.createElement('i');
    element.className = 'confetti';
    element.setAttribute('aria-hidden', 'true');
    element.style.left = Math.random() * 100 + '%';
    element.style.background = `hsl(${Math.random() * 360} 90% 65%)`;
    element.style.setProperty('--dx', Math.random() * 340 - 170 + 'px');
    element.style.animationDelay = Math.random() * .5 + 's';
    stage.appendChild(element);
    setTimeout(() => element.remove(), 2800);
  }
}

function burst(x, y, n = 14) {
  if (mobileGameLite) n = Math.min(n, 8);
  const rect = stage.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const element = document.createElement('i');
    element.className = 'burst';
    element.setAttribute('aria-hidden', 'true');
    element.style.left = x - rect.left + 'px';
    element.style.top = y - rect.top + 'px';
    element.style.background = `hsl(${Math.random() * 360} 90% 70%)`;
    const angle = Math.random() * Math.PI * 2;
    const distance = 35 + Math.random() * 90;
    element.style.setProperty('--x', Math.cos(angle) * distance + 'px');
    element.style.setProperty('--y', Math.sin(angle) * distance + 'px');
    stage.appendChild(element);
    setTimeout(() => element.remove(), 700);
  }
}

function toast(text, color = 'var(--yellow)') {
  const element = document.createElement('div');
  element.className = 'toast';
  element.style.color = color;
  element.textContent = text;
  stage.appendChild(element);
  setTimeout(() => element.remove(), 750);
}

function renderStandardResult(i, kind) {
  const key = gameKey(i);
  const failed = kind === 'failure';
  stage.innerHTML = `
    <div class="${failed ? 'failScreen' : 'result'}">
      <div class="${failed ? '' : 'resultBox'}">
        <div class="eyebrow">${escapeHtml(t(failed ? 'common.researchFailed' : 'common.researchComplete'))}</div>
        <h3>${escapeHtml(t(failed ? 'common.researchFailedJa' : 'common.researchCompleteJa'))}</h3>
        <div class="big ${failed ? 'resultMessageFailed' : 'resultMessageComplete'}">${escapeHtml(t(`${key}.${kind}`))}</div>
        ${failed ? '' : `<div class="promptBox"><b>${escapeHtml(t('common.promptLabel'))}</b><br><br>${escapeHtml(t(`${key}.prompt`))}<br><br><span class="muted">${escapeHtml(t('common.disclaimer'))}</span></div>`}
        <button class="${failed ? 'hugeBtn retryFailButton' : 'btn retryButton'}" id="resultRetry">${escapeHtml(t(failed ? 'common.retryFail' : 'common.retry'))}</button>
      </div>
    </div>`;
  document.getElementById('resultRetry').addEventListener('click', () => startGame(i));
}

function finish(i) {
  cleanup();
  currentGameIndex = i;
  setScreenTextUpdater(() => renderStandardResult(i, 'clear'));
  renderStandardResult(i, 'clear');
  fanfare();
}

function fail(i) {
  cleanup();
  currentGameIndex = i;
  setScreenTextUpdater(() => renderStandardResult(i, 'failure'));
  renderStandardResult(i, 'failure');
  boom();
}

function renderDaikichiResult(i) {
  const key = gameKey(i);
  stage.innerHTML = `
    <div class="result">
      <div class="resultBox">
        <div class="eyebrow">${escapeHtml(t('common.researchSuccess'))}</div>
        <h3>${escapeHtml(t(`${key}.clearTitle`))}</h3>
        <div class="big resultMessageComplete daikichiMessage">${escapeHtml(t(`${key}.clear`))}</div>
        <p class="culturePunchline">${escapeHtml(t(`${key}.clearPunchline`))}</p>
        <div class="promptBox"><b>${escapeHtml(t('common.promptLabel'))}</b><br><br>${escapeHtml(t(`${key}.prompt`))}<br><br><span class="muted">${escapeHtml(t('common.disclaimer'))}</span></div>
        <button class="btn retryButton" id="resultRetry">${escapeHtml(t('common.retry'))}</button>
      </div>
    </div>`;
  document.getElementById('resultRetry').addEventListener('click', () => startGame(i));
}

function finishDaikichi(i) {
  cleanup();
  currentGameIndex = i;
  setScreenTextUpdater(() => renderDaikichiResult(i));
  renderDaikichiResult(i);
  fanfare();
}

function overkill() {
  const beamCount = mobileGameLite ? 1 : 4;
  const particleCount = mobileGameLite ? 32 : 220;
  const fxBeamCount = mobileGameLite ? 2 : 18;
  const ringCount = mobileGameLite ? 2 : 12;
  const glyphCount = mobileGameLite ? 7 : 34;
  for (let b = 0; b < beamCount; b++) {
    const beam = document.createElement('div');
    beam.className = 'wasteBeam';
    beam.setAttribute('aria-hidden', 'true');
    beam.style.animationDuration = (mobileGameLite ? 28 : 11 + b * 4) + 's';
    beam.style.animationDirection = b % 2 ? 'reverse' : 'normal';
    beam.style.opacity = String(mobileGameLite ? .18 : .65 - b * .09);
    stage.prepend(beam);
  }
  for (let n = 0; n < particleCount; n++) {
    const particle = document.createElement('i');
    particle.className = 'wasteParticle';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = -Math.random() * 760 + 'px';
    particle.style.setProperty('--dur', (mobileGameLite ? 8 : 3 + Math.random() * 8) + 's');
    particle.style.setProperty('--drift', (Math.random() - .5) * (mobileGameLite ? 120 : 360) + 'px');
    particle.style.animationDelay = -Math.random() * 10 + 's';
    particle.style.transform = `scale(${.4 + Math.random() * (mobileGameLite ? 1.2 : 2.8)})`;
    stage.appendChild(particle);
  }
  for (let n = 0; n < fxBeamCount; n++) {
    const beam = document.createElement('i');
    beam.className = 'fxBeam';
    beam.setAttribute('aria-hidden', 'true');
    beam.style.setProperty('--r', -18 + Math.random() * 36 + 'deg');
    beam.style.setProperty('--bd', (mobileGameLite ? 9 : 3 + Math.random() * 7) + 's');
    beam.style.animationDelay = -Math.random() * 8 + 's';
    stage.appendChild(beam);
  }
  for (let n = 0; n < ringCount; n++) {
    const ring = document.createElement('i');
    ring.className = 'fxRing';
    ring.setAttribute('aria-hidden', 'true');
    const size = 120 + Math.random() * (mobileGameLite ? 260 : 520);
    ring.style.width = ring.style.height = size + 'px';
    ring.style.left = -10 + Math.random() * 100 + '%';
    ring.style.top = -20 + Math.random() * 105 + '%';
    ring.style.setProperty('--rd', (mobileGameLite ? 20 : 8 + Math.random() * 22) + 's');
    if (n % 2) ring.style.animationDirection = 'reverse';
    stage.appendChild(ring);
  }
  const words = ['GPU', 'CPU', 'RAM', 'SEV1', '本番', '承認', '仕様', 'BUG', '404', 'LGTM', 'CI/CD', '無駄'];
  for (let n = 0; n < glyphCount; n++) {
    const glyph = document.createElement('b');
    glyph.className = 'fxGlyph';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = words[n % words.length];
    glyph.style.left = Math.random() * 94 + '%';
    glyph.style.top = 5 + Math.random() * 90 + '%';
    glyph.style.setProperty('--gd', (mobileGameLite ? 8 : 2 + Math.random() * 6) + 's');
    glyph.style.setProperty('--gx', (Math.random() - .5) * (mobileGameLite ? 50 : 130) + 'px');
    glyph.style.setProperty('--gy', (Math.random() - .5) * (mobileGameLite ? 35 : 90) + 'px');
    glyph.style.setProperty('--gr', (Math.random() - .5) * (mobileGameLite ? 12 : 40) + 'deg');
    glyph.style.animationDelay = -Math.random() * 6 + 's';
    stage.appendChild(glyph);
  }
}

(function initHomeFx() {
  const fx = document.getElementById('homeFx');
  if (!fx) return;
  const mobileHomeFx = window.matchMedia('(pointer: coarse)').matches || innerWidth <= 650;
  const homeStarCount = mobileHomeFx ? 70 : 220;
  for (let n = 0; n < homeStarCount; n++) {
    const star = document.createElement('i');
    star.className = 'homeStar';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 125 + '%';
    star.style.setProperty('--d', 3 + Math.random() * 9 + 's');
    star.style.setProperty('--dx', (Math.random() - .5) * 420 + 'px');
    star.style.animationDelay = -Math.random() * 12 + 's';
    star.style.transform = `scale(${.35 + Math.random() * 2.5})`;
    fx.appendChild(star);
  }
  const rings = mobileHomeFx ? [[3, 1, 250, 15], [58, 1, 310, 18], [42, 40, 620, 38]] : [[3, 1, 250, 15], [24, -3, 370, 23], [58, 1, 310, 18], [72, 16, 470, 29], [42, 40, 620, 38], [-8, 52, 420, 27], [70, 58, 350, 20], [20, 67, 520, 33]];
  rings.forEach((values, index) => {
    const ring = document.createElement('i');
    ring.className = 'homeRing';
    ring.style.left = values[0] + '%';
    ring.style.top = values[1] + '%';
    ring.style.width = values[2] + 'px';
    ring.style.height = values[2] + 'px';
    ring.style.setProperty('--rs', values[3] + 's');
    if (index % 2) ring.style.animationDirection = 'reverse';
    fx.appendChild(ring);
  });
  const glyphs = ['承', '障', '仕', '定', '本', 'AI', '404', '稟', 'BUG', 'DEPLOY', 'ROLLBACK', 'SLA', 'Excel', '会議', '仕様', '進捗', '神', '寺', 'SEV1', 'LGTM', 'PR', 'CI/CD', '本番', '金曜'];
  for (let n = 0; n < (mobileHomeFx ? 12 : 38); n++) {
    const glyph = document.createElement('b');
    glyph.className = 'homeGlyph';
    glyph.textContent = glyphs[n % glyphs.length];
    glyph.style.left = 2 + Math.random() * 94 + '%';
    glyph.style.top = 2 + Math.random() * 93 + '%';
    glyph.style.setProperty('--gd', 3 + Math.random() * 7 + 's');
    glyph.style.setProperty('--gx', (Math.random() - .5) * 180 + 'px');
    glyph.style.setProperty('--gy', (Math.random() - .5) * 120 + 'px');
    glyph.style.setProperty('--gr', (Math.random() - .5) * 45 + 'deg');
    glyph.style.animationDelay = -Math.random() * 7 + 's';
    fx.appendChild(glyph);
  }
  for (let n = 0; n < (mobileHomeFx ? 4 : 14); n++) {
    const laser = document.createElement('i');
    laser.className = 'homeLaser';
    laser.style.top = Math.random() * 100 + '%';
    laser.style.setProperty('--lr', -14 + Math.random() * 28 + 'deg');
    laser.style.setProperty('--ld', 3.5 + Math.random() * 6 + 's');
    laser.style.animationDelay = -Math.random() * 7 + 's';
    fx.appendChild(laser);
  }
  for (let n = 0; n < (mobileHomeFx ? 8 : 32); n++) {
    const orb = document.createElement('i');
    orb.className = 'homeOrb';
    const size = 8 + Math.random() * 38;
    orb.style.width = orb.style.height = size + 'px';
    orb.style.left = Math.random() * 100 + '%';
    orb.style.top = Math.random() * 100 + '%';
    orb.style.setProperty('--od', 3 + Math.random() * 8 + 's');
    orb.style.setProperty('--ox', (Math.random() - .5) * 220 + 'px');
    orb.style.setProperty('--oy', (Math.random() - .5) * 180 + 'px');
    orb.style.animationDelay = -Math.random() * 8 + 's';
    fx.appendChild(orb);
  }
  for (let n = 0; n < (mobileHomeFx ? 4 : 12); n++) {
    const data = document.createElement('i');
    data.className = 'homeData';
    data.style.left = 4 + n * 8 + Math.random() * 3 + '%';
    data.style.setProperty('--dd', 5 + Math.random() * 7 + 's');
    data.style.animationDelay = -Math.random() * 8 + 's';
    data.setAttribute('data-code', ['01001001', 'DEPLOY', 'SEV-1', 'APPROVAL', 'BUGFIX', 'ROLLBACK'][n % 6]);
    fx.appendChild(data);
  }
})();

(function initGlobalFx() {
  const canvas = document.getElementById('globalFxCanvas');
  if (!canvas) return;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let points = [];
  const mobileFx = window.matchMedia('(pointer: coarse)').matches || innerWidth <= 650;
  function resize() {
    dpr = mobileFx ? 1 : Math.min(2, window.devicePixelRatio || 1);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = mobileFx ? 30 : Math.max(140, Math.min(320, Math.floor(width * height / 5200)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .42,
      vy: .12 + Math.random() * .62,
      r: .4 + Math.random() * 1.8,
      a: .12 + Math.random() * .5,
      hue: [190, 205, 265, 48, 345][Math.floor(Math.random() * 5)]
    }));
  }
  let lastFrame = 0;
  function draw(time) {
    if (mobileFx && time - lastFrame < 33) {
      requestAnimationFrame(draw);
      return;
    }
    lastFrame = time;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'lighter';
    points.forEach(point => {
      point.x += point.vx + Math.sin(time * .0003 + point.y * .009) * .08;
      point.y += point.vy;
      if (point.y > height + 8) { point.y = -8; point.x = Math.random() * width; }
      if (point.x < -8) point.x = width + 8;
      if (point.x > width + 8) point.x = -8;
      context.beginPath();
      context.fillStyle = `hsla(${point.hue},95%,70%,${point.a})`;
      if (!mobileFx) {
        context.shadowBlur = 10 + point.r * 6;
        context.shadowColor = `hsla(${point.hue},95%,65%,.7)`;
      }
      context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      context.fill();
    });
    context.shadowBlur = 0;
    const waveCount = mobileFx ? 1 : 5;
    for (let k = 0; k < waveCount; k++) {
      const y = height * (k + 1) / (waveCount + 1) + Math.sin(time * .0005 + k) * 35;
      context.beginPath();
      context.strokeStyle = `hsla(${190 + k * 17},95%,70%,.055)`;
      context.lineWidth = 1.2;
      context.moveTo(0, y);
      for (let x = 0; x <= width; x += 36) context.lineTo(x, y + Math.sin(x * .012 + time * .001 + k) * 16);
      context.stroke();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
})();

setupLanguageSelectors();
createCards();
MudaI18n.onChange(renderSiteText);
MudaI18n.init();
