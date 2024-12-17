export const getNextPublicEnvVars = async (): Promise<{
	NEXT_PUBLIC_SEARCH_BASE_URL: string;
	NEXT_PUBLIC_AUTH_ENVIRONMENT: "test" | "live" | "beta" | "local";
}> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/env2`,
		{
			cache: "no-store",
		}
	);
	let env;
	try {
		env = await response.json();
	} catch (error) {
		console.error("Invalid JSON response:", error);
	}

	// console.log("calling env vars asynchronously", env);
	return env;
};
