import {
	type EnvironmentType,
	type ErrorNotificationPayload,
	notifyError as notifyErrorJsSdk,
} from '@inialum/error-notification-service-javascript-sdk'
import { createMiddleware } from 'hono/factory'

/**
 * Configuration options for the Hono error notification middleware.
 *
 * This extends the JavaScript SDK options but omits the `title` and `description` fields
 * since these are automatically extracted from the error object in the Hono context.
 * The middleware handles passing these to the underlying JavaScript SDK.
 */
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
 * @param {string[]} [options.ignoreErrors] - An array of error names to ignore.
 * @param {(error: Error, payload: ErrorNotificationPayload) => ErrorNotificationPayload | null | false | undefined} [options.beforeSend] - A function that allows you to modify the data being sent or prevent the notification from being sent.
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
 * 	environment: 'production',
 * 	enabled: isProd === true,
 * 	ignoreErrors: ['TypeError', 'ReferenceError'],
 * 	beforeSend: (error, payload) => {
 * 		// Add user info to the description
 * 		payload.description = `User: user123 - ${payload.description}`;
 * 		return payload;
 * 	}
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
	beforeSend,
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
				beforeSend,
			})
		}
	})
}

export type {
	EnvironmentType,
	ErrorNotificationOptions,
	ErrorNotificationPayload,
}
