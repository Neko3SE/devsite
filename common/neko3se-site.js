(() => {
  "use strict";

  const body = document.body;
  if (!body) return;

  const pageId = body.dataset.n3Page || "top";
  const root = (body.dataset.n3Root || ".").replace(/\/+$/, "");
  const pages = [
    { id: "top", label: "TOP🐈", path: "index.html" },
    { id: "mudagiken", label: "無駄技研。", path: "mudagiken/mudagiken.html" },
    { id: "gosenfu", label: "五線譜ドレミclip", path: "gosenfu/gosenfu_doremi.html" },
    { id: "piano", label: "PIANO EMULATOR", path: "pianoemu/piano_emulator.html" },
    { id: "promptgen", label: "PROMPT GENERATOR", path: "promptgen/prompt_generator.html" },
    { id: "egov", label: "e-Gov 法令検索 Viewer β", path: "egov/egov-index.html" },
    { id: "voicechanger", label: "VOICE CHANGER LAB β", path: "voicechanger/index.html" }
  ];

  const current = pages.find((page) => page.id === pageId) || pages[0];
  const href = (path) => `${root || "."}/${path}`;
  const create = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const header = document.getElementById("n3-site-header");
  let contentsButton = null;

  if (header) {
    header.className = "n3-site-header";

    const inner = create("div", "n3-site-header__inner");
    const brand = create("a", "n3-site-brand", "Neko3SE LAB");
    brand.href = href("index.html");
    brand.setAttribute("aria-label", "Neko3SE LAB トップへ");

    const separator = create("span", "n3-site-separator", "/");
    separator.setAttribute("aria-hidden", "true");

    const currentPage = create("span", "n3-current-page", current.label);
    currentPage.title = current.label;

    contentsButton = create("button", "n3-contents-button", "CONTENTS ☰");
    contentsButton.type = "button";
    contentsButton.id = "n3-contents-button";
    contentsButton.setAttribute("aria-expanded", "false");
    contentsButton.setAttribute("aria-controls", "n3-contents-drawer");
    contentsButton.setAttribute("aria-label", "コンテンツ一覧を開く");

    inner.append(brand, separator, currentPage, contentsButton);
    header.replaceChildren(inner);
  }

  const overlay = create("div", "n3-drawer-overlay");
  overlay.id = "n3-drawer-overlay";
  overlay.setAttribute("aria-hidden", "true");

  const drawer = create("aside", "n3-drawer");
  drawer.id = "n3-contents-drawer";
  drawer.setAttribute("aria-label", "Neko3SE LAB コンテンツ一覧");
  drawer.setAttribute("aria-hidden", "true");

  const drawerHead = create("div", "n3-drawer__head");
  const drawerTitle = create("h2", "n3-drawer__title", "CONTENTS");
  const closeButton = create("button", "n3-drawer-close", "×");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "コンテンツ一覧を閉じる");
  drawerHead.append(drawerTitle, closeButton);

  const nav = create("nav", "n3-drawer-nav");
  nav.setAttribute("aria-label", "サイト内ナビゲーション");
  pages.forEach((page) => {
    const link = create("a", "n3-drawer-link", page.label);
    link.href = href(page.path);
    if (page.id === pageId) link.setAttribute("aria-current", "page");
    nav.append(link);
  });

  drawer.append(drawerHead, nav);
  body.append(overlay, drawer);

  const footer = document.getElementById("n3-site-footer");
  if (footer) {
    footer.className = "n3-site-footer";

    const inner = create("div", "n3-site-footer__inner");
    const brandLine = create("p", "n3-site-footer__brand");
    const brandLink = create("a", null, "Neko3SE LAB");
    brandLink.href = href("index.html");
    brandLine.append(brandLink, document.createTextNode(" / on GitHub"));

    const links = create("nav", "n3-site-footer__links");
    links.setAttribute("aria-label", "サイト情報");
    const readme = create("a", null, "README.md");
    readme.href = href("README.md");
    readme.target = "_blank";
    readme.rel = "noopener noreferrer";
    const license = create("a", null, "LICENSE");
    license.href = href("LICENSE.txt");
    license.target = "_blank";
    license.rel = "noopener noreferrer";
    links.append(readme, license);

    const copyright = create("p", "n3-site-footer__copyright", "©2026 Neko3SE.");
    inner.append(brandLine, links, copyright);
    footer.replaceChildren(inner);
  }

  let open = false;
  let previousOverflow = "";
  let previousPaddingRight = "";

  const getFocusable = () => Array.from(drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));

  const openDrawer = () => {
    if (open) return;
    open = true;
    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    overlay.classList.add("is-open");
    drawer.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    drawer.setAttribute("aria-hidden", "false");
    if (contentsButton) contentsButton.setAttribute("aria-expanded", "true");
    closeButton.focus();
  };

  const closeDrawer = (restoreFocus = true) => {
    if (!open) return;
    open = false;
    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    drawer.setAttribute("aria-hidden", "true");
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
    if (contentsButton) contentsButton.setAttribute("aria-expanded", "false");
    if (restoreFocus && contentsButton) contentsButton.focus();
  };

  if (contentsButton) contentsButton.addEventListener("click", openDrawer);
  closeButton.addEventListener("click", () => closeDrawer(true));
  overlay.addEventListener("click", () => closeDrawer(true));

  document.addEventListener("keydown", (event) => {
    if (!open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeDrawer(true);
      return;
    }

    if (event.key === "Tab") {
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeDrawer(false);
  });
})();
