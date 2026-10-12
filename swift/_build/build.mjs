// Zero-dependency static site generator for the /swift Developer Hub.
//
// The PenguinWorks site has no build step by convention. This script is a
// local authoring tool only: it reads Markdown + data modules in ../_content
// and writes plain static HTML into ../. The generated files are what ships.
//
// Usage:  node swift/_build/build.mjs
//
// Only the Node standard library is used, so the repository gains no
// dependency. Re-run after editing anything under swift/_content.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, ".."); // swift/
const OUT = ROOT;
const CONTENT = join(__dirname, "..", "_content");

const config = (await import("../_content/config.mjs")).default;

const SITE_ORIGIN = "https://penguinworksco.work";
const YEAR = 2026;

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// Minimal YAML-ish front matter parser: key: value lines, comma lists, and
// block scalars are not needed. Values may be quoted.
function parseFrontMatter(raw) {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: text };
  const data = {};
  const listKeys = new Set(["tags", "prerequisites", "related"]);
  for (const line of m[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (/^\[.*\]$/.test(value)) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (listKeys.has(key)) {
      value = value.split(",").map((v) => v.trim()).filter(Boolean);
    }
    data[key] = value;
  }
  return { data, body: text.slice(m[0].length) };
}

// ---------------------------------------------------------------------------
// Markdown renderer (small, well-defined subset)
// ---------------------------------------------------------------------------

function renderInline(text) {
  const codes = [];
  let out = String(text).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0000`;
  });

  out = escapeHtml(out);

  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const external = /^https?:/i.test(href);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${href}"${attrs}>${label}</a>`;
  });

  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${escapeHtml(codes[+i])}</code>`);
  return out;
}

function codeBlock(code, lang) {
  const language = lang || "text";
  return `<div class="code-block" data-lang="${escapeHtml(language)}"><div class="code-head"><span class="code-lang">${escapeHtml(
    language
  )}</span><button class="copy-code" type="button" data-copy aria-label="Copy code to clipboard">Copy</button></div><pre><code class="language-${escapeHtml(
    language
  )}">${escapeHtml(code)}</code></pre></div>`;
}

function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const usedIds = new Map();
  let i = 0;

  const uniqueId = (base) => {
    let id = base || "section";
    if (usedIds.has(id)) {
      const n = usedIds.get(id) + 1;
      usedIds.set(id, n);
      id = `${id}-${n}`;
    } else {
      usedIds.set(id, 1);
    }
    return id;
  };

  const isBlockStart = (l) =>
    /^```/.test(l) ||
    /^~~~/.test(l) ||
    /^#{2,4}\s/.test(l) ||
    /^:::\s*\w/.test(l) ||
    /^>\s?/.test(l) ||
    /^\s*([-*]|\d+\.)\s+/.test(l) ||
    /^\s*---+\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    const fence = line.match(/^(?:```|~~~)(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1] || "";
      const buf = [];
      i++;
      while (i < lines.length && !/^(?:```|~~~)\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      html.push(codeBlock(buf.join("\n"), lang));
      continue;
    }

    const callout = line.match(/^:::\s*(\w+)\s*(.*)$/);
    if (callout) {
      const type = callout[1].toLowerCase();
      const title = callout[2].trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      html.push(
        `<div class="callout callout-${escapeHtml(type)}">${
          title ? `<p class="callout-title">${renderInline(title)}</p>` : ""
        }${renderMarkdown(buf.join("\n"))}</div>`
      );
      continue;
    }

    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      const id = uniqueId(slugify(text));
      html.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      html.push("<hr />");
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<blockquote>${renderMarkdown(buf.join("\n"))}</blockquote>`);
      continue;
    }

    if (
      /\|/.test(line) &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) &&
      /-/.test(lines[i + 1])
    ) {
      const head = line
        .split("|")
        .map((c) => c.trim())
        .filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));
      i += 2;
      const rows = [];
      while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim() !== "") {
        const cells = lines[i].split("|").map((c) => c.trim());
        if (cells[0] === "") cells.shift();
        if (cells[cells.length - 1] === "") cells.pop();
        rows.push(cells);
        i++;
      }
      html.push(
        `<div class="table-wrap"><table><thead><tr>${head
          .map((c) => `<th>${renderInline(c)}</th>`)
          .join("")}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${renderInline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`
      );
      continue;
    }

    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      const baseIndent = line.match(/^(\s*)/)[1].length;
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        const itemLine = lines[i];
        const indent = itemLine.match(/^(\s*)/)[1].length;
        if (indent > baseIndent) {
          const nested = [];
          while (
            i < lines.length &&
            /^\s*([-*]|\d+\.)\s+/.test(lines[i]) &&
            lines[i].match(/^(\s*)/)[1].length > baseIndent
          ) {
            nested.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ""));
            i++;
          }
          if (items.length) {
            items[items.length - 1] += `<ul>${nested
              .map((n) => `<li>${renderInline(n)}</li>`)
              .join("")}</ul>`;
          }
          continue;
        }
        items.push(renderInline(itemLine.replace(/^\s*([-*]|\d+\.)\s+/, "")));
        i++;
      }
      const tag = ordered ? "ol" : "ul";
      html.push(`<${tag}>${items.map((it) => `<li>${it}</li>`).join("")}</${tag}>`);
      continue;
    }

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    const buf = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    html.push(`<p>${renderInline(buf.join(" "))}</p>`);
  }

  return html.join("\n");
}

