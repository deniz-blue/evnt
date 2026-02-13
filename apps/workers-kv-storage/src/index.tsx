import { Hono } from "hono";
import { renderer } from "./renderer";
import { Homepage } from "./pages/homepage";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(renderer);

app.get("/", (c) => {
	return c.render(<Homepage />);
});

export default app;
