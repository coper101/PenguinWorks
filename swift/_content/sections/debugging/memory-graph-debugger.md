---
title: Memory Graph Debugger
difficulty: Advanced
tags: debugging, memory-graph, retain-cycles
summary: Visualise the object graph, spot retain cycles and inspect what keeps an object alive.
prerequisites: performance/memory-leaks-retain-cycles
related: performance/memory-leaks-retain-cycles, performance/allocations, debugging/xcode-debugging-techniques
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

The Memory Graph Debugger (the three-circle icon in Xcode's debug bar) pauses the app and captures the live object graph. You can inspect any object's referrers and find what keeps it alive — the fastest way to diagnose a retain cycle.

## Workflow

1. Run the app and exercise a flow that should release objects.
2. Pause and click the Memory Graph icon.
3. In the Navigator, browse heap objects by class; leaked objects of a screen you closed stand out.
4. Select an object and expand **Show only referenced / Show references**.
5. Purple/asterisk markers and the linked chain reveal the cycle.

## Reading the graph

- **Referrers** are objects holding a strong reference to the selected one.
- Follow the chain until you find the cycle (A → B → A).
- Back-references should typically be `weak`; a strong back-reference is the smoking gun.
- Closures show as context objects holding captured variables.

## Common cycles it reveals

- A view controller retaining a closure that captures `self`.
- A delegate stored strongly.
- Parent/child model objects referencing each other strongly.
- A timer retained by its target.

## Example

```swift
final class ScreenModel {
    var onComplete: (() -> Void)?

    func configure() {
        onComplete = { self.finish() }   // strong cycle: model -> closure -> model
    }

    func finish() {}
}
```

The graph shows `ScreenModel` → closure context → `ScreenModel`. Fix with `[weak self]`.

## Real-world use cases

- A screen that never deallocates after being dismissed.
- Memory growing across repeated navigation.
- Finding why a large object stays resident.

## Common pitfalls

- Capturing the graph before the object should have been released.
- Confusing cached objects with leaked objects.
- Forgetting that `unowned` references are shown differently from strong ones.

## Best practices

- Capture the graph after triggering the flow that should release.
- Look for strong back-references first.
- Confirm a fix by re-capturing the graph.
- Pair with `deinit` logging while developing.

## Interview questions

1. How does the memory graph differ from the Leaks instrument?
2. How do you find what keeps an object alive?
3. What does a closure context node represent?

**Follow-up:** Why does the Leaks instrument miss some growth? Reachable cycles are not flagged as leaks but still consume memory.
