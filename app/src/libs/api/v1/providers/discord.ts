import type { APIEmbed } from 'discord-api-types/v10'

import type { NotifyApiRequestV1 } from '@/libs/api/v1/schema/notify'

export const buildDiscordMessageBody = (data: NotifyApiRequestV1) => {
	const bodyObject = {
		username: 'INIALUM Error Notification',
		embeds: [
			{
				title: data.title,
				description: data.description,
				color: 0xca1206,
				fields: [
					{
						name: 'Service Name',
						value: data.service_name,
					},
					{
						name: 'Environment',
						value: data.environment,
					},
				],
				timestamp: new Date().toISOString(),
			},
		] satisfies APIEmbed[],
	}
	return JSON.stringify(bodyObject)
}
