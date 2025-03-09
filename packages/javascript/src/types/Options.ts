import type { EnvironmentType } from './Environment'
import type { ErrorNotificationPayload } from './Payload'

/**
 * Configuration options for the error notification service.
 *
 * This type defines all available options when calling the `notifyError` function.
 * Only `token`, `serviceName`, and `environment` are required; all other options are optional.
 */
export type ErrorNotificationOptions = {
	/**
	 * The token used for authentication with the JavaScript SDK.
	 */
	token: string

	/**
	 * The title of the notification.
	 */
	title?: string

	/**
	 * The description of the notification.
	 */
	description?: string

	/**
	 * The name of the service that encountered the error.
	 */
	serviceName: string

	/**
	 * The environment in which the error occurred.
	 */
	environment: EnvironmentType

	/**
	 * Whether to enable or disable the notification. Default is true.
	 */
	enabled?: boolean

	/**
	 * An array of error names to ignore.
	 */
	ignoreErrors?: string[]

	/**
	 * A function called before sending the notification.
	 * This can modify the payload or prevent sending by returning null/false.
	 */
	beforeSend?: (
		error: Error,
		payload: ErrorNotificationPayload,
	) => ErrorNotificationPayload | null | false | undefined
}
