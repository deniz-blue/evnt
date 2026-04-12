import { object, document, string, required, unknown, boolean } from "@atcute/lexicon-doc/builder";

export default document({
	id: "directory.evnt.component.link",
	defs: {
		main: object({
			description: "A link to an external resource related to the event",
			properties: {
				url: required(string()),
				name: unknown(),
				disabled: boolean(),
				opensAt: unknown(),
				closesAt: unknown(),
			},
		}),
	},
});
