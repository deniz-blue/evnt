export const contextModals: Record<string, React.FC<any>> = {
} as const;

declare module '@mantine/modals' {
	export interface MantineModalsOverride {
		modals: typeof contextModals;
	}
}
