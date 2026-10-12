---
title: async/await
difficulty: Intermediate
tags: concurrency, async-await, suspension
summary: Write asynchronous code that reads like synchronous code, and understand what a suspension point really means.
prerequisites: language/error-handling, language/closures-capture-lists
related: concurrency/task-taskgroup, concurrency/structured-concurrency, concurrency/cancellation
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

An `async` function can suspend partway through and resume later. `await` marks a suspension point: the current task may pause, letting other work run, while the runtime keeps the task's state on the heap. This is why an `await` does not block a thread — it suspends the task.

## Declaring and calling

```swift
func fetchUser(id: String) async throws -> User {
    let (data, _) = try await URLSession.shared.data(from: url(for: id))
    return try JSONDecoder().decode(User.self, from: data)
}

let user = try await fetchUser(id: "42")
```

`async` functions can be called from other `async` functions or from a `Task`. You cannot call one from a synchronous context without creating a task or a continuation.

## Suspension is not blocking

```swift
func loadTwo() async throws -> (User, [Post]) {
    async let user = fetchUser(id: "42")
    async let posts = fetchPosts(userID: "42")
    return try await (user, posts)   // runs concurrently
}
```

`async let` starts a child task immediately; the awaits collect the results. Sequentially awaiting each would run them one after another.

## async versus completion handlers

- Completion handlers invert control and nest.
- `async/await` keeps control flow linear and errors use `try`.
- A completion-based API can be adapted with `withCheckedContinuation` (see [Continuations](/swift/concurrency/continuations/)).

## Real-world use cases

- Networking, file I/O, database access.
- SwiftUI `.task { await model.load() }`.
- Parallel fetches with `async let` or a task group.

## Common pitfalls

- Assuming `await` switches threads. It switches **executors**, not necessarily threads.
- Calling `await` on the main actor for heavy synchronous work, blocking the UI.
- Ignoring that a resumed task may not be on the same thread as before.
- Forgetting that `async` functions are not automatically cancellation-aware; check `Task.isCancelled`.

## Best practices

- Mark functions `async throws` and let callers decide policy.
- Use `async let` or task groups for independent work.
- Keep suspension points coarse, not inside tight loops.
- Prefer `withTaskCancellationHandler` for cleanup.

## Interview questions

1. What actually happens at an `await`?
2. Does `async/await` create threads?
3. How do you run two independent async calls concurrently?

**Follow-up:** Why can an `async` function not be called from `deinit`? `deinit` is synchronous and cannot await; you cannot suspend there.
