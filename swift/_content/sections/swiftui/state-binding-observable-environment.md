---
title: "@State, @Binding, @Observable and @Environment"
difficulty: Intermediate
tags: swiftui, observable, environment, binding
summary: A practical comparison of SwiftUI's state wrappers, when each is correct, and how @Observable changes the picture.
prerequisites: swiftui/state-management, language/property-wrappers
related: swiftui/state-management, swiftui/view-performance-invalidation, swiftui/modern-swiftui-patterns
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SwiftUI offers several ways to connect state to views. They differ along two axes: **who owns the value** and **whether the connection is read-only or two-way**. Getting this mapping right removes most state bugs.

## `@State`

Owns value state local to the view. Reset when identity changes.

~~~swift
@State private var isExpanded = false
~~~

## `@Binding`

A two-way reference to state someone else owns. Use it for reusable controls.

~~~swift
struct ToggleRow: View {
    @Binding var isOn: Bool
    var body: some View { Toggle("Enabled", isOn: $isOn) }
}
~~~

## `@Bindable` with `@Observable`

`@Observable` classes are observed automatically; `@Bindable` produces bindings into their properties without `@ObservedObject`.

~~~swift
@Observable final class FormModel { var name = "" }

struct FormView: View {
    @Bindable var model: FormModel
    var body: some View { TextField("Name", text: $model.name) }
}
~~~

## `@Environment`

Injects values down the tree without threading them through every initialiser. System values (`\.colorScheme`, `\.dismiss`, `\.openURL`) and custom keys both work.

~~~swift
struct ThemedCard: View {
    @Environment(\.colorScheme) private var scheme
    var body: some View { Color(scheme == .dark ? .black : .white) }
}

struct Screen: View {
    @Environment(\.dismiss) private var dismiss
    var body: some View { Button("Close") { dismiss() } }
}
~~~

For `@Observable` models you inject with `.environment(model)` and read with `@Environment(Model.self)`.

## Two-way versus one-way

- Use `@Binding`/`@Bindable` only where the child must write.
- Prefer passing read-only values plus a callback (`onSelect: (Item) -> Void`) when the child only reports events. This keeps data flow one-directional and easier to test.

## Real-world use cases

- A reusable `RatingView` that binds a `Double`.
- A theme or locale injected via `@Environment`.
- A dismiss action via `@Environment(\.dismiss)`.
- A shared session model injected at the root and read everywhere.

## Common pitfalls

- Using `@ObservedObject` on an object that should be owned with `@StateObject`/`@State`, causing recreation and lost state.
- Capturing a `@Binding` in a stored closure and expecting it to stay valid.
- Rebuilding the environment value every `body` pass, invalidating the subtree.

## Best practices

- Own at the top, bind downward, report upward with callbacks.
- Use `@Environment` for genuinely ambient values, not as a global switchboard.
- Prefer `@Observable` + `@Bindable` on iOS 17+.

## Interview questions

1. When would you use a callback instead of a `@Binding`?
2. How does `@Environment` avoid prop drilling?
3. What is `@Bindable` for and why is it needed?

**Follow-up:** How do you make a custom `@Observable` model available app-wide? Inject it with `.environment(_:)` at the root and read it with `@Environment(Model.self)`.
