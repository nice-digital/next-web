import config from "config";

export interface SettingsConfig {
	/** Name of the environment e.g. "dev" or "test" */
	environment: string;
}

export const settings = config.get<SettingsConfig>("settings");
