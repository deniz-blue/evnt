import { Text, Tooltip } from "@mantine/core";
import { useLocaleStore } from "../../../stores/useLocaleStore";

export const TimeSnippetLabel = ({ value }: { value: string }) => {
	const timezone = useLocaleStore(store => store.timezone);

    return (
        <Tooltip label={`${value} - UTC`}>
            <Text span inline>
                {new Intl.DateTimeFormat(undefined, {
					hour: "numeric",
					minute: "numeric",
					hour12: false,
					timeZone: timezone,
				}).format(new Date(`${new Date().toISOString().split('T')[0]}T${value}:00Z`))}
            </Text>
        </Tooltip>
    );
};
