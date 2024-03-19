import { sign } from 'jws'
import '@Root/env'

const payload = {
  service_name: 'inialum-error-notification-service',
  created_at: new Date().getTime(),
}
try {
  const secret = process.env.TOKEN_SECRET
  const token = sign({
    header: {
      alg: 'HS256',
    },
    payload,
    secret,
  })
  console.info(`token: ${token}`)
} catch (e) {
  if (e instanceof Error) {
    console.error('Failed to create token:', e.message)
  } else {
    console.error(e)
  }
}
