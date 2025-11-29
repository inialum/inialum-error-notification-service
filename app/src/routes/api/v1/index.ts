import { OpenAPIHono } from '@hono/zod-openapi'

import { notifyApiV1 } from './notify'
import type { Bindings } from '@/types'

export const apiV1 = new OpenAPIHono<{ Bindings: Bindings }>()
apiV1.route('/notify', notifyApiV1)
