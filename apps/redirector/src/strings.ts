export const Strings = {
	Message: {
		None: "Please select an application to view events",
		Set: (instanceUrl: string) => `Your default application was set to ${new URL(instanceUrl).host}`,
		Cleared: "Your default application has been cleared.",
		SelectToContinue: (params: URLSearchParams) => {
			if(params.get("action") === "view-event") {
				return `To view the event, please select an application from the list below.`;
			}

			return `Please select an application to continue.`;
		},
	},
} as const;
