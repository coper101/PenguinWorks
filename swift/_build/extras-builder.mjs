// Builds the non-article pages of the Swift Developer Hub: the hub homepage,
// recipes, notes, tools, interviews, mock interview, learning paths and tags.
// Invoked by build.mjs, which passes the shared template helpers.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export async function buildExtras(ctx) {
  const {
    OUT,
    head,
    topbar,
    footer,
    breadcrumbs,
    escapeHtml,
    renderMarkdown,
    renderInline,
    slugify,
    writePage,
    site,
    extras,
  } = ctx;

  const CONTENT = join(OUT, "_content");

  let count = 0;

  // -------------------------------------------------------------------------
  // Shared shell for "application" pages (tools, interviews, learn, mock)
  // -------------------------------------------------------------------------
  const appPage = ({ title, description, canonical, body, scripts = [], jsonld, wide = false, needsData = false }) => {
    return `<!doctype html>
<html lang="en">
<head>
${head({ title, description, canonical, jsonld })}
</head>
<body class="swift app-shell">
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="reading-progress" data-reading-progress aria-hidden="true"><span></span></div>
${topbar(canonical)}
    <main id="main" class="page${wide ? " page-wide" : ""}">
${breadcrumbs([{ label: "Swift Hub", url: "/swift/" }, { label: title.replace(/ — Swift Developer Hub$/, "") }])}
${body}
    </main>
${footer()}
${needsData ? '    <script defer src="/swift/data.js"></script>\n' : ""}${scripts.map((s) => `    <script defer src="${s}"></script>`).join("\n")}
</body>
</html>
`;
  };

  const docPage = ({ title, description, canonical, body, jsonld }) => {
    return `<!doctype html>
<html lang="en">
<head>
${head({ title, description, canonical, jsonld })}
</head>
<body class="swift">
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="reading-progress" data-reading-progress aria-hidden="true"><span></span></div>
${topbar(canonical)}
    <main id="main" class="page">
${breadcrumbs([{ label: "Swift Hub", url: "/swift/" }, { label: title.replace(/ — Swift Developer Hub$/, "") }])}
${body}
    </main>
${footer()}
</body>
</html>
`;
  };

  // -------------------------------------------------------------------------
  // Hub homepage
  // -------------------------------------------------------------------------
  const allTopics = site.flatMap((s) =>
    s.topics.map((t) => ({ ...t, section: s.slug, sectionTitle: s.title, url: `/swift/${s.slug}/${t.slug}/` }))
  );
  const recent = allTopics
    .filter((t) => t.lastReviewed)
    .sort((a, b) => (a.lastReviewed < b.lastReviewed ? 1 : -1))
    .slice(0, 6);

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const qotd = extras.questions[dayOfYear % extras.questions.length];

  const browseSections = site
    .map(
      (s) => `                    <a class="hub-card" href="/swift/${s.slug}/">
                        <span class="hub-card-icon" aria-hidden="true">${sectionGlyph(s.slug)}</span>
                        <h3>${escapeHtml(s.title)}</h3>
                        <p>${escapeHtml(s.summary.split(".")[0])}.</p>
                        <span class="hub-card-meta">${s.topics.length} articles · ${escapeHtml(s.difficulty)}</span>
                    </a>`
    )
    .join("\n");

  const featuredPaths = extras.learningPaths
    .slice(0, 3)
    .map(
      (p) => `                    <a class="path-card" href="/swift/learn/#${p.id}">
                        <span class="path-level" data-difficulty="${escapeHtml(p.level)}">${escapeHtml(p.level)}</span>
                        <h3>${escapeHtml(p.title)}</h3>
                        <p>${escapeHtml(p.summary)}</p>
                        <span class="path-meta">${p.steps.length} steps · ${escapeHtml(p.duration)}</span>
                    </a>`
    )
    .join("\n");

  const popularConcepts = [
    { t: "Optionals", u: "/swift/language/optionals/" },
    { t: "Copy-on-Write", u: "/swift/language/copy-on-write/" },
    { t: "Sendable", u: "/swift/concurrency/sendable/" },
    { t: "Actor reentrancy", u: "/swift/concurrency/actors-isolation/" },
    { t: "View identity", u: "/swift/swiftui/view-lifecycle-identity/" },
    { t: "@Observable", u: "/swift/swiftui/state-binding-observable-environment/" },
    { t: "Retain cycles", u: "/swift/performance/memory-leaks-retain-cycles/" },
    { t: "Image downsampling", u: "/swift/performance/image-decoding-caching/" },
    { t: "NavigationStack", u: "/swift/swiftui/navigationstack-navigationpath/" },
    { t: "Structured concurrency", u: "/swift/concurrency/structured-concurrency/" },
    { t: "Repository pattern", u: "/swift/architecture/repository-pattern/" },
    { t: "Time Profiler", u: "/swift/performance/time-profiler/" },
  ]
    .map((c) => `<a class="concept" href="${c.u}">${escapeHtml(c.t)}</a>`)
    .join("\n                        ");

  const perfGuides = [
    "time-profiler",
    "scrolling-performance",
    "memory-leaks-retain-cycles",
    "image-decoding-caching",
  ]
    .map((slug) => allTopics.find((t) => t.section === "performance" && t.slug === slug))
    .filter(Boolean)
    .map(
      (t) => `                    <a class="hub-card compact" href="${t.url}">
                        <h3>${escapeHtml(t.title)}</h3>
                        <p>${escapeHtml(t.summary)}</p>
                    </a>`
    )
    .join("\n");

  const toolCards = extras.tools
    .slice(0, 6)
    .map(
      (t) => `                    <a class="tool-card" href="/swift/tools/#${t.id}">
                        <h3>${escapeHtml(t.name)}</h3>
                        <p>${escapeHtml(t.summary)}</p>
                    </a>`
    )
    .join("\n");

  const recentList = recent
    .map(
      (t) => `                    <li>
                        <a href="${t.url}">
                            <span class="recent-title">${escapeHtml(t.title)}</span>
                            <span class="recent-section">${escapeHtml(t.sectionTitle)}</span>
                            <span class="recent-date">${escapeHtml(t.lastReviewed)}</span>
                        </a>
                    </li>`
    )
    .join("\n");

  const snippets = [
    { title: "Async fetch + decode", code: `func fetch<T: Decodable>(_ url: URL) async throws -> T {\n    let (data, _) = try await URLSession.shared.data(from: url)\n    return try JSONDecoder().decode(T.self, from: data)\n}` },
    { title: "Break a retain cycle", code: `onDone = { [weak self] in\n    guard let self else { return }\n    self.finish()\n}` },
    { title: "Observable model", code: `@Observable\nfinal class Model {\n    var items: [Item] = []\n}` },
    { title: "Stable list identity", code: `ForEach(items) { item in\n    Row(item: item)\n}` },
  ]
    .map(
      (s) => `                    <div class="snippet">
                        <div class="snippet-head"><span>${escapeHtml(s.title)}</span><button class="copy-code" type="button" data-copy>Copy</button></div>
                        <pre><code class="language-swift">${escapeHtml(s.code)}</code></pre>
                    </div>`
    )
    .join("\n");

  const hubJsonld = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Swift Developer Hub",
    url: "https://penguinworksco.work/swift/",
    publisher: { "@type": "Organization", name: "PenguinWorks" },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://penguinworksco.work/swift/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const hubBody = `        <section class="hub-hero">
            <div class="hub-hero-inner">
                <span class="hub-eyebrow">Swift · SwiftUI · Apple platforms</span>
                <h1>Master Swift. Build Better Apps.</h1>
                <p class="hub-lede">
                    A developer hub for learning Swift and SwiftUI, diagnosing
                    performance, structuring architecture and preparing for
                    interviews — documentation, an engineering handbook and an
                    interactive playground in one place.
                </p>
                <form class="hub-search" role="search" action="/swift/" data-hub-search>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    <input type="search" placeholder="Search 80+ articles, tools and interview questions…" aria-label="Search the Swift Developer Hub" data-search-input autocomplete="off" />
                    <kbd>/</kbd>
                    <div class="search-results" data-search-results hidden></div>
                </form>
                <div class="hub-actions">
                    <a class="btn btn-primary" href="/swift/learn/">Start learning</a>
                    <a class="btn btn-secondary" href="/swift/tools/">Open developer tools</a>
                    <a class="btn btn-ghost" href="/swift/interviews/">Prepare for interviews</a>
                </div>
                <p class="hub-brand-note">
                    A <a href="/">PenguinWorks</a> project · Part of the <a href="/view-graph/">ViewGraph</a> developer ecosystem
                </p>
            </div>
        </section>

        <section class="hub-section" aria-labelledby="paths-title">
            <div class="section-head">
                <h2 id="paths-title">Featured learning paths</h2>
                <p>Structured routes from beginner to advanced, with checkable progress.</p>
            </div>
            <div class="paths-grid">
