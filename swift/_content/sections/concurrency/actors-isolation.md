---
title: Actors and Isolation
difficulty: Advanced
tags: concurrency, actors, isolation, mutual-exclusion
summary: Protect mutable state with actors, and reason about isolation as the boundary between concurrent contexts.
prerequisites: concurrency/async-await, concurrency/sendable
related: concurrency/mainactor, concurrency/data-races, concurrency/swift6-concurrency
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 11
---

## Overview

An `actor` is a reference type that protects its mutable state by serialising access. Only one task executes actor-isolated code at a time. Calling an actor's method from outside is an `await` because the call may need to wait for the actor to be free.

## Defining an actor

```swift
actor Counter {
    private(set) var value = 0

    func increment() -> Int {
        value += 1
        return value
    }
}

let counter = Counter()
let n = await counter.increment()
```

There is no `await` inside `increment`: while running on the actor, the body has exclusive access.

## Isolation rules

- Actor-isolated state is only accessible from within the actor or via `await`.
- `nonisolated` members run outside the actor's isolation and cannot touch its isolated state.
- Immutable `let` properties of `Sendable` type can be accessed without isolation.

```swift
actor Cache {
    let name: String                 // let of Sendable -> nonisolated access ok
    private var storage: [Key: Value] = [:]

    nonisolated func describe() -> String { "cache \(name)" }

    func get(_ key: Key) -> Value? { storage[key] }
}
```

## Actor reentrancy

When an actor method suspends at an `await`, other tasks may run on the actor before it resumes. This can break invariants that assume no interleaving:

```swift
actor Balance {
    private var amount = 0
    func deposit(_ value: Int) async {
        let current = amount
        await log(current)          // suspension: another deposit may run here
        amount = current + value    // lost update risk
    }
    private func log(_ value: Int) async {}
}
```

Avoid holding state across `await` when correctness depends on it; re-read after resuming.

## Global actors

`@MainActor` is a global actor. You can define your own with `@globalActor` to serialise a subsystem (for example a database actor).

## Real-world use cases

- A shared cache or token store.
- A database or persistence layer with serialised writes.
- A rate limiter or metrics collector.

## Common pitfalls

- Assuming actor methods run on the main thread — they do not.
- Holding stale state across an `await` (reentrancy bug).
- Using an actor for pure computation where no state is shared.
- Awaiting actor calls in a tight loop, causing contention.

## Best practices

- Keep actor methods synchronous internally; await at the boundary.
- Re-read state after every `await` if correctness depends on it.
- Use actors to protect state, not as a thread pool.
- Prefer `let` Sendable state to avoid isolation overhead.

## Interview questions

1. Why is an actor call `await`-ed from outside?
2. What is actor reentrancy and how does it cause bugs?
3. When can you access an actor property without `await`?

**Follow-up:** What is a `nonisolated` method for? It lets code outside the actor call it without waiting, at the cost of no access to isolated state.
