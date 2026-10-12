---
title: View Lifecycle and Identity
difficulty: Intermediate
tags: swiftui, identity, lifecycle, diffing
summary: A View is a value that describes UI, and identity is how SwiftUI decides whether to update or replace it.
prerequisites: language/structs-vs-classes, language/value-vs-reference
related: swiftui/state-management, swiftui/view-performance-invalidation, swiftui/common-swiftui-mistakes
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

A type conforming to `View` is a **value** with a `body` that returns another view. SwiftUI calls `body` whenever it needs a fresh description, then diffs the new description against the old one. A view struct is created and thrown away constantly; the long-lived things are the state and the underlying render nodes, and those are tied to **identity**.

There are two kinds of identity:

- **Structural identity** — the view's position in the tree. `if`/`switch` and `VStack` children get identity from where they appear.
- **Explicit identity** — `ForEach`'s `id`, `.id(_:)`, and `List` row identity.

## Why identity matters

If identity is stable, SwiftUI updates the existing view in place and preserves its state and animation. If identity changes, SwiftUI treats it as a different view: it destroys the old one and creates a new one, discarding `@State` and restarting transitions.

~~~swift
struct Counter: View {
    @State private var count = 0

    var body: some View {
        VStack {
            if count.isMultiple(of: 2) {
                Text("Even: \(count)")
            } else {
                Text("Odd: \(count)")
            }
            Button("Increment") { count += 1 }
        }
    }
}
~~~

The two `Text` views have different structural identities inside the `if`, so switching between them destroys and recreates the `Text`. The `@State` lives on `Counter`, which has stable identity, so `count` survives.

## Stable identity with ForEach

~~~swift
struct Item: Identifiable { let id: UUID; var title: String }

ForEach(items) { item in
    Row(item: item)
}
~~~

`Identifiable` gives each row a stable id. If you use `ForEach(items.indices)`, inserting into the middle changes identities for all later rows and can scramble state and animations. Prefer stable ids over indices whenever the collection can mutate.

## `onAppear` is not `init`

`onAppear`/`onDisappear` fire when the view enters/leaves the hierarchy. They are not guaranteed to fire exactly once per struct instance, and they can fire multiple times. Use `.task` for async work tied to identity:

~~~swift
.task {
    await viewModel.load()
}
~~~

The task is cancelled automatically when the view's identity disappears.

## Real-world use cases

- Preserve a text field's focus and content by keeping identity stable across parent updates.
- Drive `List` row animation by supplying stable `Identifiable` ids.
- Reset subview state deliberately with `.id(someToken)` by changing identity on purpose.

## Common pitfalls

- Using array indices as ids in a mutable list.
- Assuming `init` runs once — it runs whenever the parent produces a new description.
- Putting side effects in `body` or `init` instead of `.task`/`.onChange`.

## Best practices

- Model state with `Identifiable` types and stable ids.
- Use `.id()` intentionally, knowing it resets state.
- Keep `body` pure and cheap; do work in `.task` or `.task(id:)`.

## Interview questions

1. What is the difference between structural and explicit identity?
2. Why does a view's `@State` reset when an `if` branch changes?
3. What happens if you use indices as `ForEach` ids and insert an item?

**Follow-up:** What does `.id()` do to `@State` inside the identified view? It resets it, because identity changed.
