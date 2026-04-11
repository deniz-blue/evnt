import { assertType, describe, test } from "vitest";
import { EventComponentSchema } from "../src/schemas/components/EventComponent";

describe("jsonschema", () => {
	test("event components", () => {
		console.log(JSON.stringify(EventComponentSchema.toJSONSchema(), null, 2));
		assertType(Array.isArray(EventComponentSchema.toJSONSchema().oneOf))
	})
});
