import { describe, expect, test } from "vitest";
import { EventDataSchema } from "../src/schemas/EventData";

test("basic parsing", () => {
	expect(() => EventDataSchema.parse({})).toThrow();

	expect(() => EventDataSchema.parse({ v: 0, name: {} })).not.toThrow();
});

test("venueIds reference", () => {
	expect(() => EventDataSchema.parse({
		v: 0,
		name: {},
		venues: [
			{ id: "venue1", $type: "directory.evnt.venue.physical", name: {} },
		],
		instances: [
			{ venueIds: ["venue1"] },
		],
	})).not.toThrow();

	expect(() => EventDataSchema.parse({
		v: 0,
		name: {},
		venues: [
			{ id: "venue1", $type: "directory.evnt.venue.physical", name: {} },
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
				{ $type: "directory.evnt.component.link", missing: "url field" },
			],
		})).toThrow();

		expect(() => EventDataSchema.parse({
			v: 0,
			name: {},
			components: [
				{ $type: "directory.evnt.component.link", url: "https://example.com" },
			],
		})).not.toThrow();
	});

	test("unknown components", () => {
		expect(() => EventDataSchema.parse({
			v: 0,
			name: {},
			components: [
				{ $type: "test-component", some: "data" },
			],
		})).not.toThrow();
	});
});

