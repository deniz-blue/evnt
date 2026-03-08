import type { Did } from "@atcute/lexicons";
import { useQuery } from "@tanstack/react-query";
import { didDocumentResolver } from "./atproto-services";

export const useAtProtoHandleQuery = (did: Did<"plc" | "web">) => {
	return useQuery({
		queryKey: ["atproto", "handle", did],
		staleTime: 60 * 60 * 1000, // 1 hour
		refetchOnMount: false,
		refetchOnReconnect: false,
		queryFn: async () => {
			const doc = await didDocumentResolver.resolve(did);
			return doc.alsoKnownAs?.[0];
		},
	});
};
