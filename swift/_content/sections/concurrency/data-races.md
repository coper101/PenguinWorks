---
title: Data Races
difficulty: Advanced
tags: concurrency, data-races, thread-sanitizer, swift6
summary: What a data race is, why it is undefined behaviour, and how Swift 6, actors and sanitizers prevent it.
prerequisites: concurrency/sendable, concurrency/actors-isolation
related: concurrency/swift6-concurrency, debugging/thread-sanitizer, performance/concurrency-bottlenecks
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

A data race happens when two threads access the same memory concurrently and at least one access is a write, without synchronisation. Data races are undefined behaviour: the result is not merely wrong, it is unpredictable, and can vary by optimisation level and hardware.

## A classic race

```swift
final class Counter {
    private var value = 0
    func increment() { value += 1 }   // read-modify-write, not atomic
}

let counter = Counter()
DispatchQueue.concurrentPerform(iterations: 1000) { _ in
    counter.increment()               // lost updates
}
```

`value += 1` is a load, add and store. Interleaving loses increments.

## Detecting races

- **Thread Sanitizer (TSan)** — run the app with `-fsanitize=thread` in Xcode to catch races at runtime.
- **Swift 6 strict checking** — flags races at compile time via `Sendable` and isolation.
- Reproduce under load; races often hide in light testing.

## Preventing races

- Protect state with an actor or a lock.
- Make shared values immutable and `Sendable`.
- Isolate UI state on the main actor.
- Avoid sharing mutable reference types across tasks.

```swift
actor SafeCounter {
    private var value = 0
    func increment() { value += 1 }
    func current() -> Int { value }
}
```

For a lock-based approach, use `NSLock`, `os_unfair_lock` or `OSAllocatedUnfairLock` and keep the critical section tiny.

## Atomics and ordering

Swift does not ship a general atomic type in the standard library (there is an `Atomic` proposal in progress). In the meantime, use `ManagedAtomic` from `swift-atomics`, or locks. Do not hand-roll atomics.

## Real-world use cases

- Shared caches mutated from multiple tasks.
- Counters and metrics incremented concurrently.
- Singletons with lazy mutable state.

## Common pitfalls

- Assuming `DispatchQueue` usage alone prevents all races; you must serialise the same queue.
- Using non-atomic compound operations (`count += 1`, `array.append`) from many threads.
- Reading from Thread Sanitizer only once; run under realistic load.

## Best practices

- Prefer actors over locks for stateful shared types.
- Keep shared data immutable and Sendable.
- Run TSan in CI for concurrent code.
- Adopt Swift 6 language mode to catch races at build time.

## Interview questions

1. What exactly is a data race?
2. Why is `array.append` from two threads unsafe?
3. How do Thread Sanitizer and Swift 6 complement each other?

**Follow-up:** Is using a serial `DispatchQueue` the same as an actor? Functionally similar for serialisation; actors add compiler-checked isolation and `await` integration.
