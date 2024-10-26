import { OpenAPIHono } from '@hono/zod-openapi'

import { notifyApiV1 } from './notify'

export const apiV1 = new OpenAPIHono()
apiV1.route('/notify', notifyApiV1)
