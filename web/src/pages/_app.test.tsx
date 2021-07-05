/* eslint-disable testing-library/no-node-access */
import type { AppProps } from "next/app";
import { NextSeo } from "next-seo";
import { render, screen } from "@testing-library/react";

import NextWebApp from "./_app.page";
import { getMockRouter } from "@/test-utils";

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
