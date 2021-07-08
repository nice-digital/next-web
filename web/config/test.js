import jestConfig from "../jest.config";

/** Application runtime override when running Jest tests (NOT Jest config) */
module.exports = {
	public: {
		baseUrl: jestConfig.testURL,
	},
};
