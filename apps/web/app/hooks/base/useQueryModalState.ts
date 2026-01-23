import { useCallback } from "react";
import { useSearchParams } from "react-router";

export const useQueryModalState = (key: string, replaceAll?: boolean) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const isOpen = searchParams.has(key);
    const value = searchParams.get(key) || null;

    const open = useCallback((value: string, replace = false) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(key, value);
        setSearchParams(newParams, { replace: replaceAll ?? replace });
    }, [key, searchParams, setSearchParams]);

    const openLink = useCallback((value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(key, value);
        return `?${newParams.toString()}`;
    }, [key, searchParams]);

    const close = useCallback((replace = false) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        setSearchParams(newParams, { replace: replaceAll ?? replace });
    }, [key, searchParams, setSearchParams]);

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
