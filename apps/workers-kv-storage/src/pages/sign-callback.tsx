import { useEffect } from "hono/jsx";
import { useKeyPair } from "./keypair";
import * as ed from "@noble/ed25519";

export interface SignCallbackPageProps {
	message: string;
	path: string;
	search?: [string, string][];
};

export const SignCallbackPage = ({
	message,
	path,
	search,
}: SignCallbackPageProps) => {
	const keys = useKeyPair();

	const newParams = new URLSearchParams([
		...(search ?? []),
		["curve", "ed25519"],
	]);
	const signature = keys ? ed.sign(new TextEncoder().encode(message), keys.secretKey).toHex() : "";
	const pubkey = keys?.publicKey.toHex() || "";
	const href = `${path}?${newParams.toString()}`
		.replace("SIGNATURE", signature)
		.replace("PUBLIC_KEY", pubkey)

	useEffect(() => {
		if (!keys) return;
		console.log("Redirecting with signature", { message, signature, pubkey, href });
		window.location.href = href;
	}, [keys, href]);

	return (
		<div>
			{keys ? (
				<div>
					<h1>Please continue</h1>
					<p>
						<a href={href}>
							Continue...
						</a>
					</p>
				</div>
			) : (
				<p>Loading key pair...</p>
			)}
		</div>
	);
};
