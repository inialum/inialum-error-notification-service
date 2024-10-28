import { Hono } from 'hono'
import type { MockInstance } from 'vitest'
import { notifyError } from '.'

describe('Hono middleware', async () => {
	let mockedInstance: MockInstance

	beforeEach(() => {
		mockedInstance = vi.spyOn(global, 'fetch').mockResolvedValue(
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

	const app = new Hono()

	app.use(
		'*',
		await notifyError('123', {
			title: 'Some error',
			description: 'Some error occurred in XXX function',
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

	test('should not call fetch function in the notifyError middleware when no error occurs', async () => {
		await app.request('/test-ok', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		expect(mockedInstance).not.toHaveBeenCalled()
	})

	test('should call fetch function in the notifyError middleware when an error occurs', async () => {
		// Disable error log in console
		vi.spyOn(console, 'error').mockImplementation(() => null)

		await app.request('/test-error', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		expect(mockedInstance).toHaveBeenCalled()
	})
})
