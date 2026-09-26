(() => {
  "use strict";

  const SAMPLE = {
    line1: { text: "CONTENT", x: 210, y: 330, size: 110 },
    line2: { text: "TITLE", x: 325, y: 465, size: 128 },
    description: { text: "ここに短い説明文", x: 225, y: 530, size: 44 },
    filename: "newcontent_img.png"
  };

  const clamp = (value, min, max, fallback) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  };

  const canvas = document.getElementById("og-canvas");
  const ctx = canvas.getContext("2d");
  const fields = {
    line1: document.getElementById("og-title-line1"),
    line1X: document.getElementById("og-line1-x"),
    line1Y: document.getElementById("og-line1-y"),
    line1Size: document.getElementById("og-line1-size"),
    line2: document.getElementById("og-title-line2"),
    line2X: document.getElementById("og-line2-x"),
    line2Y: document.getElementById("og-line2-y"),
    line2Size: document.getElementById("og-line2-size"),
    description: document.getElementById("og-description"),
    descriptionX: document.getElementById("og-description-x"),
    descriptionY: document.getElementById("og-description-y"),
    descriptionSize: document.getElementById("og-description-size"),
    filename: document.getElementById("og-filename"),
    safeArea: document.getElementById("og-safe-area")
  };
  const status = document.getElementById("og-status");
  const exportButton = document.getElementById("og-export");
  const resetButton = document.getElementById("og-reset");

  const baseImage = new Image();
  let baseReady = false;

  const fontStackEn = 'system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
  const fontStackJa = '"Noto Sans JP", "Yu Gothic", system-ui, sans-serif';

  const isMostlyAscii = (text) => /^[ -~\s]+$/.test(text);

  const fitText = (text, maxWidth, startSize, minSize, weight, family) => {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 2;
    }
    return size;
  };

  const makeGradient = (y1, y2) => {
    const gradient = ctx.createLinearGradient(0, y1, 0, y2);
    gradient.addColorStop(0, '#a1ffe4');
    gradient.addColorStop(0.55, '#58f0c4');
    gradient.addColorStop(1, '#1fe2b8');
    return gradient;
  };

  const drawSafeArea = () => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 36, 1060, 558);
    ctx.strokeStyle = 'rgba(103,232,146,0.55)';
    ctx.strokeRect(165, 125, 610, 340);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.84)';
    ctx.font = `700 15px ${fontStackEn}`;
    ctx.fillText('SAFE AREA', 83, 56);
    ctx.fillStyle = 'rgba(103,232,146,0.95)';
    ctx.fillText('TITLE FRAME', 178, 145);
    ctx.restore();
  };

  const getLineState = (prefix, sample, options) => {
    const textField = fields[prefix];
    const xField = fields[`${prefix}X`];
    const yField = fields[`${prefix}Y`];
    const sizeField = fields[`${prefix}Size`];
    const text = (textField.value || '').trim() || sample.text;
    const x = clamp(xField.value, 0, 1200, sample.x);
    const y = clamp(yField.value, 0, 630, sample.y);
    const requestedSize = clamp(sizeField.value, options.absoluteMin, options.absoluteMax, sample.size);
    xField.value = x;
    yField.value = y;
    sizeField.value = requestedSize;
    const family = isMostlyAscii(text) ? fontStackEn : fontStackJa;
    const size = fitText(text, options.maxWidth, requestedSize, options.minSize, options.weight, family);
    return { text, x, y, family, size, requestedSize };
  };

  const draw = () => {
    if (!baseReady) return;

    const line1 = getLineState('line1', SAMPLE.line1, {
      maxWidth: 585,
      minSize: 54,
      absoluteMin: 12,
      absoluteMax: 220,
      weight: 900
    });
    const line2 = getLineState('line2', SAMPLE.line2, {
      maxWidth: 560,
      minSize: 62,
      absoluteMin: 12,
      absoluteMax: 240,
      weight: 900
    });
    const description = getLineState('description', SAMPLE.description, {
      maxWidth: 540,
      minSize: 22,
      absoluteMin: 12,
      absoluteMax: 120,
      weight: 800
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.fillStyle = '#f2f6f5';
    ctx.font = `900 ${line1.size}px ${line1.family}`;
    ctx.fillText(line1.text, line1.x, line1.y);
    ctx.restore();

    ctx.save();
    ctx.shadowBlur = 24;
    ctx.shadowColor = 'rgba(46,234,188,0.35)';
    ctx.fillStyle = makeGradient(line2.y - 155, line2.y + 5);
    ctx.font = `900 ${line2.size}px ${line2.family}`;
    ctx.fillText(line2.text, line2.x, line2.y);
    ctx.restore();

    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.fillStyle = '#eef4f3';
    ctx.font = `800 ${description.size}px ${description.family}`;
    ctx.fillText(description.text, description.x, description.y);
    ctx.restore();

    if (fields.safeArea.checked) {
      drawSafeArea();
    }
  };

  const exportPng = () => {
    draw();
    const link = document.createElement('a');
    const filename = (fields.filename.value.trim() || SAMPLE.filename).replace(/[\/:*?"<>|]+/g, '_');
    link.download = filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    status.textContent = `PNG generated: ${link.download} / 1200×630`;
  };

  const resetSample = () => {
    fields.line1.value = SAMPLE.line1.text;
    fields.line1X.value = SAMPLE.line1.x;
    fields.line1Y.value = SAMPLE.line1.y;
    fields.line1Size.value = SAMPLE.line1.size;
    fields.line2.value = SAMPLE.line2.text;
    fields.line2X.value = SAMPLE.line2.x;
    fields.line2Y.value = SAMPLE.line2.y;
    fields.line2Size.value = SAMPLE.line2.size;
    fields.description.value = SAMPLE.description.text;
    fields.descriptionX.value = SAMPLE.description.x;
    fields.descriptionY.value = SAMPLE.description.y;
    fields.descriptionSize.value = SAMPLE.description.size;
    fields.filename.value = SAMPLE.filename;
    fields.safeArea.checked = false;
    draw();
    status.textContent = 'Sample text, positions and sizes restored.';
  };

  Object.values(fields).forEach((field) => {
    field.addEventListener('input', draw);
    field.addEventListener('change', draw);
  });
  exportButton.addEventListener('click', exportPng);
  resetButton.addEventListener('click', resetSample);

  const loadBaseImage = () => {
    if (!window.N3_OG_BASE) {
      status.textContent = 'Failed to load og-base.js';
      return;
    }

    baseImage.onload = () => {
      baseReady = true;
      status.textContent = 'Base image loaded. Ready to export.';
      draw();
    };
    baseImage.onerror = () => {
      status.textContent = 'Failed to decode base image.';
    };
    baseImage.src = window.N3_OG_BASE;
  };

  loadBaseImage();
})();
