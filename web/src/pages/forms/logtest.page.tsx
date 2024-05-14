import { NextSeo } from "next-seo";

import { logger } from "@/logger";

/**
 * Temp page for testing logs. Delete after use!
 */
export default function LogTestPage(): JSX.Element {
	logger.info("Client side test log (info)");
	logger.warn("Client side test log (warn)");
	logger.error("Client side test log (error)");

	return (
		<>
			<NextSeo title="Log test" noindex />
			<h1>Log test</h1>
			<p>Logging test page</p>
		</>
	);
}

export function getServerSideProps() {
	logger.info("Server side test log (info)");
	logger.warn("Server side test log (warn)");
	logger.error("Server side test log (error)");

	return {
		props: {
			this: "that",
		},
	};
}
