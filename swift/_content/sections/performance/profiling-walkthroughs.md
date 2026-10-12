---
title: Performance Profiling Walkthroughs
difficulty: Advanced
tags: performance, walkthrough, methodology
summary: Three end-to-end profiling scenarios, from symptom to verified fix.
prerequisites: performance/instruments-overview, performance/time-profiler, performance/allocations
related: performance/time-profiler, performance/scrolling-performance, performance/memory-leaks-retain-cycles
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 12
---

## Overview

This article ties the section together with three realistic investigations. The method is always the same: reproduce, measure, hypothesise, change one thing, re-measure.

## Walkthrough 1 — Scrolling jank

**Symptom:** A feed drops frames on an older iPhone.

1. Profile a Release build on the device with **Animation Hitches**.
2. Hitches correlate with row appearances; many frames during scroll.
3. Time Profiler shows heavy time in `DateFormatter.string(from:)` inside the row body.
4. **Fix:** precompute the formatted string in the model.
5. Re-profile: hitches gone, weight of the formatter frame near zero.
6. Second pass: hitches correlate with image decode → add downsampling + cache.

**Lesson:** Most scroll jank is per-row work, not the framework.

## Walkthrough 2 — Memory growth

**Symptom:** Memory climbs each time a detail screen is opened and never drops.

1. Add `deinit { print("deinit \(Self.self)") }` to the detail view model; it never prints.
2. Debug Memory Graph, select the leaked view model, read the retain graph.
3. Find a strong cycle: the model holds a stored closure that captures `self` strongly.
4. **Fix:** change the capture to `[weak self]`.
5. Re-test: `deinit` prints; live-object count returns to baseline after repeated navigation.

**Lesson:** Confirm leaks with the memory graph before changing code.

## Walkthrough 3 — Slow launch

**Symptom:** The app takes ~2 s to become usable.

1. App Launch template: post-main time dominates.
2. Signpost around scene setup; the interval covers a synchronous database migration and an analytics SDK start.
3. **Fix:** move migration and analytics to after the first frame; show cached content immediately.
4. Re-measure: first-frame time drops; the deferred work runs off the critical path.

**Lesson:** Launch work should be the minimum needed for the first frame.

## The general method

1. Define the metric (hitch count, peak memory, time to first frame).
2. Capture a baseline on a real device with a Release build.
3. Add signposts around the suspect region.
4. Form one hypothesis and make one change.
5. Re-measure and compare the same metric.
6. Keep the baseline to guard against regressions.

## Real-world use cases

These three account for a large share of real performance tickets. The method transfers to networking, battery and CPU work.

## Common pitfalls

- Changing several things at once, so the cause is unknown.
- Optimising without a baseline.
- Profiling the Simulator or a debug build.
- Declaring victory without re-measuring.

## Best practices

- One hypothesis, one change, one measurement.
- Signpost the regions you care about.
- Keep baselines for critical flows.
- Automate where possible (XCTest metrics, MetricKit).

## Interview questions

1. Walk me through diagnosing scroll jank.
2. How do you confirm a leak and its cause?
3. How would you reduce time to first frame?

**Follow-up:** How do you prevent regressions after fixing performance? Add XCTest performance tests or CI benchmarks with a baseline.
