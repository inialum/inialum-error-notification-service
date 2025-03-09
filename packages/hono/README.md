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

app.use(
  '*',
  notifyError({
    token: 'dummy',
    serviceName: 'service-name',
    environment: 'production',
    enabled: true, // Optional
    ignoreErrors: ['ValidationError', 'NotFoundError'], // Optional
    beforeSend: (error, payload) => {
      // Modify the error payload or cancel sending
      if (error.message.includes('sensitive')) {
        // Don't send errors with sensitive information
        return null
      }

      // Add request information to the description
      payload.description = `${payload.description} (Request ID: req-123)`
      return payload
    },
  }),
)

app.get('/', (c) => c.text('foo'))

export default app
```

You can refer to the [example project](/examples/hono-middleware) for more details.

## Options

| Option         | Type     | Required | Description                                                                   |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------- |
| `token`        | string   | Yes      | Authentication token for the error notification service                       |
| `serviceName`  | string   | Yes      | Name of the service reporting the error                                       |
| `environment`  | string   | Yes      | Environment where the error occurred (e.g., 'local', 'staging', 'production') |
| `enabled`      | boolean  | No       | Whether error notifications are enabled (default: true)                       |
| `ignoreErrors` | string[] | No       | List of error names to ignore                                                 |
| `beforeSend`   | function | No       | Function to modify error data before sending or cancel sending                |

### beforeSend Function

The `beforeSend` function allows you to:

- Modify error data before it's sent to the notification service
- Prevent sending certain errors by returning `null` or `false`

```ts
beforeSend: (error: Error, payload: ErrorNotificationPayload) => {
  // Modify payload properties
  payload.title = `[App] ${payload.title}`

  // Add context to description
  payload.description = `${payload.description}\nUser: ${currentUser}`

  // Return modified payload to send it
  return payload

  // Or return null/false to cancel sending
  // return null;
}
```

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
