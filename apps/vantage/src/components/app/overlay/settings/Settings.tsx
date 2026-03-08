import { LanguageSelect } from "./LanguageSelect";
import { TimezoneSelect } from "./TimezoneSelect";
import { IconExternalLink, IconSettings } from "@tabler/icons-react";
import { EVENT_REDIRECTOR_URL } from "../../../../constants";
import { ATProtoSettings } from "./ATProtoSettings";
import { Button, Divider, Stack } from "@mantine/core";
import { useLocaleStore } from "../../../../stores/useLocaleStore";
import { useCacheEventsStore } from "../../../../lib/cache/useCacheEventsStore";
import { AsyncAction } from "../../../data/AsyncAction";
import { EventsGC } from "../../../../db/gc";

export const Settings = () => {
	const language = useLocaleStore((state) => state.language);

	return (
		<Stack>
			<Divider label="Localization" />

			<LanguageSelect
				value={language}
				onChange={lang => useLocaleStore.getState().setLanguage(lang)}
			/>

			<TimezoneSelect />

			<Divider label="ATProto" />

			<ATProtoSettings />

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

			<Divider label="Maintenance" />

			<Button
				color="red"
				onClick={() => {
					useCacheEventsStore.setState({ cacheByPartialDate: {} });
					useCacheEventsStore.getState().init();
				}}
			>
				Clear and Rebuild Cache
			</Button>

			<AsyncAction
				action={() => EventsGC.deleteUntracked()}
			>
				{({ loading, onClick }) => (
					<Button
						color="red"
						onClick={onClick}
					>
						Delete Untracked Event Data
					</Button>
				)}
			</AsyncAction>

		</Stack>
	);
};
