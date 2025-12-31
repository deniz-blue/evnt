import { describeRoute } from "hono-openapi";
import { app } from "../app";
import { APINotFound, APISuccess } from "../result";
import { EventDataSchema } from "@evnt/format";

// Get
app.get(
    "/events/:id",
    describeRoute({
        description: "Get an event by ID",
        responses: {
            200: APISuccess(EventDataSchema),
            404: APINotFound(),
        },
    }),
    (c) => {
        const { id } = c.req.param();
        return c.json({ eventId: id });
    },
);
