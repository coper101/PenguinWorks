---
title: NavigationStack and NavigationPath
difficulty: Intermediate
tags: swiftui, navigation, navigationstack, routing
summary: Model navigation as data with NavigationStack and NavigationPath, and type-safe destinations with value-based links.
prerequisites: swiftui/state-management, swiftui/view-lifecycle-identity
related: architecture/coordinator-pattern, swiftui/modern-swiftui-patterns, swiftui/common-swiftui-mistakes
version: iOS 16+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

`NavigationStack` (iOS 16+) replaces the older `NavigationView`. It holds a **path** that represents the stack as data. Because the path is data, navigation becomes testable and programmatic: you can push, pop, and restore state, and deep links become a matter of building a path.

## Value-based navigation

```swift
enum Route: Hashable {
    case detail(Item.ID)
    case settings
    case profile(User)
}

struct RootView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List(items) { item in
                NavigationLink(value: Route.detail(item.id)) {
                    Text(item.title)
                }
            }
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .detail(let id): DetailView(id: id)
                case .settings: SettingsView()
                case .profile(let user): ProfileView(user: user)
                }
            }
        }
    }
}
```

`NavigationLink(value:)` appends to the path; `.navigationDestination(for:)` maps a value type to a destination view.

## `NavigationPath` versus a typed array

- `NavigationPath` is type-erased and can mix destination types. Good for deep links and heterogeneous stacks.
- `[Route]` is fully typed and inspectable. Better for testing and for reading the current route.

```swift
@State private var path: [Route] = []
```

## Programmatic and deep-link navigation

```swift
path.append(Route.settings)
path.removeLast()
path = [.detail(id), .settings]
```

Because the path is state, a URL can be parsed into a `[Route]` and assigned, restoring a deep link exactly.

## Sheets versus pushes

Use `.sheet`, `.fullScreenCover` and `.popover` for modal presentation; they are not part of the navigation stack's path. Dismiss them with `@Environment(\.dismiss)`.

## Real-world use cases

- Deep linking from a push notification into a detail screen.
- Restoring navigation after state restoration.
- Testing a flow by asserting on the path rather than tapping the UI.

## Common pitfalls

- Using `NavigationLink(destination:)` with a value that changes and expecting stable state; prefer `value:`.
- Putting `.navigationDestination` inside a lazy container, where it may not be visible to the stack.
- Managing navigation imperatively with booleans instead of a value path.

## Best practices

- Represent routes as `Hashable` enums.
- Keep a single source of truth for the path in the root view or a router object.
- Prefer value-based links and destination mapping.

## Interview questions

1. What problem does `NavigationStack` solve compared to `NavigationView`?
2. How do you deep link into a nested screen?
3. When would you choose `[Route]` over `NavigationPath`?

**Follow-up:** Where must `.navigationDestination` be declared for a `List` of links? It must be inside the stack and visible to the link, not inside the lazy row content.
