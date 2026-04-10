import { object, document, string, required } from "@atcute/lexicon-doc/builder";

export default document({
	id: "directory.evnt.component.source",
	defs: {
		main: object({
			description: "A source of information about the event",
			properties: {
				url: required(string()),
			},
		}),
	},
});
