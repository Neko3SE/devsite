'use strict';

function excel(i) {
  const width = 12;
  const height = 8;
  const pattern = new Set(['2,1', '3,1', '8,1', '9,1', '1,2', '2,2', '3,2', '4,2', '7,2', '8,2', '9,2', '10,2', '1,3', '4,3', '7,3', '10,3', '1,4', '2,4', '3,4', '4,4', '5,4', '6,4', '7,4', '8,4', '9,4', '10,4', '2,5', '3,5', '4,5', '7,5', '8,5', '9,5', '3,6', '4,6', '7,6', '8,6']);
  stage.innerHTML = `<div class="stackCenter center"><div class="status" id="exHud"></div><h3 id="excelHeading"></h3><div class="excel" id="ex"></div><p class="muted" id="excelHint"></p></div>`;
  const grid = document.getElementById('ex');
  const buttons = [];
  let ok = 0;
  let wrong = 0;

  function updateText() {
    document.getElementById('exHud').textContent = t('game06.playing.hud', { ok, total: pattern.size, wrong });
    document.getElementById('excelHeading').textContent = t('game06.playing.heading');
    document.getElementById('excelHint').textContent = t('game06.playing.hint');
    buttons.forEach(button => {
      button.element.setAttribute('aria-label', t('game06.playing.cellLabel', { x: button.x + 1, y: button.y + 1 }));
    });
  }
  setScreenTextUpdater(updateText);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const button = document.createElement('button');
      const key = `${x},${y}`;
      const required = pattern.has(key);
      if (required) button.classList.add('req');
      buttons.push({ element: button, x, y });
      button.onclick = event => {
        if (button.classList.contains('on') || button.classList.contains('wrong')) return;
        if (required) {
          button.classList.add('on');
          ok++;
          burst(event.clientX, event.clientY, 8);
          tone(380 + ok * 8, .04, 'square', .8);
          toast(t('game06.playing.cell', { count: ok, total: pattern.size }), 'var(--green)');
        } else {
          button.classList.add('wrong');
          wrong++;
          boom();
        }
        updateText();
        if (wrong >= 5) fail(i);
        else if (ok >= pattern.size) finish(i);
      };
      grid.appendChild(button);
    }
  }
  updateText();
}
