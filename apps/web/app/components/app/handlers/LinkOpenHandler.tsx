import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useEventDetailsModal } from "../../../hooks/app/useEventDetailsModal";
import { useViewIndexModal } from "../../../hooks/app/useViewIndexModal";

export const LinkOpenHandler = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { key: eventDetailsKey } = useEventDetailsModal();
	const { key: viewIndexKey } = useViewIndexModal();
	const lastRef = useRef<string | null>(null);

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
			} else if (action === "view-index") {
				const indexUrl = searchParams.get("index");
				if (indexUrl) {
					const newParams = new URLSearchParams();
					newParams.set(viewIndexKey, indexUrl.startsWith("http") ? indexUrl : ("https://" + indexUrl));
					newParams.delete("action");
					newParams.delete("url");
					setSearchParams(newParams);
				}
			}
		})();
	}, [searchParams]);

	return null;
};
