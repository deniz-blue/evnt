import type { JSONSchema } from "json-schema-typed";
import type { LexArray, LexBoolean, LexiconDoc, LexInteger, LexObject, LexRef, LexRefUnion, LexString, LexUnknown } from "@atproto/lexicon";

export type LexType = LexObject | LexArray | LexBoolean | LexInteger | LexString | LexUnknown | LexRefUnion | LexRef;

export const schema2lexicon = (
	schema: JSONSchema,
	meta: Pick<LexiconDoc, "id" | "description" | "revision">
): LexiconDoc => {
	if (typeof schema !== 'object' || schema === null || Array.isArray(schema)) {
		throw new Error('Invalid schema: expected an object at the root level');
	}

	const defs: Record<string, LexType> = {
		[(schema as any).id || "Schema"]: schema2lexUserType(schema as Exclude<JSONSchema, boolean>),
	};

	for (const [key, def] of Object.entries(schema.$defs || {})) {
		defs[key] = schema2lexUserType(def as Exclude<JSONSchema, boolean>);
	}

	return {
		lexicon: 1,
		...meta,
		defs,
	} as LexiconDoc;
};

export const schema2lexUserType = (
	schema: Exclude<JSONSchema, boolean>,
): LexType => {
	const type = schema.type;
	const description = schema.description;

	if(schema.$ref) {
		return {
			type: "ref",
			ref: schema.$ref.replace(/^#\/\$defs\//, ''),
			description,
		};
	};

	if (type == "boolean") return { type: "boolean", description };
	if (type == "string") return { type: "string", description };
	if (type == "number") return { type: "integer", description };
	if (type == "object") {
		const properties: Record<string, LexType> = {};
		for (const [key, value] of Object.entries(schema.properties || {})) {
			properties[key] = schema2lexUserType(value as Exclude<JSONSchema, boolean>);
		}
		return {
			type: "object",
			properties: properties as LexObject["properties"], // `properties` are a narrower type in LexUserType
			required: schema.required,
			description,
		} as LexObject;
	}
	if (type == "array") {
		return {
			type: "array",
			items: schema2lexUserType(schema.items as Exclude<JSONSchema, boolean>) as LexArray["items"],
			description,
		}
	}

	if (schema.oneOf) {
		return {
			type: "union",
			refs: schema.oneOf.map((subSchema) => {
				if (typeof subSchema === 'object' && subSchema !== null && '$ref' in subSchema) {
					const ref = subSchema.$ref as string;
					const refName = ref.replace(/^#\/\$defs\//, '');
					return refName;
				} else {
					console.error('Only $ref schemas are supported in oneOf');
					return "unknown";
				}
			}),
			description,
		};
	};

	return { type: "unknown" };
};
