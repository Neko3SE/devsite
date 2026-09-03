'use strict';

function incident(i) {
  stage.innerHTML = `<div class="status" id="incHud"></div><div class="status right" id="incOpenWrap"><span id="incOpen"></span></div><div class="stackCenter center"><div class="big textRed">SYSTEM INCIDENT</div><div class="muted" id="incHelp"></div></div>`;
  let done = 0;
  let sla = 100;
  let active = true;
  let boxes = [];
  let last = 0;
  let lastSpawn = 0;
  const startAt = performance.now();
  const graceMs = 5000;
  let graceSeconds = 5;

  function updateText() {
    const hud = document.getElementById('incHud');
    const open = document.getElementById('incOpen');
    const help = document.getElementById('incHelp');
    if (hud) hud.textContent = t('game04.playing.hud', { done, sla: Math.max(0, Math.floor(sla)) });
    if (open) open.textContent = t('game04.playing.open', { count: boxes.length });
    if (help) help.textContent = graceSeconds > 0 ? t('game04.playing.grace', { seconds: graceSeconds.toFixed(1) }) : t('game04.playing.help');
    boxes.forEach(box => { box.element.textContent = t(`game04.playing.incidents.${box.textIndex}`); });
  }
  setScreenTextUpdater(updateText);
  updateText();

  function spawn() {
    if (boxes.length >= 7) return;
    const element = document.createElement('button');
    element.className = 'alertBox';
    const box = { element, textIndex: Math.floor(Math.random() * 7) };
    element.textContent = t(`game04.playing.incidents.${box.textIndex}`);
    element.style.left = 10 + Math.random() * Math.max(20, stage.clientWidth - 220) + 'px';
    element.style.top = 55 + Math.random() * Math.max(40, stage.clientHeight - 140) + 'px';
    element.onclick = event => {
      if (!active) return;
      done++;
      boxes = boxes.filter(item => item !== box);
      burst(event.clientX, event.clientY, 16);
      element.remove();
      chord([620, 930], .055, 'square', 1);
      toast(t('game04.playing.recover', { count: done }), 'var(--green)');
      if (done >= 25) { active = false; finish(i); return; }
      updateText();
    };
    stage.appendChild(element);
    boxes.push(box);
    updateText();
  }

  function loop(time) {
    if (!active) return;
    if (mobileGameLite && last && time - last < 32) { requestAnimationFrame(loop); return; }
    const dt = Math.min(35, last ? time - last : 16);
    last = time;
    if (time - lastSpawn > Math.max(380, 900 - done * 12)) { spawn(); lastSpawn = time; }
    const graceLeft = Math.max(0, graceMs - (time - startAt));
    graceSeconds = graceLeft / 1000;
    if (graceLeft <= 0) {
      sla -= boxes.length * .0032 * dt;
      if (boxes.length >= 7) sla -= .02 * dt;
    }
    updateText();
    if (sla <= 0) { active = false; fail(i); return; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  cleanups.push(() => { active = false; });
}
