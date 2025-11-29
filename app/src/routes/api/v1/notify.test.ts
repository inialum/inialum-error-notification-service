import type { ZodError } from 'zod'

import { apiV1 } from '.'
import type { NotifyApiRequestV1 } from '@/libs/api/v1/schema/notify'

vi.mock('hono/adapter', () => {
	return {
		env: vi.fn().mockReturnValue({
			DISCORD_WEBHOOK_URL: 'test-token',
		}),
	}
})

describe('API v1', () => {
	beforeEach(() => {
		vi.spyOn(global, 'fetch').mockResolvedValue(
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

	const apiBodyContent = {
		title: 'API Error',
		description: 'Error occurred in XXX function',
		service_name: 'inialum-mail-service',
		environment: 'production',
	} satisfies NotifyApiRequestV1

	test('POST /notify (should return data with no errors)', async () => {
		expect.assertions(2)

		const res = await apiV1.request('/notify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(apiBodyContent),
		})

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({
			status: 'ok',
		})
	})

	test('POST /notify (should return with error message)', async () => {
		expect.assertions(2)

		const res = await apiV1.request('/notify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: 'API Error',
				service_name: 'inialum-mail-service',
				environment: 'fake-environment',
			}),
		})

		expect(res.status).toBe(400)
		expect(await res.json()).toStrictEqual({
			message: 'Validation error',
			issues: [
				{
					code: 'invalid_union',
					message: 'Invalid input',
					path: ['environment'],
					errors: [
						[
							{
								code: 'invalid_value',
								message: 'Invalid input: expected "local"',
								path: [],
								values: ['local'],
							},
						],
						[
							{
								code: 'invalid_value',
								message: 'Invalid input: expected "staging"',
								path: [],
								values: ['staging'],
							},
						],
						[
							{
								code: 'invalid_value',
								message: 'Invalid input: expected "production"',
								path: [],
								values: ['production'],
							},
						],
					],
				},
			] satisfies ZodError['issues'],
		})
	})
})
