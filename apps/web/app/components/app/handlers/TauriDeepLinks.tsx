import { useEffect } from "react";
import { useNavigate } from "react-router";
import { onOpenUrl, getCurrent } from "@tauri-apps/plugin-deep-link";

export const TauriDeepLinks = () => {
	const navigate = useNavigate();

	useEffect(() => {
		getCurrent().then((urls) => {
			if (!urls || !urls.length) return;
			navigate(urls[0]!);
		});

		const unlistenPromise = onOpenUrl((urls) => {
			navigate(urls[0]!);
		});

		return () => {
			unlistenPromise.then((unlisten) => unlisten());
		};
	}, []);

	return null;
};