import { Drawer, Group, Kbd, Text } from "@mantine/core";
import { useSearchParamKey } from "../../../../hooks/base/useSearchParamKey";
import { IconSettings } from "@tabler/icons-react";
import { Settings } from "./Settings";

export const useSettingsOverlay = () => useSearchParamKey("settings", true);

export const SettingsOverlay = () => {
	const { isOpen, close } = useSettingsOverlay();

	return (
		<Drawer
			opened={isOpen}
			onClose={close}
			keepMounted
			title={(
				<Group align="center" gap={4}>
					<IconSettings />
					<Text inline span fw="bold">Settings</Text>
					<Kbd size="sm">Ctrl + ,</Kbd>
				</Group>
			)}
			padding="md"
			size="md"
			position="right"
		>
			<Settings />
		</Drawer>
	);
};
