import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import metadata from "./public/oauth-client-metadata.json" with { type: "json" };
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";

const SERVER_HOST = "127.0.0.1";
const SERVER_PORT = 5173;

const icon = (size: number) => [
	{
		src: `icon${size}.png`,
		type: "image/png",
		sizes: `${size}x${size}`,
		purpose: "any",
	},
	{
		src: `icon${size}-maskable.png`,
		type: "image/png",
		sizes: `${size}x${size}`,
		purpose: "maskable",
	},
];

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
				id: "/",
				name: "Vantage Events Viewer",
				short_name: "Vantage",
				description: "View and manage events",
				categories: ["utilities", "calendar", "productivity"],
				dir: "ltr",
				lang: "en-US",
				theme_color: "#242424",
				background_color: "#242424",
				start_url: "/",
				display: "standalone",
				display_override: ["window-controls-overlay", "standalone", "fullscreen", "minimal-ui"],
				prefer_related_applications: false,
				icons: [
					{
						src: "icon.svg",
						type: "image/svg+xml",
						sizes: "any",
						purpose: "any",
					},
					...icon(192),
					...icon(256),
					...icon(512),
				],
				orientation: "any",
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
						name: "List",
						url: "/list",
					}
				],
				file_handlers: [
					{
						action: "/?file-handler=%s",
						accept: {
							"application/json": [".json"],
							"text/calendar": [".ics"],
						},
					},
				],
				share_target: {
					action: "/?share-target",
					method: "POST",
					enctype: "multipart/form-data",
					params: {
						url: "url",
						files: [
							{
								name: "json",
								accept: ["application/json"],
							},
							{
								name: "ics",
								accept: ["text/calendar"],
							},
						],
					},
				},
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
		}),
	],
});
