// @ts-check
const path = require("path");

const glob = require("glob");

/**
 * Dynamically find all NICE Digital modules for transpilation.
 * Most of our Design System components import SCSS.
 */
// List of paths to hooks used in global nav that should allow transpilation
const globalNavHooksToTranspile = [
	"@mantine/hooks/esm/use-debounced-value",
	"@mantine/hooks/esm/use-focus-trap",
];

// List of NICE Digital modules to transpile (Design System, Global Nav, etc.)
const niceDigitalModulesFromGlob = glob.sync(
	"@nice-digital/{*,*/node_modules/@nice-digital/*}",
	{
		cwd: "node_modules",
	}
);

/**
 * Fallback hardcoded list of NICE Digital modules for transpilation.
 * Most of our Design System components import SCSS.
 */
const niceDigitalModulesToTranspile = [
	"@nice-digital/design-system",
	"@nice-digital/global-nav",
	"@nice-digital/nds-accordion",
	"@nice-digital/nds-action-banner",
	"@nice-digital/nds-alert",
	"@nice-digital/nds-breadcrumbs",
	"@nice-digital/nds-button",
	"@nice-digital/nds-card",
	"@nice-digital/nds-checkbox",
	"@nice-digital/nds-container",
	"@nice-digital/nds-core",
	"@nice-digital/nds-enhanced-pagination",
	"@nice-digital/nds-filters",
	"@nice-digital/nds-form-group",
	"@nice-digital/nds-full-bleed",
	"@nice-digital/nds-grid",
	"@nice-digital/nds-hero",
	"@nice-digital/nds-horizontal-nav",
	"@nice-digital/nds-in-page-nav",
	"@nice-digital/nds-input",
	"@nice-digital/nds-maintain-ratio",
	"@nice-digital/nds-page-header",
	"@nice-digital/nds-panel",
	"@nice-digital/nds-phase-banner",
	"@nice-digital/nds-prev-next",
	"@nice-digital/nds-radio",
	"@nice-digital/nds-simple-pagination",
	"@nice-digital/nds-stacked-nav",
	"@nice-digital/nds-table",
	"@nice-digital/nds-tabs",
	"@nice-digital/nds-tag",
	"@nice-digital/nds-textarea",
	"@nice-digital/search-client",
	"@nice-digital/icons",
];

