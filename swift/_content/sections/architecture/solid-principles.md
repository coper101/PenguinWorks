---
title: SOLID Principles
difficulty: Intermediate
tags: architecture, solid, design-principles
summary: Apply the five SOLID principles to Swift without turning good ideas into ceremony.
prerequisites: language/protocols-extensions, architecture/dependency-injection
related: architecture/protocol-oriented-programming, architecture/architecture-tradeoffs, language/protocols-extensions
version: General
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SOLID is five design principles for object-oriented code. They are heuristics, not laws: applied thoughtfully they reduce coupling; applied dogmatically they add indirection without benefit.

## S — Single Responsibility

A type should have one reason to change.

```swift
// Two responsibilities: fetch and format
final class UserService {
    func loadUser() async throws -> User { /* … */ }
    func format(_ user: User) -> String { /* … */ }
}
```

Split formatting from fetching so a copy change does not touch networking. "One reason to change" means one actor/stakeholder, not literally one method.

## O — Open/Closed

Open for extension, closed for modification. Add behaviour via new types or protocol conformances rather than editing existing switches.

```swift
protocol Pricing { func price(for item: Item) -> Decimal }
struct StandardPricing: Pricing { /* … */ }
struct DiscountPricing: Pricing { /* … */ }
```

## L — Liskov Substitution

Subtypes must be usable wherever the supertype is expected, without surprising behaviour. A subclass that throws for inherited methods breaks LSP; prefer composition.

## I — Interface Segregation

Many small protocols beat one large one. Clients should not depend on methods they do not use.

```swift
protocol Readable { func read() -> Data }
protocol Writable { func write(_ data: Data) }
```

## D — Dependency Inversion

High-level policy depends on abstractions, not low-level details. Inject protocols; see [Dependency Injection](/swift/architecture/dependency-injection/).

## Real-world use cases

- Replacing a switch with protocol strategies (OCP).
- Splitting a fat protocol into role interfaces (ISP).
- Depending on a protocol above the network layer (DIP).

## Common pitfalls

- One type per method in the name of SRP.
- Protocol explosions for types with one implementation.
- Using inheritance to satisfy OCP, creating fragile hierarchies.

## Best practices

- Treat SOLID as a lens for coupling, not a checklist.
- Prefer composition over inheritance.
- Introduce abstractions when a second implementation or a test double needs one.
- Keep protocols role-focused.

## Interview questions

1. Give a Swift example of the Open/Closed principle.
2. How does Interface Segregation improve testability?
3. What is a common way teams over-apply SOLID?

**Follow-up:** How does Dependency Inversion relate to Swift protocols? Protocols are the abstractions high-level code depends on, with concrete types injected at the boundary.
