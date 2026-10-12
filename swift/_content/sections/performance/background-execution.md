---
title: Background Execution
difficulty: Advanced
tags: performance, background, bgtaskscheduler, lifecycle
summary: Do background work the way the system intends, with background tasks, URLSession and correct lifecycle handling.
prerequisites: performance/battery-energy
related: performance/battery-energy, performance/app-startup-optimization, recipes/background-tasks
version: iOS 17+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

iOS aggressively manages background execution to protect battery. There is no general-purpose "keep running" capability. Instead you use the right tool for the job: background `URLSession` for transfers, `BGTaskScheduler` for deferred maintenance, background modes for specific activities (audio, location, VoIP), and push for server-driven updates.

## Choosing the mechanism

| Need | Use |
| --- | --- |
| Finish a download/upload | Background `URLSession` |
| Periodic refresh | `BGAppRefreshTask` |
| Longer maintenance | `BGProcessingTask` |
| Audio playback | Audio background mode |
| Location updates | Location background mode |
| Remote change | Silent push / push notification |

## BGTaskScheduler

```swift
BGTaskScheduler.shared.register(
    forTaskWithIdentifier: "com.app.refresh",
    using: nil
) { task in
    handleAppRefresh(task as! BGAppRefreshTask)
}

func scheduleRefresh() {
    let request = BGAppRefreshTaskRequest(identifier: "com.app.refresh")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60)
    try? BGTaskScheduler.shared.submit(request)
}

func handleAppRefresh(_ task: BGAppRefreshTask) {
    scheduleRefresh()   // schedule the next one
    let work = Task {
        await refreshContent()
        task.setTaskCompleted(success: true)
    }
    task.expirationHandler = { work.cancel() }
}
```

The system decides when to run these, based on usage and battery. Always reschedule, and honour the expiration handler.

## Background URLSession

```swift
let config = URLSessionConfiguration.background(withIdentifier: "com.app.transfer")
config.isDiscretionary = true
let session = URLSession(configuration: config, delegate: self, delegateQueue: nil)
```

Transfers continue when the app is suspended and wake it on completion via the delegate. On iOS, the system relaunches the app for the completion event.

## Lifecycle

- `sceneWillResignActive` / `sceneDidEnterBackground` — pause work, snapshot UI.
- `sceneWillEnterForeground` — refresh stale data.
- Do not assume a specific amount of background time; it can be seconds.

## Real-world use cases

- Uploading a large video while the user switches apps.
- Refreshing a feed periodically.
- Downloading offline maps during a processing task.

## Common pitfalls

- Using a timer to "keep running" — it will be suspended.
- Not rescheduling a `BGTask`.
- Ignoring `expirationHandler`, causing a crash on timeout.
- Assuming background tasks run immediately.

## Best practices

- Use the mechanism that matches the job.
- Always reschedule and handle expiration.
- Make background work idempotent and cancellable.
- Test with the Xcode background-task debugger.

## Interview questions

1. How do you run a periodic refresh in the background?
2. What can a background `URLSession` do that a regular one cannot?
3. Why can you not rely on getting much background time?

**Follow-up:** How do you debug a `BGTask` that never fires? Use the Xcode debugger's "Simulate Background Fetch" / task submission and check identifiers in Info.plist.
