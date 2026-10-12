---
title: Modular Architecture
difficulty: Advanced
tags: architecture, modularisation, swiftpm, boundaries
summary: Split an app into modules with explicit boundaries to speed builds, enforce layering and enable parallel work.
prerequisites: architecture/feature-based-organization, architecture/dependency-injection
related: architecture/feature-based-organization, architecture/real-world-project-structures, language/access-control
version: SwiftPM / Xcode
lastReviewed: 2026-09-30
readingTime: 11
---

## Overview

Modularisation divides a codebase into independently buildable units. In Swift, that usually means Swift Package Manager targets or Xcode frameworks. The benefits are real only when modules have clear boundaries and point in one direction.

## A layered module graph

```
App  ───────────────► FeatureA ─┐
 │                     FeatureB ─┼──► Core (models, extensions)
 ├──────────────────► UI ────────┘
 └──────────────────► Networking ──► Core
```

- **App** — composition root, wires features.
- **Feature modules** — one per feature, depend on Core/UI/Networking, not on each other.
- **Core** — pure domain and utilities, depends on nothing app-specific.
- **Networking / Persistence** — infrastructure, behind protocols.

Dependencies point inward; features never import each other directly.

## Why modules help

- **Build time** — incremental builds recompile only changed modules.
- **Boundaries** — `internal` access becomes a real wall.
- **Parallel work** — teams own modules.
- **Testability** — modules can be tested in isolation.

## Why modules hurt

- More ceremony: public API, manifest files.
- Over-fragmentation slows navigation and builds if too fine-grained.
- Cross-module refactors need version discipline.

## Practical SwiftPM

```swift
// Package.swift (excerpt)
.targets: [
    .target(name: "Core"),
    .target(name: "Networking", dependencies: ["Core"]),
    .target(name: "FeatureProfile", dependencies: ["Core", "Networking"]),
    .testTarget(name: "FeatureProfileTests", dependencies: ["FeatureProfile"])
]
```

## Public API discipline

Every module needs a deliberate public surface. Use `public` and `package` access to share within a package and keep internals private.

## Real-world use cases

- A large app split by feature to unblock builds and teams.
- A shared design-system module used by many features.
- Extracting a domain core that outlives the UI framework.

## Common pitfalls

- Circular dependencies between features.
- A giant "Common" module that becomes a new monolith.
- Making everything `public`, defeating the boundary.
- Modularising prematurely before the app's seams are known.

## Best practices

- Extract modules along real seams once they emerge.
- Keep dependency direction one-way.
- Prefer `package` access within a package.
- Automate architecture checks (for example with `swift-format` or custom lint).

## Interview questions

1. What are the build and boundary benefits of modularisation?
2. How do you prevent circular feature dependencies?
3. When is modularising a mistake?

**Follow-up:** What tool can visualise module dependencies? Tools like `swift-dependencies` graphs or Xcode's target dependency graph, plus the ViewGraph approach of drawing structure.
