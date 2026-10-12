---
title: Common Concurrency Interview Questions
difficulty: Advanced
tags: concurrency, interviews, questions
summary: The concurrency questions that come up most often in Apple-platform interviews, with strong answers and follow-ups.
prerequisites: concurrency/async-await, concurrency/actors-isolation, concurrency/sendable
related: interviews/senior-swift-questions, concurrency/swift6-concurrency, concurrency/data-races
version: Swift 5.9+/Swift 6
lastReviewed: 2026-09-30
readingTime: 11
---

## How to use this article

Read the question, answer out loud, then check the model answer. Interviewers care less about definitions and more about whether you can reason about correctness and choose the right tool.

## Q1. What happens at an `await`?

**Model answer:** The current task may suspend. The runtime saves the task's state and frees the thread/executor to run other work. When the awaited operation completes, the task resumes on an executor appropriate to its isolation. `await` is a potential suspension, not a guaranteed one; if the value is already available the task may continue without suspending.

**Follow-up:** Does `await` create a thread? No. It may switch executors, but it does not spawn threads.

## Q2. What is the difference between `Task { }` and `async let`?

**Model answer:** `async let` starts a structured child task bound to the current scope: it is awaited before the scope exits and inherits cancellation. `Task { }` creates an unstructured task with its own lifetime; you must store and cancel it yourself.

## Q3. Why is an actor method called with `await` from outside?

**Model answer:** The actor serialises access to its state. If the actor is busy, the caller must wait for its turn. Inside the actor, calls are synchronous because isolation is already exclusive.

## Q4. What is actor reentrancy and why is it dangerous?

**Model answer:** When an actor method suspends at an `await`, other tasks can run on the actor. State captured before the suspension may be stale when the method resumes. The fix is to re-read state after every `await` when correctness depends on it, or avoid holding invariants across suspension points.

## Q5. Which types are `Sendable`?

**Model answer:** Value types whose stored properties are all `Sendable`; immutable (`let`-only) reference types with `Sendable` properties; actors; and `@Sendable` closures capturing only `Sendable` values. Mutable reference types are not `Sendable` unless actor-isolated or explicitly marked `@unchecked Sendable` with synchronisation.

## Q6. How does structured concurrency improve on callback pyramids?

**Model answer:** Child tasks cannot outlive their parent, so cancellation and errors propagate automatically. The task tree is visible in the source, resource cleanup is scoped, and there is no "orphan callback" problem.

## Q7. Why is cancellation cooperative?

**Model answer:** Forcibly stopping a task at an arbitrary point could corrupt state or leak resources. Instead, cancellation sets a flag and long-running code checks it at safe points, allowing orderly cleanup.

## Q8. `@MainActor`: what and why?

**Model answer:** A global actor backed by the main thread. It ensures UI and UI-bound state are only accessed on the main thread, and lets the compiler prove that guarantee. Heavy work should be `nonisolated` and results applied back on the main actor.

## Q9. How do you bridge a delegate callback API to async?

**Model answer:** Use `withCheckedContinuation` for one-shot results (resume exactly once) or `AsyncStream` for repeated values, with `onTermination` for cleanup. Add `withTaskCancellationHandler` if the underlying API can be cancelled.

## Q10. What does Swift 6 change?

**Model answer:** It turns data-race checking into compile errors. Non-`Sendable` values crossing isolation boundaries, unsafe global mutable state and missing isolation all fail the build. Migration is incremental via strict-concurrency levels, `@MainActor`, actors and temporary `@preconcurrency`.

## Q11. How would you find a data race in production?

**Model answer:** Enable Thread Sanitizer in a debug/CI build and reproduce under load. Independent of tooling, add Swift 6 strict checking to catch races at build time and prefer actors/immutable state over shared mutables.

## Q12. When would you use `Task.detached`?

**Model answer:** Rarely. It deliberately opts out of inheriting actor isolation, priority and task-local values. Use it only when you truly need an independent task with no inherited context.

## Practical tip

For every concurrency question, state the **isolation**, the **ownership of state**, and the **cancellation behaviour**. Those three cover most of what interviewers probe.
