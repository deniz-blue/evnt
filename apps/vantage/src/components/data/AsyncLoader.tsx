import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { CenteredLoader } from "../content/base/CenteredLoader";

export const AsyncLoader = <T,>({
	children,
	fetcher,
}: {
	children: (value: T) => React.ReactNode;
	fetcher: () => Promise<T>;
}) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setData(null);
		setError(null);
		setLoading(true);
		(async () => {
			try {
				const result = await fetcher();
				setData(result);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		})();
	}, [fetcher]);

	if (loading) {
		return (
			<CenteredLoader />
		);
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return <>{data !== null ? children(data) : null}</>;
};
