/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";

import { logger } from "@/logger";
import { getMockRouter } from "@/test-utils/rendering";

import NextWebApp, { reportWebVitals } from "./_app.page";

import type { AppProps } from "next/app";

// Global nav is mocked globally to make tests simpler but we need the actual, original implementation here
jest.unmock("@nice-digital/global-nav");

// NextWebApp.componentDidCatch logs so we don't want extra console logs littering our tests
jest.mock("@/logger", () => ({
	logger: { error: jest.fn(), info: jest.fn() },
}));

const FakeComponentWithSEO: AppProps["Component"] = () => (
	<>
		<NextSeo title="A test title" />
		<p>some content</p>
	</>
);

const renderApp = (routerParams?: Parameters<typeof getMockRouter>[0]) =>
	render(
		<NextWebApp
			pageProps={{}}
			Component={FakeComponentWithSEO}
			router={getMockRouter(routerParams) as AppProps["router"]}
		/>
	);

describe("NextWebApp", () => {
	describe("SEO and meta tags", () => {
		it("should append '| NICE' to page title", async () => {
			renderApp();

			expect(document.title).toBe("A test title | NICE");
		});

		it("should add canonical meta tag for dynamic slug page with query string removed", async () => {
			renderApp({
				pathname: "/news/articles/[slug]",
				asPath: "/news/articles/some-dynamic-slug?action=test",
			});

			expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
				"href",
				"https://next-web-tests.nice.org.uk/news/articles/some-dynamic-slug"
			);
		});

		describe("open graph", () => {
			it("should set en_GB open graph locale meta tag", async () => {
				renderApp();

				expect(
					document.querySelector("meta[property='og:locale']")
				).toHaveAttribute("content", "en_GB");
			});

			it("should set open graph type meta tag", async () => {
				renderApp();

				expect(
					document.querySelector("meta[property='og:type']")
				).toHaveAttribute("content", "website");
			});

			it("should set open graph url meta tag", async () => {
				renderApp({ pathname: "/test" });

				expect(
					document.querySelector("meta[property='og:url']")
				).toHaveAttribute("content", "https://next-web-tests.nice.org.uk/test");
			});

			it("should set open graph site meta tag", async () => {
				renderApp();

				expect(
					document.querySelector("meta[property='og:site_name']")
				).toHaveAttribute(
					"content",
					"NICE website: The National Institute for Health and Care Excellence"
				);
			});
		});

		describe("twitter", () => {
			it("should set twitter site meta tag", async () => {
				renderApp();

				expect(
					document.querySelector("meta[name='twitter:site']")
				).toHaveAttribute("content", "@NICEComms");
			});

			it("should set twitter creator meta tag", async () => {
				renderApp();

				expect(
					document.querySelector("meta[name='twitter:creator']")
				).toHaveAttribute("content", "@NICEComms");
			});
		});
	});

	describe("Error handling", () => {
		it("should log error when caught", () => {
			const error = new Error("A client side error");
			const FakeErroringComponent: AppProps["Component"] = () => {
				useEffect(() => {
					throw error;
				}, []);

				return <></>;
			};

			render(
				<NextWebApp
					pageProps={{}}
					Component={FakeErroringComponent}
					router={getMockRouter() as AppProps["router"]}
				/>
			);

			expect(logger.error as jest.Mock).toHaveBeenCalled();
			expect(logger.error as jest.Mock).toHaveBeenCalledWith(
				error,
				// errorInfo:
				expect.stringContaining("at FakeErroringComponent")
			);
		});

		it("should render error when error caught", () => {
			const FakeErroringComponent: AppProps["Component"] = () => {
				useEffect(() => {
					throw new Error("A client side error");
				}, []);

				return (
					<p>
						This text shouldnt show as an error component should render instead,
						because of Apps componentDidCatch
					</p>
				);
			};

			render(
				<NextWebApp
					pageProps={{}}
					Component={FakeErroringComponent}
					router={getMockRouter() as AppProps["router"]}
				/>
			);

			expect(screen.getByRole("main")).not.toHaveTextContent(
				"This text shouldnt show"
			);
			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
				"Something's gone wrong"
			);
		});
	});

	it("should wrap main element around content", () => {
		renderApp();

		expect(screen.getByRole("main")).toHaveTextContent("some content");
	});

	it("shouldn't highlight guidance on the menu for routes outside guidance", async () => {
		renderApp({ pathname: "/not-guidance" });

		const guidanceLinks = screen.queryAllByRole("link", { name: "Guidance" });
		expect(guidanceLinks).not.toBeNull();
		expect(guidanceLinks).not.toHaveLength(0);
		expect(guidanceLinks[0]).not.toHaveAttribute("aria-current", "true");
	});

	it("should highlight guidance on the menu for routes under guidance", () => {
		renderApp({ pathname: "/guidance/published" });

		const guidanceLinks = screen.queryAllByRole("link", { name: "Guidance" });
		expect(guidanceLinks).not.toBeNull();
		expect(guidanceLinks).not.toHaveLength(0);

		expect(guidanceLinks[0]).toHaveAttribute("aria-current", "true");
	});

	describe("reportWebVitals", () => {
		beforeEach(() => {
			window.dataLayer = [];
		});

		afterEach(() => {
			window.dataLayer = [];
		});

		it("should push web vital to the data layer", () => {
			reportWebVitals({
				id: "1234",
				name: "FCP",
				value: 999,
				startTime: 0,
				label: "web-vital",
			});

			expect(window.dataLayer).toHaveLength(1);
			expect(window.dataLayer[0]).toStrictEqual({
				event: "web-vitals",
				eventCategory: "Web Vitals",
				eventAction: "FCP",
				eventLabel: "1234",
				eventValue: 999,
			});
		});

		it("should push CLS vital to the data layer with 1000x value", () => {
			reportWebVitals({
				id: "abc",
				name: "CLS",
				value: 0.05,
				startTime: 0,
				label: "web-vital",
			});

			expect(window.dataLayer).toHaveLength(1);
			expect(window.dataLayer[0]).toStrictEqual({
				event: "web-vitals",
				eventCategory: "Web Vitals",
				eventAction: "CLS",
				eventLabel: "abc",
				eventValue: 50,
			});
		});

		it("should push Next.js custom metric vital to the data layer", () => {
			reportWebVitals({
				id: "abc",
				name: "Next.js-hydration",
				value: 99,
				startTime: 0,
				label: "custom",
			});

			expect(window.dataLayer).toHaveLength(1);
			expect(window.dataLayer[0]).toStrictEqual({
				event: "web-vitals",
				eventCategory: "Next.js custom metric",
				eventAction: "Next.js-hydration",
				eventLabel: "abc",
				eventValue: 99,
			});
		});
	});
});
