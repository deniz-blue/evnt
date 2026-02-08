import { Button, Container, Group, Stack, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import type { EventData } from "@evnt/schema";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { EventEditor } from "../components/editor/event/EventEditor";
import { EventActions } from "../lib/actions/event-actions";
import { useEventDetailsModal } from "../hooks/app/useEventDetailsModal";
import { useNavigate, useSearchParams } from "react-router";
import type { EditAtom } from "../components/editor/edit-atom";
import { CenteredLoader } from "../components/content/base/CenteredLoader";
import { DataDB } from "../db/data-db";
import { UtilEventSource } from "../db/models/event-source";

// Shitcode 101
export default function EditEventPage() {
	const [searchParams] = useSearchParams();
	const source = UtilEventSource.local(searchParams.get("uuid") || "");

	const dataAtom = useMemo(() => atom<EventData | null>(null), []);

	const [loading, setLoading] = useState(false);
	const { key } = useEventDetailsModal();
	const navigate = useNavigate();
	const save = useSetAtom(useMemo(() => atom(null, async (get, set) => {
		const data = get(dataAtom);
		if (!data) return;
		setLoading(true);
		await EventActions.updateLocalEvent(source, data);
		setLoading(false);
		navigate(`/list?${new URLSearchParams({ [key]: source })}`);
	}), [dataAtom, setLoading]));

	const fetchData = useSetAtom(useMemo(() => atom(null, async (get, set) => {
		const uuid = searchParams.get("uuid");
		if (!uuid) return;
		setLoading(true);
		try {
			const data = await DataDB.get(UtilEventSource.local(uuid));
			if (!data) throw new Error("Event not found");
			set(dataAtom, data.data);
		} finally {
			setLoading(false);
		}
	}), [searchParams, setLoading]));

	useEffect(() => {
		fetchData();
	}, [searchParams]);

	return (
		<Container>
			<Stack gap={0}>
				<Group justify="space-between" align="center">
					<Title order={2}>
						Edit Event
					</Title>
					<Group>
						<Button
							color="green"
							onClick={save}
							loading={loading}
						>
							Save
						</Button>
					</Group>
				</Group>
				<EditEventPageWrapper
					data={dataAtom}
				/>
			</Stack>
		</Container>
	);
};

export const EditEventPageWrapper = ({ data }: { data: EditAtom<EventData | null> }) => {
	const isLoading = useAtomValue(useMemo(() => atom(get => get(data) === null), [data]));

	if (isLoading) return <CenteredLoader />;

	return (
		<EventEditor
			data={data as EditAtom<EventData>}
		/>
	);
};
