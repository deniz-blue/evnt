import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from "node:fs";
import { VirtualModule } from "@deniz-blue/vite-plugins";

export default defineConfig({
	plugins: [
		react(),
		VirtualModule(
			"instances",
			() => {
				const json = JSON.parse(readFileSync("../../data/instances.json", "utf-8"));
				return `export const instances = ${JSON.stringify(json)};`;
			},
		),
	],
})
