import { ZodError } from "zod";

export const Errors = {
	NotFound: () => ({ error: "Not found", code: "NOT_FOUND" } as const),
	ZodValidation: (err: ZodError) => ({
		error: "Validation error",
		code: "VALIDATION_ERROR",
		issues: err.issues,
	} as const),
};
