import { writeFileSync } from "node:fs";
import { convertSchemas, formatModelsAsMarkdown } from "zod2md";

export const genMarkdownDocs = async (dest: string | URL) => {
	const module = await import("@evnt/schema");
	const { $ID, ...schemas } = module;
	const namedModels = Object.entries(schemas)
		.map(([name, schema]) => ({
			name,
			schema,
			path: `schemas/${name}`,
		}));

	const list = convertSchemas(namedModels);
	list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
	// Put EventDataSchema first
	const eventDataIndex = list.findIndex((m) => m.name === "EventDataSchema");
	if (eventDataIndex !== -1) {
		const [eventDataModel] = list.splice(eventDataIndex, 1);
		list.unshift(eventDataModel!);
	}
	writeFileSync(
		dest,
		formatModelsAsMarkdown(list, {
			title: "Event Data Schema",
		}),
	);
};
