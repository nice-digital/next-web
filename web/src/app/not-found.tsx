"use client";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";

// Note: 500 (and other status codes) are handled via LINK ./_error.page.tsx

export default function NotFoundPage(): JSX.Element {
	return (
		<ErrorPageContent
			title="Page not found"
			heading="We can't find this&nbsp;page - APP ROUTER"
			lead="It's probably been moved, updated or&nbsp;deleted."
		/>
	);
}
