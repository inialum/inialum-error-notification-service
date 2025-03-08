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
    token: 'dummy',
    title: 'SomeError', // optional
    description: 'The error description', // optional
    serviceName: 'service-name',
    environment: 'production',
    enabled: process.env.NODE_ENV === 'production', // Optional, default to true
    ignoreErrors: ['ValidationError', 'NotFoundError'] // Optional
   })
  }
 }
```

When the `title` and `description` are not provided, the name and message of the error object will be used respectively.

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
