import type { Did } from "@atcute/lexicons";
import { useQuery } from "@tanstack/react-query";
import { didDocumentResolver } from "./atproto-services";
import { getAtprotoHandle } from "@atcute/identity";

export const useAtProtoHandleQuery = (did?: Did<"plc" | "web">) => {
	return useQuery({
		queryKey: ["atproto", "handle", did],
		enabled: !!did,
		staleTime: 60 * 60 * 1000, // 1 hour
		refetchOnMount: false,
		refetchOnReconnect: false,
		queryFn: async () => {
			return getAtprotoHandle(await didDocumentResolver.resolve(did!));
		},
	});
};
