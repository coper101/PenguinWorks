/* Swift Developer Hub runtime.
   Handles theme, navigation, search, table of contents, reading progress,
   bookmarks, copy buttons and lightweight syntax highlighting.
   No dependencies. Part of the PenguinWorks static site. */

(function () {
    "use strict";

    var root = document.documentElement;
    var store = {
        get: function (k, fallback) {
            try {
                var v = localStorage.getItem(k);
                return v === null ? fallback : v;
            } catch (e) {
                return fallback;
            }
        },
        set: function (k, v) {
            try { localStorage.setItem(k, v); } catch (e) {}
        },
        getJSON: function (k, fallback) {
            try {
                var v = localStorage.getItem(k);
                return v ? JSON.parse(v) : fallback;
            } catch (e) {
                return fallback;
            }
        },
        setJSON: function (k, v) {
            try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
        },
    };

    /* ---------------- Theme ---------------- */
    function initTheme() {
        var btn = document.querySelector("[data-theme-toggle]");
        if (!btn) return;
        btn.addEventListener("click", function () {
            var current =
                root.getAttribute("data-theme") ||
                (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            var next = current === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            store.set("swift-theme", next);
            btn.setAttribute("aria-label", "Switch to " + (next === "dark" ? "light" : "dark") + " theme");
        });
    }

    /* ---------------- Sidebar (mobile) ---------------- */
    function initSidebar() {
        var btn = document.querySelector("[data-menu-toggle]");
        if (!btn) return;
        if (!document.querySelector("[data-sidebar]")) {
            btn.style.display = "none";
            return;
        }
        btn.addEventListener("click", function () {
            var open = document.body.classList.toggle("sidebar-open");
            btn.setAttribute("aria-expanded", String(open));
        });
        document.addEventListener("click", function (e) {
            if (!document.body.classList.contains("sidebar-open")) return;
            var sidebar = document.querySelector("[data-sidebar]");
            if (sidebar && !sidebar.contains(e.target) && !btn.contains(e.target)) {
                document.body.classList.remove("sidebar-open");
                btn.setAttribute("aria-expanded", "false");
            }
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                document.body.classList.remove("sidebar-open");
                btn.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---------------- Syntax highlighting ---------------- */
    function escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    var SWIFT_KEYWORDS = [
        "let","var","func","class","struct","enum","protocol","extension","init","deinit",
        "self","Self","super","if","else","guard","switch","case","default","for","while",
        "repeat","in","return","break","continue","throw","throws","rethrows","try","catch",
        "defer","do","await","async","actor","nonisolated","isolated","some","any","static",
        "final","public","private","internal","fileprivate","open","package","lazy","weak",
        "unowned","mutating","nonmutating","override","required","convenience","typealias",
        "associatedtype","where","is","as","inout","indirect","import","nil","true","false",
        "owned","borrowing","consuming","macro","distributed","nonmutating","with","repeat"
    ];

    function swiftRegex() {
        var kw = SWIFT_KEYWORDS.join("|");
        return new RegExp(
            "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)" +
            "|(\"(?:\\\\.|[^\"\\\\])*\")" +
            "|(@[A-Za-z_][\\w]*)" +
            "|\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b" +
            "|\\b(" + kw + ")\\b" +
            "|\\b([A-Z][A-Za-z0-9_]*)\\b" +
            "|\\b([a-zA-Z_][A-Za-z0-9_]*)(?=\\s*\\()",
            "g"
        );
    }

    function classifySwift(m) {
        if (m[1]) return "com";
        if (m[2]) return "str";
        if (m[3]) return "attr";
        if (m[4]) return "num";
        if (m[5]) return "key";
        if (m[6]) return "type";
        if (m[7]) return "fn";
        return null;
    }

    function tokenize(text, regex, classify) {
        var out = "";
        var last = 0;
        var m;
        regex.lastIndex = 0;
        while ((m = regex.exec(text))) {
            out += escapeHtml(text.slice(last, m.index));
            var cls = classify(m);
            if (cls) {
                out += '<span class="tok-' + cls + '">' + escapeHtml(m[0]) + "</span>";
            } else {
                out += escapeHtml(m[0]);
            }
            last = m.index + m[0].length;
            if (m[0].length === 0) regex.lastIndex++;
        }
        out += escapeHtml(text.slice(last));
        return out;
    }

    function jsonRegex() {
        return /("(?:\\.|[^"\\])*")(\s*:)?|\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|\b(true|false|null)\b/g;
    }

    function highlightCode(el) {
        if (!el || el.dataset.hl) return;
        var text = el.textContent;
        var lang = "";
        var m = /language-(\w+)/.exec(el.className);
        if (m) lang = m[1];
        if (lang === "swift") {
            el.innerHTML = tokenize(text, swiftRegex(), classifySwift);
        } else if (lang === "json") {
            el.innerHTML = text.replace(jsonRegex(), function (all, str, colon, num, lit) {
                if (str && colon) {
                    return '<span class="tok-attr">' + escapeHtml(str) + "</span>" + escapeHtml(colon);
                }
                if (str) return '<span class="tok-str">' + escapeHtml(str) + "</span>";
                if (num) return '<span class="tok-num">' + escapeHtml(num) + "</span>";
                if (lit) return '<span class="tok-key">' + escapeHtml(lit) + "</span>";
                return escapeHtml(all);
            });
        } else {
            el.innerHTML = escapeHtml(text);
        }
        el.dataset.hl = "1";
    }

    function initHighlighting() {
        document.querySelectorAll("pre code").forEach(highlightCode);
    }

    /* ---------------- Copy buttons ---------------- */
    function initCopy() {
        document.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-copy]");
            if (!btn) return;
            var container = btn.closest(".code-block, .snippet, .q-code") || btn.parentElement;
            var code = container.querySelector("code") || container;
            var text = code.textContent;
            var done = function () {
                var prev = btn.textContent;
                btn.textContent = "Copied";
                btn.classList.add("done");
                setTimeout(function () {
                    btn.textContent = prev;
                    btn.classList.remove("done");
                }, 1400);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(done, function () {});
            } else {
                var ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand("copy"); done(); } catch (err) {}
                document.body.removeChild(ta);
            }
        });
    }

    /* ---------------- Search ---------------- */
    function initSearch() {
        var index = window.__SWIFT_INDEX__ || [];
        if (!index.length) return;

        var normalized = index.map(function (e) {
            return {
                entry: e,
                hay: (e.title + " " + (e.summary || "") + " " + (e.section || "") + " " + (e.tags || []).join(" ")).toLowerCase(),
                title: (e.title || "").toLowerCase(),
            };
        });

        function search(query) {
            var q = query.trim().toLowerCase();
            if (!q) return [];
            var terms = q.split(/\s+/);
            var results = [];
            normalized.forEach(function (n) {
                var score = 0;
                for (var i = 0; i < terms.length; i++) {
                    var t = terms[i];
                    if (n.title.indexOf(t) !== -1) score += 6;
                    else if (n.hay.indexOf(t) !== -1) score += 2;
                    else return;
                }
                if (n.title.indexOf(q) !== -1) score += 4;
                results.push({ e: n.entry, score: score });
            });
            results.sort(function (a, b) { return b.score - a.score; });
            return results.slice(0, 8).map(function (r) { return r.e; });
        }

        function mark(text, q) {
            if (!q) return escapeHtml(text);
            var terms = q.trim().split(/\s+/).filter(Boolean).map(function (t) {
                return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            });
            if (!terms.length) return escapeHtml(text);
            var esc = escapeHtml(text);
            terms.forEach(function (t) {
                esc = esc.replace(new RegExp("(" + t + ")", "gi"), "<mark>$1</mark>");
            });
            return esc;
        }

        document.querySelectorAll("[data-search-input]").forEach(function (input) {
            var container = input.closest("[data-search], .hub-search") || input.parentElement;
            var results = container.querySelector("[data-search-results]");
            if (!results) return;
            if (container.tagName === "FORM") {
                container.addEventListener("submit", function (e) { e.preventDefault(); });
            }
            var active = -1;
            var current = [];

            function close() {
                results.hidden = true;
                results.innerHTML = "";
                active = -1;
                current = [];
                input.setAttribute("aria-expanded", "false");
            }

            function render(list, q) {
                current = list;
                active = -1;
                if (!list.length) {
                    results.innerHTML = '<div class="sr-empty">No matches for “' + escapeHtml(q) + '”.</div>';
                    results.hidden = false;
                    input.setAttribute("aria-expanded", "true");
                    return;
                }
                results.innerHTML = list
                    .map(function (e, i) {
                        return (
                            '<a class="sr-item" role="option" href="' + e.url + '" data-idx="' + i + '">' +
                            '<span class="sr-title">' + mark(e.title, q) + "</span>" +
                            '<span class="sr-meta"><span>' + escapeHtml(e.section || "") + "</span><span>" + escapeHtml(e.difficulty || "") + "</span></span>" +
                            "</a>"
                        );
                    })
                    .join("");
                results.hidden = false;
                input.setAttribute("aria-expanded", "true");
            }

            input.addEventListener("input", function () {
                var q = input.value;
                if (!q.trim()) { close(); return; }
                render(search(q), q);
            });

            input.addEventListener("keydown", function (e) {
                var items = results.querySelectorAll(".sr-item");
                if (e.key === "Escape") { close(); input.blur(); return; }
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    if (!items.length) return;
                    e.preventDefault();
                    active = e.key === "ArrowDown"
                        ? (active + 1) % items.length
                        : (active - 1 + items.length) % items.length;
                    items.forEach(function (it, i) { it.classList.toggle("active", i === active); });
                    items[active].scrollIntoView({ block: "nearest" });
                } else if (e.key === "Enter" && active >= 0 && items[active]) {
                    e.preventDefault();
                    window.location.href = items[active].getAttribute("href");
                }
            });

            input.addEventListener("focus", function () {
                if (input.value.trim()) render(search(input.value), input.value);
            });

            document.addEventListener("click", function (e) {
                if (!container.contains(e.target)) close();
            });
        });

        // "/" focuses search
        document.addEventListener("keydown", function (e) {
            var tag = (e.target.tagName || "").toLowerCase();
            if (e.key === "/" && tag !== "input" && tag !== "textarea" && tag !== "select") {
                var input = document.querySelector("[data-search-input]");
                if (input) {
                    e.preventDefault();
                    input.focus();
                    input.select();
                }
            }
        });
    }

    /* ---------------- Reading progress ---------------- */
    function initProgress() {
        var article = document.querySelector("[data-reading]");
        var top = document.querySelector("[data-reading-progress] span");
        var mini = document.querySelector("[data-progress-bar]");
        var toTop = document.querySelector("[data-to-top]");
        if (!article && !top && !mini) return;

        function update() {
            var rect = article ? article.getBoundingClientRect() : null;
            var pct = 0;
            if (rect) {
                var total = rect.height - window.innerHeight;
                var scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
                pct = total > 0 ? (scrolled / total) * 100 : (window.scrollY > 80 ? 100 : 0);
            } else {
                var doc = document.documentElement;
                var max = doc.scrollHeight - doc.clientHeight;
                pct = max > 0 ? (window.scrollY / max) * 100 : 0;
            }
            pct = Math.max(0, Math.min(100, pct));
            if (top) top.style.width = pct + "%";
            if (mini) mini.style.width = pct + "%";
            if (toTop) toTop.hidden = window.scrollY < 700;
        }
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
    }

    /* ---------------- TOC scrollspy ---------------- */
    function initToc() {
        var toc = document.querySelector("[data-toc]");
        if (!toc) return;
        var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
        if (!links.length) return;
        var map = {};
        links.forEach(function (l) {
            var id = decodeURIComponent(l.getAttribute("href").slice(1));
            map[id] = l;
        });
        var headings = Object.keys(map)
            .map(function (id) { return document.getElementById(id); })
            .filter(Boolean);
        if (!headings.length) return;

        function setActive(id) {
            links.forEach(function (l) { l.classList.remove("active"); });
            if (map[id]) map[id].classList.add("active");
        }

        if ("IntersectionObserver" in window) {
            var visible = {};
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0;
                });
                var best = null, bestRatio = 0;
                Object.keys(visible).forEach(function (id) {
                    if (visible[id] > bestRatio) { bestRatio = visible[id]; best = id; }
                });
                if (best) setActive(best);
            }, { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] });
            headings.forEach(function (h) { observer.observe(h); });
        }
    }

    /* ---------------- Bookmarks ---------------- */
    function initBookmarks() {
        var btn = document.querySelector("[data-bookmark]");
        if (!btn) return;
        var label = btn.querySelector("[data-bookmark-label]");
        var url = window.location.pathname;
        var title = (document.querySelector(".article-head h1") || {}).textContent || document.title;
        var list = store.getJSON("swift-bookmarks", {});

        function sync() {
            var on = !!list[url];
            btn.setAttribute("aria-pressed", String(on));
            if (label) label.textContent = on ? "Bookmarked" : "Bookmark";
        }
        btn.addEventListener("click", function () {
            if (list[url]) delete list[url];
            else list[url] = { title: title, date: new Date().toISOString() };
            store.setJSON("swift-bookmarks", list);
            sync();
        });
        sync();
    }

    /* ---------------- To top ---------------- */
    function initToTop() {
        var btn = document.querySelector("[data-to-top]");
        if (!btn) return;
        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function init() {
        initTheme();
        initSidebar();
        initHighlighting();
        initCopy();
        initSearch();
        initProgress();
        initToc();
        initBookmarks();
        initToTop();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // expose a tiny API for page-specific scripts
    window.SwiftHub = { store: store, escapeHtml: escapeHtml, highlightCode: highlightCode };
})();
