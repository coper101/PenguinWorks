---
title: Lists, Grids and Lazy Containers
difficulty: Intermediate
tags: swiftui, list, lazyvgrid, performance
summary: Choose the right container for a collection, keep scrolling smooth, and understand lazy identity and reuse.
prerequisites: swiftui/view-lifecycle-identity, swiftui/layout-system-geometryreader
related: performance/scrolling-performance, swiftui/view-performance-invalidation, swiftui/lists-grids-lazy-containers
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SwiftUI has several collection containers, each with different scrolling, selection and performance characteristics:

- `List` — platform-styled rows, selection, swipe actions, editing, sections.
- `ScrollView` + `LazyVStack`/`LazyHStack` — custom layout with lazy instantiation.
- `LazyVGrid`/`LazyHGrid` — grids with lazy rows/columns.
- `Grid` (iOS 16+) — non-lazy, aligned grid for small content.

## List

```swift
List(selection: $selection) {
    Section("Inbox") {
        ForEach(messages) { message in
            MessageRow(message: message)
                .swipeActions { Button("Archive", role: .destructive) { archive(message) } }
        }
        .onDelete(perform: delete)
    }
}
.listStyle(.insetGrouped)
```

`List` reuses rows and is the right container for large data sets with platform affordances.

## Lazy stacks and grids

```swift
ScrollView {
    LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 12)], spacing: 12) {
        ForEach(photos) { photo in Thumbnail(photo: photo) }
    }
}
```

Children are created only as they approach the viewport. This means you cannot measure the whole collection, and off-screen state is not guaranteed to exist.

## Identity and diffing

Rows use `Identifiable` ids. Stable ids let SwiftUI reuse rows and animate insertions correctly. Unstable ids (indices) cause false removals/insertions and lose row state.

## Pinned headers and scroll position

- `.listRowInsets`, `.listRowSeparator`, `.listRowBackground` tune row appearance.
- `.scrollPosition(id:)` (iOS 17+) reads and writes the visible row.
- `.defaultScrollAnchor(_:)` sets the initial scroll position.

## Performance guidance

- Keep row `body` cheap; avoid work in `ForEach` content.
- Provide fixed or estimated heights where possible.
- Avoid `AnyView` in rows.
- Use `Image` with `resizable()` and a fixed frame to avoid layout thrash; decode off the main thread.

## Real-world use cases

- Chat history with a `List` and `scrollPosition` pinned to the bottom.
- Photo gallery with an adaptive `LazyVGrid`.
- Settings screens using `List` sections.

## Common pitfalls

- Putting a `List` inside a `ScrollView` (double scrolling, broken sizing).
- Using indices as ids.
- Heavy view construction in `ForEach` that runs on every scroll tick.
- Expecting `LazyVStack` to recycle like a `List` — it does not reuse, it creates/discards.

## Best practices

- Prefer `List` for data with platform interactions; lazy stacks for pixel-perfect layouts.
- Use stable ids and `ScrollViewReader`/`scrollPosition` for programmatic scrolling.
- Profile scrolling with the Time Profiler and SwiftUI instrument.

## Interview questions

1. What is the difference between `LazyVStack` and `List`?
2. Why can index-based ids break animations?
3. How do you scroll to a row programmatically in iOS 17+?

**Follow-up:** Does `LazyVStack` reuse off-screen views? No — it creates and discards; reuse is a `List`/`UICollectionView` characteristic.
