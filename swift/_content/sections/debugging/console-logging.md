---
title: Console Logging
difficulty: Beginner
tags: debugging, logging, print, debugger
summary: Use logging and the debugger console effectively, and know when to stop using print.
prerequisites: debugging/lldb-commands
related: debugging/oslog, debugging/xcode-debugging-techniques, debugging/common-production-issues
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 7
---

## Overview

Logging is the fastest way to understand a running program, but unstructured `print` statements become noise. Use the console and debugger for development, and structured logging (OSLog) for anything that ships.

## During development

- The Xcode console (⌘⇧Y) shows `print`, `debugPrint` and system output.
- `debugPrint` escapes and shows more detail for complex values.
- Use string interpolation and `.map`/`debugDescription` to inspect collections.

```swift
print("items:", items.count)
debugPrint(user)      // fuller representation
dump(nested)          // recursive structure dump
```

## Filtering the console

The console is noisy with system logs. Use the filter field, or narrow output with OSLog categories. You can also redirect to a file for later analysis.

## Breakpoint logging instead of print

A breakpoint with a log action avoids editing code and can be left for a session:

```text
po "loading \(user.id)"
```

Add it to a symbolic breakpoint to trace all calls without touching source.

## Why not print in production

- `print` is slow and synchronous.
- It has no levels, categories or metadata.
- It cannot be filtered or shipped to a server safely.
- It may leak sensitive data to device logs.

Use [OSLog](/swift/debugging/oslog/) instead.

## Real-world use cases

- Quick checks during development.
- Tracing call order with breakpoint logs.
- Dumping a value to understand its shape.

## Common pitfalls

- Leaving `print` in shipped code.
- Logging secrets or personal data.
- Logging inside a hot loop, destroying performance.

## Best practices

- Use `print`/`debugPrint` only during development.
- Prefer breakpoint log actions for temporary traces.
- Move to OSLog for anything long-lived.
- Never log credentials or PII.

## Interview questions

1. When is logging with the debugger better than `print`?
2. Why is `print` unsuitable for production?
3. How do you avoid console noise?

**Follow-up:** What is the difference between `print` and `debugPrint`? `debugPrint` uses the debug representation, escaping and annotating values.
