import { ActionIcon, Code, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconPinned, IconPinnedOff, IconTrash } from "@tabler/icons-react";
import { useEventStore } from "../../../lib/stores/useEventStore";
import { useHomeStore } from "../../../lib/stores/useHomeStore";
import type { StoredEvent } from "../../../models/StoredEvent";
import { EVENT_REDIRECTOR_URL } from "../../../hooks/useEventRedirector";

export const EventContextMenu = ({ event }: { event: StoredEvent }) => {
    const isPinned = useHomeStore((state) => state.pinnedEventIds.includes(event.id!));
    const pinEvent = useHomeStore((state) => state.pinEvent);
    const unpinEvent = useHomeStore((state) => state.unpinEvent);

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
                    leftSection={isPinned ? <IconPinnedOff /> : <IconPinned />}
                    onClick={() => {
                        if (isPinned) {
                            unpinEvent(event.id!);
                            notifications.show({
                                message: "Event unpinned from Home",
                            });
                        } else {
                            pinEvent(event.id!);
                            notifications.show({
                                message: "Event pinned to Home",
                            });
                        }
                    }}
                >
                    {isPinned ? "Unpin from Home" : "Pin to Home"}
                </Menu.Item>
                {event.source.type === "url" && (
                    <Menu.Item
                        onClick={() => {
                            if(event.source.type !== "url") return;
                            const shareLink = `${EVENT_REDIRECTOR_URL}/?${new URLSearchParams({
                                action: "import",
                                url: event.source.data,
                            }).toString()}`;
                            navigator.clipboard.writeText(shareLink)
                                .then(() => notifications.show({
                                    message: "Share link copied to clipboard",
                                }));
                        }}
                    >
                        Copy Share Link
                    </Menu.Item>
                )}
                {event.source.type === "url" && (
                    <Menu.Item
                        onClick={() => {
                            useEventStore.getState().refetchEvent(event.id!);
                        }}
                    >
                        Refetch
                    </Menu.Item>
                )}
                {event.source.type === "url" && (
                    <Menu.Item
                        onClick={() => {
                            if(event.source.type !== "url") return;
                            navigator.clipboard.writeText(event.source.data)
                                .then(() => notifications.show({
                                    message: "Event URL copied to clipboard",
                                }));
                        }}
                    >
                        Copy Event Data URL
                    </Menu.Item>
                )}
                <Menu.Item
                    onClick={() => modals.open({
                        size: "xl",
                        title: "Event JSON Data",
                        children: (
                            <Code block>
                                {JSON.stringify(event.data, null, 2)}
                            </Code>
                        ),
                    })}
                >
                    View JSON
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(event.data, null, 2))
                            .then(() => notifications.show({
                                message: "Event JSON copied to clipboard",
                            }));
                    }}
                >
                    Copy JSON
                </Menu.Item>
                {event.id && (
                    <Menu.Item
                        leftSection={<IconTrash />}
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
