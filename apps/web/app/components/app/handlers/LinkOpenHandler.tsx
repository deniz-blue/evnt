import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useEventDetailsModal } from "../../../hooks/app/useEventDetailsModal";
import { useViewIndexModal } from "../../../hooks/app/useViewIndexModal";

export const LinkOpenHandler = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { open: openViewIndex } = useViewIndexModal();
	const lastRef = useRef<string | null>(null);

	const deleteParams = (params: string[]) => {
		// Mutation = no rerender
		for (const param of params)
			searchParams.delete(param);
		setSearchParams(searchParams);
	};

	useEffect(() => {
		if (lastRef.current === searchParams.toString()) return;
		lastRef.current = searchParams.toString();
		(async () => {
			const action = searchParams.get("action");

			if (action === "view-event") {
				const source = searchParams.get("source") || searchParams.get("url");
				if (source) {
					console.log("Opening event details for url", source);
					// deleteParams(["action", "url"]);
					navigate(`/event?${new URLSearchParams({ source }).toString()}`);
				}
			} else if (action === "view-index") {
				const indexUrl = searchParams.get("index");
				if (indexUrl) {
					const fullIndexUrl = indexUrl.startsWith("http") ? indexUrl : ("https://" + indexUrl);
					deleteParams(["action", "index"]);
					setTimeout(() => openViewIndex(fullIndexUrl), 0);
				}
			}
		})();
	}, [searchParams]);

	return null;
};
