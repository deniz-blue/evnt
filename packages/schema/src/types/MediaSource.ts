import z from "zod";

export type MediaDimensions = z.infer<typeof MediaDimensionsSchema>;
export const MediaDimensionsSchema = z.object({
	width: z.number().int().nonnegative().meta({ description: "The width of the media in pixels" }),
	height: z.number().int().nonnegative().meta({ description: "The height of the media in pixels" }),
}).meta({
	id: "MediaDimensions",
	title: "Media Dimensions",
	description: "The dimensions of a media item",
});

const BaseMediaSourceSchema = z.object({
	dimensions: MediaDimensionsSchema.optional().meta({ description: "The dimensions of the media in pixels" }),
	mimeType: z.string().optional().meta({ description: "The MIME type of the media" }),
	// role?: string; // e.g. "thumbnail", "full", "preview"
});

export type MediaSource = z.infer<typeof MediaSourceSchema>;
export const MediaSourceSchema = z.object({
	url: z.url().meta({ description: "The URL of the media source" }),
}).extend(BaseMediaSourceSchema.shape).meta({
	id: "MediaSource",
	title: "Media Source",
	description: "A source for a media item.",
});

// export type MediaSourceAtproto = z.infer<typeof MediaSourceAtprotoSchema>;
// export const MediaSourceAtprotoSchema = z.object({
// 	kind: z.literal("atproto").meta({ description: "Indicates that this media source is an Atproto blob" }),
// 	cid: z.string().meta({ description: "The CID of the Atproto blob containing the media" }),
// 	did: z.string().meta({ description: "The DID of the Atproto blob containing the media" }),
// }).extend(BaseMediaSourceSchema.shape).meta({
// 	id: "MediaSourceAtproto",
// 	title: "Media Source (Atproto)",
// 	description: "A media source that is an Atproto blob",
// });

// export type MediaSourceUrl = z.infer<typeof MediaSourceUrlSchema>;
// export const MediaSourceUrlSchema = z.object({
// 	url: z.url().meta({ description: "The URL of the media source" }),
// }).extend(BaseMediaSourceSchema.shape).meta({
// 	id: "MediaSourceUrl",
// 	title: "Media Source (URL)",
// 	description: "A media source that is a URL",
// });

// export type MediaSource = z.infer<typeof MediaSourceSchema>;
// export const MediaSourceSchema = z.discriminatedUnion("kind", [MediaSourceAtprotoSchema, MediaSourceUrlSchema]).meta({
// 	id: "MediaSource",
// 	title: "Media Source",
// 	description: "A source for a media item",
// });
