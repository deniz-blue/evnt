import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import type { EventData } from "@evnt/schema";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { EventEditor } from "../components/editor/event/EventEditor";
import { useSearchParams } from "react-router";
import type { EditAtom } from "../components/editor/edit-atom";
import { CenteredLoader } from "../components/content/base/CenteredLoader";
import { UtilEventSource } from "../db/models/event-source";
import { EventResolver } from "../db/resolve/resolve";

export default function FormPage() {
	const [searchParams] = useSearchParams();
	const sourceParam = searchParams.get("data-source") || "";
	const dataParam = searchParams.get("data") || "";
	const redirectToParam = searchParams.get("redirect-to") || "/";
	const titleParam = searchParams.get("title") || "Form";
	const descParam = searchParams.get("desc") || "";
	const continueTextParam = searchParams.get("continue-text") || "Continue";

	const dataAtom = useMemo(() => atom<EventData | null>(null), []);

	const [loading, setLoading] = useState(false);
	const save = useSetAtom(useMemo(() => atom(null, async (get, set) => {
		const data = get(dataAtom);
		if (!data) return;
		setLoading(true);
		window.location.href = `${redirectToParam}?${new URLSearchParams({ data: JSON.stringify(data) })}`;
	}), [dataAtom, redirectToParam, setLoading]));

	const fetchData = useSetAtom(useMemo(() => atom(null, async (get, set) => {
		if (dataParam) {
			try {
				const data = JSON.parse(dataParam) as EventData;
				set(dataAtom, data);
			} catch (e) {
				console.error("Failed to parse event data from URL", e);
			}
		} else if (sourceParam) {
			setLoading(true);
			try {
				const source = UtilEventSource.is(sourceParam, false) ? sourceParam : null;
				if (!source) throw new Error("Invalid event source");
				const resolved = await EventResolver.resolve(source);
				if (!resolved.data) throw new Error("Failed to resolve event data");
				set(dataAtom, resolved.data);
			} catch (e) {
				console.error("Failed to fetch event data from source", e);
			} finally {
				setLoading(false);
			}
		} else {
			set(dataAtom, { name: {}, v: 0 });
		}
	}), [sourceParam, dataParam, setLoading]));

	useEffect(() => {
		fetchData();
	}, [searchParams]);

	return (
		<Container p={0}>
			<Stack gap={0}>
				<Group justify="space-between" align="start" wrap="nowrap">
					<Stack gap={0}>
						<Title order={2}>
							{titleParam}
						</Title>
						<Text size="sm" c="dimmed">
							{descParam}
						</Text>
					</Stack>
					<Group>
						<Button
							color="green"
							onClick={save}
							loading={loading}
						>
							{continueTextParam}
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
