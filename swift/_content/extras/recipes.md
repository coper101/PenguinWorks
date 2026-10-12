---
title: Code Recipes
summary: Copy-ready solutions for the tasks every iOS app needs — networking, persistence, pagination, authentication, caching and more.
---

These recipes are the tasks you implement in almost every app. Each one is production-shaped: it shows the idiomatic modern API, the edge cases that bite, and the surrounding structure. They complement the deeper explanations in the documentation sections — use the recipes when you need the shape of a solution quickly.

All examples assume Swift 5.9+ and iOS 17 unless noted.

## Networking with URLSession

Use `URLSession`'s async APIs and decode with `Codable`. Keep a single shared session so connections are reused.

```swift
struct APIClient {
    let session: URLSession
    let baseURL: URL
    let decoder = JSONDecoder()

    func get<T: Decodable>(_ path: String) async throws -> T {
        var request = URLRequest(url: baseURL.appending(path: path))
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw APIError.badStatus((response as? HTTPURLResponse)?.statusCode ?? -1)
        }
        return try decoder.decode(T.self, from: data)
    }
}

enum APIError: Error { case badStatus(Int) }
```

**Pitfalls:** Creating a session per request; forgetting to check the status code; decoding on the main actor.

## Codable and JSON parsing

Map snake_case, dates and optionals explicitly.

```swift
struct User: Decodable {
    let id: UUID
    let displayName: String
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case displayName = "display_name"
        case createdAt = "created_at"
    }
}

let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase
decoder.dateDecodingStrategy = .iso8601
```

For resilient decoding of one bad field, decode `Lossy` arrays or provide a default in a custom `init(from:)`.

## Authentication

Store tokens in the Keychain, refresh transparently, and never log secrets.

```swift
actor TokenStore {
    private var access: String?
    private var refresh: String?

    func current() -> String? { access }
    func update(access: String, refresh: String) { self.access = access; self.refresh = refresh }
}
```

```swift
func authorizedRequest(_ request: URLRequest) async throws -> (Data, URLResponse) {
    var request = request
    if let token = await tokens.current() {
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }
    let (data, response) = try await session.data(for: request)
    if (response as? HTTPURLResponse)?.statusCode == 401 {
        try await refreshToken()
        return try await authorizedRequest(request)   // retry once
    }
    return (data, response)
}
```

**Pitfalls:** Storing tokens in `UserDefaults`; retrying in an infinite loop; racing refreshes (serialise them in an actor).

## Persistence

For simple keyed data use `UserDefaults`; for small structured data use a file with `Codable`; for a full object graph use SwiftData or Core Data.

```swift
struct FileStore<T: Codable> {
    let url: URL
    func save(_ value: T) throws {
        let data = try JSONEncoder().encode(value)
        try data.write(to: url, options: .atomic)
    }
    func load() throws -> T? {
        guard FileManager.default.fileExists(atPath: url.path) else { return nil }
        return try JSONDecoder().decode(T.self, from: Data(contentsOf: url))
    }
}
```

## SwiftData

Model classes with `@Model`; query in views with `@Query`.

```swift
@Model
final class Task {
    var title: String
    var isDone: Bool
    var createdAt: Date

    init(title: String, isDone: Bool = false, createdAt: Date = .now) {
        self.title = title
        self.isDone = isDone
        self.createdAt = createdAt
    }
}

struct TaskListView: View {
    @Environment(\.modelContext) private var context
    @Query(sort: \Task.createdAt, order: .reverse) private var tasks: [Task]

    var body: some View {
        List(tasks) { task in Text(task.title) }
    }
}
```

Configure the container at the app root with `.modelContainer(for: Task.self)`.

## File management

Work inside the appropriate directory and handle errors.

```swift
let documents = try FileManager.default.url(
    for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true
)
let fileURL = documents.appendingPathComponent("export.json")
try data.write(to: fileURL, options: [.atomic, .completeFileProtection])
```

Use `.cachesDirectory` for regenerable data, and exclude large caches from backup.

## Image caching

