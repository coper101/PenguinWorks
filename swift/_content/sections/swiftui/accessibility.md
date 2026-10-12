---
title: Accessibility
difficulty: Intermediate
tags: swiftui, accessibility, voiceover, dynamic-type
summary: Make SwiftUI apps usable with VoiceOver, Dynamic Type, Reduce Motion and other accessibility settings.
prerequisites: swiftui/view-lifecycle-identity
related: swiftui/lists-grids-lazy-containers, swiftui/custom-layouts-modifiers, swiftui/common-swiftui-mistakes
version: iOS 17+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 8
---

## Overview

SwiftUI exposes many accessible defaults, but custom controls, images and grouped information need explicit labels and traits. Accessibility is also a correctness check: a view tree that is hard to describe to a screen reader is often hard to maintain.

## Labels, values and hints

```swift
Button {
    remove(item)
} label: {
    Image(systemName: "trash")
}
.accessibilityLabel("Delete \(item.title)")
.accessibilityHint("Removes this item permanently")
```

Decorative images should be hidden:

```swift
Image("divider").accessibilityHidden(true)
```

## Grouping elements

Combine children into one element when they read as a unit:

```swift
HStack {
    Image(systemName: "star.fill")
    Text("4.8")
    Text("(120 ratings)")
}
.accessibilityElement(children: .combine)
```

Use `.ignore` to build a custom label from scratch.

## Dynamic Type

Use text styles, not fixed sizes, so text scales:

```swift
Text("Title").font(.title)
Text("Body").font(.body)
```

Avoid `.font(.system(size: 14))` for content. Test with large accessibility sizes and verify layouts with `@ScaledMetric`.

## Reduce Motion and transparency

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion
```

Skip or shorten animations when true. `.accessibilityDifferentiateWithoutColor` and `.accessibilityReduceTransparency` inform alternatives to colour-only signalling.

## Focus and actions

For custom gestures, add accessibility actions:

```swift
.accessibilityAction(named: "Archive") { archive() }
.accessibilityAddTraits(.isButton)
```

`@AccessibilityFocusState` moves VoiceOver focus, and `accessibilityRotor` groups related content.

## Real-world use cases

- Labelling icon-only buttons.
- Combining price and rating into one readable element.
- Supporting Dynamic Type without truncation.
- Providing accessibility actions for swipe-only gestures.

## Common pitfalls

- Colour as the only signal for error or state.
- Fixed font sizes that do not scale.
- Icons without labels.
- Custom gestures with no accessible equivalent.

## Best practices

- Test with VoiceOver and the Accessibility Inspector.
- Add labels to every interactive element.
- Use semantic text styles and `@ScaledMetric`.
- Respect Reduce Motion and Reduce Transparency.

## Interview questions

1. How do you make a custom control accessible?
2. What does `.accessibilityElement(children: .combine)` do?
3. How should you react to `accessibilityReduceMotion`?

**Follow-up:** How do you scale a fixed spacing value with Dynamic Type? Wrap it with `@ScaledMetric`.
