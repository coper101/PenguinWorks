---
title: Network Debugging
difficulty: Intermediate
tags: debugging, networking, charles, proxyman, urlsession
summary: Inspect requests and responses, reproduce failures and diagnose TLS, caching and connectivity issues.
prerequisites: performance/networking-performance
related: performance/networking-performance, debugging/oslog, recipes/networking-urlsession
version: Xcode 16+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Network bugs are hard to see because they happen off-device. The tools are a proxy (Charles, Proxyman, mitmproxy), Instruments' Network template, and `URLSessionTaskMetrics` for timing.

## Inspecting traffic

1. Install a proxy (Proxyman/Charles) and trust its certificate on the simulator/device.
2. Configure the device's HTTP proxy (or use the simulator's automatic proxy).
3. Inspect request/response headers, bodies, status codes and TLS.
4. Use breakpoints to modify requests/responses and reproduce edge cases.

ATS notes: proxying requires trusting the proxy's root CA and may need an ATS exception in debug only. Never ship such exceptions.

## Timing with task metrics

```swift
func urlSession(_ session: URLSession, task: URLSessionTask,
                didFinishCollecting metrics: URLSessionTaskMetrics) {
    for t in metrics.transactionMetrics {
        print("DNS", t.domainLookupEndDate!.timeIntervalSince(t.domainLookupStartDate!))
        print("Connect", t.connectEndDate!.timeIntervalSince(t.connectStartDate!))
        print("TTFB", t.responseStartDate!.timeIntervalSince(t.requestStartDate!))
    }
}
```

This pinpoints whether latency is DNS, connection, TLS or server time.

## Common problems

- **Caching surprises** — a stale response served from `URLCache`. Check `Cache-Control`, `ETag` and the request cache policy.
- **TLS failures** — certificate pinning, expired certs, ATS. Read the `URLError` code.
- **Connectivity** — `waitsForConnectivity`, cellular vs. wifi, captive portals.
- **Timeouts** — default 60 s; tune `timeoutIntervalForRequest`/`ForResource`.
- **Payload issues** — encoding, content type, gzip.

## Error mapping

```swift
catch let error as URLError {
    switch error.code {
    case .notConnectedToInternet: showOffline()
    case .timedOut: showRetry()
    case .cancelled: break
    default: showGeneric(error)
    }
}
```

## Real-world use cases

- A request works in the simulator but fails on device (proxy/ATS).
- A cached response hides a backend change.
- High latency isolated to TLS handshake.

## Common pitfalls

- Shipping ATS exceptions added for debugging.
- Trusting a proxy without installing its certificate, producing TLS errors.
- Ignoring `URLError` codes and showing a generic message.
- Assuming `URLCache` is disabled when it is doing the caching.

## Best practices

- Use a proxy plus task metrics together.
- Map `URLError` codes to user actions.
- Keep ATS exceptions debug-only.
- Log structured request metadata with OSLog.

## Interview questions

1. How do you break down network latency into phases?
2. Why might a request succeed in the simulator but fail on device?
3. How do you diagnose a caching problem?

**Follow-up:** Where do you find ATS failures? The `URLError` domain and the OSLog network subsystem, plus the proxy's TLS view.
