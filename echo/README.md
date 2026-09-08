# Echo public web

Echo is implemented as static HTML, CSS, and JavaScript inside the existing
PenguinWorks website. It does not load React Native, Firebase, or authentication
code.

## Public data boundary

`config.js` is the only website-to-API configuration boundary. During local
development it points to the two HTTP functions in `echo-dev-4557a`; on any
non-local hostname the endpoints intentionally remain unset until production
values are approved. Store destinations become links only when verified HTTPS
URLs are configured; otherwise the App Store and Google Play labels are inert.

The visual layer recreates the mobile app rather than importing React Native.
It uses the mobile palette and spacing, the bundled JetBrains Mono font, the
exact configured `ios-light.png` app icon, and the particle/comet parameters
from `SpaceBackground.tsx` and `spaceField.ts`.

The browser accepts only this exact record shape:

```text
id, publicBeaconId, echoText, createdAt, pulseCount
```

The public functions query only `isInVoid == true` and
`moderationStatus == "ok"`. They project responses field-by-field and never
return the original transmission, owner UID, mobile Beacon ID, or archive
metadata. Firestore remains private to clients; the public functions use Admin
access on the server.

The feed is publicly cacheable for 30 seconds, so an uncast Echo can remain in
a cached feed during that window. Single-Echo lookup is `no-store` and becomes
unavailable immediately after the underlying Echo is removed from The Void.

## Routes

- `/echo/`
- `/echo/void/`
- `/echo/e/?id=<publicEchoId>`
