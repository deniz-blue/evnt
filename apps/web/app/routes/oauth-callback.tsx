import { CenteredLoader } from "../components/content/base/CenteredLoader";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useATProtoAuthStore } from "../stores/useATProtoStore";

export default function OauthCallbackRoute() {
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.hash.slice(1));
		console.log("OAuth callback received with params:", params.toString());
		useATProtoAuthStore.getState().finalizeAuthorization(params).then(() => {
			console.log("OAuth authorization finalized, navigating to home.");
			navigate("/", { replace: true });
		});
	}, []);

	return (
		<CenteredLoader>
			Processing OAuth callback...
		</CenteredLoader>
	);
};
