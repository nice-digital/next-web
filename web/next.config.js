// @ts-check
const path = require("path");

// Safely load config to avoid recursion issues
let serverConfig = {};
let publicConfig = {};
try {
	const config = require("config");
	serverConfig = config.get("server") || {};
	publicConfig = config.get("public") || {};
} catch (error) {
	console.warn("Could not load config:", error.message);
}

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
	// Load public config directly from YAML files to avoid recursion
	publicRuntimeConfig: (() => {
		try {
			const fs = require("fs");
			const yaml = require("js-yaml");
			const configPath = path.join(__dirname, "config", "default.yml");

			console.log("Loading config from:", configPath);

			if (fs.existsSync(configPath)) {
				const configContent = fs.readFileSync(configPath, "utf8");
				const config = yaml.load(configContent);
				console.log(
					"Loaded public config:",
					JSON.stringify(config.public, null, 2)
				);
				return config.public || {};
			}

			console.warn("Config file not found at:", configPath);
			return {};
		} catch (error) {
			console.warn("Could not load public config from YAML:", error);
			return {};
		}
	})(),
};

module.exports = nextConfig;
