import type { EnvironmentType } from './Environment'

export type ErrorNotificationOptions = {
	token: string
	title?: string
	description?: string
	serviceName: string
	environment: EnvironmentType
	enabled?: boolean
	ignoreErrors?: string[]
}
