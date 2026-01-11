import { Drawer, Stack } from "@mantine/core";
import { useQueryModalState } from "../../../../hooks/base/useQueryModalState";
import { LanguageSelect } from "./LanguageSelect";
import { useLocaleStore } from "../../../../stores/useLocaleStore";
import { TimezoneSelect } from "./TimezoneSelect";

export const useSettingsOverlay = () => useQueryModalState("settings");

export const SettingsOverlay = () => {
	const { isOpen, close } = useSettingsOverlay();
	const language = useLocaleStore((state) => state.language);

	return (
		<Drawer
			opened={isOpen}
			onClose={close}
			title="Settings"
			padding="md"
			size="md"
			position="right"
		>
			<Stack>
				<LanguageSelect
					value={language}
					onChange={lang => useLocaleStore.getState().setLanguage(lang)}
				/>

				{/* <TimezoneSelect /> */}
			</Stack>
		</Drawer>
	);
};