function extractToc(renderedHtml) {
  const toc = [];
  const re = /<h([23])\s+id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(renderedHtml))) {
    toc.push({ level: Number(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, "") });
  }
  return toc;
}

function estimateReadingTime(body) {
  const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 180));
}

// ---------------------------------------------------------------------------
// Content loading
// ---------------------------------------------------------------------------

function loadSections() {
  return config.sections.map((section) => {
    const dir = join(CONTENT, "sections", section.slug);
    const indexPath = join(dir, "_index.md");
    let meta = {};
    let intro = "";
    if (existsSync(indexPath)) {
      const parsed = parseFrontMatter(readFileSync(indexPath, "utf8"));
      meta = parsed.data;
      intro = parsed.body;
    }
    const order = section.topics || [];
    const topics = order.map((slug) => {
      const file = join(dir, `${slug}.md`);
      if (!existsSync(file)) {
        throw new Error(`Missing article: ${relative(CONTENT, file)}`);
      }
      const { data, body } = parseFrontMatter(readFileSync(file, "utf8"));
      return {
        slug,
        title: data.title || slug,
        difficulty: data.difficulty || "Intermediate",
        tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
        summary: data.summary || "",
        prerequisites: data.prerequisites
          ? Array.isArray(data.prerequisites)
            ? data.prerequisites
            : [data.prerequisites]
          : [],
        related: data.related ? (Array.isArray(data.related) ? data.related : [data.related]) : [],
        version: data.version || "",
        lastReviewed: data.lastReviewed || "",
        readingTime: data.readingTime ? Number(data.readingTime) : estimateReadingTime(body),
        body,
      };
    });
    return {
      slug: section.slug,
      title: section.title,
      nav: section.nav || section.title,
      icon: section.icon || "",
      summary: meta.summary || section.summary || "",
      difficulty: meta.difficulty || section.difficulty || "All levels",
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : section.tags || [],
      intro,
      topics,
    };
  });
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

function findSiblings(section, topic) {
  const idx = section.topics.findIndex((t) => t.slug === topic.slug);
  return {
    prev: idx > 0 ? section.topics[idx - 1] : null,
    next: idx < section.topics.length - 1 ? section.topics[idx + 1] : null,
  };
}

function relatedLinks(site, topic) {
  const keys = topic.related || [];
  const out = [];
  for (const section of site) {
    for (const t of section.topics) {
      if (keys.includes(`${section.slug}/${t.slug}`)) {
        out.push({
          title: t.title,
          url: `/swift/${section.slug}/${t.slug}/`,
          section: section.title,
          difficulty: t.difficulty,
        });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

function head({ title, description, canonical, jsonld }) {
  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0a0d14" media="(prefers-color-scheme: dark)" />
    <meta name="color-scheme" content="light dark" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${SITE_ORIGIN}${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/swift/assets/favicon.svg" />
    <link rel="apple-touch-icon" href="/swift/assets/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Swift Developer Hub" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${SITE_ORIGIN}${canonical}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <link rel="stylesheet" href="/swift/styles.css" />
    <script>try{var t=localStorage.getItem("swift-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>
${jsonld ? `    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n` : ""}    <script defer src="/swift/search-index.js"></script>
    <script defer src="/swift/app.js"></script>`;
}

function topbar(currentUrl) {
  const links = [
    { href: "/swift/", label: "Home", key: "/swift/" },
    { href: "/swift/learn/", label: "Learn", key: "/swift/learn/" },
    { href: "/swift/tools/", label: "Tools", key: "/swift/tools/" },
    { href: "/swift/interviews/", label: "Interviews", key: "/swift/interviews/" },
    { href: "/swift/recipes/", label: "Recipes", key: "/swift/recipes/" },
    { href: "/swift/notes/", label: "Notes", key: "/swift/notes/" },
  ];
  return `    <header class="topbar" data-topbar>
        <button class="icon-btn menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="sidebar" aria-label="Toggle documentation menu">
            <span class="menu-icon" aria-hidden="true"></span>
        </button>
        <a class="brand" href="/swift/" aria-label="Swift Developer Hub home">
            <span class="brand-mark" aria-hidden="true">S</span>
            <span class="brand-text">Swift Developer Hub</span>
            <span class="brand-by">by PenguinWorks</span>
        </a>
        <div class="search" data-search>
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input type="search" id="global-search" data-search-input placeholder="Search topics, tags, concepts…" autocomplete="off" spellcheck="false" aria-label="Search the Swift Developer Hub" aria-controls="search-results" aria-expanded="false" />
            <kbd class="search-kbd" aria-hidden="true">/</kbd>
            <div class="search-results" id="search-results" data-search-results hidden></div>
        </div>
        <nav class="topbar-nav" aria-label="Primary">
${links
  .map(
    (l) =>
      `            <a href="${l.href}"${
        currentUrl === l.key ? ' aria-current="page"' : ""
      }>${l.label}</a>`
  )
  .join("\n")}
        </nav>
        <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Switch theme" title="Toggle light and dark theme">
            <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </button>
    </header>`;
}

function sidebar(site, currentUrl) {
  const groups = site
    .map((section) => {
      const sectionActive = currentUrl.startsWith(`/swift/${section.slug}/`);
      const open = sectionActive ? " open" : "";
      const topics = section.topics
        .map((t) => {
          const url = `/swift/${section.slug}/${t.slug}/`;
          const active = url === currentUrl;
          return `                    <li><a href="${url}"${
            active ? ' class="active" aria-current="page"' : ""
          }>${escapeHtml(t.title)}</a></li>`;
        })
        .join("\n");
      return `            <details class="nav-group"${open}>
                <summary><span>${escapeHtml(section.title)}</span><span class="chev" aria-hidden="true"></span></summary>
                <ul>
${topics}
                </ul>
                <a class="nav-overview" href="/swift/${section.slug}/">Section overview</a>
            </details>`;
    })
    .join("\n");

  return `        <aside class="sidebar" id="sidebar" data-sidebar aria-label="Documentation">
            <nav class="sidebar-nav">
                <p class="sidebar-label">Documentation</p>
${groups}
                <p class="sidebar-label">Practice</p>
                <ul class="nav-flat">
                    <li><a href="/swift/learn/"${
                      currentUrl === "/swift/learn/" ? ' class="active" aria-current="page"' : ""
                    }>Learning paths</a></li>
                    <li><a href="/swift/interviews/"${
                      currentUrl === "/swift/interviews/"
                        ? ' class="active" aria-current="page"'
                        : ""
                    }>Interview preparation</a></li>
                    <li><a href="/swift/mock-interview/"${
                      currentUrl === "/swift/mock-interview/"
                        ? ' class="active" aria-current="page"'
                        : ""
                    }>Mock interview</a></li>
                    <li><a href="/swift/recipes/"${
                      currentUrl === "/swift/recipes/"
                        ? ' class="active" aria-current="page"'
                        : ""
                    }>Code recipes</a></li>
                    <li><a href="/swift/tools/"${
                      currentUrl === "/swift/tools/" ? ' class="active" aria-current="page"' : ""
                    }>Developer tools</a></li>
                    <li><a href="/swift/notes/"${
                      currentUrl === "/swift/notes/" ? ' class="active" aria-current="page"' : ""
                    }>Developer notes</a></li>
                    <li><a href="/swift/tags/"${
                      currentUrl === "/swift/tags/" ? ' class="active" aria-current="page"' : ""
                    }>Browse by tag</a></li>
                </ul>
            </nav>
        </aside>`;
}

function footer() {
  return `    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-brand">
                <a href="/swift/" class="footer-logo"><span class="brand-mark" aria-hidden="true">S</span> Swift Developer Hub</a>
                <p>An engineering handbook, interview platform and interactive playground for Swift, SwiftUI and Apple-platform developers. Built by PenguinWorks.</p>
            </div>
            <nav class="footer-col" aria-label="Documentation">
                <h2>Documentation</h2>
                <ul>
                    <li><a href="/swift/language/">Swift Fundamentals</a></li>
                    <li><a href="/swift/swiftui/">SwiftUI</a></li>
                    <li><a href="/swift/concurrency/">Concurrency</a></li>
                    <li><a href="/swift/architecture/">Architecture</a></li>
                    <li><a href="/swift/performance/">Performance</a></li>
                    <li><a href="/swift/debugging/">Debugging</a></li>
                </ul>
            </nav>
            <nav class="footer-col" aria-label="Practice">
                <h2>Practice</h2>
                <ul>
                    <li><a href="/swift/learn/">Learning paths</a></li>
                    <li><a href="/swift/interviews/">Interview preparation</a></li>
                    <li><a href="/swift/recipes/">Code recipes</a></li>
                    <li><a href="/swift/tools/">Developer tools</a></li>
                    <li><a href="/swift/notes/">Developer notes</a></li>
                </ul>
            </nav>
            <nav class="footer-col" aria-label="PenguinWorks">
                <h2>PenguinWorks</h2>
                <ul>
                    <li><a href="/">Main website</a></li>
                    <li><a href="/view-graph/">ViewGraph</a></li>
                    <li><a href="/swift/">Swift Developer Hub</a></li>
                </ul>
            </nav>
        </div>
        <div class="footer-base">
            <span>© ${YEAR} PenguinWorks. Swift, SwiftUI and Apple are trademarks of Apple Inc. This independent site is not affiliated with Apple.</span>
            <a class="footer-back" href="/swift/">Back to the hub</a>
        </div>
    </footer>
    <button class="to-top" type="button" data-to-top aria-label="Back to top" hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`;
}

function breadcrumbs(crumbs) {
  const parts = crumbs.map((c, idx) => {
    const last = idx === crumbs.length - 1;
    if (last || !c.url) return `<li aria-current="page">${escapeHtml(c.label)}</li>`;
    return `<li><a href="${c.url}">${escapeHtml(c.label)}</a></li>`;
  });
  return `            <nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${parts.join(
    '<li class="sep" aria-hidden="true">/</li>'
  )}</ol></nav>`;
}

function metaChips(topic) {
  const chips = [];
  chips.push(
    `<span class="chip chip-difficulty" data-difficulty="${escapeHtml(
      topic.difficulty
    )}">${escapeHtml(topic.difficulty)}</span>`
  );
  if (topic.readingTime)
    chips.push(
      `<span class="chip chip-time">${escapeHtml(String(topic.readingTime))} min read</span>`
    );
  if (topic.version) chips.push(`<span class="chip chip-version">${escapeHtml(topic.version)}</span>`);
  if (topic.lastReviewed)
    chips.push(
      `<span class="chip chip-reviewed">Reviewed ${escapeHtml(topic.lastReviewed)}</span>`
    );
  return chips.join("\n                    ");
}

function tagList(tags) {
  return (tags || [])
    .map((t) => `<a class="tag" href="/swift/tags/#${slugify(t)}">#${escapeHtml(t)}</a>`)
    .join(" ");
}

function pager(site, section, topic) {
  const { prev, next } = findSiblings(section, topic);
  const cell = (item, dir) => {
    if (!item) return `<span class="pager-spacer" aria-hidden="true"></span>`;
    const label = dir === "prev" ? "Previous" : "Next";
    const arrow =
      dir === "prev"
        ? '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H4M7.5 4l-4 4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return `<a class="pager-link pager-${dir}" href="/swift/${section.slug}/${item.slug}/">
                    <span class="pager-dir">${arrow} ${label}</span>
                    <span class="pager-title">${escapeHtml(item.title)}</span>
                </a>`;
  };
  return `            <nav class="pager" aria-label="Article navigation">
                ${cell(prev, "prev")}
                ${cell(next, "next")}
            </nav>`;
}

function tocBlock(toc) {
  if (!toc.length) return "";
  const items = toc
    .map(
      (t) =>
        `                    <li class="toc-l${t.level}"><a href="#${t.id}">${escapeHtml(
          t.text
        )}</a></li>`
    )
    .join("\n");
  return `        <aside class="toc" data-toc aria-label="On this page">
            <div class="toc-inner">
                <p class="toc-label">On this page</p>
                <ul>
${items}
                </ul>
                <div class="toc-actions">
                    <button class="toc-bookmark" type="button" data-bookmark aria-pressed="false" title="Bookmark this article">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
                        <span data-bookmark-label>Bookmark</span>
                    </button>
                    <div class="progress-mini" aria-hidden="true"><span data-progress-bar></span></div>
                </div>
            </div>
        </aside>`;
}

// ---------------------------------------------------------------------------
// Page renderers
// ---------------------------------------------------------------------------

function renderDocPage(site, { section, topic, bodyHtml, toc, crumbs }) {
  const canonical = `/swift/${section.slug}/${topic.slug}/`;
  const description = topic.summary || topic.title;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: topic.title,
    description,
    about: topic.tags || [],
    datePublished: "2026-01-15",
    dateModified: topic.lastReviewed || "2026-09-30",
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "PenguinWorks" },
    keywords: (topic.tags || []).join(", "),
  };
  const related = relatedLinks(site, topic);

  const prerequisites =
    topic.prerequisites && topic.prerequisites.length
      ? `<section class="article-section article-prereq" aria-labelledby="prereq">
                            <h2 id="prereq">Prerequisites</h2>
                            <ul class="prereq-list">${topic.prerequisites
                              .map((p) => `<li>${renderInline(p)}</li>`)
                              .join("")}</ul>
                        </section>`
      : "";

  const relatedBlock = related.length
    ? `<section class="article-section related" aria-labelledby="related">
                            <h2 id="related">Related articles</h2>
                            <div class="related-grid">
${related
  .map(
    (r) => `                                <a class="related-card" href="${r.url}">
                                    <span class="related-section">${escapeHtml(r.section)}</span>
                                    <span class="related-title">${escapeHtml(r.title)}</span>
                                    <span class="chip chip-difficulty small" data-difficulty="${escapeHtml(
                                      r.difficulty
                                    )}">${escapeHtml(r.difficulty)}</span>
                                </a>`
  )
  .join("\n")}
                            </div>
                        </section>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
${head({ title: `${topic.title} — Swift Developer Hub`, description, canonical, jsonld })}
</head>
<body class="swift">
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="reading-progress" data-reading-progress aria-hidden="true"><span></span></div>
${topbar(canonical)}
    <div class="layout">
${sidebar(site, canonical)}
        <div class="content-shell">
            <div class="content">
                <main id="main">
${breadcrumbs(crumbs)}
                    <article class="article" data-article data-reading>
                        <header class="article-head">
                            <p class="article-kicker">${escapeHtml(section.title)}</p>
                            <h1>${escapeHtml(topic.title)}</h1>
                            <p class="article-lede">${renderInline(topic.summary || "")}</p>
                            <div class="article-meta">
                                ${metaChips(topic)}
                            </div>
                            <div class="article-tags">
                                ${tagList(topic.tags)}
                            </div>
                        </header>
${prerequisites}
                        <div class="article-body">
${bodyHtml}
                        </div>
${relatedBlock}
                    </article>
${pager(site, section, topic)}
                </main>
            </div>
${tocBlock(toc)}
        </div>
    </div>
${footer()}
</body>
</html>
`;
}

function renderSectionPage(section) {
  const canonical = `/swift/${section.slug}/`;
  const topics = section.topics
    .map(
      (t) => `                <a class="topic-card" href="/swift/${section.slug}/${t.slug}/">
                    <div class="topic-card-head">
                        <h3>${escapeHtml(t.title)}</h3>
                        <span class="chip chip-difficulty small" data-difficulty="${escapeHtml(
                          t.difficulty
                        )}">${escapeHtml(t.difficulty)}</span>
                    </div>
                    <p>${escapeHtml(t.summary || "")}</p>
                    <div class="topic-card-foot">
                        <span class="topic-card-tags">${(t.tags || [])
                          .slice(0, 3)
                          .map((x) => `<span class="tag small">#${escapeHtml(x)}</span>`)
                          .join(" ")}</span>
                        <span class="topic-card-time">${t.readingTime || 8} min</span>
                    </div>
                </a>`
    )
    .join("\n");

  const intro = renderMarkdown(section.intro || "");
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: section.title,
    description: section.summary,
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "PenguinWorks" },
  };

  return `<!doctype html>
<html lang="en">
<head>
${head({ title: `${section.title} — Swift Developer Hub`, description: section.summary, canonical, jsonld })}
</head>
<body class="swift">
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="reading-progress" data-reading-progress aria-hidden="true"><span></span></div>
${topbar(canonical)}
    <div class="layout">
${sidebar(site, canonical)}
        <div class="content-shell">
            <div class="content">
                <main id="main">
${breadcrumbs([{ label: "Swift Hub", url: "/swift/" }, { label: section.title }])}
                    <article class="article section-page" data-article data-reading>
                        <header class="article-head">
                            <p class="article-kicker">Documentation</p>
                            <h1>${escapeHtml(section.title)}</h1>
                            <p class="article-lede">${escapeHtml(section.summary)}</p>
                            <div class="article-meta">
                                <span class="chip chip-difficulty" data-difficulty="${escapeHtml(
                                  section.difficulty
                                )}">${escapeHtml(section.difficulty)}</span>
                                <span class="chip chip-time">${section.topics.length} articles</span>
                            </div>
                            <div class="article-tags">${tagList(section.tags)}</div>
                        </header>
                        <div class="article-body">
${intro}
                        </div>
                        <section class="article-section" aria-labelledby="topics">
                            <h2 id="topics">Topics in this section</h2>
                            <div class="topic-grid">
${topics}
                            </div>
                        </section>
                    </article>
                </main>
            </div>
        </div>
    </div>
${footer()}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

function writePage(relPath, html) {
  const full = join(OUT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, "utf8");
}

function buildSearchIndex(site, extras) {
  const entries = [];
  for (const section of site) {
    entries.push({
      title: section.title,
      url: `/swift/${section.slug}/`,
      section: section.title,
      kind: "section",
      difficulty: section.difficulty,
      tags: section.tags,
      summary: section.summary,
    });
    for (const t of section.topics) {
      entries.push({
        title: t.title,
        url: `/swift/${section.slug}/${t.slug}/`,
        section: section.title,
        kind: "article",
        difficulty: t.difficulty,
        tags: t.tags,
        summary: t.summary,
      });
    }
  }
  for (const page of extras.searchEntries || []) entries.push(page);
  return entries;
}

function buildSitemap(entries) {
  const urls = ["/swift/", ...entries.map((e) => e.url)];
  const unique = [...new Set(urls)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (u) =>
      `  <url><loc>${SITE_ORIGIN}${u}</loc><lastmod>2026-09-30</lastmod><changefreq>weekly</changefreq><priority>${
        u === "/swift/" ? "1.0" : "0.7"
      }</priority></url>`
  )
  .join("\n")}
</urlset>
`;
}

console.log("Building Swift Developer Hub…");

const site = loadSections();
let pageCount = 0;

for (const section of site) {
  writePage(`${section.slug}/index.html`, renderSectionPage(section));
  pageCount++;
  for (const topic of section.topics) {
    const rendered = renderMarkdown(topic.body);
    const toc = extractToc(rendered);
    const crumbs = [
      { label: "Swift Hub", url: "/swift/" },
      { label: section.title, url: `/swift/${section.slug}/` },
      { label: topic.title },
    ];
    writePage(
      `${section.slug}/${topic.slug}/index.html`,
      renderDocPage(site, { section, topic, bodyHtml: rendered, toc, crumbs })
    );
    pageCount++;
  }
}

const extras = (await import("../_content/extras.mjs")).default;
const searchEntries = buildSearchIndex(site, extras);

writeFileSync(
  join(OUT, "search-index.js"),
  `/* Generated by swift/_build/build.mjs — do not edit by hand. */\nwindow.__SWIFT_INDEX__ = ${JSON.stringify(
    searchEntries
  )};\n`,
  "utf8"
);
writeFileSync(join(OUT, "sitemap.xml"), buildSitemap(searchEntries), "utf8");

console.log(`Wrote ${pageCount} documentation pages + search index + sitemap.`);

const { buildExtras } = await import("./extras-builder.mjs");
const extraCount = await buildExtras({
  OUT,
  head,
  topbar,
  sidebar,
  footer,
  breadcrumbs,
  escapeHtml,
  renderMarkdown,
  renderInline,
  slugify,
  writePage,
  site,
  extras,
  SITE_ORIGIN,
  YEAR,
});
console.log(`Wrote ${extraCount} extra pages.`);
console.log("Done.");
