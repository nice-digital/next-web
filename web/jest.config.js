const baseConfig = require("./../jest.config"),
	tsconfig = require("./tsconfig.json");

module.exports = {
	// Extend the base config from the root as it's got shared/common config
	...baseConfig,
	displayName: "web",
	rootDir: "./",
	projects: undefined,
	moduleNameMapper: {
		"\\.(css|scss|svg)$": "identity-obj-proxy",
		// Aliases to match paths in tsconfig.json
		"^@/test-utils$": "<rootDir>/src/test-utils",
		"^@/config$": "<rootDir>/src/config/config",
		"^@/logger$": "<rootDir>/src/logging/logger",
		"^@/components(.*)$": "<rootDir>/src/components$1",
		// Alias React/Next into the web folder because of our monorepo setup.
		// Avoids errors like "multiple instances of React" with hooks
		"^react(.*)$": "<rootDir>/node_modules/react$1",
		"^next(.*)$": "<rootDir>/node_modules/next$1",
	},
	coveragePathIgnorePatterns: [
		"<rootDir>/src/test-utils.tsx",
		"<rootDir>/.next/",
		"<rootDir>/pm2.start.js",
	],
	testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
	setupFilesAfterEnv: ["./jest.setup.ts"],
	testURL: "https://next-web-tests.nice.org.uk/",
	testEnvironment: "jsdom",
	globals: {
		"ts-jest": {
			tsconfig: {
				...tsconfig.compilerOptions,
				// NextJS needs jsx=preserve but in Jest we need react-jsxdev:
				jsx: "react-jsxdev",
			},
		},
	},
};
