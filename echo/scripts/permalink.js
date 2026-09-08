(async function loadPermalink() {
  "use strict";

  const detail = document.querySelector("#echo-detail");
  const stores = document.querySelector("#store-links");
  window.EchoWeb.renderStoreLinks(stores);
  const id = new URLSearchParams(window.location.search).get("id") || "";

  function showNotFound() {
    detail.replaceChildren();
    const panel = document.createElement("div");
    panel.className = "status-panel";
    panel.textContent = "> SIGNAL NOT FOUND\n> IT MAY HAVE LEFT THE VOID";
    detail.append(panel);
  }

  try {
    const echo = await window.EchoWeb.getEcho(id);
    detail.replaceChildren(window.EchoWeb.createCard(echo, { link: false }));
  } catch {
    showNotFound();
  } finally {
    detail.setAttribute("aria-busy", "false");
  }
})();
