declare module "virtual:instances" {
	export const instances: InstancesManifest;

	export interface InstancesManifest {
		instances: InstanceInfo[];
	}

	export interface InstanceInfo {
		url: string;
		name?: string;
		description?: string;
		redirectTo?: string;
		capabilities: string[];
	}
}