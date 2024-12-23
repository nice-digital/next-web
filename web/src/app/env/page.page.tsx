import { getNextPublicEnvVars } from "../../config/config-utils";

export const dynamic = "force-dynamic";

const EnvPage: () => Promise<JSX.Element> = async () => {
	try {
		const envVars = await getNextPublicEnvVars();

		return (
			<div>
				<h1>Environment Variables</h1>
				<ul>
					{/* <li>NEXT_PUBLIC_BASE_URL: {envVars.NEXT_PUBLIC_BASE_URL}</li>
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
					<li>defaultjson PUBLIC_JOHN: {defaultJson.PUBLIC_JOHN}</li>
					<li>PUBLIC_NEW_JOHN?: {envVars.PUBLIC_NEW_JOHN} </li> */}
					<li>
						.env &gt; tc &gt; default &gt; octo ----- SANTA_BOTH:{" "}
						{envVars.SANTA_BOTH} NON-API: {process.env.SANTA_BOTH}
					</li>
					<li>
						tc &gt; default &gt; octo ----- SANTA_TC: {envVars.SANTA_TC}{" "}
						NON-API: {process.env.SANTA_TC}
					</li>
					<li>
						.env &gt; default &gt; octo ----- SANTA_ENV: {envVars.SANTA_ENV}{" "}
						NON-API: {process.env.SANTA_ENV}
					</li>
					<li>
						default &gt; octo ----- SANTA_NONE: {envVars.SANTA_NONE} NON-API:{" "}
						{process.env.SANTA_NONE}
					</li>
					<li>-----------------------------------------</li>
					<li>
						.env &gt; tc &gt; default &gt; octo ----- NEXT_PUBLIC_SANTA_BOTH:{" "}
						{envVars.NEXT_PUBLIC_SANTA_BOTH} NON-API:{" "}
						{process.env.NEXT_PUBLIC_SANTA_BOTH}
					</li>
					<li>
						tc &gt; default &gt; octo ----- NEXT_PUBLIC_SANTA_TC:{" "}
						{envVars.NEXT_PUBLIC_SANTA_TC} NON-API:{" "}
						{process.env.NEXT_PUBLIC_SANTA_TC}
					</li>
					<li>
						.env &gt; default &gt; octo ----- NEXT_PUBLIC_SANTA_ENV:{" "}
						{envVars.NEXT_PUBLIC_SANTA_ENV} NON-API:{" "}
						{process.env.NEXT_PUBLIC_SANTA_ENV}
					</li>
					<li>
						default &gt; octo ----- NEXT_PUBLIC_SANTA_NONE:{" "}
						{envVars.NEXT_PUBLIC_SANTA_NONE} NON-API:{" "}
						{process.env.NEXT_PUBLIC_SANTA_NONE}
					</li>
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
