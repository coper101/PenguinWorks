---
title: Thread Sanitizer
difficulty: Advanced
tags: debugging, thread-sanitizer, data-races, concurrency
summary: Detect data races at runtime before they corrupt production state.
prerequisites: concurrency/data-races, debugging/breakpoints
related: concurrency/data-races, concurrency/swift6-concurrency, debugging/address-sanitizer
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 8
---

## Overview

Thread Sanitizer (TSan) is a runtime detector for data races and some deadlocks. Enable it in the Scheme's Diagnostics (``-fsanitize=thread``) or under Edit Scheme ▸ Run ▸ Diagnostics ▸ Thread Sanitizer.

## What it catches

- Concurrent reads/writes to the same memory without synchronisation.
- Some lock-ordering deadlocks.
- Unsafe use of `DispatchQueue` from multiple threads.

## Symptoms it explains

- Intermittent, hard-to-reproduce wrong results.
- Crashes that vanish under the debugger.
- Corruption in shared caches or counters.

## Using it

1. Enable TSan for the Run (and Test) action.
2. Exercise the app under realistic concurrency and load.
3. When it reports, read the two stacks: the racing accesses and the shared address.
4. Fix by serialising access (actor/lock) or making the value immutable/Sendable.

## Interpreting a report

```text
WARNING: ThreadSanitizer: data race
  Write of size 8 at ...
    #0 Counter.increment ...
  Previous read of size 8 at ...
    #0 Counter.increment ...
```

The report names the exact variable and both accesses. That is the bug.

## Overhead and limits

TSan adds CPU and memory overhead and only finds races on executed paths. It cannot prove absence of races — combine it with Swift 6 strict checking.

## Real-world use cases

- A shared counter incremented from several queues.
- A cache mutated from a background queue and read on main.
- A singleton with lazy mutable state.

## Common pitfalls

- Enabling TSan on a release build (it is for debug/testing).
- Running it lightly so races never trigger.
- Treating a TSan report as a false positive and suppressing it.
- Relying only on TSan and not adopting Swift 6 checking.

## Best practices

- Run TSan in CI for concurrency-heavy tests.
- Reproduce with realistic load and timing.
- Fix by design (actors, immutability), not by suppression.
- Adopt Swift 6 strict concurrency for compile-time coverage.

## Interview questions

1. What does Thread Sanitizer detect?
2. Why can TSan miss a race?
3. How do TSan and Swift 6 complement each other?

**Follow-up:** Why is "it never happens in testing" not evidence of safety? Races depend on timing; unexecuted interleavings are invisible to TSan.
