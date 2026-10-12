---
title: Feature-Based Organization
difficulty: Intermediate
tags: architecture, folder-structure, features
summary: Organise files by feature, not by type, so related code lives together and can become a module later.
prerequisites: architecture/modular-architecture
related: architecture/modular-architecture, architecture/real-world-project-structures, architecture/mvc-mvvm-mvp-viper-clean
version: General
lastReviewed: 2026-09-30
readingTime: 8
---

## Overview

There are two common folder strategies: **by type** (`Models/`, `Views/`, `Controllers/`) and **by feature** (`Profile/`, `Checkout/`, `Search/`). Feature organisation keeps everything a feature needs together, which reduces navigation cost and makes extraction into a module straightforward.

## Feature-oriented layout

```
Features/
  Profile/
    ProfileView.swift
    ProfileModel.swift
    ProfileRepository.swift
    ProfileTests.swift
  Checkout/
    CheckoutFlow.swift
    Cart.swift
    Payment/
      PaymentView.swift
      PaymentModel.swift
Shared/
  DesignSystem/
  Extensions/
Core/
  Models/
  Networking/
```

Each feature is self-contained. Its internals are `internal`; the app depends on the feature's entry point.

## Benefits

- Find everything relevant in one place.
- Delete a feature by deleting a folder.
- Extract to a module with little movement.
- Onboarding is faster: read one feature end to end.

## Trade-offs

- Networking/model utilities can be duplicated if not shared deliberately.
- Cross-feature imports must be prevented by convention or tooling.

## Real-world use cases

- Apps with distinct user-facing areas (Feed, Profile, Settings).
- Teams that own features end to end.
- Preparing a monolith for modularisation.

## Common pitfalls

- Mixing "by type" and "by feature" so code is findable in neither.
- Letting features import each other, creating hidden coupling.
- A `Shared` folder that becomes a dumping ground.

## Best practices

- Organise by feature; share only genuinely common code.
- Keep a feature's public entry point minimal.
- Enforce import rules with a lint rule or code review.
- Name folders after user-facing features, not technical layers.

## Interview questions

1. When is feature organisation better than type organisation?
2. How do you keep shared code from becoming a dumping ground?
3. How does feature organisation prepare a codebase for modules?

**Follow-up:** What signal tells you a folder is really a module? Its import surface is one-directional and it compiles independently.
