import { Button, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { randomId } from "@mantine/hooks";
import { useState } from "react";
import { UtilEventSource, type EventSource } from "../../../db/models/event-source";

export interface EventImportURLModalProps {
	onSubmit: (source: EventSource) => void;
};

export const openEventImportURLModal = (props: EventImportURLModalProps) => {
	const modalId = randomId();
	modals.open({
		title: "Import Event from URL",
		size: "lg",
		modalId,
		children: (
			<EventImportURLModal
				onSubmit={(source) => {
					props.onSubmit(source);
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
						onSubmit(UtilEventSource.parse(url, false))
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
