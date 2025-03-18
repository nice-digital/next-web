"use client";

import {
	Header,
	type HeaderProps,
	type Service,
} from "@nice-digital/global-nav";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface HeaderClientProps extends HeaderProps {
	searchBasePath: string;
	authEnv: "live" | "beta" | "test" | "local"
}


/**
 * Client components cannot access config directly without error.  We can pass the config as props to the client component and use it to configure the header.
 *
 * Not an ideal approach as we're not adhering to NextJS recommendations, but shows there are ways to pass config to client components from server components with the current config setup.
 */

export default function HeaderClient(props : HeaderClientProps): JSX.Element {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryTerm = searchParams ? (searchParams.get("q") as string) : "";
	const { searchBasePath, authEnv } = props;


	// process.env.NEXT_PUBLIC_SEARCH_BASE_URL
	// process.env.NEXT_PUBLIC_AUTH_ENVIRONMENT
	const headerProps : HeaderProps  = {
		search: {
			url: "/search",
			autocomplete: searchBasePath  + "/typeahead?index=nice",
			query: queryTerm,
			onSearching: (e): void => {
				router.push(`/search?q=${e.query}`);
			},
		},
		auth: {
			provider: "niceAccounts",
			environment: authEnv,
		},
	};

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

/**
 *  Creates a client wrapper for the Header component from global-nav
 *  NOTE: we can add relevant logic to handle header props here
 * import react hooks etc to handle state and props
*/
	return (
		<Header {...headerProps} service={service}/>
	);
}
