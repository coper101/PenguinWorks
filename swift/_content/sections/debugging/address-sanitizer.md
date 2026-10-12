---
title: Address Sanitizer
difficulty: Advanced
tags: debugging, address-sanitizer, memory-corruption, undefined-behaviour
summary: Catch out-of-bounds access, use-after-free and other memory errors at the moment they happen.
prerequisites: debugging/breakpoints
related: debugging/thread-sanitizer, debugging/crash-log-interpretation, performance/allocations
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 8
---

## Overview

Address Sanitizer (ASan) detects memory errors: buffer overflows, use-after-free, use-after-return and some undefined behaviour. Enable it via Edit Scheme ▸ Run ▸ Diagnostics ▸ Address Sanitizer.

## What it catches

- **Heap buffer overflow** — read/write past an allocation.
- **Use-after-free** — touching deallocated memory.
- **Use-after-return** — referencing a stack value after return.
- **Double free**.
- Some C/C++/Unsafe Swift undefined behaviour.

## Why it matters for Swift

Pure Swift value types are memory-safe, but Swift uses unsafe pointers in interop, performance code and C APIs (`withUnsafeBufferPointer`, `UnsafeMutablePointer`, ImageIO, Accelerate). ASan catches the mistakes there.

```swift
var buffer = [UInt8](repeating: 0, count: 8)
buffer.withUnsafeMutableBufferPointer { ptr in
    ptr[ptr.count] = 1   // out of bounds -> ASan reports
}
```

## Interpreting reports

```text
ERROR: AddressSanitizer: heap-buffer-overflow on address ...
  WRITE of size 1 ...
    #0 ... 
  allocated by thread T0 here:
    #0 ... buffer
```

ASan shows the faulting access and where the memory was allocated.

## Overhead

ASan adds significant CPU and memory overhead (runtime instrumentation). Use it in debug and CI, not release.

## Real-world use cases

- C interop with a fixed-size buffer.
- Image/audio processing with unsafe pointers.
- A cached pointer used after its owner was freed.

## Common pitfalls

- Shipping with sanitizers enabled (huge overhead).
- Assuming Swift is immune — unsafe APIs and interop are not.
- Ignoring an ASan report as noise; it is a real memory error.

## Best practices

- Run ASan in debug and CI for C/interop-heavy code.
- Pair with UBSan for undefined behaviour.
- Replace unsafe pointer code with safe Swift where possible.
- Reproduce with the failing input.

## Interview questions

1. What memory errors does ASan detect?
2. Why can Swift code still trigger ASan?
3. When should ASan be enabled?

**Follow-up:** Which sanitizer detects data races versus memory corruption? TSan for races, ASan for memory corruption.