Downsample and cache decoded images.

```swift
final class ImageCache {
    private let cache = NSCache<NSString, UIImage>()
    func image(for url: URL, size: CGSize) -> UIImage? { cache.object(forKey: key(url, size)) }
    func insert(_ image: UIImage, for url: URL, size: CGSize) { cache.setObject(image, forKey: key(url, size)) }
    private func key(_ url: URL, _ size: CGSize) -> NSString { "\(url.absoluteString)-\(Int(size.width))" as NSString }
}
```

See [Image Decoding and Caching](/swift/performance/image-decoding-caching/) for downsampling.

## Pagination

Keep a cursor or page index and stop when the server says there is no more.

```swift
@Observable
final class Feed {
    private(set) var items: [Item] = []
    private var page = 0
    private(set) var isFinished = false

    func loadNext() async throws {
        guard !isFinished else { return }
        let page = try await api.items(page: page)
        items += page.items
        isFinished = page.next == nil
        self.page += 1
    }
}
```

Trigger `loadNext()` from the last row's `.task` or `.onAppear`.

## Search and filtering

Debounce input and filter on a derived value, not by rebuilding the model.

```swift
@State private var query = ""
@State private var results: [Item] = []

.task(id: query) {
    try? await Task.sleep(for: .milliseconds(250))
    guard !Task.isCancelled else { return }
    results = try await search(query)
}
```

`.task(id:)` cancels the previous search when the query changes.

## Push notifications

Request authorisation, register, and handle the token.

```swift
let center = UNUserNotificationCenter.current()
let granted = try await center.requestAuthorization(options: [.alert, .badge, .sound])
if granted { await UIApplication.shared.registerForRemoteNotifications() }

func application(_ app: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let token = deviceToken.map { String(format: "%02x", $0) }.joined()
    Task { await api.register(deviceToken: token) }
}
```

Handle taps through `UNUserNotificationCenterDelegate` and route into the app.

## Deep linking

Parse a URL into a typed route and drive navigation.

```swift
enum Route: Hashable { case detail(Item.ID); case settings }

func route(from url: URL) -> Route? {
    guard url.scheme == "myapp" else { return nil }
    switch url.host {
    case "detail": return .detail(UUID(uuidString: url.lastPathComponent) ?? UUID())
    case "settings": return .settings
    default: return nil
    }
}
```

Then `path.append(route)` on the router.

## Background tasks

Schedule deferred maintenance with `BGTaskScheduler`; finish transfers with a background `URLSession`.

```swift
let request = BGProcessingTaskRequest(identifier: "com.app.maintenance")
request.requiresNetworkConnectivity = true
request.requiresExternalPower = true
try BGTaskScheduler.shared.submit(request)
```

Always reschedule and honour the expiration handler.

## App Store subscriptions

Load products, purchase with StoreKit 2, and verify transactions.

```swift
for await result in Transaction.updates {
    if case .verified(let transaction) = result {
        await grant(transaction.productID)
        await transaction.finish()
    }
}

let products = try await Product.products(for: ["pro.monthly"])
if let product = products.first {
    let result = try await product.purchase()
    if case .success(.verified(let transaction)) = result {
        await transaction.finish()
    }
}
```

Always verify signatures; never trust the client for entitlements.

## Testing and mocking

Inject protocols and use fakes.

```swift
protocol UserRepository { func current() async throws -> User }

struct FakeUserRepository: UserRepository {
    var user: User
    func current() async throws -> User { user }
}

@Test func loadsUser() async throws {
    let model = ProfileModel(repository: FakeUserRepository(user: .fixture))
    await model.load()
    #expect(model.user?.name == "Ada")
}
```

## Error handling patterns

Type your errors, map them at the UI boundary, and never swallow them silently.

```swift
enum AppError: LocalizedError {
    case offline
    case server(Int)

    var errorDescription: String? {
        switch self {
        case .offline: return "You appear to be offline."
        case .server(let code): return "Server error (\(code))."
        }
    }
}
```

Show `error.errorDescription` to the user and log the full error with OSLog.
