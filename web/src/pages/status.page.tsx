import { NextSeo } from "next-seo";

import { logger } from "@/logger";

/**
 * Static status page, used for load balancer (e.g. Varnish) health checks ('probes' in Varnish speak).
 *
 * It doesn't matter what the content is, it just needs to return a 200, preferably
 * as fast as possible, hence being static.
 */
export default function StatusPage(): JSX.Element {
	logger.info("Client side test log (info)");
	logger.warn("Client side test log (warn)");
	logger.error("Client side test log (error)");

	return (
		<>
			<NextSeo title="Status" noindex />
			<h1>OK</h1>
			<p>This is a static status page, used for health checks</p>
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
