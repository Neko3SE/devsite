'use strict';

function spec(i) {
  stage.innerHTML = `<div class="status" id="specHud"></div><div class="status right">RELEASE GATE</div><div class="runner specRunner" id="specRunner">👨‍💻</div><div class="specGround"></div><div class="muted gameInstructionBottom" id="specInstruction"></div>`;
  const runner = document.getElementById('specRunner');
  const hud = document.getElementById('specHud');
  const instruction = document.getElementById('specInstruction');
  let x = .46;
  let hp = 3;
  let dodges = 0;
  let active = true;
  let items = [];
  let last = 0;
  let lastSpawn = 0;

  function hearts() { return '❤'.repeat(hp) + '♡'.repeat(3 - hp); }
  function updateText() {
    hud.textContent = t('game05.playing.hud', { dodges, hp: hearts() });
    instruction.textContent = t('game05.playing.instruction');
    items.forEach(item => { item.element.textContent = t(`game05.playing.changes.${item.textIndex}`); });
  }
  setScreenTextUpdater(updateText);
  updateText();

  function move(direction) {
    x = Math.max(.03, Math.min(.92, x + direction));
    runner.style.left = x * 100 + '%';
    tone(260 + Math.round(x * 300), .035, 'square', .55);
  }
  const keyHandler = event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-.09); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(.09); }
  };
  addEventListener('keydown', keyHandler);
  const tapHandler = event => {
    const rect = stage.getBoundingClientRect();
    move(event.clientX < rect.left + rect.width / 2 ? -.09 : .09);
  };
  stage.addEventListener('pointerdown', tapHandler);
  cleanups.push(() => {
    active = false;
    removeEventListener('keydown', keyHandler);
    stage.removeEventListener('pointerdown', tapHandler);
  });

  function drop() {
    const element = document.createElement('div');
    element.className = 'obstacle';
    const px = 10 + Math.random() * Math.max(30, stage.clientWidth - 210);
    const item = { element, textIndex: Math.floor(Math.random() * 7), x: px, y: -55, hit: false, passed: false };
    element.textContent = t(`game05.playing.changes.${item.textIndex}`);
    element.style.left = px + 'px';
    element.style.top = '-55px';
    stage.appendChild(element);
    items.push(item);
  }
  function hit(a, b) {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    return rectA.left + 8 < rectB.right && rectA.right - 8 > rectB.left && rectA.top + 8 < rectB.bottom && rectA.bottom - 8 > rectB.top;
  }
  function loop(time) {
    if (!active) return;
    if (mobileGameLite && last && time - last < 32) { requestAnimationFrame(loop); return; }
    const dt = Math.min(35, last ? time - last : 16);
    last = time;
    if (time - lastSpawn > Math.max(420, 820 - dodges * 10)) { drop(); lastSpawn = time; }
    for (const item of items) {
      item.y += .29 * dt + dodges * .004 * dt;
      item.element.style.top = item.y + 'px';
      if (!item.hit && hit(runner, item.element)) {
        item.hit = true;
        hp--;
        boom();
        item.element.style.opacity = .2;
        updateText();
        if (hp <= 0) { active = false; fail(i); return; }
      }
      if (!item.passed && !item.hit && item.y > stage.clientHeight - 20) {
        item.passed = true;
        dodges++;
        chord([420, 630], .05, 'square', .8);
        toast(t('game05.playing.avoid', { count: dodges }), 'var(--green)');
        updateText();
        if (dodges >= 20) { active = false; finish(i); return; }
      }
    }
    items = items.filter(item => {
      if (item.y > stage.clientHeight + 80) { item.element.remove(); return false; }
      return true;
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
