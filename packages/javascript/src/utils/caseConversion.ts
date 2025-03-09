import type {
	ApiErrorNotificationPayload,
	ErrorNotificationPayload,
} from '../types/Payload'

/**
 * Converts a camelCase payload to snake_case for the API.
 *
 * This function handles the transformation between the user-facing camelCase format
 * and the API's required snake_case format. This allows us to maintain a consistent
 * JavaScript-style API for users while meeting the API's requirements.
 *
 * @param payload The camelCase payload from the user
 * @returns A new object with snake_case keys for the API
 * @internal This function is used internally by the SDK
 */
export const convertToApiPayload = (
	payload: ErrorNotificationPayload,
): ApiErrorNotificationPayload => {
	return {
		title: payload.title,
		description: payload.description,
		service_name: payload.serviceName,
		environment: payload.environment,
	}
}
