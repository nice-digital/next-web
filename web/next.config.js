// @ts-check
const path = require("path");

const config = require("config"),
	glob = require("glob"),
	withNodeConfig = require("next-plugin-node-config");

/**
 * A list of paths to hooks used in global nav that should allow transpilation.
 *
 * Avoids the error "cannot use import outside a module"
 */
const globalNavHooksToTranspile = [
	"@mantine/hooks/esm/use-debounced-value",
	"@mantine/hooks/esm/use-focus-trap",
];

/**
 * A list of paths to node modules that should allow transpilation.
 * Most of our Design System components (and Global Nav) import SCSS.
 *
 * Avoids the error "CSS Modules cannot be imported from within node_modules."
 */
const niceDigitalModulesToTranspile = glob.sync(
	"@nice-digital/{*,*/node_modules/@nice-digital/*}",
	{
		cwd: "node_modules",
	}
);

/**
 * Some npm modules are published as ES6, so we need to force them to be transpiled
 * so they're ES5 compatible whilst we still support IE11.
 *
 * As per comment at https://github.com/vercel/next.js/discussions/13922#discussioncomment-23956
 */
const nonES5ModulesToTranspile = ["pino", "serialize-error"];

const commonHeaders = [
	{
		key: "Cache-Control",
		value: config.get("public.cacheControl.defaultCacheHeader"),
	},
	{
		key: "X-App",
		value: "next-web",
	},
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
		].join(","),
	},
];

// Prevent emebdding this site in frames in production, but allow it in dev so we can use the Storyblok preview editor
if (process.env.NODE_ENV === "production") {
	commonHeaders.push(
		{
			key: "X-Frame-Options",
			value: "DENY",
		},
		{
			key: "Content-Security-Policy",
			value: "frame-ancestors 'none'",
		}
	);
}

/**
 * @type {import('next').NextConfig}
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
	pageExtensions: ["page.tsx", "api.ts"],
	// Don't send the x-powered-by header: we don't want to expose things like that. See https://edibleco.de/2TpDVAK
	poweredByHeader: false,
	async rewrites() {
		return [
			{
				source:
					"/:productRoot(indicators|guidance|hub)/:statusSlug(indevelopment|discontinued|awaiting-development|topic-selection)/:path*",
				destination:
					"/indicators/indevelopment/:path*?productRoot=:productRoot&statusSlug=:statusSlug",
			},
			{
				source:
					"/:productRoot(indicators|guidance|advice|process|corporate|hub)/:path*",
				destination: "/indicators/:path*?productRoot=:productRoot",
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/hub/published",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/hub/inconsultation",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/hub/indevelopment",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/hub/awaiting-development",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/hub/topic-selection",
				destination: "/guidance/indevelopment?ngt=NICE+guidelines",
				permanent: true,
			},
			{
				source: "/guidance/proposed",
				destination: "/guidance/awaiting-development",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/index",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/news/newsandfeatures",
				destination: "/news/articles",
				permanent: true,
			},
			{
				source: "/news/article/:slug",
				destination: "/news/articles/:slug",
				permanent: true,
			},
			{
				source: "/news/blog",
				destination: "/news/blogs",
				permanent: true,
			},
			{
				source: "/news/blog/:slug",
				destination: "/news/blogs/:slug",
				permanent: true,
			},
			{
				source: "/news/features",
				destination: "/news/in-depth",
				permanent: true,
			},
			{
				source: "/news/nice-talks-podcasts",
				destination: "/news/podcasts",
				permanent: true,
			},
			{
				source: "/news/press-and-media",
				destination: "/press-and-media",
				permanent: true,
			},
			{
				source: "/news/nice-newsletters-and-alerts",
				destination: "/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source: "/news/events",
				destination: "/events",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				// Add common headers to all pages
				source: "/(.*)",
				headers: commonHeaders,
			},
		];
	},
	transpilePackages: [
		...niceDigitalModulesToTranspile,
		...nonES5ModulesToTranspile,
		...globalNavHooksToTranspile,
	],
	typescript: {
		// We run our own typechecking so no need to do it twice
		ignoreBuildErrors: process.env.NODE_ENV === "production",
	},
	sassOptions: {
		fiber: false,
		includePaths: [path.join(__dirname, "node_modules/@nice-digital")],
	},
	images: {
		// https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.nice.org.uk",
				port: "",
			},
		],
	},
};

// The weird comment syntax below is a JSDoc TypeScript cast: https://edibleco.de/2UMm8nx
/** @type {import('next').NextConfig} */
const finalConfig = withNodeConfig(nextConfig);

// Delete the following properties now we are finished with them or next-js will warn 'root value has an unexpected property xxx - which is not in the list of allowed properties'
delete finalConfig["nodeConfigServerKey"];
delete finalConfig["nodeConfigPublicKey"];

module.exports = finalConfig;
