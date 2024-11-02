# @inialum/error-notification-service-hono-middleware

Hono middleware for inialum-error-notification-service.

[![npm version](https://img.shields.io/npm/v/%40inialum%2Ferror-notification-service-hono-middleware?style=flat&label=npm%20version&color=36B011&cacheSeconds=3600)](https://www.npmjs.com/package/@inialum/error-notification-service-hono-middleware)

## Installation

```shell
pnpm add @inialum/error-notification-service-hono-middleware
```

## Usage

```ts
import { Hono } from 'hono'
import { notifyError } from '@inialum/error-notification-service-hono-middleware'

const app = new Hono()

app.use('*', await notifyError({
 token: 'dummy',
 serviceName: 'service-name',
 environment: 'production'
}))

app.get('/', (c) => c.text('foo'))

export default app
```

You can refer to the [example project](../../examples/hono-middleware) for more details.

## Development

### Testing

```shell
pnpm run test
```

If you want to run test with coverage report, run this command instead

```shell
pnpm run test:coverage
```

## License

Licensed under [Apache License 2.0](LICENSE).