${featuredPaths}
            </div>
        </section>

        <section class="hub-section" aria-labelledby="browse-title">
            <div class="section-head">
                <h2 id="browse-title">Browse by topic</h2>
                <p>Six documentation tracks covering the whole Apple development surface.</p>
            </div>
            <div class="hub-grid">
${browseSections}
            </div>
        </section>

        <section class="hub-section" aria-labelledby="concepts-title">
            <div class="section-head">
                <h2 id="concepts-title">Popular Swift concepts</h2>
                <p>The ideas developers look up most often.</p>
            </div>
            <div class="concept-cloud">
                        ${popularConcepts}
            </div>
        </section>

        <section class="hub-section" aria-labelledby="perf-title">
            <div class="section-head">
                <h2 id="perf-title">Featured performance guides</h2>
                <p>Symptoms, diagnostics and fixes for the problems that hurt most.</p>
            </div>
            <div class="hub-grid">
${perfGuides}
            </div>
        </section>

        <section class="hub-section" aria-labelledby="qotd-title">
            <div class="section-head">
                <h2 id="qotd-title">Interview question of the day</h2>
                <p>A new question each day, with a full answer and follow-ups.</p>
            </div>
            <div class="qotd" data-qotd data-id="${escapeHtml(qotd.id)}">
                <div class="qotd-meta">
                    <span class="chip chip-difficulty" data-difficulty="${escapeHtml(qotd.difficulty)}">${escapeHtml(qotd.difficulty)}</span>
                    <span class="chip">${escapeHtml(qotd.category)}</span>
                </div>
                <p class="qotd-question">${escapeHtml(qotd.question)}</p>
                <button class="btn btn-secondary" type="button" data-qotd-reveal>Reveal answer</button>
                <div class="qotd-answer" hidden>
                    ${qotd.answer.map((p) => `<p>${renderInline(p)}</p>`).join("\n                    ")}
                </div>
                <a class="qotd-more" href="/swift/interviews/#q-${escapeHtml(qotd.id)}">See all interview questions →</a>
            </div>
        </section>

        <section class="hub-section" aria-labelledby="tools-title">
            <div class="section-head">
                <h2 id="tools-title">Useful developer tools</h2>
                <p>Client-side utilities that never send your data anywhere.</p>
            </div>
            <div class="tools-grid">
