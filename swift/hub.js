/* Hub homepage: interview question of the day reveal. */
(function () {
    "use strict";
    function init() {
        var box = document.querySelector("[data-qotd]");
        var btn = document.querySelector("[data-qotd-reveal]");
        if (!box || !btn) return;
        var answer = box.querySelector(".qotd-answer");
        btn.addEventListener("click", function () {
            var willShow = answer.hidden;
            answer.hidden = !willShow;
            btn.textContent = willShow ? "Hide answer" : "Reveal answer";
            btn.setAttribute("aria-expanded", String(willShow));
        });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
