import { waitForRequest } from '../mocks/waitForRequest'
import { ERROR_NOTIFICATION_API_BASE_URL } from './constants'
import { notifyError } from './index'

class CustomError extends Error {
	static {
		// biome-ignore lint/complexity/noThisInStatic: For avoiding TypeError
		this.prototype.name = 'CustomError'
	}

	// biome-ignore lint/complexity/noUselessConstructor: This constructor is necessary to set the name of the error
	constructor(message: string, options?: ErrorOptions) {
		super(message, options)
	}
}

describe('JavaScript SDK', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	test('should send error information with error object', async () => {
		const errorObject = new CustomError('Custom error message')

		const pendingRequest = waitForRequest(
			'POST',
			`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`,
		)

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
		})

		const request = await pendingRequest

		expect(request.url).toBe(`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`)
		expect(await request.json()).toStrictEqual({
			title: 'CustomError',
			description: 'Custom error message',
			service_name: 'inialum-service',
			environment: 'production',
		})
	})

	test('should send error information with error object and custom title and description', async () => {
		const errorObject = new CustomError('Custom error message')

		const pendingRequest = waitForRequest(
			'POST',
			`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`,
		)

		await notifyError(errorObject, {
			token: 'dummy',
			title: 'OverrodeErrorTitle',
			description: 'Overrode error description',
			serviceName: 'inialum-service',
			environment: 'production',
		})

		const request = await pendingRequest

		expect(request.url).toBe(`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`)
		expect(await request.json()).toStrictEqual({
			title: 'OverrodeErrorTitle',
			description: 'Overrode error description',
			service_name: 'inialum-service',
			environment: 'production',
		})
	})
})
