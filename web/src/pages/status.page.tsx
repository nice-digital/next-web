import { NextSeo } from "next-seo";

/**
 * Static status page, used for load balancer (e.g. Varnish) health checks ('probes' in Varnish speak).
 *
 * It doesn't matter what the content is, it just needs to return a 200, preferably
 * as fast as possible, hence being static.
 */
export default function StatusPage(): JSX.Element {
	return (
		<>
			<NextSeo title="Status" noindex />
			<h1>OK</h1>
			<p>This is a static status page, used for health checks</p>
		</>
	);
}
