---
title: Crash Log Interpretation
difficulty: Advanced
tags: debugging, crash-logs, symbols, exceptions
summary: Read a crash report, symbolicate it, and identify the faulting frame and cause.
prerequisites: debugging/lldb-commands, debugging/breakpoints
related: debugging/address-sanitizer, debugging/common-production-issues, performance/debugging-freezes-hangs
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 11
---

## Overview

A crash log records the exception, the thread stacks, and metadata such as the OS and device. Reading it correctly turns "the app crashed" into a specific line.

## The key sections

- **Header** — app version, build, OS, device, incident id.
- **Exception Type** — e.g. `EXC_BAD_ACCESS`, `EXC_CRASH (SIGABRT)`, `EXC_BREAKPOINT`.
- **Termination Reason** — watchdog (`0x8badf00d`), memory (`0x8badf00d` vs `0xc00010ff` jetsam), etc.
- **Triggered Thread & Frames** — the stack where it crashed.
- **Thread 0 / main thread** — often where UI work and assertions crash.

## Common exception types

| Type | Meaning |
| --- | --- |
| `EXC_BAD_ACCESS` (SIGSEGV/SIGBUS) | Bad memory: dangling pointer, use-after-free, stack overflow |
| `EXC_BREAKPOINT` (SIGTRAP) | Swift runtime trap: force unwrap of nil, array index, `fatalError` |
| `SIGABRT` | `abort()` — uncaught exception, `NSException`, assertion |
| `0x8badf00d` | Watchdog: too slow to launch or respond |

## Symbolication

Symbols map addresses to function names and lines. Xcode symbolicates automatically with matching dSYMs. For a submitted build, use **Xcode ▸ Window ▸ Organizer ▸ Crashes**, or the `atos` tool with the dSYM:

```sh
atos -o MyApp.app.dSYM/Contents/Resources/DWARF/MyApp -arch arm64 -l 0x100000000 0x100abc123
```

Archive dSYMs for every release; without them a crash log is just addresses.

## Common Swift crash causes

- Force-unwrapping `nil` (`Unexpectedly found nil while unwrapping`).
- Array index out of range.
- `try!` throwing.
- Uncaught `NSException` (often KVO, constraints, or a bad selector).
- Stack overflow from unbounded recursion.

## Real-world use cases

- Triaging a crash ticket from the App Store Connect crash reports.
- Confirming a fixed crash with the same build.
- Distinguishing a memory-pressure termination from a bug.

## Common pitfalls

- Guessing from the crash without symbols.
- Missing dSYMs for a release build.
- Treating a watchdog kill as a code crash.
- Ignoring the "Last Exception Backtrace" for `NSException` crashes.

## Best practices

- Archive and upload dSYMs for every build.
- Symbolicate before investigating.
- Read the termination reason first.
- Map the type to a fix; an exception breakpoint reproduces most Swift traps.

## Interview questions

1. What does `EXC_BAD_ACCESS` usually indicate?
2. What does `0x8badf00d` mean?
3. Why are dSYMs essential?

**Follow-up:** How do you reproduce a force-unwrap crash quickly? Add an exception/Swift-error breakpoint and run the flow that triggers it.
