---
title: Repository Pattern
difficulty: Intermediate
tags: architecture, repository, persistence, testing
summary: Hide data sources behind a collection-like interface so the domain does not depend on networking or a database.
prerequisites: architecture/dependency-injection, language/protocols-extensions
related: architecture/dependency-injection, architecture/testable-design, recipes/persistence
version: General
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

A repository presents data access as if it were an in-memory collection. The domain asks for entities; the repository decides whether they come from the network, a database, or a cache. This keeps framework types (URLSession, SwiftData, Core Data) out of the domain.

## Interface

```swift
protocol UserRepository {
    func current() async throws -> User
    func update(_ user: User) async throws
    func observe(id: User.ID) -> AsyncStream<User>
}
```

The protocol speaks in domain types, not DTOs or managed objects.

## Implementation

```swift
final class LiveUserRepository: UserRepository {
    private let api: APIClient
    private let store: UserStore

    init(api: APIClient, store: UserStore) {
        self.api = api
        self.store = store
    }

    func current() async throws -> User {
        if let cached = try await store.user() { return cached }
        let dto = try await api.get("/me", as: UserDTO.self)
        let user = dto.toDomain()
        try await store.save(user)
        return user
    }
}
```

The repository owns the caching policy — network vs. cache, freshness, fallback — so the domain stays simple.

## Mapping at the boundary

Convert DTOs and managed objects to domain values inside the repository. This prevents a schema change from rippling through the app.

## Test doubles

```swift
final class InMemoryUserRepository: UserRepository {
    var user: User = .fixture
    func current() async throws -> User { user }
    func update(_ user: User) async throws { self.user = user }
    func observe(id: User.ID) -> AsyncStream<User> { AsyncStream { $0.yield(user) } }
}
```

## Real-world use cases

- Offline-first apps that read cache-first and refresh in the background.
- Swapping Core Data for SwiftData without touching view models.
- A single place to add retries, logging and analytics.

## Common pitfalls

- A repository per entity with no shared concerns, producing boilerplate.
- Leaking `NSManagedObject` or DTO types out of the repository.
- Putting business rules in the repository instead of the domain.
- Making the repository an actor and blocking all reads for a write.

## Best practices

- Define the protocol from the caller's needs.
- Map to domain types at the boundary.
- Keep caching and retry policies in the repository.
- Test the domain with an in-memory implementation.

## Interview questions

1. What does the repository pattern isolate?
2. Where should caching live?
3. How do repositories help testing?

**Follow-up:** How do repositories relate to the Unit of Work pattern? They can share a transaction/unit-of-work context for atomic multi-entity changes.
