---
title: Battery and Energy Usage
difficulty: Advanced
tags: performance, battery, energy, power
summary: Find what drains the battery and reduce energy with batching, coalescing and fewer wake-ups.
prerequisites: performance/background-execution, performance/networking-performance
related: performance/background-execution, performance/networking-performance, swiftui/widgets-app-intents
version: iOS 17+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Energy is consumed by CPU work, radio (networking), GPU, location and sensors. The biggest wins usually come from reducing **wake-ups** and **radio activity**, not from micro-optimising CPU. The Energy Log instrument attributes energy to components.

## Symptoms

- The app appears in Settings ▸ Battery with high usage.
- Device warms up during use.
- Background battery drain.

## What costs energy

- Frequent timers and polling.
- Small, frequent network requests (radio stays on).
- Continuous location with high accuracy.
- Frequent background wake-ups.
- High frame rates rendering static content.
- Animations that run off-screen.

## Diagnostics

- **Energy Log** instrument: energy impact per component.
- **MetricKit**: `MXMetricPayload` energy metrics from the field.
- Xcode's Energy gauge while running on device.
- Instruments **Network** + **Energy** together for radio cost.

## Fixes

- **Coalesce network requests** — one batch beats many small requests (radio ramp-up dominates).
- **Increase timer intervals** or replace polling with push.
- **Lower location accuracy/monitor significant location changes.**
- **Pause work when the app is backgrounded or the screen is off.**
- **Reduce frame rate** for static UIs (ProMotion draws 120 Hz by default).
- **Defer non-urgent work** to charging/wifi via `BGProcessingTask`.

```swift
// Prefer significant-change location when you do not need continuous GPS
manager.startMonitoringSignificantLocationChanges()
```

## Real-world use cases

- A fitness app draining battery with continuous GPS.
- A chat app polling every 5 seconds.
- A dashboard animating constantly with no visible change.

## Common pitfalls

- Assuming CPU usage alone predicts battery.
- Keeping the radio busy with frequent tiny requests.
- High-accuracy location when coarse suffices.
- Leaving timers running in the background.

## Best practices

- Batch and coalesce network work.
- Reduce wake-ups and timer frequency.
- Pause animations and updates when not visible.
- Measure with Energy Log and MetricKit.

## Interview questions

1. Which hardware components dominate battery use?
2. Why are many small network requests worse than one large one?
3. How do you reduce location energy cost?

**Follow-up:** Why can a 60 Hz static screen waste energy? The display and GPU keep redrawing; lowering the refresh rate or pausing updates saves power.
