---
title: View Performance and Invalidation
difficulty: Advanced
tags: swiftui, performance, invalidation, body
summary: Why SwiftUI recomputes a view, how observation narrows invalidation, and how to keep body cheap.
prerequisites: swiftui/state-management, swiftui/view-lifecycle-identity
related: performance/swiftui-rendering-performance, performance/view-body-recomputation, swiftui/lists-grids-lazy-containers
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SwiftUI recomputes `body` when a dependency changes. A "dependency" is any observable state the body reads — `@State`, `@Binding`, an `@Observable` property, or an environment value. The goal is to make each view depend on as little as possible and to keep `body` cheap.

## What causes invalidation

- A `@State` value changes.
- An `@Observable`/`ObservableObject` property the body read changes.
- A `@Binding`'s source changes.
- An environment value changes.
- The parent produces a new description and the child has no identity to preserve it.

## Narrowing with `@Observable`

`@Observable` tracks property-level reads. A view that reads only `cart.count` is not invalidated when `cart.discountCode` changes.

```swift
@Observable final class Store {
    var count = 0
    var discountCode = ""
}

struct CountBadge: View {
    @Environment(Store.self) private var store
    var body: some View { Text("\(store.count)") }   // ignores discountCode
}
```

With `ObservableObject`, any `@Published` change invalidates every observing view, which is why `@Observable` is a meaningful performance improvement.

## Partitioning views

Wrap independent subviews in their own `View` types so only the affected subtree recomputes:

```swift
struct Screen: View {
    @State private var query = ""
    var body: some View {
        VStack {
            SearchBar(text: $query)
            ResultsList()      // does not depend on query
        }
    }
}
```

Extracting `ResultsList` prevents it from recomputing when `query` changes (as long as it does not read `query`).

## EquatableView and identity

For a subview whose inputs rarely change but whose parent recomputes often, `Equatable` conformance plus `.equatable()` can skip recomputation. Use sparingly; `@Observable` and view partitioning usually suffice.

## Avoid in body

- Object creation (`ViewModel()`, `DateFormatter()`).
- Sorting/filtering large arrays on every pass.
- `GeometryReader` stacks that cause layout thrash.
- `AnyView` erasure that hides identity and prevents diffing.

## Real-world use cases

- A settings screen where toggling one row should not rebuild the whole list.
- A large form where typing in one field invalidates only that field.
- A list header that should not recompute per row.

## Common pitfalls

- Reading a whole model in a row when only one property is needed.
- Passing closures that capture large state, forcing recomputation.
- Using `@Published` arrays and observing the whole array instead of a projection.

## Best practices

- Make each view depend on the smallest possible state.
- Extract subviews to localise invalidation.
- Prefer `@Observable` on iOS 17+.
- Profile with the SwiftUI instrument to find excessive body invocations.

## Interview questions

1. What invalidates a SwiftUI view?
2. How does `@Observable` reduce unnecessary recomputation?
3. Why does extracting a subview improve performance?

**Follow-up:** Why is `AnyView` costly? It erases type identity, preventing efficient structural diffing.
