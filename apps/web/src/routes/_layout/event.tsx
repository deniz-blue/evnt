import { createFileRoute } from "@tanstack/react-router"
import z from "zod";
import { EventSourceSchema, UtilEventSource } from "../../db/models/event-source";
import { useEventQuery } from "../../db/useEventQuery";
import { Container, Stack, Text } from "@mantine/core";
import { EventDetailsContent } from "../../components/content/event/details/EventDetailsContent";
import type { EventEnvelope } from "../../db/models/event-envelope";
import { handleAsyncCopy, handleCopy } from "../../lib/util/copy";
import { useProvideAction } from "../../components/app/overlay/spotlight/useAction";
import { EventResolver } from "../../db/event-resolver";
import { IconBraces, IconClipboard, IconCode, IconEdit, IconReload, IconShare } from "@tabler/icons-react";
import { EventActions } from "../../lib/actions/event-actions";

const SearchParamsSchema = z.object({
	source: EventSourceSchema,
});

export const Route = createFileRoute("/_layout/event")({
	component: EventPage,
	validateSearch: SearchParamsSchema,
	staticData: {
		spaceless: true,
	},
})

function EventPage() {
	const { source } = Route.useSearch();
	const navigate = Route.useNavigate();
	const query = useEventQuery(source);

	useProvideAction({
		label: "Edit event",
		icon: <IconEdit />,
		disabled: !UtilEventSource.isEditable(source),
		onClick: () => navigate({
			to: "/edit",
			search: {
				source,
			},
		}),
	});

	useProvideAction({
		label: "Copy event share link",
		icon: <IconShare />,
		disabled: !UtilEventSource.isFromNetwork(source),
		onClick: handleCopy(
			EventActions.getShareLink(source) ?? "",
			"Event share link copied to clipboard",
		),
		id: "copy-event-share-link",
		deps: [source],
	});

	useProvideAction({
		label: "Copy event source",
		icon: <IconClipboard />,
		disabled: !UtilEventSource.isFromNetwork(source),
		onClick: handleCopy(
			source,
			"Event source copied to clipboard",
		),
		id: "copy-event-source",
		deps: [source],
	});

	useProvideAction({
		label: "Copy event JSON",
		icon: <IconBraces />,
		onClick: handleAsyncCopy(
			async (): Promise<string> => JSON.stringify(query.data?.data, null, 2) ?? "",
			"Event JSON copied to clipboard",
		),
		id: "copy-event-json",
		deps: [source, query.data],
	});

	useProvideAction({
		label: "Refetch event data",
		icon: <IconReload />,
		disabled: !UtilEventSource.isFromNetwork(source),
		onClick: () => EventResolver.update(source),
		id: "refetch-event",
		deps: [source, query.refetch],
	});

	useProvideAction({
		label: "Copy event embed link",
		icon: <IconCode />,
		disabled: !UtilEventSource.isFromNetwork(source),
		onClick: handleCopy(
			EventActions.getEmbedLink(source) ?? "",
			"Event embed link copied to clipboard",
		),
		id: "copy-event-embed-link",
		deps: [source],
	});

	useProvideAction({
		label: "View on pds.ls",
		icon: <Text span inline inherit fz="xs">PDS</Text>,
		disabled: UtilEventSource.getType(source) !== "at",
		onClick: () => window.open(`https://pds.ls/${source}`, "_blank"),
	});

	return (
		<Stack
			w="100%"
			align="center"
		>
			<Container
				size="md"
				p={0}
				w="100%"
				mih="100dvh"
				style={{
					boxShadow: "0 0 50px rgba(0,0,0,0.2)",
				}}
			>
				<Stack>
					<EventDetailsContent
						source={source}
						{...query?.data ?? {
							data: null,
						} as EventEnvelope}
					/>
				</Stack>
			</Container>
		</Stack>
	)
}
