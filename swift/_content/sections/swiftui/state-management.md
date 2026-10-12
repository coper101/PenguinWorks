---
title: State Management
difficulty: Intermediate
tags: swiftui, state, ownership, source-of-truth
summary: Who owns each piece of state, and how to avoid the classic double-source-of-truth bugs.
prerequisites: swiftui/view-lifecycle-identity, language/property-wrappers
related: swiftui/state-binding-observable-environment, swiftui/view-performance-invalidation, architecture/mvc-mvvm-mvp-viper-clean
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 11
---

## Overview

The hardest SwiftUI skill is knowing who **owns** each piece of state. The rule: state is owned at the lowest common ancestor of every view that needs it, and passed down as a read-only value or a two-way `Binding`. Owning state in a child and expecting the parent to see it is the source of most "my UI is out of sync" bugs.

## The ownership table

| Wrapper | Owns state? | Use for |
| --- | --- | --- |
| `@State` | Yes | Private value state local to one view |
| `@Binding` | No | Two-way connection to state owned elsewhere |
| `@Observable` + `@State`/`@Bindable` | Yes / reference | Shared observable model |
| `@Environment` | No | Values injected down the tree |
| `@StateObject` | Yes | Legacy reference-type observable (pre-`@Observable`) |
| `@ObservedObject` | No | Legacy reference passed in |

## `@State` owns value state

~~~swift
struct SearchField: View {
    @State private var query = ""

    var body: some View {
        TextField("Search", text: $query)
    }
}
~~~

`@State` is for state the view itself owns. It survives `body` recomputation as long as identity is stable.

## Passing ownership down with `@Binding`

~~~swift
struct SearchField: View {
    @Binding var query: String
    var body: some View { TextField("Search", text: $query) }
}

struct Screen: View {
    @State private var query = ""
    var body: some View { SearchField(query: $query) }
}
~~~

The parent owns; the child edits through the binding. This is composition, not duplication.

## Reference models with `@Observable`

Since iOS 17, `@Observable` marks a class whose stored properties are tracked. The owner holds it with `@State`; consumers get a `@Bindable` binding or read it directly.

~~~swift
@Observable
final class CartModel {
    var items: [Item] = []
    var total: Decimal { items.reduce(0) { $0 + $1.price } }
}

struct CartView: View {
    @State private var cart = CartModel()
    var body: some View { Text("\(cart.items.count) items") }
}
~~~

Only views that read a changed property are invalidated, which is more granular than `ObservableObject`.

## Real-world use cases

- Own screen state in the screen view; pass bindings into reusable inputs.
- Own the app model in one place and inject it via `@Environment`.
- Derive display values with computed properties instead of storing duplicates.

## Common pitfalls

- Storing a derived value in `@State` and forgetting to update it.
- Creating the model inside `body`, which recreates it every pass.
- Marking an injected model `@State` so each screen gets its own copy.
- Mixing `@ObservedObject` and `@Observable` incorrectly.

## Best practices

- One source of truth per piece of state.
- Derive, do not duplicate.
- Prefer `@Observable` for reference models on iOS 17+.
- Keep ephemeral UI state local, shared domain state high.

## Interview questions

1. What is the difference between `@State` and `@Binding`?
2. Why did Apple introduce `@Observable` alongside `ObservableObject`?
3. Where should a cart model that three screens read live?

**Follow-up:** What happens if you create an `@Observable` model inside `body`? A new instance is created on every recomputation, losing state.
