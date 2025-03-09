import type { EnvironmentType } from './Environment'

/**
 * Represents the payload structure for error notifications.
 *
 * This is the user-facing representation of the error notification data.
 * All properties use camelCase following JavaScript conventions.
 * This is the payload type that users will interact with in the `beforeSend` function.
 */
export type ErrorNotificationPayload = {
	/**
	 * The title of the error notification.
	 */
	title: string

	/**
	 * The description of the error notification.
	 */
	description: string

	/**
	 * The name of the service that encountered the error.
	 */
	serviceName: string

	/**
	 * The environment in which the error occurred.
	 */
	environment: EnvironmentType
}

/**
 * Internal type used for the API request (snake_case).
 *
 * This type is used internally by the SDK to convert the user-friendly camelCase payload
 * to the snake_case format required by the API. It is not exported from the package.
 *
 * @internal
 */
export type ApiErrorNotificationPayload = {
	title: string
	description: string
	service_name: string
	environment: EnvironmentType
}
