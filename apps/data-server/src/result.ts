import { resolver } from "hono-openapi";
import z, { ZodError, ZodType } from "zod";

export const APISuccess = <T extends ZodType>(schema: T) => ({
    description: "Success",
    content: {
        "application/json": {
            schema: resolver(schema),
        },
    },
} as const);

export const APIErrorCodeSchema = z.enum([
    "NOT_FOUND",
    "VALIDATION_ERROR",
]);
export type APIErrorCode = z.infer<typeof APIErrorCodeSchema>;

export const APIError = <ErrorCodes extends APIErrorCode[], Detail = undefined>(codes: ErrorCodes, detail?: Detail) => ({
    description: "Error",
    content: {
        "application/json": {
            schema: resolver(z.object({
                error: z.string(),
                code: z.enum(codes),
                // This is stupid
                ...(detail ? { detail } : {}),
            })),
        },
    },
} as const);

export const APIErrorResponseSchema = z.object({
    error: z.string(),
});

export const APINotFound = () => APIError(["NOT_FOUND"] as const);
export const notFound = (m?: string) => ({ error: m || "Not found", code: "NOT_FOUND" } as const);

export const APIZodValidationError = () => APIError(["VALIDATION_ERROR"] as const, z.any());
export const zodValidationError = (err: ZodError) => ({
    code: "VALIDATION_ERROR" as const,
    error: z.formatError(err),
    // Return structured error details
    detail: err,
});

