---
title: MVC, MVVM, MVP, VIPER and Clean Architecture
difficulty: Intermediate
tags: architecture, mvvm, viper, clean-architecture
summary: Compare the mainstream iOS architecture patterns by what they isolate, what they cost, and when each is justified.
prerequisites: swiftui/state-management, language/protocols-extensions
related: architecture/architecture-tradeoffs, architecture/testable-design, architecture/dependency-injection
version: General
lastReviewed: 2026-09-30
readingTime: 12
---

## Overview

Every pattern separates **view**, **state/logic** and **data access** to different degrees. The right choice depends on team size, app lifespan and testability needs — not on which diagram looks cleanest.

## MVC

Model–View–Controller. Apple's original guidance: models hold data, views render, controllers coordinate. In practice, `UIViewController` absorbs too much, producing the "Massive View Controller" problem.

- **Optimises for:** speed of initial development, framework convention.
- **Costs:** fat controllers, weak testability, tangled lifecycle.

## MVVM

Model–View–ViewModel. The view model exposes observable state and transforms models for the view. With SwiftUI and `@Observable`, MVVM fits naturally: the view binds to the model, the model has no view types.

```swift
@Observable
final class ProfileViewModel {
    private let repository: UserRepository
    private(set) var state: State = .idle

    enum State { case idle, loading, loaded(User), failed(String) }

    init(repository: UserRepository) { self.repository = repository }

    func load() async {
        state = .loading
        do { state = .loaded(try await repository.current()) }
        catch { state = .failed(error.localizedDescription) }
    }
}
```

- **Optimises for:** testable presentation logic, clear view/state split.
- **Costs:** view models can become god objects; tiny views may not need one.

## MVP

Model–View–Presenter. The presenter holds logic and talks to the view through a protocol, which makes it highly testable without a UI framework.

- **Optimises for:** testability without observation frameworks (classic UIKit).
- **Costs:** boilerplate protocols and passive views.

## VIPER

View–Interactor–Presenter–Entity–Router. Splits responsibility aggressively; each screen becomes a module.

- **Optimises for:** large teams, strict boundaries, parallel work.
- **Costs:** significant boilerplate; overkill for small apps.

## Clean Architecture

Concentric layers (Entities → Use Cases → Interface Adapters → Frameworks) with dependencies pointing inward. Business rules do not know about UI or storage.

- **Optimises for:** long-lived domains, replaceable frameworks, framework independence.
- **Costs:** mapping layers, indirection; can feel heavy for CRUD screens.

## Choosing

| Context | Reasonable default |
| --- | --- |
| Small app, one developer | MVVM (or plain MV) |
| Growing app, small team | MVVM + repositories + DI |
| Large app, many teams | Modular MVVM/Clean, feature modules |
| Strict testability, UIKit | MVP or MVVM |
| Complex, long-lived domain | Clean Architecture |

## Real-world use cases

Most successful production apps use a pragmatic blend: MVVM for presentation, repositories for data, coordinators for navigation, and Clean-style boundaries only where the domain is genuinely complex.

## Common pitfalls

- Adopting VIPER or Clean wholesale for a small app.
- Treating architecture as a label rather than a set of boundaries.
- Letting the view model import UIKit/SwiftUI.
- No dependency injection, so the pattern is untestable anyway.

## Best practices

- Choose the lightest pattern the app needs now.
- Keep the domain free of UI and persistence frameworks.
- Make boundaries explicit with protocols.
- Let tests drive whether the abstraction earns its keep.

## Interview questions

1. Compare MVVM and MVP and their testability trade-offs.
2. When is Clean Architecture worth its overhead?
3. What problem does a god view model cause and how do you prevent it?

**Follow-up:** How does `@Observable` change the case for MVVM in SwiftUI? It removes the ceremony of `ObservableObject` and makes view models lighter and more natural.
