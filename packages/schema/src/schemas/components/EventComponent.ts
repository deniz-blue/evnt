import z from "zod";
import { LinkComponentSchema } from "./LinkComponent";

export type EventComponent = z.infer<typeof EventComponentSchema>;
export const EventComponentSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("link"),
        data: LinkComponentSchema,
    }),
]).meta({ id: "EventComponent" });
