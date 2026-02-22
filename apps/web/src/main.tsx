import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import "./init";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}

	interface StaticDataRouteOption {
		spaceless?: boolean;
		hasEventForm?: boolean;
	}
}

const rootElement = document.getElementById("root")!
const root = ReactDOM.createRoot(rootElement)
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
