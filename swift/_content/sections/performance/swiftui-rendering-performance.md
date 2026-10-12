---
title: SwiftUI Rendering Performance
difficulty: Advanced
tags: performance, swiftui, rendering, hitches
summary: Keep SwiftUI smooth by understanding invalidation, layout cost and what forces the renderer to work harder.
prerequisites: swiftui/view-performance-invalidation, performance/instruments-overview
related: performance/view-body-recomputation, performance/scrolling-performance, swiftui/view-performance-invalidation
version: iOS 17+, Xcode 16+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SwiftUI is fast by default, but the same patterns that cause bugs cause jank: unstable identity, overly broad invalidation, expensive `body`, and layout thrash. The **SwiftUI instrument** (Xcode 16+) shows view body updates, and **Animation Hitches** shows dropped frames.

## Symptoms

- Scrolling stutters.
- Typing in a field lags.
- Animations stutter or restart.
- High CPU during idle UI.

## Causes and fixes

1. **Broad invalidation.** One `@Published` change recomputes many bodies. Move to `@Observable` and read the smallest state.
2. **Expensive `body`.** Formatting, sorting and object creation inside `body` run every pass. Precompute in the model.
3. **Unstable identity.** Index-based `ForEach` ids cause teardown/rebuild. Use stable ids.
4. **Layout thrash.** Nested `GeometryReader` and changeable frames cause repeated layout. Prefer `frame`, `containerRelativeFrame`, `ViewThatFits`.
5. **`AnyView`.** Erases identity and blocks diffing.
6. **Over-animation.** Animating layout-affecting properties every frame.

## Measuring

- SwiftUI instrument: count of view updates and which views update.
- Animation Hitches: hitch duration and the frames responsible.
- Time Profiler: find hot `body` implementations.
- Signposts around custom layout.

## Example: move formatting out of body

```swift
// Body does work every pass
struct Row: View {
    let item: Item
    var body: some View {
        Text(item.date.formatted(date: .abbreviated, time: .shortened))
    }
}

// Precompute once in the model
struct Row: View {
    let label: String
    var body: some View { Text(label) }
}
```

## Partitioning

Extract subviews so independent state invalidates only the relevant subtree. A search field and a results list should not recompute each other.

## Real-world use cases

- A feed that drops frames while scrolling.
- A form where each keystroke rebuilds the whole screen.
- An animation that hitches on older devices.

## Common pitfalls

- Assuming SwiftUI is inherently slow.
- Optimising without the SwiftUI instrument.
- Using `onReceive`/`onChange` to mirror state that could be derived.
- Hiding bodies behind `AnyView` to "simplify".

## Best practices

- Narrow invalidation and keep `body` pure and cheap.
- Use stable identity everywhere.
- Partition views; avoid `AnyView`.
- Measure with the SwiftUI and Animation Hitches instruments.

## Interview questions

1. What invalidates a SwiftUI view and how do you narrow it?
2. Why does `AnyView` hurt rendering?
3. How do you find which view body is expensive?

**Follow-up:** What does the SwiftUI instrument show that Time Profiler does not? Per-view update counts and which view types are recomputing.
