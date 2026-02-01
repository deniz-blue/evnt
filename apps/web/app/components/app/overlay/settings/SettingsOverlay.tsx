import { Button, Divider, Drawer, Group, Kbd, Stack, Text } from "@mantine/core";
import { useQueryModalState } from "../../../../hooks/base/useQueryModalState";
import { LanguageSelect } from "./LanguageSelect";
import { useLocaleStore } from "../../../../stores/useLocaleStore";
import { TimezoneSelect } from "./TimezoneSelect";
import { IconExternalLink, IconSettings } from "@tabler/icons-react";
import { EVENT_REDIRECTOR_URL } from "../../../../constants";
import { ATProtoSettings } from "./ATProtoSettings";

export const useSettingsOverlay = () => useQueryModalState("settings", true);

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
				<Divider label="Localization" />

				<LanguageSelect
					value={language}
					onChange={lang => useLocaleStore.getState().setLanguage(lang)}
				/>

				<TimezoneSelect />

				<Divider label="event.nya.pub" />

				<Button
					component="a"
					href={EVENT_REDIRECTOR_URL + "/?" + new URLSearchParams({
						setInstanceUrl: window.location.origin,
						popup: "true",
					})}
					target="_blank"
					rightSection={<IconExternalLink size={16} />}
				>
					Set this Application as Default
				</Button>

				<Divider label="ATProto" />

				<ATProtoSettings />
			</Stack>
		</Drawer>
	);
};
