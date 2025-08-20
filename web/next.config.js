// @ts-check
const path = require("path");

/**
 * A list of NICE Digital modules that should allow transpilation.
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

const nonES5ModulesToTranspile = ["pino", "serialize-error"];

const globalNavHooksToTranspile = [
	"@mantine/hooks/esm/use-debounced-value",
	"@mantine/hooks/esm/use-focus-trap",
];

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	pageExtensions: ["page.tsx", "api.ts"],
	poweredByHeader: false,
	transpilePackages: [
		...niceDigitalModulesToTranspile,
		...nonES5ModulesToTranspile,
		...globalNavHooksToTranspile,
	],
	typescript: {
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

			// Helper function to merge configs
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

			// Load default config
			const defaultConfigPath = path.join(__dirname, "config", "default.yml");
			let mergedConfig = {};

			if (fs.existsSync(defaultConfigPath)) {
				const defaultContent = fs.readFileSync(defaultConfigPath, "utf8");
				mergedConfig = yaml.load(defaultContent);
			}

			// Load environment-specific config
			const nodeEnv = process.env.NODE_ENV || "development";
			let envConfigPath = "";

			if (nodeEnv === "test") {
				// For test environment, return test-specific config
				const testConfig = {
					public: {
						buildNumber: "TEST",
						environment: "test",
						authEnvironment: "test",
						baseURL: "https://next-web-tests.nice.org.uk",
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
			} else if (nodeEnv === "development") {
				envConfigPath = path.join(__dirname, "config", "local-development.yml");
			} else if (nodeEnv === "production") {
				envConfigPath = path.join(__dirname, "config", "local-production.yml");
			}

			if (envConfigPath && fs.existsSync(envConfigPath)) {
				const envContent = fs.readFileSync(envConfigPath, "utf8");
				const envConfig = yaml.load(envContent);
				mergedConfig = deepMerge(mergedConfig, envConfig);
			}

			console.log("Loading public config from YAML files");

			return mergedConfig.public || {};
		} catch (error) {
			console.warn("Could not load public config from YAML:", error);
			return {};
		}
	})(),

	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
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
						value:
							"camera=(), microphone=(), geolocation=(), interest-cohort=()",
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
				],
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
};

module.exports = nextConfig;
