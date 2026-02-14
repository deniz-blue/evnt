import { Button, Stack, TextInput } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { useState } from "react";
import { UtilEventSource } from "../../../db/models/event-source";
import { AsyncAction } from "../../data/AsyncAction";
import { EventActions } from "../../../lib/actions/event-actions";

export const ImportURLModal = ({
	context,
	id: modalId,
}: ContextModalProps<{}>) => {
	const [url, setUrl] = useState("");
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
			<AsyncAction
				action={async () => {
					try {
						const source = UtilEventSource.parse(url, false);
						await EventActions.createEventFromSource(source);
						context.closeModal(modalId);
					} catch (error) {
						setError("" + error);
					}
				}}
			>
				{({ loading, onClick }) => (
					<Button
						disabled={!url}
						loading={loading}
						onClick={onClick}
					>
						Import
					</Button>
				)}
			</AsyncAction>
		</Stack>
	);
}
