---
title: Error Handling
difficulty: Intermediate
tags: swift, errors, throws, result
summary: Model recoverable failure with throws, Result and typed errors, and know when each is the right tool.
prerequisites: language/optionals, language/enums-associated-values
related: language/optionals, concurrency/structured-concurrency, recipes/error-handling-patterns
version: Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Swift distinguishes recoverable errors from programmer errors. Recoverable failures use `throws` and `Error`; programmer errors (a violated invariant) use `precondition` or `fatalError` and should crash in development.

## Throwing and catching

~~~swift
enum FileError: Error, Equatable {
    case notFound(path: String)
    case unreadable(reason: String)
}

func read(_ path: String) throws -> String {
    throw FileError.notFound(path: path)
}

do {
    let contents = try read("config.json")
    print(contents)
} catch let error as FileError {
    print("file problem:", error)
} catch {
    print("unexpected:", error)
}
~~~

`try?` converts to an optional and discards the error; `try!` traps. Prefer `do/catch` when you can act on the error.

## Result for callback and deferrable APIs

Before async/await, and sometimes today for value-returning APIs, `Result<Success, Failure>` models an outcome explicitly:

~~~swift
func load(completion: @escaping (Result<Data, FileError>) -> Void) {
    completion(.failure(.notFound(path: "config.json")))
}
~~~

Callers switch on `.success` and `.failure` and cannot forget the error path.

## Typed throws (Swift 6)

Swift 6 adds typed throws so a function can declare exactly which error it throws, which generic code and exhaustive `catch` can then use.

~~~swift
func parse(_ text: String) throws(ParseError) -> Value {
    throw .emptyInput
}

do {
    let value = try parse("")
} catch {
    // error is known to be ParseError
}
~~~

## Cleanup with defer

~~~swift
func withFile<T>(_ path: String, _ body: (FileHandle) throws -> T) rethrows -> T {
    let handle = FileHandle(forReadingAtPath: path)!
    defer { try? handle.close() }
    return try body(handle)
}
~~~

`defer` runs when the scope exits, on every path, including thrown errors.

## Real-world use cases

- Network and disk operations that can fail for expected reasons.
- Validating user input and surfacing a typed message.
- Wrapping framework errors in a domain-specific `Error`.

## Common pitfalls

- Swallowing errors with `try?` and losing the reason.
- Throwing `NSError` string soup instead of typed cases.
- Abusing `fatalError` for recoverable conditions.

## Best practices

- Define a small, typed error enum per domain.
- Convert errors to user-facing messages at the UI boundary, not deep in the model.
- Use `rethrows` for higher-order functions that only propagate errors from their closure.

## Interview questions

1. When should you throw versus return an optional?
2. What is `rethrows` and how does it differ from `throws`?
3. What problem do typed throws solve?

**Follow-up:** How would you test a function that throws a specific typed error?
