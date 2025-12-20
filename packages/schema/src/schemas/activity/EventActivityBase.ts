import z from "zod";

export type EventActivityBase = z.infer<typeof EventActivityBaseSchema>;
export const EventActivityBaseSchema = z.object({
    id: z.string().optional(),
    name: z.string().meta({ description: "The name of the activity" }),
}).meta({
    id: "EventActivityBase",
});