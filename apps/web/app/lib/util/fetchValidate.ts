import z from "zod";

export const fetchValidate = async <T>(
    url: string,
    schema: z.ZodType<T>,
): Promise<{ ok: true; value: T } | { ok: false; error: string }> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return { ok: false, error: `Network error: ${response.status} ${response.statusText}` };
        }

        const data = await response.json();
        const result = schema.safeParse(data);
        if (result.success) {
            return { ok: true, value: result.data };
        } else {
            return { ok: false, error: `Validation error\n${z.prettifyError(result.error)}` };
        }
    } catch(e) {
        return { ok: false, error: `Fetch error: ${e instanceof Error ? e.message : String(e)}` };
    }
};
