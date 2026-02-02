import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useEventDetailsModal } from "../../../hooks/app/useEventDetailsModal";

export const LinkOpenHandler = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { key: eventDetailsKey } = useEventDetailsModal();
	const lastRef = useRef<string | null>(null);

	const clearParams = useCallback((params: string[]) => {
		const newParams = new URLSearchParams(searchParams);
		params.forEach(p => newParams.delete(p));
		setSearchParams(newParams);
	}, [searchParams]);

	useEffect(() => {
		if (lastRef.current === searchParams.toString()) return;
		lastRef.current = searchParams.toString();
		(async () => {
			const action = searchParams.get("action");

			if (action === "view-event") {
				const url = searchParams.get("url");
				if (url) {
					const newParams = new URLSearchParams();
					newParams.set(eventDetailsKey, url);
					newParams.delete("action");
					newParams.delete("url");
					setSearchParams(newParams);
				}
			}
		})();
	}, [searchParams]);

	return null;
};
