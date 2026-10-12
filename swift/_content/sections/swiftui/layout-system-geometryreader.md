---
title: Layout System and GeometryReader
difficulty: Intermediate
tags: swiftui, layout, geometryreader, alignment
summary: How SwiftUI's two-pass layout protocol works, why GeometryReader is powerful but easy to misuse, and the alternatives.
prerequisites: swiftui/view-lifecycle-identity
related: swiftui/custom-layouts-modifiers, swiftui/lists-grids-lazy-containers, swiftui/view-performance-invalidation
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SwiftUI layout is a negotiation between parents and children in two passes:

1. **Proposal pass** — the parent proposes a size to each child.
2. **Return pass** — each child returns the size it wants (which may differ).

The parent then places children according to its own rules. A `Text` accepts the proposal; a fixed `.frame(width:)` ignores it and returns that size; a `Spacer` expands only if the proposal allows.

## Frames

~~~swift
Text("Hello")
    .frame(width: 200, height: 44)      // fixed
Text("Hello")
    .frame(maxWidth: .infinity, alignment: .leading)  // fills, aligned
~~~

`.frame` can both propose a size and constrain the child; the modifier order determines which.

## GeometryReader

`GeometryReader` fills the space proposed to it and reports that size, using a top-leading coordinate system by default:

~~~swift
struct SizingView: View {
    var body: some View {
        GeometryReader { proxy in
            Circle()
                .frame(width: proxy.size.width * 0.3)
        }
    }
}
~~~

Because it greedily takes all available space and its child cannot influence its own size beyond the reader, `GeometryReader` is a poor default. It also reads layout during the return pass, and overusing it can cause layout thrash.

## Reading size without GeometryReader

Since iOS 16, `containerRelativeFrame` and `ViewThatFits` cover many GeometryReader use cases without the greedy behaviour:

~~~swift
Text("Banner")
    .containerRelativeFrame(.horizontal) { width, _ in width * 0.8 }
~~~

`ViewThatFits` picks the first child that fits the proposal:

~~~swift
ViewThatFits {
    HStack { Text("Full label") }
    Text("Short")
}
~~~

## Alignment and `Layout`

`ZStack(alignment:)`, the `.overlay`/`.background` alignment guides, and custom `Layout` values let you control placement precisely. For custom container arrangements, implement the `Layout` protocol instead of stacking GeometryReaders.

## Lazy V/S/G

`LazyVStack`/`LazyHStack`/`LazyVGrid` create children only as they scroll into view, which changes layout timing. Do not rely on all children existing when you measure.

## Real-world use cases

- Proportional sizing for charts and media.
- `ViewThatFits` for adaptive labels that avoid truncation.
- `Layout` for custom flow and grid arrangements.

## Common pitfalls

- Wrapping everything in `GeometryReader`, causing zero-size surprises and greedy expansion.
- Using `GeometryReader` inside a `ScrollView` with an unbounded height, which collapses.
- Depending on lazy children being present for measurement.

## Best practices

- Prefer `frame`, `containerRelativeFrame` and `ViewThatFits` over `GeometryReader`.
- Use `Layout` for genuinely custom container behaviour.
- Keep `.frame` modifier order deliberate.

## Interview questions

1. Describe SwiftUI's two-pass layout.
2. Why can `GeometryReader` break a layout?
3. What does `ViewThatFits` do and when is it better than `GeometryReader`?

**Follow-up:** Why does a `GeometryReader` inside a `ScrollView` often report zero height? The scroll view proposes an unbounded/zero height, which the reader accepts.
