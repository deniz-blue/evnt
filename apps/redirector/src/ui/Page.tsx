import { useEffect, useState } from "react";
import { BroadcastChannelKey, getInstanceUrl, IsDeveloperMode } from "../main";

export interface PageProps {
	message?: string;
	params?: URLSearchParams;
};

export const Page = ({
	message,
	params,
}: PageProps) => {
	const [instanceUrl, setInstance] = useState<string | null>(getInstanceUrl());

	useEffect(() => {
		new BroadcastChannel(BroadcastChannelKey).onmessage = () => {
			setInstance(getInstanceUrl());
		};
	}, []);

	return (
		<main>
			<span style={{ fontSize: "1.2em", fontFamily: "monospace" }}>
				<span>
					{"⟶ "}
				</span>
				<span style={{ color: "gray" }}>
					event.nya.pub
				</span>
			</span>

			{message && (
				<p>
					{message}
				</p>
			)}

			{instanceUrl && (
				<p>
					<span style={{ fontWeight: "bold" }}>Your Default:</span> <a href={instanceUrl}>
						{instanceUrl.startsWith("web+evnt://") ? "web+evnt" : new URL(instanceUrl).host}
					</a>
					<a style={{ marginLeft: "1em", fontSize: "0.8em" }} href={`/?clearInstanceUrl`}>
						[unset]
					</a>
				</p>
			)}

			<InstanceList params={params} />

			<p style={{ marginTop: "2em", fontSize: "0.9em", color: "gray" }}>
				<a style={{ fontSize: "0.8em" }} href="https://github.com/deniz-blue/evnt#readme" target="_blank" rel="noopener noreferrer">
					what is this?
				</a>
			</p>

			{/* <StorageAccessGranter /> */}
		</main>
	)
}

export const StorageAccessGranter = () => {
	const [state, setState] = useState<PermissionState | null>(null);

	useEffect(() => {
		(async () => {
			const perm = await navigator.permissions.query({ name: "storage-access" });
			setState(perm.state);
			perm.onchange = () => {
				setState(perm.state);
			};
		})();
	}, []);

	const requestStorageAccess = async () => {
		try {
			await document.requestStorageAccess();
		} catch (e) {
			console.error("Storage access request failed:", e);
			alert("Storage access request failed. See console for details.");
		}
	};

	if (state !== "prompt") return null;

	return (
		<p style={{ color: "gray" }}>
			<button onClick={requestStorageAccess}>Grant Storage Access</button> to enable changing default instance on other sites.
		</p>
	);
};

export const InstanceList = ({ params }: { params?: URLSearchParams }) => {
	const INSTANCES_URL = "https://raw.githubusercontent.com/deniz-blue/events-format/refs/heads/main/data/instances.json";
	const PROTOCOL = "web+evnt";
	const [data, setData] = useState<{
		instances: { url: string }[];
	} | null>(null);

	useEffect(() => {
		fetch(INSTANCES_URL)
			.then(res => res.json())
			.then(data => {
				if (IsDeveloperMode) {
					data.instances.push({ url: "http://localhost:5173" });
					data.instances.push({ url: PROTOCOL + "://" });
				};

				setData(data);
			});
	}, []);

	return (
		<ul>
			<span style={{ fontSize: "0.8em", color: "gray" }}>Applications:</span>
			{!data && (
				<li>Loading...</li>
			)}
			{data?.instances.map(instance => {
				const url = new URL(instance.url);
				const isProtocol = url.protocol.replace(":", "") == PROTOCOL;

				return (
					<li key={url.href}>
						<a href={isProtocol ? `${url.protocol}//${window.location.search}` : `${url.origin}/${window.location.search}`}>
							{isProtocol ? PROTOCOL : url.host}
						</a>
						{(url.hostname === "localhost") ? (
							<span
								style={{ marginLeft: "1em", fontSize: "0.8em", color: "gray" }}
							>
								(developers only)
							</span>
						) : (
							<a style={{ marginLeft: "1em", fontSize: "0.8em" }} href={`/?${new URLSearchParams({
								setInstanceUrl: instance.url,
							}).toString() + (params ? `&${params.toString()}` : "")}`}>
								[set default]
							</a>
						)}
					</li>
				);
			})}
		</ul>
	);
};
