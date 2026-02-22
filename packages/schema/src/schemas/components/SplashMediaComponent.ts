import z from "zod";
import { MediaSchema } from "../../types/Media";

export type SplashMediaRole = "background" | (string & {});
export const SplashMediaRoleSchema = z.string() as z.ZodType<SplashMediaRole>;

export type SplashMediaComponent = z.infer<typeof SplashMediaComponentSchema>;
export const SplashMediaComponentSchema = z.object({
	roles: SplashMediaRoleSchema.array(),
	media: MediaSchema,
});
