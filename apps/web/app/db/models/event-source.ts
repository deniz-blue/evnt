import z from "zod";

export type EventDataSource = z.infer<typeof EventSourceSchema>;
export const EventSourceSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("local"),
		uuid: z.uuid(),
	}),
	z.object({
		type: z.literal("remote"),
		url: z.url(),
	}),
]);

export class UtilEventSource {
	static isLocal(source: EventDataSource): source is Extract<EventDataSource, { type: "local" }> {
		return source.type === "local";
	}

	static isRemote(source: EventDataSource): source is Extract<EventDataSource, { type: "remote" }> {
		return source.type === "remote";
	}

	static getKey(source: EventDataSource): string {
		if (this.isLocal(source)) {
			return `local::${source.uuid}`;
		} else {
			return `remote::${source.url}`;
		};
	}

	static fromKey(key: string): EventDataSource | null {
		const [type, value] = key.split("::", 2);
		if (!type || !value) return null;
		if (type === "local") {
			return {
				type: "local",
				uuid: value,
			};
		}
		if (type === "remote") {
			return {
				type: "remote",
				url: value,
			};
		}
		return null;
	}

	static newLocal(): EventDataSource {
		return {
			type: "local",
			uuid: crypto.randomUUID(),
		};
	}

	static newRemote(url: string): EventDataSource {
		return {
			type: "remote",
			url,
		};
	}
};