${toolCards}
            </div>
            <a class="section-more" href="/swift/tools/">All 11 tools →</a>
        </section>

        <section class="hub-section" aria-labelledby="recent-title">
            <div class="section-head">
                <h2 id="recent-title">Recently updated articles</h2>
                <p>Freshly reviewed against the latest Swift and iOS releases.</p>
            </div>
            <ul class="recent-list">
${recentList}
            </ul>
        </section>

        <section class="hub-section" aria-labelledby="snippets-title">
            <div class="section-head">
                <h2 id="snippets-title">Quick-access code snippets</h2>
                <p>Copy-ready patterns for the tasks you do every day.</p>
            </div>
            <div class="snippet-grid">
${snippets}
            </div>
        </section>
`;

  writePage(
    "index.html",
    `<!doctype html>
<html lang="en">
<head>
${head({ title: "Swift Developer Hub — Master Swift. Build Better Apps.", description: "A developer hub for learning Swift and SwiftUI, diagnosing performance, structuring architecture and preparing for interviews. Documentation, tools and interview practice from PenguinWorks.", canonical: "/swift/", jsonld: hubJsonld })}
</head>
<body class="swift hub">
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="reading-progress" data-reading-progress aria-hidden="true"><span></span></div>
${topbar("/swift/")}
    <main id="main">
