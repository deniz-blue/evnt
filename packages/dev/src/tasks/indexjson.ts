import type { EventEntry } from "./build";

type Index = {
	events: Entry[];
};

type Entry = {
	path: string;
	lastModified?: number;
};

export const indexjson = (entries: EventEntry[]) => {
	return {
		events: entries.map(entry => ({
			path: entry.relativepath,
			lastModified: entry.lastModified,
		})),
	} as Index;
};
