---
"@inialum/error-notification-service-javascript-sdk": patch
"@inialum/error-notification-service-hono-middleware": patch
---

Include generated `dist/*.js.map` files in the published npm package so Vite/Vitest no longer fail with ENOENT when resolving `sourceMappingURL`
