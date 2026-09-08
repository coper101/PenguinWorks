(function configureEchoWeb(global) {
  "use strict";

  const localHosts = new Set(["", "localhost", "127.0.0.1", "::1"]);
  const isLocal = localHosts.has(global.location.hostname);

  global.ECHO_WEB_CONFIG = Object.freeze({
    api: Object.freeze({
      feedUrl: isLocal
        ? "https://us-central1-echo-dev-4557a.cloudfunctions.net/publicVoidFeed"
        : "",
      singleUrl: isLocal
        ? "https://us-central1-echo-dev-4557a.cloudfunctions.net/publicVoidEcho"
        : "",
    }),
    stores: Object.freeze({
      // Verified public store destinations. The footer renders these as links.
      appStoreUrl:
        "https://apps.apple.com/sg/app/echo-your-quote/id6754518887",
      googlePlayUrl:
        "https://play.google.com/store/apps/details?id=com.penguinworks.Echo&hl=en_SG",
    }),
  });
})(window);
