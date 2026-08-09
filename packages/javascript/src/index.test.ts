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
		expect.assertions(2)
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

	test('should send error information with error object and overrode custom title and description', async () => {
		expect.assertions(2)
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

	test('should not send error information when enabled is set to false', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')
		const fetchSpy = vi.spyOn(global, 'fetch')

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			enabled: false,
		})

		expect(fetchSpy).not.toHaveBeenCalled()
	})

	test('should send error information when enabled is set to true', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')
		const pendingRequest = waitForRequest(
			'POST',
			`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`,
		)

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			enabled: true,
		})

		const request = await pendingRequest
		expect(request).toBeDefined()
	})

	test('should not send error information when error name is in ignoreErrors list', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')
		const fetchSpy = vi.spyOn(global, 'fetch')

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			ignoreErrors: ['CustomError', 'TypeError'],
		})

		expect(fetchSpy).not.toHaveBeenCalled()
	})

	test('should send error information when error name is not in ignoreErrors list', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')
		const pendingRequest = waitForRequest(
			'POST',
			`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`,
		)

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			ignoreErrors: ['TypeError', 'ReferenceError'],
		})

		const request = await pendingRequest
		expect(request).toBeDefined()
	})

	test('should respect both enabled and ignoreErrors settings', async () => {
		expect.assertions(2)
		const errorObject = new CustomError('Custom error message')
		const fetchSpy = vi.spyOn(global, 'fetch')

		// Case 1: enabled=false should prevent notification even if error is not in ignoreErrors
		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			enabled: false,
			ignoreErrors: ['TypeError'], // CustomError not in ignore list
		})
		expect(fetchSpy).not.toHaveBeenCalled()

		// Case 2: enabled=true but error is in ignoreErrors should prevent notification
		fetchSpy.mockReset()
		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			enabled: true,
			ignoreErrors: ['CustomError'],
		})
		expect(fetchSpy).not.toHaveBeenCalled()
	})

	// For the test that modifies payload with beforeSend, we need to update to use camelCase
	test('should modify payload when beforeSend function is provided', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')

		const pendingRequest = waitForRequest(
			'POST',
			`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`,
		)

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			beforeSend: (_error, payload) => {
				// Payload is now in camelCase
				payload.title = `Modified: ${payload.title}`
				payload.description = `Modified: ${payload.description}`
				return payload
			},
		})

		const request = await pendingRequest
		// The API still expects snake_case
		expect(await request.json()).toStrictEqual({
			title: 'Modified: CustomError',
			description: 'Modified: Custom error message',
			service_name: 'inialum-service',
			environment: 'production',
		})
	})

	test('should not send notification when beforeSend returns null', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')
		const fetchSpy = vi.spyOn(global, 'fetch')

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			beforeSend: () => null,
		})

		expect(fetchSpy).not.toHaveBeenCalled()
	})

	test('should not send notification when beforeSend returns false', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')
		const fetchSpy = vi.spyOn(global, 'fetch')

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			beforeSend: () => false,
		})

		expect(fetchSpy).not.toHaveBeenCalled()
	})

	test('should send notification with original payload when beforeSend returns undefined', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')

		const pendingRequest = waitForRequest(
			'POST',
			`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`,
		)

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			beforeSend: () => {
				// Returning undefined should use the original payload
				return undefined
			},
		})

		const request = await pendingRequest
		// Verify the original payload is sent
		expect(await request.json()).toStrictEqual({
			title: 'CustomError',
			description: 'Custom error message',
			service_name: 'inialum-service',
			environment: 'production',
		})
	})

	test('should abort request when timeout is exceeded', async () => {
		expect.assertions(1)
		const errorObject = new CustomError('Custom error message')

		vi.spyOn(global, 'fetch').mockImplementation((input) => {
			const signal = input instanceof Request ? input.signal : undefined
			return new Promise((_resolve, reject) => {
				if (!signal) {
					return
				}
				if (signal.aborted) {
					reject(signal.reason)
					return
				}
				signal.addEventListener('abort', () => {
					reject(signal.reason)
				})
			})
		})
		vi.spyOn(console, 'error').mockImplementation(() => null)

		await expect(
			notifyError(errorObject, {
				token: 'dummy',
				serviceName: 'inialum-service',
				environment: 'production',
				timeout: 10,
			}),
		).rejects.toThrow()
	})

	test('should send request with AbortSignal when timeout is set', async () => {
		expect.assertions(2)
		const errorObject = new CustomError('Custom error message')
		const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					status: 'ok',
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		)

		await notifyError(errorObject, {
			token: 'dummy',
			serviceName: 'inialum-service',
			environment: 'production',
			timeout: 5000,
		})

		expect(fetchSpy.mock.calls[0]?.[0]).toBeInstanceOf(Request)
		const request = fetchSpy.mock.calls[0]?.[0] as Request
		expect(request.signal).toBeInstanceOf(AbortSignal)
	})
})
