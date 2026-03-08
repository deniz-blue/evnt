import { Modal, ScrollArea } from "@mantine/core";
import type { PropsWithChildren } from "react";

export const BaseOverlay = ({
	children,
	opened,
	onClose,
	modalBodyProps,
}: PropsWithChildren<{
	opened: boolean;
	onClose: () => void;
	modalBodyProps?: React.ComponentProps<typeof Modal.Body>;
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
					common: { transformOrigin: 'bottom', borderRadius: undefined },
					transitionProperty: 'transform, opacity, border-top-left-radius, border-top-right-radius',
				},
			}}
			// scrollAreaComponent={ScrollArea.Autosize}
		>
			<Modal.Overlay />
			<Modal.Content bdrs={0} mih="100lvh">
				<Modal.Body {...modalBodyProps}>
					{children}
				</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	);
};
