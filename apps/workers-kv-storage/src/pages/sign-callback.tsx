import { useKeyPair } from "./keypair";
import * as ed from "@noble/ed25519";

export interface SignCallbackPageProps {
	message: string;
	path: string;
};

export const SignCallbackPage = ({
	message,
	path,
}: SignCallbackPageProps) => {
	const keys = useKeyPair();

	return (
		<div>
			{keys ? (
				<div>
					<h1>Please continue</h1>
					<p>
						<a href={`${path}?${new URLSearchParams({
							pubkey: keys.publicKey.toHex(),
							curve: "ed25519",
							signature: ed.sign(new TextEncoder().encode(message), keys.secretKey).toHex(),
						}).toString()}`}>
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
