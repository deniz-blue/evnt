import z from "zod";
import { unstable } from "../schemas/schema-util";
import { TranslationsSchema } from "./Translations";

export type MediaSize = z.infer<typeof MediaSizeSchema>;
export const MediaSizeSchema = z.object({
	width: z.number().int().nonnegative().meta({ description: "The width of the media in pixels" }),
	height: z.number().int().nonnegative().meta({ description: "The height of the media in pixels" }),
}).meta({
	id: "MediaSize",
	title: "Media Size",
	description: unstable(6) + " The dimensions of a media item",
});

export type MediaSource = z.infer<typeof MediaSourceSchema>;
export const MediaSourceSchema = z.object({
	url: z.url().meta({ description: "The URL of the media" }),
	size: MediaSizeSchema.optional().meta({ description: "The dimensions of the media" }),
	type: z.string().optional().meta({ description: "The MIME type of the media" }),
}).meta({
	id: "MediaSource",
	title: "Media Source",
	description: unstable(6) + " A source for a media item",
});

export type Media = z.infer<typeof MediaSchema>;
export const MediaSchema = z.object({
	sources: MediaSourceSchema.array().min(1).meta({ description: "The sources for the media item" }),
	altText: TranslationsSchema.optional().meta({ description: "Alternative text for the media item" }),
	caption: TranslationsSchema.optional().meta({ description: "A caption for the media item" }),
	blurhash: z.string().optional().meta({ description: " A BlurHash representation of the media item" }),
	dominantColor: z.string().optional().meta({ description: "The dominant color of the media item in hex format" }),
}).meta({
	id: "Media",
	title: "Media",
	description: unstable(6) + " A media item, such as an image or video",
});
