---
title: OSLog
difficulty: Intermediate
tags: debugging, oslog, logging, signposts
summary: Structured, privacy-aware, performant logging with the unified logging system.
prerequisites: debugging/console-logging
related: debugging/console-logging, performance/instruments-overview, debugging/common-production-issues
version: iOS 14+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

OSLog is Apple's unified logging system. It is fast, level-aware and privacy-aware, integrates with Console.app and Instruments, and can carry metadata and signposts. Use it for anything beyond a quick development print.

## Creating loggers

```swift
import os

let logger = Logger(subsystem: "com.penguinworks.app", category: "networking")
```

Use a stable subsystem (reverse-DNS) and a meaningful category.

## Levels

```swift
logger.trace("entered")
logger.debug("cache hit for \(url, privacy: .public)")
logger.info("loaded \(count) items")
logger.notice("user signed in")
logger.warning("retrying request")
logger.error("decode failed: \(error.localizedDescription)")
logger.fault("invariant violated")
```

Levels map to persistence and visibility; `debug` is not persisted by default, `error`/`fault` always are (subject to config).

## Privacy

String interpolations are **private by default** in OSLog; dynamic values are redacted unless annotated.

```swift
logger.info("token \(token, privacy: .private(mask: .hash))")
logger.info("user id \(userID, privacy: .public)")
```

Keep PII private; mark only non-sensitive values public.

## Signposts

```swift
let signposter = OSSignposter(logger: logger)
let state = signposter.beginInterval("Fetch")
defer { signposter.endInterval("Fetch", state) }
```

Signposts appear in Instruments' timeline and the Points of Interest track, aligning logs with performance data.

## Viewing logs

- **Console.app** — filter by subsystem/category.
- Xcode console — includes os_log output.
- `log stream --predicate 'subsystem == "com.penguinworks.app"'` in Terminal.

## Real-world use cases

- Diagnosing a production issue from a user's device log.
- Correlating a slow operation with a performance trace.
- Privacy-safe analytics breadcrumbs.

## Common pitfalls

- Using `print` semantics with OSLog (unannotated values are private and appear as `<private>`).
- Logging in a hot loop at `info` or higher.
- Excessive categories and subsystems that scatter logs.
- Forgetting `privacy:` and being unable to read the value you needed.

## Best practices

- Fix subsystem/category conventions.
- Choose the lowest sufficient level.
- Annotate privacy deliberately.
- Use signposts for intervals you will profile.

## Interview questions

1. Why are OSLog interpolated values private by default?
2. What do signposts add over log lines?
3. How do you stream a subsystem's logs from Terminal?

**Follow-up:** Why might a value show as `<private>` in Console.app? It was interpolated without a `privacy:` annotation, so it was redacted.
