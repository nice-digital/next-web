import type { AppProps } from "next/app";
import { render, screen } from "@testing-library/react";

import NextWebApp from "./_app.page";
import { getMockRouter } from "@/test-utils";

describe("NextWebApp", () => {
	const FakeComponent: AppProps["Component"] = () => <>some content</>;

	it("should wrap main element around content", () => {
		render(
			<NextWebApp
				pageProps={{}}
				Component={FakeComponent}
				router={getMockRouter({ pathname: "/about" }) as AppProps["router"]}
			/>
		);

		expect(screen.getByRole("main")).toHaveTextContent("some content");
	});

	it("should add content-start skip link target id to main element", () => {
		render(
			<NextWebApp
				pageProps={{}}
				Component={FakeComponent}
				router={getMockRouter({ pathname: "/about" }) as AppProps["router"]}
			/>
		);

		expect(screen.getByRole("main")).toHaveAttribute("id", "content-start");
	});

	it("shouldn't highlight guidance on the menu for routes outside guidance", () => {
		render(
			<NextWebApp
				pageProps={{}}
				Component={FakeComponent}
				router={getMockRouter({ pathname: "/about" }) as AppProps["router"]}
			/>
		);

		expect(
			screen.getByText("NICE guidance", { selector: "header a" })
		).not.toHaveAttribute("aria-current");
	});

	it("should highlight guidance on the menu for routes under guidance", () => {
		render(
			<NextWebApp
				pageProps={{}}
				Component={FakeComponent}
				router={
					getMockRouter({
						pathname: "/guidance/published",
					}) as AppProps["router"]
				}
			/>
		);

		expect(
			screen.getByText("NICE guidance", { selector: "header a" })
		).toHaveAttribute("aria-current", "true");
	});
});