${hubBody}
    </main>
${footer()}
    <script defer src="/swift/hub.js"></script>
</body>
</html>
`
  );
  count++;

  // -------------------------------------------------------------------------
  // Recipes and Notes (rendered from markdown)
  // -------------------------------------------------------------------------
  const recipesParsed = parseMd(join(CONTENT, "extras", "recipes.md"));
  const notesParsed = parseMd(join(CONTENT, "extras", "notes.md"));

  const recipeNav = extras.recipes.items
    .map(
      (r) => `                <a class="toc-chip" data-category="${escapeHtml(r.category)}" href="#${r.anchor}">${escapeHtml(r.title)}</a>`
    )
    .join("\n");

  const recipesBody = `            <article class="article" data-reading>
                <header class="article-head">
                    <p class="article-kicker">Practice</p>
                    <h1>${escapeHtml(extras.recipes.title)}</h1>
                    <p class="article-lede">${escapeHtml(extras.recipes.summary)}</p>
                    <div class="article-meta">
                        <span class="chip chip-time">${extras.recipes.items.length} recipes</span>
                        <span class="chip">Swift 5.9+ · iOS 17</span>
                    </div>
                </header>
                <nav class="toc-chips" aria-label="Recipe categories" data-filter-group>
${recipeNav}
                </nav>
                <div class="article-body" data-filter-body>
${renderMarkdown(recipesParsed.body)}
                </div>
            </article>`;

  writePage(
    "recipes/index.html",
    docPage({
      title: "Code Recipes — Swift Developer Hub",
      description: extras.recipes.summary,
      canonical: "/swift/recipes/",
      body: recipesBody,
    })
  );
  count++;

  const notesBody = `            <article class="article" data-reading>
                <header class="article-head">
                    <p class="article-kicker">Practice</p>
                    <h1>${escapeHtml(extras.notes.title)}</h1>
                    <p class="article-lede">${escapeHtml(extras.notes.summary)}</p>
                </header>
                <div class="article-body">
