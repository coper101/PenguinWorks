---
title: Concurrency Bottlenecks
difficulty: Advanced
tags: performance, concurrency, contention, actor
summary: Find and fix main-thread blocking, actor contention and serialised hot paths.
prerequisites: concurrency/actors-isolation, performance/time-profiler
related: concurrency/data-races, performance/time-profiler, performance/cpu-optimization
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Concurrency improves responsiveness only if work is actually off the critical path. Common bottlenecks include blocking the main thread, serialising everything through one actor, and awaiting in loops.

## Symptoms

- UI freezes during "async" work.
- Throughput plateaus despite more tasks.
- High latency from a single shared actor.

## Diagnosis

- **Time Profiler**: is the main thread busy in your code?
- **Threads view**: how many threads are active vs. blocked?
- **os_signpost** intervals around tasks to see serialisation.
- Instruments **Thread Sanitizer** for locking contention (indirect).

## Main-thread blocking

```swift
// Blocks the main actor
@MainActor func load() async throws {
    let data = try await fetch()          // fine: suspends
    let decoded = try decode(data)        // BLOCKS main actor
    items = decoded
}

// Move decode off the main actor
@MainActor func load() async throws {
    let data = try await fetch()
    let decoded = await Task.detached { try decode(data) }.value
    items = decoded
}
```

Prefer `nonisolated` helpers over `Task.detached` when possible.

## Actor contention

A single actor serialises all access. If it guards a hot path, all callers queue behind it. Split state across actors by concern, or make pure computation `nonisolated` and stateless.

```swift
actor Metrics {
    private var counts: [String: Int] = [:]
    func increment(_ key: String) { counts[key, default: 0] += 1 }   // uncontended: fast
}
```

Keep the actor's critical section tiny and do not hold it across `await` unnecessarily.

## Awaiting in loops

```swift
// Serial: n round trips
for id in ids { results.append(try await fetch(id)) }

// Concurrent with a cap
try await withThrowingTaskGroup(of: User.self) { group in
    for id in ids { group.addTask { try await fetch(id) } ; /* throttle */ }
    for try await user in group { results.append(user) }
}
```

## Real-world use cases

- A token/auth actor that serialises every request.
- JSON decoding on the main actor.
- Sequential network calls that could be concurrent.

## Common pitfalls

- Assuming `async` guarantees off-main execution.
- One global actor for unrelated state.
- Unbounded concurrency causing thread explosion.
- Holding an actor across a long `await`.

## Best practices

- Keep the main actor free of CPU work.
- Shard hot actors by concern.
- Throttle fan-out.
- Measure with signposts and Time Profiler.

## Interview questions

1. How can async code still block the main thread?
2. What is actor contention and how do you reduce it?
3. When should you convert a serial loop to a task group?

**Follow-up:** Why does an unbounded task group hurt? It can spawn more concurrent work than the system can schedule efficiently, causing contention and memory growth.
