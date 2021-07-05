import "../styles/globals.css";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";

import { Header, Footer } from "@nice-digital/global-nav";
import { Container } from "@nice-digital/nds-container";

import { publicRuntimeConfig } from "@/config";

import "@nice-digital/design-system/scss/base.scss";

function NextWebApp({
	Component,
	pageProps,
	router: { pathname },
}: AppProps): JSX.Element {
	const service = pathname.indexOf("/guidance") === 0 ? "guidance" : undefined;

	return (
		<>
			<DefaultSeo
				titleTemplate={`%s | NICE`}
				openGraph={{
					type: "website",
					locale: "en_GB",
					url: publicRuntimeConfig.baseUrl + pathname,
					site_name: "NICE",
				}}
				twitter={{
					handle: "@NICEComms",
					site: "@NICEComms",
					cardType: "summary_large_image",
				}}
			/>
			<Header service={service} />
			<main id="content-start">
				<Container>
					<Component {...pageProps} />
				</Container>
			</main>
			<Footer />
		</>
	);
}

export default NextWebApp;
