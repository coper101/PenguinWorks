// Builds the published-only Data Pill articles index and feed.
//
// Usage: node data-pill/articles/scripts/build-index.js
//
// Each published article lives in data-pill/articles/<slug>/ with a meta.json
// file and an index.html page. Directories starting with "_" and entries with
// "draft": true are ignored, so drafts can be reviewed without leaking into the
// public index or the app feed.

const fs = require("fs");
const path = require("path");

const articlesRoot = path.resolve(__dirname, "..");
const templatePath = path.join(articlesRoot, "_index.template.html");
const indexPath = path.join(articlesRoot, "index.html");
const feedPath = path.join(articlesRoot, "index.json");
const siteBase = "https://penguinworksco.work/data-pill/articles/";

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function readPublishedArticles() {
  const entries = fs
    .readdirSync(articlesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("_") && name !== "scripts" && name !== "assets");

  const articles = [];
  const seenMonths = new Map();

  for (const dir of entries) {
    const metaPath = path.join(articlesRoot, dir, "meta.json");
    const pagePath = path.join(articlesRoot, dir, "index.html");
    if (!fs.existsSync(metaPath)) {
      continue;
    }

    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    } catch (error) {
      fail(`${dir}/meta.json is not valid JSON: ${error.message}`);
    }

    if (meta.draft === true) {
      continue;
    }

    for (const field of ["title", "summary", "published", "category", "readingMinutes"]) {
      if (!meta[field]) {
        fail(`${dir}/meta.json is missing "${field}"`);
      }
    }
    if (meta.slug && meta.slug !== dir) {
      fail(`${dir}/meta.json slug must match its directory name`);
    }
    if (!fs.existsSync(pagePath)) {
      fail(`${dir}/index.html is missing`);
    }

    const published = new Date(`${meta.published}T00:00:00Z`);
    if (Number.isNaN(published.getTime())) {
      fail(`${dir}/meta.json has an invalid published date`);
    }

    const monthKey = meta.published.slice(0, 7);
    if (seenMonths.has(monthKey)) {
      fail(
        `duplicate article month ${monthKey}: ${seenMonths.get(monthKey)} and ${dir}. Publish one article per month.`
      );
    }
    seenMonths.set(monthKey, dir);

    articles.push({
      slug: dir,
      title: meta.title,
      summary: meta.summary,
      url: `${siteBase}${dir}/`,
      published: meta.published,
      updated: meta.updated || meta.published,
      category: meta.category,
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      readingMinutes: Number(meta.readingMinutes),
      image: meta.image || null,
    });
  }

  return articles.sort((a, b) => {
    if (a.published !== b.published) return a.published < b.published ? 1 : -1;
    return a.title.localeCompare(b.title);
  });
}

function formatDate(value) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderArticleList(articles) {
  if (articles.length === 0) {
    return `<p class="empty-state">The first monthly guide is being prepared. Check back soon.</p>`;
  }

  return articles
    .map(
      (article) => `                <article class="article-card">
                    <p class="article-meta"><span>${escapeHTML(article.category)}</span><span>${formatDate(article.published)}</span><span>${article.readingMinutes} min read</span></p>
                    <h2><a href="${escapeHTML(article.slug)}/">${escapeHTML(article.title)}</a></h2>
                    <p>${escapeHTML(article.summary)}</p>
                    <a class="read-link" href="${escapeHTML(article.slug)}/">Read the guide <span aria-hidden="true">→</span></a>
                </article>`
    )
    .join("\n");
}

function renderArchive(articles) {
  if (articles.length === 0) {
    return `<p class="empty-state">No published guides yet.</p>`;
  }

  const byYear = new Map();
  for (const article of articles) {
    const year = article.published.slice(0, 4);
    const month = article.published.slice(5, 7);
    if (!byYear.has(year)) byYear.set(year, new Map());
    const months = byYear.get(year);
    months.set(month, (months.get(month) || 0) + 1);
  }

  const years = Array.from(byYear.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  return years
    .map(([year, months]) => {
      const items = Array.from(months.entries())
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([month, count]) => {
          const label = new Date(`${year}-${month}-01T00:00:00Z`).toLocaleDateString("en-GB", {
            month: "long",
            timeZone: "UTC",
          });
          return `<li><span>${label}</span><span>${count} guide${count === 1 ? "" : "s"}</span></li>`;
        })
        .join("\n                        ");
      return `                <div class="archive-year">
                    <h3>${year}</h3>
                    <ul>
                        ${items}
                    </ul>
                </div>`;
    })
    .join("\n");
}

function main() {
  if (!fs.existsSync(templatePath)) {
    fail("_index.template.html is missing");
  }

  const articles = readPublishedArticles();
  const template = fs.readFileSync(templatePath, "utf8");
  const html = template
    .replaceAll("{{ARTICLE_LIST}}", renderArticleList(articles))
    .replaceAll("{{ARCHIVE}}", renderArchive(articles))
    .replaceAll("{{ARTICLE_COUNT}}", String(articles.length))
    .replaceAll("{{GENERATED}}", new Date().toISOString().slice(0, 10));

  fs.writeFileSync(indexPath, html);

  const feed = {
    version: 1,
    generated: new Date().toISOString().slice(0, 10),
    articles,
  };
  fs.writeFileSync(feedPath, `${JSON.stringify(feed, null, 2)}\n`);

  console.log(`✓ Published ${articles.length} article(s): index.html and index.json updated`);
  for (const article of articles) {
    console.log(`  - ${article.published} ${article.slug}`);
  }
}

main();
