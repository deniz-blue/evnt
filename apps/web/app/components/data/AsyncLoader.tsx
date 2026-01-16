import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";

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
		let isMounted = true;

		setLoading(true);
		fetcher()
			.then((result) => {
				if (isMounted) {
					setData(result);
					setError(null);
				}
			})
			.catch((err) => {
				if (isMounted) {
					setError(err);
					setData(null);
				}
			})
			.finally(() => {
				if (isMounted) {
					setLoading(false);
				}
			});
		
		return () => {
			isMounted = false;
		};
	}, [fetcher]);

	if (loading) {
		return (
			<Center>
				<Loader />
			</Center>
		);
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return <>{data !== null ? children(data) : null}</>;
};
