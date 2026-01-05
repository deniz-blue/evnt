import { z } from "zod";

export const JsonPatchPathSchema = z.string().startsWith("/");

export type JsonPatchOp = z.infer<typeof JsonPatchOpSchema>;
export const JsonPatchOpSchema = z.discriminatedUnion("op", [
    z.object({
        op: z.literal("add"),
        path: JsonPatchPathSchema,
        value: z.unknown(),
    }),
    z.object({
        op: z.literal("remove"),
        path: JsonPatchPathSchema,
    }),
    z.object({
        op: z.literal("replace"),
        path: JsonPatchPathSchema,
        value: z.unknown(),
    }),
    z.object({
        op: z.literal("move"),
        from: JsonPatchPathSchema,
        path: JsonPatchPathSchema,
    }),
    z.object({
        op: z.literal("copy"),
        from: JsonPatchPathSchema,
        path: JsonPatchPathSchema,
    }),
    z.object({
        op: z.literal("test"),
        path: JsonPatchPathSchema,
        value: z.unknown(),
    }),
]);

export type JsonPatch = z.infer<typeof JsonPatchSchema>;
export const JsonPatchSchema = z.array(JsonPatchOpSchema);
