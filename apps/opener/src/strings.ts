import type { Intent } from "../lib/intent";

export const Strings = {
	Message: {
		None: "Please select an application",
		Set: (instanceUrl: string) => `Your default application was set to ${new URL(instanceUrl).host}`,
		Cleared: "Your default application has been cleared.",
		SelectToContinue: (intent: Intent) => {
			if (intent.type === "event") {
				return `Select application to view event`;
			}

			return `Please select an application`;
		},
	},
} as const;
