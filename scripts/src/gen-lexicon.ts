import { writeFileSync } from "node:fs"
import { schema2lexicon } from "json-schema-to-lexicon";

export const genLexicon = async (dest: string | URL, jsonSchema: any) => {
	writeFileSync(dest, JSON.stringify(schema2lexicon(jsonSchema, {
		id: "blue.deniz.atproto.event",
		description: "Event Data Lexicon",
	}), null, 2));
}
