---
name: update-data-pill-whats-new
description: Update the Data Pill website's What’s New release page from an iOS project and supplied screenshots. Use when adding a release such as 3.0.0, documenting new iOS features, adding screenshot cards, updating localized copy, or syncing release notes between an iOS project and the website.
---

# Update Data Pill What’s New

Create the next Data Pill release entry from the source iOS project and screenshots attached to the Codex task. Keep the release notes accurate to the app, preserve the website’s existing visual and localization system, and leave commit/push for the user.

## Mandatory Preflight

Run every preflight check before uploading screenshots or editing any website file. Use the bundled read-only checker:

```bash
node .codex/skills/update-data-pill-whats-new/scripts/preflight.js \
  /Users/windversi/Desktop/VSCode/data-pill-website/PenguinWorks \
  "/Users/windversi/Desktop/Data Pill App /Data-Pill-iOS" \
  3.0.0
```

The checker must verify, in order:

1. The iOS project directory exists.
2. `Data Pill.xcodeproj` and `project.pbxproj` exist inside it.
3. The main app marketing version can be read from `MARKETING_VERSION`.
4. The website contains a readable What’s New release version.
5. The iOS version is newer than the latest website version.
6. The requested version, when supplied, matches the iOS marketing version.
7. The requested version is not already present in the website.

If any check fails, stop immediately. Report the exact failure and the corrective action. Do not inspect for upload candidates, upload to Firebase, generate website edits, or modify translations after a failed preflight.

The skill must also verify that screenshots are attached to the current Codex task before any upload step. If none are attached, stop and ask the user to attach the What’s New screenshots. Never use App Store assets from `/Users/windversi/Desktop/Data Pill App /Assets/3.0.0` for this workflow.

Firebase uploads use the project owner account `penguinworksco@gmail.com`. Before uploading, verify that Google Cloud and Firebase CLI are authenticated with that account and that the active project is `data-pill`. Do not use `darylgialolo@gmail.com` for this workflow.

## Required Inputs

Get or infer:

- Release version, for example `3.0.0`.
- The iOS project directory. It may be outside the website repository.
- Screenshots attached to the current Codex task, or existing Firebase URLs supplied by the user.
- Any release-specific wording or feature names the user wants emphasized.

If the version is missing, ask for it before editing. If screenshots are not attached, stop and ask the user to attach them. Do not use the App Store asset directory as a fallback.

## Workflow

### 1. Run preflight and inspect both projects

Run the Mandatory Preflight first. After it passes, identify the website repository and inspect its existing What’s New implementation before editing. Read `whats-new.html`, `scripts/i18n.js`, and the relevant shared CSS. Locate the iOS project and search it with `rg` for the release version, feature names, changelog/release notes, widget configuration, streaks, themes, or other terms represented by the screenshots.

Use the iOS project as the source of truth for behavior and terminology. Do not claim a feature based only on a screenshot when the project contradicts it. If the project does not contain release notes, infer only visible facts and ask about ambiguous behavior.

### 2. Prepare screenshot assets

For each screenshot:

- Preserve the supplied order unless the user specifies another order.
- Prefer existing website asset conventions and filenames such as `assets/whats-new-<version>/`.
- If the user supplied Firebase URLs, use those URLs or copy them into the website's established local-image pattern as appropriate.
- If the user supplied local screenshots, inspect them when needed and search the repo for an existing Firebase CLI/configuration or documented upload script.
- Use a discovered, already-configured upload workflow only when it is clearly scoped to the intended Firebase project. Otherwise stop before uploading and ask the user to upload the files, then continue once URLs are available.

Never expose Firebase tokens in source files, logs, or the final response beyond URLs the user explicitly supplied for the page.

### 3. Add the release to the website

Follow the existing `whats-new.html` structure and shared styles. Add a new version section in descending version order, keeping existing anchors stable. For each feature, include:

- A concise heading.
- A short, accurate description based on the iOS project.
- The related screenshot or screenshot strip using the existing markup pattern.

Keep product names `Data Pill`, `Super Pill`, and `Super Trial` unchanged. Keep URLs and image links valid. Reuse existing classes rather than introducing a parallel layout.

### 4. Localize the new copy

Add every new visible string to the existing dictionaries in `scripts/i18n.js` for:

- `en`
- `de`
- `zh-Hans`
- `tr`
- `fil`

Use `data-i18n` or `data-i18n-html` keys in `whats-new.html`; do not hardcode translated page text directly into the HTML. Keep technical iOS setting paths readable and preserve product names. Check that translated text remains suitable for narrow iOS WebView widths.

### 5. Validate

Run the project’s available checks. At minimum:

```bash
node --check scripts/i18n.js
```

Verify that every `data-i18n` key used by `whats-new.html` exists in all five dictionaries. Check for broken local image paths and malformed HTML around the new section. If a browser or WebView preview is available, test desktop and narrow mobile widths, the language switcher, and anchors.

Do not commit, push, publish, or modify production Firebase data unless the user explicitly asks for that action. End with a concise summary of changed files, validation results, and any manual Firebase upload step still required.

## User Prompt Pattern

The skill should handle requests like:

> Update the new What’s New page with version 3.0.0. The iOS project is at `/path/to/ios`. Here are the screenshots: [files or Firebase URLs].

Before editing, confirm the project path is accessible and determine whether screenshot URLs are already available. Then execute the workflow above without requiring the user to describe the website’s internal file structure.
