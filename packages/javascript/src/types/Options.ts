import type { EnvironmentType } from './Environment'

export type ErrorNotificationOptions = {
	enabled?: boolean
	token: string
	title?: string
	description?: string
	serviceName: string
	environment: EnvironmentType
	ignoreErrors?: string[]
}
