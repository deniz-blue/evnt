import { Modal, ScrollArea } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const BaseOverlay = ({
    children,
    opened,
    onClose,
}: PropsWithChildren<{
    opened: boolean;
    onClose: () => void;
}>) => {
    return (
        <Modal.Root
            yOffset={0}
            size="xl"
            opened={opened}
            onClose={onClose}
            transitionProps={{
                duration: 250,
                transition: {
                    in: { opacity: 1, transform: 'translateY(0)', borderTopLeftRadius: 0, borderTopRightRadius: 0 },
                    out: { opacity: 0, transform: 'translateY(100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
                    common: { transformOrigin: 'bottom' },
                    transitionProperty: 'transform, opacity, border-top-left-radius, border-top-right-radius',
                },
            }}
            scrollAreaComponent={ScrollArea.Autosize}
        >
            <Modal.Overlay />
            <Modal.Content bdrs={0} mih="100lvh">
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
};
