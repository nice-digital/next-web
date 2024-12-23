"use client";

import React from "react";

type EnvPageClientProps = {
	envVars: {
		NEXT_PUBLIC_BASE_URL: string;
		NEXT_PUBLIC_AUTH_ENVIRONMENT: "test" | "live" | "beta" | "local";
		NEXT_PUBLIC_BUILD_NUMBER: string;
		NEXT_PUBLIC_SEARCH_BASE_URL: string;
		PUBLIC_DENY_ROBOTS?: string;
		NEXT_PUBLIC_JOHN?: string;
		PUBLIC_JOHN?: string;
		PUBLIC_NEW_JOHN?: string;
	};
};

const EnvPageClient: React.FC<EnvPageClientProps> = ({ envVars }) => {
	return (
		<div>
			<h1>Environment Variables - Client Page</h1>
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
				<li>NEXT_PUBLIC_JOHN: {envVars.NEXT_PUBLIC_JOHN}</li>
				<li>PUBLIC_JOHN: {envVars.PUBLIC_JOHN}</li>
				{/* <li>defaultjson PUBLIC_JOHN: {defaultJson.PUBLIC_JOHN}</li> */}
				<li>PUBLIC_NEW_JOHN?: {envVars.PUBLIC_NEW_JOHN}</li>
			</ul>
		</div>
	);
};

export default EnvPageClient;
