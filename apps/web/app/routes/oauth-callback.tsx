import { CenteredLoader } from "../components/content/base/CenteredLoader";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useATProtoAuthStore } from "../lib/atproto/useATProtoStore";
import { Box, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function OauthCallbackRoute() {
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.hash.slice(1));
		console.log("OAuth callback received with params:", params.toString());

		const keys = ["state", "iss"];
		if (keys.some(key => !params.has(key))) {
			console.error("Missing required OAuth parameters. Received params:", params.toString());
			navigate("/", { replace: true });
			notifications.show({
				title: "Error",
				message: "Missing oauth callback parameters",
				color: "red",
			});
			return;
		}

		useATProtoAuthStore.getState().finishAuthorization(params).then((state) => {
			console.log("OAuth authorization finalized, navigating...");
			const to = (state.path || "/") + state.search + state.fragment;
			navigate(to, { replace: true });
		});
	}, []);

	return (
		<Box h="90vh" pt="xl">
			<CenteredLoader>
				Processing OAuth callback...
			</CenteredLoader>
		</Box>
	);
};
