---
title: Enums and Associated Values
difficulty: Beginner
tags: swift, enum, associated-values, exhaustiveness
summary: Model state as a finite set of cases, attach data per case, and let the compiler enforce exhaustiveness.
prerequisites: language/optionals
related: language/protocols-extensions, language/generics, architecture/protocol-oriented-programming
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 8
---

## Overview

An enum defines a closed set of related cases. Unlike C enums, Swift cases can carry **associated values** and can have methods and computed properties. Because Swift checks `switch` exhaustiveness, adding a case surfaces every place that needs updating at compile time.

## Raw values versus associated values

Raw values are compile-time constants shared by the case; associated values are per-instance data.

~~~swift
enum HTTPStatus: Int {
    case ok = 200
    case notFound = 404
    case serverError = 500
}

enum APIResult {
    case success(Data)
    case failure(status: Int, message: String)
    case loading
}
~~~

## Pattern matching

~~~swift
func describe(_ result: APIResult) -> String {
    switch result {
    case .success(let data):
        return "\(data.count) bytes"
    case .failure(let status, let message):
        return "\(status): \(message)"
    case .loading:
        return "Loading…"
    }
}
~~~

`if case` and `guard case` match a single pattern without a full switch:

~~~swift
if case .failure(let status, _) = result, status >= 500 {
    reportServerError()
}
~~~

## Methods and indirect cases

~~~swift
enum Tree {
    case leaf(Int)
    indirect case node(Tree, Tree)

    var sum: Int {
        switch self {
        case .leaf(let value): return value
        case .node(let left, let right): return left.sum + right.sum
        }
    }
}
~~~

`indirect` boxes the payload so recursive enums can exist.

## Real-world use cases

- Replace boolean pairs and stringly-typed flags with a single enum.
- Represent screen state as `enum ViewState { case loading, loaded([Item]), failed(Error) }`.
- Decode API variants by switching on a `type` key.

## Common pitfalls

- Adding a case and forgetting to handle it — the compiler catches this, so never use `default` unnecessarily.
- Using `default` in a switch on your own enum, which defeats exhaustiveness checking.
- Forgetting that enums with no associated values are `Hashable` automatically, but those with associated values are only `Hashable` if all payloads are.

## Best practices

- Prefer enums over multiple booleans for mutually exclusive states.
- Make state transitions illegal states unrepresentable.
- Conform to `CaseIterable` when you need to iterate all cases.

## Interview questions

1. What is the difference between a raw value and an associated value?
2. When do you need `indirect`?
3. Why is exhaustiveness checking valuable as an API evolves?

**Follow-up:** Can an enum case have both a raw value and associated values? No — a raw-value enum cannot also declare associated values.
