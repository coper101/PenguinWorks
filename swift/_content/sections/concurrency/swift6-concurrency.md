---
title: Swift 6 Concurrency Checking
difficulty: Advanced
tags: concurrency, swift6, strict-concurrency, migration
summary: What Swift 6 changes, how strict checking works, and a migration strategy that does not block the team.
prerequisites: concurrency/sendable, concurrency/actors-isolation
related: concurrency/sendable, concurrency/data-races, concurrency/mainactor
version: Swift 6
lastReviewed: 2026-09-30
readingTime: 12
---

## Overview

Swift 6 enables full data-race checking by default. The compiler now proves that values crossing concurrency boundaries are `Sendable` and that isolated state is accessed only from its isolation domain. Code that was merely suspicious under Swift 5 becomes a compile error under Swift 6.

## Language modes

- **Swift 5 mode** — warnings for many concurrency issues.
- **Swift 6 mode** — errors. Adopt per-target with `-swift-version 6` or the `SWIFT_STRICT_CONCURRENCY` setting.

You can raise the checking level incrementally (`minimal` → `targeted` → `complete`) without switching language mode.

## The main diagnostics

1. **Non-Sendable type crossing an isolation boundary.** Make it `Sendable`, immutable, or actor-isolated.
2. **Non-isolated global mutable state.** Global `var`s must be immutable, `@MainActor`, or actor-isolated.
3. **Sending a non-Sendable closure.** Annotate `@Sendable` or remove captures.
4. **Accessing main-actor state off the main actor.** Add `await MainActor.run` or isolate the type.

## Migration strategy

1. Turn on strict concurrency warnings first (`SWIFT_STRICT_CONCURRENCY = targeted`).
2. Fix the obvious value types by conforming to `Sendable` (often automatic).
3. Annotate UI types with `@MainActor`.
4. Convert mutable singletons to actors or `@MainActor` types.
5. Introduce `@preconcurrency` temporarily for third-party APIs you cannot change.
6. Move to Swift 6 language mode target by target.

## `@preconcurrency`

```swift
@preconcurrency import LegacySDK
```

Suppresses Sendable diagnostics for a module during migration, so you can adopt checking gradually. It is a bridge, not a destination.

## Global state

```swift
// Swift 6 error: mutable global without isolation
var requestCount = 0

// Fixes
@MainActor var requestCount = 0
let immutableCount = 0
actor Registry { var count = 0 }
```

## Real-world use cases

- Multi-module apps migrating one package at a time.
- SDKs publishing `Sendable`-correct APIs for clients on Swift 6.
- Teams adopting actors to replace `DispatchQueue`-based state.

## Common pitfalls

- Adding `@unchecked Sendable` everywhere to silence errors.
- Migrating the whole codebase at once instead of target by target.
- Leaving `@preconcurrency` imports in place permanently.
- Ignoring warnings because the app still runs.

## Best practices

- Raise strictness gradually and keep CI green.
- Fix root causes (immutability, isolation) rather than suppress diagnostics.
- Prefer actors for shared mutable state.
- Document any `@unchecked Sendable` with the invariant it relies on.

## Interview questions

1. What does Swift 6 change compared with Swift 5 mode?
2. What are the main categories of Swift 6 concurrency errors?
3. How do you migrate a legacy target incrementally?

**Follow-up:** When is `@unchecked Sendable` acceptable? When a type is internally synchronised and you can document why the compiler cannot prove it.