${renderMarkdown(notesParsed.body)}
                </div>
            </article>`;

  writePage(
    "notes/index.html",
    docPage({
      title: "Developer Notes — Swift Developer Hub",
      description: extras.notes.summary,
      canonical: "/swift/notes/",
      body: notesBody,
    })
  );
  count++;

  // -------------------------------------------------------------------------
  // Tools
  // -------------------------------------------------------------------------
  const toolTabs = extras.tools
    .map(
      (t, i) =>
        `                <button class="tab${i === 0 ? " active" : ""}" type="button" role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${i === 0}" data-tool-tab="${t.id}">${escapeHtml(t.name.split(" ")[0])}</button>`
    )
    .join("\n");

  const toolPanels = extras.tools
    .map(
      (t, i) => `            <section class="tool-panel${i === 0 ? " active" : ""}" role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}" data-tool-panel="${t.id}"${i === 0 ? "" : " hidden"}>
                <header class="tool-head">
                    <h2>${escapeHtml(t.name)}</h2>
                    <p>${escapeHtml(t.summary)}</p>
                </header>
                <div class="tool-body" data-tool-body="${t.id}"></div>
            </section>`
    )
    .join("\n");

  const toolsBody = `            <div class="page-hero">
                <h1>Developer Tools</h1>
                <p>Eleven browser-based utilities for everyday Apple development. Everything runs client-side in your browser — nothing is uploaded.</p>
            </div>
            <div class="tabs" role="tablist" aria-label="Developer tools">
${toolTabs}
            </div>
            <div class="tool-panels">
${toolPanels}
            </div>`;

  writePage(
    "tools/index.html",
    appPage({
      title: "Developer Tools — Swift Developer Hub",
      description: "Browser-based Swift and iOS developer tools: JSON formatter, JSON to Codable generator, regex tester, date formatter, color converter, URL and Base64 encoders, UUID generator, mock JSON and version comparison.",
      canonical: "/swift/tools/",
      body: toolsBody,
      scripts: ["/swift/tools.js"],
      wide: true,
    })
  );
  count++;

  // -------------------------------------------------------------------------
  // Interviews
  // -------------------------------------------------------------------------
  const categoryChips = extras.interviewCategories
    .map(
      (c, i) =>
        `                <button class="tab${i === 0 ? " active" : ""}" type="button" role="tab" data-ifilter="${escapeHtml(c)}">${escapeHtml(c)}</button>`
    )
    .join("\n");

  const interviewBody = `            <div class="page-hero">
                <h1>Interview Preparation</h1>
                <p>${extras.questions.length} questions across categories and levels, with revealable answers, detailed explanations, code, common wrong answers and follow-ups. Practise with the bank, flashcards or a timed quiz.</p>
            </div>

            <div class="practice-modes" role="tablist" aria-label="Practice mode">
                <button class="tab active" type="button" data-iview="bank">Question bank</button>
                <button class="tab" type="button" data-iview="flashcards">Flashcards</button>
                <button class="tab" type="button" data-iview="quiz">Quiz mode</button>
            </div>

            <section class="iview active" data-iview-panel="bank">
                <div class="bank-controls">
                    <div class="filter-group" role="tablist" aria-label="Filter by category">
${categoryChips}
                    </div>
                    <label class="select-field">Difficulty
                        <select data-difficulty-filter>
                            <option value="">All</option>
                            <option>Junior</option>
                            <option>Mid</option>
                            <option>Senior</option>
                        </select>
                    </label>
                    <span class="result-count" data-bank-count></span>
                </div>
                <div class="bank" data-bank></div>
            </section>

            <section class="iview" data-iview-panel="flashcards" hidden>
                <div class="flashcard" data-flashcard>
                    <div class="flashcard-inner">
                        <div class="flashcard-face flashcard-front" data-flashcard-front>
                            <p class="flashcard-label">Question</p>
                            <p class="flashcard-question" data-flashcard-question></p>
                            <p class="flashcard-hint">Click to reveal the answer</p>
                        </div>
                        <div class="flashcard-face flashcard-back" data-flashcard-back>
                            <p class="flashcard-label">Answer</p>
                            <div class="flashcard-answer" data-flashcard-answer></div>
                        </div>
                    </div>
                </div>
                <div class="flashcard-controls">
                    <button class="btn btn-secondary" type="button" data-flashcard-shuffle>Shuffle</button>
                    <span class="flashcard-progress" data-flashcard-progress></span>
                    <button class="btn btn-secondary" type="button" data-flashcard-prev>Previous</button>
                    <button class="btn btn-primary" type="button" data-flashcard-next>Next</button>
                </div>
            </section>

            <section class="iview" data-iview-panel="quiz" hidden>
                <div class="quiz" data-quiz>
                    <div class="quiz-progress"><span data-quiz-progress></span></div>
                    <div class="quiz-body" data-quiz-body></div>
                </div>
            </section>`;

  writePage(
    "interviews/index.html",
    appPage({
      title: "Interview Preparation — Swift Developer Hub",
      description: "Swift, SwiftUI, concurrency, architecture, performance, system design and behavioral interview questions with revealable answers, flashcards and a quiz mode.",
      canonical: "/swift/interviews/",
      body: interviewBody,
      scripts: ["/swift/interviews.js"],
      needsData: true,
      wide: true,
    })
  );
  count++;

  // -------------------------------------------------------------------------
  // Mock interview
  // -------------------------------------------------------------------------
  const mockBody = `            <div class="page-hero">
                <h1>Mock Interview</h1>
                <p>A timed run through mixed-difficulty questions with instant feedback. Answer out loud or in your head, reveal the model answer, then rate yourself honestly. Your progress is stored locally.</p>
            </div>
            <div class="mock" data-mock>
                <div class="mock-setup" data-mock-setup>
                    <div class="mock-options">
                        <label class="select-field">Questions
                            <select data-mock-count>
                                <option value="5">5</option>
                                <option value="8" selected>8</option>
                                <option value="12">12</option>
                            </select>
                        </label>
                        <label class="select-field">Difficulty
                            <select data-mock-difficulty>
                                <option value="">Mixed</option>
                                <option>Junior</option>
                                <option>Mid</option>
                                <option>Senior</option>
                            </select>
                        </label>
                        <label class="select-field">Category
                            <select data-mock-category><option value="">All</option></select>
                        </label>
                    </div>
                    <button class="btn btn-primary" type="button" data-mock-start>Start mock interview</button>
                </div>
                <div class="mock-run" data-mock-run hidden></div>
            </div>`;

  writePage(
    "mock-interview/index.html",
    appPage({
      title: "Mock Interview — Swift Developer Hub",
      description: "A timed, mixed-difficulty mock interview for Apple-platform roles with instant feedback and locally stored progress.",
      canonical: "/swift/mock-interview/",
      body: mockBody,
      scripts: ["/swift/interviews.js"],
      needsData: true,
      wide: true,
    })
  );
  count++;

  // -------------------------------------------------------------------------
  // Learning paths
  // -------------------------------------------------------------------------
  const learnBody = `            <div class="page-hero">
                <h1>Learning Paths</h1>
                <p>Six structured roadmaps from beginner to advanced. Tick items off as you go — your progress is saved locally in your browser.</p>
            </div>
            <div class="learn-toolbar">
                <span data-learn-summary></span>
                <button class="btn btn-ghost" type="button" data-learn-reset>Reset all progress</button>
            </div>
            <div class="paths" data-paths></div>`;

  writePage(
    "learn/index.html",
    appPage({
      title: "Learning Paths — Swift Developer Hub",
      description: "Beginner, intermediate and advanced Swift, SwiftUI, performance and interview roadmaps with checkable progress stored locally.",
      canonical: "/swift/learn/",
      body: learnBody,
      scripts: ["/swift/learn.js"],
      needsData: true,
      wide: true,
    })
  );
  count++;

  // -------------------------------------------------------------------------
  // Tags
  // -------------------------------------------------------------------------
  const tagsBody = `            <div class="page-hero">
                <h1>Browse by Tag</h1>
                <p>Every article, grouped by topic tag. Select a tag to filter.</p>
            </div>
            <div class="tag-cloud" data-tag-cloud></div>
            <div class="tag-results" data-tag-results></div>`;

  writePage(
    "tags/index.html",
    appPage({
      title: "Browse by Tag — Swift Developer Hub",
      description: "Browse every Swift Developer Hub article by topic tag.",
      canonical: "/swift/tags/",
      body: tagsBody,
      scripts: ["/swift/tags.js"],
      wide: true,
    })
  );
  count++;

  // -------------------------------------------------------------------------
  // Runtime data (interviews, paths, categories)
  // -------------------------------------------------------------------------
  writePage(
    "data.js",
    `/* Generated by swift/_build/extras-builder.mjs — do not edit by hand. */\nwindow.__SWIFT_DATA__ = ${JSON.stringify(
      {
        questions: extras.questions,
        learningPaths: extras.learningPaths,
        interviewCategories: extras.interviewCategories,
        tools: extras.tools,
      }
    )};\n`
  );

  return count;
}

function parseMd(path) {
  const raw = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  return { body: m ? raw.slice(m[0].length) : raw };
}

function sectionGlyph(slug) {
  const glyphs = {
    language: "⌘",
    swiftui: "▦",
    concurrency: "⇄",
    architecture: "◇",
    performance: "⚡",
    debugging: "⌁",
  };
  return glyphs[slug] || "•";
}
