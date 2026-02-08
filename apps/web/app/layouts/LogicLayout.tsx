import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Initializers } from "../components/app/handlers/Initializers";
import { LinkOpenHandler } from "../components/app/handlers/LinkOpenHandler";

export default function LogicLayout() {
	return (
		<Fragment>
			<Outlet />

			<LinkOpenHandler />
			<Initializers />
		</Fragment>
	);
}
