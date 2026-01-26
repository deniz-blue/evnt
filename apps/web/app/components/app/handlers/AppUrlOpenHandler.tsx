import { App } from "@capacitor/app";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export const AppUrlOpenHandler = () => {
	const navigate = useNavigate();

	useEffect(() => {
		App.addListener("appUrlOpen", (data) => {
			const url = new URL(data.url);
			navigate(url.pathname + url.search + url.hash);
		});

		App.getLaunchUrl().then((data) => {
			if (data && data.url) {
				const url = new URL(data.url);
				navigate(url.pathname + url.search + url.hash);
			}
		});

		return () => {
			App.removeAllListeners();
		};
	}, []);

	return null;
};
