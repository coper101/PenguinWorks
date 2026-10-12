/* Developer tools — all processing happens in the browser. */
(function () {
    "use strict";

    function esc(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        return Promise.resolve();
    }

    function flash(btn, msg) {
        var prev = btn.textContent;
        btn.textContent = msg || "Copied";
        setTimeout(function () { btn.textContent = prev; }, 1200);
    }

    /* ------------------------------------------------------------------ */
    /* JSON formatter / validator                                          */
    /* ------------------------------------------------------------------ */
    function toolJson(c) {
        c.innerHTML =
            '<div class="tool-row">' +
            '<div class="field"><label for="t-json-in">JSON input</label>' +
            '<textarea id="t-json-in" rows="14" spellcheck="false" placeholder=\'{"name": "Ada", "age": 36}\'></textarea></div>' +
            '<div class="field"><label>Output</label><div class="result" id="t-json-out">Formatted or minified JSON appears here.</div></div>' +
            "</div>" +
            '<div class="tool-actions">' +
            '<button class="btn btn-primary" data-act="format">Format</button>' +
            '<button class="btn btn-secondary" data-act="minify">Minify</button>' +
            '<button class="btn btn-secondary" data-act="validate">Validate</button>' +
            '<button class="btn btn-ghost" data-act="copy">Copy output</button>' +
            "</div>";

        var input = c.querySelector("#t-json-in");
        var out = c.querySelector("#t-json-out");

        function parse() {
            var text = input.value.trim();
            if (!text) throw new Error("Input is empty.");
            return JSON.parse(text);
        }
        function setResult(text, cls) {
            out.className = "result" + (cls ? " " + cls : "");
            out.textContent = text;
        }
        c.querySelector('[data-act="format"]').addEventListener("click", function () {
            try { setResult(JSON.stringify(parse(), null, 2), ""); }
            catch (e) { setResult("Error: " + e.message, "error"); }
        });
        c.querySelector('[data-act="minify"]').addEventListener("click", function () {
            try { setResult(JSON.stringify(parse()), ""); }
            catch (e) { setResult("Error: " + e.message, "error"); }
        });
        c.querySelector('[data-act="validate"]').addEventListener("click", function () {
            try { parse(); setResult("Valid JSON.", "ok"); }
            catch (e) { setResult("Invalid JSON: " + e.message, "error"); }
        });
        c.querySelector('[data-act="copy"]').addEventListener("click", function () {
            copyText(out.textContent);
            flash(this);
        });
    }

    /* ------------------------------------------------------------------ */
    /* JSON to Codable                                                     */
    /* ------------------------------------------------------------------ */
    function toolCodable(c) {
        c.innerHTML =
            '<div class="field"><label for="t-cod-in">JSON sample</label>' +
            '<textarea id="t-cod-in" rows="10" spellcheck="false" placeholder=\'{"id": 1, "title": "Hello", "author": {"name": "Ada"}, "tags": ["a","b"]}\'></textarea></div>' +
            '<div class="tool-actions">' +
            '<button class="btn btn-primary" data-act="gen">Generate Codable structs</button>' +
            '<button class="btn btn-ghost" data-act="copy">Copy output</button>' +
            "</div>" +
            '<div class="tool-head"><h2 style="font-size:16px">Output</h2></div>' +
            '<div class="code-block"><div class="code-head"><span class="code-lang">swift</span></div><pre><code class="language-swift" id="t-cod-out"></code></pre></div>';

        var input = c.querySelector("#t-cod-in");
        var out = c.querySelector("#t-cod-out");

        function singular(name) {
            if (/ies$/.test(name)) return name.replace(/ies$/, "y");
            if (/s$/.test(name) && !/ss$/.test(name)) return name.replace(/s$/, "");
            return name + "Item";
        }
        function cap(s) {
            return s.replace(/[^a-zA-Z0-9]+(.)?/g, function (_, ch) { return ch ? ch.toUpperCase() : ""; })
                .replace(/^(.)/, function (m) { return m.toUpperCase(); });
        }
        function swiftType(value, key) {
            if (value === null) return "String?";
            if (Array.isArray(value)) {
                if (!value.length) return "[Any]";
                return "[" + swiftType(value[0], key).replace(/\?$/, "") + "]";
            }
            switch (typeof value) {
                case "string":
                    if (/(url|uri|link|href)$/i.test(key)) return "URL";
                    if (/(_at|date|time|created|updated)$/i.test(key) && /^\d{4}-\d{2}-\d{2}/.test(value)) return "Date";
                    return "String";
                case "number":
                    return Number.isInteger(value) ? "Int" : "Double";
                case "boolean":
                    return "Bool";
                case "object":
                    return cap(key);
                default:
                    return "String";
            }
        }

        function generate(obj, name, defs) {
            var lines = [];
            Object.keys(obj).forEach(function (key) {
                var value = obj[key];
                var type = swiftType(value, key);
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    generate(value, type, defs);
                } else if (Array.isArray(value) && value.length && value[0] && typeof value[0] === "object" && !Array.isArray(value[0])) {
                    generate(value[0], singular(key).replace(/^./, function (m) { return m.toUpperCase(); }), defs);
                }
                lines.push("    let " + key + ": " + type);
            });
            defs.push("struct " + name + ": Codable {\n" + lines.join("\n") + "\n}");
        }

        c.querySelector('[data-act="gen"]').addEventListener("click", function () {
            try {
                var value = JSON.parse(input.value);
                var defs = [];
                if (Array.isArray(value) && value.length) {
                    generate(value[0], "Item", defs);
                } else if (value && typeof value === "object") {
                    generate(value, "Root", defs);
                } else {
                    throw new Error("Provide a JSON object or an array of objects.");
                }
                defs.reverse();
                out.textContent = defs.join("\n\n");
                if (window.SwiftHub) window.SwiftHub.highlightCode(out);
            } catch (e) {
                out.textContent = "// Error: " + e.message;
            }
        });
        c.querySelector('[data-act="copy"]').addEventListener("click", function () {
            copyText(out.textContent);
            flash(this);
        });
    }

    /* ------------------------------------------------------------------ */
    /* Swift snippet formatter (lightweight)                               */
    /* ------------------------------------------------------------------ */
    function toolFormatter(c) {
        c.innerHTML =
            '<div class="field"><label for="t-fmt-in">Swift snippet</label>' +
            '<textarea id="t-fmt-in" rows="12" spellcheck="false" placeholder="func greet(name: String) {\nprint(&quot;Hi&quot;)\n}"></textarea></div>' +
            '<div class="checkbox-grid">' +
            '<label><input type="checkbox" id="t-fmt-indent" checked /> Normalize indentation</label>' +
            '<label><input type="checkbox" id="t-fmt-trim" checked /> Trim trailing whitespace</label>' +
            '<label><input type="checkbox" id="t-fmt-blank" checked /> Collapse blank lines</label>' +
            "</div>" +
            '<div class="tool-actions"><button class="btn btn-primary" data-act="fmt">Format</button>' +
            '<button class="btn btn-ghost" data-act="copy">Copy output</button></div>' +
            '<div class="field"><label>Output</label><div class="result" id="t-fmt-out"></div></div>';

        var input = c.querySelector("#t-fmt-in");
        var out = c.querySelector("#t-fmt-out");

        function format(text, opts) {
            var lines = text.replace(/\r\n/g, "\n").split("\n");
            var depth = 0;
            var result = [];
            var lastBlank = false;
            lines.forEach(function (line) {
                var t = line.replace(/\t/g, "    ");
                if (opts.trim) t = t.replace(/\s+$/, "");
                var trimmed = t.trim();
                if (opts.indent) {
                    var opens = (trimmed.match(/[{([]/g) || []).length;
                    var closes = (trimmed.match(/[})\]]/g) || []).length;
                    var leadingClose = /^[})\]]/.test(trimmed) ? 1 : 0;
                    var level = Math.max(0, depth - leadingClose);
                    t = trimmed ? "    ".repeat(level) + trimmed : "";
                    depth = Math.max(0, depth + opens - closes);
                }
                if (opts.blank && t.trim() === "") {
                    if (lastBlank) return;
                    lastBlank = true;
                } else {
                    lastBlank = false;
                }
                result.push(t);
            });
            while (result.length && result[result.length - 1].trim() === "") result.pop();
            return result.join("\n");
        }

        c.querySelector('[data-act="fmt"]').addEventListener("click", function () {
            out.className = "result";
            out.textContent = format(input.value, {
                indent: c.querySelector("#t-fmt-indent").checked,
                trim: c.querySelector("#t-fmt-trim").checked,
                blank: c.querySelector("#t-fmt-blank").checked,
            });
        });
        c.querySelector('[data-act="copy"]').addEventListener("click", function () {
            copyText(out.textContent);
            flash(this);
        });
    }

    /* ------------------------------------------------------------------ */
    /* Regex tester                                                        */
    /* ------------------------------------------------------------------ */
    function toolRegex(c) {
        c.innerHTML =
            '<div class="field"><label for="t-re-pattern">Pattern</label>' +
            '<input type="text" id="t-re-pattern" value="\\b\\w+@\\w+\\.\\w+\\b" spellcheck="false" /></div>' +
            '<div class="checkbox-grid">' +
            ["g", "i", "m", "s"].map(function (f) {
                return '<label><input type="checkbox" data-flag="' + f + '"' + (f === "g" ? " checked" : "") + " /> " + f + "</label>";
            }).join("") +
            "</div>" +
            '<div class="field"><label for="t-re-text">Test text</label>' +
            '<textarea id="t-re-text" rows="7" spellcheck="false">Contact ada@example.com or grace@navy.mil.</textarea></div>' +
            '<div class="tool-actions"><button class="btn btn-primary" data-act="run">Test</button></div>' +
            '<div class="field"><label>Matches</label><div class="result" id="t-re-out"></div></div>';

        var out = c.querySelector("#t-re-out");
        c.querySelector('[data-act="run"]').addEventListener("click", function () {
            var pattern = c.querySelector("#t-re-pattern").value;
            var text = c.querySelector("#t-re-text").value;
            var flags = "";
            c.querySelectorAll("[data-flag]").forEach(function (b) { if (b.checked) flags += b.getAttribute("data-flag"); });
            out.className = "result";
            try {
                var re = new RegExp(pattern, flags);
                var matches = [];
                var m;
                if (flags.indexOf("g") !== -1) {
                    while ((m = re.exec(text))) {
                        matches.push(m);
                        if (m.index === re.lastIndex) re.lastIndex++;
                    }
                } else {
                    m = re.exec(text);
                    if (m) matches.push(m);
                }
                if (!matches.length) { out.textContent = "No matches."; return; }
                var highlighted = esc(text).replace(/\u0000/g, "");
                matches.forEach(function (mm) {
                    highlighted = highlighted.replace(esc(mm[0]), '<mark style="background:var(--accent-soft);color:var(--accent)">' + "$&" + "</mark>");
                });
                var summary = matches
                    .map(function (mm, i) {
                        var groups = mm.slice(1).map(function (g, gi) { return "\n    group " + (gi + 1) + ": " + g; }).join("");
                        return (i + 1) + ". \"" + mm[0] + "\" at index " + mm.index + groups;
                    })
                    .join("\n");
                out.innerHTML = matches.length + " match(es):\n" + esc(summary) + "\n\n--- annotated ---\n" + highlighted;
            } catch (e) {
                out.className = "result error";
                out.textContent = "Invalid pattern: " + e.message;
            }
        });
    }

    /* ------------------------------------------------------------------ */
    /* Date formatter playground                                           */
    /* ------------------------------------------------------------------ */
    function toolDate(c) {
        var now = new Date();
        var local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        c.innerHTML =
            '<div class="tool-row">' +
            '<div class="field"><label for="t-date-value">Date and time</label><input type="datetime-local" id="t-date-value" value="' + local + '" /></div>' +
            '<div class="field"><label for="t-date-pattern">Pattern</label><input type="text" id="t-date-pattern" value="yyyy-MM-dd HH:mm:ss" spellcheck="false" /></div>' +
            "</div>" +
            '<div class="field"><label for="t-date-locale">Locale</label><select id="t-date-locale">' +
            '<option value="en-US">English (US)</option><option value="de-DE">German</option><option value="zh-CN">Chinese</option><option value="tr-TR">Turkish</option><option value="fil-PH">Filipino</option>' +
            "</select></div>" +
            '<div class="field"><label>Output</label><div class="result" id="t-date-out"></div></div>' +
            '<p class="hint">Tokens: yyyy yy MMMM MMM MM M dd d EEEE EEE HH H hh h mm m ss s a XXX</p>';

        function pad(n, w) { return String(n).padStart(w, "0"); }
        function format(date, pattern, locale) {
            var monthsLong = [], monthsShort = [], daysLong = [], daysShort = [];
            for (var i = 0; i < 12; i++) {
                monthsLong.push(new Date(2020, i, 1).toLocaleString(locale, { month: "long" }));
                monthsShort.push(new Date(2020, i, 1).toLocaleString(locale, { month: "short" }));
            }
            for (var j = 0; j < 7; j++) {
                daysLong.push(new Date(2020, 5, 7 + j).toLocaleString(locale, { weekday: "long" }));
                daysShort.push(new Date(2020, 5, 7 + j).toLocaleString(locale, { weekday: "short" }));
            }
            var h = date.getHours();
            var tokens = {
                yyyy: String(date.getFullYear()),
                yy: pad(date.getFullYear() % 100, 2),
                MMMM: monthsLong[date.getMonth()],
                MMM: monthsShort[date.getMonth()],
                MM: pad(date.getMonth() + 1, 2),
                M: String(date.getMonth() + 1),
                dd: pad(date.getDate(), 2),
                d: String(date.getDate()),
                EEEE: daysLong[date.getDay()],
                EEE: daysShort[date.getDay()],
                HH: pad(h, 2),
                H: String(h),
                hh: pad(h % 12 || 12, 2),
                h: String(h % 12 || 12),
                mm: pad(date.getMinutes(), 2),
                m: String(date.getMinutes()),
                ss: pad(date.getSeconds(), 2),
                s: String(date.getSeconds()),
                a: h < 12 ? "AM" : "PM",
                XXX: (function () { var off = -date.getTimezoneOffset(); var sign = off >= 0 ? "+" : "-"; off = Math.abs(off); return sign + pad(Math.floor(off / 60), 2) + ":" + pad(off % 60, 2); })(),
            };
            return pattern.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|HH|H|hh|h|mm|m|ss|s|a|XXX/g, function (t) {
                return tokens[t] !== undefined ? tokens[t] : t;
            });
        }

        var value = c.querySelector("#t-date-value");
        var pattern = c.querySelector("#t-date-pattern");
        var locale = c.querySelector("#t-date-locale");
        var out = c.querySelector("#t-date-out");
        function run() {
            var date = value.value ? new Date(value.value) : new Date();
            if (isNaN(date.getTime())) { out.textContent = "Invalid date."; return; }
            out.textContent = format(date, pattern.value, locale.value);
        }
        [value, pattern, locale].forEach(function (n) { n.addEventListener("input", run); });
        run();
    }

    /* ------------------------------------------------------------------ */
    /* Color converter                                                     */
    /* ------------------------------------------------------------------ */
    function toolColor(c) {
        c.innerHTML =
            '<div class="tool-row">' +
            '<div class="field"><label for="t-color-hex">Hex</label><input type="text" id="t-color-hex" value="#F0512D" spellcheck="false" /></div>' +
            '<div class="field"><label>RGB (0–255)</label><div class="tool-actions">' +
            '<input type="number" id="t-color-r" min="0" max="255" value="240" style="width:80px" />' +
            '<input type="number" id="t-color-g" min="0" max="255" value="81" style="width:80px" />' +
            '<input type="number" id="t-color-b" min="0" max="255" value="45" style="width:80px" />' +
            "</div></div>" +
            "</div>" +
            '<div class="tool-row">' +
            '<div class="field"><label>HSL</label><div class="result" id="t-color-hsl"></div></div>' +
            '<div class="field"><label>SwiftUI</label><div class="result" id="t-color-swift"></div></div>' +
            "</div>" +
            '<div class="swatch"><div class="swatch-color" id="t-color-preview" style="height:64px"></div><div class="swatch-label" id="t-color-prevhex">#F0512D</div></div>';

        var hex = c.querySelector("#t-color-hex");
        var r = c.querySelector("#t-color-r"), g = c.querySelector("#t-color-g"), b = c.querySelector("#t-color-b");
        var hslOut = c.querySelector("#t-color-hsl"), swiftOut = c.querySelector("#t-color-swift");
        var preview = c.querySelector("#t-color-preview"), prevHex = c.querySelector("#t-color-prevhex");

        function toHex(n) { return n.toString(16).padStart(2, "0"); }
        function rgbToHsl(ri, gi, bi) {
            ri /= 255; gi /= 255; bi /= 255;
            var max = Math.max(ri, gi, bi), min = Math.min(ri, gi, bi);
            var h = 0, s = 0, l = (max + min) / 2;
            if (max !== min) {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                if (max === ri) h = (gi - bi) / d + (gi < bi ? 6 : 0);
                else if (max === gi) h = (bi - ri) / d + 2;
                else h = (ri - gi) / d + 4;
                h /= 6;
            }
            return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
        }
        function parseHex(value) {
            var m = /^#?([0-9a-f]{6})$/i.exec(value.trim());
            if (!m) return null;
            var num = parseInt(m[1], 16);
            return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
        }
        function sync(fromHex) {
            var rr, gg, bb;
            if (fromHex) {
                var parsed = parseHex(hex.value);
                if (!parsed) { hex.value = hex.value; return; }
                rr = parsed.r; gg = parsed.g; bb = parsed.b;
                r.value = rr; g.value = gg; b.value = bb;
            } else {
                rr = Math.min(255, Math.max(0, +r.value || 0));
                gg = Math.min(255, Math.max(0, +g.value || 0));
                bb = Math.min(255, Math.max(0, +b.value || 0));
                hex.value = "#" + toHex(rr) + toHex(gg) + toHex(bb);
            }
            var hsl = rgbToHsl(rr, gg, bb);
            var hexVal = "#" + toHex(rr) + toHex(gg) + toHex(bb);
            hslOut.textContent = "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)\n" + hsl.h + "° " + hsl.s + "% " + hsl.l + "%";
            swiftOut.textContent = "Color(red: " + (rr / 255).toFixed(3) + ", green: " + (gg / 255).toFixed(3) + ", blue: " + (bb / 255).toFixed(3) + ")";
            preview.style.background = hexVal;
            prevHex.textContent = hexVal.toUpperCase();
        }
        hex.addEventListener("input", function () { sync(true); });
        [r, g, b].forEach(function (n) { n.addEventListener("input", function () { sync(false); }); });
        sync(true);
    }

    /* ------------------------------------------------------------------ */
    /* URL encoder / decoder                                               */
    /* ------------------------------------------------------------------ */
    function toolUrl(c) {
        c.innerHTML =
            '<div class="field"><label for="t-url-in">Input</label>' +
            '<textarea id="t-url-in" rows="5" spellcheck="false" placeholder="https://example.com/search?q=swift concurrency">https://example.com/search?q=swift concurrency</textarea></div>' +
            '<div class="tool-actions">' +
            '<button class="btn btn-primary" data-act="component">Encode component</button>' +
            '<button class="btn btn-secondary" data-act="uri">Encode full URI</button>' +
            '<button class="btn btn-secondary" data-act="decode">Decode</button>' +
            '<button class="btn btn-ghost" data-act="copy">Copy</button>' +
            "</div>" +
            '<div class="field"><label>Output</label><div class="result" id="t-url-out"></div></div>';

        var input = c.querySelector("#t-url-in");
        var out = c.querySelector("#t-url-out");
        function act(fn) {
            try { out.className = "result"; out.textContent = fn(input.value); }
            catch (e) { out.className = "result error"; out.textContent = "Error: " + e.message; }
        }
        c.querySelector('[data-act="component"]').addEventListener("click", function () { act(encodeURIComponent); });
        c.querySelector('[data-act="uri"]').addEventListener("click", function () { act(encodeURI); });
        c.querySelector('[data-act="decode"]').addEventListener("click", function () { act(decodeURIComponent); });
        c.querySelector('[data-act="copy"]').addEventListener("click", function () { copyText(out.textContent); flash(this); });
    }

    /* ------------------------------------------------------------------ */
    /* Base64 encoder / decoder                                            */
    /* ------------------------------------------------------------------ */
    function toolBase64(c) {
        c.innerHTML =
            '<div class="field"><label for="t-b64-in">Text or Base64</label>' +
            '<textarea id="t-b64-in" rows="6" spellcheck="false">Hello, Swift!</textarea></div>' +
            '<div class="tool-actions">' +
            '<button class="btn btn-primary" data-act="enc">Encode</button>' +
            '<button class="btn btn-secondary" data-act="dec">Decode</button>' +
            '<button class="btn btn-ghost" data-act="copy">Copy</button>' +
            "</div>" +
            '<div class="field"><label>Output</label><div class="result" id="t-b64-out"></div></div>';

        var input = c.querySelector("#t-b64-in");
        var out = c.querySelector("#t-b64-out");
        function encode(s) {
            var bytes = new TextEncoder().encode(s);
            var bin = "";
            bytes.forEach(function (x) { bin += String.fromCharCode(x); });
            return btoa(bin);
        }
        function decode(s) {
            var bin = atob(s.trim());
            var bytes = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            return new TextDecoder().decode(bytes);
        }
        c.querySelector('[data-act="enc"]').addEventListener("click", function () {
            try { out.className = "result"; out.textContent = encode(input.value); }
            catch (e) { out.className = "result error"; out.textContent = "Error: " + e.message; }
        });
        c.querySelector('[data-act="dec"]').addEventListener("click", function () {
            try { out.className = "result"; out.textContent = decode(input.value); }
            catch (e) { out.className = "result error"; out.textContent = "Error: not valid Base64."; }
        });
        c.querySelector('[data-act="copy"]').addEventListener("click", function () { copyText(out.textContent); flash(this); });
    }

    /* ------------------------------------------------------------------ */
    /* UUID generator                                                      */
    /* ------------------------------------------------------------------ */
    function toolUuid(c) {
        c.innerHTML =
            '<div class="tool-row">' +
            '<div class="field"><label for="t-uuid-count">How many</label><input type="number" id="t-uuid-count" min="1" max="100" value="5" /></div>' +
            '<div class="field"><label>Format</label><select id="t-uuid-case"><option value="lower">lowercase</option><option value="upper">UPPERCASE</option></select></div>' +
            "</div>" +
            '<div class="tool-actions"><button class="btn btn-primary" data-act="gen">Generate</button>' +
            '<button class="btn btn-ghost" data-act="copy">Copy all</button></div>' +
            '<div class="field"><label>UUIDs</label><div class="result" id="t-uuid-out"></div></div>';

        function uuid() {
            if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
            var bytes = new Uint8Array(16);
            (window.crypto || {}).getRandomValues ? crypto.getRandomValues(bytes) : bytes.forEach(function (_, i) { bytes[i] = Math.floor(Math.random() * 256); });
            bytes[6] = (bytes[6] & 0x0f) | 0x40;
            bytes[8] = (bytes[8] & 0x3f) | 0x80;
            var hexv = Array.prototype.map.call(bytes, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
            return hexv.slice(0, 8) + "-" + hexv.slice(8, 12) + "-" + hexv.slice(12, 16) + "-" + hexv.slice(16, 20) + "-" + hexv.slice(20);
        }
        var out = c.querySelector("#t-uuid-out");
        function run() {
            var n = Math.min(100, Math.max(1, +c.querySelector("#t-uuid-count").value || 1));
            var upper = c.querySelector("#t-uuid-case").value === "upper";
            var list = [];
            for (var i = 0; i < n; i++) list.push(upper ? uuid().toUpperCase() : uuid());
            out.textContent = list.join("\n");
        }
        c.querySelector('[data-act="gen"]').addEventListener("click", run);
        c.querySelector('[data-act="copy"]').addEventListener("click", function () { copyText(out.textContent); flash(this); });
        run();
    }

    /* ------------------------------------------------------------------ */
    /* Mock JSON generator                                                 */
    /* ------------------------------------------------------------------ */
    function toolMockJson(c) {
        c.innerHTML =
            '<div class="tool-row">' +
            '<div class="field"><label for="t-mock-fields">Fields (one per line: name: type)</label>' +
            '<textarea id="t-mock-fields" rows="8" spellcheck="false">id: uuid\nname: string\nemail: email\nage: number\nisActive: bool\ncreatedAt: date</textarea>' +
            '<p class="hint">Types: string, number, bool, date, uuid, email, url, name, city</p></div>' +
            '<div class="field"><label for="t-mock-count">Number of records</label><input type="number" id="t-mock-count" min="1" max="50" value="3" /></div>' +
            "</div>" +
            '<div class="tool-actions"><button class="btn btn-primary" data-act="gen">Generate JSON</button>' +
            '<button class="btn btn-ghost" data-act="copy">Copy</button></div>' +
            '<div class="field"><label>Output</label><div class="result" id="t-mock-out"></div></div>';

        var firstNames = ["Ada", "Grace", "Alan", "Linus", "Margaret", "Donald", "Barbara", "Edsger"];
        var lastNames = ["Lovelace", "Hopper", "Turing", "Torvalds", "Hamilton", "Knuth", "Liskov", "Dijkstra"];
        var cities = ["Amsterdam", "Kyoto", "Lisbon", "Nairobi", "Reykjavik", "Taipei", "Bogotá", "Helsinki"];
        function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
        function genValue(type) {
            switch (type) {
                case "number": return Math.floor(Math.random() * 100);
                case "bool": return Math.random() > 0.5;
                case "date": return new Date(Date.now() - Math.random() * 1e10).toISOString();
                case "uuid": return uuidGen();
                case "email": return (pick(firstNames) + "." + pick(lastNames) + "@example.com").toLowerCase();
                case "url": return "https://example.com/" + Math.random().toString(36).slice(2, 8);
                case "name": return pick(firstNames) + " " + pick(lastNames);
                case "city": return pick(cities);
                default: return "lorem " + Math.random().toString(36).slice(2, 7);
            }
        }
        function uuidGen() {
            if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (ch) {
                var r = (Math.random() * 16) | 0;
                var v = ch === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }
        var out = c.querySelector("#t-mock-out");
        c.querySelector('[data-act="gen"]').addEventListener("click", function () {
            try {
                var fields = c.querySelector("#t-mock-fields").value.split("\n").map(function (line) {
                    var m = line.split(":");
                    if (m.length < 2) return null;
                    return { name: m[0].trim(), type: m[1].trim().toLowerCase() };
                }).filter(Boolean);
                var n = Math.min(50, Math.max(1, +c.querySelector("#t-mock-count").value || 1));
                var records = [];
                for (var i = 0; i < n; i++) {
                    var obj = {};
                    fields.forEach(function (f) { obj[f.name] = genValue(f.type); });
                    records.push(obj);
                }
                out.className = "result";
                out.textContent = JSON.stringify(records, null, 2);
            } catch (e) {
                out.className = "result error";
                out.textContent = "Error: " + e.message;
            }
        });
        c.querySelector('[data-act="copy"]').addEventListener("click", function () { copyText(out.textContent); flash(this); });
    }

    /* ------------------------------------------------------------------ */
    /* Version comparison                                                  */
    /* ------------------------------------------------------------------ */
    function toolVersion(c) {
        c.innerHTML =
            '<div class="tool-row">' +
            '<div class="field"><label for="t-ver-a">Version A</label><input type="text" id="t-ver-a" value="2.4.0" spellcheck="false" /></div>' +
            '<div class="field"><label for="t-ver-b">Version B</label><input type="text" id="t-ver-b" value="2.10.1" spellcheck="false" /></div>' +
            "</div>" +
            '<div class="field"><label>Comparison</label><div class="result" id="t-ver-out"></div></div>' +
            '<p class="hint">Compares numeric segments left to right, so 2.10.1 is newer than 2.4.0.</p>';

        var a = c.querySelector("#t-ver-a");
        var b = c.querySelector("#t-ver-b");
        var out = c.querySelector("#t-ver-out");
        function cmp(x, y) {
            var pa = x.trim().split(/[.\-+]/);
            var pb = y.trim().split(/[.\-+]/);
            var len = Math.max(pa.length, pb.length);
            for (var i = 0; i < len; i++) {
                var na = pa[i] === undefined ? 0 : (isNaN(+pa[i]) ? pa[i] : +pa[i]);
                var nb = pb[i] === undefined ? 0 : (isNaN(+pb[i]) ? pb[i] : +pb[i]);
                if (na > nb) return 1;
                if (na < nb) return -1;
            }
            return 0;
        }
        function run() {
            var r = cmp(a.value, b.value);
            out.textContent = r > 0 ? a.value + " is newer than " + b.value
                : r < 0 ? a.value + " is older than " + b.value
                : a.value + " and " + b.value + " are equal";
        }
        a.addEventListener("input", run);
        b.addEventListener("input", run);
        run();
    }

    /* ------------------------------------------------------------------ */
    var BUILDERS = {
        json: toolJson,
        codable: toolCodable,
        formatter: toolFormatter,
        regex: toolRegex,
        date: toolDate,
        color: toolColor,
        url: toolUrl,
        base64: toolBase64,
        uuid: toolUuid,
        mockjson: toolMockJson,
        version: toolVersion,
    };

    function activate(id) {
        document.querySelectorAll("[data-tool-tab]").forEach(function (t) {
            t.classList.toggle("active", t.getAttribute("data-tool-tab") === id);
            t.setAttribute("aria-selected", String(t.getAttribute("data-tool-tab") === id));
        });
        document.querySelectorAll("[data-tool-panel]").forEach(function (p) {
            var on = p.getAttribute("data-tool-panel") === id;
            p.classList.toggle("active", on);
            p.hidden = !on;
        });
    }

    function init() {
        var tabs = document.querySelectorAll("[data-tool-tab]");
        if (!tabs.length) return;
        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var id = tab.getAttribute("data-tool-tab");
                activate(id);
                if (history.replaceState) history.replaceState(null, "", "#" + id);
            });
        });
        document.querySelectorAll("[data-tool-body]").forEach(function (body) {
            var id = body.getAttribute("data-tool-body");
            if (BUILDERS[id] && !body.dataset.built) {
                BUILDERS[id](body);
                body.dataset.built = "1";
            }
        });
        var hash = location.hash.slice(1);
        if (hash && BUILDERS[hash]) activate(hash);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
