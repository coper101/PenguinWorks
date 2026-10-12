---
title: Memory Leaks and Retain Cycles
difficulty: Advanced
tags: performance, memory, retain-cycles, leaks
summary: Detect, locate and break the reference cycles that keep objects alive forever.
prerequisites: language/memory-management-arc, language/closures-capture-lists
related: performance/allocations, debugging/memory-graph-debugger, language/memory-management-arc
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

A leak is memory that is never reclaimed, usually because of a retain cycle: objects that strongly reference each other so their reference counts never reach zero. Leaked objects may stay reachable or become unreachable-but-retained. Both grow your footprint and can cause crashes under memory pressure.

## Symptoms

- Memory grows across repeated navigation and never returns.
- `deinit` never fires for a screen you have closed.
- Memory warnings and eventual termination in the background.

## Diagnostics

1. **Memory Graph Debugger** (Xcode ▸ Debug ▸ Debug Memory Graph, or the icon in the debug bar). Look at an object and read the retain graph; cycles are shown as linked objects.
2. **Leaks instrument** to catch unreachable retained memory.
3. **Allocations** to watch live-object count grow as you repeat a flow.
4. Add a temporary `deinit { print("deinit \(Self.self)") }` to confirm.

## The usual suspects

- Delegates declared `strong` instead of `weak`.
- Stored closures capturing `self` strongly.
- Timers retaining their target.
- `NotificationCenter` observers never removed.
- Combine subscriptions not stored/cancelled.
- Parent/child references where the child holds the parent strongly.

## Breaking cycles

```swift
final class DetailViewController: UIViewController {
    var onClose: (() -> Void)?          // stored closure

    func configure() {
        onClose = { [weak self] in self?.dismiss() }
    }
    deinit { print("deinit \(Self.self)") }
}
```

```swift
protocol DetailDelegate: AnyObject {}
final class DetailView { weak var delegate: DetailDelegate? }
```

Use `Timer.scheduledTimer(withTimeInterval:repeats:block:)` with `[weak self]` and invalidate on exit. For `NotificationCenter`, prefer the block-based API with a stored `NSObjectProtocol` token removed in `deinit`.

## Real-world use cases

- A pushed screen that never deallocates after pop.
- A view model retained by a stored completion.
- A recursive data structure with back-references.

## Common pitfalls

- Assuming ARC breaks cycles automatically — it does not.
- Using `unowned` to silence a cycle and getting a crash instead.
- Only running Leaks once; cycles appear only after repeated navigation.
- Confusing leaked memory with cached memory (which is intentional).

## Best practices

- Draw the ownership graph; break cycles with `weak`.
- Confirm with the Memory Graph Debugger, not guesswork.
- Add `deinit` logging while developing.
- Repeat navigation N times and watch live objects.

## Interview questions

1. What is a retain cycle and give two ways to break it?
2. Where do `NotificationCenter` cycles come from?
3. How does the Memory Graph Debugger help?

**Follow-up:** Why can a cycle be invisible to Leaks but visible in the memory graph? It is still reachable from a live object, so it is not flagged as a leak but still grows memory.
