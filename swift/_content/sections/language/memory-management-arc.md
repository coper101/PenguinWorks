---
title: Memory Management and ARC
difficulty: Advanced
tags: swift, arc, memory, retain-cycles
summary: How automatic reference counting keeps objects alive, where it forms cycles, and how to reason about lifetimes.
prerequisites: language/structs-vs-classes, language/closures-capture-lists
related: language/copy-on-write, performance/memory-leaks-retain-cycles, concurrency/sendable
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Swift uses Automatic Reference Counting (ARC). Each class instance has a reference count; when it drops to zero the instance is deallocated. ARC is deterministic — deallocation happens as soon as the last strong reference goes away, unlike a tracing garbage collector. Value types are not reference counted individually; when a value type contains references, those references are counted.

## Strong references

~~~swift
final class Person {
    let name: String
    init(name: String) { self.name = name }
    deinit { print("\(name) deallocated") }
}

var a: Person? = Person(name: "Ada")   // count 1
var b = a                              // count 2
a = nil                                // count 1
b = nil                                // count 0 → deinit, "Ada deallocated"
~~~

## Retain cycles

A cycle occurs when two objects strongly reference each other, so neither count ever reaches zero:

~~~swift
final class Parent {
    var child: Child?
}
final class Child {
    var parent: Parent?   // strong → cycle
}
~~~

Break cycles with `weak` (becomes `nil` when the other side dies) or `unowned` (assumes the other side outlives it).

~~~swift
final class Child {
    weak var parent: Parent?
}
~~~

## Weak and unowned rules

- `weak` is always optional and zeroes out on deallocation.
- `unowned` is non-optional and traps if accessed after deallocation.
- Both only apply to class instances (and class-bound protocols), not value types.

## Closures and cycles

A stored closure that captures `self` strongly creates a cycle:

~~~swift
final class Coordinator {
    var onFinish: (() -> Void)?
    func start() {
        onFinish = { [weak self] in self?.finish() }
    }
    func finish() {}
}
~~~

## Real-world use cases

- Delegates are `weak` to avoid the classic controller/delegate cycle.
- Timers, `NotificationCenter` observers and Combine subscriptions need explicit teardown or `weak` captures.
- Long-lived caches should hold values, not owners.

## Common pitfalls

- Assuming ARC frees memory immediately even when a reference cycle exists.
- Forgetting that `unowned` does not prevent deallocation, it just avoids optionality.
- Capturing `self` in a stored closure without a capture list.

## Best practices

- Draw the ownership graph for any two-object relationship.
- Default to `weak` for back-references and delegate references.
- Use the Memory Graph Debugger to confirm cycles before guessing.

## Interview questions

1. How does ARC differ from garbage collection?
2. When do you choose `weak` over `unowned`?
3. Why is `deinit` deterministic in Swift and what can you rely on it for?

**Follow-up:** Can a struct participate in a retain cycle? Not directly — cycles require reference-counted (class) instances.
