import { object, document, string, unknown, ref } from "@atcute/lexicon-doc/builder";

export default document({
	id: "directory.evnt.venue.physical",
	defs: {
		main: object({
			properties: {
				name: unknown(),
				address: ref({ ref: "directory.evnt.venue.physical#address" }),
			},
		}),
		address: object({
			properties: {
				addr: string(),
				countryCode: string(),
			},
		}),
	},
});
