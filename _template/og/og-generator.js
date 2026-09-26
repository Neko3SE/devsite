(() => {
  "use strict";

  const canvas = document.getElementById("og-canvas");
  const ctx = canvas.getContext("2d");
  const fields = {
    title: document.getElementById("og-title"),
    subtitle: document.getElementById("og-subtitle"),
    category: document.getElementById("og-category"),
    keyword: document.getElementById("og-keyword"),
    filename: document.getElementById("og-filename")
  };
  const status = document.getElementById("og-status");

  const fitText = (text, maxWidth, startSize, minSize, weight = 800) => {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", "Noto Sans JP", sans-serif`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 2;
    }
    return size;
  };

  const draw = () => {
    const title = fields.title.value.trim() || "NEW CONTENT LAB";
    const subtitle = fields.subtitle.value.trim() || "新しい実験の短い説明";
    const category = fields.category.value.trim() || "AI / WEB / IDEA / PLAY";
    const keyword = fields.keyword.value.trim() || "EXPERIMENT";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#081014";
    ctx.fillRect(0, 0, 1200, 630);

    ctx.strokeStyle = "rgba(103,232,146,0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1200; x += 42) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 630); ctx.stroke(); }
    for (let y = 0; y <= 630; y += 42) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke(); }

    const glow = ctx.createRadialGradient(950, 300, 0, 950, 300, 360);
    glow.addColorStop(0, "rgba(103,232,146,0.18)");
    glow.addColorStop(1, "rgba(103,232,146,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(550, 0, 650, 630);

    ctx.fillStyle = "#67e892";
    ctx.font = '800 24px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText("Neko3SE LAB", 72, 76);

    ctx.fillStyle = "#93aaa5";
    ctx.font = '750 16px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(category, 72, 112);

    const titleSize = fitText(title, 730, 78, 44, 900);
    ctx.fillStyle = "#edf6f3";
    ctx.font = `900 ${titleSize}px system-ui, -apple-system, "Segoe UI", "Noto Sans JP", sans-serif`;
    ctx.fillText(title, 72, 272);

    const subtitleSize = fitText(subtitle, 740, 30, 20, 600);
    ctx.fillStyle = "#cbd9d5";
    ctx.font = `600 ${subtitleSize}px system-ui, -apple-system, "Segoe UI", "Noto Sans JP", sans-serif`;
    ctx.fillText(subtitle, 74, 330);

    ctx.strokeStyle = "rgba(103,232,146,0.72)";
    ctx.lineWidth = 2;
    ctx.strokeRect(854, 160, 250, 250);
    ctx.strokeRect(880, 186, 198, 198);
    ctx.beginPath(); ctx.moveTo(979, 150); ctx.lineTo(979, 420); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(844, 285); ctx.lineTo(1114, 285); ctx.stroke();
    ctx.beginPath(); ctx.arc(979, 285, 58, 0, Math.PI * 2); ctx.stroke();

    const keywordSize = fitText(keyword, 210, 28, 16, 900);
    ctx.fillStyle = "#67e892";
    ctx.textAlign = "center";
    ctx.font = `900 ${keywordSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.fillText(keyword, 979, 294);
    ctx.textAlign = "left";

    ctx.fillStyle = "#93aaa5";
    ctx.font = '750 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.fillText("AI / WEB / IDEA / PLAY", 72, 552);
    ctx.fillText("neko3se.com", 982, 552);

    ctx.strokeStyle = "rgba(103,232,146,0.34)";
    ctx.beginPath(); ctx.moveTo(72, 510); ctx.lineTo(1128, 510); ctx.stroke();
  };

  Object.values(fields).forEach((field) => field.addEventListener("input", draw));
  document.getElementById("og-export").addEventListener("click", () => {
    draw();
    const link = document.createElement("a");
    const filename = (fields.filename.value.trim() || "og_image.png").replace(/[\\/:*?"<>|]+/g, "_");
    link.download = filename.toLowerCase().endsWith(".png") ? filename : `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    status.textContent = `PNG generated: ${link.download} / 1200×630`;
  });

  draw();
})();
