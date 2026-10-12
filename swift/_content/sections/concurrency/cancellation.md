---
title: Cancellation
difficulty: Intermediate
tags: concurrency, cancellation, cooperative
summary: Cancellation is cooperative: you request it, and long-running work checks for it.
prerequisites: concurrency/async-await, concurrency/task-taskgroup
related: concurrency/task-taskgroup, concurrency/async-await, concurrency/structured-concurrency
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 8
---

## Overview

Swift cancellation is cooperative. `task.cancel()` marks the task cancelled; it does not forcibly stop execution. Code must check `Task.isCancelled` or call `try Task.checkCancellation()` at safe points.

## Requesting and checking

```swift
let task = Task {
    for page in 1...100 {
        try Task.checkCancellation()      // throws CancellationError
        await load(page)
    }
}
task.cancel()
```

`checkCancellation()` throws; `isCancelled` returns a `Bool` for branching.

## Cancellation propagates with structure

Cancelling a parent cancels children. `async let` and task groups inherit cancellation. Structured concurrency makes "stop everything" a single call.

```swift
struct DetailView: View {
    @State private var model = Model()
    var body: some View {
        Content(model: model)
            .task { await model.load() }   // cancelled when the view disappears
    }
}
```

`.task` cancels automatically when identity disappears.

## AsyncSequence and cancellation

Iterating a `for await` loop checks cancellation between elements. Many APIs throw `CancellationError` when cancelled mid-suspend.

## Cleaning up

```swift
await withTaskCancellationHandler {
    await work()
} onCancel: {
    connection.close()      // runs immediately when cancelled
}
```

Do cleanup in `onCancel` or in `defer` after checking cancellation.

## URLSession integration

`URLSession`'s async APIs are cancellation-aware: cancelling the task cancels the request.

## Real-world use cases

- Cancel a search request when the query changes.
- Cancel image loading for cells that scrolled away.
- Cancel a long import when the user backs out.

## Common pitfalls

- Assuming `cancel()` stops CPU-bound work immediately.
- Swallowing `CancellationError` and continuing anyway.
- Not checking cancellation in a long loop.
- Doing cleanup without `withTaskCancellationHandler` when the task is suspended.

## Best practices

- Check cancellation at natural boundaries.
- Treat `CancellationError` as normal control flow.
- Use structured concurrency so cancellation propagates.
- Reuse one task handle and cancel before starting new work.

## Interview questions

1. Why is Swift cancellation cooperative rather than preemptive?
2. How does `.task` in SwiftUI cancel work?
3. What is `withTaskCancellationHandler` for?

**Follow-up:** Does cancelling a task free the thread it was on? It suspends/ends the task; the executor is released when the task stops running.
