# inialum-error-notification-service

Microservice for sending error notification

## Development

> [!NOTE]
>
> - For now, this service only supports sending Discord message via Webhook.
> - This project uses Hono. You can read the documentation [here](https://hono.dev).

### Setup

1. Clone this repository
2. Install dependencies

   ```shell
   pnpm install
   ```

3. Configure environment variables

   ```shell
   cp .dev.vars.example .dev.vars
   ```

   Then, edit `.dev.vars` file and fill the variables with your own values.

4. Run the service

   ```shell
   pnpm run dev
   ```

   The service will be running on port 7070.

### Testing

```shell
pnpm run test
```

If you want to run test with coverage report, run this command instead

```shell
pnpm run test:coverage
```

### OpenAPI Specification

OpenAPI Specification (OAS) is a standard, language-agnostic interface to RESTful APIs. This service uses OAS to describe its API and it is powered by [Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi). The service hosts the OAS file on `/schema/v1` endpoint.

### Swagger UI

You can access the Swagger UI by visiting [here](https://error-notification-api.inialum.org/docs/v1).

### Tips

- If you want to generate authentication token to request API of this service, you can use this command

  ```shell
  pnpm run create-token
  ```

  The generated token uses `TOKEN_SECRET` (defined in `.dev.vars`) as the secret.

- You can create random secret value for `TOKEN_SECRET` with the following command

  ```shell
  openssl rand -base64 32
  ```

## Deployment

This service is deployed to [Cloudflare Workers](https://workers.cloudflare.com) using GitHub Actions. When a new commit is pushed to `main` branch, the service will be automatically deployed.
