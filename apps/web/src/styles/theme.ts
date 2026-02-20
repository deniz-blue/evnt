import { createTheme, DEFAULT_THEME, type ActionIconProps, type ButtonProps, type TooltipProps } from "@mantine/core";

export const theme = createTheme({
	fontFamily: "Lexend, " + DEFAULT_THEME.fontFamily,
	components: {
		ActionIcon: {
			defaultProps: {
				variant: "light",
			} as ActionIconProps,
		},
		Button: {
			defaultProps: {
				variant: "light",
			} as ButtonProps,
		},
		Tooltip: {
			defaultProps: {
				withArrow: true,
				arrowOffset: 4,
				arrowSize: 6,
				color: "gray",
				opacity: 0.9,
			} as TooltipProps,
		},
	},
});
