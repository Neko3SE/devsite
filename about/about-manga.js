(() => {
  "use strict";
  const guide = document.getElementById("manga-guide");
  if (!guide) return;

  const paths = { ja: "assets/neko3se-lab-manga-ja.js", en: "assets/neko3se-lab-manga-en.js" };
  const dataKeys = { ja: "N3_MANGA_JA", en: "N3_MANGA_EN" };
  const alt = { ja: "Neko3SE LABの活動を紹介する日本語マンガ", en: "English manga guide introducing Neko3SE LAB" };
  const cache = new Map();
  const status = document.getElementById("manga-status");
  const pair = guide.querySelector(".n3-manga-pair");
  const openButtons = Array.from(guide.querySelectorAll(".n3-manga-open"));
  const images = Object.fromEntries(Array.from(guide.querySelectorAll("[data-manga-image]")).map(img => [img.dataset.mangaImage, img]));
  const lightbox = document.getElementById("manga-lightbox");
  const lightboxImage = document.getElementById("manga-lightbox-image");
  const closeButton = document.getElementById("manga-close");
  let lastFocus = null;

  function setStatus(message, retry = false) {
    status.replaceChildren();
    const text = document.createElement("span");
    text.textContent = message;
    status.appendChild(text);
    if (retry) {
      status.appendChild(document.createElement("br"));
      const button = document.createElement("button");
      button.type = "button";
      button.className = "n3-manga-retry";
      button.textContent = "RETRY";
      button.addEventListener("click", loadBoth);
      status.appendChild(button);
    }
    status.hidden = false;
  }

  function base64ToBlobUrl(base64) {
    const clean = base64.replace(/\s/g, "");
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: "image/webp" }));
  }

  function loadScript(lang) {
    const key = dataKeys[lang];
    if (window[key]) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = paths[lang];
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Script load failed: ${paths[lang]}`));
      document.head.appendChild(script);
    });
  }

  async function loadBoth() {
    pair.classList.remove("is-ready");
    openButtons.forEach(button => button.setAttribute("aria-hidden", "true"));
    setStatus("マンガを読み込んでいます… / Loading manga…");
    try {
      await Promise.all([loadScript("ja"), loadScript("en")]);
      for (const lang of ["ja", "en"]) {
        const key = dataKeys[lang];
        if (!window[key]) throw new Error(`Manga data not found: ${key}`);
        let url = cache.get(lang);
        if (!url) {
          url = base64ToBlobUrl(window[key]);
          cache.set(lang, url);
        }
        images[lang].src = url;
        images[lang].alt = alt[lang];
      }
      await Promise.all([images.ja.decode().catch(() => {}), images.en.decode().catch(() => {})]);
      status.hidden = true;
      pair.classList.add("is-ready");
      openButtons.forEach(button => {
        button.removeAttribute("aria-hidden");
        button.setAttribute("aria-label", button.dataset.mangaLang === "ja" ? "日本語マンガを拡大表示" : "Open English manga in large view");
      });
    } catch (error) {
      console.error("MANGA GUIDE load failed:", error);
      setStatus("MANGA GUIDEを読み込めませんでした。 / Could not load MANGA GUIDE.", true);
    }
  }

  function openLightbox(lang, trigger) {
    const image = images[lang];
    if (!image || !image.src) return;
    lastFocus = trigger;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add("n3-manga-modal-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("n3-manga-modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  openButtons.forEach(button => button.addEventListener("click", () => openLightbox(button.dataset.mangaLang, button)));
  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !lightbox.hidden) closeLightbox(); });

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect();
      loadBoth();
    }
  }, { rootMargin: "300px 0px" });
  observer.observe(guide);

  window.addEventListener("pagehide", () => cache.forEach(url => URL.revokeObjectURL(url)), { once: true });
})();
