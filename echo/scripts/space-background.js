(function createSpaceBackground(global) {
  "use strict";

  const canvas = document.querySelector("#space-background");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const reducedMotion = global.matchMedia("(prefers-reduced-motion: reduce)");
  const densityPixels = 7200;
  const minimumStars = 26;
  const maximumStars = 48;
  const respawnMargin = 24;
  let width = 0;
  let height = 0;
  let stars = [];
  let comet = null;
  let cometTimer = null;
  let animationFrame = null;
  let previousTime = 0;

  function randomBetween(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function buildStars() {
    const count = Math.max(
      minimumStars,
      Math.min(maximumStars, Math.round((width * height) / densityPixels)),
    );
    stars = Array.from({ length: count }, () => {
      const bright = Math.random() < 0.13;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: randomBetween(respawnMargin, Math.max(respawnMargin + 1, width - respawnMargin)),
        y: randomBetween(respawnMargin, Math.max(respawnMargin + 1, height - respawnMargin)),
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        speed: bright ? randomBetween(3.5, 6.5) : randomBetween(1.2, 3.2),
        size: bright ? randomBetween(1.8, 2.4) : randomBetween(1, 1.5),
        opacity: bright ? randomBetween(0.55, 0.85) : randomBetween(0.16, 0.5),
      };
    });
  }

  function resize() {
    const pixelRatio = Math.min(global.devicePixelRatio || 1, 2);
    width = global.innerWidth;
    height = global.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    buildStars();
    draw();
  }

  function wrapStar(star) {
    if (star.x > width + respawnMargin) star.x = -respawnMargin;
    if (star.x < -respawnMargin) star.x = width + respawnMargin;
    if (star.y > height + respawnMargin) star.y = -respawnMargin;
    if (star.y < -respawnMargin) star.y = height + respawnMargin;
  }

  function drawDot(x, y, size, opacity) {
    context.globalAlpha = opacity;
    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.arc(x, y, size / 2, 0, Math.PI * 2);
    context.fill();
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    stars.forEach((star) => drawDot(star.x, star.y, star.size, star.opacity));
    if (comet) {
      const elapsed = performance.now() - comet.startedAt;
      const progress = Math.min(1, elapsed / comet.duration);
      const x = comet.startX + (comet.endX - comet.startX) * progress;
      const y = comet.startY + (comet.endY - comet.startY) * progress;
      const fade = progress < 0.12 ? progress / 0.12 : Math.max(0, (1 - progress) / 0.2);
      const distance = Math.hypot(comet.endX - comet.startX, comet.endY - comet.startY) || 1;
      const unitX = (comet.endX - comet.startX) / distance;
      const unitY = (comet.endY - comet.startY) / distance;
      [0.42, 0.32, 0.22, 0.12].forEach((opacity, index) => {
        const step = (index + 1) * 13;
        drawDot(x - unitX * step, y - unitY * step, Math.max(1, 2 - index * 0.3), opacity * fade);
      });
      drawDot(x, y, 2.8, 0.85 * fade);
      if (progress >= 1) {
        comet = null;
        scheduleComet(13000 + Math.random() * 15000);
      }
    }
    context.globalAlpha = 1;
  }

  function createComet() {
    if (reducedMotion.matches || document.hidden) return;
    const fromLeft = Math.random() < 0.5;
    const margin = Math.max(48, width * 0.18);
    const startY = height * randomBetween(0.12, 0.78);
    const endY = Math.max(height * 0.05, Math.min(height * 0.95, startY + randomBetween(-0.16, 0.16) * height));
    comet = {
      startX: fromLeft ? -margin : width + margin,
      endX: fromLeft ? width + margin : -margin,
      startY,
      endY,
      duration: randomBetween(1600, 2600),
      startedAt: performance.now(),
    };
  }

  function scheduleComet(delay) {
    global.clearTimeout(cometTimer);
    if (reducedMotion.matches) return;
    cometTimer = global.setTimeout(createComet, delay);
  }

  function animate(time) {
    const elapsedSeconds = Math.min(0.1, (time - previousTime) / 1000 || 0);
    previousTime = time;
    if (!document.hidden) {
      stars.forEach((star) => {
        star.x += star.dx * star.speed * elapsedSeconds;
        star.y += star.dy * star.speed * elapsedSeconds;
        wrapStar(star);
      });
      draw();
    }
    animationFrame = global.requestAnimationFrame(animate);
  }

  function applyMotionPreference() {
    global.clearTimeout(cometTimer);
    comet = null;
    if (animationFrame) global.cancelAnimationFrame(animationFrame);
    animationFrame = null;
    previousTime = performance.now();
    if (reducedMotion.matches) {
      draw();
    } else {
      animationFrame = global.requestAnimationFrame(animate);
      scheduleComet(6000 + Math.random() * 5000);
    }
  }

  global.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    previousTime = performance.now();
    if (!document.hidden && !comet && !reducedMotion.matches) scheduleComet(6000);
  });
  reducedMotion.addEventListener("change", applyMotionPreference);
  resize();
  applyMotionPreference();
})(window);
