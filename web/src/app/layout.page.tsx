"use client";

import { Inter, Lora } from "next/font/google";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

import "@nice-digital/design-system/scss/base.scss";
import { Header, Footer, Main, type Service } from "@nice-digital/global-nav";
import { Container } from "@nice-digital/nds-container";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { GoogleTagManager } from "@/components/GoogleTagManager/GoogleTagManager";
import { publicRuntimeConfig } from "@/config";

//TODO fix styling for global nav font display
import "./global.scss";

//TODO - initialise storyblok in layout once?
// export const metadata: Metadata = {
// 	title: {
// 	  default: 'NICE',
// 	  template: '%s | NICE',
// 	},
//   }
const inter = Inter({ subsets: ["latin"], variable: "--sans-font-family" });
const lora = Lora({ subsets: ["latin"], variable: "--serif-font-family" });

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
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
	const canonicalPathname =
		pathname && pathname.includes("[slug]")
			? pathname.split("?")[0]
			: pathname || "";


	useEffect(() => {
		// TODO error handling
	}, [hasError]);

	return (
		<html lang="en">
			{/* TODO can metadata api be used for a root layout - possibly needs breaking down into server and client components */}
			 {/* <head> */}
				{/* <title>NICE root layout test title</title> */}
				{/* <meta name="test-meta" content="This is a test meta tag" /> */}
			 {/* <DefaultSeo {...getDefaultSeoConfig(canonicalPathname)} /> */}
			 {/* </head> */}

			<body className={`${lora.variable} ${inter.variable}`}>
				<GoogleTagManager />
				<Header {...headerProps} service={service} />
				<Main>
					<Container>{hasError ? <ErrorPageContent /> : children}</Container>
				</Main>
				<Footer />
			</body>
		</html>
	);
};

export default Layout;
