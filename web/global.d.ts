// Let TypeScript know we're importing SCSS (and SCSS modules)
// Avoids "Can't import CSS/SCSS modules. TypeScript says “Cannot Find Module”"
// See https://stackoverflow.com/a/41946697/486434
declare module "*.scss" {
	const content: { [className: string]: string };
	export default content;
}

// So that we can import JSON files in TypeScript.
declare module "*.json" {
	const value: unknown;

	export default value;
}

/**
 * The type of object to push into Google Tag Manager (GTM) data layer via `window.dataLayer.push`.
 * Needed to avoid TypeScript errors like "Property 'dataLayer' does not exist on type 'Window & typeof globalThis'" when you use `window.dataLayer`
 */
type DataLayerEntry = {
	event: string;
	eventCallback?: () => void;
	[key: string]: unknown;
};

interface Window {
	/**
	 * The Google Tag Manager (GTM) data layer
	 */
	dataLayer: DataLayerEntry[];
}

declare module "next-plugin-node-config" {
	import { NextConfig } from "next";

	// The withTranspiledModules module uses TS but doesn't use NextConfig.
	// It just uses {} instead which isn't helpful, so we use unknown here for the argument
	function withNodeConfig(config: unknown): NextConfig;

	export = withNodeConfig;
}

declare module "next/config" {
	import { PublicConfig, ServerConfig } from "@/config";

	type NextRuntimeConfig = {
		publicRuntimeConfig: PublicConfig;
		serverRuntimeConfig: ServerConfig;
	};

	function getConfig(): NextRuntimeConfig;

	export { getConfig as default, NextRuntimeConfig };
}

declare module "@nice-digital/icons/lib/ChevronDown" {
	import { FC } from "react";

	export interface IconProps {
		colour?: string;
		[key: string]: unknown;
	}

	const ChevronDownIcon: FC<IconProps>;

	export default ChevronDownIcon;
}

declare module "@nice-digital/icons/lib/Pathways" {
	export interface IconProps {
		colour?: string;
		[key: string]: unknown;
	}

	const Pathways: FC<IconProps>;

	export default Pathways;
}
