import { useCallback } from "react";
import { useSearchParams } from "react-router";

export const useQueryModalState = (key: string, replaceAll?: boolean) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const isOpen = searchParams.has(key);
	const value = searchParams.get(key) || null;

	const open = useCallback((value: string, replace = false) => {
		setSearchParams(prev => {
			const newParams = new URLSearchParams(prev);
			newParams.set(key, value);
			return newParams;
		}, { replace: replaceAll ?? replace });
	}, [key, setSearchParams, replaceAll]);

	const openLink = useCallback((value: string) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set(key, value);
		return `?${newParams.toString()}`;
	}, [key, searchParams]);

	const close = useCallback((replace = false) => {
		setSearchParams(prev => {
			const newParams = new URLSearchParams(prev);
			newParams.delete(key);
			return newParams;
		}, { replace: replaceAll ?? replace });
	}, [key, setSearchParams, replaceAll]);

	const toggle = useCallback((value: string) => {
		if (isOpen && value === value) {
			close();
		} else {
			open(value);
		}
	}, [isOpen, value, open, close]);

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
