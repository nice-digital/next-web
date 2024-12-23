export const getNextPublicEnvVars = async (): Promise<{
	NEXT_PUBLIC_BASE_URL: string;
	NEXT_PUBLIC_AUTH_ENVIRONMENT: "test" | "live" | "beta" | "local";
	NEXT_PUBLIC_BUILD_NUMBER: string;
	NEXT_PUBLIC_SEARCH_BASE_URL: string;
	PUBLIC_DENY_ROBOTS: string;
	NEXT_PUBLIC_JOHN: string;
	PUBLIC_JOHN: string;
	PUBLIC_NEW_JOHN: string;
}> => {
	if (typeof window === "undefined") {
		// Server-side: Use environment variables directly
		return {
			NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "",
			NEXT_PUBLIC_AUTH_ENVIRONMENT:
				(process.env.NEXT_PUBLIC_AUTH_ENVIRONMENT as
					| "test"
					| "live"
					| "beta"
					| "local") || "local",
			NEXT_PUBLIC_BUILD_NUMBER: process.env.NEXT_PUBLIC_BUILD_NUMBER || "0",
			NEXT_PUBLIC_SEARCH_BASE_URL:
				process.env.NEXT_PUBLIC_SEARCH_BASE_URL || "",
			PUBLIC_DENY_ROBOTS: process.env.PUBLIC_DENY_ROBOTS || "",
			NEXT_PUBLIC_JOHN: process.env.NEXT_PUBLIC_JOHN || "",
			PUBLIC_JOHN: process.env.PUBLIC_JOHN || "",
			PUBLIC_NEW_JOHN: process.env.PUBLIC_NEW_JOHN || "",
		};
	}

	// Client-side: Fetch from API
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/env`,
		{
			cache: "no-store",
		}
	);

	let env;
	try {
		env = await response.json();
	} catch (error) {
		console.error("Invalid JSON response:", error);
		throw new Error("Failed to fetch environment variables");
	}

	return env;
};
