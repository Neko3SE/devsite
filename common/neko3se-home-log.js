(() => {
  "use strict";

  const container = document.getElementById("latest-lab-logs");
  if (!container) return;

  const setStatus = (message) => {
    const status = document.createElement("p");
    status.className = "home-log__status";
    status.textContent = message;
    container.replaceChildren(status);
  };

  const renderEntry = (entry) => {
    const id = entry.id;
    const time = entry.querySelector("time[datetime]");
    const type = entry.querySelector(".log-entry__type");
    const title = entry.querySelector(".log-entry__title");

    if (!id || !time || !type || !title) return null;

    const link = document.createElement("a");
    link.className = "home-log__entry";
    link.href = `log/#${encodeURIComponent(id)}`;

    const meta = document.createElement("span");
    meta.className = "home-log__meta";

    const date = document.createElement("time");
    date.dateTime = time.getAttribute("datetime") || time.textContent.trim();
    date.textContent = time.textContent.trim();

    const category = document.createElement("span");
    category.className = "home-log__type";
    category.textContent = type.textContent.trim();

    const heading = document.createElement("strong");
    heading.className = "home-log__title";
    heading.textContent = title.textContent.trim();

    const arrow = document.createElement("span");
    arrow.className = "home-log__arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    meta.append(date, category);
    link.append(meta, heading, arrow);
    return link;
  };

  fetch("log/", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const entries = Array.from(doc.querySelectorAll(".log-entry")).slice(0, 3);

      if (!entries.length) {
        setStatus("まだLOGはありません。 / No logs yet.");
        return;
      }

      const fragment = document.createDocumentFragment();
      entries.map(renderEntry).filter(Boolean).forEach((entry) => fragment.append(entry));

      if (!fragment.childNodes.length) {
        setStatus("Latest logs are unavailable.");
        return;
      }

      container.replaceChildren(fragment);
    })
    .catch(() => {
      setStatus("Latest logs are unavailable.");
    });
})();
