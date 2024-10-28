import { Hono } from 'hono'

import { notifyError } from '@inialum/error-notification-service-hono-middleware'

const app = new Hono()

app.use(
	'*',
	await notifyError('my-token', {
		title: 'Some error',
		description: 'Some error occurred in XXX function',
		serviceName: 'service-name',
		environment: 'production',
	}),
)

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
