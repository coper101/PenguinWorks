---
title: Concurrency
summary: Swift concurrency from async/await to Swift 6 strict checking — tasks, actors, isolation, Sendable and the mental model that keeps code correct under load.
difficulty: Intermediate → Advanced
tags: concurrency, async, actors
---

Swift concurrency replaces callback pyramids with structured, cancellable, compile-time-checked asynchronous code. The model rests on three ideas: **tasks** carry work, **actors** protect mutable state, and **isolation** determines which code may touch what.

This section is ordered so the model builds on itself. **async/await** and **Task and TaskGroup** come first; then **Actors and Isolation**, **MainActor** and **Sendable**, which are the vocabulary of every concurrency interview. Swift 6 strict checking ties it together: the compiler now proves data-race freedom for `Sendable` types and actor-isolated state.

Treat the availability notes seriously. Behaviour differs between Swift 5 language mode and Swift 6, and between `@preconcurrency` and fully checked code.
