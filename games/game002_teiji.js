'use strict';

function teiji(i) {
  stage.innerHTML = `<div class="status" id="teijiHud"></div><div class="status right">17:30 ESCAPE</div><div class="road" id="road"><div class="lane"></div><div class="lane"></div><div class="lane"></div><div class="runner" id="teijiRunner">🏃</div></div><div class="muted gameInstructionBottom aboveGame" id="teijiInstruction"></div>`;
  const road = document.getElementById('road');
  const runner = document.getElementById('teijiRunner');
  const hud = document.getElementById('teijiHud');
  const instruction = document.getElementById('teijiInstruction');
  let lane = 1;
  let hp = 3;
  let dodges = 0;
  let active = true;
  let obstacles = [];
  let last = 0;
  let lastSpawn = 0;
  let sequence = 0;

  function hearts() {
    return '❤'.repeat(hp) + '♡'.repeat(3 - hp);
  }

  function updateText() {
    hud.textContent = t('game02.playing.hud', { dodges, hp: hearts() });
    instruction.textContent = t('game02.playing.instruction');
    obstacles.forEach(obstacle => {
      obstacle.element.textContent = t(`game02.playing.obstacles.${obstacle.textIndex}`);
    });
  }

  setScreenTextUpdater(updateText);
  updateText();

  function setLane(nextLane) {
    lane = Math.max(0, Math.min(2, nextLane));
    runner.style.top = `calc(${lane * 33.333 + 16.666}% - 35px)`;
    tone(260 + lane * 90, .04, 'square', .6);
  }
  function move(direction) { setLane(lane + direction); }
  setLane(1);

  const keyHandler = event => {
    if (event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowDown') { event.preventDefault(); move(1); }
  };
  addEventListener('keydown', keyHandler);
  const tapHandler = event => {
    const rect = road.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientY > rect.bottom) return;
    setLane(Math.floor((event.clientY - rect.top) / (rect.height / 3)));
  };
  road.addEventListener('pointerdown', tapHandler);
  cleanups.push(() => {
    active = false;
    removeEventListener('keydown', keyHandler);
    road.removeEventListener('pointerdown', tapHandler);
  });

  function spawn() {
    let obstacleLane = Math.floor(Math.random() * 3);
    if (sequence % 4 === 3) obstacleLane = (lane + 1 + Math.floor(Math.random() * 2)) % 3;
    sequence++;
    const element = document.createElement('div');
    element.className = 'obstacle';
    const obstacle = {
      element,
      textIndex: Math.floor(Math.random() * 6),
      lane: obstacleLane,
      x: road.clientWidth + 20,
      hit: false,
      passed: false
    };
    element.textContent = t(`game02.playing.obstacles.${obstacle.textIndex}`);
    element.style.top = `calc(${obstacleLane * 33.333 + 16.666}% - 23px)`;
    road.appendChild(element);
    obstacles.push(obstacle);
  }

  function rectHit(a, b) {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    return rectA.left + 8 < rectB.right && rectA.right - 8 > rectB.left && rectA.top + 8 < rectB.bottom && rectA.bottom - 8 > rectB.top;
  }

  function loop(time) {
    if (!active) return;
    if (mobileGameLite && last && time - last < 32) { requestAnimationFrame(loop); return; }
    const dt = Math.min(35, last ? time - last : 16);
    last = time;
    if (time - lastSpawn > Math.max(600, 1050 - dodges * 25)) { spawn(); lastSpawn = time; }
    for (const obstacle of obstacles) {
      obstacle.x -= .34 * dt + dodges * .005 * dt;
      obstacle.element.style.left = obstacle.x + 'px';
      if (!obstacle.hit && rectHit(runner, obstacle.element)) {
        obstacle.hit = true;
        hp--;
        obstacle.element.style.opacity = .25;
        boom();
        updateText();
        if (hp <= 0) { active = false; fail(i); return; }
      }
      if (!obstacle.passed && !obstacle.hit && obstacle.x + obstacle.element.offsetWidth < runner.offsetLeft) {
        obstacle.passed = true;
        dodges++;
        toast(t('game02.playing.dodge', { count: dodges }), 'var(--green)');
        chord([440, 660], .06, 'square', .8);
        updateText();
        if (dodges >= 12) { active = false; finish(i); return; }
      }
    }
    obstacles = obstacles.filter(obstacle => {
      if (obstacle.x < -Math.max(240, obstacle.element.offsetWidth + 30)) { obstacle.element.remove(); return false; }
      return true;
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
