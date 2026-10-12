---
title: AsyncSequence
difficulty: Advanced
tags: concurrency, asyncsequence, asyncstream, for-await
summary: Consume values over time with `for await`, and produce them from callbacks with AsyncStream.
prerequisites: concurrency/async-await
related: concurrency/continuations, concurrency/cancellation, recipes/pagination
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

`AsyncSequence` is the asynchronous analogue of `Sequence`: you iterate with `for await`, and each element may take time to arrive. Standard library and system APIs (file lines, URLSession bytes, notifications) return async sequences.

## Consuming

```swift
let lines = URL(fileURLWithPath: "log.txt").lines
for try await line in lines {
    print(line)
}
```

```swift
let (bytes, _) = try await URLSession.shared.bytes(from: url)
for try await byte in bytes { /* stream bytes */ }
```

## Operators

`map`, `filter`, `prefix`, `reduce` and friends are async-aware:

```swift
let names = url.lines
    .map { $0.trimmingCharacters(in: .whitespaces) }
    .filter { !$0.isEmpty }
    .prefix(10)

for try await name in names { print(name) }
```

## AsyncStream for callback sources

```swift
func notifications() -> AsyncStream<Notification> {
    AsyncStream { continuation in
        let token = NotificationCenter.default.addObserver(
            forName: .didUpdate, object: nil, queue: nil
        ) { note in
            continuation.yield(note)
        }
        continuation.onTermination = { _ in
            NotificationCenter.default.removeObserver(token)
        }
    }
}
```

`yield` produces an element; `finish` ends the sequence. `onTermination` runs when the consumer stops, which is where you tear down resources and honour cancellation.

## Backpressure

`AsyncStream` has a buffering policy (`.unbounded`, `.bufferingNewest(n)`, `.bufferingOldest(n)`). For slow consumers, choose a bounded policy to avoid unbounded memory growth.

## Real-world use cases

- Streaming model output from a server.
- Reacting to CoreLocation or NotificationCenter events.
- Paginated fetching exposed as one sequence.

## Common pitfalls

- Unbounded buffering for a fast producer and slow consumer.
- Forgetting `onTermination`, leaking observers.
- Assuming iteration order across concurrent producers is deterministic.
- Not handling `try await` errors from a throwing sequence.

## Best practices

- Choose a buffering policy based on producer/consumer speed.
- Always clean up in `onTermination`.
- Prefer built-in sequences (`.lines`, `.bytes`) before writing your own.
- Cancel the consuming task when the sequence is no longer needed.

## Interview questions

1. How does `AsyncSequence` differ from `Sequence`?
2. What does `onTermination` let you do?
3. Why does buffering policy matter?

**Follow-up:** How do you stop consuming an `AsyncSequence`? Cancel the task that is iterating it; termination then runs cleanup.
