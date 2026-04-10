import { object, document, string } from "@atcute/lexicon-doc/builder";

export default document({
	id: "directory.evnt.event.instance",
	defs: {
		main: object({
			description: "An instance of an event",
			properties: {
				start: string(),
				end: string(),
			},
		}),
	},
});
