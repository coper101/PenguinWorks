---
title: UIKit Interoperability
difficulty: Advanced
tags: swiftui, uikit, interoperability, representable
summary: Wrap UIKit views and controllers in SwiftUI, host SwiftUI in UIKit, and share state across the boundary.
prerequisites: swiftui/state-management, swiftui/view-lifecycle-identity
related: swiftui/lists-grids-lazy-containers, swiftui/modern-swiftui-patterns, swiftui/view-performance-invalidation
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

SwiftUI and UIKit interoperate in both directions. SwiftUI wraps UIKit with `UIViewRepresentable` and `UIViewControllerRepresentable`; UIKit hosts SwiftUI with `UIHostingController` and `UIHostingConfiguration` for collection/table cells. Bridging correctly means understanding that UIKit objects are reference types with their own lifecycle.

## `UIViewRepresentable`

```swift
struct MapView: UIViewRepresentable {
    @Binding var region: MKCoordinateRegion

    func makeUIView(context: Context) -> MKMapView {
        let map = MKMapView()
        map.delegate = context.coordinator
        return map
    }

    func updateUIView(_ map: MKMapView, context: Context) {
        if map.region != region { map.setRegion(region, animated: true) }
    }

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    final class Coordinator: NSObject, MKMapViewDelegate {
        var parent: MapView
        init(_ parent: MapView) { self.parent = parent }
        func mapView(_ mapView: MKMapView, regionDidChangeAnimated: Bool) {
            parent.region = mapView.region
        }
    }
}
```

- `makeUIView` runs once per identity.
- `updateUIView` runs on every SwiftUI update; keep it cheap and idempotent.
- A `Coordinator` bridges delegates back into SwiftUI.

## `UIViewControllerRepresentable`

Same shape for controllers. Use it for `PHPickerViewController`, `UIDocumentPickerViewController`, `SFSafariViewController` and similar.

## Hosting SwiftUI in UIKit

```swift
let host = UIHostingController(rootView: ProfileView(user: user))
addChild(host)
view.addSubview(host.view)
host.didMove(toParent: self)
```

For collection view cells, `UIHostingConfiguration` embeds SwiftUI directly and participates in self-sizing.

## Sharing state

Pass SwiftUI state into representables through a `Coordinator` or bindings. Do not capture a `@State` value by value and expect it to update — capture the binding or the model reference.

## Real-world use cases

- Embedding `MKMapView`, `WKWebView`, `AVPlayerLayer` or a camera preview.
- Using `PHPicker` for photo selection.
- Hosting SwiftUI screens inside an existing UIKit app during migration.
- Incrementally migrating a storyboard app.

## Common pitfalls

- Doing expensive work in `updateUIView` (it runs very often).
- Recreating the UIKit view because identity changed or `makeUIView` was misused.
- Retain cycles between the coordinator and the parent.
- Assuming `@State` changes reach the representable without a binding.

## Best practices

- Keep `updateUIView` minimal and guarded.
- Use a `Coordinator` for delegate callbacks.
- Migrate screen-by-screen with `UIHostingController`.
- Avoid representables where a native SwiftUI API now exists.

## Interview questions

1. What is the difference between `makeUIView` and `updateUIView`?
2. Why is a `Coordinator` needed?
3. How do you host SwiftUI inside a UIKit collection view cell in iOS 16+?

**Follow-up:** Why must `updateUIView` be idempotent? It is called on every SwiftUI update, so repeated application must not corrupt state.
