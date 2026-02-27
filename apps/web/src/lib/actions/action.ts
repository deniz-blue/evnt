export interface Action {
	label?: string;
	onClick?: () => void;
	leftSection?: React.ReactNode;
	children?: React.ReactNode;
};
