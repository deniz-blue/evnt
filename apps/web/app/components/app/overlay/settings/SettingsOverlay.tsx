import { Drawer } from "@mantine/core";
import { useQueryModalState } from "../../../../hooks/base/useQueryModalState";

export const useSettingsOverlay = () => useQueryModalState("settings");

export const SettingsOverlay = () => {
    const { isOpen, close } = useSettingsOverlay();

    return (
        <Drawer
            opened={isOpen}
            onClose={close}
            title="Settings"
            padding="md"
            size="md"
            position="right"
        >
            meow
        </Drawer>
    );
};
