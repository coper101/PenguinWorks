---
title: Animations and Transitions
difficulty: Intermediate
tags: swiftui, animation, transition, matchedgeometryeffect
summary: Animate state changes implicitly or explicitly, and control insertion and removal with transitions.
prerequisites: swiftui/state-management, swiftui/view-lifecycle-identity
related: swiftui/view-performance-invalidation, swiftui/custom-layouts-modifiers, swiftui/modern-swiftui-patterns
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 9
---

## Overview

SwiftUI animates when a value that affects layout or rendering changes while an animation is active. There are two entry points: the **implicit** `.animation(_:value:)` modifier and the **explicit** `withAnimation { … }` function. Prefer explicit animations; they are scoped to the state change rather than the view.

## Implicit vs explicit

```swift
// Explicit: scope the animation to this change
Button("Resize") {
    withAnimation(.spring(duration: 0.4)) { isExpanded.toggle() }
}

// Implicit: tied to a value change on the view
Circle()
    .scaleEffect(isExpanded ? 1.4 : 1.0)
    .animation(.easeInOut, value: isExpanded)
```

The old `.animation(_:)` without a `value:` is deprecated because it animates every change, causing surprising and expensive animations.

## Transitions

A transition describes insertion and removal. It only applies when the view's **identity** changes (for example, inside an `if`).

```swift
if showBanner {
    Banner()
        .transition(.move(edge: .top).combined(with: .opacity))
}
```

Give a transition an animation with `.animation(_:value:)` on the container or with `withAnimation`.

## `matchedGeometryEffect`

Coordinate a view's geometry between two states so it appears to move seamlessly:

```swift
@Namespace private var ns

if expanded {
    Card().matchedGeometryEffect(id: "card", in: ns)
} else {
    Thumbnail().matchedGeometryEffect(id: "card", in: ns)
}
```

Both branches must share the namespace and the same id.

## Phased and repeatForever animations

- `.repeatForever(autoreverses:)` for continuous motion.
- `PhaseAnimator` (iOS 17+) for multi-step sequences.
- `KeyframeAnimator` for precise, timeline-based motion.

## Real-world use cases

- Hero image expansion using `matchedGeometryEffect`.
- List row insertion with `.transition(.slide)`.
- Loading shimmer with `PhaseAnimator`.

## Common pitfalls

- Animating derived values instead of the source, so the animation never triggers.
- Using a transition without an identity change, so nothing animates.
- Animating layout-heavy changes that cause dropped frames.

## Best practices

- Animate state, not presentation values.
- Prefer explicit `withAnimation` for clarity.
- Keep the number of simultaneously animating views small.
- Respect Reduce Motion via `@Environment(\.accessibilityReduceMotion)`.

## Interview questions

1. What triggers a SwiftUI animation?
2. Why must a transition be paired with an identity change?
3. How does `matchedGeometryEffect` know which two views correspond?

**Follow-up:** How do you disable an animation for accessibility users? Check `accessibilityReduceMotion` and skip or shorten the animation.
