---
title: Coordinator Pattern
difficulty: Intermediate
tags: architecture, coordinator, navigation, routing
summary: Move navigation out of view controllers and views so flows are testable and reusable.
prerequisites: architecture/dependency-injection, swiftui/navigationstack-navigationpath
related: swiftui/navigationstack-navigationpath, architecture/modular-architecture, architecture/repository-pattern
version: General
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

The coordinator pattern extracts navigation into dedicated objects. Views declare intent ("user tapped item"); coordinators decide what screen comes next. This decouples screens from each other and makes a flow — onboarding, checkout — a unit you can start, test and reuse.

## UIKit coordinator

```swift
protocol Coordinator: AnyObject {
    var childCoordinators: [Coordinator] { get set }
    var navigation: UINavigationController { get }
    func start()
}

final class CheckoutCoordinator: Coordinator {
    var childCoordinators: [Coordinator] = []
    let navigation: UINavigationController
    private let cart: Cart

    init(navigation: UINavigationController, cart: Cart) {
        self.navigation = navigation
        self.cart = cart
    }

    func start() {
        let vc = CheckoutViewController(cart: cart)
        vc.onPaymentComplete = { [weak self] in self?.showConfirmation() }
        navigation.pushViewController(vc, animated: true)
    }

    private func showConfirmation() { /* push confirmation */ }
}
```

The view controller knows nothing about the next screen; it calls a closure the coordinator provided.

## SwiftUI coordinator

In SwiftUI, a router object owns the `NavigationPath` and exposes typed navigation methods:

```swift
@Observable
final class Router {
    var path = NavigationPath()
    func showDetail(_ id: Item.ID) { path.append(Route.detail(id)) }
    func popToRoot() { path = NavigationPath() }
}

struct RootView: View {
    @State private var router = Router()
    var body: some View {
        NavigationStack(path: $router.path) { ContentView() }
            .environment(router)
    }
}
```

This keeps navigation state in one place and out of individual views.

## Real-world use cases

- A multi-step onboarding flow reused in several entry points.
- Deep-link handling that builds a path from a URL.
- A/B testing different navigation flows.

## Common pitfalls

- Coordinators that also do business logic.
- Forgetting to remove child coordinators, leaking them.
- Over-abstracting simple one-screen pushes.

## Best practices

- Coordinators own navigation and flow, not domain logic.
- Use closures or delegates for child→parent events.
- In SwiftUI, prefer a `Router` with a typed path.
- Test flows by driving the coordinator.

## Interview questions

1. What problem does the coordinator pattern solve?
2. How do coordinators stay testable?
3. How does a SwiftUI router differ from a UIKit coordinator?

**Follow-up:** How do you keep coordinators from leaking? Remove child coordinators when flows finish and use weak parent references.
