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

/**
 * The AWS WAF client application integration API, added to `window` by the SDK script that
 * _document loads. Used to prove to our WAF web ACL that a request came from a real browser.
 *
 * @see https://docs.aws.amazon.com/waf/latest/developerguide/waf-js-challenge-api-specification.html
 */
type AwsWafIntegrationApi = {
	/**
	 * Resolves with the current token, storing it in the `aws-waf-token` cookie. Returns straight
	 * away if we already have an unexpired token, otherwise waits up to 2 seconds for one and
	 * rejects if that times out - so always catch.
	 */
	getToken: () => Promise<string>;

	/** Whether the `aws-waf-token` cookie currently holds an unexpired token */
	hasToken: () => boolean;

	/** A `fetch` wrapper that attaches the token, for calls that don't send the cookie themselves */
	fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

interface Window {
	/**
	 * The Google Tag Manager (GTM) data layer
	 */
	dataLayer: DataLayerEntry[];

	/**
	 * The AWS WAF client application integration API.
	 *
	 * Optional because the SDK is config driven and switched off on environments with no web ACL
	 * in front of them, so always feature detect before using it.
	 */
	AwsWafIntegration?: AwsWafIntegrationApi;
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
