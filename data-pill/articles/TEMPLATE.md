# Article template

Copy this folder structure into `data-pill/articles/<slug>/` and replace the
placeholders. Keep the canonical URL, Open Graph tags, and JSON-LD in sync with
`meta.json`.

## meta.json

```json
{
  "slug": "<slug>",
  "title": "<title>",
  "summary": "<one or two sentence summary>",
  "published": "YYYY-MM-DD",
  "updated": "YYYY-MM-DD",
  "category": "<category>",
  "tags": ["<tag>"],
  "readingMinutes": 7,
  "draft": true
}
```

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><title> - Data Pill</title>
    <meta name="description" content="<summary>">
    <link rel="canonical" href="https://penguinworksco.work/data-pill/articles/<slug>/">
    <meta property="og:type" content="article">
    <meta property="og:title" content="<title>">
    <meta property="og:description" content="<summary>">
    <meta property="og:url" content="https://penguinworksco.work/data-pill/articles/<slug>/">
    <meta property="article:published_time" content="YYYY-MM-DD">
    <meta property="article:modified_time" content="YYYY-MM-DD">
    <link rel="icon" type="image/png" href="../../assets/data-pill-icon.png">
    <link rel="stylesheet" href="../assets/articles.css">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "<title>",
        "description": "<summary>",
        "datePublished": "YYYY-MM-DD",
        "dateModified": "YYYY-MM-DD",
        "author": { "@type": "Organization", "name": "Data Pill" },
        "publisher": { "@type": "Organization", "name": "PenguinWorks" },
        "mainEntityOfPage": "https://penguinworksco.work/data-pill/articles/<slug>/"
    }
    </script>
</head>
<body>
    <header class="site-header">
        <a class="brand" href="../../index.html">
            <img src="../../assets/data-pill-icon.png" alt="" width="40" height="40">
            <span>Data Pill</span>
        </a>
        <a class="back-link" href="../">All guides</a>
    </header>

    <main class="article-page">
        <article>
            <header class="article-header">
                <p class="eyebrow"><category> · <date> · <n> min read</p>
                <h1><title></h1>
                <p class="article-summary"><summary></p>
            </header>

            <div class="article-body">
                <p><introduction></p>

                <h2><section heading></h2>
                <p><section copy></p>

                <div class="callout">
                    <p><strong>Key point:</strong> <short takeaway></p>
                </div>

                <h2>What this means in practice</h2>
                <p><practical guidance></p>

                <ul>
                    <li><strong><step>:</strong> <detail></li>
                </ul>
            </div>

            <section class="related" aria-labelledby="related-title">
                <h2 id="related-title">Keep reading</h2>
                <p><a href="../">Browse all Learn &amp; Guides articles</a> for more practical explanations of mobile data, limits, and budgets.</p>
            </section>
        </article>
    </main>

    <footer>
        <p>Data Pill by PenguinWorks. <a href="../../support.html">Support</a> · <a href="../../help.html">Help</a> · <a href="../../whats-new.html">What's New</a></p>
        <p class="updated">Published <date> · Reviewed by the Data Pill team</p>
    </footer>
</body>
</html>
```

Before publishing: set `draft` to `false`, run
`node data-pill/articles/scripts/build-index.js`, update both sitemaps, verify
locally, and follow `EDITORIAL.md`.
