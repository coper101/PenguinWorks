---
title: Common Production Issues
difficulty: Advanced
tags: debugging, production, metrickit, crashes
summary: The failure modes that only appear in the field, and how to detect and fix them.
prerequisites: debugging/crash-log-interpretation, debugging/oslog
related: debugging/crash-log-interpretation, debugging/oslog, performance/debugging-freezes-hangs
version: iOS 17+
lastReviewed: 2026-09-30
readingTime: 11
---

## Overview

Some bugs never appear in development: memory-pressure terminations, watchdog kills on slow devices, network flakiness, thermal throttling and version-specific API misuse. Production telemetry (MetricKit, crash reporting, OSLog) is how you see them.

## The common failure modes

1. **Memory-pressure terminations (jetsam).** The app is killed in the background for using too much memory. No crash log in the usual sense; look for jetsam events in MetricKit and the `EXC_RESOURCE`/`0xc00010ff` reasons.
2. **Watchdog kills (`0x8badf00d`).** Launch or main-thread response too slow on a slower device.
3. **Thermal throttling and hangs.** Sustained CPU work on a hot device causes hitches and terminations.
4. **Disk full.** Writes fail; apps must handle `ENOSPC`.
5. **Network flakiness.** Captive portals, IPv6-only networks, poor connectivity.
6. **OS-version regressions.** An API behaves differently on a newer or older OS than your dev device.

## MetricKit

Subscribe to metric payloads for crashes, hangs, CPU, memory and disk:

```swift
final class MetricsSubscriber: NSObject, MXMetricManagerSubscriber {
    func didReceive(_ payloads: [MXMetricPayload]) { /* aggregate */ }
    func didReceive(_ payloads: [MXDiagnosticPayload]) {
        for p in payloads {
            p.crashDiagnostics?.forEach { log($0) }
            p.hangDiagnostics?.forEach { log($0) }
            p.diskWriteExceptionDiagnostics?.forEach { log($0) }
            p.cpuExceptionDiagnostics?.forEach { log($0) }
        }
    }
}
// MXMetricManager.shared.add(subscriber)
```

MetricKit aggregates on-device and delivers daily payloads, including the stack traces you need.

## Mitigations

- Reduce peak memory; downsample images; release caches under memory warnings.
- Keep launch and main-thread work minimal to avoid the watchdog.
- Handle `URLError` and disk-full gracefully with retry and user feedback.
- Test on the oldest supported device and IPv6-only networks.
- Gate new APIs with availability checks.

## Real-world use cases

- A background refresh killed for memory.
- A watchdog termination only on iPhone SE.
- A save that fails when storage is full.

## Common pitfalls

- Assuming no crash log means no bug.
- Not subscribing to MetricKit.
- Testing only on modern, fast, wifi devices.
- Ignoring `EXC_RESOURCE` terminations.

## Best practices

- Enable MetricKit and a crash reporter.
- Test on the oldest supported hardware and poor networks.
- Handle memory warnings and disk-full explicitly.
- Roll out with phased release and watch field metrics.

## Interview questions

1. How do you detect a memory-pressure termination with no crash report?
2. What does MetricKit provide that crash reporting alone does not?
3. How do you guard against watchdog kills on slow devices?

**Follow-up:** What is `EXC_RESOURCE`? An exception indicating the app exceeded a resource limit (CPU or memory), often leading to termination.
