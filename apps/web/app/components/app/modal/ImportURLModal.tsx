import { Button, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { randomId } from "@mantine/hooks";
import { useState } from "react";
import { EventDataResolver } from "../../../lib/resolve/resolve";
import type { EventData } from "@evnt/schema";

export interface EventImportURLModalProps {
	onSubmit: (url: string, data: EventData) => void;
};

export const openEventImportURLModal = (props: EventImportURLModalProps) => {
	const modalId = randomId();
	modals.open({
		title: "Import Event from URL",
		size: "lg",
		modalId,
		children: (
			<EventImportURLModal
				onSubmit={(url, data) => {
					props.onSubmit(url, data);
					modals.close(modalId);
				}}
			/>
		),
	});
}

export const EventImportURLModal = ({
	onSubmit,
}: EventImportURLModalProps) => {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<Stack>
			<TextInput
				value={url}
				onChange={e => setUrl(e.currentTarget.value)}
				placeholder="URL to event JSON..."
				error={error}
				styles={{
					error: { whiteSpace: "pre-wrap" },
				}}
			/>
			<Button
				disabled={!url}
				loading={loading}
				onClick={async () => {
					setLoading(true);
					setError(null);
					try {
						const data = await EventDataResolver.fetch({ type: "remote", url });
						onSubmit(url, data);
					} catch (error) {
						setError("" + error);
					} finally {
						setLoading(false);
					}

					setLoading(false);
				}}
			>
				Import
			</Button>
		</Stack>
	);
}
