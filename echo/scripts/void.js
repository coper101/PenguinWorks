(function loadVoidPage() {
  "use strict";

  const feed = document.querySelector("#void-feed");
  const list = document.querySelector("#feed-list");
  const status = document.querySelector("#feed-status");
  const fade = document.querySelector("#feed-fade");
  const retry = document.querySelector("#feed-retry");
  const sentinel = document.querySelector("#feed-sentinel");
  const stores = document.querySelector("#store-links");

  const PAGE_SIZE = 12;
  const EMPTY_COPY = "> NO MORE SIGNALS IN RANGE\n> CHECK THE VOID AGAIN LATER";

  window.EchoWeb.renderStoreLinks(stores);

  const seenIds = new Set();
  let cursor = null;
  let busy = false;
  let done = false;
  let firstPage = true;
  let observer = null;

  function showStatus(text) {
    status.hidden = false;
    status.textContent = text;
  }

  function clearStatus() {
    status.hidden = true;
    status.textContent = "";
  }

  function updateEndState() {
    // The subtle bottom cue only exists once something is loaded and more
    // pages may still follow; it disappears when the API reports no more.
    const nothingLoadedYet = list.childElementCount === 0 && seenIds.size === 0;
    fade.hidden = done || nothingLoadedYet;
    if (done) {
      observer?.disconnect();
      observer = null;
    }
  }

  function appendCards(echoes) {
    echoes.forEach((echo) => {
      if (seenIds.has(echo.id)) return;
      seenIds.add(echo.id);
      list.append(window.EchoWeb.createCard(echo));
    });
  }

  async function loadNextPage() {
    if (busy || done) return;
    busy = true;
    retry.hidden = true;
    if (firstPage) {
      showStatus("> ACCESSING VOID");
      feed.setAttribute("aria-busy", "true");
    } else {
      feed.setAttribute("aria-busy", "true");
    }
    try {
      const page = await window.EchoWeb.getPage(PAGE_SIZE, cursor);
      appendCards(page.items);
      cursor = page.nextCursor;
      if (cursor === null) done = true;
      if (firstPage) {
        firstPage = false;
        if (seenIds.size === 0) showStatus(EMPTY_COPY);
        else clearStatus();
      } else {
        clearStatus();
      }
    } catch (error) {
      if (firstPage) showStatus("> VOID SIGNAL LOST\n> TRY AGAIN");
      else showStatus("> SIGNAL LOST\n> TRY AGAIN");
      retry.hidden = false;
    } finally {
      busy = false;
      feed.setAttribute("aria-busy", "false");
      updateEndState();
    }
  }

  retry.addEventListener("click", () => void loadNextPage());

  // Progressive loading: request one page at a time as the reader nears the
  // end of what is loaded, instead of fetching the whole Void up front.
  function initObserver() {
    if (!("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadNextPage();
      },
      { rootMargin: "0px 0px 360px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
  }

  initObserver();
  void loadNextPage();
})();
