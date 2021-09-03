// @ts-check
const { readdirSync } = require("fs"),
	path = require("path");

const config = require("config"),
	withNodeConfig = require("next-plugin-node-config"),
	withTranspiledModules = require("next-transpile-modules");

/**
 * A list of paths to node modules that should allow transpilation.
 * Most of our Design System components (and Global Nav) import SCSS.
 *
 * Avoids the error "CSS Modules cannot be imported from within node_modules."
 */
const niceDigitalModulesToTranspile = readdirSync(
	path.join(__dirname, "node_modules", "@nice-digital"),
	{ withFileTypes: true }
)
	.filter((dirent) => dirent.isDirectory())
	.map(({ name }) => `@nice-digital/${name}`);

const commonHeaders = [
	/**
	 * 'Best practice' security headers as per https://edibleco.de/3xcg71N
	 */
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	{
		key: "Content-Security-Policy",
		value: "frame-ancestors 'none'", // TODO: Add a strong CSP
	},
	/**
	 * Preload external assets and preconnecting external domains via Link header
	 */
	{
		key: "Link",
		value: [
			// Preload the cookie banner with API key domain preconnect - we want the cookie banner to show as quickly as possible
			`<${config.get("public.cookieBannerScriptURL")}>; rel=preload; as=script`,
			"<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin",
			"<https://www.googletagmanager.com>; rel=preconnect",
			// ANCHOR[id=font-preconnects] Speed up Google font loading with preconnects
			"<https://fonts.googleapis.com>; rel=preconnect",
			"<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
		].join(","),
	},
];

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const nextConfig = {
	nodeConfigServerKey: "server",
	nodeConfigPublicKey: "public",
	// Strict mode gives useful feedback in dev, see https://edibleco.de/3x9GXry
	reactStrictMode: true,
	eslint: {
		// We run ESLint ourselves at the root of this monorepo
		ignoreDuringBuilds: true,
	},
	// Add page.tsx for test co-location, see https://edibleco.de/3qCAkvg
	pageExtensions: ["page.tsx", "api.tsx"],
	// Don't send the x-powered-by header: we don't want to expose things like that. See https://edibleco.de/2TpDVAK
	poweredByHeader: false,
	async headers() {
		return [
			{
				// Add common headers to all pages
				source: "/(.*)",
				headers: commonHeaders,
			},
		];
	},
	typescript: {
		// We run our own typechecking so no need to do it twice
		ignoreBuildErrors: process.env.NODE_ENV === "production",
	},
	future: {},
	experimental: {
		sassOptions: {
			includePaths: [path.join(__dirname, "node_modules/@nice-digital")],
		},
	},
};

// The weird comment syntax below is a JSDoc TypeScript cast: https://edibleco.de/2UMm8nx
/** @type {import('next/dist/next-server/server/config').NextConfig} */
const finalConfig = withNodeConfig(
	withTranspiledModules(niceDigitalModulesToTranspile)(nextConfig)
);

module.exports = finalConfig;
