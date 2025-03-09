import { Hono } from 'hono'
import type { MockInstance } from 'vitest'
import { notifyError } from './index'

describe('Hono middleware', async () => {
	let mockedFetch: MockInstance

	const app = new Hono()

	beforeAll(() => {
		app.use(
			'*',
			notifyError({
				token: 'dummy',
				serviceName: 'service-name',
				environment: 'production',
			}),
		)
		app.get('/test-ok', async () => {
			return new Response('OK', { status: 200 })
		})
		app.get('/test-error', async () => {
			throw new Error('some error')
		})
	})

	beforeEach(() => {
		mockedFetch = vi.spyOn(global, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					status: 'ok',
				}),
			),
		)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	test('should not call fetch function in the notifyError middleware when no error occurs', async () => {
		expect.assertions(1)

		await app.request('/test-ok', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		expect(mockedFetch).not.toHaveBeenCalled()
	})

	test('should call fetch function in the notifyError middleware when an error occurs', async () => {
		expect.assertions(1)

		// Disable error log in console
		vi.spyOn(console, 'error').mockImplementation(() => null)

		await app.request('/test-error', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		expect(mockedFetch).toHaveBeenCalled()
	})
})
