---
title: Advanced Type System Concepts
difficulty: Advanced
tags: swift, type-system, phantom-types, result-builders, macros
summary: Phantom types, primary associated types, result builders and the type-level tools that make expressive, safe APIs possible.
prerequisites: language/generics, language/existentials-opaque-types, language/property-wrappers
related: language/generics, language/existentials-opaque-types, swiftui/view-lifecycle-identity
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 11
---

## Overview

Beyond the day-to-day, Swift's type system supports techniques that encode invariants in types, build DSLs, and eliminate whole classes of bugs at compile time. This article surveys the ones most likely to appear in senior interviews and real codebases.

## Phantom types

A generic parameter that is not stored can tag a value with extra compile-time state:

~~~swift
struct Measurement<Unit> {
    let value: Double
}

enum Meters {}
enum Seconds {}

let distance = Measurement<Meters>(value: 12)
let time = Measurement<Seconds>(value: 4)

// distance + time will not compile — units differ
func add<U>(_ a: Measurement<U>, _ b: Measurement<U>) -> Measurement<U> {
    Measurement(value: a.value + b.value)
}
~~~

## Primary associated types

`protocol Collection<Element>` lets you write `any Collection<Int>`, making existentials far more usable:

~~~swift
protocol Repository<Entity> {
    associatedtype Entity
    func all() -> [Entity]
}

func count<Entity>(_ repo: some Repository<Entity>) -> Int {
    repo.all().count
}
~~~

## Result builders

Result builders (formerly function builders) power SwiftUI's `ViewBuilder`, Swift's regex literal DSL and many libraries. They transform a closure of statements into a value:

~~~swift
@resultBuilder
struct StringBuilder {
    static func buildBlock(_ parts: String...) -> String {
        parts.joined()
    }
}

func text(@StringBuilder _ build: () -> String) -> String { build() }

let greeting = text {
    "Hello, "
    "world"
}   // "Hello, world"
~~~

## Macros (Swift 5.9+)

Freestanding and attached macros generate code at compile time. `#Preview` is a macro; so is `@Observable`. Macros keep source of truth in one place and avoid runtime reflection.

~~~swift
#Preview {
    ContentView()
}
~~~

## Real-world use cases

- Phantom types for units, validated IDs and state machines.
- Primary associated types for ergonomic generic APIs.
- Result builders for declarative builders.
- Macros for boilerplate like `Equatable`, previews and observation.

## Common pitfalls

- Encoding so much in types that APIs become unreadable.
- Overusing macros when a function would be clearer.
- Assuming phantom types exist at runtime — they are erased.

## Best practices

- Use types to prevent invalid states, but keep error messages legible.
- Reach for result builders when the DSL improves clarity, not novelty.
- Prefer standard macros over hand-rolled code generation.

## Interview questions

1. What is a phantom type and when would you use one?
2. How do primary associated types improve existentials?
3. How does a result builder transform a closure?

**Follow-up:** In what way is `@Observable` a macro rather than a protocol?
