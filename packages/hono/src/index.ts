import { createMiddleware } from 'hono/factory'

import {
	type EnvironmentType,
	notifyError as notifyErrorJsSdk,
} from '@inialum/error-notification-service-javascript-sdk'

type ErrorNotificationOptions = Omit<
	Parameters<typeof notifyErrorJsSdk>[1],
	'title' | 'description'
>

/**
 * Hono middleware to notify an error using the JavaScript SDK of inialum-error-notification-service.
 *
 * @param {ErrorNotificationOptions} options - The options to configure the Hono middleware.
 * @param {string} options.token - The token used for authentication with the Hono middleware.
 * @param {string} options.serviceName - The name of the service that encountered the error.
 * @param {EnvironmentType} options.environment - The environment in which the error occurred.
 * @param {boolean} [options.enabled] - Whether to enable or disable the notification. Default is true.
 * @param {string[]} [options.ignoreErrors] - An array of error messages to ignore.
 *
 * @example
 * ```ts
 * import { Hono } from 'hono'
 * import { notifyError } from '@inialum/error-notification-service-hono-middleware'
 *
 * const app = new Hono()
 *
 * app.use('*', notifyError({
 * 	token: 'dummy',
 * 	serviceName: 'service-name',
 * 	environment: 'production'
 * 	enabled: isProd === true,
 * 	ignoreErrors: ['TypeError', 'ReferenceError'],
 * }))
 *
 * app.get('/', (c) => c.text('foo'))
 *
 * export default app
 * ```
 */
export const notifyError = ({
	token,
	serviceName,
	environment,
	enabled = true,
	ignoreErrors = [],
}: ErrorNotificationOptions) => {
	return createMiddleware(async (c, next) => {
		await next()

		if (c.error) {
			await notifyErrorJsSdk(c.error, {
				token,
				title: c.error.name,
				description: c.error.message,
				serviceName,
				environment,
				enabled,
				ignoreErrors,
			})
		}
	})
}

export type { ErrorNotificationOptions, EnvironmentType }
