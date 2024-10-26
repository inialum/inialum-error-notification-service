import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'miniflare',
	},
	resolve: {
		alias: [
			{
				find: '@Root',
				replacement: resolve(__dirname, '.'),
			},
			{
				find: '@',
				replacement: resolve(__dirname, './src'),
			},
		],
	},
})
