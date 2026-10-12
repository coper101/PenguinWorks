---
title: LLDB Commands
difficulty: Intermediate
tags: debugging, lldb, debugger
summary: Inspect state, step through code and run expressions without leaving the debugger.
prerequisites: debugging/breakpoints
related: debugging/breakpoints, debugging/xcode-debugging-techniques, debugging/crash-log-interpretation
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

LLDB is the debugger behind Xcode. Knowing a handful of commands turns "it crashes somewhere" into "this value is nil here". The console (⌘⇧Y) accepts LLDB commands directly.

## Execution control

| Command | Short | Meaning |
| --- | --- | --- |
| `continue` | `c` | Resume |
| `next` | `n` | Step over |
| `step` | `s` | Step into |
| `finish` | `f` | Step out |
| `thread step-inst` | `si` | Step one instruction |
| `process interrupt` | | Pause running code |

## Inspecting state

```text
(lldb) po user
(lldb) p items.count
(lldb) frame variable
(lldb) bt
(lldb) frame select 2
```

- `po` (print object) calls `debugDescription` and is great for objects.
- `p` prints the raw value and its type.
- `frame variable` lists all locals in the frame.
- `bt` (backtrace) shows the call stack.

## Expression evaluation

```text
(lldb) expr let x = 42; x * 2
(lldb) e MyType.shared
```

You can call functions and construct objects, but be aware of side effects — expressions run in the paused process.

## Breakpoint commands

```text
(lldb) breakpoint set --name viewDidLoad
(lldb) breakpoint set --file Row.swift --line 42
(lldb) breakpoint modify --auto-continue true 1
(lldb) breakpoint command add 1
> po self.items
> continue
> DONE
```

## Useful tricks

- `thread return` to short-circuit a function while debugging.
- `v` is shorthand for `frame variable`.
- `po $arg1` for Objective-C method arguments; in Swift use `frame variable`.
- Set `settings set target.language swift` if expression syntax trips up.
- `image lookup -rn Row` to find symbols matching a regex.

## Real-world use cases

- Inspecting the exact optional before adding a guard.
- Confirming an array is empty rather than assuming.
- Attaching the debugger to a release build with symbols.

## Common pitfalls

- `po` on a huge object flooding the console.
- Relying on `po` for value types when `p` is clearer.
- Mutating state from `expr` and forgetting the process is paused at that point.

## Best practices

- Learn `bt`, `frame variable`, `po` and `p` cold.
- Add breakpoint commands for repeatable inspection.
- Use `--one-shot` breakpoints for temporary stops.

## Interview questions

1. What is the difference between `po` and `p`?
2. How do you inspect a caller frame?
3. How do you set a breakpoint that logs and continues automatically?

**Follow-up:** How do you call a function from the debugger without changing code? `expr` evaluates it in the paused process.
