// Helper to get API base URLs for use in steps/support files
// Loads from process.env or local.env.js (for local dev)

let INDEV_BASE_URL = process.env.INDEV_BASE_URL;
let PUBLICATIONS_BASE_URL = process.env.PUBLICATIONS_BASE_URL;
let SEARCH_BASE_URL = process.env.SEARCH_BASE_URL;

if (!INDEV_BASE_URL || !PUBLICATIONS_BASE_URL || !SEARCH_BASE_URL) {
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const localEnv = require("./local.env.js");
		INDEV_BASE_URL = INDEV_BASE_URL || localEnv.INDEV_BASE_URL;
		PUBLICATIONS_BASE_URL =
			PUBLICATIONS_BASE_URL || localEnv.PUBLICATIONS_BASE_URL;
		SEARCH_BASE_URL = SEARCH_BASE_URL || localEnv.SEARCH_BASE_URL;
	} catch (e) {
		INDEV_BASE_URL = INDEV_BASE_URL || "http://localhost:19332/api";
		PUBLICATIONS_BASE_URL =
			PUBLICATIONS_BASE_URL || "http://localhost:19333/api";
		SEARCH_BASE_URL = SEARCH_BASE_URL || "http://localhost:19334/api";
	}
}

module.exports = {
	INDEV_BASE_URL,
	PUBLICATIONS_BASE_URL,
	SEARCH_BASE_URL,
};
