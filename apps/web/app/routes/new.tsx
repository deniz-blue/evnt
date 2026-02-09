import { useMemo } from "react";
import type { EventData } from "@evnt/schema";
import { atom, useSetAtom } from "jotai";
import { EventActions } from "../lib/actions/event-actions";
import { useEventDetailsModal } from "../hooks/app/useEventDetailsModal";
import { useNavigate } from "react-router";
import { FormPageTemplate } from "./form";
import { useMutation } from "@tanstack/react-query";

export default function NewEventPage() {
	const dataAtom = useMemo(() => atom<EventData | null>({ v: 0, name: {} }), []);

	const { key } = useEventDetailsModal();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: async (data: EventData) => {
			return await EventActions.createLocalEvent(data);
		},
		onSuccess: async (source) => {
			navigate(`/list?${new URLSearchParams({ [key]: source }).toString()}`);
		},
	});

	const create = useSetAtom(useMemo(() => atom(null, async (get, set) => {
		const data = get(dataAtom);
		if (!data) return;
		mutation.mutate(data);
	}), [dataAtom, mutation]));

	return (
		<FormPageTemplate
			title="New Event"
			desc="Will be saved locally"
			continueText="Create"
			onContinue={create}
			loading={mutation.isPending}
			data={dataAtom}
		/>
	);
}
