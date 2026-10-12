---
title: Protocol-Oriented Programming
difficulty: Intermediate
tags: architecture, pop, protocols, composition
summary: Compose behaviour from small protocols and extensions instead of deep inheritance hierarchies.
prerequisites: language/protocols-extensions, language/generics
related: language/protocols-extensions, language/existentials-opaque-types, architecture/solid-principles
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Protocol-oriented programming (POP) treats protocols as the primary unit of abstraction. Instead of subclassing to share behaviour, you compose capabilities from protocols with default implementations, often combined with value types. Apple's standard library is built this way.

## Composition over inheritance

```swift
protocol Renderable { func render() -> String }
protocol Cacheable { var cacheKey: String { get } }
protocol Taggable { var tags: [String] { get } }

struct Article: Renderable, Cacheable, Taggable {
    let id: String
    let title: String
    var cacheKey: String { "article-\(id)" }
    var tags: [String] { ["swift", "ios"] }
    func render() -> String { "# \(title)" }
}
```

A type gains exactly the capabilities it needs, with no hierarchy.

## Default implementations and dispatch

```swift
protocol Describable { var name: String { get } }
extension Describable {
    func describe() -> String { "This is \(name)" }
}
```

**Caution:** a method provided only by a protocol extension is statically dispatched when called on a concrete type but dynamically through an existential. Declare the requirement in the protocol if polymorphic behaviour is required.

```swift
protocol Shape { func area() -> Double }
extension Shape { func describe() -> String { "area \(area())" } }
```

Here `describe` calls `area`, which is a requirement, so it dispatches dynamically and is correct.

## Protocols with associated types

```swift
protocol Storage {
    associatedtype Item
    func load() async throws -> [Item]
    func save(_ items: [Item]) async throws
}

struct HistoryStore: Storage {
    func load() async throws -> [Int] { [] }
    func save(_ items: [Int]) async throws {}
}
```

## Constrained extensions

```swift
extension Collection where Element: Encodable {
    func json() throws -> Data { try JSONEncoder().encode(Array(self)) }
}
```

## Real-world use cases

- Design systems composed from capability protocols.
- Generic algorithms constrained by contracts.
- Replacing base classes with protocols + composition.

## Common pitfalls

- Assuming protocol extension methods override — they do not unless required.
- Using `any P` in hot paths and paying boxing costs (prefer generics).
- Creating a protocol for every type with one implementation.

## Best practices

- Prefer composition; use inheritance only for genuine hierarchies.
- Declare requirements in the protocol when you need dynamic dispatch.
- Prefer generics over existentials for performance.
- Keep protocols role-focused and small.

## Interview questions

1. Why can a protocol extension method behave differently on a concrete type versus an existential?
2. When should a method be a requirement rather than a default?
3. How does POP differ from class inheritance?

**Follow-up:** What is the "protocol extension dispatch" gotcha in one sentence? Methods only in an extension are not overridable through the protocol; they are statically dispatched on concrete types.
