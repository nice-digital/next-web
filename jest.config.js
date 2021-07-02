module.exports = {
	// Monorepo set up so we're using sub projects with shared options
	projects: ["<rootDir>/web"],
	preset: "ts-jest",
	collectCoverage: process.env.TEAMCITY_VERSION ? true : false,
	rootDir: "./",
	// collectCoverageFrom is global, until https://github.com/facebook/jest/pull/9633 is merged
	collectCoverageFrom: [
		"**/*.{js,ts,tsx}",
		"!**/dist/**",
		"!**/*.d.ts",
		"!**/jest.config.js",
	],
	testResultsProcessor: "jest-teamcity-reporter",
	moduleFileExtensions: ["js", "ts", "tsx"],
	transform: {
		"^.+\\.(ts|tsx|js)$": "ts-jest",
	},
};
