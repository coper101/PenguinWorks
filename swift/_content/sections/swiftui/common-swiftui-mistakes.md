---
title: Common SwiftUI Mistakes
difficulty: Intermediate
tags: swiftui, mistakes, debugging, anti-patterns
summary: The recurring SwiftUI mistakes that cause state loss, broken animations and performance problems — and their fixes.
prerequisites: swiftui/state-management, swiftui/view-lifecycle-identity
related: swiftui/view-performance-invalidation, swiftui/lists-grids-lazy-containers, swiftui/common-swiftui-mistakes
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

Most SwiftUI bugs come from a small set of repeated mistakes. Recognising the pattern makes them quick to fix.

## 1. Unstable identity in lists

Using indices as `ForEach` ids makes insertions and deletions scramble state and animations.

```swift
ForEach(items.indices, id: \.self) { i in Row(items[i]) }   // avoid
ForEach(items) { item in Row(item) }                        // prefer
```

## 2. Creating models in `body`

```swift
var body: some View {
    let vm = ViewModel()   // recreated every pass, loses state
    return Content(vm: vm)
}
```

Own the model with `@State` instead.

## 3. Mutating state during view update

Setting `@State` inside `body` or during a computed-property read triggers "Modifying state during view update" warnings and can loop. Move side effects to `.task`, `.onChange` or actions.

## 4. `GeometryReader` everywhere

It greedily expands and collapses inside scroll views. Prefer `frame`, `containerRelativeFrame` and `ViewThatFits`.

## 5. Putting a `List` in a `ScrollView`

Double scroll views break sizing and lazy loading. Choose one container.

## 6. Animating the wrong value

`.animation(_:)` without `value:` animates everything. Animate the source state explicitly.

## 7. Force-unwrapping optionals in `body`

A crash in `body` is a crash on screen. Guard earlier and render a placeholder.

## 8. Overusing `@ObservedObject` for ownership

Using `@ObservedObject` where `@StateObject`/`@State` is needed recreates the object and loses data.

## 9. Heavy work in row bodies

Sorting or formatting inside `ForEach` content runs on every scroll tick. Precompute and pass values in.

## 10. Ignoring accessibility

Icon-only buttons, colour-only state and fixed fonts exclude users. Add labels, traits and semantic styles.

## Real-world use cases

These appear in code review constantly. Learning to spot them is a review skill, not just a coding one.

## Best practices

- Stable ids, owned state, cheap bodies.
- One scrolling container per screen.
- Side effects in lifecycle modifiers, never in `body`.
- Add accessibility as you build, not later.

## Interview questions

1. Why does using indices as ids break list animations?
2. What does "modifying state during view update" mean and how do you fix it?
3. Why is creating a view model in `body` a bug?

**Follow-up:** How would you detect excessive `body` calls? Use the SwiftUI instrument or add a temporary `print` counter in `body`.
