(function createEchoWebClient(global) {
  "use strict";

  const PUBLIC_KEYS = ["createdAt", "echoText", "id", "publicBeaconId", "pulseCount"];
  const ID_PATTERN = /^[A-Za-z0-9]{20}$/;
  const BEACON_PATTERN = /^BX-[A-F0-9]{20}$/;

  function hasExactKeys(value, keys) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const actual = Object.keys(value).sort();
    return actual.length === keys.length && actual.every((key, index) => key === keys[index]);
  }

  function isPublicEcho(value) {
    return hasExactKeys(value, PUBLIC_KEYS) &&
      ID_PATTERN.test(value.id) &&
      BEACON_PATTERN.test(value.publicBeaconId) &&
      typeof value.echoText === "string" && value.echoText.trim().length > 0 &&
      typeof value.createdAt === "string" && Number.isFinite(Date.parse(value.createdAt)) &&
      Number.isSafeInteger(value.pulseCount) && value.pulseCount >= 0;
  }

  async function requestJson(url) {
    const response = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
    if (!response.ok) {
      const error = new Error(response.status === 404 ? "not_found" : "unavailable");
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  async function getPage(limit, cursor) {
    const base = global.ECHO_WEB_CONFIG?.api?.feedUrl;
    if (!base) throw new Error("not_configured");
    const url = new URL(base);
    url.searchParams.set("limit", String(Math.min(20, Math.max(1, limit))));
    if (cursor) url.searchParams.set("cursor", cursor);
    const payload = await requestJson(url);
    if (!hasExactKeys(payload, ["items", "nextCursor"]) ||
        !Array.isArray(payload.items) || !payload.items.every(isPublicEcho) ||
        !(payload.nextCursor === null || typeof payload.nextCursor === "string")) {
      throw new Error("invalid_response");
    }
    return payload;
  }

  async function getEcho(id) {
    const base = global.ECHO_WEB_CONFIG?.api?.singleUrl;
    if (!base || !ID_PATTERN.test(id)) throw new Error("not_found");
    const url = new URL(base);
    url.searchParams.set("id", id);
    const payload = await requestJson(url);
    if (!isPublicEcho(payload)) throw new Error("invalid_response");
    return payload;
  }

  function pulseLabel(count) {
    return `PULSES ${count.toLocaleString()}`;
  }

  function createCard(echo, options) {
    const article = document.createElement("article");
    article.className = "echo-card";

    const meta = document.createElement("div");
    meta.className = "echo-card-meta";
    const beacon = document.createElement("span");
    beacon.className = "beacon-id";
    beacon.textContent = `✦ ${echo.publicBeaconId}`;
    const pulses = document.createElement("span");
    pulses.className = "pulse-count";
    pulses.textContent = pulseLabel(echo.pulseCount);
    meta.append(beacon, pulses);

    const label = document.createElement("p");
    label.className = "echo-label";
    label.textContent = "ECHO";
    const text = document.createElement("blockquote");
    text.textContent = echo.echoText;
    article.append(meta, label, text);

    if (options?.link !== false) {
      const link = document.createElement("a");
      link.className = "card-link";
      link.href = `/echo/e/?id=${encodeURIComponent(echo.id)}`;
      link.textContent = "OPEN SIGNAL →";
      link.setAttribute("aria-label", `Open Echo from ${echo.publicBeaconId}`);
      article.append(link);
    }
    return article;
  }

  function renderStoreLinks(container) {
    const stores = global.ECHO_WEB_CONFIG?.stores || {};
    const items = [
      [stores.appStoreUrl, "APP STORE"],
      [stores.googlePlayUrl, "GOOGLE PLAY"],
    ];
    items.forEach(([url, label]) => {
      const configured = typeof url === "string" && /^https:\/\//.test(url);
      const item = document.createElement(configured ? "a" : "span");
      item.className = "store-item";
      item.textContent = `[${label}]`;
      if (configured) {
        item.href = url;
        item.rel = "noopener noreferrer";
      } else {
        item.setAttribute("aria-disabled", "true");
      }
      container.append(item);
    });
  }

  global.EchoWeb = Object.freeze({ createCard, getEcho, getPage, renderStoreLinks });
})(window);
