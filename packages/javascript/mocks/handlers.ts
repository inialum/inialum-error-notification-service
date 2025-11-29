import { HttpResponse, http } from 'msw'

import { ERROR_NOTIFICATION_API_BASE_URL } from '../src/constants'

export const handlers = [
	http.post(`${ERROR_NOTIFICATION_API_BASE_URL}/api/v1/notify`, () => {
		return HttpResponse.json({
			status: 'ok',
		})
	}),
]
