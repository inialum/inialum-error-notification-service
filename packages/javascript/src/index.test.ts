import { notifyError } from './index'

describe('JavaScript SDK', () => {
	const mockedFetch = vi.spyOn(global, 'fetch')

	beforeEach(async () => {
		mockedFetch.mockImplementation(
			async () => new Response('{ "status": "ok" }', { status: 200 }),
		)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	test('should return response without errors', async () => {
		const reqBody = {
			title: 'API Error',
			description: 'Error occurred in XXX function',
			serviceName: 'inialum-mail-service',
			environment: 'production',
		} satisfies Parameters<typeof notifyError>[0]

		expect(notifyError(reqBody, 'my-token')).resolves.toStrictEqual({
			status: 'ok',
		})
	})
})
