import { render } from "hono/jsx/dom";
import { SignCallbackPage } from "./pages/sign-callback";

const root = document.getElementById("root")!;
const props = JSON.parse(root.dataset.props!);

render(<SignCallbackPage {...props} />, root);
