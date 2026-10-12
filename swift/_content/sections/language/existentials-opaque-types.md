---
title: Existentials and Opaque Types
difficulty: Advanced
tags: swift, any, some, existentials, opaque-types
summary: The difference between any P and some P, what a boxed existential costs, and when to choose each.
prerequisites: language/protocols-extensions, language/generics
related: language/generics, architecture/protocol-oriented-programming, language/advanced-type-system
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

`any P` is an **existential**: a box that can hold any concrete type conforming to `P` at runtime, with dynamic dispatch and possible boxing/allocation. `some P` is an **opaque type**: a specific concrete type that the caller cannot name, known to the compiler, with static dispatch and no boxing.

## Existentials

~~~swift
protocol Shape {
    func area() -> Double
}

struct Circle: Shape { var r: Double; func area() -> Double { .pi * r * r } }
struct Square: Shape { var s: Double; func area() -> Double { s * s } }

let shapes: [any Shape] = [Circle(r: 1), Square(s: 2)]
print(shapes.reduce(0) { $0 + $1.area() })
~~~

`any Shape` erases the concrete type. Calls go through a witness table and the value may be stored in a heap box if it is larger than the inline buffer.

## Opaque types

~~~swift
func makeCircle(radius: Double) -> some Shape {
    Circle(r: radius)          // caller sees "some Shape", not Circle
}
~~~

The concrete type is fixed per function and invisible to the caller. This is the basis of SwiftUI's `some View`: the compiler knows the exact view type, so the view tree is statically typed and can be diffed efficiently.

## Where each belongs

- Use `some P` to hide a concrete return type while keeping performance and type-level identity.
- Use `any P` when you genuinely need heterogeneous storage: `[any Shape]`, a heterogeneous plugin list, or an `AnyHashable` dictionary.
- Prefer generics (`func f<T: P>(_ t: T)`) over `any` for parameters to avoid boxing.

## Performance note

Passing an existential into a generic function and back boxes and unboxes. In hot loops this shows up as heap allocation. When you see "protocol type cannot conform to itself" errors, that is the existential self-conformance limitation.

## Real-world use cases

- `some View` for SwiftUI view builders.
- `some Sequence` for lazy pipelines that stay opaque.
- `any Error` for heterogeneous error storage.
- Plugin and strategy collections typed as `[any Strategy]`.

## Common pitfalls

- Using `any` everywhere and paying boxing costs in performance-critical code.
- Expecting `[any P]` to preserve concrete types for `==` or generic constraints.
- Confusing `some P` (one hidden concrete type) with `any P` (many possible types).

## Best practices

- Return `some P` from factory functions when the concrete type need not be named.
- Use `any` only at true abstraction boundaries.
- Measure allocation before concluding an existential is the bottleneck.

## Interview questions

1. What is the difference between `any Shape` and `some Shape`?
2. Why does `some View` help SwiftUI's diffing?
3. When does an existential allocate on the heap?

**Follow-up:** What does the error "protocol P can only be used as a generic constraint" mean? You used `P` where self-conforming existential behaviour was required; write `any P`.
