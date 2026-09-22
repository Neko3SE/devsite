(() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const make = (name, attrs = {}) => {
    const node = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const add = (parent, name, attrs = {}) => parent.appendChild(make(name, attrs));

  function baseSvg(kind) {
    const svg = make("svg", { viewBox: "0 0 640 246", class: `n3-thumb__svg n3-thumb--${kind}`, focusable: "false" });
    const defs = add(svg, "defs");
    const pattern = add(defs, "pattern", { id: `n3-grid-${kind}`, width: "40", height: "40", patternUnits: "userSpaceOnUse" });
    add(pattern, "path", { d: "M 40 0 L 0 0 0 40", fill: "none", stroke: "#39515b", "stroke-width": "1" });
    add(svg, "rect", { width: "640", height: "246", rx: "18", fill: "#0d141c" });
    add(svg, "rect", { width: "640", height: "246", rx: "18", fill: `url(#n3-grid-${kind})`, class: "n3-thumb__grid" });
    add(svg, "rect", { x: "16", y: "16", width: "608", height: "214", rx: "14", fill: "none", stroke: "#31434d", "stroke-width": "2" });
    ["M28 48V28H48", "M592 28H612V48", "M28 198V218H48", "M592 218H612V198"].forEach(d => add(svg, "path", { d, class: "n3-thumb__line", opacity: ".55" }));
    return svg;
  }

  function renderPiano() {
    const svg = baseSvg("piano");
    const label = add(svg, "text", { x: "48", y: "42", class: "n3-thumb__label" }); label.textContent = "AUDIO / KEYS";
    add(svg, "path", { d: "M70 82 C92 82 92 62 114 62 S136 100 158 100 S180 54 202 54 S224 96 246 96 S268 66 290 66 S312 98 334 98 S356 58 378 58 S400 92 422 92 S444 68 466 68 S488 82 510 82 S532 82 570 82", class: "n3-thumb__line n3-piano-wave n3-anim", stroke: "#7aa0a7", "stroke-width": "4" });
    const x0=62, y=116, w=64, h=94;
    for (let i=0;i<8;i++) {
      const cls = i===0 ? " n3-piano-key-c1 n3-anim" : i===2 ? " n3-piano-key-e n3-anim" : i===4 ? " n3-piano-key-g n3-anim" : i===7 ? " n3-piano-key-c2 n3-anim" : "";
      add(svg, "rect", { x:String(x0+i*w), y:String(y), width:String(w-3), height:String(h), rx:"5", fill:"#d6dde0", stroke:"#81949d", "stroke-width":"2", class:cls.trim() });
    }
    [0,1,3,4,5].forEach(i => add(svg, "rect", { x:String(x0+44+i*w), y:String(y), width:"38", height:"56", rx:"4", fill:"#172129", stroke:"#60747d", "stroke-width":"2" }));
    return svg;
  }

  function renderEgov() {
    const svg = baseSvg("egov");
    const label = add(svg, "text", { x: "48", y: "42", class: "n3-thumb__label" }); label.textContent = "LAW / SEARCH";
    add(svg, "rect", { x:"154", y:"48", width:"294", height:"166", rx:"10", fill:"#15212a", stroke:"#66818a", "stroke-width":"3" });
    add(svg, "path", { d:"M390 48v44h58", fill:"#1d2c35", stroke:"#66818a", "stroke-width":"2" });
    [82,108,134,160,186].forEach((yy,i) => add(svg, "rect", { x:"188", y:String(yy), width:i===4?"170":"224", height:"10", rx:"5", fill:"#526b74", opacity:i===3?".28":".65", class:i===3?"n3-egov-hit n3-anim":"" }));
    const lens = add(svg, "g", { class:"n3-egov-lens n3-anim" });
    add(lens, "circle", { cx:"476", cy:"132", r:"34", fill:"rgba(13,20,28,.72)", stroke:"#9ac45a", "stroke-width":"6", class:"n3-thumb__glow" });
    add(lens, "path", { d:"M500 156l42 42", stroke:"#9ac45a", "stroke-width":"10", "stroke-linecap":"round", class:"n3-thumb__glow" });
    add(lens, "path", { d:"M460 132h32", stroke:"#9ac45a", "stroke-width":"4", "stroke-linecap":"round" });
    return svg;
  }

  function text(svg, x, y, value, cls="n3-thumb__label") {
    const t = add(svg, "text", { x:String(x), y:String(y), class:cls }); t.textContent=value; return t;
  }

  function renderMudagiken() {
    const svg=baseSvg("mudagiken"); text(svg,48,42,"LAB / NONPRODUCTIVE");
    add(svg,"rect",{x:"70",y:"62",width:"330",height:"136",rx:"10",fill:"#121e27",stroke:"#66818a","stroke-width":"3"});
    add(svg,"rect",{x:"88",y:"82",width:"294",height:"92",rx:"5",fill:"#091117",stroke:"#334852","stroke-width":"2"});
    add(svg,"path",{d:"M108 108l18 14-18 14 M142 136h52",class:"n3-thumb__line n3-muda-glitch n3-anim",stroke:"#9ac45a"});
    add(svg,"path",{d:"M108 154h132",class:"n3-thumb__line",opacity:".55"});
    const g=add(svg,"g",{class:"n3-muda-gear n3-anim"});
    add(g,"circle",{cx:"493",cy:"131",r:"45",fill:"#182630",stroke:"#78939c","stroke-width":"7","stroke-dasharray":"12 8"});
    add(g,"circle",{cx:"493",cy:"131",r:"18",fill:"#0d141c",stroke:"#9ac45a","stroke-width":"5"});
    const warn=add(svg,"g",{class:"n3-muda-warning n3-anim"});
    add(warn,"path",{d:"M566 70l28 48h-56z",fill:"none",stroke:"#9ac45a","stroke-width":"5"}); text(warn,562,108,"!","n3-thumb__label");
    return svg;
  }

  function renderPrompt() {
    const svg=baseSvg("prompt"); text(svg,48,42,"PROMPT / GENERATE");
    add(svg,"rect",{x:"70",y:"62",width:"500",height:"138",rx:"12",fill:"#101b23",stroke:"#66818a","stroke-width":"3"});
    text(svg,96,100,"> AI_","n3-thumb__label");
    add(svg,"path",{d:"M98 126H430 M98 151H515 M98 176H370",fill:"none",stroke:"#9ac45a","stroke-width":"7","stroke-linecap":"round",class:"n3-prompt-text n3-anim"});
    add(svg,"rect",{x:"526",y:"164",width:"10",height:"18",rx:"2",fill:"#9ac45a",class:"n3-prompt-cursor n3-anim n3-thumb__glow"});
    return svg;
  }

  function renderImagePrompt() {
    const svg=baseSvg("imageprompt"); text(svg,48,42,"IMAGE / PROMPT");
    add(svg,"rect",{x:"100",y:"58",width:"440",height:"152",rx:"12",fill:"#111d25",stroke:"#66818a","stroke-width":"3"});
    const result=add(svg,"g",{class:"n3-image-result n3-anim"});
    add(result,"circle",{cx:"320",cy:"118",r:"28",fill:"#9ac45a",opacity:".38"});
    add(result,"path",{d:"M130 188l94-70 72 48 66-66 148 88z",fill:"#28424a",stroke:"#7da0a8","stroke-width":"3"});
    add(result,"path",{d:"M130 188l94-70 72 48",fill:"none",stroke:"#9ac45a","stroke-width":"4"});
    const scan=add(svg,"g",{class:"n3-image-scan n3-anim"});
    add(scan,"rect",{x:"310",y:"68",width:"5",height:"132",rx:"2",fill:"#9ac45a",class:"n3-thumb__glow"});
    add(scan,"rect",{x:"294",y:"68",width:"38",height:"132",fill:"#9ac45a",opacity:".08"});
    return svg;
  }

  function renderGosenfu() {
    const svg=baseSvg("gosenfu"); text(svg,48,42,"STAFF / SOLFEGE");
    [88,112,136,160,184].forEach(y=>add(svg,"path",{d:`M80 ${y}H560`,stroke:"#607b84","stroke-width":"3"}));
    add(svg,"path",{d:"M120 82v108",stroke:"#607b84","stroke-width":"4"});
    const n=add(svg,"g",{class:"n3-note n3-note-glow n3-anim"});
    add(n,"ellipse",{cx:"320",cy:"148",rx:"18",ry:"13",fill:"#9ac45a",transform:"rotate(-18 320 148)"});
    add(n,"path",{d:"M335 144v-66",stroke:"#9ac45a","stroke-width":"6","stroke-linecap":"round"});
    add(svg,"circle",{cx:"320",cy:"148",r:"35",fill:"none",stroke:"#9ac45a","stroke-width":"2",opacity:".18",class:"n3-note-glow n3-anim"});
    return svg;
  }

  function renderVoice() {
    const svg=baseSvg("voice"); text(svg,48,42,"VOICE / TRANSFORM");
    add(svg,"rect",{x:"66",y:"78",width:"72",height:"92",rx:"32",fill:"#182630",stroke:"#78939c","stroke-width":"4"});
    add(svg,"path",{d:"M102 170v26 M78 196h48",class:"n3-thumb__line"});
    add(svg,"path",{d:"M168 135c18-50 36 50 54 0s36 50 54 0",fill:"none",stroke:"#7b969f","stroke-width":"5",class:"n3-voice-input n3-anim"});
    add(svg,"path",{d:"M300 135h54",stroke:"#9ac45a","stroke-width":"5","stroke-linecap":"round",class:"n3-voice-arrow n3-anim"});
    add(svg,"path",{d:"M342 121l18 14-18 14",fill:"none",stroke:"#9ac45a","stroke-width":"5",class:"n3-voice-arrow n3-anim"});
    add(svg,"path",{d:"M390 135c12-24 24 24 36 0s24-24 36 0 24 24 36 0 24-24 36 0 24 24 36 0",fill:"none",stroke:"#9ac45a","stroke-width":"5",class:"n3-voice-output n3-anim"});
    return svg;
  }

  function renderTuner() {
    const svg=baseSvg("tuner"); text(svg,48,42,"TUNER / A4 440.0");
    add(svg,"path",{d:"M150 190A170 170 0 0 1 490 190",fill:"none",stroke:"#536d76","stroke-width":"12","stroke-linecap":"round"});
    [-60,-40,-20,0,20,40,60].forEach((a,i)=>{
      const rad=(a-90)*Math.PI/180, r1=146, r2=i===3?174:164;
      const x1=320+Math.cos(rad)*r1,y1=190+Math.sin(rad)*r1,x2=320+Math.cos(rad)*r2,y2=190+Math.sin(rad)*r2;
      add(svg,"path",{d:`M${x1} ${y1}L${x2} ${y2}`,stroke:i===3?"#9ac45a":"#78939c","stroke-width":i===3?"6":"4","stroke-linecap":"round"});
    });
    add(svg,"path",{d:"M320 190L320 78",stroke:"#9ac45a","stroke-width":"6","stroke-linecap":"round",class:"n3-tuner-needle n3-anim n3-thumb__glow"});
    add(svg,"circle",{cx:"320",cy:"190",r:"13",fill:"#9ac45a"});
    const c=add(svg,"g",{class:"n3-tuner-center n3-anim"}); add(c,"circle",{cx:"320",cy:"78",r:"17",fill:"none",stroke:"#9ac45a","stroke-width":"4"}); text(c,285,224,"IN TUNE","n3-thumb__label");
    return svg;
  }

  const renderers = { mudagiken: renderMudagiken, egov: renderEgov, prompt: renderPrompt, imageprompt: renderImagePrompt, piano: renderPiano, gosenfu: renderGosenfu, voice: renderVoice, tuner: renderTuner };
  const targets = Array.from(document.querySelectorAll(".n3-thumb[data-n3-thumb]"));
  const ready = [];
  targets.forEach(target => {
    const render = renderers[target.dataset.n3Thumb];
    if (!render) return;
    try {
      target.appendChild(render());
      target.classList.add("n3-thumb--ready");
      ready.push(target);
    } catch (_) {
      target.replaceChildren();
      target.classList.remove("n3-thumb--ready");
    }
  });

  if (!("IntersectionObserver" in window)) {
    ready.forEach(target => target.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("is-visible", entry.isIntersecting));
  }, { threshold: 0.2 });
  ready.forEach(target => observer.observe(target));
})();
