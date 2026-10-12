---
title: Protocols and Extensions
difficulty: Intermediate
tags: swift, protocols, extensions, POP
summary: Define behaviour contracts, add implementations with extensions, and compose capabilities without inheritance.
prerequisites: language/structs-vs-classes, language/enums-associated-values
related: language/generics, language/existentials-opaque-types, architecture/protocol-oriented-programming
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

A protocol declares requirements — properties, methods, initialisers, associated types — that conforming types promise to provide. Extensions add methods, computed properties and protocol conformances to existing types without subclassing. Together they form Swift's protocol-oriented programming model.

## Declaring and conforming

~~~swift
protocol Identifiable {
    associatedtype ID: Hashable
    var id: ID { get }
}

protocol Persistable {
    func save() throws
    func load(id: String) throws -> Data?
}

struct User: Identifiable, Persistable {
    let id: UUID
    var name: String

    func save() throws { /* … */ }
    func load(id: String) throws -> Data? { nil }
}
~~~

## Extensions

~~~swift
extension Int {
    var squared: Int { self * self }
}

extension Array where Element: Numeric {
    var total: Element { reduce(.zero, +) }
}

extension Collection {
    var isNotEmpty: Bool { !isEmpty }
}
~~~

Constrained extensions (`where` clauses) attach functionality only when the generic conditions hold.

## Protocol extensions and dispatch

~~~swift
protocol Greeter {
    var name: String { get }
}
extension Greeter {
    func greet() -> String { "Hello, \(name)" }
}

struct Person: Greeter { let name: String }
print(Person(name: "Ada").greet())   // Hello, Ada
~~~

A subtlety: methods defined **only** in a protocol extension dispatch statically when called on a value typed as the concrete type, but dynamically through an existential. Declare the method in the protocol if you need dynamic dispatch.

## Real-world use cases

- Define capabilities (`Codable`, `Hashable`, `Comparable`) and compose them.
- Write generic algorithms constrained by protocol requirements.
- Add convenience to standard library types rather than free functions.

## Common pitfalls

- Overusing protocols where a concrete type or generic constraint suffices.
- Forgetting that protocol extension defaults are not overridable unless declared in the protocol.
- Retroactive conformances on types from another module that cause ambiguous behaviour.

## Best practices

- Design small, composable protocols rather than one large one.
- Use `associatedtype` for flexibility and prefer generics to existentials when performance matters.
- Keep extension methods cohesive with the type they extend.

## Interview questions

1. What is the difference between a protocol requirement and a protocol extension default?
2. When does protocol extension dispatch resolve statically?
3. Why can retroactive conformances be dangerous?

**Follow-up:** How does `some P` (opaque type) differ from `any P` (existential)? See [Existentials and Opaque Types](/swift/language/existentials-opaque-types/).
