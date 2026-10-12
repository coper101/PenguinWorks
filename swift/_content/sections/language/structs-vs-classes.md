---
title: Structs vs Classes
difficulty: Beginner
tags: swift, struct, class, value-types
summary: When to choose a struct and when a class must be used, based on semantics rather than habit.
prerequisites: language/value-vs-reference
related: language/memory-management-arc, language/copy-on-write, architecture/protocol-oriented-programming
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 8
---

## Overview

A `struct` is a value type: assignment copies the value. A `class` is a reference type: assignment shares the same instance, and identity matters. The rule of thumb is to **start with a struct** and move to a class only when you need one of the things only classes provide.

## What only classes can do

- Inheritance and class hierarchies.
- `deinit` for deterministic cleanup.
- Reference identity: `===` and `ObjectIdentifier`.
- Interoperate with Objective-C (`@objc`, `NSObject`, KVO).
- Be deallocated when the last reference is released (ARC).

~~~swift
final class Session {
    let token: String
    init(token: String) { self.token = token }
    deinit { print("session ended") }
}

struct Credentials {
    var username: String
    var password: String
}
~~~

## Copy on assignment

~~~swift
struct Point { var x = 0.0; var y = 0.0 }
var p1 = Point(x: 1, y: 2)
var p2 = p1          // independent copy
p2.x = 99
print(p1.x)          // 1.0

final class Node { var value = 0 }
let n1 = Node()
let n2 = n1          // same instance
n2.value = 99
print(n1.value)      // 99
~~~

## Mixing value and reference semantics

A struct that stores a class instance still copies the reference, not the object. This is the classic "value type containing a reference type" trap.

~~~swift
struct Wrapper {
    var items: NSMutableArray   // reference inside a value
}
~~~

Prefer value-type members, and if you must hold a reference, document the sharing.

## Real-world use cases

- Use structs for models, view state, configuration, and anything compared by value.
- Use classes for identity-bearing entities, shared mutable state, and reference-based lifetimes.
- Mark classes `final` unless they are truly designed for subclassing; this enables devirtualisation.

## Common pitfalls

- Assuming a struct is always cheap. Large structs copy on assignment; measure before optimising.
- Mutating a struct through a `let` property and expecting the change to propagate.
- Subclassing when a protocol with default implementations would do.

## Best practices

- Default to structs and enums; reach for classes deliberately.
- Make classes `final` and prefer composition over inheritance.
- Keep structs small and composed of other value types.

## Interview questions

1. Give three features that require a class rather than a struct.
2. Are arrays value types or reference types? Explain what happens on `var b = a`.
3. Why does marking a class `final` help performance?

**Follow-up:** How does copy-on-write make large value types affordable? See [Copy-on-Write](/swift/language/copy-on-write/).
