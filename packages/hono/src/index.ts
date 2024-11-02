import { createMiddleware } from 'hono/factory'

import { notifyError as notifyErrorJsSdk } from '@inialum/error-notification-service-javascript-sdk'

type Options = Omit<
	Parameters<typeof notifyErrorJsSdk>[1],
	'title' | 'description'
>

/**
 * Hono middleware to notify an error using the JavaScript SDK of inialum-error-notification-service.
 *
 * @param {Options} options - The options to configure the Hono middleware.
 * @param {string} options.token - The token used for authentication with the Hono middleware.
 * @param {string} options.serviceName - The name of the service that encountered the error.
 * @param {Options['environment']} options.environment - The environment in which the error occurred.
 *
 * @example
 * ```ts
 * import { Hono } from 'hono'
 * import { notifyError } from '@inialum/error-notification-service-hono-middleware'
 *
 * const app = new Hono()
 *
 * app.use('*', await notifyError({
 * 	token: 'dummy',
 * 	serviceName: 'service-name',
 * 	environment: 'production'
 * }))
 *
 * app.get('/', (c) => c.text('foo'))
 *
 * export default app
 * ```
 */
export const notifyError = async ({
	token,
	serviceName,
	environment,
}: Options) => {
	return createMiddleware(async (c, next) => {
		await next()

		if (c.error) {
			await notifyErrorJsSdk(c.error, {
				token,
				title: c.error.name,
				description: c.error.message,
				serviceName,
				environment,
			})
		}
	})
}
