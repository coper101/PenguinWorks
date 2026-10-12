---
title: Widgets and App Intents
difficulty: Advanced
tags: swiftui, widgets, widgetkit, app-intents
summary: Build home and lock screen widgets and expose app actions through App Intents and Siri.
prerequisites: swiftui/view-lifecycle-identity, swiftui/state-management
related: swiftui/lists-grids-lazy-containers, performance/battery-energy, recipes/deep-linking
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

WidgetKit renders widget families (small, medium, large, accessory) from **timelines** of entries. Widgets are not mini apps: they cannot run arbitrary long work or hold interactive state, and their views are a restricted SwiftUI subset.

## Timeline provider

```swift
struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> Entry { Entry(date: .now, count: 0) }
    func getSnapshot(in context: Context, completion: @escaping (Entry) -> Void) {
        completion(Entry(date: .now, count: 3))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        let entry = Entry(date: .now, count: 3)
        let next = Date.now.addingTimeInterval(60 * 30)
        completion(Timeline(entries: [entry], policy: .after(next)))
    }
}
```

Use `AppIntentTimelineProvider` (iOS 17+) for configurable widgets whose options are `AppIntent` types.

## Interactive widgets

Since iOS 17, `Button` and `Toggle` inside a widget can run an `AppIntent` without opening the app. The intent performs a small, fast mutation and WidgetKit refreshes the timeline.

```swift
struct ToggleDoneIntent: AppIntent {
    static var title: LocalizedStringResource = "Toggle Done"
    @Parameter(title: "Task") var taskID: String

    func perform() async throws -> some IntentResult {
        try await TaskStore.shared.toggle(taskID)
        return .result()
    }
}
```

App Intents also power Siri, Shortcuts and Spotlight actions. They are discoverable via `AppShortcutsProvider`.

## Deep linking from a widget

A widget can open a URL with `.widgetURL(_:)` (single tap target) or wrap parts in `Link(destination:)`. The app handles the URL to route to the right screen — see [Deep Linking](/swift/recipes/#deep-linking).

## Real-world use cases

- A data-usage widget refreshed every 30 minutes.
- A lock-screen accessory widget showing the next event.
- A "mark complete" checkbox that runs without launching the app.
- A Siri shortcut backed by the same `AppIntent`.

## Common pitfalls

- Doing network work longer than the timeline budget; widgets reload in the background and can be killed.
- Assuming widgets update exactly on schedule — the system coalesces refreshes.
- Storing widget state in the timeline instead of shared storage (`App Group` + `UserDefaults`/SwiftData).

## Best practices

- Keep timelines small and refresh policies realistic.
- Share data through an App Group container.
- Prefer `AppIntent` for interactivity and configuration.
- Support multiple families and the accessory families.

## Interview questions

1. Why can a widget not run a long-running task?
2. How do interactive widgets run code without launching the app?
3. How does a widget communicate a tap back to the app?

**Follow-up:** Where should a widget and its app share data? In an App Group container via shared `UserDefaults` or a shared datastore.
