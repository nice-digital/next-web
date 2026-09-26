import { FC } from "react";

import { publicRuntimeConfig } from "@/config";

/**
 * Opens the connection to the AWS WAF SDK origin early, so the SDK itself has one less round trip
 * to make when it loads. See docs/aws-waf-ddos-mitigation.md for the wider picture.
 *
 * Rendered from the head in _document, which puts it ahead of the SDK script tag: NextJS hoists
 * `beforeInteractive` scripts into the head *after* whatever we render in there ourselves, so the
 * ordering we need falls out for free.
 *
 * This lives here, rather than as a `Link` response header in next.config.js like the cookie banner
 * preload, because header config is baked into the routes manifest at build time. The same image is
 * deployed to every environment and each one has its own web ACL, so a build time value would be
 * wrong everywhere but one.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preconnect
 */
export const AwsWafPreconnect: FC = () => {
	const { scriptURL } = publicRuntimeConfig.awsWaf;

	// Config driven so we can switch the integration off per environment
	if (!scriptURL) return null;

	return <link rel="preconnect" href={new URL(scriptURL).origin} />;
};
