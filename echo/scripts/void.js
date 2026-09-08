(function loadVoidPage() {
  "use strict";

  const grid = document.querySelector("#void-grid");
  const status = document.querySelector("#void-status");
  const button = document.querySelector("#load-more");
  const stores = document.querySelector("#store-links");
  let cursor = null;
  let loading = false;

  window.EchoWeb.renderStoreLinks(stores);

  async function loadNextPage() {
    if (loading) return;
    loading = true;
    button.disabled = true;
    button.textContent = "LOAD MORE";
    status.textContent = grid.childElementCount ? "> SCANNING FOR MORE ECHOES" : "> ACCESSING VOID…";
    try {
      const page = await window.EchoWeb.getPage(12, cursor);
      page.items.forEach((echo) => grid.append(window.EchoWeb.createCard(echo)));
      cursor = page.nextCursor;
      if (grid.childElementCount === 0 && !cursor) {
        status.textContent = "> NO MORE SIGNALS IN RANGE\n> CHECK THE VOID AGAIN LATER";
      } else if (cursor) {
        status.textContent = `> ${grid.childElementCount} SIGNALS RECEIVED`;
      } else {
        status.textContent = "> NO MORE SIGNALS IN RANGE\n> CHECK THE VOID AGAIN LATER";
      }
      button.hidden = !cursor;
    } catch {
      status.textContent = "> VOID SIGNAL LOST";
      button.hidden = false;
      button.textContent = "TRY AGAIN";
    } finally {
      loading = false;
      button.disabled = false;
      grid.setAttribute("aria-busy", "false");
    }
  }

  button.addEventListener("click", loadNextPage);
  loadNextPage();
})();
