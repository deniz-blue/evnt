import z from "zod";

export const fetchValidate = async <T>(
    url: string,
    schema: z.ZodType<T>,
): Promise<[T, null] | [null, Error]> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return [null, new Error(`Network error: ${response.status} ${response.statusText}`)];
        }

        const data = await response.json();
        const result = schema.safeParse(data);
        if (result.success) {
            return [result.data, null];
        } else {
            return [null, new Error(`Validation error\n${z.prettifyError(result.error)}`)];
        }
    } catch(e) {
		return [null, e instanceof Error ? e : new Error(String(e))];
    }
};
