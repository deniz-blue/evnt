import { useEffect, useMemo } from "react";
import type { EventData } from "@evnt/schema";
import { atom, useSetAtom } from "jotai";
import { useEventDetailsModal } from "../hooks/app/useEventDetailsModal";
import { useNavigate, useSearchParams } from "react-router";
import { UtilEventSource, type EventSource } from "../db/models/event-source";
import { useMutation } from "@tanstack/react-query";
import { useEventQueries } from "../db/useEventQuery";
import { tryCatch } from "../lib/util/trynull";
import { EventMutator } from "../db/event-mutator";
import { FormPageTemplate } from "./form";
import { Alert, Button, Stack } from "@mantine/core";
import { useATProtoAuthStore } from "../lib/atproto/useATProtoStore";

// Shitcode 101
export default function EditEventPage() {
	const [searchParams] = useSearchParams();
	const [source, sourceParseError] = tryCatch(() => UtilEventSource.parse(searchParams.get("source") || "", true));
	const signedInDid = useATProtoAuthStore(store => store.agent?.sub);

	const dataAtom = useMemo(() => atom<EventData | null>(null), []);
	const setDataAtom = useSetAtom(dataAtom);

	const [query] = useEventQueries(source ? [source] : []);

	useEffect(() => {
		if (!query?.query?.data) return;
		setDataAtom(prev => prev ?? query.query.data?.data ?? null);
	}, [query?.query?.data ?? null]);

	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: async ({ data, source }: { data: EventData, source: EventSource }) => {
			console.log("Updating event", { source, data });
			await EventMutator.update(source, data);
		},
		onSuccess: async (data, { source }) => {
			navigate(`/event?${new URLSearchParams({ source }).toString()}`);
		}
	});

	const save = useSetAtom(useMemo(() => atom(null, async (get, set) => {
		const data = get(dataAtom);
		if (!source || !data) return;
		console.log("Saving data", { source, data });
		mutation.mutate({ data, source });
	}), [dataAtom, source, mutation]));

	const loading = (mutation.isPending || query?.query.isLoading) && !sourceParseError;

	return (
		<FormPageTemplate
			title="Edit Event"
			desc="Edit an existing event saved locally"
			error={sourceParseError ? "Invalid event source provided in URL!" : undefined}
			continueText="Save"
			onContinue={save}
			loading={loading}
			data={dataAtom}
			notice={(
				<Stack>
					{source && UtilEventSource.isAt(source) && !signedInDid && (
						<Alert
							title="Not signed in"
							color="yellow"
							my="md"
						>
							<Stack gap={4}>
								You are not signed in to ATProto!
							</Stack>
						</Alert>
					)}
				</Stack>
			)}
		/>
	);
};
