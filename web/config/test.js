import jestConfig from "../jest.config";

/** Application runtime override when running Jest tests (NOT Jest config) */
module.exports = {
	public: {
		baseUrl: jestConfig.testURL,
	},
	server: {
		cache: {
			keyPrefix: "next-web:tests",
		},
		feeds: {
			publications: {
				origin: "https://next-web-tests-publications.nice.org.uk",
			},
		},
	},
};
