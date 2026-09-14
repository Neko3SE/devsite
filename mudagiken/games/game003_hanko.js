'use strict';

function hanko(i) {
  stage.innerHTML = `<div class="approval"><div class="approvalHeader"><div><h2 class="approvalTitle" id="approvalTitle"></h2><p id="approvalRequest"></p></div><div class="approvalCount"></div></div><div class="approvalGrid" id="ag"></div><div class="approvalStampWrap"><div class="stamp" id="stamp" role="button"></div></div><p class="approvalHint" id="approvalHint"></p></div>`;
  const grid = document.getElementById('ag');
  for (let n = 0; n < 20; n++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.nameIndex = String(n);
    grid.appendChild(cell);
  }
  const cells = [...grid.children];
  const stamp = document.getElementById('stamp');
  let index = 0;
  let drag = false;
  let pointerId = null;
  cells[0].classList.add('target');

  function updateText() {
    document.getElementById('approvalTitle').textContent = t('game03.playing.documentTitle');
    document.getElementById('approvalRequest').textContent = t('game03.playing.request');
    document.querySelector('.approvalCount').textContent = t('game03.playing.approval', { count: index });
    document.getElementById('approvalHint').textContent = t('game03.playing.hint');
    stamp.textContent = t('game03.playing.stamp');
    stamp.setAttribute('aria-label', t('game03.playing.stampLabel'));
    cells.forEach(cell => {
      cell.textContent = t(`game03.playing.names.${cell.dataset.nameIndex}`);
    });
  }
  setScreenTextUpdater(updateText);
  updateText();

  function approve(cell, x, y) {
    if (!cell || cell !== cells[index]) {
      if (cell) { boom(); toast(t('game03.playing.wrongOrder'), 'var(--red)'); }
      return;
    }
    cell.classList.remove('target');
    cell.classList.add('done');
    index++;
    burst(x || cell.getBoundingClientRect().left + 30, y || cell.getBoundingClientRect().top + 30, 22);
    chord([150, 225, 300], .1, 'sine', 1);
    flash();
    toast(t('game03.playing.combo', { count: index }));
    updateText();
    if (index >= 20) {
      setTimeout(() => {
        boom();
        confetti(35);
        setTimeout(() => finish(i), 500);
      }, 350);
    } else {
      cells[index].classList.add('target');
    }
  }

  grid.addEventListener('click', event => {
    const cell = event.target.closest('.cell');
    if (cell) approve(cell, event.clientX, event.clientY);
  });
  function reset() {
    drag = false;
    pointerId = null;
    stamp.style.position = '';
    stamp.style.left = '';
    stamp.style.top = '';
    stamp.style.zIndex = '';
    stamp.style.margin = '';
  }
  stamp.addEventListener('pointerdown', event => {
    drag = true;
    pointerId = event.pointerId;
    stamp.setPointerCapture(pointerId);
    const rect = stamp.getBoundingClientRect();
    stamp.style.position = 'fixed';
    stamp.style.left = rect.left + 'px';
    stamp.style.top = rect.top + 'px';
    stamp.style.zIndex = 9999;
    stamp.style.margin = 0;
    event.preventDefault();
  });
  stamp.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== pointerId) return;
    stamp.style.left = event.clientX - 52 + 'px';
    stamp.style.top = event.clientY - 52 + 'px';
    event.preventDefault();
  });
  stamp.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== pointerId) return;
    try { stamp.releasePointerCapture(pointerId); } catch (_) {}
    stamp.style.pointerEvents = 'none';
    const element = document.elementFromPoint(event.clientX, event.clientY);
    stamp.style.pointerEvents = '';
    approve(element && element.closest('.cell'), event.clientX, event.clientY);
    reset();
    event.preventDefault();
  });
  stamp.addEventListener('pointercancel', reset);
}
