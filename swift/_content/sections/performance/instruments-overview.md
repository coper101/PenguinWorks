---
title: Instruments Overview
difficulty: Intermediate
tags: performance, instruments, profiling
summary: Choose the right Instruments template for the problem and read a trace without getting lost.
prerequisites: performance/instruments-overview
related: performance/time-profiler, performance/allocations, performance/leaks
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Instruments is Xcode's profiler. It samples and records activity in **instruments** (tracers), each specialised: Time Profiler (CPU), Allocations, Leaks, Zombies, Animation Hitches, Network, Energy Log, SwiftUI, and more. You record a trace, then analyse it.

## Symptoms and the instrument to reach for

| Symptom | Start with |
| --- | --- |
| App feels slow, CPU hot | Time Profiler |
| Memory grows over time | Allocations, Leaks |
| Scroll jank / dropped frames | Animation Hitches, SwiftUI |
| Slow launch | App Launch template |
| Battery drain | Energy Log |
| Network stalls | Network |

## Recording a trace

1. Connect a real device and select it as the run destination.
2. Open **Product ▸ Profile** (⌘I) or Instruments directly.
3. Choose a template, press record, exercise the exact flow slowly and deliberately.
4. Stop and analyse, not before.

Record the flow that is slow, not the whole app. A focused trace is far easier to read.

## Reading a trace

- Use the **call tree** with "Invert Call Tree" and "Hide System Libraries" to find your hot frames.
- Use **weight** (sample count) columns to find the biggest cost.
- Use the **threads** view to spot work on the main thread.
- Use **points of interest** (`os_signpost`) to align your code with the timeline.

## Signposts

```swift
import os

let signposter = OSSignposter(subsystem: "com.app", category: "render")

func render() {
    let state = signposter.beginInterval("Render")
    defer { signposter.endInterval("Render", state) }
    // work
}
```

Signposts appear in Instruments and in the Xcode debug navigator, tying your code to the timeline. This is the single highest-value skill for performance work.

## Real-world use cases

- Confirming a hypothesis before optimising.
- Comparing before/after numbers for a change.
- Finding main-thread stalls.

## Common pitfalls

- Profiling on the Simulator, which has different performance characteristics.
- Profiling a debug build; profile a Release build.
- Recording too much and unable to find the relevant region.
- Optimising without a baseline.

## Best practices

- Profile Release builds on real devices.
- Add signposts around the work you care about.
- Change one variable at a time and re-measure.
- Keep a baseline trace for each critical flow.

## Interview questions

1. Which instrument would you use for memory growth over time?
2. Why profile a Release build on a device?
3. What do signposts add to a trace?

**Follow-up:** How do you cut through system noise in a trace? Hide system libraries and invert the call tree to expose your frames.
