import { IconCalendar, IconCalendarPlus, IconHome, IconList, IconSettings } from "@tabler/icons-react";
import { useProvideAction } from "../../components/app/overlay/spotlight/useAction";
import { useNavigate } from "@tanstack/react-router";

export const useProvideNavActions = () => {
	const navigate = useNavigate();

	useProvideAction({
		label: "Go to Home",
		category: "Navigation",
		icon: <IconHome />,
		execute: () => navigate({ to: "/" }),
	});

	useProvideAction({
		label: "Go to List view",
		category: "Navigation",
		icon: <IconList />,
		execute: () => navigate({ to: "/list" }),
	});

	useProvideAction({
		label: "Go to Calendar view",
		category: "Navigation",
		icon: <IconCalendar />,
		execute: () => navigate({ to: "/calendar" }),
	});

	useProvideAction({
		label: "Create new event",
		category: "Navigation",
		icon: <IconCalendarPlus />,
		execute: () => navigate({ to: "/new" }),
	});

	useProvideAction({
		label: "Toggle Settings",
		category: "Navigation",
		icon: <IconSettings />,
		execute: () => navigate({
			to: ".",
			search: prev => ({
				...prev,
				settings: prev.settings !== undefined ? undefined : "",
			}),
		}),
	});
};