// Some npm modules are published as ES6, so we need to force them to be transpiled
const nonES5ModulesToTranspile = ["pino", "serialize-error"];

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	// Strict mode gives useful feedback in dev
	reactStrictMode: true,
	eslint: {
		// We run ESLint ourselves at the root of this monorepo
		ignoreDuringBuilds: true,
	},
	// Add page.tsx for test co-location
	pageExtensions: ["page.tsx", "api.ts"],
	// Don't send the x-powered-by header
	poweredByHeader: false,
	// Set the output file tracing root to the monorepo web directory
	// This silences the warning about multiple lockfiles in the monorepo
	outputFileTracingRoot: path.join(__dirname),
	// Suppress webpack cache serialization warnings in Next.js 15
	webpack: (config, { dev }) => {
		if (!dev) {
			// Suppress cache warnings in production builds
			const originalWarn = console.warn;
			console.warn = (...args) => {
				if (
					args[0]?.includes?.("PackFileCacheStrategy") ||
					args[0]?.includes?.("serializable cache item")
				) {
					return;
				}
				originalWarn.apply(console, args);
			};
		}
		return config;
	},
	transpilePackages: [
		// Use dynamically found modules if available, otherwise fallback to hardcoded list
		...(niceDigitalModulesFromGlob.length > 0
			? niceDigitalModulesFromGlob
			: niceDigitalModulesToTranspile),
		...nonES5ModulesToTranspile,
		...globalNavHooksToTranspile,
	],
	typescript: {
		// We run our own typechecking so no need to do it twice
		ignoreBuildErrors: process.env.NODE_ENV === "production",
	},
	sassOptions: {
		includePaths: [path.join(__dirname, "node_modules/@nice-digital")],
	},
	// Load public config directly from YAML files
	publicRuntimeConfig: (() => {
		try {
			const fs = require("fs");
			const yaml = require("js-yaml");

			// Helper function to load YAML or JSON
			/**
			 * Loads a YAML or JSON config file and returns its contents as an object.
			 * @param {string} filePathBase
			 * @returns {Record<string, any>}
			 */
			const loadYamlOrJson = (filePathBase) => {
				const ymlPath = `${filePathBase}.yml`;
				const jsonPath = `${filePathBase}.json`;

				if (fs.existsSync(ymlPath)) {
					return (
						/** @type {Record<string, any>} */ (
							yaml.load(fs.readFileSync(ymlPath, "utf8"))
						) || {}
					);
				} else if (fs.existsSync(jsonPath)) {
					return (
						/** @type {Record<string, any>} */ (
							JSON.parse(fs.readFileSync(jsonPath, "utf8"))
						) || {}
					);
				} else {
					return {};
				}
			};

			// Helper function to merge configs
			/**
			 * @param {Record<string, any>} target
			 * @param {Record<string, any>} source
			 * @returns {Record<string, any>}
			 */
			const deepMerge = (target, source) => {
				const result = { ...target };
				for (const key in source) {
					if (
						source[key] &&
						typeof source[key] === "object" &&
						!Array.isArray(source[key])
					) {
						result[key] = deepMerge(result[key] || {}, source[key]);
					} else {
						result[key] = source[key];
					}
				}
				return result;
			};

			// Helper function to apply environment variable substitution
			/**
			 * @param {Record<string, any>} config
			 * @param {Record<string, any>} envMapping
			 * @returns {Record<string, any>}
			 */
			const applyEnvironmentVariables = (config, envMapping) => {
				if (!config || !envMapping) return config;
				const result = { ...config };
				for (const key in envMapping) {
					if (typeof envMapping[key] === "string") {
						const envVarName = envMapping[key];
						const envValue = process.env[envVarName];
						if (envValue !== undefined) {
							result[key] = envValue;
						}
					} else if (
						typeof envMapping[key] === "object" &&
						envMapping[key] !== null
					) {
						if (result[key] && typeof result[key] === "object") {
							result[key] = applyEnvironmentVariables(
								result[key],
								envMapping[key]
							);
						}
					}
				}
				return result;
			};

			// Load default config
			let mergedConfig = {};
			mergedConfig = loadYamlOrJson(path.join(__dirname, "config", "default"));

			// Load environment-specific config
			const nodeEnv = process.env.NODE_ENV || "development";
			let envConfigBase = "";
			if (nodeEnv === "test") {
				// For test environment, return test-specific config
				const testConfig = {
					public: {
						buildNumber: "TEST",
						environment: "test",
						authEnvironment: "test",
						baseURL:
							process.env.FUNCTIONAL_TESTS === "true"
								? ""
								: "https://next-web-tests.nice.org.uk",
						cookieBannerScriptURL:
							"https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js",
						publicBaseURL: "",
						search: {
							baseURL: "http://localhost:19332/api",
						},
						cacheControl: {
							defaultCacheHeader:
								"public, s-max-age=300, max-age=480, stale-while-revalidate=1800",
						},
						jotForm: {
							baseURL: "https://next-web-tests.jotform.com",
						},
						storyblok: {
							accessToken: "TEST_TOKEN",
							ocelotEndpoint: "",
							enableRootCatchAll: false,
						},
						denyRobots: true,
					},
				};
				mergedConfig = deepMerge(mergedConfig, testConfig);

				// Apply environment variable substitution only for functional tests
				if (process.env.FUNCTIONAL_TESTS === "true") {
					const customEnv = loadYamlOrJson(
						path.join(__dirname, "config", "custom-environment-variables")
					);
					mergedConfig = applyEnvironmentVariables(mergedConfig, customEnv);
				}
			} else if (nodeEnv === "development") {
				envConfigBase = path.join(__dirname, "config", "local-development");
			} else if (nodeEnv === "production") {
				envConfigBase = path.join(__dirname, "config", "local-production");
			}
			if (envConfigBase) {
				const envConfig = loadYamlOrJson(envConfigBase);
				mergedConfig = deepMerge(mergedConfig, envConfig);
			}
			console.log("Loading public config from YAML/JSON files");
			return mergedConfig &&
				typeof mergedConfig === "object" &&
				"public" in mergedConfig
				? mergedConfig.public || {}
				: {};
		} catch (error) {
			console.warn("Could not load public config:", error);
			return {};
		}
	})(),
	async rewrites() {
		return [
			{
				source:
					"/:productRoot(indicators|guidance)/:statusSlug(indevelopment|discontinued|awaiting-development|topic-selection)/:path*",
				destination:
					"/indicators/indevelopment/:path*?productRoot=:productRoot&statusSlug=:statusSlug",
			},
			{
				source:
					"/:productRoot(indicators|guidance|advice|process|corporate)/:path+",
				destination: "/indicators/:path*?productRoot=:productRoot",
			},
			{
				source: "/robots.txt",
				destination: "/api/robots",
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/guidance/proposed",
				destination: "/guidance/awaiting-development",
				permanent: true,
			},
		];
	},
	async headers() {
		const commonHeaders = [
			{
				key: "Cache-Control",
				value:
					"public, s-max-age=300, max-age=480, stale-while-revalidate=1800",
			},
			{
				key: "X-App",
				value: "next-web",
			},
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
			{
				key: "Link",
				value:
					"<https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js>; rel=preload; as=script,<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin,<https://www.googletagmanager.com>; rel=preconnect",
			},
		];
		// Prevent embedding this site in frames in production, but allow it in dev so we can use the Storyblok preview editor
		if (process.env.NODE_ENV === "production") {
			commonHeaders.push(
				{
					key: "X-Frame-Options",
					value: "DENY",
				},
				{
					key: "Content-Security-Policy",
					value: "frame-ancestors 'self' https://*.infogram.com",
				}
			);
		}
		return [
			{
				source: "/(.*)",
				headers: commonHeaders,
			},
		];
	},
	images: {
		// https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.nice.org.uk",
				port: "",
			},
			{
				protocol: "https",
				hostname: "a.storyblok.com",
				port: "",
			},
		],
	},
};

module.exports = nextConfig;
