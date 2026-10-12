/* Learning paths with locally stored progress. */
(function () {
    "use strict";

    function esc(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function load() {
        try { return JSON.parse(localStorage.getItem("swift-learn") || "{}"); }
        catch (e) { return {}; }
    }
    function save(state) {
        try { localStorage.setItem("swift-learn", JSON.stringify(state)); } catch (e) {}
    }

    function init() {
        var data = window.__SWIFT_DATA__;
        var container = document.querySelector("[data-paths]");
        var summary = document.querySelector("[data-learn-summary]");
        var reset = document.querySelector("[data-learn-reset]");
        if (!data || !container) return;

        var paths = data.learningPaths || [];
        var state = load();

        container.innerHTML = paths
            .map(function (path, pi) {
                var steps = path.steps
                    .map(function (step, si) {
                        var id = path.id + ":" + si;
                        var checked = state[id] ? " checked" : "";
                        var link = step.url
                            ? '<a class="step-title" href="' + step.url + '">' + esc(step.title) + "</a>"
                            : '<span class="step-title">' + esc(step.title) + "</span>";
                        return (
                            '<li class="step' + (state[id] ? " done" : "") + '">' +
                            '<input type="checkbox" id="step-' + pi + "-" + si + '" data-step="' + id + '"' + checked + " />" +
                            '<span class="step-body">' + link +
                            (step.note ? '<span class="step-note">' + esc(step.note) + "</span>" : "") +
                            "</span></li>"
                        );
                    })
                    .join("");
                return (
                    '<section class="path" id="' + esc(path.id) + '">' +
                    '<div class="path-head"><div>' +
                    '<h2>' + esc(path.title) + "</h2>" +
                    "<p>" + esc(path.summary) + "</p>" +
                    "</div>" +
                    '<div class="path-progress"><span class="chip" data-difficulty="' + esc(path.level) + '">' + esc(path.level) + "</span>" +
                    '<div class="path-bar"><span data-bar="' + esc(path.id) + '"></span></div>' +
                    '<small data-count="' + esc(path.id) + '"></small></div>' +
                    "</div>" +
                    '<ul class="path-steps">' + steps + "</ul>" +
                    "</section>"
                );
            })
            .join("");

        function updateProgress() {
            var totalDone = 0;
            var totalSteps = 0;
            paths.forEach(function (path) {
                var done = 0;
                path.steps.forEach(function (_, si) {
                    if (state[path.id + ":" + si]) done++;
                });
                totalDone += done;
                totalSteps += path.steps.length;
                var bar = container.querySelector('[data-bar="' + path.id + '"]');
                var count = container.querySelector('[data-count="' + path.id + '"]');
                var pct = path.steps.length ? (done / path.steps.length) * 100 : 0;
                if (bar) bar.style.width = pct + "%";
                if (count) count.textContent = done + " / " + path.steps.length + " complete";
            });
            if (summary) {
                var pct = totalSteps ? Math.round((totalDone / totalSteps) * 100) : 0;
                summary.textContent = totalDone + " of " + totalSteps + " steps complete (" + pct + "%).";
            }
        }

        container.addEventListener("change", function (e) {
            var box = e.target.closest("[data-step]");
            if (!box) return;
            var id = box.getAttribute("data-step");
            if (box.checked) state[id] = true;
            else delete state[id];
            save(state);
            box.closest(".step").classList.toggle("done", box.checked);
            updateProgress();
        });

        if (reset) {
            reset.addEventListener("click", function () {
                state = {};
                save(state);
                container.querySelectorAll("[data-step]").forEach(function (box) { box.checked = false; });
                container.querySelectorAll(".step").forEach(function (li) { li.classList.remove("done"); });
                updateProgress();
            });
        }

        updateProgress();

        if (location.hash) {
            var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
