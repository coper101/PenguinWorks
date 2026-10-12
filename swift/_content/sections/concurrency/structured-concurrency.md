---
title: Structured Concurrency
difficulty: Advanced
tags: concurrency, structured-concurrency, task-tree
summary: Bind child tasks to a parent's scope so lifetimes, errors and cancellation compose predictably.
prerequisites: concurrency/task-taskgroup, concurrency/cancellation
related: concurrency/task-taskgroup, concurrency/cancellation, concurrency/async-await
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Structured concurrency means child tasks are attached to a parent scope. A parent cannot finish until all its children do, errors propagate up the tree, and cancelling the parent cancels the children. `async let` and `withTaskGroup` are the structured primitives; `Task { }` is unstructured.

## A task tree

```swift
func renderPage() async throws -> Page {
    async let header = loadHeader()     // child of renderPage
    async let body = loadBody()         // child of renderPage
    return try await Page(header: header, body: body)
}
```

If `loadBody()` throws, `loadHeader()` is cancelled automatically because both are children of `renderPage`.

## Groups compose

Groups can nest, and the tree is explicit in the code:

```swift
try await withThrowingTaskGroup(of: [User].self) { group in
    for region in regions {
        group.addTask {
            try await withThrowingTaskGroup(of: User.self) { inner in
                for id in await ids(in: region) { inner.addTask { try await fetch(id) } }
                return try await inner.reduce(into: []) { $0.append($1) }
            }
        }
    }
    var all: [User] = []
    for try await regionUsers in group { all += regionUsers }
    return all
}
```

## Unstructured concurrency is a deliberate escape

Use `Task { }` when work must outlive the current scope — an analytics flush, a background refresh. Prefer structured primitives for everything scoped.

## Progress and ordering

`group.next()` returns children as they finish (completion order), while `reduce` order depends on iteration. If order matters, index your results and sort.

## Real-world use cases

- Parallel loading of independent sections of a screen.
- Recursive directory processing.
- Fan-out then fan-in aggregation.

## Common pitfalls

- Escaping the scope with an unstructured `Task` and losing cancellation.
- Assuming children finish in insertion order.
- Letting one failure leave siblings running — structured groups cancel them.
- Creating a group that returns before all children run.

## Best practices

- Prefer `async let` and groups over `Task { }` for scoped work.
- Use `withThrowingTaskGroup` when a child can fail.
- Throttle fan-out; structured does not mean unbounded.
- Keep the tree visible in the source.

## Interview questions

1. What guarantees does structured concurrency provide?
2. What happens to sibling tasks when one child throws?
3. When is unstructured `Task { }` the right choice?

**Follow-up:** Does a task group's parent finish before children? No — it awaits them, and cancellation propagates down the tree.
