---
title: Diagnosing SwiftUI Problems
difficulty: Advanced
tags: debugging, swiftui, state, view-hierarchy
summary: A practical checklist for the state, layout and lifecycle bugs that are hard to see in SwiftUI.
prerequisites: swiftui/view-lifecycle-identity, swiftui/state-management
related: swiftui/common-swiftui-mistakes, swiftui/view-performance-invalidation, debugging/xcode-debugging-techniques
version: iOS 17+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SwiftUI bugs are not usually crashes; they are wrong state, wrong layout or unnecessary updates. Because views are values, the debugger shows structs that are recreated constantly, so diagnosis leans on instrumentation and reasoning about identity and ownership.

## Symptom → likely cause → diagnostic

| Symptom | Likely cause | Diagnostic |
| --- | --- | --- |
| State resets | Identity changed | Check `.id()` and `if`/`switch` branches |
| UI out of sync | Two sources of truth | Find duplicate `@State` |
| List rows swap state | Index-based ids | Use `Identifiable` ids |
| Warning "modifying state during update" | Side effect in `body` | Move to `.task`/`.onChange` |
| View rebuilds too often | Broad invalidation | SwiftUI instrument / `_printChanges()` |
| Layout collapses | `GeometryReader` in `ScrollView` | Replace with frame/`ViewThatFits` |

## State debugging

- Print the source of truth and the displayed value; if they differ, you have duplication.
- `Self._printChanges()` reveals why `body` ran (remove before shipping).
- Confirm ownership: exactly one owner per piece of state.

## Identity debugging

- Temporarily add `.id(UUID())` to prove identity is the issue by forcing a reset.
- Inspect `ForEach` ids; index ids are a common culprit.

## Layout debugging

- Use the View Debugger for frames and constraints (for representables).
- Replace `GeometryReader` with `containerRelativeFrame`/`ViewThatFits` and see if the bug disappears.
- Check for a `List` inside a `ScrollView`.

## Performance debugging

- Instrument with the SwiftUI instrument; count updates per view.
- Partition views so unrelated state does not invalidate them.

## Lifecycle debugging

- `.task` is tied to identity; if it runs repeatedly, identity is unstable.
- `.onAppear` can fire more than once; do not treat it as `init`.

## Real-world use cases

- A form whose fields reset when a sheet closes.
- A list that animates wrongly after an insert.
- A screen that recomputes everything when one toggle changes.

## Common pitfalls

- Attaching the debugger and expecting to see the "screen" object.
- Blaming SwiftUI performance without measuring.
- Fixing symptoms (adding `.id`) instead of the identity design.

## Best practices

- Reason about identity and ownership first.
- Use `_printChanges` and the SwiftUI instrument.
- Keep one source of truth.
- Fix the design, not the symptom.

## Interview questions

1. How do you diagnose state that resets unexpectedly?
2. What does `_printChanges()` tell you?
3. Why does a `GeometryReader` collapse in a scroll view?

**Follow-up:** What is the fastest way to confirm an identity bug? Temporarily change `.id()` and watch the state reset or persist.
