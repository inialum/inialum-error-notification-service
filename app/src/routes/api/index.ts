import { OpenAPIHono } from '@hono/zod-openapi'

import { apiV1 } from './v1'

export const api = new OpenAPIHono()
api.route('/v1', apiV1)

api.onError((error, c) => {
	console.error(error)

	if (error instanceof Error) {
		return c.json(
			{
				message: error.message,
			},
			500,
		)
	}
	return c.json(
		{
			message: 'Internal server error',
		},
		500,
	)
})
