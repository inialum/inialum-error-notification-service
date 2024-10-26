import { z } from '@hono/zod-openapi'

/**
 * Schema for request of POST /notify
 */
export const NotifyApiRequestSchemaV1 = z
	.object({
		title: z
			.string({
				required_error: 'This field is required',
			})
			.max(128, {
				message: 'Message is too long. Max length is 128 characters',
			})
			.openapi({
				example: 'API Error',
			}),
		description: z
			.string()
			.max(256, {
				message: 'Message is too long. Max length is 256 characters',
			})
			.optional()
			.openapi({
				example: 'Error occurred in XXX function',
			}),
		service_name: z
			.union(
				[z.literal('inialum-mail-service'), z.literal('inialum-entry-form')],
				{
					errorMap: () => ({ message: 'Invalid service name' }),
				},
			)
			.openapi({
				example: 'inialum-mail-service',
			}),
		environment: z
			.union(
				[z.literal('local'), z.literal('staging'), z.literal('production')],
				{
					errorMap: () => ({ message: 'Invalid environment' }),
				},
			)
			.openapi({
				example: 'production',
			}),
	})
	.openapi('Request')

export type NotifyApiRequestV1 = z.infer<typeof NotifyApiRequestSchemaV1>

/**
 * Schema for response of POST /notify
 */
export const NotifyApiResponseSchemaV1 = z
	.object({
		status: z.string().openapi({
			example: 'ok',
		}),
	})
	.openapi('Response')

/**
 * Schema for Zod validation error
 */
const ZodValidationError = z.object({
	code: z.string(),
	expected: z.string(),
	received: z.string(),
	path: z.string().array(),
	message: z.string(),
})

/**
 * Schema for 400 error response of POST /notify
 */
export const NotifyApi400ErrorSchemaV1 = z.object({
	message: z.string().openapi({
		example: 'Invalid request body',
	}),
	issues: ZodValidationError.array().openapi({
		example: [
			{
				code: 'invalid_string',
				expected: 'string',
				received: 'undefined',
				path: ['message'],
				message: 'This field is required',
			},
		],
	}),
})

/**
 * Schema for 500 error response of POST /notify
 */
export const NotifyApi500ErrorSchemaV1 = z.object({
	message: z.string().openapi({
		example: 'Failed to notify error',
	}),
})
