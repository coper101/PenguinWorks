(function createEchoWebClient(global) {
  "use strict";

  // Exact public projection allowlist. Only these fields may ever be rendered
  // from the public web contract; the feed and single-Echo validators both
  // reject any payload that is missing a field or carries an extra one.
  const PUBLIC_KEYS = [
    "createdAt",
    "echoText",
    "id",
    "publicBeaconId",
    "pulseCount",
    "signalCount",
    "transmissionText",
  ];
  const ID_PATTERN = /^[A-Za-z0-9]{20}$/;
  const BEACON_PATTERN = /^BX-[A-F0-9]{20}$/;
  // UI shows only the pseudonym prefix (BX- + 6 hex chars); the full value is
  // still validated above and never shortened on the wire or in storage.
  const DISPLAY_BEACON_LENGTH = 9; // "BX-" + 6 chars

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
      typeof value.transmissionText === "string" &&
      value.transmissionText.trim().length > 0 &&
      typeof value.createdAt === "string" && Number.isFinite(Date.parse(value.createdAt)) &&
      Number.isSafeInteger(value.pulseCount) && value.pulseCount >= 0 &&
      Number.isSafeInteger(value.signalCount) && value.signalCount >= 0;
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
    return `PULSES ${count}`;
  }

  // Presentation-only shortening of the public Beacon pseudonym. The full
  // publicBeaconId keeps its entropy on the backend and in any shared URL; only
  // the human-readable label is trimmed for the UI.
  function displayBeacon(publicBeaconId) {
    if (typeof publicBeaconId !== "string" || publicBeaconId.length <= DISPLAY_BEACON_LENGTH) {
      return publicBeaconId || "";
    }
    return publicBeaconId.slice(0, DISPLAY_BEACON_LENGTH);
  }

  function createLabel(text) {
    const label = document.createElement("p");
    label.className = "echo-label";
    label.textContent = text;
    return label;
  }

  // Mirrors the mobile PublicEchoCard/Void card: header row (signal star +
  // short Beacon left, PULSES right) above SOMEONE'S TRANSMISSION + the
  // original transmission, then ECHO + the Echo reply. Cards are never
  // interactive on the public site; permalinks live at /echo/e/?id=...
  function createCard(echo) {
    const article = document.createElement("article");
    article.className = "echo-card";

    const meta = document.createElement("div");
    meta.className = "echo-card-meta";
    const beacon = document.createElement("span");
    beacon.className = "beacon-id";
    beacon.textContent = `✦ ${displayBeacon(echo.publicBeaconId)}`;
    const pulses = document.createElement("span");
    pulses.className = "pulse-count";
    pulses.textContent = pulseLabel(echo.pulseCount);
    meta.append(beacon, pulses);

    const transmission = document.createElement("p");
    transmission.className = "echo-transmission";
    transmission.textContent = echo.transmissionText;

    const reply = document.createElement("blockquote");
    reply.className = "echo-reply";
    reply.textContent = echo.echoText;

    article.append(
      meta,
      createLabel("SOMEONE'S TRANSMISSION"),
      transmission,
      createLabel("ECHO"),
      reply,
    );
    return article;
  }

  global.EchoWeb = Object.freeze({ createCard, getEcho, getPage });
})(window);
