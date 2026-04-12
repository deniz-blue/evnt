import { object, document, unknown } from "@atcute/lexicon-doc/builder";

export default document({
	id: "directory.evnt.venue.unknown",
	defs: {
		main: object({
			properties: {
				name: unknown(),
			},
		}),
	},
});
