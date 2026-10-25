# PenguinWorks Website

Website pages for PenguinWorks apps.

## Site Structure

The repository root is a PenguinWorks brand hub at `index.html`. It links to each
app's site and is not a Data Pill landing page.

### Data Pill

- **Directory:** `data-pill/`
- **URL:** `https://penguinworksco.work/data-pill/`
- **Main pages:**
  - `data-pill/index.html` - home page
  - `data-pill/help.html` - help documentation
  - `data-pill/support.html` - support page
  - `data-pill/whats-new.html` - release notes
  - `data-pill/privacy-policy.html` - privacy policy
  - `data-pill/terms-of-use.html` - terms of use
- **Shared assets:** `data-pill/assets/`, `data-pill/styles/`, `data-pill/scripts/`
- **Sitemap:** `data-pill/sitemap.xml`
- **Legacy redirects:** root-level `help.html`, `support.html`,
  `whats-new.html`, `privacy-policy.html`, and `terms-of-use.html` redirect to
  the matching `data-pill/` page. The root `/` remains the brand hub.

### Echo

- **Directory:** `echo/`
- **URL:** `https://penguinworksco.work/echo/`
- **App:** Echo
- **Main pages:**
  - `echo/index.html` - home page
  - `echo/help.html` - help documentation
  - `echo/support.html` - support page
  - `echo/privacy-policy.html` - privacy policy
  - `echo/terms-of-service.html` - terms of service

### ViewGraph

- **Directory:** `view-graph/`
- **URL:** `https://penguinworksco.work/view-graph/`
- **Sitemap:** `view-graph/sitemap.xml`

### Weather Studio

- **Directory:** `weather-studio/`
- **URL:** `https://penguinworksco.work/weather-studio/`

The root `sitemap.xml` lists the brand hub, Data Pill pages, and the Echo,
ViewGraph, and Weather Studio sites. `CNAME` and `app-ads.txt` stay at the
repository root; `app-ads.txt` must remain available at the domain root.

## Project Skills

Project-local skills are stored in `.codex/skills/`.

### Data Pill Update What’s New

**Path:** `.codex/skills/data-pill-update-ws/`

Creates a new Data Pill What’s New release from the iOS project and screenshots attached to the Codex task. The workflow:

- Verifies the iOS project and Xcode project paths.
- Reads the app marketing version.
- Checks that the iOS version is newer than the latest website release.
- Stops if the release already exists or screenshots are not attached.
- Generates descriptive screenshot filenames automatically.
- Uploads confirmed screenshots to the Data Pill Firebase Storage `website/` directory.
- Updates `data-pill/whats-new.html` with the Firebase image URLs.
- Adds German, Simplified Chinese, Turkish, and Filipino translations.
- Validates translation keys, JavaScript, image URLs, and page structure.

Run it with a version number:

```text
$data-pill-update-ws 3.0.0
```

The default iOS project path is:

```text
/Users/windversi/Desktop/Data Pill App /Data-Pill-iOS
```

Attach the What’s New screenshots to the task before running the skill. App Store assets are not used for this workflow. The skill does not commit, push, or deploy changes.

Firebase uploads use the owner account `penguinworksco@gmail.com` with the `data-pill` project selected. Do not use `darylgialolo@gmail.com` for uploads.

## Publishing

Review the generated changes, then manually commit and push them to `main` to
publish the website. Publishing remains main-based; the `/data-pill/` move does
not change the deployment branch, domain, or Pages settings.
