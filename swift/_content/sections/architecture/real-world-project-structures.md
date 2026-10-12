---
title: Real-World Project Structures
difficulty: Intermediate
tags: architecture, project-structure, examples
summary: Concrete folder and module layouts for small, medium and large iOS apps, and how they evolve.
prerequisites: architecture/feature-based-organization, architecture/modular-architecture
related: architecture/modular-architecture, architecture/feature-based-organization, architecture/architecture-tradeoffs
version: General
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Architecture patterns describe boundaries; project structure is where those boundaries live on disk. Below are three layouts that scale, from a solo app to a multi-team product.

## Small app (one developer)

```
MyApp/
  App/
    MyApp.swift
    RootView.swift
  Features/
    Home/
      HomeView.swift
      HomeModel.swift
    Settings/
      SettingsView.swift
  Models/
    Item.swift
  Services/
    APIClient.swift
```

One app target, feature folders, simple services. Add structure when it hurts, not before.

## Medium app (small team)

```
MyApp/
  App/                 # composition root, routing
  Features/
    Feed/
      Views/
      Models/
      FeedRepository.swift
      FeedTests/
    Profile/
    Checkout/
  Core/
    Domain/            # entities, use cases
    Persistence/       # SwiftData or Core Data
    Networking/
  DesignSystem/        # shared UI components, tokens
  Utilities/
```

Features own their view, models and tests. Core holds shared domain and infrastructure. Dependencies point inward.

## Large app (multiple teams)

```
Packages/
  CoreDomain/          # entities, rules, no frameworks
  Networking/
  Persistence/
  DesignSystem/
  FeatureFeed/
  FeatureProfile/
  FeatureCheckout/
App/                   # app target wires packages
```

Each package is a SwiftPM module with a deliberate public API. The app target depends on features; features depend on core/infra, never on each other. CI enforces the dependency graph.

## How structure evolves

1. Start flat with feature folders.
2. Extract Core when duplication appears.
3. Extract modules when build times or boundaries require it.
4. Add a composition root when wiring grows.
5. Enforce with tooling as teams grow.

## Real-world use cases

- A solo prototype that later becomes a funded product.
- A 20-developer app split by feature ownership.
- A shared design system consumed by multiple apps.

## Common pitfalls

- Starting at the large layout for a small app.
- A `Helpers`/`Utils` folder with no cohesion.
- Packages that all depend on one "Common" package, recreating a monolith.
- Folder layout that does not match the module graph.

## Best practices

- Match the structure to the current team size and pain.
- Keep dependency direction one-directional.
- Make folders that could become modules.
- Let ADRs explain the structure's rationale.

## Interview questions

1. How would you structure a new app expected to grow?
2. When do you split a feature into its own module?
3. How do you keep dependency direction clean across packages?

**Follow-up:** What is a composition root? The single place in the app where concrete dependencies are constructed and wired together.
