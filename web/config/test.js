import jestConfig from "../jest.config";

/** Application runtime override when running Jest tests (NOT Jest config) */
module.exports = {
	public: {
		environment: "test",
		baseURL: jestConfig.testEnvironmentOptions.url,
	},
	server: {
		cache: {
			keyPrefix: "next-web:tests",
		},
		feeds: {
			publications: {
				origin: "https://next-web-tests-publications.nice.org.uk",
			},
			inDev: {
				origin: "https://next-web-tests-indev.nice.org.uk",
			},
			jotForm: {
				origin: "https://next-web-tests.jotform.com",
			},
		},
	},
};
