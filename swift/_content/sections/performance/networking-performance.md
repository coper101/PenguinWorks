---
title: Networking Performance
difficulty: Intermediate
tags: performance, networking, urlsession, caching
summary: Cut latency, bandwidth and battery use with connection reuse, caching, compression and request coalescing.
prerequisites: performance/instruments-overview
related: performance/battery-energy, recipes/networking-urlsession, performance/concurrency-bottlenecks
version: iOS 17+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Network performance is latency-dominated, not bandwidth-dominated. The dominant costs are DNS, connection setup (TLS handshakes), and round trips. Reduce round trips, reuse connections, cache aggressively and fetch only what you need.

## Symptoms

- Screens wait seconds for small payloads.
- Poor performance on high-latency mobile networks.
- Excessive data usage and battery drain.

## Wins

1. **Connection reuse.** A shared `URLSession` with a persistent configuration reuses HTTP/2 connections; creating a session per request does not.
2. **HTTP/2 or HTTP/3.** Multiplexing removes head-of-line blocking per connection.
3. **Caching.** Configure `URLCache` and honour `Cache-Control`/`ETag` to avoid refetching unchanged data.
4. **Request coalescing.** Never issue the same request twice concurrently; deduplicate in flight.
5. **Payload size.** Request only needed fields; enable gzip/br; paginate instead of fetching everything.
6. **Prefetch smartly.** Warm the cache for likely next screens, respecting data-saver settings.

```swift
let config = URLSessionConfiguration.default
config.requestCachePolicy = .useProtocolCachePolicy
config.urlCache = URLCache(memoryCapacity: 32 << 20, diskCapacity: 256 << 20, diskPath: nil)
config.waitsForConnectivity = true
let session = URLSession(configuration: config)   // one shared session
```

## In-flight deduplication

```swift
actor RequestCoalescer {
    private var inFlight: [URL: Task<Data, Error>] = [:]
    func data(for url: URL, using session: URLSession) async throws -> Data {
        if let existing = inFlight[url] { return try await existing.value }
        let task = Task { (try await session.data(from: url)).0 }
        inFlight[url] = task
        defer { inFlight[url] = nil }
        return try await task.value
    }
}
```

## Measuring

- Instruments **Network** template for per-request timing and size.
- `URLSessionTaskMetrics` for DNS, connect, TLS and TTFB breakdown.
- Network Link Conditioner to simulate poor networks.

## Real-world use cases

- A feed that loads instantly from cache and refreshes in the background.
- Reducing mobile data usage for a media app.
- Fixing duplicate concurrent requests on screen open.

## Common pitfalls

- Creating a new `URLSession` per request, losing connection reuse.
- Ignoring cache headers and refetching unchanged data.
- Fetching large payloads with unneeded fields.
- Blocking UI on a request that could be cached or prefetched.

## Best practices

- One shared session with a tuned configuration.
- Coalesce duplicate requests.
- Respect caching and data-saver settings.
- Measure with task metrics and the Network instrument.

## Interview questions

1. Why is one shared `URLSession` faster than many?
2. How does `URLCache` reduce work?
3. What does a `URLSessionTaskMetrics` breakdown tell you?

**Follow-up:** Why is DNS/connection setup often the largest cost on mobile? Cold DNS and TLS handshakes add round trips before any payload flows.
