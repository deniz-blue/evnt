import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from "node:fs";

export default defineConfig({
	plugins: [
		react(),
		{
			name: "virtual-instances",
			resolveId(id) {
				if (id === "virtual:instances") return id;
			},
			async load(id) {
				if (id !== "virtual:instances") return null;
				const json = JSON.parse(readFileSync("../../data/instances.json", "utf-8"));
				return `export const instances = ${JSON.stringify(json)};`;
			},
		},
	],
})
