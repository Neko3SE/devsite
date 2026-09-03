'use strict';

function bugTemple(i) {
  stage.innerHTML = `<div class="status" id="bugHud"></div><div class="status right" id="bugOutput"></div><div id="bugExit" class="bugExit"></div><div class="stackCenter center"><div class="bugTempleIcon">🙏</div><div class="big bugTempleTitle" id="bugTitle"></div><div class="muted" id="bugInstruction"></div><div class="muted bugEscapeHint" id="bugHint"></div><div id="incense" class="incenseLayer"></div></div>`;
  let done = 0;
  let escaped = 0;
  let active = true;
  let bugs = [];
  let lastSpawn = 0;
  let lastLoop = 0;

  function updateText() {
    const hud = document.getElementById('bugHud');
    if (hud) hud.textContent = t('game08.playing.hud', { done, escaped });
    const output = document.getElementById('bugOutput');
    if (output) output.textContent = t('game08.playing.output');
    const exit = document.getElementById('bugExit');
    if (exit) exit.textContent = t('game08.playing.production');
    const titleElement = document.getElementById('bugTitle');
    if (titleElement) titleElement.textContent = t('game08.title');
    const instruction = document.getElementById('bugInstruction');
    if (instruction) instruction.textContent = t('game08.playing.instruction');
    const hint = document.getElementById('bugHint');
    if (hint) hint.textContent = t('game08.playing.hint');
    bugs.forEach(bug => {
      if (!bug.hit) bug.warning.textContent = t('game08.playing.escaping');
    });
  }
  setScreenTextUpdater(updateText);
  updateText();

  function incensePuff(x, y) {
    for (let k = 0; k < (mobileGameLite ? 2 : 6); k++) {
      const puff = document.createElement('i');
      puff.className = 'incensePuff';
      puff.setAttribute('aria-hidden', 'true');
      puff.style.left = x + 'px';
      puff.style.top = y + 'px';
      puff.style.width = 10 + Math.random() * 18 + 'px';
      puff.style.height = 10 + Math.random() * 18 + 'px';
      puff.style.filter = `blur(${4 + Math.random() * 5}px)`;
      stage.appendChild(puff);
      requestAnimationFrame(() => {
        puff.style.transform = `translate(${(Math.random() - .5) * 70}px,${-90 - Math.random() * 100}px) scale(${1.8 + Math.random() * 2})`;
        puff.style.opacity = '0';
      });
      setTimeout(() => puff.remove(), 2500);
    }
  }

  function spawn() {
    const element = document.createElement('div');
    element.className = 'bug';
    element.style.left = 20 + Math.random() * Math.max(70, stage.clientWidth - 230) + 'px';
    element.style.top = 90 + Math.random() * Math.max(100, stage.clientHeight - 220) + 'px';
    const icon = document.createElement('span');
    icon.textContent = '🐛';
    const warning = document.createElement('span');
    warning.textContent = t('game08.playing.escaping');
    warning.className = 'bugWarning';
    element.append(icon, warning);
    const now = performance.now();
    const bug = { element, icon, warning, birth: now, hit: false, escaping: false, nextMove: now + 2600 + Math.random() * 1600, escapeAt: now + 12000 + Math.random() * 4000 };
    element.addEventListener('pointerdown', event => {
      if (bug.hit || !active) return;
      bug.hit = true;
      done++;
      burst(event.clientX, event.clientY, 36);
      incensePuff(event.clientX - stage.getBoundingClientRect().left, event.clientY - stage.getBoundingClientRect().top);
      chord([110, 165, 220], .18, 'sine', 1);
      warning.style.display = 'none';
      icon.textContent = '✨';
      element.style.animation = 'none';
      element.style.filter = mobileGameLite ? 'none' : 'drop-shadow(0 0 28px #ffe45e)';
      element.style.transform = 'scale(1.9) rotate(180deg)';
      toast(t(bug.escaping ? 'game08.playing.prevented' : 'game08.playing.memorialized', { done }), 'var(--yellow)');
      setTimeout(() => element.remove(), 300);
      if (done >= 15) { active = false; finish(i); }
      updateText();
    });
    stage.appendChild(element);
    bugs.push(bug);
  }

  function startEscape(bug) {
    if (bug.escaping || bug.hit) return;
    bug.escaping = true;
    bug.warning.style.display = 'block';
    bug.element.style.animation = 'none';
    bug.element.style.filter = mobileGameLite ? 'none' : 'drop-shadow(0 0 15px #ff3659) drop-shadow(0 0 38px #ff3659) saturate(1.8)';
    bug.element.style.transition = 'left 6.5s linear,top .8s ease,filter .2s,transform .2s';
    bug.element.style.transform = 'scale(1.18) rotate(-8deg)';
    toast(t('game08.playing.escapeStart'), 'var(--red)');
    chord([130, 104, 82], .16, 'sawtooth', .72);
    const exit = document.getElementById('bugExit');
    const exitRect = exit.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const targetLeft = Math.max(0, exitRect.left - stageRect.left + 22);
    bug.element.style.top = Math.max(82, Math.min(stage.clientHeight - 90, parseFloat(bug.element.style.top) || 120)) + 'px';
    requestAnimationFrame(() => { if (!bug.hit) bug.element.style.left = targetLeft + 'px'; });
  }

  function registerEscape(bug) {
    if (bug.hit) return;
    bug.hit = true;
    bug.element.remove();
    escaped++;
    boom();
    toast(t('game08.playing.escaped', { escaped }), 'var(--red)');
    chord([92, 73, 55], .28, 'sawtooth', .8);
    updateText();
    if (escaped >= 5) { active = false; fail(i); }
  }

  function loop(time) {
    if (!active) return;
    if (mobileGameLite && lastLoop && time - lastLoop < 32) { requestAnimationFrame(loop); return; }
    lastLoop = time;
    if (time - lastSpawn > 1800) { spawn(); lastSpawn = time; }
    const exit = document.getElementById('bugExit');
    const exitRect = exit ? exit.getBoundingClientRect() : null;
    for (const bug of bugs) {
      if (bug.hit) continue;
      if (!bug.escaping && time >= bug.escapeAt) { startEscape(bug); continue; }
      if (!bug.escaping && time > bug.nextMove) {
        bug.nextMove = time + 3800 + Math.random() * 2200;
        bug.element.style.left = 18 + Math.random() * Math.max(70, stage.clientWidth - 230) + 'px';
        bug.element.style.top = 86 + Math.random() * Math.max(100, stage.clientHeight - 210) + 'px';
      }
      if (bug.escaping && exitRect) {
        const rect = bug.element.getBoundingClientRect();
        const overlap = rect.right >= exitRect.left && rect.left <= exitRect.right && rect.bottom >= exitRect.top && rect.top <= exitRect.bottom;
        if (overlap) { registerEscape(bug); if (!active) return; }
      }
    }
    bugs = bugs.filter(bug => !bug.hit || document.body.contains(bug.element));
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  cleanups.push(() => { active = false; bugs.forEach(bug => bug.element.remove()); });
}
