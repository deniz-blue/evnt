import type { EventData } from '@evnt/format';
import { useTranslations } from "../../hooks/useTranslations";

export const EventCard = ({
    value,
}: {
    value: EventData;
}) => {
    const t = useTranslations();

    return (
        <container>
            <text>
                <b>{t(value.name)}</b>
                <subtext>{t(value.description)}</subtext>
            </text>
        </container>
    );
}
