import { OpenAPIHono } from '@hono/zod-openapi'

import { apiV1 } from './v1'

export const api = new OpenAPIHono()
api.route('/v1', apiV1)
