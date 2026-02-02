export const trynull = <T>(fn: () => T | null | undefined): T | null => {
	try {
		return fn() ?? null;
	} catch (e) {
		return null;
	}
};

export const tryCatch = <T>(fn: () => T): [T, null] | [null, Error] => {
	try {
		return [fn(), null];
	} catch (e) {
		return [null, e as Error];
	}
};

export const tryCatchAsync = async <T>(fn: () => Promise<T>): Promise<[T, null] | [null, Error]> => {
	try {
		return [await fn(), null];
	} catch (e) {
		return [null, e as Error];
	}
};
