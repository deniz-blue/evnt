import { ActionIcon, Code, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconJson, IconPinned, IconPinnedOff, IconReload, IconShare, IconTrash } from "@tabler/icons-react";
import { useEventStore } from "../../../stores/useEventStore";
import { useHomeStore } from "../../../stores/useHomeStore";
import type { StoredEvent } from "../../../models/StoredEvent";
import { EVENT_REDIRECTOR_URL } from "../../../constants";
import { useTranslations } from "../../../stores/useLocaleStore";

export const EventContextMenu = ({ event }: { event: StoredEvent }) => {
    const isPinned = useHomeStore((state) => state.pinnedEventIds.includes(event.id!));
    const t = useTranslations();

    const onClickPinUnpin = () => {
        if (isPinned) {
            useHomeStore.getState().unpinEvent(event.id!);
            notifications.show({
                message: "Event unpinned from Home",
            });
        } else {
            useHomeStore.getState().pinEvent(event.id!);
            notifications.show({
                message: "Event pinned to Home",
            });
        }
    }

    const getShareLink = () => {
        if (event.source.type !== "url") return;
        const shareLink = `${EVENT_REDIRECTOR_URL}/?${new URLSearchParams({
            action: "import",
            url: event.source.data,
        }).toString()}`;

        return shareLink
    }

    const copy = (value: string, message: string) => {
        navigator.clipboard.writeText(value)
            .then(() => notifications.show({
                message,
            }));
    };

    const onClickCopyLink = () => {
        if (event.source.type !== "url") return;
        navigator.clipboard.writeText(getShareLink()!)
            .then(() => notifications.show({
                message: "Share link copied to clipboard",
            }));
    }

    const onClickCopyMarkdownLink = () => {
        if (event.source.type !== "url") return;
        copy(`[${t(event.data.name)}](<${getShareLink()!}>)`, "Share link copied to clipboard");
    }

    const onClickViewJSON = () => modals.open({
        size: "xl",
        title: "Event JSON Data",
        children: (
            <Code block>
                {JSON.stringify(event.data, null, 2)}
            </Code>
        ),
    });

    const onClickCopyJSON = () => {
        copy(JSON.stringify(event.data, null, 2), "Event JSON copied to clipboard");
    }

    const onClickCopySourceURL = () => {
        if (event.source.type !== "url") return;
        copy(event.source.data, "Event Data URL copied to clipboard");
    }

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
                {event.source.type === "url" && (
                    <Menu.Sub>
                        <Menu.Sub.Target>
                            <Menu.Sub.Item leftSection={<IconShare size={14} />}>
                                Share...
                            </Menu.Sub.Item>
                        </Menu.Sub.Target>
                        <Menu.Sub.Dropdown>
                            <Menu.Item
                                onClick={onClickCopyLink}
                            >
                                Copy Link
                            </Menu.Item>
                            <Menu.Item
                                onClick={onClickCopyMarkdownLink}
                            >
                                Copy Link (Markdown)
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
                            onClick={onClickCopyJSON}
                        >
                            Copy JSON
                        </Menu.Item>
                    </Menu.Sub.Dropdown>
                </Menu.Sub>
                {event.source.type === "url" && (
                    <Menu.Item
                        leftSection={<IconReload size={14} />}
                        onClick={() => {
                            useEventStore.getState().refetchEvent(event.id!);
                        }}
                    >
                        Refetch
                    </Menu.Item>
                )}
                {event.source.type === "url" && (
                    <Menu.Item
                        onClick={onClickCopySourceURL}
                    >
                        Copy Event Data URL
                    </Menu.Item>
                )}

                {event.id && (
                    <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => modals.openConfirmModal({
                            children: "Are you sure you want to delete this event?",
                            labels: { confirm: "Delete", cancel: "Cancel" },
                            onConfirm: () => {
                                useEventStore.getState().deleteLocalEvent(event.id!);
                            },
                        })}
                    >
                        Delete
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
};
