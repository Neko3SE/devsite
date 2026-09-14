'use strict';

function shrine(i) {
  stage.innerHTML = `<div class="stackCenter center"><div class="status" id="shrHud"></div><div class="status right" id="shrJudge"></div><div class="shrine pulse">⛩️</div><div class="sigil sigilSmall"></div><div class="sigil sigilMedium"></div><div class="sigil sigilLarge"></div><h3 id="shrMsg"></h3><button class="hugeBtn gold" id="pray"></button><div class="timing shrineTiming" id="shrTiming"><div class="zone shrineZone" id="shrZone"></div><div class="needle shrineNeedle" id="shrNeedle"></div></div><div class="muted" id="shrLucky"></div></div>`;
  let combo = 0;
  let active = true;
  let position = 0;
  let direction = 1;
  let last = 0;
  let hit = false;
  const needle = document.getElementById('shrNeedle');
  const button = document.getElementById('pray');
  const hud = document.getElementById('shrHud');
  const message = document.getElementById('shrMsg');
  const zone = document.getElementById('shrZone');
  const judge = document.getElementById('shrJudge');
  const lucky = document.getElementById('shrLucky');

  function updateText() {
    hud.textContent = t('game10.playing.hud', { count: combo });
    button.textContent = t('game10.playing.ring');
    lucky.textContent = t('game10.playing.lucky');
    message.textContent = hit ? t('game10.playing.now') : t('game10.playing.instruction');
    judge.textContent = hit ? t('game10.playing.luckyZone') : t('game10.playing.waiting');
  }
  setScreenTextUpdater(updateText);
  updateText();

  function loop(time) {
    if (!active) return;
    if (mobileGameLite && last && time - last < 32) { requestAnimationFrame(loop); return; }
    const dt = Math.min(35, last ? time - last : 16);
    last = time;
    position += direction * .065 * dt;
    if (position >= 100) { position = 100; direction = -1; }
    if (position <= 0) { position = 0; direction = 1; }
    needle.style.left = `calc(${position}% - 4px)`;
    const nextHit = position >= 42 && position <= 58;
    if (nextHit !== hit) {
      hit = nextHit;
      updateText();
    }
    message.style.color = hit ? 'var(--yellow)' : '';
    zone.style.filter = hit ? 'brightness(2.2) saturate(1.8)' : '';
    requestAnimationFrame(loop);
  }

  button.onclick = event => {
    if (position >= 42 && position <= 58) {
      combo++;
      burst(event.clientX, event.clientY, 42);
      chord([392, 523, 659], .22, 'sine', 1);
      chord([784, 988, 1175], .12, 'triangle', .55);
      flash();
      confetti(22);
      toast(t('game10.playing.combo', { count: combo }), 'var(--yellow)');
      updateText();
      position = 0;
      direction = 1;
      if (combo >= 7) { active = false; finishDaikichi(i); }
    } else {
      combo = 0;
      boom();
      chord([196, 185, 174], .16, 'sawtooth', .7);
      toast(t('game10.playing.premature'), 'var(--red)');
      updateText();
      position = Math.random() * 30;
      direction = 1;
    }
  };
  requestAnimationFrame(loop);
  cleanups.push(() => { active = false; });
}
