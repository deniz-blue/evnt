import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		reactRouter(),
		tsconfigPaths(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			manifest: {
				name: "@evnt Viewer",
				short_name: "@evnt Viewer",
				description: "The default viewer for @evnt events.",
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
