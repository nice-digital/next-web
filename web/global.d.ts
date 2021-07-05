// Let TypeScript know we're importing SCSS (and SCSS modules)
// Avoids "Can't import CSS/SCSS modules. TypeScript says “Cannot Find Module”"
// See https://stackoverflow.com/a/41946697/486434
declare module "*.scss" {
	const content: { [className: string]: string };
	export default content;
}

declare module "next-plugin-node-config" {
	import { NextConfig } from "next/dist/next-server/server/config";

	// The withTranspiledModules module uses TS but doesn't use NextConfig.
	// It just uses {} instead which isn't helpful, so we use unknown here for the argument
	function withNodeConfig(config: unknown): NextConfig;

	export = withNodeConfig;
}

declare module "next/config" {
	import { PublicConfig, ServerConfig } from "@/config";

	export type NextRuntimeConfig = {
		publicRuntimeConfig: PublicConfig;
		serverRuntimeConfig: ServerConfig;
	};

	function getConfig(): NextRuntimeConfig;

	export = getConfig;
}
