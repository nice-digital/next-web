import { ErrorInfo, FC } from "react";
import { DefaultSeo } from "next-seo";
import App, { AppProps } from "next/app";
import Script from "next/script";

import "@nice-digital/design-system/scss/base.scss";

import { Header, HeaderProps, Footer } from "@nice-digital/global-nav";
import { Container } from "@nice-digital/nds-container";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { GoogleTagManager } from "@/components/GoogleTagManager/GoogleTagManager";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";

interface AppState {
	/**
	 * Whether an error has been caught in componentDidCatch.
	 * If it's true then we should show the server error component
	 */
	hasError: boolean;
}

const AppFooter: FC = () => (
	<>
		<GoogleTagManager />
		<Script
			src={publicRuntimeConfig.cookieBannerScriptUrl}
			strategy="beforeInteractive"
		/>
		<Footer />
	</>
);

const headerProps: HeaderProps = {
	search: {
		url: "/search",
		autocomplete: "/autocomplete",
	},
	auth: { provider: "niceAccounts", environment: "live" },
};

// eslint-disable-next-line @typescript-eslint/ban-types
class NextWebApp extends App<{}, {}, AppState> {
	constructor(props: AppProps) {
		super(props);

		this.state = { hasError: false };

		this.handleRouteChange = this.handleRouteChange.bind(this);
	}

	handleRouteChange(path: string): void {
		window.dataLayer.push({ event: "pageview", path });
	}

	componentDidMount(): void {
		this.props.router.events.on("routeChangeComplete", this.handleRouteChange);
	}

	componentWillUnmount(): void {
		this.props.router.events.off("routeChangeComplete", this.handleRouteChange);
	}

	/**
	 * React function for handling client-side errors.
	 * @see https://reactjs.org/docs/error-boundaries.html
	 *
	 * @param error The caught error object
	 * @param errorInfo Extra information about the error like component stack
	 */
	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Global error logging (client-side only)
		logger.error(error, errorInfo.componentStack);

		this.setState({ hasError: true });
	}

	render(): JSX.Element {
		const {
				Component,
				pageProps,
				router: { pathname },
			} = this.props,
			service = pathname.indexOf("/guidance") === 0 ? "guidance" : undefined;

		if (this.state.hasError)
			return (
				<>
					<DefaultSeo titleTemplate={`%s | NICE`} />
					<Header {...headerProps} service={service} />
					<main id="content-start">
						<Container>
							<ErrorPageContent />
						</Container>
					</main>
					<AppFooter />
				</>
			);

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
						cardType: "summary",
					}}
				/>
				<Header {...headerProps} service={service} />
				<main id="content-start">
					<Container>
						<Component {...pageProps} />
					</Container>
				</main>
				<AppFooter />
			</>
		);
	}
}

export default NextWebApp;
