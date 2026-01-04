import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { fetchValidate } from "../../../lib/util/fetchValidate";
import { EventDataSchema } from "@evnt/schema";
import { notifications } from "@mantine/notifications";
import { useEventStore } from "../../../lib/stores/useEventStore";

export const LinkOpenHandler = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const lastRef = useRef<string | null>(null);

    const clearParams = useCallback((params: string[]) => {
        const newParams = new URLSearchParams(searchParams);
        params.forEach(p => newParams.delete(p));
        setSearchParams(newParams);
    }, [searchParams]);

    useEffect(() => {
        if(lastRef.current === searchParams.toString()) return;
        lastRef.current = searchParams.toString();
        (async () => {
            const action = searchParams.get("action");

            if (action === "import") {
                const url = searchParams.get("url");
                if (url) {
                    notifications.show({ title: "Importing...", message: `Importing event from URL: ${url}`, loading: true, id: "import-event" });
                    const result = await fetchValidate(url, EventDataSchema);
                    if(!result.ok) {
                        console.error("Failed to import event from URL:", result.error);
                        notifications.update({
                            id: "import-event",
                            color: "red",
                            title: "Import Failed",
                            message: `Failed to import event from URL: ${result.error}`,
                            loading: false,
                        });
                        return;
                    };

                    const eventData = result.value;
                    await useEventStore.getState().createRemoteEvent(url, eventData);
                    notifications.update({
                        id: "import-event",
                        color: "teal",
                        title: "Import Successful",
                        message: `Successfully imported event from URL.`,
                        loading: false,
                    });
                    clearParams(["action", "url"]);
                }
            }
        })();
    }, [searchParams]);

    return null;
};
