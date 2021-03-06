const { pathsToModuleNameMapper } = require("ts-jest/utils");

const baseConfig = require("./../jest.config"),
	{ compilerOptions } = require("./tsconfig.json");

// Translation of TypeScript path mappings to jest paths: https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping
const tsPathsModuleNameMappings = pathsToModuleNameMapper(
	compilerOptions.paths,
	{ prefix: "<rootDir>/../" }
);

module.exports = {
	// Extend the base config from the root as it's got shared/common config
	...baseConfig,
	displayName: "web",
	rootDir: "./src/",
	roots: ["<rootDir>", "<rootDir>/../"],
	projects: undefined,
	moduleNameMapper: {
		"\\.(css|scss|svg)$": "identity-obj-proxy",
		// Alias React/Next into the web folder because of our monorepo setup.
		// Avoids errors like "multiple instances of React" with hooks
		"^react(.*)$": "<rootDir>/../node_modules/react$1",
		"^next(.*)$": "<rootDir>/../node_modules/next$1",
		// Aliases to match paths in tsconfig.json
		...tsPathsModuleNameMappings,
	},
	coveragePathIgnorePatterns: ["<rootDir>/test-utils.tsx"],
	transformIgnorePatterns: ["/node_modules/", "/dist/"],
	setupFilesAfterEnv: ["./jest.presetup.js", "./jest.setup.ts"],
	testPathIgnorePatterns: ["./config/"],
	testURL: "https://next-web-tests.nice.org.uk",
	testEnvironment: "jsdom",
	globals: {
		"ts-jest": {
			tsconfig: {
				...compilerOptions,
				// To avoid errors like "Class constructor App cannot be invoked without 'new'"
				target: "ESNext",
				// NextJS needs jsx=preserve but in Jest we need react-jsxdev:
				jsx: "react-jsxdev",
			},
		},
	},
};
