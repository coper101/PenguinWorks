---
title: Variables, Constants and Types
difficulty: Beginner
tags: swift, types, var, let
summary: The difference between let and var, type inference versus explicit types, and the built-in value and reference types you use every day.
prerequisites: Basic programming experience
related: language/optionals, language/structs-vs-classes, language/value-vs-reference
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 7
---

## Overview

Swift variables are declared with `var`, constants with `let`. A `let` binding cannot be reassigned, and the compiler enforces this at compile time rather than at runtime. Prefer `let` everywhere; reach for `var` only when a value genuinely changes. This makes intent explicit and lets the optimiser reason about your code.

Swift is strongly and statically typed, but it infers types aggressively. `let count = 0` is an `Int`; `let name = "Ada"` is a `String`. Inference is convenient but explicit annotation is valuable at API boundaries.

## Value and reference types

The standard library's collection and model types — `Int`, `Double`, `Bool`, `String`, `Array`, `Dictionary`, `Set`, `Struct`, `Enum`, `Tuple` — are all **value types**. When you assign or pass them, you copy the value. Classes, actors and closures are **reference types**.

~~~swift
let a = [1, 2, 3]
var b = a          // b is an independent copy
b.append(4)
print(a)           // [1, 2, 3]
print(b)           // [1, 2, 3, 4]
~~~

## Type inference and annotation

~~~swift
let inferred = 42                 // Int
let explicit: Int64 = 42          // Int64
let pi: Double = 3.14159
let greeting: String = "hello"
let flags: Set<String> = ["a", "b"]
let mapping: [String: Int] = ["one": 1]
~~~

Use annotations when the inferred type is wider or narrower than you want — for example integer literals default to `Int`, and floating point literals default to `Double`.

## Numeric conversion is explicit

Swift never converts numeric types implicitly. You must construct the destination type, which prevents silent truncation and signedness errors.

~~~swift
let intValue = 3
let doubleValue = Double(intValue)   // 3.0
let rounded = Int(3.9)               // 3, truncates toward zero
~~~

## Real-world use cases

- Represent domain values with small value types (`struct Money`, `enum Status`) rather than primitives.
- Annotate public API return types so callers get a stable contract.
- Use `let` for injected dependencies to guarantee they are not swapped mid-lifecycle.

## Common pitfalls

- Believing `var` makes a value reference-like. `var` only allows reassignment; value semantics still apply.
- Relying on inference across module boundaries where a type is not obvious.
- Using floating point for money. Use integers measured in the smallest currency unit, or `Decimal`.

## Best practices

- Default to `let`; the compiler will tell you when you need `var`.
- Annotate types at public boundaries and in ambiguous literals.
- Keep numeric domains explicit with dedicated types.

## Interview questions

1. What is the difference between a value type and a reference type in Swift?
2. Why does `let` on an array still allow `var inner = array; inner.append(...)`?
3. When would you annotate a type instead of relying on inference?

**Follow-up:** Does `let` guarantee immutability of the referenced object for a class? No — `let` prevents rebinding, but the object's `var` properties can still change.
