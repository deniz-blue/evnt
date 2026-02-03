export type Result<T, E = Error> = [T, null] | [null, E];

export const trynull = <T>(fn: () => T | null | undefined): T | null => {
	return tryCatch(fn)[0] ?? null;
};

export const tryCatch = <T>(fn: () => T): Result<T> => {
	try {
		return [fn(), null];
	} catch (e) {
		return [null, e as Error];
	}
};

export const tryCatchAsync = async <T>(fn: Promise<T> | (() => Promise<T>)): Promise<Result<T>> => {
	try {
		return [await (typeof fn === "function" ? fn() : fn), null];
	} catch (e) {
		return [null, e as Error];
	}
};
