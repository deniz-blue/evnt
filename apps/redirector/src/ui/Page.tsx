import { useEffect, useState } from "react";
import { BroadcastChannelKey, getInstanceUrl } from "../main";

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
			<h2>event.nya.pub</h2>

			{message && (
				<p>
					{message}
				</p>
			)}

			{instanceUrl && (
				<p>
					Default instance: <a href={instanceUrl}>{new URL(instanceUrl).host}</a>
					<a style={{ marginLeft: "1em", fontSize: "0.8em" }} href={`/?clearInstanceUrl`}>
						clear
					</a>
				</p>
			)}

			<InstanceList params={params} />

			<p style={{ marginTop: "2em", fontSize: "0.9em", color: "gray" }}>
				<a style={{ fontSize: "0.8em" }} href="https://github.com/deniz-blue/events-format/blob/main/docs/APPS.md">
					what is this?
				</a>
			</p>
		</main>
	)
}

export const InstanceList = ({ params }: { params?: URLSearchParams }) => {
	const INSTANCES_URL = "https://raw.githubusercontent.com/deniz-blue/events-format/refs/heads/main/data/instances.json";
	const [data, setData] = useState<{
		instances: { url: string }[];
	} | null>(null);

	useEffect(() => {
		fetch(INSTANCES_URL)
			.then(res => res.json())
			.then(data => {
				data.instances.push({ url: "http://localhost:5173" });
				setData(data);
			});
	}, []);

	return (
		<ul>
			<span style={{ fontSize: "0.8em", color: "gray" }}>Available Instances:</span>
			{!data && (
				<li>Loading...</li>
			)}
			{data?.instances.map(instance => {
				const url = new URL(instance.url);

				return (
					<li key={url.origin}>
						<a href={`${url.origin}/${window.location.search}`}>
							{url.host}
						</a>
						<a style={{ marginLeft: "1em", fontSize: "0.8em" }} href={`/?${new URLSearchParams({
							setInstanceUrl: instance.url,
						}).toString() + (params ? `&${params.toString()}` : "")}`}>
							set default
						</a>
					</li>
				);
			})}
		</ul>
	);
};
