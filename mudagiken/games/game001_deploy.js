'use strict';

function deploy(i) {
  let step = 0;
  let rollback = false;
  let deployed = false;
  let rb = 0;
  stage.innerHTML = `<div class="stackCenter center"><div class="status">RISK LEVEL <span id="risk">01</span> / 08</div><div class="big textRed" id="deployMsg"></div><button class="hugeBtn pulse" id="deployBtn"></button><div id="deploySub" class="muted spacingTop16"></div></div>`;
  const button = document.getElementById('deployBtn');
  const message = document.getElementById('deployMsg');
  const sub = document.getElementById('deploySub');
  const risk = document.getElementById('risk');

  function updateText() {
    risk.textContent = String(Math.min(8, step + 1)).padStart(2, '0');
    if (rollback) {
      button.textContent = t('game01.playing.rollback', { count: rb });
      message.textContent = t('game01.playing.monitoring');
      sub.textContent = t('game01.playing.rollbackHelp');
    } else if (deployed) {
      button.textContent = t('game01.playing.warnings.7');
      message.textContent = t('game01.playing.deploySuccess');
      sub.textContent = t('game01.playing.thought');
    } else {
      button.textContent = t(`game01.playing.warnings.${step}`);
      message.textContent = step === 0 ? t('game01.playing.doNotPress') : t(`game01.playing.warningHeadings.${step - 1}`);
      sub.textContent = step === 0 ? t('game01.playing.toldNotTo') : t('game01.playing.passed', { count: step });
    }
  }

  setScreenTextUpdater(updateText);
  updateText();
  button.onclick = event => {
    if (rollback) {
      rb++;
      chord([180, 270, 360], .08, 'square', 1);
      burst(event.clientX || stage.clientWidth / 2, event.clientY || stage.clientHeight / 2, 18);
      updateText();
      if (rb >= 6) {
        button.disabled = true;
        setTimeout(() => finish(i), 450);
      }
      return;
    }
    step++;
    tone(150 + step * 55, .11, 'sawtooth', 1);
    flash();
    toast(step < 8 ? t('game01.playing.warningToast', { count: step }) : t('game01.playing.deploy'), step < 6 ? 'var(--yellow)' : 'var(--red)');
    if (step < 8) {
      updateText();
    } else {
      boom();
      deployed = true;
      button.disabled = true;
      updateText();
      setTimeout(() => {
        rollback = true;
        deployed = false;
        button.disabled = false;
        button.className = 'hugeBtn gold pulse';
        updateText();
      }, 800);
    }
  };
}
