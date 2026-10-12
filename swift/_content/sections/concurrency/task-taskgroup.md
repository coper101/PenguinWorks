---
title: Task and TaskGroup
difficulty: Intermediate
tags: concurrency, task, taskgroup, unstructured
summary: Launch unstructured work with Task, and fan out many children with structured task groups.
prerequisites: concurrency/async-await
related: concurrency/structured-concurrency, concurrency/cancellation, concurrency/task-taskgroup
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

A `Task` is a unit of asynchronous work. Creating one with `Task { … }` starts **unstructured** concurrency: the task is not a child of the current context, so it is not cancelled or awaited automatically. `TaskGroup` and `async let` provide **structured** concurrency, where children are bound to a parent's lifetime.

## Unstructured Task

```swift
final class Presenter {
    private var loadTask: Task<Void, Never>?

    func load() {
        loadTask?.cancel()
        loadTask = Task { [weak self] in
            let items = await self?.fetch() ?? []
            guard !Task.isCancelled else { return }
            self?.items = items
        }
    }
}
```

Store and cancel the handle to avoid leaks and out-of-order updates. Unstructured tasks inherit the actor context and priority of their creation site but not cancellation.

## TaskGroup

```swift
func loadAll(ids: [String]) async throws -> [User] {
    try await withThrowingTaskGroup(of: User.self) { group in
        for id in ids {
            group.addTask { try await fetchUser(id: id) }
        }
        var users: [User] = []
        for try await user in group {
            users.append(user)
        }
        return users
    }
}
```

The group awaits all children before it returns. If one child throws, the group cancels the rest.

## Limiting concurrency

Unbounded fan-out can exhaust resources. Throttle by adding tasks in batches or by keeping a fixed number in flight.

```swift
try await withThrowingTaskGroup(of: Void.self) { group in
    let limit = 4
    var index = 0
    while index < min(limit, work.count) {
        group.addTask { await work[index](); index += 1 }   // illustrative
    }
    while try await group.next() != nil {
        // add the next when one finishes
    }
}
```

## Discarding results

`withDiscardingTaskGroup` (Swift 5.9+) avoids accumulating child results, which matters for long-running servers of small tasks.

## Real-world use cases

- Parallel downloads with a concurrency cap.
- Fan-out map/filter over a collection.
- Fire-and-forget UI updates tied to a cancellable handle.

## Common pitfalls

- Creating a `Task` in a loop with no cap, spawning thousands.
- Not storing the handle, so cancellation is impossible.
- Mutating UI from an unstructured task without `await MainActor.run` or main-actor isolation.
- Assuming `Task { }` is a child task — it is not.

## Best practices

- Prefer structured concurrency for scoped work.
- Store task handles for anything cancellable.
- Throttle fan-out.
- Use `group.addTask` closures that are `@Sendable` and do not capture non-Sendable values.

## Interview questions

1. What is the difference between `Task { }` and a task group child?
2. How do you cancel work started with `Task`?
3. How do you limit the number of concurrent operations?

**Follow-up:** Are child tasks of a group guaranteed to finish before the group returns? Yes — structured concurrency waits for all children.
