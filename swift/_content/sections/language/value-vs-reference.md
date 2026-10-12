---
title: Value vs Reference Semantics
difficulty: Beginner
tags: swift, value-semantics, reference-semantics
summary: The mental model behind copying, sharing and mutation that explains why some changes propagate and others do not.
prerequisites: language/structs-vs-classes
related: language/copy-on-write, language/memory-management-arc, language/structs-vs-classes
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 7
---

## Overview

Value semantics mean that a value behaves as if it were copied on assignment: a mutation through one binding is never observable through another. Reference semantics mean two bindings can point to the same instance, so a mutation is visible through both.

The important nuance is that value semantics are about **observable behaviour**, not about whether a physical copy happens. Arrays are value types but Swift avoids copying until you mutate, using copy-on-write.

## Storing values inside references

When a reference type holds two value properties, mutating one binding of the value does not affect the other:

~~~swift
final class Store {
    var config = ["theme": "dark"]
}

let store = Store()
var configCopy = store.config
configCopy["theme"] = "light"

print(store.config["theme"]!)   // dark — no sharing
print(configCopy["theme"]!)     // light
~~~

Contrast with a reference member, where changes are shared:

~~~swift
final class Theme { var name = "dark" }
final class Settings { var theme = Theme() }

let settings = Settings()
let themeRef = settings.theme
themeRef.name = "light"
print(settings.theme.name)      // light — shared instance
~~~

## Functional updates

With value types you express change by producing a new value, often using a `with`-style helper:

~~~swift
struct Preferences: Equatable {
    var fontSize = 14
    var theme = "dark"

    func with(theme: String? = nil, fontSize: Int? = nil) -> Preferences {
        Preferences(
            fontSize: fontSize ?? self.fontSize,
            theme: theme ?? self.theme
        )
    }
}
~~~

## Real-world use cases

- State in a reducer-style architecture is a value, so history is easy to keep.
- Undo/redo stacks store snapshots of value-typed state.
- Diffing views for SwiftUI relies on value equality.

## Common pitfalls

- Mutating a copied struct and expecting the original to change.
- Assuming concurrency safety just because a type is a struct — shared reference members remain unsafe.
- Paying for copies of large structs in hot loops without measuring.

## Best practices

- Prefer value types for state; they make change auditable.
- Keep value types free of shared mutable references.
- Use `Equatable` on value models for diffing and tests.

## Interview questions

1. Does assigning a struct always allocate a copy?
2. How can a struct still share state with another value?
3. Why are value types favoured for UI state in SwiftUI?

**Follow-up:** Explain copy-on-write and how it reconciles value semantics with performance.
