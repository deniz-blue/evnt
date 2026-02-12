import { useCallback } from "react";
import { useQueryParam, type UrlUpdateType } from "use-query-params";

export const useSearchParamKey = (key: string, replaceType: UrlUpdateType = "replace") => {
	const [value = null, setValue] = useQueryParam(key);

	const isOpen = value !== null;

	const open = useCallback((value: string) => {
		setValue(value, replaceType);
	}, [key, setValue, replaceType]);

	const openLink = useCallback((value: string) => {
		// Is this broken now?
		const params = new URLSearchParams(window.location.search);
		params.set(key, value);
		return `?${params.toString()}`;
	}, [key, value]);

	const close = useCallback(() => {
		setValue(null, replaceType);
	}, [key, setValue, replaceType]);

	const toggle = useCallback((value: string) => {
		if (value)
			close();
		else
			open(value);
	}, [key, setValue, replaceType]);

	return {
		isOpen,
		open,
		openLink,
		close,
		toggle,
		value,
		key,
	};
};
