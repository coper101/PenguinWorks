---
title: Time Profiler
difficulty: Intermediate
tags: performance, time-profiler, cpu, sampling
summary: Find where CPU time goes by sampling the call stack and reading weight.
prerequisites: performance/instruments-overview
related: performance/cpu-optimization, performance/allocations, performance/scrolling-performance
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Time Profiler samples every running thread at a fixed interval and records the call stack. Aggregated over thousands of samples, the "weight" of a frame approximates its CPU cost. It is a statistical profiler: more samples mean more confidence.

## Symptoms it explains

- The app feels sluggish but nothing obviously blocks.
- High CPU and battery drain.
- Specific actions take too long.

## Workflow

1. Record the exact slow interaction.
2. In the Call Tree, enable **Invert Call Tree** and **Hide System Libraries**.
3. Sort by **Weight** (samples) to find the hottest leaf frames.
4. Expand the heaviest frames to find your code.
5. Use **Caller/Callee** to understand context.

## What to look for

- Hot loops doing redundant work.
- Frequent allocations inside loops.
- Repeated formatting, sorting or decoding.
- Main-thread work that should be off-main.
- `String` interpolation and number formatting inside scroll handlers.

## Fixes that usually help

- Move work off the main thread (`nonisolated`, actors, task groups).
- Cache expensive results (formatters, parsed values).
- Reduce work per call rather than micro-optimising arithmetic.
- Use `os_signpost` to confirm the region shrank.

## Example: a hot formatter

```swift
// Bad: creates a DateFormatter per row, per frame
func label(for date: Date) -> String {
    let f = DateFormatter(); f.dateStyle = .short
    return f.string(from: date)
}

// Better: one shared, immutable formatter
let sharedFormatter: DateFormatter = {
    let f = DateFormatter(); f.dateStyle = .short; return f
}()
```

## Real-world use cases

- Finding a slow JSON decode or image resize.
- Locating a runaway `body` or layout pass.
- Justifying moving work to a background task.

## Common pitfalls

- Profiling debug builds with different optimisation levels.
- Chasing small frames while a large one dominates.
- Confusing inclusive weight (subtree) with self weight.
- Optimising code that is not on the critical path.

## Best practices

- Always baseline before and after.
- Focus on the largest self-weight frames first.
- Verify with signposts that the region actually shrank.
- Re-profile after each fix.

## Interview questions

1. How does a sampling profiler differ from an exact one?
2. What does "invert call tree" show?
3. Why can optimising a small frame be a waste of time?

**Follow-up:** What is self weight versus total weight? Self weight is time in the frame itself; total includes its children.
