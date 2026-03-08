import type { EventData } from "@evnt/schema";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { atom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { EventActions } from "../../lib/actions/event-actions";
import { FormPageTemplate } from "../form";
import { ActionIcon, Button, Group, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import type { EventSource } from "../../db/models/event-source";

export const Route = createFileRoute("/_layout/new")({
	component: NewPage,
	staticData: {
		hasEventForm: true,
	},
})

function NewPage() {
	const dataAtom = useMemo(() => atom<EventData | null>({ v: 0, name: {} }), []);

	const navigate = useNavigate();

	type Payload = { where: EventSource.Type; data: EventData };
	const mutation = useMutation({
		mutationFn: async ({ where, data }: Payload) => {
			if (where === "local") return await EventActions.createLocalEvent(data);
			if (where === "at") return await EventActions.createATProtoEvent(data);
			return null;
		},
		onSuccess: async (source) => {
			if (!source) return;
			navigate({ to: "/event", search: { source } });
		},
	});

	const create = useSetAtom(useMemo(() => atom(null, async (get, set, where: EventSource.Type) => {
		const data = get(dataAtom);
		if (!data) return;
		mutation.mutate({ where, data });
	}), [dataAtom, mutation]));

	return (
		<FormPageTemplate
			title="New Event"
			desc="Will be saved locally"
			loading={mutation.isPending}
			data={dataAtom}
			button={(
				<Menu>
					<Group gap={0}>
						<Button
							color="green"
							onClick={() => create("local")}
							loading={mutation.isPending}
						>
							Create
						</Button>
						<Menu.Target>
							<ActionIcon
								size="input-sm"
								color="green"
							>
								<IconChevronDown size={16} />
							</ActionIcon>
						</Menu.Target>
					</Group>
					<Menu.Dropdown>
						<Menu.Item
							onClick={() => create("at")}
						>
							Create on ATProto
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			)}
		/>
	)
}
