import z from "zod";
import { MediaSchema } from "../../types/Media";

export type SplashMediaRole = "background" | (string & {});
export const SplashMediaRoleSchema = z.string() as z.ZodType<SplashMediaRole>;

export type SplashMediaComponent = z.infer<typeof SplashMediaComponentSchema>;
export const SplashMediaComponentSchema = z.object({
	$type: z.literal("directory.evnt.component.splashMedia").meta({ description: "The type of the component" }),
	roles: SplashMediaRoleSchema.array(),
	media: MediaSchema,
});
