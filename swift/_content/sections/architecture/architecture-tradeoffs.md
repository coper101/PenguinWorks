---
title: Architecture Trade-offs
difficulty: Advanced
tags: architecture, tradeoffs, decision-making
summary: Every architectural choice buys something and costs something; learn to reason about the exchange.
prerequisites: architecture/mvc-mvvm-mvp-viper-clean, architecture/modular-architecture
related: architecture/modular-architecture, architecture/mvc-mvvm-mvp-viper-clean, architecture/real-world-project-structures
version: General
lastReviewed: 2026-09-30
readingTime: 11
---

## Overview

There is no universally correct architecture. Each decision optimises for some qualities at the expense of others. Senior engineers articulate the trade-off explicitly rather than asserting a pattern is "best".

## The recurring axes

| Decision | Buys | Costs |
| --- | --- | --- |
| More abstraction layers | Flexibility, testability | Indirection, navigation cost |
| Stricter modules | Boundaries, build speed | Ceremony, cross-module friction |
| Reactive vs. pull | Decoupling of producers | Debuggability, backpressure complexity |
| Code generation | Less boilerplate | Tooling, hidden behaviour |
| Fewer dependencies | Control, security | Reinventing |
| Global singletons | Convenience | Testability, hidden state |

## Questions to ask

1. **What is likely to change?** Optimise for change, not for hypothetical reuse.
2. **Who maintains this?** A five-person team does not need six layers.
3. **What does the product need now?** Premature architecture is a cost with deferred payoff.
4. **What is the blast radius of a mistake?** High-risk domains justify more structure.
5. **Can we reverse it cheaply?** Prefer reversible decisions early.

## The cost of indirection

Every protocol, adapter and layer adds a place to look. Abstraction pays off when there is a second implementation, a test double, or a real boundary. Without one of those, it is overhead.

## The cost of no structure

The opposite failure is a single massive type with hidden dependencies, impossible to test or change safely. The goal is the minimum structure that keeps change cheap.

## Examples

- **Protocol for one implementation:** only worth it if a test double or a future implementation is real.
- **Feature module:** worth it when a team owns the feature or builds are too slow.
- **Actor for a cache:** worth it when the cache is genuinely shared and mutated concurrently.

## Real-world use cases

- Choosing MVVM over VIPER for a small app.
- Deferring modularisation until build times hurt.
- Replacing a heavy reactive stack with async/await for debugability.

## Common pitfalls

- Resume-driven or blog-driven architecture.
- Applying a pattern because it is fashionable.
- Never revisiting a decision when conditions change.

## Best practices

- Write down the decision and its rationale (an ADR).
- Optimise for the known next change, not all possible changes.
- Prefer reversible choices; add structure when a real need appears.
- Re-evaluate periodically.

## Interview questions

1. Walk through a trade-off you made and the alternative you rejected.
2. When is an abstraction layer not worth it?
3. How do you decide to modularise?

**Follow-up:** How do you document an architectural decision so a future team understands it? An Architecture Decision Record (ADR) capturing context, decision and consequences.
