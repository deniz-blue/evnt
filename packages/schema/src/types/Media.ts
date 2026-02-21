import z from "zod";
import { TranslationsSchema } from "./Translations";

export type MediaSize = z.infer<typeof MediaSizeSchema>;
export const MediaSizeSchema = z.object({
	width: z.number().int().nonnegative().meta({ description: "The width of the media in pixels" }),
	height: z.number().int().nonnegative().meta({ description: "The height of the media in pixels" }),
}).meta({
	id: "MediaSize",
	title: "Media Size",
	description: "The dimensions of a media item",
});

export type MediaSource = z.infer<typeof MediaSourceSchema>;
export const MediaSourceSchema = z.object({
	url: z.url().meta({ description: "The URL of the media" }),
	size: MediaSizeSchema.optional().meta({ description: "The dimensions of the media" }),
	type: z.string().optional().meta({ description: "The MIME type of the media" }),
	// role?: string; // e.g. "thumbnail", "full", "preview"
}).meta({
	id: "MediaSource",
	title: "Media Source",
	description: "A source for a media item",
});

export type MediaPresentation = z.infer<typeof MediaPresentationSchema>;
export const MediaPresentationSchema = z.object({
	blurhash: z.string().optional().meta({ description: " A BlurHash representation of the media item" }),
	dominantColor: z.string()
		.refine((s): s is `#${string}` => s.startsWith("#") && s.length === 7, { message: "Must be a valid hex color code starting with a hashtag" })
		.optional()
		.meta({ description: "The dominant color of the media item in hex rgb format (must start with a hashtag)" }),
}).meta({
	id: "MediaPresentation",
	title: "Media Presentation",
	description: "The presentation details of a media item",
});

export type Media = z.infer<typeof MediaSchema>;
export const MediaSchema = z.object({
	sources: MediaSourceSchema.array().min(1).meta({ description: "The sources for the media item" }),
	alt: TranslationsSchema.optional().meta({ description: "Alternative text for the media item" }),
	presentation: MediaPresentationSchema.optional().meta({ description: "The presentation details of the media item" }),

	// caption: TranslationsSchema.optional().meta({ description: "A caption for the media item" }),
	// kind?: "image" | "video" | "audio"
}).meta({
	id: "Media",
	title: "Media",
	description: "A media item, such as an image or video",
});
