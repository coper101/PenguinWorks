---
title: Developer Notes
summary: Short, practical notes — Swift tips, gotchas, best practices, Apple platform updates, Xcode productivity and recommended resources.
---

A running notebook of things worth remembering. Short, opinionated and practical.

## Swift tips

- Prefer `let` everywhere; let the compiler tell you when `var` is required.
- Use `guard let` for early exit and `if let` for conditional work.
- `defer` is the cleanest way to guarantee cleanup on every exit path, including `throw`.
- `withUnsafeBufferPointer` avoids copying when you only need to read.
- `isKnownUniquelyReferenced` is the key to writing your own copy-on-write containers.
- Prefer `some P` over `any P` in hot paths to avoid boxing.
- Use `@Observable` instead of `ObservableObject` on iOS 17+.
- `Swift.print` is debug-only; use OSLog for anything that ships.

## Common gotchas

- `Array` indices are not always zero-based after slicing; use `startIndex`.
- Modifying a collection while iterating it invalidates indices.
- A `struct` containing a class still shares that class.
- `String` is a collection of `Character`, not bytes; use `unicodeScalars` or `utf8` when needed.
- `Dictionary` iteration order is not guaranteed.
- `Date` is an instant, not a calendar date; use `Calendar` for day math.
- `enum` with associated values needs `Hashable`/`Equatable` synthesis only if all payloads are.
- Floating point equality is unreliable; compare with a tolerance.

## Best practices

- One source of truth per piece of state.
- Program to protocols at boundaries you actually swap or test.
- Keep `body` pure and cheap; move side effects to `.task`/`.onChange`.
- Type your errors; map them at the UI boundary.
- Inject `Clock`/`Date`/`UUID` providers so tests are deterministic.
- Profile Release builds on real devices.
- Treat cancellation and `Sendable` seriously from the start.
- Write the test that would have caught the bug.

## Apple platform updates to track

- **Swift 6 strict concurrency** — data-race checking is now part of the build.
- **`@Observable` and Observation** — replaces `ObservableObject` for most cases.
- **`NavigationStack`/`NavigationPath`** — value-based navigation.
- **SwiftData** — declarative persistence with `@Model` and `@Query`.
- **StoreKit 2** — Swift-native purchases with verified transactions.
- **App Intents & interactive widgets** — actions and widgets without launching the app.
- **Swift Testing** — `@Test`/`#expect` alongside XCTest.

## Xcode productivity

- `⌘⇧O` open quickly (jump to any file or symbol).
- `⌘⇧0` open the documentation window; `⌥`-click for a symbol's docs.
- `⌘/` comment, `⌃I` re-indent, `⌃6` show the current file's symbols.
- `⌘⇧Y` toggle the debug console; `⌘⇧J` reveal the current file in the navigator.
- `⌘I` profile with Instruments; `⌘U` run tests.
- `⌃⌘→`/`⌃⌘←` move between editor panes.
- Use Editor ▸ Refactor for rename/extract, which respects types.
- Enable "SwiftUI previews on canvas" only when needed; it costs build time.
- Custom SF Symbols, SwiftUI `#Preview`, and `Quick Look` for assets save context switches.

## Useful keyboard shortcuts (macOS-wide)

- `⌘⌥P` — compile/run (see Xcode key bindings; default is `⌘R`).
- `⌘\` — toggle breakpoint on the current line.
- `⌘⇧F` — search across the project.
- `⌥⌘[` / `⌥⌘]` — fold/unfold code.
- `⌃⌘E` — rename all occurrences in scope.

## Recommended resources

- The Swift Programming Language (swift.org) — the canonical language reference.
- Apple Human Interface Guidelines — platform conventions.
- Swift Evolution proposals — understand why APIs exist.
- WWDC session videos — the fastest way to learn new APIs.
- swift.org / Swift Forums — language direction and discussion.
- Instruments Help — the definitive guide to each instrument.
- Point-Free and SwiftUI-focused blogs — advanced patterns, read critically.
- Apple sample code and SwiftUI tutorials — runnable references.

## Version awareness

APIs change behaviour across OS versions. Always check availability (`@available`, `#available`) before using a new API, and test on the oldest supported OS. When this site mentions an API, the article's version tag states the minimum target it assumes.
