import { getNextPublicEnvVars } from "../../config/config-utils";
import EnvPageClient from "./client";

export const dynamic = "force-dynamic";

const EnvPage = async (): Promise<JSX.Element> => {
	try {
		const envVars = await getNextPublicEnvVars();
		return <EnvPageClient envVars={envVars} />;
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
