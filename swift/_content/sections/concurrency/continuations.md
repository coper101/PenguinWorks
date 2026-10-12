---
title: Continuations
difficulty: Advanced
tags: concurrency, continuations, bridging, checked
summary: Bridge callback- and delegate-based APIs into async/await with checked or unsafe continuations.
prerequisites: concurrency/async-await
related: concurrency/async-await, concurrency/asyncsequence, concurrency/cancellation
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

A continuation suspends an `async` function and provides a closure to resume it. Use `withCheckedContinuation` (safe, with runtime checks) or `withUnsafeContinuation` (no checks) to adapt completion-handler, delegate and callback APIs into `async` functions.

## Single-value continuation

```swift
func currentLocation() async -> CLLocation {
    await withCheckedContinuation { continuation in
        manager.requestLocation { location in
            continuation.resume(returning: location)
        }
    }
}

func data(for request: URLRequest) async throws -> Data {
    try await withCheckedThrowingContinuation { continuation in
        session.dataTask(with: request) { data, _, error in
            if let error { continuation.resume(throwing: error) }
            else { continuation.resume(returning: data ?? Data()) }
        }.resume()
    }
}
```

## The one-resume rule

A continuation may be resumed **exactly once**. `withCheckedContinuation` traps if you resume twice or never, which surfaces bugs during development. `withUnsafeContinuation` skips the checks for speed but makes misuse a silent crash or hang.

```swift
// Correct: guard against both paths running
continuation.resume(returning: result)   // only one of these executes
```

## Delegates with `AsyncStream`

For a delegate that fires repeatedly, prefer `AsyncStream` over a continuation you would need to resume many times. See [AsyncSequence](/swift/concurrency/asyncsequence/).

```swift
func locations() -> AsyncStream<CLLocation> {
    AsyncStream { continuation in
        manager.onUpdate = { continuation.yield($0) }
        manager.onFinish = { continuation.finish() }
        continuation.onTermination = { _ in manager.stop() }
    }
}
```

## Continuations are not cancellable by default

Bridging an API that cannot be cancelled loses cancellation unless you add a `withTaskCancellationHandler` that also resumes the continuation.

## Real-world use cases

- Wrapping `UNUserNotificationCenter` request/response calls.
- Adapting `AVFoundation` callbacks.
- Bridging `WKWebView` navigation completion.

## Common pitfalls

- Resuming twice (checked continuation traps).
- Never resuming, hanging the awaiting task.
- Using an unsafe continuation and getting silent corruption.
- Ignoring cancellation for a long callback API.

## Best practices

- Prefer `withCheckedContinuation` unless profiling proves the checks matter.
- Use `AsyncStream` for multi-value callbacks.
- Add cancellation handling when the underlying API supports it.
- Keep the bridging function tiny and well-tested.

## Interview questions

1. What is the one-resume rule?
2. When would you use `withUnsafeContinuation`?
3. How do you bridge a repeated callback API?

**Follow-up:** How do you add cancellation to a bridged API? Wrap it in `withTaskCancellationHandler` and cancel the underlying operation in `onCancel`.
