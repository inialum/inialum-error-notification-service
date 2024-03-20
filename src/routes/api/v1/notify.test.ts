import { type ZodError } from 'zod'

import { type NotifyApiRequestV1 } from '@/libs/api/v1/schema/notify'

import { apiV1 } from '.'

vi.mock('hono/adapter', () => {
  return {
    env: () => getMiniflareBindings(),
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
      message: 'Invalid request body',
      issues: [
        {
          code: 'invalid_union',
          message: 'Invalid environment',
          path: ['environment'],
          unionErrors: [
            {
              name: 'ZodError',
              issues: [
                {
                  code: 'invalid_literal',
                  expected: 'local',
                  message: 'Invalid literal value, expected "local"',
                  path: ['environment'],
                  received: 'fake-environment',
                },
              ],
            },
            {
              issues: [
                {
                  code: 'invalid_literal',
                  expected: 'staging',
                  message: 'Invalid literal value, expected "staging"',
                  path: ['environment'],
                  received: 'fake-environment',
                },
              ],
              name: 'ZodError',
            },
            {
              issues: [
                {
                  code: 'invalid_literal',
                  expected: 'production',
                  message: 'Invalid literal value, expected "production"',
                  path: ['environment'],
                  received: 'fake-environment',
                },
              ],
              name: 'ZodError',
            },
          ],
        },
      ] as ZodError['issues'],
    })
  })
})
