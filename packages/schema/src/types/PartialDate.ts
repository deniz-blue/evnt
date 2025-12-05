import z from "zod";

export type PartialDate = z.infer<typeof PartialDateSchema>;
export const PartialDateSchema = z.string();
