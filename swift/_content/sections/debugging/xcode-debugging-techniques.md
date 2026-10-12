---
title: Xcode Debugging Techniques
difficulty: Intermediate
tags: debugging, xcode, view-hierarchy, environment
summary: Use Xcode's diagnostics, view debugger, environment overrides and instruments to shorten feedback loops.
prerequisites: debugging/breakpoints, debugging/lldb-commands
related: debugging/breakpoints, performance/instruments-overview, debugging/diagnosing-swiftui-problems
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Xcode bundles a set of debugging tools that catch classes of problems automatically. Knowing which to switch on saves hours.

## Scheme Diagnostics

Edit Scheme ▸ Run ▸ Diagnostics:

- **Main Thread Checker** — flags UI API calls off the main thread.
- **Address Sanitizer / Thread Sanitizer / Undefined Behavior Sanitizer**.
- **Malloc Scribble / Guard Malloc** — poison memory to surface use-after-free.
- **Zombies** — log messages to deallocated objects (Obj-C).
- **Runtime API Checking** — catches misuse of newer APIs on older OS versions.

## View Debugger

Pause and click **Debug View Hierarchy**. It renders the live layer tree, shows frames, constraints and hidden views, and reveals constraint conflicts and clipping.

## Environment Overrides

The Debug bar's environment button toggles:

- **Dark Mode / Light Mode**.
- **Dynamic Type** sizes (including accessibility sizes).
- **Accessibility** settings: Reduce Motion, Increase Contrast, Bold Text.
- **Right-to-left** layout.

Use these to test states without changing device settings.

## Attach to process

Debug ▸ Attach to Process lets you attach to a running app or extension — useful for launch issues, widgets and background tasks.

## Simulate locations and conditions

- Xcode's location simulation for CoreLocation.
- Network Link Conditioner for slow networks.
- Device ▸ Simulate Memory Warning.
- Background task simulation via LLDB (`_simulateLaunchForTaskWithIdentifier:`).

## Real-world use cases

- Finding a broken constraint with the View Debugger.
- Catching off-main UI access with the Main Thread Checker.
- Testing Dynamic Type without changing the device.

## Common pitfalls

- Shipping with sanitizers or zombies enabled (huge overhead).
- Ignoring Main Thread Checker warnings as harmless.
- Testing only default Dynamic Type.

## Best practices

- Enable Main Thread Checker and runtime checks during development.
- Use the View Debugger before guessing at layout bugs.
- Test all appearance, size and accessibility combinations.
- Attach to extensions and widgets for launch debugging.

## Interview questions

1. What does the Main Thread Checker catch?
2. How does the View Debugger help with Auto Layout?
3. How do you test Dynamic Type without changing settings?

**Follow-up:** Why enable Malloc Scribble/Guard Malloc? They poison freed/allocated memory so use-after-free and overflows surface immediately.
