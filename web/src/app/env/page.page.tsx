import React from "react";

import { getNextPublicEnvVars } from "../../config/config-utils";

const EnvPage: () => Promise<JSX.Element> = async () => {
	try {
		const envVars = await getNextPublicEnvVars();

		return (
			<div>
				<h1>Environment Variables</h1>
				<ul>
					<li>NEXT_PUBLIC_BASE_URL: {envVars.NEXT_PUBLIC_BASE_URL}</li>
					<li>
						NEXT_PUBLIC_AUTH_ENVIRONMENT: {envVars.NEXT_PUBLIC_AUTH_ENVIRONMENT}
					</li>
					<li>NEXT_PUBLIC_BUILD_NUMBER: {envVars.NEXT_PUBLIC_BUILD_NUMBER}</li>
					<li>
						NEXT_PUBLIC_SEARCH_BASE_URL: {envVars.NEXT_PUBLIC_SEARCH_BASE_URL}
					</li>
					<li>PUBLIC_DENY_ROBOTS: {envVars.PUBLIC_DENY_ROBOTS}</li>
				</ul>
			</div>
		);
	} catch (error) {
		console.error("Error fetching environment variables:", error);

		return (
			<div>
				<h1>Error</h1>
				<p>
					Failed to fetch environment variables. Check the console for details.
				</p>
			</div>
		);
	}
};

export default EnvPage;
