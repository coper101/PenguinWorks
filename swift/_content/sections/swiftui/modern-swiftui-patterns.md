---
title: Modern SwiftUI Patterns
difficulty: Advanced
tags: swiftui, patterns, observation, previews
summary: The patterns that define modern SwiftUI: @Observable models, value-based navigation, environment injection, previews and testability.
prerequisites: swiftui/state-management, swiftui/navigationstack-navigationpath
related: architecture/mvc-mvvm-mvp-viper-clean, swiftui/state-binding-observable-environment, swiftui/custom-layouts-modifiers
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SwiftUI has matured. The patterns below reflect iOS 17+ idioms and avoid legacy habits that fight the framework.

## Model state as `@Observable`

Use `@Observable` classes for shared domain models and `@State` for local value state. This gives fine-grained invalidation and removes the `@Published`/`objectWillChange` ceremony.

```swift
@Observable
final class FeedModel {
    private(set) var items: [Item] = []
    var isLoading = false
    func load() async { /* … */ }
}

struct FeedView: View {
    @State private var model = FeedModel()
    var body: some View {
        List(model.items) { ItemRow(item: $0) }
            .task { await model.load() }
    }
}
```

## Value-based navigation

Represent routes as `Hashable` values and drive a `NavigationStack(path:)`. This makes deep links and tests trivial.

## Dependency injection with the environment

Inject protocols rather than concrete types for testability:

```swift
protocol Clock { var now: Date { get } }
struct LiveClock: Clock { var now: Date { .now } }

extension EnvironmentValues {
    @Entry var clock: Clock = LiveClock()
}
```

Inject an override in previews and tests with `.environment(\.clock, TestClock())`.

## Previews as tests

`#Preview` (macro) supports multiple variants and traits, including screen sizes, locales and dark mode:

```swift
#Preview("Dark") {
    FeedView().preferredColorScheme(.dark)
}
```

Previews catch layout and state bugs faster than running the app.

## Unidirectional data flow

Prefer one-way flow: user intent → action → state change → view update. Pass callbacks up, state down. This keeps screens predictable and testable.

## Composition over inheritance

Small `View` types composed together outperform one giant view and localise invalidation and previews.

## Real-world use cases

- Feature modules exposing a screen plus its `@Observable` model.
- Environment-injected services for networking and analytics.
- Preview-driven development for design systems.

## Common pitfalls

- Fighting the framework with imperative `NavigationView`-era patterns.
- Over-modeling with a ViewModel per trivial view; use value state where it suffices.
- Global singletons instead of environment injection.

## Best practices

- `@Observable` + `@State` for models; value state for local UI.
- Protocol-based injection through the environment.
- Value navigation and preview-first development.
- Keep view types small and composable.

## Interview questions

1. What does modern SwiftUI state ownership look like on iOS 17+?
2. How do you inject a test double without singletons?
3. Why prefer value-based navigation?

**Follow-up:** Where would a network client live so both a screen and its previews can swap it? In an environment-injected protocol.
