/* eslint-disable import/order */
import { ErrorInfo, FC } from "react";
import { DefaultSeo } from "next-seo";
import App, { AppProps, NextWebVitalsMetric } from "next/app";

import "@nice-digital/design-system/scss/base.scss";
import { Header, HeaderProps, Footer } from "@nice-digital/global-nav";
import { Container } from "@nice-digital/nds-container";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { GoogleTagManager } from "@/components/GoogleTagManager/GoogleTagManager";
import { logger } from "@/logger";

import { getDefaultSeoConfig } from "./next-seo.config";
import { publicRuntimeConfig } from "@/config";

import "@nice-digital/nds-table/scss/table.scss";
import "@nice-digital/nds-panel/scss/panel.scss";

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
		<Footer />
	</>
);

// eslint-disable-next-line @typescript-eslint/ban-types
class NextWebApp extends App<{}, {}, AppState> {
	headerObserver: MutationObserver | null = null;

	constructor(props: AppProps) {
		super(props);

		this.state = { hasError: false };

		this.handleRouteChange = this.handleRouteChange.bind(this);
		this.globalNavWrapperRef = this.globalNavWrapperRef.bind(this);
	}

	handleRouteChange(path: string): void {
		window.dataLayer.push({ event: "pageview", path });
	}

	componentDidMount(): void {
		this.props.router.events.on("routeChangeComplete", this.handleRouteChange);
	}

	componentWillUnmount(): void {
		this.props.router.events.off("routeChangeComplete", this.handleRouteChange);

		if (this.headerObserver) this.headerObserver.disconnect();
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

	/**
	 * TODO: Remove this hack to fix https://github.com/alphagov/accessible-autocomplete/issues/434
	 * We do this to make our axe tests pass
	 * Wait for the search box to appear before removing the aria-activedescendant attribute
	 * Same fix as in CKS: https://github.com/nice-digital/cks-gatsby/blob/master/gatsby/src/components/Header/Header.tsx#L39-L61
	 * @param node The div element that wraps global nav
	 */
	globalNavWrapperRef(node: HTMLDivElement | null): void {
		let searchInput: HTMLElement | null;
		if (node && "MutationObserver" in window) {
			this.headerObserver = new MutationObserver(() => {
				searchInput =
					searchInput ||
					document.querySelector("header form[role='search'] [name='q']");
				if (
					searchInput &&
					searchInput.getAttribute("aria-activedescendant") === "false"
				) {
					searchInput.setAttribute("aria-activedescendant", "");
				}
			});

			this.headerObserver.observe(node, {
				attributeFilter: ["aria-activedescendant"],
				attributes: true, // See https://stackoverflow.com/a/50593541/486434
				childList: true,
				subtree: true,
			});
		}
	}

	render(): JSX.Element {
		const queryTerm = this.props.router.query.q as string;

		const headerProps: HeaderProps = {
			search: {
				url: "/search",
				autocomplete:
					publicRuntimeConfig.search.baseURL + "/typeahead?index=nice",
				query: queryTerm,
				onSearching: (e): void => {
					// this.props.router.push("/search/?q=" + encodeURIComponent(e.query));
					this.props.router.push({
						pathname: "/search",
						query: { q: e.query },
					});
				},
			},
			auth: { provider: "niceAccounts", environment: "live" },
		};

		const {
				Component,
				pageProps,
				router: { pathname },
			} = this.props,
			service = pathname.indexOf("/guidance") === 0 ? "guidance" : undefined;

		if (this.state.hasError)
			return (
				<>
					<DefaultSeo {...getDefaultSeoConfig(pathname)} />
					<div ref={this.globalNavWrapperRef}>
						<Header {...headerProps} service={service} />
					</div>
					<main>
						<Container>
							<ErrorPageContent />
						</Container>
					</main>
					<AppFooter />
				</>
			);

		return (
			<>
				<DefaultSeo {...getDefaultSeoConfig(pathname)} />
				<div ref={this.globalNavWrapperRef}>
					<Header {...headerProps} service={service} />
				</div>
				<main>
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

/**
 * Next.JS hook for sending web vitals to analytics.
 *
 * See https://nextjs.org/docs/advanced-features/measuring-performance
 */
export const reportWebVitals = ({
	id,
	name,
	label,
	value,
}: NextWebVitalsMetric): void => {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: "web-vitals",
		eventCategory:
			label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
		eventAction: name,
		eventLabel: id,
		eventValue: Math.round(name === "CLS" ? value * 1000 : value),
	});
};
