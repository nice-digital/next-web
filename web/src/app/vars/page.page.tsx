export default async function Home() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000"}/api/env2`,
		{
			cache: "no-store",
		}
	);
	if (!response.ok) {
		console.error(
			"Failed to fetch environment variables:",
			response.statusText
		);
		return (
			<div>
				<p>Error fetching environment variables</p>
			</div>
		);
	}
	let env;
	try {
		env = await response.json();
	} catch (error) {
		console.error("Invalid JSON response:", error);
		return (
			<div>
				<p>Error parsing environment variables</p>
			</div>
		);
	}

	console.log({ env });

	return (
		<>
			<h1>Env vars</h1>
			<p>BASE URL: {env.NEXT_PUBLIC_BASE_URL}</p>
			<p>Auth Environment: {env.NEXT_PUBLIC_AUTH_ENVIRONMENT}</p>
			<p>Build number: {env.NEXT_PUBLIC_BUILD_NUMBER}</p>
		</>
	);
}
