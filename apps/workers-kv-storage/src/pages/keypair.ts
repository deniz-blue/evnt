import * as ed from "@noble/ed25519";
import { sha512 } from '@noble/hashes/sha2.js';
import { useEffect, useState } from "hono/jsx/dom";

ed.hashes.sha512 = sha512;

export type KeyPair = {
	publicKey: Uint8Array;
	secretKey: Uint8Array;
};

const storageKey = "evnt-kv-storage:keypair";
export const saveKeyPair = (keypair: KeyPair) => localStorage.setItem(storageKey, JSON.stringify({
	publicKey: Array.from(keypair.publicKey),
	secretKey: Array.from(keypair.secretKey),
}));

export const loadKeyPair = () => {
	const item = localStorage.getItem(storageKey);
	if (!item) return null;
	try {
		const obj = JSON.parse(item);
		return {
			publicKey: new Uint8Array(obj.publicKey),
			secretKey: new Uint8Array(obj.secretKey),
		} as KeyPair;
	} catch (e) {
		console.error("Failed to parse key pair from localStorage", e);
		return null;
	}
};

export const generateKeyPair = () => {
	return ed.keygen();
};

export const useKeyPair = () => {
	const [keys, setKeys] = useState<KeyPair | null>(null);

	useEffect(() => {
		let pair = loadKeyPair();
		if (!pair) {
			console.log("No existing key pair found, generating new one...");
			pair = generateKeyPair();
			saveKeyPair(pair);
		};
		console.log("Loaded key pair:", {
			publicKey: pair.publicKey.toHex(),
			secretKey: pair.secretKey.toHex(),
		});
		setKeys(pair);
	}, []);

	return keys;
};
