import { Hono } from 'hono'
import { env } from 'hono/adapter'

import { notifyError } from '@inialum/error-notification-service-hono-middleware'

const app = new Hono()

app.use('*', async (c, next) => {
	const { ERROR_NOTIFICATION_TOKEN } = env<{
		ERROR_NOTIFICATION_TOKEN: string
	}>(c)
	const handleError = notifyError({
		token: ERROR_NOTIFICATION_TOKEN,
		serviceName: 'example-service',
		environment: 'production',
	})

	return await handleError(c, next)
})

app.get('/', () => {
	throw new Error('Error occurred!')
})

app.onError((error, c) => {
	console.error(error)

	return c.json(
		{
			message: 'Internal server error',
		},
		500,
	)
})

export default app
