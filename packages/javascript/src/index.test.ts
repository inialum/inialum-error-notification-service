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
})
