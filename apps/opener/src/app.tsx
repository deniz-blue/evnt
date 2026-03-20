import { MantineProvider } from "@mantine/core";
import { Page } from "./ui/Page";
import { createRoot } from "react-dom/client";

export const App = () => {
	return (
		<MantineProvider forceColorScheme="dark">
			<Page />
		</MantineProvider>
	);
};

export const render = () => {
	createRoot(document.getElementById('root')!).render(<App />);
};
