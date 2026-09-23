    (() => {
      "use strict";

      /*
       * Neko3SE LAB - Route Recovery Table
       *
       * Legacy GitHub Pages project site:
       *   https://neko3se.github.io/devsite/
       *
       * Keys and values below are paths relative to the site root.
       */
      const redirects = {
        "/mudagiken.html": "/mudagiken/",
        "/mudagiken/mudagiken.html": "/mudagiken/",
        "/gosenfu_doremi.html": "/gosenfu/",
        "/gosenfu/gosenfu_doremi.html": "/gosenfu/",
        "/piano_emulator.html": "/pianoemu/",
        "/pianoemu/piano_emulator.html": "/pianoemu/",
        "/prompt_generator.html": "/promptgen/",
        "/promptgen/prompt_generator.html": "/promptgen/",
        "/egov-index.html": "/egov/",
        "/egov/egov-index.html": "/egov/",
        "/imageprompt/image_prompt.html": "/imageprompt/",
        "/VOICE_CHANGER/index.html": "/voicechanger/"
      };

      const SITE_ORIGIN = "https://neko3se.com";
      const LEGACY_PROJECT_PATH = "/devsite";

      const app = document.getElementById("app");
      const requestPath = document.getElementById("requestPath");
      const routeStatus = document.getElementById("routeStatus");
      const targetPath = document.getElementById("targetPath");
      const eyebrow = document.getElementById("eyebrow");
      const mainTitle = document.getElementById("mainTitle");
      const lead = document.getElementById("lead");
      const primaryAction = document.getElementById("primaryAction");
      const homeAction = document.getElementById("homeAction");
      const brandLink = document.getElementById("brandLink");
      const licenseLink = document.getElementById("licenseLink");
      const message = document.getElementById("message");
      const systemStatus = document.getElementById("systemStatus");
      const progressWrap = document.getElementById("progressWrap");
      const progressPercent = document.getElementById("progressPercent");
      const panelCode = document.getElementById("panelCode");

      const pathname = window.location.pathname;
      const isLegacyProjectPath = pathname === LEGACY_PROJECT_PATH ||
        pathname.startsWith(LEGACY_PROJECT_PATH + "/");
      const relativePath = isLegacyProjectPath
        ? pathname.slice(LEGACY_PROJECT_PATH.length) || "/"
        : pathname;

      const homeUrl = SITE_ORIGIN + "/";
      const licenseUrl = SITE_ORIGIN + "/LICENSE.txt";

      brandLink.href = homeUrl;
      homeAction.href = homeUrl;
      licenseLink.href = licenseUrl;
      requestPath.textContent = pathname;

      const destination = redirects[relativePath];

      if (destination) {
        const targetUrl = SITE_ORIGIN + destination +
          window.location.search +
          window.location.hash;

        app.classList.add("redirecting");

        eyebrow.textContent = "MOVED CONTENT DETECTED";
        mainTitle.textContent = "ROUTE CHANGED";
        lead.textContent =
          "このページは新しいフォルダへ移動しました。新しいルートへ自動的に転送します。";
        routeStatus.textContent = "MIGRATION ROUTE FOUND";
        targetPath.textContent = SITE_ORIGIN + destination;
        primaryAction.href = targetUrl;
        primaryAction.textContent = "OPEN NEW LOCATION";
        message.innerHTML =
          "<strong>ROUTE RECOVERY SUCCESS</strong> / redirecting to the new location...";
        systemStatus.textContent = "MIGRATION ROUTE FOUND";
        panelCode.textContent = "ROUTE 302";

        let shown = 0;
        const meter = window.setInterval(() => {
          shown = Math.min(shown + 5, 95);
          progressPercent.textContent = shown + "%";
        }, 50);

        window.setTimeout(() => {
          window.clearInterval(meter);
          progressPercent.textContent = "100%";
          window.location.replace(targetUrl);
        }, 1000);
      } else {
        app.classList.add("lost", "redirecting");

        eyebrow.textContent = "NO ROUTE DATA FOUND";
        mainTitle.textContent = "RETURNING TO LAB.";
        lead.textContent =
          "指定されたページは見つかりませんでした。1秒後にNeko3SE LABのトップページへ移動します。";
        routeStatus.textContent = "FALLBACK TO HOME";
        targetPath.textContent = homeUrl;
        primaryAction.href = homeUrl;
        primaryAction.textContent = "BACK TO LAB";
        homeAction.hidden = true;
        message.innerHTML =
          "<strong>404</strong> / returning to the Neko3SE LAB home page...";
        systemStatus.textContent = "FALLBACK ROUTE FOUND";
        panelCode.textContent = "HTTP 404";

        let shown = 0;
        const meter = window.setInterval(() => {
          shown = Math.min(shown + 5, 95);
          progressPercent.textContent = shown + "%";
        }, 50);

        window.setTimeout(() => {
          window.clearInterval(meter);
          progressPercent.textContent = "100%";
          window.location.replace(homeUrl);
        }, 1000);
      }
    })();
