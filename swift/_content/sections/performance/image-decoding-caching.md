---
title: Image Decoding and Caching
difficulty: Advanced
tags: performance, images, caching, downsample
summary: Decode images off the main thread, downsample to display size, and cache decoded results.
prerequisites: performance/scrolling-performance
related: performance/scrolling-performance, performance/allocations, recipes/image-caching
version: iOS 17+
lastReviewed: 2026-09-30
readingTime: 10
---

## Overview

Images are the most common cause of memory spikes and scroll jank. The cost is not download — it is **decode** and **storage**. A 4000×3000 JPEG decodes to roughly 48 MB of uncompressed pixels; decoding that for a 100-point thumbnail is wasteful and fatal to smooth scrolling.

## Downsampling

Load and downsample in one step using ImageIO, on a background thread:

```swift
func downsample(data: Data, to pointSize: CGSize, scale: CGFloat) -> UIImage? {
    let options: [CFString: Any] = [
        kCGImageSourceShouldCache: false
    ]
    guard let source = CGImageSourceCreateWithData(data as CFData, options as CFDictionary) else { return nil }
    let maxDimension = max(pointSize.width, pointSize.height) * scale
    let downsampleOptions: [CFString: Any] = [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceShouldCacheImmediately: true,
        kCGImageSourceCreateThumbnailWithTransform: true,
        kCGImageSourceThumbnailMaxPixelSize: maxDimension
    ]
    guard let cgImage = CGImageSourceCreateThumbnailAtIndex(source, 0, downsampleOptions as CFDictionary) else { return nil }
    return UIImage(cgImage: cgImage)
}
```

Run this in a `nonisolated` context or a background task and apply the result on the main actor.

## Caching

- **Memory cache** (`NSCache`) for decoded images, keyed by URL + size.
- **Disk cache** for encoded data.
- **HTTP cache** via `URLCache` for the transport layer.

Use `NSCache` because it evicts under memory pressure automatically.

```swift
final class ImageCache {
    private let cache = NSCache<NSString, UIImage>()
    func image(for key: String) -> UIImage? { cache.object(forKey: key as NSString) }
    func insert(_ image: UIImage, for key: String) { cache.setObject(image, forKey: key as NSString) }
}
```

## AsyncImage and its limits

SwiftUI's `AsyncImage` is convenient but decodes at full size and offers little control. For performance-sensitive lists, use a custom loader with downsampling and caching.

## Real-world use cases

- Feed thumbnails at multiple sizes.
- A photo gallery with fast fling.
- Avatar loading with placeholders.

## Common pitfalls

- Decoding on the main thread.
- Caching full-resolution images when only thumbnails are shown.
- Letting `NSCache` grow unbounded by ignoring memory warnings (it handles them, but decoded data is expensive).
- Re-downloading because the cache key ignores size.

## Best practices

- Downsample to the display size × screen scale.
- Decode off the main thread; apply on the main actor.
- Cache decoded images in `NSCache`, keyed by URL and size.
- Prefetch ahead of visibility.

## Interview questions

1. Why is decoding, not downloading, the main image cost?
2. What is downsampling and how does ImageIO do it?
3. Why use `NSCache` over a dictionary?

**Follow-up:** Why does an image cache need the display size in the key? The same URL can be shown at different sizes, and each needs a differently downsampled bitmap.
