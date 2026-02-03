import { ActionIcon, Code, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCopy, IconDotsVertical, IconJson, IconPinned, IconPinnedOff, IconQrcode, IconReload, IconShare, IconTrash } from "@tabler/icons-react";
import { useHomeStore } from "../../../stores/useHomeStore";
import { EVENT_REDIRECTOR_URL } from "../../../constants";
import { handleAsyncCopy, handleCopy } from "../../../lib/util/copy";
import { withConfirmation } from "../../../lib/util/confirm";
import { UtilEventSource, type EventSource } from "../../../db/models/event-source";
import { DataDB } from "../../../db/data-db";
import { AsyncLoader } from "../../data/AsyncLoader";
import type { EventData } from "@evnt/schema";
import { EventActions } from "../../../lib/actions/events";
import { QRCode } from "../../../lib/util/qrcode";
import { useMediaQuery } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKey } from "../../../db/useEventQuery";

export const EventContextMenu = ({ source }: { source: EventSource }) => {
	const noHover = useMediaQuery("(hover: none)");
	const isPinned = useHomeStore((state) => state.pinnedEvents.includes(source));
	const queryClient = useQueryClient();

	const getData = async () => (await DataDB.get(source!))?.data ?? null;

	const actions = {
		ToggleHomePin: () => {
			if (isPinned) {
				useHomeStore.getState().unpinEvent(source);
				notifications.show({
					message: "Event unpinned from Home",
				});
			} else {
				useHomeStore.getState().pinEvent(source);
				notifications.show({
					message: "Event pinned to Home",
				});
			}
		},

		ShareLink: handleCopy(EventActions.getShareLink(source), "Share link copied to clipboard"),
		ShareLinkMarkdown: handleCopy(`[Event](<${EventActions.getShareLink(source)!}>)`, "Share link copied to clipboard"),
		QRCode: () => modals.open({
			size: "md",
			children: (
				<QRCode value={EventActions.getShareLink(source)} />
			),
		}),
		CopyJSON: handleAsyncCopy(async () => JSON.stringify(await getData(), null, 2), "Event JSON copied to clipboard"),
		ViewJSON: () => modals.open({
			size: "xl",
			title: "Event JSON Data",
			children: (
				<AsyncLoader fetcher={getData}>
					{(data: EventData | null) => (
						<Code block>
							{JSON.stringify(data, null, 2)}
						</Code>
					)}
				</AsyncLoader>
			),
		}),
		Refetch: async () => {
			await queryClient.invalidateQueries({
				queryKey: eventQueryKey(source),
			});
		},
		CopySourceURL: handleCopy(source, "Event Data URL copied to clipboard"),
		Delete: withConfirmation("Are you sure you want to delete this event?", () => EventActions.deleteEvent(source)),
	} as const;

	return (
		<Menu>
			<Menu.Target>
				<ActionIcon
					variant="subtle"
					color="gray"
					size="sm"
				>
					<IconDotsVertical />
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item
					leftSection={isPinned ? <IconPinnedOff size={14} /> : <IconPinned size={14} />}
					onClick={actions.ToggleHomePin}
				>
					{isPinned ? "Unpin from Home" : "Pin to Home"}
				</Menu.Item>
				{UtilEventSource.isFromNetwork(source) && (
					<Menu.Sub>
						<Menu.Sub.Target>
							<Menu.Sub.Item
								leftSection={<IconShare size={14} />}
								onClick={noHover ? undefined : actions.ShareLink}
							>
								Share...
							</Menu.Sub.Item>
						</Menu.Sub.Target>
						<Menu.Sub.Dropdown>
							<Menu.Item
								leftSection={<IconCopy size={14} />}
								onClick={actions.ShareLink}
							>
								Copy Link
							</Menu.Item>
							<Menu.Item
								leftSection={<IconCopy size={14} />}
								onClick={actions.ShareLinkMarkdown}
							>
								Copy Link (Markdown)
							</Menu.Item>
							<Menu.Item
								leftSection={<IconQrcode size={14} />}
								onClick={actions.QRCode}
							>
								Show QR Code
							</Menu.Item>
						</Menu.Sub.Dropdown>
					</Menu.Sub>
				)}
				<Menu.Sub>
					<Menu.Sub.Target>
						<Menu.Sub.Item leftSection={<IconJson size={14} />}>
							JSON...
						</Menu.Sub.Item>
					</Menu.Sub.Target>
					<Menu.Sub.Dropdown>
						<Menu.Item
							onClick={actions.ViewJSON}
						>
							View JSON
						</Menu.Item>
						<Menu.Item
							onClick={actions.CopyJSON}
						>
							Copy JSON
						</Menu.Item>
					</Menu.Sub.Dropdown>
				</Menu.Sub>
				{UtilEventSource.isFromNetwork(source) && (
					<Menu.Item
						leftSection={<IconReload size={14} />}
						onClick={actions.Refetch}
					>
						Refetch
					</Menu.Item>
				)}
				{UtilEventSource.isFromNetwork(source) && (
					<Menu.Item
						onClick={actions.CopySourceURL}
					>
						Copy Event Data URL
					</Menu.Item>
				)}

				{source && (
					<Menu.Item
						leftSection={<IconTrash size={14} />}
						color="red"
						onClick={actions.Delete}
					>
						Delete
					</Menu.Item>
				)}
			</Menu.Dropdown>
		</Menu>
	);
};
