import { EventDataSchema } from "@repo/model";
import { z } from "zod";

export type Source = z.infer<typeof SourceSchema>;
export const SourceSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal("local"),
    }),
    z.object({
        type: z.literal('url'),
        data: z.url(),
    }),
]);

export type AppEvent = z.infer<typeof AppEventSchema>;
export const AppEventSchema = z.object({
    id: z.number().int().nonnegative().optional(),
    source: SourceSchema,
    timestamp: z.number().int().nonnegative(),
    data: EventDataSchema,
});
