'use strict';

function meeting(i) {
  stage.innerHTML = `<div class="stackCenter center"><div class="status" id="meetHud"></div><h3 id="mq"></h3><div class="meeting"><div class="face">👨‍💼<span></span></div><div class="face">👩‍💻<span></span></div><div class="face">👨‍💻<span></span></div><div class="face">😐<span></span></div></div><div class="timing"><div class="zone"></div><div class="needle" id="needle"></div></div><button class="hugeBtn" id="leave"></button><p class="muted" id="meetingInstruction"></p></div>`;
  let successes = 0;
  let active = true;
  let position = 0;
  let direction = 1;
  let last = 0;
  let currentLine = -1;
  let inChance = false;
  let localizedLines = t('game09.playing.lines');
  const needle = document.getElementById('needle');
  const question = document.getElementById('mq');
  const hud = document.getElementById('meetHud');
  const leave = document.getElementById('leave');

  function updateText() {
    localizedLines = t('game09.playing.lines');
    hud.textContent = t('game09.playing.hud', { count: successes });
    leave.textContent = t('game09.playing.leave');
    document.getElementById('meetingInstruction').textContent = t('game09.playing.instruction');
    document.querySelectorAll('.meeting .face span').forEach((role, index) => {
      role.textContent = t(`game09.playing.roles.${index}`);
    });
    if (inChance) question.textContent = t('game09.playing.chance');
    else if (currentLine >= 0) question.textContent = localizedLines[currentLine];
    else question.textContent = t('game09.playing.inProgress');
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
    inChance = position >= 42 && position <= 58;
    currentLine = Math.floor((time / 900) % 4);
    question.textContent = inChance ? t('game09.playing.chance') : localizedLines[currentLine];
    requestAnimationFrame(loop);
  }

  leave.onclick = () => {
    if (position >= 42 && position <= 58) {
      successes++;
      chord([523, 659, 784], .1, 'square', 1);
      toast(t('game09.playing.toast', { count: successes }), 'var(--green)');
      updateText();
      position = 0;
      direction = 1;
      if (successes >= 3) { active = false; finish(i); }
    } else {
      boom();
      toast(t('game09.playing.notOver'), 'var(--red)');
      position = Math.random() * 30;
      direction = 1;
    }
  };
  requestAnimationFrame(loop);
  cleanups.push(() => { active = false; });
}
