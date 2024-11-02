import { randomUUID } from 'node:crypto'
import { matchRequestUrl } from 'msw'
import { server } from './node'

// NOTE: https://zenn.dev/azukiazusa/articles/msw-request-assertions
export const waitForRequest = (
	method: string,
	url: string,
): Promise<Request> => {
	let requestId = ''
	return new Promise((resolve, reject) => {
		server.events.on('request:start', ({ request }) => {
			const uuid = randomUUID()
			request.headers.set('request-id', uuid)

			const matchesMethod =
				request.method.toLowerCase() === method.toLowerCase()
			const isMatchingUrl = matchRequestUrl(new URL(request.url), url).matches
			if (matchesMethod && isMatchingUrl) {
				requestId = uuid
			}
		})
		server.events.on('request:match', ({ request }) => {
			if (request.headers.get('request-id') === requestId) {
				resolve(request)
			}
		})
		server.events.on('request:unhandled', ({ request }) => {
			if (request.headers.get('request-id') === requestId) {
				reject(
					new Error(
						`The ${request.method} ${request.url} request was unhandled.`,
					),
				)
			}
		})
	})
}
