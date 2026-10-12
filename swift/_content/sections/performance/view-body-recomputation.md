---
title: View Body Recomputation
difficulty: Advanced
tags: performance, swiftui, body, invalidation
summary: Why bodies recompute, how to count them, and how to keep recomputation local.
prerequisites: swiftui/view-performance-invalidation
related: performance/swiftui-rendering-performance, performance/scrolling-performance, swiftui/state-management
version: iOS 17+, Xcode 16+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

A view's `body` is a function that SwiftUI calls to get a fresh description. Excess recomputation is the usual root cause of SwiftUI jank. The goal is not zero recomputation — that is how SwiftUI works — but recomputation that is **local** and **cheap**.

## What triggers a body call

- A `@State`/`@Binding` the body reads changes.
- An observed model property the body reads changes.
- An environment value the body reads changes.
- The parent recomputes and this view has no identity to skip it.

## Counting body calls

Add a temporary counter, or use Xcode 16's SwiftUI instrument which reports update counts per view type.

```swift
struct Row: View {
    let item: Item
    var body: some View {
        let _ = Self._printChanges()   // prints the cause of the update
        Text(item.title)
    }
}
```

`Self._printChanges()` (private but widely used in debugging) prints why a body ran. Remove it before shipping.

## Keeping recomputation local

```swift
struct Screen: View {
    @State private var text = ""
    var body: some View {
        VStack {
            Editor(text: $text)     // depends on text
            Sidebar()               // does not -> should not recompute
        }
    }
}
```

Extract `Sidebar` into its own `View` so typing in `Editor` does not recompute it.

## Reading less state

With `@Observable`, reading only `model.count` avoids invalidation on `model.name` changes. With `ObservableObject`, use `@Published` sparingly or use `objectWillChange` projections.

## Avoiding state mirroring

Storing a copy of model state in `@State` and syncing with `.onChange` doubles the sources of truth and multiplies recomputation. Derive instead.

## Real-world use cases

- A settings screen where one toggle rebuilds everything.
- A list where every row recomputes on any change.
- A form where each keystroke invalidates the whole page.

## Common pitfalls

- Assuming more recomputation is always the bottleneck; sometimes it is expensive bodies.
- Leaving `_printChanges` in production.
- Over-splitting into hundreds of tiny views.

## Best practices

- Keep bodies dependent on minimal state.
- Extract subviews to localise invalidation.
- Prefer `@Observable`.
- Measure body counts with the SwiftUI instrument.

## Interview questions

1. Name four things that cause a body to recompute.
2. How do you localise recomputation?
3. Why is mirroring state in `@State` harmful?

**Follow-up:** Does extracting a subview that still reads the same state reduce recomputation? No — it must not read the changing state to be skipped.
