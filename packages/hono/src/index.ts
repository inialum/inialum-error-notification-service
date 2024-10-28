import { createMiddleware } from 'hono/factory'

import { notifyError as notifyErrorJsSdk } from '@inialum/error-notification-service-javascript-sdk'
import type { MiddlewareHandler } from 'hono'

type Options = Parameters<typeof notifyErrorJsSdk>[1]

/**
 * Hono middleware to notify an error using the JavaScript SDK of inialum-error-notification-service.
 *
 * @param {string} token - The token used for authentication with the JavaScript SDK.
 * @param {Options} options - The options to configure the JavaScript SDK.
 * @param {string} options.title - The title of the notification.
 * @param {string} [options.description] - The description of the notification.
 * @param {string} options.serviceName - The name of the service that encountered the error.
 * @param {Options['environment']} options.environment - The environment in which the error occurred.
 * @returns {Promise<import('hono').MiddlewareHandler>} A middleware function that checks for errors and notifies them if present.
 *
 * @example
 * ```ts
 * import { Hono } from 'hono'
 * import { notifyError } from '@inialum/error-notification-service-hono-middleware'
 *
 * const app = new Hono()
 *
 * const token = 'your-token'
 * const options = {
 * 	title: 'Some error',
 * 	description: 'Some error occurred in XXX function',
 * 	serviceName: 'service-name',
 * 	environment: 'production'
 * }
 *
 * app.use('*', await notifyError(token, options))
 * app.get('/', (c) => c.text('foo'))
 *
 * export default app
 * ```
 */
export const notifyError = async (
	token: string,
	options: Options,
): Promise<MiddlewareHandler> => {
	return createMiddleware(async (c, next) => {
		await next()

		if (c.error) {
			await notifyErrorJsSdk(token, options)
		}
	})
}
