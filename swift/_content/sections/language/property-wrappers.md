---
title: Property Wrappers
difficulty: Advanced
tags: swift, property-wrappers, state, attributes
summary: Encapsulate stored-property behaviour in a reusable type, and understand how SwiftUI's state wrappers are built on the same mechanism.
prerequisites: language/generics, language/protocols-extensions
related: language/advanced-type-system, swiftui/state-management, swiftui/state-binding-observable-environment
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

A property wrapper is a generic type marked with `@propertyWrapper` that stores a wrapped value and defines the access behaviour around it. The compiler synthesises a backing store and forwards `get`/`set` to the wrapper. SwiftUI's `@State`, `@Binding`, `@FetchRequest` and friends are property wrappers.

## A minimal wrapper

~~~swift
@propertyWrapper
struct Clamped<Value: Comparable> {
    var wrappedValue: Value {
        didSet { wrappedValue = min(max(wrappedValue, range.lowerBound), range.upperBound) }
    }
    private let range: ClosedRange<Value>

    init(wrappedValue: Value, _ range: ClosedRange<Value>) {
        self.range = range
        self.wrappedValue = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }
}

struct Score {
    @Clamped(0...100) var value = 50
}

var score = Score()
score.value = 150
print(score.value)   // 100
~~~

## Projected values

When a wrapper defines `projectedValue`, `$name` gives access to it. SwiftUI's `@State` projects a `Binding`:

~~~swift
@propertyWrapper
struct UserDefault<Value> {
    let key: String
    let defaultValue: Value
    var storage: UserDefaults = .standard

    var wrappedValue: Value {
        get { storage.object(forKey: key) as? Value ?? defaultValue }
        set { storage.set(newValue, forKey: key) }
    }
}
~~~

## Initialisation rules

- If `wrappedValue` has a default, you can write `@Clamped(0...100) var value = 50`.
- Otherwise the wrapper is initialised from the enclosing type's `init`, often taking the initial value as a parameter.

## Real-world use cases

- `@UserDefault`, `@Clamped`, `@Trimmed`, `@Validated` for model fields.
- SwiftUI state ownership: `@State`, `@Binding`, `@Environment`, `@Observable`.
- Dependency injection: `@Injected var service: Service` resolved from a container.

## Common pitfalls

- Mutating the wrapper's stored `self` from within a `Value`-typed wrapper's getter (getters are `nonmutating` by default via `wrappedValue`).
- Assuming `$value` always exists — it requires `projectedValue`.
- Overusing wrappers for behaviour that belongs in a computed property.

## Best practices

- Keep wrappers small and single-purpose.
- Document the projected value type.
- Use `@propertyWrapper` for cross-cutting storage concerns, not for general logic.

## Interview questions

1. How does `@State` relate to property wrappers?
2. What is `projectedValue` and when is it synthesised?
3. Why can a property wrapper's `wrappedValue` getter not be `mutating` in some cases?

**Follow-up:** How do you initialise a property wrapper from the enclosing type's initialiser when it has no default?
