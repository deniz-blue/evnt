import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import metadata from "./public/oauth-client-metadata.json" with { type: "json" };
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";

const SERVER_HOST = "127.0.0.1";
const SERVER_PORT = 5173;

export default defineConfig({
	clearScreen: false,
	server: {
		host: SERVER_HOST,
		port: SERVER_PORT,
	},

	plugins: [
		tsconfigPaths(),
		tanstackRouter({
			target: "react",
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
			quoteStyle: "double",
		}),
		react(),
		{
			name: "oauth",
			config(_conf, { command }) {
				process.env.VITE_OAUTH_SCOPE = metadata.scope;
				if (command === 'build') {
					process.env.VITE_OAUTH_CLIENT_ID = metadata.client_id;
					process.env.VITE_OAUTH_REDIRECT_URI = metadata.redirect_uris[0];
				} else {
					const redirectUri = `http://${SERVER_HOST}:${SERVER_PORT}${new URL(metadata.redirect_uris[0]!).pathname}`;
					process.env.VITE_OAUTH_CLIENT_ID =
						`http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}` +
						`&scope=${encodeURIComponent(metadata.scope)}`;
					process.env.VITE_OAUTH_REDIRECT_URI = redirectUri;
				}
			},
		},
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			manifest: {
				name: "Vantage Events Viewer",
				short_name: "Vantage Events Viewer",
				description: "View @evnt events",
				theme_color: "#242424",
				background_color: "#242424",
				icons: [
					{
						src: "icon.svg",
						type: "image/svg+xml",
					},
					{
						src: "icon.png",
						type: "image/png",
						sizes: "256x256",
					},
				],
				display: "standalone",
				protocol_handlers: [
					{
						protocol: "web+evnt",
						url: "/?protocol-handler=%s",
					}
				],
				handle_links: "preferred",
				launch_handler: {
					client_mode: "navigate-existing",
				},
				scope: "/",
				scope_extensions: [
					{ type: "origin", origin: "https://event.nya.pub" },
				],
				shortcuts: [
					{
						name: "Home",
						url: "/",
					},
					{
						name: "Events List",
						url: "/list",
					}
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
		}),
	],
});
