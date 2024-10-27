import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	sourcemap: true,
	format: ['esm'],
	dts: true,
	minify: true,
	clean: true,
	tsconfig: 'tsconfig.json',
})
