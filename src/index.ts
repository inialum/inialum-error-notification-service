import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { env } from 'hono/adapter'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { secureHeaders } from 'hono/secure-headers'

import { API_ENDPOINT, ORIGINS } from '@/constants/config'

import { api } from '@/routes/api'

import { DisableTryItOutPlugin } from '@/utils/swaggerPlugins'

const app = new OpenAPIHono()

app.use('*', secureHeaders())
app.use('*', async (c, next) => {
  const { ENVIRONMENT } = env<{ ENVIRONMENT: string }>(c)
  const originCheck = cors({
    origin: ENVIRONMENT === 'production' ? ORIGINS : '*',
  })
  return await originCheck(c, next)
})
app.use('/api/*', async (c, next) => {
  const { TOKEN_SECRET } = env<{ TOKEN_SECRET: string }>(c)
  const auth = jwt({
    secret: TOKEN_SECRET,
  })
  return await auth(c, next)
})

app.route('/api', api)

app.doc('/schema/v1', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'INIALUM Error Notification Service API v1',
  },
  servers: [
    {
      url: API_ENDPOINT,
    },
  ],
})

app.get(
  '/docs/v1',
  swaggerUI({
    url: '/schema/v1',
    // @ts-expect-error - Disable type error to handle broken type
    plugins: [DisableTryItOutPlugin],
  }),
)

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'JWT Authentication',
})

export default app
