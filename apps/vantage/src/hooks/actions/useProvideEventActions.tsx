import { useProvideAction } from "../../components/app/overlay/spotlight/useAction";
import { UtilEventSource, type EventSource } from "../../db/models/event-source";
import type { EventEnvelope } from "../../db/models/event-envelope";
import { handleAsyncCopy, handleCopy } from "../../lib/util/copy";
import { EventResolver } from "../../db/event-resolver";
import { IconBraces, IconClipboard, IconCode, IconEdit, IconReload, IconShare } from "@tabler/icons-react";
import { EventActions } from "../../lib/actions/event-actions";
import { useNavigate } from "@tanstack/react-router";
import { Text } from "@mantine/core";

export const useProvideEventActions = ({
	source,
	data,
}: {
	source: EventSource;
	data: EventEnvelope["data"] | null;
}) => {
	const navigate = useNavigate();

	useProvideAction({
		label: "Edit event",
		icon: <IconEdit />,
		disabled: !UtilEventSource.isEditable(source),
		category: "Event",
		execute: () => navigate({
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
		category: "Event",
		execute: handleCopy(
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
		category: "Event",
		execute: handleCopy(
			source,
			"Event source copied to clipboard",
		),
		id: "copy-event-source",
		deps: [source],
	});

	useProvideAction({
		label: "Copy event JSON",
		category: "Event",
		icon: <IconBraces />,
		execute: handleAsyncCopy(
			async (): Promise<string> => JSON.stringify(data, null, 2) ?? "",
			"Event JSON copied to clipboard",
		),
		id: "copy-event-json",
		deps: [source, data],
	});

	useProvideAction({
		label: "Refetch event data",
		category: "Event",
		icon: <IconReload />,
		disabled: !UtilEventSource.isFromNetwork(source),
		execute: () => EventResolver.update(source),
		id: "refetch-event",
		deps: [source],
	});

	useProvideAction({
		label: "Copy event embed link",
		category: "Event",
		icon: <IconCode />,
		disabled: !UtilEventSource.isFromNetwork(source),
		execute: handleCopy(
			EventActions.getEmbedLink(source) ?? "",
			"Event embed link copied to clipboard",
		),
		id: "copy-event-embed-link",
		deps: [source],
	});

	useProvideAction({
		label: "View on pds.ls",
		category: "Event",
		icon: <Text span inline inherit fz="xs">PDS</Text>,
		disabled: UtilEventSource.getType(source) !== "at",
		execute: () => window.open(`https://pds.ls/${source}`, "_blank"),
	});
};
