import { Drawer, Group, Kbd, Stack, Text } from "@mantine/core";
import { useQueryModalState } from "../../../../hooks/base/useQueryModalState";
import { LanguageSelect } from "./LanguageSelect";
import { useLocaleStore } from "../../../../stores/useLocaleStore";
import { TimezoneSelect } from "./TimezoneSelect";
import { IconSettings } from "@tabler/icons-react";

export const useSettingsOverlay = () => useQueryModalState("settings");

export const SettingsOverlay = () => {
	const { isOpen, close } = useSettingsOverlay();
	const language = useLocaleStore((state) => state.language);

	return (
		<Drawer
			opened={isOpen}
			onClose={close}
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
			<Stack>
				<LanguageSelect
					value={language}
					onChange={lang => useLocaleStore.getState().setLanguage(lang)}
				/>

				<TimezoneSelect />
			</Stack>
		</Drawer>
	);
};
