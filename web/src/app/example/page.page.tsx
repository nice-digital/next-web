import React from "react";

import { publicRuntimeConfig } from "@/config";

// export const dynamic = "force-dynamic";

export default function TestExamplePage(): JSX.Element {
	const configList = [];
	for (const property in publicRuntimeConfig) {
		configList.push(<li key={property}>{property}: </li>);
	}
	return (
		<React.Fragment>
			<h2>This is a test Example page that should be statically rendered</h2>
			<ul>{configList}</ul>
			<p>cookieBannerScriptURL: {publicRuntimeConfig.cookieBannerScriptURL}</p>
		</React.Fragment>
	);
}
