'use strict';

function progress(i) {
  stage.innerHTML = `<div class="stackCenter center progressPanel"><div class="status" id="progHud"></div><div class="big textCyan" id="pv">0%</div><div class="meter progressMeter"><i id="bar"></i></div><button class="hugeBtn gold pulse progressButton" id="pb"></button><div class="combo" id="pc"></div><p class="muted" id="progressHint"></p></div>`;
  let progressValue = 0;
  let combo = 0;
  let active = true;
  let lastReview = performance.now();
  let remaining = 4;
  const value = document.getElementById('pv');
  const bar = document.getElementById('bar');
  const hud = document.getElementById('progHud');
  const comboElement = document.getElementById('pc');
  const button = document.getElementById('pb');
  const hint = document.getElementById('progressHint');

  function updateText() {
    hud.textContent = t('game07.playing.reviewIn', { seconds: remaining.toFixed(1) });
    button.textContent = t('game07.playing.generate');
    comboElement.textContent = t('game07.playing.combo', { count: combo });
    hint.textContent = t('game07.playing.hint');
    value.textContent = progressValue + '%';
    bar.style.width = progressValue + '%';
  }
  setScreenTextUpdater(updateText);
  updateText();

  button.onclick = event => {
    if (!active) return;
    combo++;
    progressValue = Math.min(100, progressValue + 2 + Math.min(4, Math.floor(combo / 8)));
    updateText();
    burst(event.clientX, event.clientY, 8);
    tone(260 + progressValue * 5, .04, 'square', .8);
    if (progressValue >= 100) { active = false; finish(i); }
  };

  const timer = setInterval(() => {
    if (!active) return;
    const now = performance.now();
    remaining = Math.max(0, 4 - (now - lastReview) / 1000);
    if (remaining <= 0) {
      lastReview = now;
      remaining = 4;
      const loss = 12 + Math.floor(Math.random() * 9);
      progressValue = Math.max(0, progressValue - loss);
      combo = 0;
      boom();
      toast(t('game07.playing.review', { loss }), 'var(--red)');
    }
    updateText();
  }, mobileGameLite ? 200 : 100);
  cleanups.push(() => { active = false; clearInterval(timer); });
}
