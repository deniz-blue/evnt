import { ActionIcon, Code, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconPinned, IconPinnedOff, IconTrash } from "@tabler/icons-react";
import { useEventStore } from "../../../lib/stores/useEventStore";
import type { EventData } from "@repo/model";
import { useHomeStore } from "../../../lib/stores/useHomeStore";

export const EventContextMenu = ({ value, id }: { value: EventData; id?: number }) => {
    const isPinned = useHomeStore((state) => state.pinnedEventIds.includes(id!));
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
                            unpinEvent(id!);
                            notifications.show({
                                message: "Event unpinned from Home",
                            });
                        } else {
                            pinEvent(id!);
                            notifications.show({
                                message: "Event pinned to Home",
                            });
                        }
                    }}
                >
                    {isPinned ? "Unpin from Home" : "Pin to Home"}
                </Menu.Item>
                <Menu.Item
                    onClick={() => modals.open({
                        children: (
                            <Code block>
                                {JSON.stringify(value, null, 2)}
                            </Code>
                        ),
                    })}
                >
                    View JSON
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(value, null, 2))
                            .then(() => notifications.show({
                                message: "Event JSON copied to clipboard",
                            }));
                    }}
                >
                    Copy JSON
                </Menu.Item>
                {id && (
                    <Menu.Item
                        leftSection={<IconTrash />}
                        color="red"
                        onClick={() => modals.openConfirmModal({
                            children: "Are you sure you want to delete this event?",
                            labels: { confirm: "Delete", cancel: "Cancel" },
                            onConfirm: () => {
                                useEventStore.getState().deleteLocalEvent(id!);
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
