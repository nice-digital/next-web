/* eslint-disable testing-library/no-node-access */
import type { AppProps } from "next/app";
import { NextSeo } from "next-seo";
import { render, screen } from "@testing-library/react";

import { useEffect } from "react";
import NextWebApp from "./_app.page";
import { getMockRouter } from "@/test-utils";
import { logger } from "@/logger";

// NextWebApp.componentDidCatch logs so we don't want extra console logs littering our tests
jest.mock("@/logger", () => ({ logger: { error: jest.fn() } }));

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
				).toHaveAttribute("content", "NICE");
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

	it("should add content-start skip link target id to main element", () => {
		renderApp();

		expect(screen.getByRole("main")).toHaveAttribute("id", "content-start");
	});

	it("shouldn't highlight guidance on the menu for routes outside guidance", () => {
		renderApp({ pathname: "/not-guidance" });

		expect(
			screen.getByText("NICE guidance", { selector: "header a" })
		).not.toHaveAttribute("aria-current");
	});

	it("should highlight guidance on the menu for routes under guidance", () => {
		renderApp({ pathname: "/guidance/published" });

		expect(
			screen.getByText("NICE guidance", { selector: "header a" })
		).toHaveAttribute("aria-current", "true");
	});
});
