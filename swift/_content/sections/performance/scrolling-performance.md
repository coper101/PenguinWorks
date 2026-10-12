---
title: Scrolling Performance
difficulty: Advanced
tags: performance, scrolling, list, hitches
summary: Eliminate dropped frames while scrolling by trimming per-row work and image cost.
prerequisites: performance/swiftui-rendering-performance, swiftui/lists-grids-lazy-containers
related: performance/image-decoding-caching, performance/view-body-recomputation, swiftui/lists-grids-lazy-containers
version: iOS 17+, Xcode 16+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Scrolling is the most performance-sensitive interaction: frames must render in about 16.7 ms (60 Hz) or 8.3 ms (120 Hz ProMotion). Any per-row work — decoding, formatting, layout — competes for that budget.

## Symptoms

- Visible stutter or "hitching" while scrolling.
- Frames drop on older devices or large lists.
- CPU/GPU spike during scroll.

## Diagnose

- **Animation Hitches** instrument: hitch duration and the responsible frames.
- **Time Profiler**: hot code during scroll (often formatting or decoding).
- **Core Animation / GPU** view: offscreen rendering, blending.
- SwiftUI instrument: which row views update.

## Fixes for rows

1. **Precompute row content.** Format dates and numbers once in the model, not per frame.
2. **Downsample images** to display size (see below) and decode off the main thread.
3. **Fix row height** or provide an estimate so layout is cheap.
4. **Avoid shadow/clip/mask** on every row; they can force offscreen passes.
5. **Avoid `GeometryReader`** in rows.
6. **Use stable ids** so rows are not rebuilt.
7. **Avoid transparent gradients/blends** stacked heavily.

## Reuse and laziness

`List` reuses rows; `LazyVStack` creates and discards. Choose the container that matches the interaction, and keep state out of row identity so reuse is smooth.

## Prefetching

For `UICollectionView` prefetching or SwiftUI `.task`-based loading, start image work slightly before the row is visible so it is ready when it appears.

## Real-world use cases

- A social feed with image thumbnails.
- A chat with variable-height bubbles.
- A photo grid with thousands of items.

## Common pitfalls

- Decoding full-resolution images for small thumbnails.
- Calling `DateFormatter`/`NumberFormatter` per row per frame.
- Animating rows with layout-affecting changes.
- Measuring with the Simulator on a fast Mac.

## Best practices

- Precompute and downsample.
- Keep rows simple and fixed where possible.
- Profile on the oldest supported device.
- Use signposts around row construction.

## Interview questions

1. Why does per-row formatting destroy scroll performance?
2. What is image downsampling and why does it help?
3. How do you find which row is causing a hitch?

**Follow-up:** Why is a `List` often smoother than a `LazyVStack` for large data? `List` reuses cells; a lazy stack creates and discards views.
