import { object, document, string, unknown } from "@atcute/lexicon-doc/builder";

export default document({
	id: "directory.evnt.venue.online",
	defs: {
		main: object({
			properties: {
				name: unknown(),
				url: string(),
			},
		}),
	},
});
