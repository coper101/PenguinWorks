---
title: CPU Optimization
difficulty: Advanced
tags: performance, cpu, algorithms, optimization
summary: Cut CPU work by changing algorithms and data flow before reaching for micro-optimisations.
prerequisites: performance/time-profiler
related: performance/time-profiler, performance/allocations, performance/concurrency-bottlenecks
version: General
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Most CPU wins come from doing less work, not from faster instructions. Optimise in this order: remove work, move work off the critical path, change the algorithm, then micro-optimise. Measurement drives every step.

## Order of operations

1. **Stop doing unnecessary work** — cache, memoise, avoid recomputation.
2. **Move work off the main thread** — async, actors, background queues.
3. **Change complexity** — O(n²) to O(n log n) or O(n) with a dictionary.
4. **Reduce allocations** — see [Allocations](/swift/performance/allocations/).
5. **Micro-optimise** — only with data.

## Algorithm example

```swift
// O(n²): linear search per element
for a in items { if other.contains(where: { $0.id == a.id }) { … } }

// O(n): index once
let index = Dictionary(uniqueKeysWithValues: other.map { ($0.id, $0) })
for a in items { if index[a.id] != nil { … } }
```

## Avoid redundant recomputation

Cache derived values and invalidate only when inputs change. In SwiftUI this means deriving values in the model, not in `body`.

## Concurrency

Move decoding, image processing, parsing and heavy formatting off the main thread. Use `nonisolated` work in `@MainActor` types and apply results back on the main actor.

## Value versus reference

Hot loops benefit from value types and generics (no boxing, no retain/release). Reserve capacity, avoid existentials.

## Real-world use cases

- A search that scans the full list on every keystroke.
- JSON decoding on the main thread during scroll.
- Repeated sort of an unchanged array.

## Common pitfalls

- Micro-optimising before profiling.
- Assuming an optimisation helped without re-measuring.
- Blocking the main thread while "optimising" elsewhere.
- Premature complexity that hurts maintainability for no measured gain.

## Best practices

- Profile, hypothesise, change one thing, re-measure.
- Prefer algorithmic wins and moving work over instruction-level tweaks.
- Keep the hot path allocation-free.
- Document why an optimisation exists (it often looks redundant later).

## Interview questions

1. What order should you optimise in?
2. Give an example of replacing O(n²) with O(n).
3. When is micro-optimisation justified?

**Follow-up:** How do you prove an optimisation helped? Re-run the same profile and compare the relevant frame's weight.
