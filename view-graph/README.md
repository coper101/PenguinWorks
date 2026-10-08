# ViewGraph developer site (`/view-graph`)

Static site for the ViewGraph developer pages and blog, published as part of the
existing PenguinWorks GitHub Pages site.

- Public homepage: `https://penguinworksco.work/view-graph/`
- Blog index: `https://penguinworksco.work/view-graph/blog/`
- Articles: `https://penguinworksco.work/view-graph/blog/<slug>/`

## How it fits the existing setup

The PenguinWorks site is a **static GitHub Pages site** with no build step, no
framework and no bundler. Each app lives in a subdirectory (`echo/`,
`weather-studio/`). This directory follows the same convention, so nothing else
on the site changes.

Production URLs use **root-absolute paths** (`/view-graph/...`) because the site
is served from the domain root and the section is a subpath. This keeps deep
links and refreshes working at any nesting level.

Clean article routes are directory `index.html` files, which GitHub Pages serves
at `/view-graph/blog/<slug>/`.

## Structure

```
view-graph/
├── index.html                                  # home
├── styles.css                                  # all styles (self-contained design system)
├── sitemap.xml                                 # scoped sitemap (see note)
├── assets/
│   ├── viewgraph-hero.jpg                      # real captures, optimized for web
│   ├── viewgraph-screens.jpg
│   ├── viewgraph-components.jpg
│   ├── viewgraph-previews.jpg
│   ├── viewgraph-graph-canvas.jpg
│   ├── viewgraph-commit-impact.jpg
│   ├── viewgraph-icon.png
│   ├── favicon.png
│   └── apple-touch-icon.png
└── blog/
    ├── index.html
    ├── joining-a-new-ios-team/index.html
    ├── swiftui-apps-structured-differently/index.html
    └── how-swiftui-previews-load/index.html
```

No JavaScript is required to read the site. The blog index uses a small inline
script only to toggle category filtering; without it, every article is visible
and grouped.

## Screenshots

The images in `assets/` are **real ViewGraph captures** taken from the published
`v0.1.0-alpha.2` release notes, then resized and re-encoded for the web with
`sips`. They are not mockups. If a future feature lacks a real capture, add an
explicit placeholder instead of an invented UI.

To refresh a capture, replace the source PNG and re-encode, for example:

```sh
sips -s format jpeg -s formatOptions 82 --resampleWidth 1600 source.png --out assets/viewgraph-screens.jpg
```

## Local preview

Serve the repository root so root-absolute paths resolve exactly as in
production:

```sh
cd /Users/windversi/Desktop/VSCode/data-pill-website/PenguinWorks
python3 -m http.server 8765
# then open http://localhost:8765/view-graph/
```

## Verifying changes

There is no build. Checks are structural. From this directory:

```sh
# 1. Every internal link and asset path resolves to a file.
python3 - <<'PY'
import os, re, glob
root = os.getcwd()
def resolve(url):
    t = url.split("#")[0].split("?")[0]
    if t.rstrip("/") in ("/view-graph", ""):
        return os.path.join(root, "index.html")
    c = os.path.join(root, t.replace("/view-graph/", "", 1).lstrip("/"))
    return os.path.join(c, "index.html") if os.path.isdir(c) else c
missing = []
for path in glob.glob("**/*.html", recursive=True):
    html = open(path, encoding="utf-8").read()
    for url in re.findall(r'(?:href|src)="(/view-graph[^"#?]*)"', html):
        if not os.path.exists(resolve(url)):
            missing.append((path, url))
print("MISSING:", missing if missing else "none")
PY

# 2. HTML tags are balanced in every page.
python3 - <<'PY'
import glob
from html.parser import HTMLParser
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.stack = []; self.errors = []
    def handle_starttag(self, tag, attrs):
        if tag not in VOID: self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag in VOID: return
        if self.stack and self.stack[-1] == tag: self.stack.pop()
        else: self.errors.append(f"unmatched </{tag}>")
bad = False
for path in sorted(glob.glob("**/*.html", recursive=True)):
    p = P(); p.feed(open(path, encoding="utf-8").read()); p.close()
    if p.stack or p.errors:
        bad = True; print(path, p.stack, p.errors)
print("HTML OK" if not bad else "HTML PROBLEMS")
PY

# 3. Smoke-test routes and assets over HTTP with root-absolute paths.
cd ..
python3 -m http.server 8765 &
sleep 2
for p in /view-graph/ /view-graph/blog/ \
  /view-graph/blog/joining-a-new-ios-team/ \
  /view-graph/blog/swiftui-apps-structured-differently/ \
  /view-graph/blog/how-swiftui-previews-load/ \
  /view-graph/styles.css /view-graph/assets/viewgraph-hero.jpg; do
  printf "%s  %s\n" "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:8765$p")" "$p"
done
kill %1
```

Every route should print `200`. Do not claim the section is live until the
public URLs return the new pages after deployment.

## Deployment

Manual, like the rest of the site: commit and push to `main`; GitHub Pages
publishes from the repository root. Do not claim the section is live until
`https://penguinworksco.work/view-graph/` returns the new homepage.

## Sitemap note

The existing site has no `sitemap.xml` and no `robots.txt`. A **scoped**
sitemap for this section is provided at `view-graph/sitemap.xml`. It does not
affect other pages, but search engines will not discover it automatically
without a root `robots.txt` `Sitemap:` directive or a root sitemap. Wiring that
up is a site-wide change and is intentionally left out of this task.

## Editorial notes

- Articles are written in a first-person developer voice and state limitations
  honestly.
- The preview article is validated against the implementation in
  `Sources/PreviewRendering/` and `docs/ViewGraph-Architecture.md`, and calls out
  paths that remain unverified.
- Keep terminology consistent: screens, components, widgets, connections,
  authored previews, preview host, commit impact.
- Release/download link currently points at `v0.1.0-alpha.2`; update all four
  pages if a newer release supersedes it.
