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

  const renderers = { piano: renderPiano, egov: renderEgov };
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
