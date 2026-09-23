(() => {
  "use strict";

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  document.querySelectorAll("[data-copy-target]").forEach(button => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) return;
      const text = target.textContent;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          fallbackCopy(text);
        }
        const old = button.textContent;
        button.textContent = "✓ COPIED";
        button.disabled = true;
        setTimeout(() => {
          button.textContent = old;
          button.disabled = false;
        }, 1400);
      } catch (error) {
        button.textContent = "COPY ERROR";
        setTimeout(() => {
          button.textContent = "COPY";
        }, 1400);
      }
    });
  });
})();

(() => {
  "use strict";

  const image = document.getElementById("generated-sample-image");
  if (!image) return;

  const source = image.dataset.base64Src;
  const mime = image.dataset.base64Mime || "image/png";
  if (!source) return;

  image.setAttribute("aria-busy", "true");

  fetch(source)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Base64 asset load failed: ${response.status}`);
      }
      return response.text();
    })
    .then(base64Text => {
      image.src = `data:${mime};base64,${base64Text.trim()}`;
    })
    .catch(error => {
      console.error(error);
      image.dataset.base64LoadError = "true";
    })
    .finally(() => {
      image.removeAttribute("aria-busy");
    });
})();
