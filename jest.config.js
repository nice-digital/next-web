module.exports = {
	moduleNameMapper: {
		"\\.(css|scss)$": "identity-obj-proxy",
		// Alias React into the web folder to avoid errors like "multiple instances of React" with hooks
		"^react(.*)$": "<rootDir>/web/node_modules/react$1",
	},
	preset: "ts-jest",
	collectCoverage: process.env.TEAMCITY_VERSION ? true : false,
	collectCoverageFrom: [
		"**/*.{js,jsx,ts,tsx}",
		"!**/node_modules/**",
		"!**/.next/**",
	],
	testResultsProcessor: "jest-teamcity-reporter",
	moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],
	setupFilesAfterEnv: ["./jest.setup.ts"],
	testURL: "https://next-web-tests.nice.org.uk/",
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.(ts|tsx|js)$": "ts-jest",
	},
};
