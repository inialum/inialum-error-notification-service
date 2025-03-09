# @inialum/error-notification-service-javascript-sdk

JavaScript client SDK for inialum-error-notification-service.

[![npm version](https://img.shields.io/npm/v/%40inialum%2Ferror-notification-service-javascript-sdk?style=flat&label=npm%20version&color=36B011&cacheSeconds=3600)](https://www.npmjs.com/package/@inialum/error-notification-service-javascript-sdk)

## Installation

```shell
pnpm add @inialum/error-notification-service-javascript-sdk
```

## Usage

```ts
import { notifyError } from '@inialum/error-notification-service-javascript-sdk'

try {
  throw new Error('Some error occurred')
} catch (error) {
  if (error instanceof Error) {
    await notifyError(error, {
      token: 'your-token',
      serviceName: 'your-service-name',
      environment: 'production',
      // Optional parameters
      title: 'Custom Error Title',
      description: 'Custom error description',
      enabled: process.env.NODE_ENV === 'production',
      ignoreErrors: ['TypeError', 'ReferenceError'],
      beforeSend: (error, payload) => {
        // Modify payload before sending
        payload.title = `[App] ${payload.title}`
        return payload
      },
    })
  }
}
```

## Options

| Option         | Type     | Required | Description                                                                   |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------- |
| `token`        | string   | Yes      | Authentication token for the error notification service                       |
| `serviceName`  | string   | Yes      | Name of the service reporting the error                                       |
| `environment`  | string   | Yes      | Environment where the error occurred (e.g., 'local', 'staging', 'production') |
| `title`        | string   | No       | Custom title for the error notification (default: error.name)              |
| `description`  | string   | No       | Custom description for the error notification (default: error.message)     |
| `enabled`      | boolean  | No       | Whether error notifications are enabled (default: true)                       |
| `ignoreErrors` | string[] | No       | List of error names to ignore                                                 |
| `beforeSend`   | function | No       | Function to modify error data before sending or cancel sending                |

## Advanced Features

### beforeSend Function

The `beforeSend` function allows you to:

- Modify error data before it's sent to the notification service
- Prevent sending certain errors by returning `null` or `false`

```ts
beforeSend: (error: Error, payload: ErrorNotificationPayload) => {
  // Access the error object
  if (error.stack?.includes('node_modules')) {
    // Don't send errors from dependencies
    return null
  }

  // Add additional context to the error
  payload.description = `${payload.description}\n\nUser ID: ${getUserId()}`
  payload.title = `[${getAppName()}] ${payload.title}`

  // Return the modified payload to send it
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
