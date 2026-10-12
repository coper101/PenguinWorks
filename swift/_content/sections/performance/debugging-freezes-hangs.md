---
title: Debugging Freezes and Hangs
difficulty: Advanced
tags: performance, hangs, watchdog, main-thread
summary: Reproduce, capture and fix main-thread hangs and watchdog terminations.
prerequisites: performance/time-profiler, concurrency/concurrency-bottlenecks
related: performance/concurrency-bottlenecks, performance/time-profiler, debugging/xcode-debugging-techniques
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

A hang is the main thread unable to respond for too long. The system's **watchdog** terminates an app that does not finish launching (about 20 s) or does not respond within a threshold. Hangs are often filesystem, network, database or lock waits on the main thread.

## Symptoms

- App "freezes" then is killed (watchdog: `0x8badf00d`).
- UI unresponsive during an operation.
- Spinning beachball on macOS, no touch response on iOS.

## Capturing a hang

1. **Instruments** → Time Profiler, record until the hang, then inspect the main thread's stack at the stall.
2. **MetricKit** `MXHangDiagnostic` for field hangs with stack traces.
3. **watchdog crash logs** in the device's crash reports.
4. Attach the debugger mid-hang and use the Debug navigator to see the main thread stack.

## Usual causes

- Synchronous disk I/O on the main thread.
- Network calls without async.
- A deadlock: two queues/actors waiting on each other.
- A long `DispatchQueue.main.sync` from a background queue (deadlock if already on main).
- Large synchronous decode/parse.
- Holding a lock while doing work.

## A deadlock example

```swift
// If already on the main queue, this deadlocks
DispatchQueue.global().async { }
DispatchQueue.main.sync { /* never runs if main is waiting */ }
```

## Fixes

- Move I/O off the main thread (`async/await`, background tasks).
- Never `DispatchQueue.main.sync` from code that might already be on main.
- Break lock-ordering cycles.
- Keep the main actor free of CPU work.
- Add a watchdog-style assertion in debug to catch long main-thread work.

```swift
// Detect long main-thread work (debug only)
let start = CFAbsoluteTimeGetCurrent()
defer {
    let elapsed = CFAbsoluteTimeGetCurrent() - start
    assert(elapsed < 0.05, "Main thread blocked for \(elapsed)s")
}
```

## Real-world use cases

- A launch that reads a large file synchronously.
- A database migration on the main thread.
- A deadlock between a serial queue and the main queue.

## Common pitfalls

- Reproducing only in the Simulator.
- Assuming a hang is always CPU-bound (often it is I/O or a wait).
- Ignoring `0x8badf00d` watchdog logs.

## Best practices

- Keep main-thread work short and non-blocking.
- Capture hang stacks with MetricKit in production.
- Avoid `main.sync` entirely where possible.
- Test on slow devices and constrained storage.

## Interview questions

1. What does the watchdog terminate an app for?
2. How do you capture the stack of a hang?
3. What causes a `main.sync` deadlock?

**Follow-up:** What does `0x8badf00d` mean in a crash report? The watchdog killed the app for failing to launch or respond in time.
