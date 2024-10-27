import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { env } from 'hono/adapter'

import { buildDiscordMessageBody } from '@/libs/api/v1/providers/discord'
import {
	NotifyApi400ErrorSchemaV1,
	NotifyApi500ErrorSchemaV1,
	NotifyApiRequestSchemaV1,
	NotifyApiResponseSchemaV1,
} from '@/libs/api/v1/schema/notify'

const notifyApiV1 = new OpenAPIHono()

const route = createRoute({
	method: 'post',
	path: '',
	security: [{ Bearer: [] }],
	request: {
		body: {
			content: {
				'application/json': {
					schema: NotifyApiRequestSchemaV1,
				},
			},
			description: 'Error message you want to notify',
			required: true,
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: NotifyApiResponseSchemaV1,
				},
			},
			description: 'Returns OK response if the notification is successful',
		},
		400: {
			content: {
				'application/json': {
					schema: NotifyApi400ErrorSchemaV1,
				},
			},
			description: 'Bad request',
		},
		500: {
			content: {
				'application/json': {
					schema: NotifyApi500ErrorSchemaV1,
				},
			},
			description: 'Internal server error or external API error',
		},
	},
})

notifyApiV1.openapi(
	route,
	async (c) => {
		const { DISCORD_WEBHOOK_URL } = env<{ DISCORD_WEBHOOK_URL: string }>(c)

		const data = c.req.valid('json')

		const response = await fetch(DISCORD_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: buildDiscordMessageBody(data),
		})

		if (response.ok) {
			return c.json(
				{
					status: 'ok',
				},
				200,
			)
		}

		const error = await response.text()
		throw new Error(error)
	},
	(result, c) => {
		if (!result.success) {
			return c.json(
				{
					message: 'Validation Error',
					issues: result.error.issues,
				},
				400,
			)
		}
	},
)

export { notifyApiV1 }
