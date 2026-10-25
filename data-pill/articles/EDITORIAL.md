# Data Pill Learn & Guides — Editorial Guide

This directory is the source of truth for the Data Pill article hub at
`https://penguinworksco.work/data-pill/articles/` and for the published-only
feed consumed by the iOS app.

## Publishing model

- One original, reviewed article per calendar month.
- Draft → review → publish. Nothing is auto-published.
- The website is static. Publishing a new article means committing its folder,
  regenerating the index/feed, and merging/pushing to `main` (the normal
  PenguinWorks publishing flow — do not deploy from a feature branch).
- The iOS app reads `index.json`, so publishing a new article does not require
  an app update.

## Article folder layout

```text
data-pill/articles/
  <slug>/
    meta.json     # required metadata
    index.html    # the article page
  scripts/build-index.js
  _index.template.html
  index.html      # generated — do not edit by hand
  index.json      # generated — do not edit by hand
```

`slug` must match the folder name and is the stable URL (`<slug>/`).

### meta.json

```json
{
  "slug": "how-mobile-data-tracking-works",
  "title": "How Mobile Data Tracking Works on iPhone (and Where It Stops)",
  "summary": "One or two sentences shown in the index and app.",
  "published": "2026-10-25",
  "updated": "2026-10-25",
  "category": "Data Tracking",
  "tags": ["iOS", "data usage"],
  "readingMinutes": 7,
  "draft": false
}
```

Set `"draft": true` to keep a work-in-progress article out of both the public
index and `index.json`. The build script also ignores any folder whose name
starts with `_`.

## Publish a new article

1. Create `data-pill/articles/<slug>/meta.json` and `index.html` from
   `TEMPLATE.md`.
2. Add the article to the year/month archive expectations and to the sitemaps
   when the index changes:
   - `data-pill/sitemap.xml`
   - `sitemap.xml` (root)
3. Run:

   ```bash
   node data-pill/articles/scripts/build-index.js
   ```

   The script validates required fields, rejects duplicate publication months,
   excludes drafts, and regenerates `index.html` and `index.json`.
4. Verify locally with a static server at the repository root. Check the hub,
   the article, the feed, canonical URLs, links, and mobile width.
5. Review the diff, then commit and merge/push through the normal `main` flow.
6. Confirm the live `/data-pill/articles/` page and feed, then verify the app’s
   Learn & Guides screen shows the new article.

## Editorial standards

- Practical, accurate, plain language with concrete scenarios.
- Use MB/GB correctly. Most carriers bill decimal units (1 GB = 1,000 MB);
  distinguish that from binary GiB when it matters.
- Do not claim Data Pill measures usage more precisely than iOS allows.
  Distinguish device estimates, carrier billing, and zero-rated or promotional
  data.
- Review time-sensitive carrier, roaming, eSIM, and OS claims before
  publishing and add dated sources where a factual claim depends on them.
- No unreviewed generated content goes live. No positive-review incentives.
- Keep Data Pill mentions modest and relevant; the article is not an ad.

## Six-month outline

| Month | Working title | Focus |
| --- | --- | --- |
| 2026-10 | How Mobile Data Tracking Works on iPhone (and Where It Stops) | Device vs carrier ledgers; limits of measurement |
| 2026-11 | Daily Budget vs Daily Limit: What Each One Is For | Pace vs threshold; avoiding overage panic |
| 2026-12 | Why Background Data Drains a Plan | Background refresh, backups, updates, tips |
| 2027-01 | Roaming, Local eSIMs, and Data That Does Not Count | Billing rules, passes, zero-rating caveats |
| 2027-02 | Cut Mobile Data Without Turning Everything Off | Practical quality and sync settings |
| 2027-03 | Why Plan Reset Dates Matter More Than You Think | Cycle alignment, budget resets, billing edge cases |

Adjust topics editorially as carrier and OS behaviour changes.
