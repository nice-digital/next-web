// @ts-check
const { readdirSync } = require("fs"),
	path = require("path"),
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

/**
 * 'Best practice' security headers as per https://edibleco.de/3xcg71N
 */
const securityHeaders = [
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
];

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const nextConfig = {
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
				// Add common security headers to all pages
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},
	future: {},
	experimental: {},
};

// The NextConfig type def requires future/experimental so we remove them here as a bit of a hack.
// Avoids scary warnings like 'You have enabled experimental feature(s)...Use them at your own risk. '
// delete nextConfig.future;
// delete nextConfig.experimental;

// The weird comment syntax below is a JSDoc TypeScript cast: https://edibleco.de/2UMm8nx
const finalConfig =
	/** @type {import('next/dist/next-server/server/config').NextConfig} */ (
		withTranspiledModules(niceDigitalModulesToTranspile)(nextConfig)
	);

module.exports = finalConfig;
