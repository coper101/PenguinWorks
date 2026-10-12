---
title: Generics
difficulty: Intermediate
tags: swift, generics, constraints, specialisation
summary: Write one implementation that works across types, constrain it precisely, and understand how the compiler specialises it.
prerequisites: language/protocols-extensions
related: language/existentials-opaque-types, language/advanced-type-system, architecture/protocol-oriented-programming
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Generics let you write code once that works for many types while preserving type safety. The compiler creates a specialised version for each concrete type, so generic code is not necessarily slower than duplicated code — unlike existentials, generics avoid dynamic dispatch and boxing.

## Generic functions and types

~~~swift
func firstMatch<T: Equatable>(_ items: [T], equals value: T) -> Int? {
    items.firstIndex(of: value)
}

struct Stack<Element> {
    private var storage: [Element] = []
    mutating func push(_ value: Element) { storage.append(value) }
    mutating func pop() -> Element? { storage.popLast() }
}
~~~

## Constraints

Constraints narrow the set of acceptable types and expose members:

~~~swift
func largest<T: Comparable>(_ a: T, _ b: T) -> T { max(a, b) }

protocol Cache {
    associatedtype Key: Hashable
    associatedtype Value
    func value(for key: Key) -> Value?
}
~~~

## `where` clauses

~~~swift
extension Sequence where Element: Identifiable {
    func indexed() -> [Element.ID: Element] {
        Dictionary(uniqueKeysWithValues: map { ($0.id, $0) })
    }
}

func combine<A: Sequence, B: Sequence>(_ a: A, _ b: B) -> Bool
where A.Element == B.Element {
    false
}
~~~

## Primary versus same-type requirements

Same-type constraints (`A.Element == B.Element`) are powerful but can hurt compile times when overused. Prefer protocol requirements that the compiler can resolve quickly.

## Real-world use cases

- Generic networking clients that decode into any `Decodable`.
- Generic containers, algorithms and result types.
- Supporting multiple storage backends behind one generic interface.

## Common pitfalls

- Using `Any` or existentials where a generic would preserve type information.
- Adding constraints the implementation does not actually need.
- Assuming generics are always slower than concrete code.

## Best practices

- Constrain to the smallest protocol that satisfies the need.
- Prefer generic parameters over `Any` and over runtime casts.
- Measure compile times if generic-heavy code starts to slow builds.

## Interview questions

1. How do generics differ from existentials in dispatch and memory layout?
2. What does a `where` clause let you express that a colon constraint cannot?
3. Why can excessive same-type constraints slow compilation?

**Follow-up:** What is a generic `where` clause on a `Sequence` extension used for in practice?
