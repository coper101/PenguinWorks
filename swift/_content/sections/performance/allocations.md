---
title: Allocations
difficulty: Advanced
tags: performance, allocations, malloc, memory
summary: Reduce allocation churn and peak memory by understanding what allocates and why.
prerequisites: performance/instruments-overview, language/copy-on-write
related: performance/memory-leaks-retain-cycles, performance/cpu-optimization, language/copy-on-write
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Every heap allocation costs time and memory. Frequent small allocations cause churn and fragmentation; large transient allocations raise peak memory. The Allocations instrument shows total allocations, live bytes, and a growth history.

## Symptoms

- High transient memory spikes.
- Frequent GC-like stalls from allocation pressure.
- CPU spent in `malloc`/`free` or Swift runtime.

## What allocates

- Class instances (reference types).
- COW buffers when a value is mutated after sharing.
- Closures that escape (boxed context).
- Existentials (`any P`) that box large values.
- Collections that grow by reallocating.
- `String` operations that copy.
- Bridged `NSObject`/`NSString` interop.

## Diagnostics

1. Allocations instrument, **Statistics** view for live vs. total.
2. **Generations** — mark, run a flow, mark again; a nonzero net live count across the flow indicates retention.
3. Sort by count and size to find hot allocations.

## Reducing churn

```swift
// Reserve capacity to avoid repeated reallocation
var results = [Result]()
results.reserveCapacity(items.count)
for item in items { results.append(process(item)) }
```

- Reuse buffers instead of allocating in loops.
- Avoid `Array(slice)`; keep slices.
- Hoist formatters and decoders out of loops.
- Prefer value types for hot data and generics over `any` to avoid boxing.
- Build strings with `reserveCapacity` or join once.

## Peak memory

Large images and decoded bitmaps dominate peak memory. Downsample images to display size (see [Image Decoding and Caching](/swift/performance/image-decoding-caching/)) and release large buffers promptly.

## Real-world use cases

- A parser that allocates a new array per token.
- A list that boxes values into `Any`.
- An image pipeline holding full-resolution bitmaps.

## Common pitfalls

- Optimising allocation count while ignoring size.
- Micro-optimising and hurting readability for tiny gains.
- Ignoring transient spikes that trigger jetsam termination.

## Best practices

- Measure allocation count and peak bytes.
- Reserve capacity and reuse buffers.
- Downsample large images.
- Use generics instead of existentials in hot paths.

## Interview questions

1. Name four things that allocate on the heap in Swift.
2. What are Allocations "generations" for?
3. How does COW affect allocation behaviour?

**Follow-up:** Why can a struct still allocate? If it owns a COW buffer or holds references, mutation or copying can allocate.
