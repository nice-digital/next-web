"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { Footer, Header, Main, type Service } from "@nice-digital/global-nav";
import { Container } from "@nice-digital/nds-container";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { GoogleTagManager } from "@/components/GoogleTagManager/GoogleTagManager";
import { publicRuntimeConfig } from "@/config";

export default function LayoutClient({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [hasError, setHasError] = useState(false);

	// Simulate query term for header search
	const queryTerm = searchParams ? searchParams.get("q") || "" : "";

	// Handle pathname-based service selection
	let service: Service | undefined = undefined;
	if (pathname?.startsWith("/guidance")) {
		service = "guidance";
	} else if (
		pathname?.startsWith("/standards-indicators") ||
		pathname?.startsWith("/indicators")
	) {
		service = "standards-and-indicators";
	}

	const headerProps = {
		search: {
			url: "/search",
			autocomplete: `${publicRuntimeConfig.search.baseURL}/typeahead?index=nice`,
			query: queryTerm,
			onSearching: (e: { query: string }) => {
				router.push(`/search?q=${encodeURIComponent(e.query)}`);
			},
		},
		auth: {
			provider: "niceAccounts" as const,
			environment: publicRuntimeConfig.authEnvironment,
		},
	};

	// TODO - pass canonical pathname to a client component for metadata ?
	// const canonicalPathname =
	// 	pathname && pathname.includes("[slug]")
	// 		? pathname.split("?")[0]
	// 		: pathname || "";

	useEffect(() => {
		// TODO error handling
	}, [hasError]);

	return (
		<>
			<GoogleTagManager />
			<Header {...headerProps} service={service} />
			<Main>
				<Container>{hasError ? <ErrorPageContent /> : children}</Container>
			</Main>
			<Footer />
		</>
	);
}
