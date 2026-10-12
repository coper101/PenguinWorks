---
title: Closures and Capture Lists
difficulty: Intermediate
tags: swift, closures, capture-lists, retain-cycles
summary: How closures capture variables, when that creates retain cycles, and how capture lists change the semantics.
prerequisites: language/memory-management-arc
related: language/memory-management-arc, concurrency/sendable, performance/memory-leaks-retain-cycles
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Closures are reference types that can capture values from their surrounding scope. By default a closure captures variables by reference, which means it sees later mutations and keeps captured objects alive. Capture lists let you capture by value or change the reference strength.

## Escaping versus non-escaping

A non-escaping closure is called before the function returns, so it cannot outlive the scope. `@escaping` marks a closure that is stored or called later.

~~~swift
func perform(_ work: () -> Void) { work() }          // non-escaping

func store(_ work: @escaping () -> Void) {
    DispatchQueue.main.async(execute: work)          // escaping
}
~~~

## Capture by reference

~~~swift
var counter = 0
let increment = { counter += 1 }
increment()
print(counter)   // 1 — the closure sees the live variable
~~~

## Capture lists

~~~swift
final class ViewModel {
    var name = "Ada"
    var onUpdate: (() -> Void)?

    func configure() {
        onUpdate = { [weak self] in
            guard let self else { return }
            print(self.name)
        }
    }
}
~~~

`[weak self]` captures an optional reference, avoiding a strong cycle. `[unowned self]` captures a non-optional reference and traps if the object is gone — use it only when the closure cannot outlive the object.

Capturing by value snapshots the current value:

~~~swift
let value = 10
let snapshot = { [value] in print(value) }
~~~

## Retain-cycle rule

A retain cycle forms when an object strongly holds a closure and the closure strongly captures the object. Delegate patterns, timers and stored callbacks are the usual suspects.

## Real-world use cases

- `[weak self]` in escaping closures that store or schedule work.
- Snapshotting a value at creation time with a capture list.
- Breaking cycles in delegate, observer and coordinator patterns.

## Common pitfalls

- Using `[weak self]` and then force-unwrapping `self!`.
- Capturing a loop variable by reference when you meant to snapshot it.
- Assuming `[unowned self]` is a performance win worth the crash risk.

## Best practices

- Use `[weak self]` by default for escaping closures on reference types.
- Guard-unwrap `self` once at the top rather than everywhere.
- Prefer value-type view models to avoid cycles entirely.

## Interview questions

1. What is the difference between `[weak self]` and `[unowned self]`?
2. Why does a stored closure cause a retain cycle?
3. When would you capture a value rather than a reference?

**Follow-up:** Does a non-escaping closure need a capture list for `self`? No — it cannot outlive the call, so no cycle forms.
