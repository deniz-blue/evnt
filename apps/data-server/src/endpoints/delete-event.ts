import { describeRoute } from "hono-openapi";
import { app } from "../app";
import { APISuccess } from "../result";
import { EventDataSchema } from "@evnt/format";

// Delete
app.delete(
    "/events/:id",
    describeRoute({
        description: "Delete an event by ID",
        responses: {
            200: APISuccess(EventDataSchema),
        },
    }),
    (c) => {
        const { id } = c.req.param();
        return c.json({ deletedEventId: id });
    },
);
