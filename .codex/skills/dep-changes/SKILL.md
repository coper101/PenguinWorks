---
name: dep-changes
description: Validate, commit, and push the current PenguinWorks website changes to the main branch so the live deployment is triggered. Use only when the user explicitly asks to deploy, commit and push, publish changes, or run $dep-changes.
---

# Deploy PenguinWorks Changes

Commit and push the current PenguinWorks website work to `origin/main`. Pushing `main` triggers the live website deployment. Do not run this skill implicitly; it is an explicit deployment action.

## Preflight

Run all checks before staging or committing:

1. Confirm the current directory is the PenguinWorks website repository.
2. Confirm the current branch is exactly `main`.
3. Confirm `main` tracks `origin/main`.
4. Confirm the remote URL is `https://github.com/coper101/PenguinWorks.git`.
5. Confirm the worktree contains changes. Stop if it is clean.
6. Run relevant project checks:
   - `node --check scripts/i18n.js`
   - `git diff --check`
   - Verify all `data-i18n` keys used by the website exist in the five language dictionaries.
   - Verify referenced local image files exist and Firebase image URLs are syntactically valid.

If any check fails, stop without staging, committing, or pushing. Explain the failure and the corrective action.

## Commit

After preflight passes:

1. Inspect `git diff` and `git status`.
2. Stage all current tracked and untracked changes with `git add -A`.
3. Inspect the staged diff and summarize the actual changes.
4. Generate one concise commit subject beginning exactly with `Update `.

Use this format:

```text
Update <short description derived from the staged changes>
```

Examples:

```text
Update Data Pill What's New 3.1.0
Update Data Pill localization and help pages
Update website skill automation
```

Derive the description from the staged files and content. Do not use a generic message such as `Update changes`, and do not claim changes that are not present. The agent must report the proposed subject and staged file summary before creating the commit.

Create the commit with the generated subject. Never amend an existing commit and never force-push.

## Publish

After the commit succeeds:

1. Push explicitly to `origin main`.
2. Report the commit hash and push result.
3. Tell the user that pushing `main` triggers the live deployment.

Stop and report the error if authentication, remote access, or the push fails. Do not retry destructively, rewrite history, or push another branch.

## Safety Rules

- Require `main`; stop on every other branch.
- Stage all current changes because this skill is intended to publish the current worktree as one deployment.
- Do not create branches or pull requests.
- Do not run `git reset`, `git checkout`, `git clean`, `git commit --amend`, or force-push commands.
- Do not deploy if validation fails.
