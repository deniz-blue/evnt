import { useEffect, useState } from "react";
import { useEventDetailsModal } from "../../../../hooks/app/useEventDetailsModal";
import { BaseOverlay } from "../base/BaseOverlay";
import type { EventData } from "@evnt/schema";
import { useEventStore } from "../../../../stores/useEventStore";
import { EventDetailsContent } from "../../../content/event/details/EventDetailsContent";
import { CenteredLoader } from "../../../content/base/CenteredLoader";

export const EventDetailsOverlay = () => {
    const { isOpen, close, value: eventId } =  useEventDetailsModal();

    return (
        <BaseOverlay
            opened={isOpen}
            onClose={close}
        >
            <EventDetailsOverlayHandler id={eventId || ""} />
        </BaseOverlay>
    )
};

export const EventDetailsOverlayHandler = ({ id }: { id: string }) => {
    const [data, setData] = useState<EventData | null>(null);

    useEffect(() => {
        if(!id) return;
        const record = useEventStore.getState().data.find(e => e.id === Number(id));
        if(!record) return;
        setData(record.data);
    }, [id]);

    if(!data) return <CenteredLoader />;
    
    return (
        <EventDetailsContent
            data={data}
        />
    );
};
