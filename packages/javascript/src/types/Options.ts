import type { EnvironmentType } from './Environment'

export type ErrorNotifyOptions = {
	token: string
	title?: string
	description?: string
	serviceName: string
	environment: EnvironmentType
}
