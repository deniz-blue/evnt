import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useEventDetailsModal } from "../../../hooks/app/useEventDetailsModal";
import { useViewIndexModal } from "../../../hooks/app/useViewIndexModal";

export const LinkOpenHandler = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { key: eventDetailsKey, open: openEventDetails } = useEventDetailsModal();
	const { key: viewIndexKey, open: openViewIndex } = useViewIndexModal();
	const lastRef = useRef<string | null>(null);

	const deleteParams = (params: string[]) => {
		setSearchParams(prev => {
			const next = new URLSearchParams(prev);
			for (const param of params) next.delete(param);
			return next;
		});
	};

	useEffect(() => {
		if (lastRef.current === searchParams.toString()) return;
		lastRef.current = searchParams.toString();
		(async () => {
			const action = searchParams.get("action");

			if (action === "view-event") {
				const url = searchParams.get("url");
				if (url) {
					deleteParams(["action", "url"]);
					openEventDetails(url);
				}
			} else if (action === "view-index") {
				const indexUrl = searchParams.get("index");
				if (indexUrl) {
					deleteParams(["action", "index"]);
					const fullIndexUrl = indexUrl.startsWith("http") ? indexUrl : ("https://" + indexUrl);
					openViewIndex(fullIndexUrl);
				}
			}
		})();
	}, [searchParams]);

	return null;
};
