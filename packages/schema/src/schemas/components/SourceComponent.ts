import z from "zod";
import { unstable } from "../schema-util";

export type SourceComponent = z.infer<typeof SourceComponentSchema>;
export const SourceComponentSchema = z.object({
	url: z.string().meta({ description: "The URL of the source" }),
}).meta({ id: "SourceComponent", description: unstable(5) });
