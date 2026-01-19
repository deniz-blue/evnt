import type { EventEntry } from "./build";

export const indexjson = (entries: EventEntry[]) => {
    return {
		events: entries.map(entry => ({
			url: entry.relativepath,
		})),
	};
};
