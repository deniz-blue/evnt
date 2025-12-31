import { EventDataSchema } from "@evnt/format";
import { app } from "../app";
import { APISuccess } from "../result";
import { describeRoute } from "hono-openapi";

// Create
app.post(
    "/events",
    describeRoute({
        description: "Create a new event",
        responses: {
            200: APISuccess(EventDataSchema),
        },
    }),
    (c) => {
        const eventData = c.req.json();
        return c.json({ received: eventData });
    },
);
