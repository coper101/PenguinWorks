# PenguinWorks Website

Website pages for PenguinWorks apps.

## Apps

### Data Pill

- **Directory:** repository root
- **App:** Data Pill
- **Main pages:**
  - `index.html` - home page
  - `help.html` - help documentation
  - `support.html` - support page
  - `whats-new.html` - release notes
  - `privacy-policy.html` - privacy policy
  - `terms-of-use.html` - terms of use

### Echo

- **Directory:** `echo/`
- **App:** Echo
- **Main pages:**
  - `echo/index.html` - home page
  - `echo/help.html` - help documentation
  - `echo/support.html` - support page
  - `echo/privacy-policy.html` - privacy policy
  - `echo/terms-of-service.html` - terms of service

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
- Updates `whats-new.html` with the Firebase image URLs.
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

Review the generated changes, then manually commit and push them to publish the website.
