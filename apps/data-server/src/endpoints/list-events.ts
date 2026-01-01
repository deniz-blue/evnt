import { describeResponse } from "hono-openapi";
import { app } from "../app";
import z from "zod";
import { EventDataSchema } from "@evnt/schema";

// List
// app.get(
//     "/events",
//     describeResponse(
//         (c) => {
//             return c.json({ events: [] }, 200);
//         },
//         {
//             200: Success(z.object({
//                 events: EventDataSchema.array(),
//             })),
//             400: ErrorResponse,
//         },
//     ),
// );
