---
title: App Startup Optimization
difficulty: Advanced
tags: performance, launch, startup, dyld
summary: Reduce launch time by understanding what blocks the first frame and moving work off the critical path.
prerequisites: performance/instruments-overview, performance/time-profiler
related: performance/battery-energy, performance/background-execution, performance/time-profiler
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Launch time is the gap between the user tapping the icon and the first usable frame. Apple recommends targeting under ~400 ms for a responsive feel. Instruments' **App Launch** template breaks launch into phases, and Xcode's launch metrics show pre-main and post-main time.

## The phases

1. **Pre-main** — dyld loads and links images, runs `+load`/static initialisers.
2. **Post-main** — `main()`, app delegate/scene setup, first view construction and layout, before the first frame.

## Reducing pre-main

- Fewer dynamic frameworks (each adds link/initialise cost).
- Avoid heavy `static let` initialisers that run at launch.
- Reduce the number of classes and categories if they force dyld work (mostly Objective-C).
- Merge or lazily link frameworks where possible.

## Reducing post-main

- Do not block `application(_:didFinishLaunchingWithOptions:)` on network/disk.
- Build the first screen with the minimum needed data.
- Defer analytics, migrations, caches and feature warm-up until after first frame.
- Keep the initial view hierarchy shallow.

```swift
func application(_ app: UIApplication, didFinishLaunchingWithOptions: [:]?) -> Bool {
    // Only what is required to show the first frame
    window?.rootViewController = makeRootViewController()
    window?.makeKeyAndVisible()
    return true
}

func applicationDidBecomeActive(_ app: UIApplication) {
    startDeferredWork()   // after the first frame
}
```

## Measuring

- App Launch template: pre-main, post-main, first frame.
- Add signposts at scene setup and first render.
- MetricKit for field launch metrics.

## Real-world use cases

- An app that blocks launch on a database migration.
- A large storyboard or XIB that inflates slowly.
- Too many frameworks linked dynamically.

## Common pitfalls

- Doing migrations, analytics setup or prefetch synchronously at launch.
- Assuming the Simulator's launch time reflects a device.
- Optimising pre-main while post-main dominates.

## Best practices

- Keep launch code minimal; defer the rest.
- Reduce dynamic frameworks and static initialisers.
- Measure pre-main and post-main separately.
- Use MetricKit to track real-world launch across releases.

## Interview questions

1. What are the two launch phases and what costs belong to each?
2. How do you defer non-critical startup work?
3. Why can dynamic frameworks slow launch?

**Follow-up:** How do you show the first frame before data loads? Render a skeleton or cached content immediately, then update.
