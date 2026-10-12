---
title: Dependency Injection
difficulty: Intermediate
tags: architecture, dependency-injection, testability, protocols
summary: Supply collaborators from outside instead of constructing them inside, and choose between constructor, property and container injection.
prerequisites: language/protocols-extensions, architecture/testable-design
related: architecture/testable-design, architecture/repository-pattern, architecture/modular-architecture
version: General
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Dependency injection (DI) means a type receives its collaborators rather than creating them. This inverts control, makes behaviour swappable, and is the single biggest enabler of testing. DI is a technique, not a framework.

## Constructor injection

The default and best form: dependencies are explicit and non-optional.

```swift
protocol UserRepository { func current() async throws -> User }

final class ProfileModel {
    private let repository: UserRepository
    init(repository: UserRepository) { self.repository = repository }
}
```

## Property and environment injection

For SwiftUI, inject through the environment:

```swift
extension EnvironmentValues {
    @Entry var userRepository: UserRepository = LiveUserRepository()
}

struct ProfileView: View {
    @Environment(\.userRepository) private var repository
}
```

For UIKit, property injection is common via a composition root that wires objects.

## Containers

A lightweight container resolves dependencies from a registry. Prefer explicit wiring at the app's composition root; use a container only when the graph is large.

```swift
final class AppContainer {
    lazy var api: APIClient = URLSessionAPIClient()
    lazy var users: UserRepository = LiveUserRepository(api: api)
    func makeProfileModel() -> ProfileModel { ProfileModel(repository: users) }
}
```

## Test doubles

Because dependencies are protocols, tests inject fakes:

```swift
struct FakeUserRepository: UserRepository {
    var user: User
    func current() async throws -> User { user }
}
```

## Real-world use cases

- Swapping a live network client for a stub in previews and tests.
- Injecting a clock so time-dependent logic is deterministic.
- Providing different analytics implementations for debug and release.

## Common pitfalls

- Using a service locator (global `resolve()`) that hides dependencies.
- Injecting concrete types, which defeats the purpose.
- Creating a DI container before the object graph justifies one.
- Overusing singletons alongside DI, so tests still share global state.

## Best practices

- Prefer constructor injection; make dependencies `let`.
- Program to protocols at boundaries you need to swap or test.
- Centralise wiring in a composition root.
- Inject a `Clock`/`Date` provider for deterministic tests.

## Interview questions

1. What is the difference between DI and a service locator?
2. How does DI enable testing?
3. When is a DI container justified?

**Follow-up:** How do you inject dependencies into SwiftUI previews? Provide test doubles through the environment in the `#Preview` closure.
