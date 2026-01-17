import type { UseQueryResult } from "@tanstack/react-query";

export const RQResult = <TData,>({
	query,
	children,
}: {
	query: UseQueryResult<TData>;
	children: (data: TData, query: UseQueryResult<TData>) => React.ReactNode;
}) => {
	if (query.isLoading) {
		return <div>Loading...</div>;
	}
	
	if (query.isError) {
		return <div>Error: {(query.error as Error).message}</div>;
	}

	return <>{children(query.data!, query)}</>;
};
