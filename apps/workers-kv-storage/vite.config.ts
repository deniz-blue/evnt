import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig(({ isSsrBuild }) => ({
	server: {
		port: 8787,
	},
	plugins: [cloudflare(), ssrPlugin() as any],
}))
