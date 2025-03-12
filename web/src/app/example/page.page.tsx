import React from 'react';
import { publicRuntimeConfig, PublicConfig } from "@/config";

export default function TestExamplePage():JSX.Element {
	console.log("FROM PAGE")
	const configList = [];
	for (const property in publicRuntimeConfig) {
		configList.push(<li key={property}>{property}: </li>);
	}
	return (
		<React.Fragment>
			<h2>This is a test Example page</h2>
			<ul>
				{configList}
			</ul>
			<p>cookieBannerScriptURL: {publicRuntimeConfig.cookieBannerScriptURL}</p>
		</React.Fragment>
	);

}
