---
title: Access Control
difficulty: Intermediate
tags: swift, access-control, api-design
summary: Choose the right visibility for every declaration and understand how open, public, internal, fileprivate and private differ.
prerequisites: language/protocols-extensions
related: architecture/modular-architecture, architecture/protocol-oriented-programming, language/advanced-type-system
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 7
---

## Overview

Access control restricts where a declaration can be used. Well-chosen visibility makes a module's surface small, which documents intent and lets the compiler find dead code.

## The levels

- `open` — usable and subclassable/overridable from any module. Only for classes and their members.
- `public` — usable from any module, but not subclassable/overridable outside the defining module.
- `package` — usable within a package that shares a build. Useful for multi-module apps.
- `internal` — the default; usable within the module.
- `fileprivate` — usable within the source file.
- `private` — usable within the enclosing declaration and its extensions **in the same file**.

~~~swift
public struct Client {
    public private(set) var requestCount = 0   // readable everywhere, writable here
    private var token: String

    public init(token: String) { self.token = token }
    private func sign(_ request: URLRequest) -> URLRequest { request }
}
~~~

## `private(set)`

A setter can be more restrictive than the getter, which is the standard way to expose read-only state:

~~~swift
public private(set) var isConnected = false
~~~

## Extensions and private

A `private` member is visible to extensions in the same file, not to extensions in other files. This is why a type split across files needs `fileprivate` or `internal` for shared helpers.

## Real-world use cases

- Keep a module's public API minimal so refactors stay internal.
- Expose read-only state while mutating internally.
- Use `package` access to share a testing or model module across an app's feature modules.

## Common pitfalls

- Making everything `public` "just in case", which freezes your API.
- Assuming `private` in an extension is per-extension rather than per-file.
- Using `open` when `public` suffices, exposing subclassing contracts you must maintain.

## Best practices

- Start with the tightest access level and widen only when required.
- Mark public API explicitly and review it in reviews.
- Use `package` for internal cross-module sharing in SwiftPM.

## Interview questions

1. What is the difference between `open` and `public`?
2. How does `private` interact with extensions across files?
3. When is `package` access appropriate?

**Follow-up:** Why does `private(set) public var` need `public` on the getter? Because the access modifier applies to the getter, while `private(set)` restricts only the setter.
