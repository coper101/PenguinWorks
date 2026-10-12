---
title: MainActor
difficulty: Intermediate
tags: concurrency, mainactor, ui, isolation
summary: Guarantee UI work runs on the main thread, and use MainActor isolation to make that guarantee compile-time.
prerequisites: concurrency/actors-isolation
related: swiftui/view-performance-invalidation, concurrency/swift6-concurrency, concurrency/data-races
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

`@MainActor` is a global actor whose executor is the main thread. Annotating a type, method or property with it makes all access hop to (or require being on) the main actor. Under Swift 6, this is how the compiler proves UI code is safe.

## Annotating

```swift
@MainActor
@Observable
final class FeedModel {
    var items: [Item] = []

    func load() async throws {
        let fetched = try await api.items()   // runs off main actor
        items = fetched                        // back on main actor
    }
}
```

The `await` in the middle suspends; when it resumes, the rest of the function continues on the main actor.

## Hops at the boundary

```swift
func process() async {
    let result = await heavyWork()          // on a background executor
    await MainActor.run { status = "Done" } // explicit main-actor hop
}
```

`await MainActor.run { }` is the explicit escape hatch. It is often unnecessary if the enclosing type is `@MainActor`.

## `nonisolated` for off-main work

```swift
@MainActor
final class ImageLoader {
    nonisolated func decode(_ data: Data) -> CGImage? {
        // no main-actor access here; safe to run anywhere
        CGImageSourceCreateWithData(data as CFData, nil).flatMap { /* … */ }
    }
}
```

Mark heavy, stateless work `nonisolated` so it does not block the main actor.

## A common pattern

Read state on the main actor, do expensive work `nonisolated`, then apply results back on the main actor:

```swift
@MainActor final class RowModel {
    var image: CGImage?
    func load(_ url: URL) async throws {
        let data = try await URLSession.shared.data(from: url).0
        let decoded = await Self.decode(data)      // nonisolated static
        image = decoded
    }
    nonisolated static func decode(_ data: Data) async -> CGImage? { nil }
}
```

## Real-world use cases

- Marking view models and UI-bound services `@MainActor`.
- `@MainActor` model types in SwiftUI to avoid threading mistakes.
- `nonisolated` pure helpers that never touch UI.

## Common pitfalls

- Assuming a plain class is main-actor isolated — it is not unless annotated.
- Doing CPU-heavy work inside a main-actor method.
- Calling `MainActor.run` when already on the main actor (a harmless but unnecessary hop).
- Using `@MainActor` on a huge type, serialising unrelated work.

## Best practices

- Mark UI-facing types `@MainActor`.
- Keep heavy work `nonisolated` and apply results on the main actor.
- Let the compiler guide you: Swift 6 flags missing hops.

## Interview questions

1. What does `@MainActor` guarantee?
2. How do you run expensive work without blocking the main thread in a `@MainActor` type?
3. What is the difference between `@MainActor` and `DispatchQueue.main.async`?

**Follow-up:** Where does `@MainActor` fit with `Sendable`? The main actor's state is protected, so `@MainActor` types can be used across concurrency domains safely.
