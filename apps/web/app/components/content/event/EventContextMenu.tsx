import { ActionIcon, Code, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCopy, IconDotsVertical, IconJson, IconPinned, IconPinnedOff, IconQrcode, IconReload, IconShare, IconTrash } from "@tabler/icons-react";
import { useHomeStore } from "../../../stores/useHomeStore";
import { EVENT_REDIRECTOR_URL } from "../../../constants";
import { useTranslations } from "../../../stores/useLocaleStore";
import { handleAsyncCopy, handleCopy } from "../../../lib/util/copy";
import { withConfirmation } from "../../../lib/util/confirm";
import { UtilEventSource, type EventDataSource } from "../../../db/models/event-source";
import { DataDB } from "../../../db/data-db";
import { AsyncLoader } from "../../data/AsyncLoader";
import type { EventData } from "@evnt/schema";
import { EventActions } from "../../../lib/actions/events";
import { QRCode } from "../../../lib/util/qrcode";

export const EventContextMenu = ({ source }: { source: EventDataSource }) => {
	const isPinned = useHomeStore((state) => state.pinnedEvents.some(e => (
		UtilEventSource.equals(e, source)
	)));

	const t = useTranslations();

	const onClickPinUnpin = () => {
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
	}

	const getShareLink = () => {
		if (source.type !== "remote") return;
		const shareLink = `${EVENT_REDIRECTOR_URL}/?${new URLSearchParams({
			action: "view-event",
			url: source.url,
		}).toString()}`;

		return shareLink
	}

	const getData = async () => (await DataDB.get(UtilEventSource.getKey(source)!))?.data ?? null;

	const onClickViewJSON = () => modals.open({
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
	});

	const onClickShareQRCode = () => modals.open({
		size: "md",
		children: (
			<QRCode value={getShareLink() || ""} />
		),
	});

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
					onClick={onClickPinUnpin}
				>
					{isPinned ? "Unpin from Home" : "Pin to Home"}
				</Menu.Item>
				{source.type === "remote" && (
					<Menu.Sub>
						<Menu.Sub.Target>
							<Menu.Sub.Item leftSection={<IconShare size={14} />}>
								Share...
							</Menu.Sub.Item>
						</Menu.Sub.Target>
						<Menu.Sub.Dropdown>
							<Menu.Item
								leftSection={<IconCopy size={14} />}
								onClick={handleCopy(getShareLink()!, "Share link copied to clipboard")}
							>
								Copy Link
							</Menu.Item>
							<Menu.Item
								leftSection={<IconCopy size={14} />}
								onClick={handleCopy(`[Event](<${getShareLink()!}>)`, "Share link copied to clipboard")}
							>
								Copy Link (Markdown)
							</Menu.Item>
							<Menu.Item
								leftSection={<IconQrcode size={14} />}
								onClick={onClickShareQRCode}
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
							onClick={onClickViewJSON}
						>
							View JSON
						</Menu.Item>
						<Menu.Item
							onClick={handleAsyncCopy(async () => JSON.stringify(await getData(), null, 2), "Event JSON copied to clipboard")}
						>
							Copy JSON
						</Menu.Item>
					</Menu.Sub.Dropdown>
				</Menu.Sub>
				{source.type === "remote" && (
					<Menu.Item
						leftSection={<IconReload size={14} />}
						onClick={() => {
							// useEventStore.getState().refetchEvent(event.id!);
						}}
					>
						Refetch
					</Menu.Item>
				)}
				{source.type === "remote" && (
					<Menu.Item
						onClick={handleCopy(source.url, "Event Data URL copied to clipboard")}
					>
						Copy Event Data URL
					</Menu.Item>
				)}

				{source && (
					<Menu.Item
						leftSection={<IconTrash size={14} />}
						color="red"
						onClick={withConfirmation("Are you sure you want to delete this event?", () => {
							EventActions.deleteEvent(source);
						})}
					>
						Delete
					</Menu.Item>
				)}
			</Menu.Dropdown>
		</Menu>
	);
};
