/* Browse by tag: builds a tag cloud and filtered results from the search index. */
(function () {
    "use strict";

    function esc(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function init() {
        var cloud = document.querySelector("[data-tag-cloud]");
        var results = document.querySelector("[data-tag-results]");
        var index = (window.__SWIFT_INDEX__ || []).filter(function (e) {
            return e.kind === "article" || e.kind === "section";
        });
        if (!cloud || !results) return;

        var groups = {};
        index.forEach(function (e) {
            (e.tags || []).forEach(function (t) {
                if (!groups[t]) groups[t] = [];
                groups[t].push(e);
            });
        });

        var tags = Object.keys(groups).sort(function (a, b) {
            return groups[b].length - groups[a].length || a.localeCompare(b);
        });

        if (!tags.length) {
            cloud.innerHTML = '<p class="hint">No tags found.</p>';
            return;
        }

        function renderResults(tag) {
            if (!tag) {
                results.innerHTML = "";
                return;
            }
            var list = groups[tag] || [];
            results.innerHTML =
                '<div class="tag-group"><h3>#' + esc(tag) + " · " + list.length + " articles</h3><ul>" +
                list
                    .map(function (e) {
                        return (
                            '<li><a class="related-card" href="' + e.url + '">' +
                            '<span class="related-section">' + esc(e.section || "") + "</span>" +
                            '<span class="related-title">' + esc(e.title) + "</span>" +
                            '<span class="chip chip-difficulty small" data-difficulty="' + esc(e.difficulty || "") + '">' + esc(e.difficulty || "") + "</span>" +
                            "</a></li>"
                        );
                    })
                    .join("") +
                "</ul></div>";
        }

        cloud.innerHTML = tags
            .map(function (t) {
                return '<button class="tag-cloud-item" type="button" data-tag="' + esc(t) + '">#' + esc(t) + "<small>" + groups[t].length + "</small></button>";
            })
            .join("");

        cloud.addEventListener("click", function (e) {
            var btn = e.target.closest(".tag-cloud-item");
            if (!btn) return;
            var tag = btn.getAttribute("data-tag");
            var already = btn.classList.contains("active");
            cloud.querySelectorAll(".tag-cloud-item").forEach(function (b) { b.classList.remove("active"); });
            if (already) {
                renderResults(null);
                if (history.replaceState) history.replaceState(null, "", location.pathname);
            } else {
                btn.classList.add("active");
                renderResults(tag);
                if (history.replaceState) history.replaceState(null, "", "#" + tag);
            }
        });

        if (location.hash) {
            var wanted = decodeURIComponent(location.hash.slice(1));
            var target = cloud.querySelector('[data-tag="' + wanted.replace(/"/g, '\\"') + '"]');
            if (target) target.click();
        }
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
