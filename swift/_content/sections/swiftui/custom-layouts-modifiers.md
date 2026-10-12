---
title: Custom Layouts and Modifiers
difficulty: Advanced
tags: swiftui, layout-protocol, viewmodifier, style
summary: Build reusable layout containers with the Layout protocol and reusable behaviour with ViewModifier and ButtonStyle.
prerequisites: swiftui/layout-system-geometryreader
related: swiftui/layout-system-geometryreader, swiftui/modern-swiftui-patterns, swiftui/accessibility
version: iOS 16+, Swift 5.9+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Not every design fits `HStack`/`VStack`/`ZStack`. Since iOS 16, the `Layout` protocol lets you define a container that arranges its subviews with full control over sizing and placement. Separately, `ViewModifier` and style protocols package reusable visual and behavioural changes.

## The Layout protocol

A `Layout` implements two methods: `sizeThatFits` to compute the container size, and `placeSubviews` to position children.

```swift
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0, y: CGFloat = 0, rowHeight: CGFloat = 0
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                x = 0; y += rowHeight + spacing; rowHeight = 0
            }
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
        return CGSize(width: maxWidth, height: y + rowHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let maxWidth = bounds.width
        var x = bounds.minX, y = bounds.minY, rowHeight: CGFloat = 0
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX, x > bounds.minX {
                x = bounds.minX; y += rowHeight + spacing; rowHeight = 0
            }
            subview.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}
```

Use it as `FlowLayout { … }`. The container participates in the normal two-pass layout and composes with `frame`.

## ViewModifier

A modifier packages a reusable change:

```swift
struct Card: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(.separator))
    }
}

extension View {
    func card() -> some View { modifier(Card()) }
}
```

## Styles

`ButtonStyle`, `LabelStyle`, `ToggleStyle` and friends define appearance for a control:

```swift
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 16).padding(.vertical, 10)
            .background(Color.accentColor.opacity(configuration.isPressed ? 0.7 : 1))
            .foregroundStyle(.white)
            .clipShape(Capsule())
    }
}
```

## Real-world use cases

- Tag clouds and chip rows with `FlowLayout`.
- A design-system `card()` modifier.
- App-wide button styling via a `ButtonStyle`.

## Common pitfalls

- Using nested `GeometryReader`s to approximate a flow layout.
- Forgetting that `Layout` children need `sizeThatFits` and `place` called consistently.
- Modifier performance: heavy modifiers in `body` recompute often; extract them.

## Best practices

- Reach for `Layout` before GeometryReader for custom arrangement.
- Keep modifiers small and composable.
- Use `LayoutValueKey` to pass per-child parameters.

## Interview questions

1. What two methods must a `Layout` implement?
2. How does `ViewModifier` differ from a view extension that returns a modified view?
3. How do you pass a per-subview value into a custom `Layout`?

**Follow-up:** How does a custom `Layout` receive a per-child value such as a weight? Through a `LayoutValueKey` set with `.layoutValue(key:value:)`.
