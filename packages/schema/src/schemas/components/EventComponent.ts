import z from "zod";
import { LinkComponentSchema } from "./LinkComponent";
import { unstable } from "../schema-util";
import { SourceComponentSchema } from "./SourceComponent";
import { SplashMediaComponentSchema } from "./SplashMediaComponent";

export type EventComponent = z.infer<typeof EventComponentSchema>;
export const EventComponentSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("link"),
		data: LinkComponentSchema,
	}),
	z.object({
		type: z.literal("source"),
		data: SourceComponentSchema,
	}).meta({ description: unstable(5) }),
	z.object({
		type: z.literal("splashMedia"),
		data: SplashMediaComponentSchema,
	})
]).meta({ id: "EventComponent" });
