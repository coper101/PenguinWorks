---
title: SwiftUI
summary: How SwiftUI really works — identity, state ownership, layout, navigation, animation and the performance model behind its surprising behaviour.
difficulty: Beginner → Advanced
tags: swiftui, ui, apple
---

SwiftUI is a declarative, value-based UI framework. Views are lightweight descriptions of a hierarchy, not objects that own a screen. The framework diffs those descriptions against the previous ones and applies the minimal changes. Almost every "why does SwiftUI do that?" moment comes back to two ideas: **identity** and **state ownership**.

This section builds the model from the ground up. Start with **View Lifecycle and Identity** and **State Management**, because they explain the rest. Then move to layout, navigation and performance. `@Observable`, `NavigationStack`, `Layout` and the new observation macros are covered as first-class modern APIs rather than legacy alternatives.

Each article is written against SwiftUI on iOS 17/18 and Swift 5.9/6, and notes where an API's availability matters.
