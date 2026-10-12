---
title: Breakpoints
difficulty: Beginner
tags: debugging, breakpoints, symbolic, exception
summary: Use source, symbolic, conditional, exception and Swift error breakpoints to catch problems at the right moment.
prerequisites: debugging/lldb-commands
related: debugging/lldb-commands, debugging/crash-log-interpretation, debugging/xcode-debugging-techniques
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

A breakpoint pauses execution so you can inspect state. Xcode offers several kinds, each suited to a different problem. The Breakpoint Navigator (⌘8) manages them all.

## Source breakpoints

Click the gutter to set one. Options via right-click:

- **Condition** — pause only when an expression is true: `user.id == 42`.
- **Ignore N times** — skip the first N hits (great for loops).
- **Action** — log a message or run LLDB commands, optionally auto-continuing.
- **Move to current line**, **Disable**, **Delete**.

## Symbolic breakpoints

Pause when a named function is called, even in frameworks:

- `-[UIViewController viewDidLoad]`
- `malloc_error_break`
- `objc_exception_throw`

Add via Breakpoint Navigator ▸ `+` ▸ Symbolic Breakpoint.

## Conditional and filtering

```text
Condition: items.count > 100
```

Use conditions to avoid stopping on the thousands of harmless hits and catch the one time it matters.

## Exception breakpoints

An **Exception Breakpoint** (Objective-C or Swift errors) stops the debugger at the throw site rather than where it is later caught. This is one of the most useful breakpoints when a crash's backtrace is unhelpful.

## Swift error breakpoints

A Swift error breakpoint pauses whenever a `throw` occurs, even if caught elsewhere. Pair it with a condition to target a specific error type.

## Runtime issues

Xcode's runtime issue breakpoints (Main Thread Checker, constraint, undefined behaviour) pause when the runtime detects a problem. They are enabled by default in the Scheme's Diagnostics.

## Real-world use cases

- Catch an array index out of range at the exact access.
- Stop the first time a background thread touches UI (Main Thread Checker).
- Break when a specific web request fails.

## Common pitfalls

- Leaving many breakpoints enabled, slowing the debug session.
- Conditions with side effects that change behaviour.
- Forgetting exception breakpoints are disabled in some schemes.

## Best practices

- Prefer an exception breakpoint plus a conditional source breakpoint.
- Use "log and continue" actions instead of stopping in hot paths.
- Share a breakpoint set for common issues in a `.xcbkptlist`.

## Interview questions

1. What does an exception breakpoint change about when you stop?
2. How do you break only when a loop index reaches a value?
3. What does the Main Thread Checker breakpoint catch?

**Follow-up:** Why is an exception breakpoint more useful than the crash backtrace sometimes? It stops at the throw, not where the error is later surfaced.
