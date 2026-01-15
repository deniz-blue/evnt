export const trynull = <T>(fn: () => T | null | undefined): T | null => {
	try {
		return fn() ?? null;
	} catch (e) {
		return null;
	}
};
