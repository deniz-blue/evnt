import { Box, Container, Modal, Paper } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
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
                transition: "slide-up",
            }}
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
