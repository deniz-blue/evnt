import { serve } from '@hono/node-server'
import { app } from "./app.js"

import "./endpoints/create-event";
import "./endpoints/delete-event";
import "./endpoints/get-event";
import "./endpoints/list-events";
import "./endpoints/openapi";
import "./endpoints/patch-event";

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
