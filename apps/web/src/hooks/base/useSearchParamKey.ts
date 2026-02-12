import { useNavigate } from "@tanstack/react-router";
import { useSearch, type RegisteredRouter } from "@tanstack/react-router";
import { useCallback } from "react";

type Search = Partial<Parameters<NonNullable<Parameters<typeof useSearch<RegisteredRouter, undefined, false>>[0]["select"]>>[0]>;
export const useSearchParamKey = <Key extends keyof Search>(key: Key) => {
	const navigate = useNavigate();

	// shitscript
	const useValue = () => useSearch({
		strict: false,
		select: (search) => search[key as keyof typeof search],
	}) as unknown as Search[Key];

	const open = useCallback((value: string) => {
		navigate({ search: { [key]: value }, to: "." });
	}, [key]);

	const openLink = useCallback((value: string) => {
		// Is this broken now?
		const params = new URLSearchParams(window.location.search);
		params.set(key, value);
		return `?${params.toString()}`;
	}, [key]);

	const close = useCallback(() => {
		navigate({ search: { [key]: undefined }, to: "." });
	}, [key]);

	const toggle = useCallback((value?: string) => {
		navigate({ search: (prev) => ({ ...prev, [key]: (value !== undefined ? prev[key] === value : prev[key] !== undefined) ? undefined : value }), to: "." });
	}, [key]);

	return {
		useValue,
		key,
		open,
		openLink,
		close,
		toggle,
	};
};
