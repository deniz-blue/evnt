import z from "zod";

export type SourceComponent = z.infer<typeof SourceComponentSchema>;
export const SourceComponentSchema = z.object({
	$type: z.literal("directory.evnt.component.source").meta({ description: "The type of the component" }),
	url: z.string().meta({ description: "The URL of the source" }),
}).meta({ id: "SourceComponent", description: "A source of information about the event, such as a news article, a social media post, an official announcement etc." });
