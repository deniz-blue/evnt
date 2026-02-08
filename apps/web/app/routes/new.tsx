import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import type { EventData } from "@evnt/schema";
import { atom, useSetAtom } from "jotai";
import { EventEditor } from "../components/editor/event/EventEditor";
import { EventActions } from "../lib/actions/event-actions";
import { useEventDetailsModal } from "../hooks/app/useEventDetailsModal";
import { useFetcher, useNavigate } from "react-router";

export default function NewEventPage() {
	const dataAtom = useMemo(() => atom<EventData>({ v: 0, name: {} }), []);

	const [loading, setLoading] = useState(false);
	const { key } = useEventDetailsModal();
	const navigate = useNavigate();
	const create = useSetAtom(useMemo(() => atom(null, async (get, set) => {
		const data = get(dataAtom);
		setLoading(true);
		const source = await EventActions.createLocalEvent(data);
		setLoading(false);
		navigate(`/list?${new URLSearchParams({ [key]: source })}`);
	}), [dataAtom, setLoading]));

	return (
		<Container p={0}>
			<Stack gap={0}>
				<Group justify="space-between" align="start" wrap="nowrap">
					<Stack gap={0}>
						<Title order={2}>
							New Event
						</Title>
						<Text size="sm" c="dimmed">
							Will be saved locally
						</Text>
					</Stack>
					<Group>
						<Button
							color="green"
							onClick={create}
							loading={loading}
						>
							Create
						</Button>
					</Group>
				</Group>
				<EventEditor
					data={dataAtom}
				/>
			</Stack>
		</Container>
	);
};
