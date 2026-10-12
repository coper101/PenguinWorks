---
title: Sendable
difficulty: Advanced
tags: concurrency, sendable, data-races, swift6
summary: The protocol the compiler uses to prove a value can cross concurrency boundaries safely.
prerequisites: concurrency/actors-isolation, language/value-vs-reference
related: concurrency/data-races, concurrency/swift6-concurrency, language/memory-management-arc
version: Swift 5.5+
lastReviewed: 2026-09-30
readingTime: 11
---

## Overview

`Sendable` marks a type whose values can be passed across concurrency domains without data races. The compiler infers it for value types with `Sendable` members and for immutable reference types. A `@Sendable` closure captures only `Sendable` values and is itself safe to pass between tasks.

## What is Sendable

- `struct`/`enum` with all `Sendable` stored properties — automatically `Sendable`.
- `final class` with only immutable (`let`) `Sendable` properties — can be `Sendable`.
- Actors are implicitly `Sendable` (their state is protected).
- Reference types with mutable state are **not** `Sendable` unless you isolate them.

```swift
struct Point: Sendable { var x: Double; var y: Double }     // value, Sendable

final class ImmutableConfig: Sendable {
    let name: String                                        // let only -> Sendable
    init(name: String) { self.name = name }
}

final class MutableCounter { var value = 0 }                // NOT Sendable
```

## `@unchecked Sendable`

When you know a type is safe but the compiler cannot prove it (you guard it with a lock), you can opt out of checking:

```swift
final class LockedBox<Value>: @unchecked Sendable {
    private let lock = NSLock()
    private var value: Value
    init(_ value: Value) { self.value = value }
    func withValue<T>(_ body: (inout Value) -> T) -> T {
        lock.lock(); defer { lock.unlock() }
        return body(&value)
    }
}
```

This is a promise, not a proof. Use sparingly and document the invariant.

## Closures

```swift
func run(_ work: @Sendable @escaping () -> Void) {
    Task.detached { work() }
}
```

A `@Sendable` closure cannot capture a non-Sendable `var` or a non-Sendable class instance.

## Why it matters

Under Swift 6, a non-`Sendable` value crossing an isolation boundary is a compile error. This catches the exact class of bugs that Thread Sanitizer would find at runtime, but at build time.

## Real-world use cases

- Ensuring DTOs and models are safely passable between actors.
- Marking test doubles `@unchecked Sendable` with a lock.
- Auditing a legacy class before making it an actor.

## Common pitfalls

- Reaching for `@unchecked Sendable` to silence errors instead of fixing the design.
- Assuming a class with `let` array properties is Sendable — `Array` is Sendable, but only if its Element is.
- Passing a closure that captures `self` from a non-Sendable class into a task.

## Best practices

- Prefer value types for cross-domain data.
- Make classes immutable or actor-isolated to be Sendable.
- Use `@unchecked Sendable` only with a documented lock.
- Let Swift 6 diagnostics drive the audit.

## Interview questions

1. Which types are automatically `Sendable`?
2. Why is a class with a mutable property not `Sendable`?
3. When is `@unchecked Sendable` justified?

**Follow-up:** Is a closure `Sendable` by default? No — you must annotate `@Sendable`, and it only accepts `Sendable` captures.
