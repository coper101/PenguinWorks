---
title: Copy-on-Write
difficulty: Advanced
tags: swift, copy-on-write, performance, value-semantics
summary: How Swift makes large value types cheap by sharing storage until a mutation forces a copy.
prerequisites: language/value-vs-reference, language/memory-management-arc
related: language/value-vs-reference, performance/allocations, language/structs-vs-classes
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Value semantics promise that mutations are not shared. Copy-on-write (COW) is the optimisation that keeps that promise affordable: two values share one heap buffer until one of them mutates, at which point the mutating value gets its own copy. `Array`, `Dictionary`, `Set` and `String` all use COW.

## Observing COW

~~~swift
var a = Array(repeating: 0, count: 1_000_000)
var b = a                       // no copy yet — shared buffer
b[0] = 1                        // now b gets its own copy
print(a[0], b[0])               // 0 1
~~~

`isKnownUniquelyReferenced` lets you implement COW yourself:

~~~swift
final class Storage {
    var items: [Int] = []
}

struct Bag {
    private var storage = Storage()

    mutating func append(_ value: Int) {
        if !isKnownUniquelyReferenced(&storage) {
            storage = Storage()          // copy before mutating
        }
        storage.items.append(value)
    }
}
~~~

## The cost model

- Passing a value type by value is O(1) — a retain of the shared buffer plus a pointer.
- The first mutation after sharing is O(n) because it copies.
- Repeatedly copying and mutating in a loop defeats COW.

## Avoiding accidental copies

~~~swift
// Subtle: `items` is captured by a closure that may outlive the scope,
// forcing a copy when the array is later mutated.
var items = [1, 2, 3]
let observer = { print(items) }   // captures a copy of the value
items.append(4)                   // may copy due to the closure capture
~~~

Use `withUnsafeBufferPointer` or slice indices to avoid materialising sub-arrays.

## Real-world use cases

- Large model arrays passed through layers without copying.
- Reducer architectures that rely on structural sharing for undo stacks.
- Implementing custom COW containers for expensive payloads.

## Common pitfalls

- Assuming value types never allocate. COW containers still allocate on first mutation.
- Holding two references to the same array and mutating one, expecting an in-place update.
- Using `Array(someSlice)` unnecessarily, which forces a copy.

## Best practices

- Prefer `SubSequence`/slices for read-only views of data.
- Implement `isKnownUniquelyReferenced`-based COW for your own heavy containers.
- Profile allocations before optimising COW behaviour.

## Interview questions

1. Explain copy-on-write in one paragraph.
2. How does `isKnownUniquelyReferenced` enable custom COW?
3. Why does passing a large array to a function not copy it?

**Follow-up:** What class method does `Array` use internally to detect sharing? A uniqueness check on its backing buffer.
