# Swift Developer Hub (`/swift`)

A standalone developer-hub section of the PenguinWorks static site:
documentation, an engineering handbook and an interactive playground for
Swift, SwiftUI and Apple-platform developers.

- Hub home: `https://penguinworksco.work/swift/`
- Documentation: `/swift/<section>/` and `/swift/<section>/<topic>/`
- Practice: `/swift/learn/`, `/swift/interviews/`, `/swift/mock-interview/`,
  `/swift/recipes/`, `/swift/tools/`, `/swift/notes/`, `/swift/tags/`

## How it fits the existing setup

The PenguinWorks site is a **static GitHub Pages site with no build step, no
framework and no bundler**. Each app lives in a subdirectory (`echo/`,
`weather-studio/`, `view-graph/`). This directory follows the same convention,
so nothing else on the site changes. Production URLs use root-absolute paths
(`/swift/...`) so deep links and refreshes work at any nesting level, and clean
routes are directory `index.html` files.

## Structure

```
swift/
├── index.html              # hub homepage
├── styles.css              # self-contained design system (light + dark)
├── app.js                  # theme, sidebar, search, TOC, progress, bookmarks, copy, highlighting
├── search-index.js         # generated: client-side search index
├── data.js                 # generated: interview questions + learning paths (loaded only where needed)
├── hub.js / tools.js / interviews.js / learn.js / tags.js
├── sitemap.xml             # generated, scoped to this section
├── assets/                 # favicon.svg, apple-touch-icon.png
├── <section>/index.html    # generated section overview
├── <section>/<topic>/index.html
└── recipes|notes|tools|interviews|mock-interview|learn|tags/index.html
```

Sections: `language`, `swiftui`, `concurrency`, `architecture`,
`performance`, `debugging`.

## Content system

Content is authored as Markdown with YAML-ish front matter under
`_content/`, then generated into static HTML:

- `_content/config.mjs` — section and topic order, section metadata.
- `_content/sections/<section>/_index.md` — section intro.
- `_content/sections/<section>/<topic>.md` — one article per file:
  `title`, `difficulty`, `tags`, `summary`, `prerequisites`, `related`
  (as `section/topic` keys), `version`, `lastReviewed`.
- `_content/extras/recipes.md`, `_content/extras/notes.md` — long-form extras.
- `_content/extras.mjs` — interview questions, learning paths, tool metadata,
  and extra search entries.

### Generating

```sh
node swift/_build/build.mjs
```

This is a **local authoring tool only** — it uses only the Node standard
library, adds no dependency, and writes plain static HTML into `swift/`. The
generated files are what ships. Re-run it after editing anything under
`_content/`.

## Verification

There is no build to run in CI. Checks are structural:

```sh
# 1. JS syntax
for f in swift/*.js; do node --check "$f"; done

# 2. Every internal /swift link and asset resolves
cd swift && python3 - <<'PY'
import os, re, glob
missing=[]
for path in glob.glob("**/*.html", recursive=True):
    for url in re.findall(r'(?:href|src)="(/swift[^"#?]*)"', open(path, encoding="utf-8").read()):
        t=url.split("#")[0].split("?")[0]
        target="index.html" if t.rstrip("/") in ("/swift","") else (os.path.join(t.replace("/swift/","",1).lstrip("/"),"index.html") if os.path.isdir(t.replace("/swift/","",1).lstrip("/")) else t.replace("/swift/","",1).lstrip("/"))
        if not os.path.exists(target): missing.append((path, url))
print("MISSING:", missing or "none")
PY

# 3. Routes return 200 with root-absolute paths
python3 -m http.server 8765 &
for p in /swift/ /swift/language/ /swift/language/optionals/ /swift/tools/ /swift/interviews/ /swift/learn/; do
  printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:8765$p")" "$p"
done
kill %1
```

## Feature notes

- **Search** is client-side (`search-index.js`), keyboard-first (`/` to focus,
  arrows + Enter), and scoped to the hub.
- **Progress** (learning paths) and **bookmarks** are stored in `localStorage`
  under `swift-learn` and `swift-bookmarks`. No account is required.
- **Theme** respects `prefers-color-scheme` and a manual toggle stored as
  `swift-theme`.
- **Code blocks** are server-rendered and enhanced with a small Swift/JSON
  tokenizer and copy buttons.
- **Tools** run entirely in the browser; nothing is uploaded.

## Future monetization readiness

No payments, subscriptions or authentication are implemented. The structure is
ready for them: content is addressable and registry-driven (so a `premium`
flag can gate individual topics), practice state is already local and can be
swapped for a cloud-synced store behind the same interface, and the extras
pages are separate entries in the build so a paid surface can be added without
touching the free documentation.

## Editorial notes

- Version behaviour is stated explicitly in each article's front matter
  (`version`, `lastReviewed`). Do not invent APIs; verify against Apple docs
  and Swift Evolution.
- Keep terminology consistent: identity, ownership, isolation, invalidation.
- When adding a topic, add its slug to `_content/config.mjs` and create the
  matching Markdown file, then re-run the generator.

## Deployment

Manual, like the rest of the site: commit and push to `main`; GitHub Pages
publishes from the repository root. Do not claim the section is live until
`https://penguinworksco.work/swift/` returns the homepage.
