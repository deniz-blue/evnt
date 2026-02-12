import { useCallback, useState } from "react";

export const AsyncAction = ({
	action,
	children,
}: {
	action: () => Promise<void>;
	children: (props: { loading: boolean; onClick: () => void }) => React.ReactNode;
}) => {
	const [loading, setLoading] = useState(false);

	const onClick = useCallback(() => {
		if (loading) return;
		setLoading(true);
		action().finally(() => {
			setLoading(false);
		});
	}, [action, loading]);

	return (
		<>{children({ loading, onClick })}</>
	);
};
