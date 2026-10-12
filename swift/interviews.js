/* Interview preparation: question bank, flashcards, quiz mode and mock interview. */
(function () {
    "use strict";

    function esc(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    // Inline markdown for answer paragraphs: `code`, **bold**, [text](url)
    function inline(text) {
        var out = esc(text);
        out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, label, href) {
            var ext = /^https?:/i.test(href);
            return '<a href="' + href + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + label + "</a>";
        });
        out = out.replace(/`([^`]+)`/g, '<span class="q-inline-code">$1</span>');
        out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        return out;
    }

    function storeGet(k, f) { try { return JSON.parse(localStorage.getItem(k) || "null") || f; } catch (e) { return f; } }
    function storeSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

    function metaChips(q) {
        return (
            '<div class="q-meta">' +
            '<span class="chip chip-difficulty small" data-difficulty="' + esc(q.difficulty) + '">' + esc(q.difficulty) + "</span>" +
            '<span class="chip small">' + esc(q.category) + "</span>" +
            (q.tags || []).slice(0, 3).map(function (t) { return '<span class="tag small">#' + esc(t) + "</span>"; }).join("") +
            "</div>"
        );
    }

    function answerBody(q) {
        var html = '<div class="q-body">';
        (q.answer || []).forEach(function (p) { html += "<p>" + inline(p) + "</p>"; });
        if (q.code) {
            html += '<div class="q-code"><pre><code class="language-swift">' + esc(q.code) + "</code></pre></div>";
        }
        if (q.wrong && q.wrong.length) {
            html += '<div class="q-section"><h4>Common incorrect answers</h4><ul class="q-wrong">' +
                q.wrong.map(function (w) { return "<li>" + inline(w) + "</li>"; }).join("") + "</ul></div>";
        }
        if (q.followUps && q.followUps.length) {
            html += '<div class="q-section"><h4>Follow-up questions</h4><ul class="q-followups">' +
                q.followUps.map(function (f) { return "<li>" + inline(f) + "</li>"; }).join("") + "</ul></div>";
        }
        html += "</div>";
        return html;
    }

    function questionCard(q) {
        return (
            '<details class="q-card" id="q-' + esc(q.id) + '">' +
            "<summary>" + metaChips(q) + '<p class="q-question">' + esc(q.question) + "</p></summary>" +
            answerBody(q) +
            "</details>"
        );
    }

    /* ---------------- Question bank ---------------- */
    function initBank(data) {
        var bank = document.querySelector("[data-bank]");
        if (!bank) return;
        var countEl = document.querySelector("[data-bank-count]");
        var category = "All";
        var difficulty = "";
        var diffSelect = document.querySelector("[data-difficulty-filter]");

        function render() {
            var list = data.questions.filter(function (q) {
                if (category !== "All" && q.category !== category) return false;
                if (difficulty && q.difficulty !== difficulty) return false;
                return true;
            });
            bank.innerHTML = list.map(questionCard).join("") || '<p class="hint">No questions match this filter.</p>';
            if (countEl) countEl.textContent = list.length + " question" + (list.length === 1 ? "" : "s");
            bank.querySelectorAll("pre code").forEach(function (c) { if (window.SwiftHub) window.SwiftHub.highlightCode(c); });
        }

        document.querySelectorAll("[data-ifilter]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                category = btn.getAttribute("data-ifilter");
                document.querySelectorAll("[data-ifilter]").forEach(function (b) { b.classList.toggle("active", b === btn); });
                render();
            });
        });
        if (diffSelect) diffSelect.addEventListener("change", function () { difficulty = diffSelect.value; render(); });
        render();

        if (location.hash && location.hash.indexOf("#q-") === 0) {
            var target = document.getElementById(location.hash.slice(1));
            if (target) {
                target.open = true;
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }

    /* ---------------- Flashcards ---------------- */
    function initFlashcards(data) {
        var card = document.querySelector("[data-flashcard]");
        if (!card) return;
        var qEl = card.querySelector("[data-flashcard-question]");
        var aEl = card.querySelector("[data-flashcard-answer]");
        var progress = document.querySelector("[data-flashcard-progress]");
        var order = data.questions.map(function (_, i) { return i; });
        var idx = 0;
        var flipped = false;

        function show() {
            var q = data.questions[order[idx]];
            card.classList.remove("flipped");
            flipped = false;
            qEl.textContent = q.question;
            aEl.innerHTML = (q.answer || []).map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("") +
                (q.code ? '<div class="q-code"><pre><code class="language-swift">' + esc(q.code) + "</code></pre></div>" : "");
            aEl.parentElement.querySelectorAll("pre code").forEach(function (c) { if (window.SwiftHub) window.SwiftHub.highlightCode(c); });
            if (progress) progress.textContent = (idx + 1) + " / " + order.length;
        }
        card.addEventListener("click", function () {
            flipped = !flipped;
            card.classList.toggle("flipped", flipped);
        });
        var next = document.querySelector("[data-flashcard-next]");
        var prev = document.querySelector("[data-flashcard-prev]");
        var shuffle = document.querySelector("[data-flashcard-shuffle]");
        if (next) next.addEventListener("click", function () { idx = (idx + 1) % order.length; show(); });
        if (prev) prev.addEventListener("click", function () { idx = (idx - 1 + order.length) % order.length; show(); });
        if (shuffle) shuffle.addEventListener("click", function () {
            for (var i = order.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var t = order[i]; order[i] = order[j]; order[j] = t;
            }
            idx = 0;
            show();
        });
        show();
    }

    /* ---------------- Quiz mode ---------------- */
    function initQuiz(data) {
        var root = document.querySelector("[data-quiz]");
        if (!root) return;
        var body = root.querySelector("[data-quiz-body]");
        var bar = root.querySelector("[data-quiz-progress]");
        var size = Math.min(10, data.questions.length);
        var queue = [];
        var i = 0;
        var known = 0;

        function start() {
            queue = data.questions.slice().sort(function () { return Math.random() - 0.5; }).slice(0, size);
            i = 0;
            known = 0;
            render();
        }
        function progress() {
            if (bar) bar.style.width = ((i / queue.length) * 100) + "%";
        }
        function render() {
            progress();
            if (i >= queue.length) {
                var pct = Math.round((known / queue.length) * 100);
                body.innerHTML =
                    '<p class="quiz-score">You reported knowing ' + known + " of " + queue.length + " (" + pct + "%).</p>" +
                    '<p class="hint">Self-reported. Review the question bank and flashcards for anything you missed.</p>' +
                    '<div class="tool-actions"><button class="btn btn-primary" data-quiz-restart>Try again</button>' +
                    '<a class="btn btn-secondary" href="/swift/interviews/#bank">Open question bank</a></div>';
                body.querySelector("[data-quiz-restart]").addEventListener("click", start);
                return;
            }
            var q = queue[i];
            body.innerHTML =
                metaChips(q) +
                '<p class="quiz-question">' + esc(q.question) + "</p>" +
                '<p class="quiz-hint">Answer out loud, then reveal the model answer and rate yourself honestly.</p>' +
                '<div class="quiz-answer-slot"></div>' +
                '<div class="tool-actions"><button class="btn btn-secondary" data-quiz-reveal>Reveal answer</button></div>';
            body.querySelector("[data-quiz-reveal]").addEventListener("click", function () {
                var slot = body.querySelector(".quiz-answer-slot");
                slot.innerHTML = answerBody(q);
                slot.querySelectorAll("pre code").forEach(function (c) { if (window.SwiftHub) window.SwiftHub.highlightCode(c); });
                this.parentElement.outerHTML =
                    '<div class="tool-actions">' +
                    '<span class="hint">Did you know it?</span>' +
                    '<button class="btn btn-primary" data-quiz-yes>Got it</button>' +
                    '<button class="btn btn-secondary" data-quiz-no>Review</button>' +
                    "</div>";
                body.querySelector("[data-quiz-yes]").addEventListener("click", function () { known++; i++; render(); });
                body.querySelector("[data-quiz-no]").addEventListener("click", function () { i++; render(); });
            });
        }
        start();
    }

    /* ---------------- Mock interview ---------------- */
    function initMock(data) {
        var root = document.querySelector("[data-mock]");
        if (!root) return;
        var setup = root.querySelector("[data-mock-setup]");
        var run = root.querySelector("[data-mock-run]");
        var categorySelect = root.querySelector("[data-mock-category]");
        if (categorySelect) {
            data.interviewCategories.forEach(function (c) {
                var o = document.createElement("option");
                o.value = c; o.textContent = c;
                categorySelect.appendChild(o);
            });
        }

        var timer = null;
        function clearTimer() { if (timer) { clearInterval(timer); timer = null; } }

        function start() {
            var count = Math.min(20, +root.querySelector("[data-mock-count]").value || 8);
            var difficulty = root.querySelector("[data-mock-difficulty]").value;
            var category = categorySelect ? categorySelect.value : "";
            var pool = data.questions.filter(function (q) {
                if (difficulty && q.difficulty !== difficulty) return false;
                if (category && q.category !== category) return false;
                return true;
            });
            if (!pool.length) { alert("No questions match those options."); return; }
            var queue = pool.sort(function () { return Math.random() - 0.5; }).slice(0, count);
            run.hidden = false;
            setup.hidden = true;
            var i = 0, got = 0, startedAt = Date.now();
            var elapsed = 0;
            clearTimer();
            var timerEl = document.createElement("span");
            timerEl.className = "mock-timer";
            timer = setInterval(function () {
                elapsed = Math.floor((Date.now() - startedAt) / 1000);
                timerEl.textContent = "Elapsed " + Math.floor(elapsed / 60) + ":" + String(elapsed % 60).padStart(2, "0");
            }, 500);

            function next() {
                if (i >= queue.length) {
                    clearTimer();
                    var mins = Math.floor(elapsed / 60);
                    var secs = elapsed % 60;
                    run.innerHTML =
                        '<div class="mock-question">Mock interview complete</div>' +
                        '<p>You rated yourself on ' + queue.length + " questions and reported knowing " + got + ".</p>" +
                        '<p class="hint">Time: ' + mins + "m " + secs + "s. Review anything you rated lower.</p>" +
                        '<div class="tool-actions"><button class="btn btn-primary" data-mock-again>Run another</button>' +
                        '<a class="btn btn-secondary" href="/swift/interviews/">Back to interview prep</a></div>';
                    storeSet("swift-mock-last", { date: new Date().toISOString(), total: queue.length, known: got, seconds: elapsed });
                    run.querySelector("[data-mock-again]").addEventListener("click", function () {
                        run.hidden = true; setup.hidden = false;
                    });
                    return;
                }
                var q = queue[i];
                run.innerHTML =
                    '<div class="tool-actions" style="justify-content:space-between"><span class="mock-progress">Question ' + (i + 1) + " of " + queue.length + "</span></div>" +
                    metaChips(q) +
                    '<p class="mock-question">' + esc(q.question) + "</p>" +
                    '<div class="mock-answer-slot"></div>' +
                    '<div class="tool-actions" data-mock-actions><button class="btn btn-secondary" data-mock-reveal>Reveal answer</button>' +
                    '<button class="btn btn-ghost" data-mock-skip>Skip</button></div>';
                var top = run.querySelector(".tool-actions");
                top.appendChild(timerEl);
                run.querySelector("[data-mock-reveal]").addEventListener("click", function () {
                    var slot = run.querySelector(".mock-answer-slot");
                    slot.innerHTML = '<div class="mock-answer">' + answerBody(q) + "</div>";
                    slot.querySelectorAll("pre code").forEach(function (c) { if (window.SwiftHub) window.SwiftHub.highlightCode(c); });
                    var actions = run.querySelector("[data-mock-actions]");
                    actions.innerHTML =
                        '<span class="hint">How did you do?</span>' +
                        '<button class="btn btn-primary" data-mock-yes>Knew it</button>' +
                        '<button class="btn btn-secondary" data-mock-no>Missed it</button>';
                    actions.querySelector("[data-mock-yes]").addEventListener("click", function () { got++; i++; next(); });
                    actions.querySelector("[data-mock-no]").addEventListener("click", function () { i++; next(); });
                });
                run.querySelector("[data-mock-skip]").addEventListener("click", function () { i++; next(); });
            }
            next();
        }

        root.querySelector("[data-mock-start]").addEventListener("click", start);
    }

    function init() {
        var data = window.__SWIFT_DATA__;
        if (!data) return;
        initBank(data);
        initFlashcards(data);
        initQuiz(data);
        initMock(data);

        // Practice mode tabs on the interviews page
        document.querySelectorAll("[data-iview]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var view = btn.getAttribute("data-iview");
                document.querySelectorAll("[data-iview]").forEach(function (b) { b.classList.toggle("active", b === btn); });
                document.querySelectorAll("[data-iview-panel]").forEach(function (p) {
                    var on = p.getAttribute("data-iview-panel") === view;
                    p.classList.toggle("active", on);
                    p.hidden = !on;
                });
            });
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
