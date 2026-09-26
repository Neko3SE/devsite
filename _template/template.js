(() => {
  "use strict";

  const button = document.getElementById("language-switch");
  if (!button) return;

  let language = "ja";

  const applyLanguage = (next) => {
    language = next === "en" ? "en" : "ja";
    document.documentElement.lang = language;

    document.querySelectorAll("[data-ja][data-en]").forEach((node) => {
      node.textContent = node.dataset[language];
    });

    button.textContent = language === "ja" ? "English" : "Japanese";
    button.setAttribute("aria-label", language === "ja" ? "Switch to English" : "日本語に切り替える");
  };

  button.addEventListener("click", () => applyLanguage(language === "ja" ? "en" : "ja"));
  applyLanguage("ja");
})();
