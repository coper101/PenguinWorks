(async function loadLandingPage() {
  "use strict";

  const preview = document.querySelector("#echo-preview");
  const stores = document.querySelector("#store-links");
  window.EchoWeb.renderStoreLinks(stores);

  try {
    const page = await window.EchoWeb.getPage(6, null);
    preview.replaceChildren();
    if (page.items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "status-panel";
      empty.textContent = "> NO MORE SIGNALS IN RANGE\n> CHECK THE VOID AGAIN LATER";
      preview.append(empty);
    } else {
      page.items.forEach((echo) => preview.append(window.EchoWeb.createCard(echo)));
    }
  } catch {
    preview.replaceChildren();
    const unavailable = document.createElement("div");
    unavailable.className = "status-panel";
    unavailable.textContent = "> VOID SIGNAL LOST\n> TRY AGAIN SOON";
    preview.append(unavailable);
  } finally {
    preview.setAttribute("aria-busy", "false");
  }
})();
