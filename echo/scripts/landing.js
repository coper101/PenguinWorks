// Home hero reveal: the fixed ECHO/store bar stays hidden at the top of the
// page and only appears once the hero has scrolled out of view. While the bar
// is shown, the in-hero store links are made inert so there is never a second
// set of focusable store links.
(function initHomeBar() {
  "use strict";

  const hero = document.querySelector(".landing-page .hero");
  const topbar = document.querySelector(".landing-page .echo-topbar");
  const heroStores = document.querySelector(".hero-stores");
  if (!hero || !topbar || !("IntersectionObserver" in window)) return;

  // Watch the ECHO title: once it has scrolled out of view the compact store
  // bar is revealed; when the title returns the normal hero presentation shows
  // again. The observer avoids polling scroll position.
  const target = document.querySelector(".landing-page .hero h1") || hero;
  const observer = new IntersectionObserver(
    (entries) => {
      const titleVisible = entries.some((entry) => entry.isIntersecting);
      topbar.classList.toggle("echo-topbar--shown", !titleVisible);
      if (heroStores) {
        if (titleVisible) heroStores.removeAttribute("inert");
        else heroStores.setAttribute("inert", "");
      }
    },
    { threshold: 0 },
  );
  observer.observe(target);
})();

(async function loadLandingPage() {
  "use strict";

  const preview = document.querySelector("#echo-preview");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Gentle drift in reading order (left to right): the strip advances forward
  // so whole cards enter from the right and leave on the left.
  const AUTOPLAY_PX_PER_MS = 0.02;
  const MAX_FRAME_DELTA_MS = 50;
  const RESUME_DELAY_MS = 1200;

  let items = [];
  let track = null;
  let groupCount = 0;
  // One "set" of cards (including the inter-card gaps) measured in px. The
  // content repeats every `period` px, so wrapping back to 0 is invisible.
  let period = 0;
  let scrollAccumulator = 0;
  let lastFrameTime = 0;
  let animationFrame = null;
  let paused = false;
  let resumeTimer = null;

  function stopAutoplay() {
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
    window.clearTimeout(resumeTimer);
    paused = false;
  }

  function isHiddenFromView() {
    return reducedMotion.matches || document.hidden || !(period > 0);
  }

  function animate(time) {
    animationFrame = window.requestAnimationFrame(animate);
    if (paused || isHiddenFromView()) {
      lastFrameTime = time;
      return;
    }
    if (!lastFrameTime) lastFrameTime = time;
    const delta = Math.min(MAX_FRAME_DELTA_MS, Math.max(0, time - lastFrameTime));
    lastFrameTime = time;
    scrollAccumulator += delta * AUTOPLAY_PX_PER_MS;
    if (scrollAccumulator >= period) scrollAccumulator -= period;
    preview.scrollLeft = scrollAccumulator;
  }

  function appendGroup(hidden) {
    const fragment = document.createDocumentFragment();
    items.forEach((echo) => {
      const card = window.EchoWeb.createCard(echo);
      if (hidden) card.setAttribute("aria-hidden", "true");
      fragment.append(card);
    });
    track.append(fragment);
    groupCount += 1;
  }

  // Period + range measurement happen after the track is in the document so
  // layout is real. Extra hidden groups are only added until the container can
  // actually scroll one full period without reaching its end.
  function measureAndFill() {
    if (!track || items.length === 0) return;
    const cards = track.querySelectorAll(".echo-card");
    const first = cards[0];
    const periodStart = cards[items.length];
    if (!first || !periodStart) return;
    period = periodStart.offsetLeft - first.offsetLeft;
    if (!(period > 0)) return;
    while (track.scrollWidth - preview.clientWidth < period - 1) {
      appendGroup(true);
    }
    scrollAccumulator = preview.scrollLeft % period;
    if (!(scrollAccumulator >= 0) || scrollAccumulator >= period) scrollAccumulator = 0;
    lastFrameTime = 0;
  }

  function pauseForInteraction() {
    paused = true;
    window.clearTimeout(resumeTimer);
  }

  function resumeAfterInteraction(delay = 0) {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      // Take over from wherever the reader left the strip.
      scrollAccumulator = preview.scrollLeft % period;
      if (!(scrollAccumulator >= 0) || scrollAccumulator >= period) scrollAccumulator = 0;
      paused = false;
    }, delay);
  }

  function bindInteraction() {
    preview.addEventListener("pointerdown", pauseForInteraction);
    preview.addEventListener("pointerup", () => resumeAfterInteraction(RESUME_DELAY_MS));
    preview.addEventListener("pointercancel", () => resumeAfterInteraction(RESUME_DELAY_MS));
    preview.addEventListener("wheel", () => {
      pauseForInteraction();
      resumeAfterInteraction(RESUME_DELAY_MS);
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      lastFrameTime = 0;
    });
    window.addEventListener("resize", measureAndFill, { passive: true });
  }

  function buildCarousel() {
    stopAutoplay();
    if (!items.length) return;
    track = document.createElement("div");
    track.className = "echo-carousel-track";
    groupCount = 0;
    appendGroup(false);
    preview.replaceChildren(track);

    if (reducedMotion.matches) return;
    appendGroup(true);
    measureAndFill();
    preview.scrollLeft = 0;
    animationFrame = window.requestAnimationFrame(animate);
  }

  reducedMotion.addEventListener("change", () => {
    if (items.length) buildCarousel();
  });

  try {
    const page = await window.EchoWeb.getPage(6, null);
    preview.replaceChildren();
    if (page.items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "status-panel";
      empty.textContent = "> NO MORE SIGNALS IN RANGE\n> CHECK THE VOID AGAIN LATER";
      preview.append(empty);
    } else {
      items = page.items;
      bindInteraction();
      buildCarousel();
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
