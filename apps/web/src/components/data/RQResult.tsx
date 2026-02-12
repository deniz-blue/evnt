import type { UseQueryResult } from "@tanstack/react-query";
import { CenteredLoader } from "../content/base/CenteredLoader";
import { Text } from "@mantine/core";

export const RQResult = <TData,>({
	query,
	children,
}: {
	query: UseQueryResult<TData>;
	children: (data: TData, query: UseQueryResult<TData>) => React.ReactNode;
}) => {
	if (!query.data && query.isLoading) {
		return <CenteredLoader />;
	}

	if (query.isError) {
		return <Text c="red">Error: {(query.error as Error).message}</Text>;
	}

	return <>{children(query.data!, query)}</>;
};
