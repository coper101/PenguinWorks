---
title: Testable Application Design
difficulty: Intermediate
tags: architecture, testing, testability, mocks
summary: Design types so behaviour can be verified without a device, a network or a UI.
prerequisites: architecture/dependency-injection, architecture/repository-pattern
related: architecture/dependency-injection, architecture/repository-pattern, debugging/xcode-debugging-techniques
version: Swift Testing / XCTest
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Testability is a design outcome, not a testing-library feature. Code is testable when its dependencies are injectable, its state is explicit, its side effects are isolated and its time is controllable.

## Inject the seams

```swift
protocol Clock { var now: Date { get } }
protocol Analytics { func track(_ event: String) }

final class CheckoutModel {
    private let clock: Clock
    private let analytics: Analytics
    private let payments: PaymentProcessing

    init(clock: Clock, analytics: Analytics, payments: PaymentProcessing) { /* … */ }

    func start() {
        analytics.track("checkout_started_\(clock.now)")
    }
}
```

Tests inject a `TestClock` and a `SpyAnalytics`, so no real time or network is needed.

## Test doubles

- **Stub** — returns canned data.
- **Spy** — records calls for assertions.
- **Fake** — a working simplified implementation (in-memory repository).
- **Mock** — pre-programmed expectations.

Prefer fakes and spies over elaborate mock frameworks; they are simpler and less brittle.

## Deterministic side effects

Wrap randomness, time and identifiers behind protocols (`RandomNumberGenerator`, `Clock`, `UUIDGenerator`). Then behaviour is reproducible.

```swift
protocol IDGenerator { func make() -> UUID }
```

## Testing async code

```swift
@Test func loadsUser() async throws {
    let repo = FakeUserRepository(user: .fixture(name: "Ada"))
    let model = ProfileModel(repository: repo)
    await model.load()
    #expect(model.state == .loaded(.fixture(name: "Ada")))
}
```

Swift Testing (`@Test`, `#expect`) is the modern default on newer toolchains; XCTest remains fully supported.

## Tests as design feedback

If a type is hard to test, that is a signal: too many responsibilities, hidden dependencies or global state. Fixing testability usually fixes design.

## Real-world use cases

- Unit-testing view model state transitions.
- Testing a repository's caching policy with a fake store.
- Snapshot-testing design-system components.

## Common pitfalls

- Testing implementation details instead of behaviour.
- Depending on real network/time in unit tests.
- Mocking everything, producing tests that assert nothing meaningful.
- Not injecting a clock, so tests flake.

## Best practices

- Inject protocols at boundaries.
- Control time and randomness.
- Prefer fakes and spies.
- Test behaviour, not private methods.
- Keep a fast unit-test suite that runs in CI.

## Interview questions

1. What makes code testable?
2. Which test double would you use for a repository and why?
3. How do you test time-dependent logic?

**Follow-up:** How would you test that a retry happens exactly three times? Use a spy that fails twice and asserts the call count.
