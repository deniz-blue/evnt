import { useEventDetailsModal } from "../../../../hooks/app/useEventDetailsModal";
import { BaseOverlay } from "../base/BaseOverlay";

export const EventDetailsOverlay = () => {
    const { isOpen, close, value: eventId } =  useEventDetailsModal();

    return (
        <BaseOverlay
            opened={isOpen}
            onClose={close}
        >
            Meow {eventId}
        </BaseOverlay>
    )
};
