import { useKeyPair } from "./keypair";
import * as ed from "@noble/ed25519";

export const Homepage = () => {
	const keys = useKeyPair();

	return (
		<div>
			<h1>Workers KV Storage</h1>
			{keys ? (
				<div>
					<p><strong>Public Key:</strong> {keys.publicKey.toHex()}</p>
					<p><strong>Secret Key:</strong> {keys.secretKey.toHex()}</p>
					<p>
						<a href={`/api/v0/events/new?${new URLSearchParams({
							pubkey: keys.publicKey.toHex(),
							curve: "ed25519",
							signature: ed.sign(new TextEncoder().encode("new-event"), keys.secretKey).toHex(),
						}).toString()}`}>
							Create New Event
						</a>
					</p>
				</div>
			) : (
				<p>Loading key pair...</p>
			)}
		</div>
	);
};
