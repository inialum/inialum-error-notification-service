import { Hono } from 'hono'
import { env } from 'hono/adapter'

import {
	type EnvironmentType,
	notifyError,
} from '@inialum/error-notification-service-hono-middleware'

const app = new Hono()

const IS_TEST = false // In a real app, determine this from your environment

// Mock functions to simulate getting request context
const getRequestId = () => {
	return `req-${Math.random().toString(36).substring(2, 10)}`
}

const getUserAgent = () => {
	return 'Example User Agent'
}

// Configure error notification middleware with advanced features
app.use('*', async (c, next) => {
	const { ERROR_NOTIFICATION_TOKEN, ENVIRONMENT } = env<{
		ERROR_NOTIFICATION_TOKEN: string
		ENVIRONMENT: EnvironmentType
	}>(c)

	const handleError = notifyError({
		token: ERROR_NOTIFICATION_TOKEN,
		serviceName: 'hono-example-api',
		environment: ENVIRONMENT,
		// Only enable in non-test environments
		enabled: !IS_TEST,
		// Ignore common validation errors
		ignoreErrors: ['ValidationError', 'NotFoundError'],
		// Add request information to the notifications
		beforeSend: (error, payload) => {
			// Access request information from a global context
			// In a real app, you might use Hono's context to get this info
			const requestId = getRequestId()
			const userAgent = getUserAgent()

			// Add request context to the error description
			payload.description = [
				payload.description,
				`Request ID: ${requestId}`,
				`User Agent: ${userAgent}`,
				`Timestamp: ${new Date().toISOString()}`,
			].join('\n')

			// Skip notifications for specific paths
			if (error.message.includes('/health')) {
				console.log('Skipping notification for health check endpoint')
				return null
			}

			// Categorize errors in the title
			if (error.message.includes('database')) {
				payload.title = `[Database Error] ${payload.title}`
			} else if (error.message.includes('auth')) {
				payload.title = `[Auth Error] ${payload.title}`
			} else {
				payload.title = `[API Error] ${payload.title}`
			}

			return payload
		},
	})

	return await handleError(c, next)
})

// Basic route - no error
app.get('/', (c) =>
	c.text('Welcome to Hono Error Notification Middleware Example'),
)

// Basic error demonstration
app.get('/error', () => {
	throw new Error('Generic API error for demonstration')
})

// Add routes to demonstrate advanced features

// Database error - will be categorized in beforeSend
app.get('/database-error', () => {
	throw new Error('Failed to connect to database: connection timeout')
})

// Authentication error - will be categorized in beforeSend
app.get('/auth-error', () => {
	throw new Error('auth error: Invalid token provided')
})

// Error that will be ignored due to ignoreErrors setting
app.get('/validation-error', () => {
	const error = new Error('Invalid input data')
	error.name = 'ValidationError'
	throw error
})

// Error that will be filtered out in beforeSend
app.get('/health', () => {
	throw new Error('/health endpoint check failed')
})

export default app
