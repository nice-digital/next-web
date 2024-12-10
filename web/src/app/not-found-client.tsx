"use client";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { useEffect, useState } from "react";

export default function NotFoundClient(): JSX.Element {
	const [showDebug, setShowDebug] = useState(false);

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		setShowDebug(query.get("showDebug") === "true");
	}, []); // Only runs once when the component is mounted

	return (
		<>
			<ErrorPageContent
				title="Page not found"
				heading="We can't find this&nbsp;page"
				lead="It's probably been moved, updated or&nbsp;deleted."
			/>

			{showDebug && (
				<div>
					<pre>
						<code>
							{`NEXT_PUBLIC_BUILD_NUMBER: ${
								process.env.NEXT_PUBLIC_BUILD_NUMBER || "Not defined"
							}`}
							{`\nNEXT_PUBLIC_AUTH_ENVIRONMENT: ${
								process.env.NEXT_PUBLIC_AUTH_ENVIRONMENT || "Not defined"
							}`}
							{`\nNEXT_PUBLIC_STORYBLOK_ENABLE_ROOT_CATCH_ALL: ${
								process.env.NEXT_PUBLIC_STORYBLOK_ENABLE_ROOT_CATCH_ALL ||
								"Not defined"
							}`}
							{`\nNEXT_PUBLIC_STORYBLOK_OCELOT_ENDPOINT: ${
								process.env.NEXT_PUBLIC_STORYBLOK_OCELOT_ENDPOINT ||
								"Not defined"
							}`}
							{`\nNEXT_PUBLIC_PUBLIC_BASE_URL: ${
								process.env.NEXT_PUBLIC_PUBLIC_BASE_URL || "Not defined"
							}`}
							{`\nNEXT_PUBLIC_ENVIRONMENT: ${
								process.env.NEXT_PUBLIC_ENVIRONMENT || "Not defined"
							}`}
							{`\nNEXT_PUBLIC_PUBLIC_COOKIE_BANNER_SCRIPT_URL: ${
								process.env.PUBLIC_COOKIE_BANNER_SCRIPT_URL || "Not defined"
							}`}
							{`\nNEXT_PUBLIC_BASE_URL: ${
								process.env.NEXT_PUBLIC_BASE_URL || "Not defined"
							}`}
							{`\nPUBLIC_DENY_ROBOTS: ${
								process.env.PUBLIC_DENY_ROBOTS || "Not defined"
							}`}
							{`\nPUBLIC_CACHE_CONTROL_DEFAULT_CACHE_HEADER: ${
								process.env.PUBLIC_CACHE_CONTROL_DEFAULT_CACHE_HEADER ||
								"Not defined"
							}`}
						</code>
					</pre>
				</div>
			)}
		</>
	);
}
