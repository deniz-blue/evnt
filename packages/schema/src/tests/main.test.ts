import { describe, expect, test } from "vitest";
import { EventDataSchema } from "../schemas/EventData";

test("basic parsing", () => {
	expect(() => EventDataSchema.parse({})).toThrow();

	expect(() => EventDataSchema.parse({ v: 0, name: {} })).not.toThrow();
});

test("venueIds reference", () => {
	expect(() => EventDataSchema.parse({
		v: 0,
		name: {},
		venues: [
			{ id: "venue1", type: "unknown", name: {} },
		],
		instances: [
			{ venueIds: ["venue1"] },
		],
	})).not.toThrow();

	expect(() => EventDataSchema.parse({
		v: 0,
		name: {},
		venues: [
			{ id: "venue1", type: "unknown", name: {} },
		],
		instances: [
			{ venueIds: ["venue2"] },
		],
	})).toThrow();
});

describe("components", () => {
	test("known link component validated", () => {
		expect(() => EventDataSchema.parse({
			v: 0,
			name: {},
			components: [
				{ type: "link", data: { missing: "url field" } },
			],
		})).toThrow();

		expect(() => EventDataSchema.parse({
			v: 0,
			name: {},
			components: [
				{ type: "link", data: { url: "https://example.com" } },
			],
		})).not.toThrow();
	});

	test("unknown components", () => {
		expect(() => EventDataSchema.parse({
			v: 0,
			name: {},
			components: [
				{ type: "test-component", data: { some: "data" } },
			],
		})).not.toThrow();
	});
});

