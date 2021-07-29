import { screen, waitFor } from "@testing-library/react";

import { render } from "@/test-utils";

import FourOhFourPage from "./404.page";

describe("404", () => {
	describe("SEO", () => {
		it("should render 'Page not found' in the page title", async () => {
			render(<FourOhFourPage />);
			await waitFor(() => {
				expect(document.title).toStartWith("Page not found");
			});
		});
	});

	describe("Breadcrumbs", () => {
		it("should render home breadcrumb linking to the homepage", () => {
			render(<FourOhFourPage />);
			expect(
				screen.queryByText("Home", {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/");
		});

		it("should render page not found as current page breadcrumb without link", () => {
			render(<FourOhFourPage />);
			expect(
				screen.queryByText("Page not found", {
					selector: ".breadcrumbs span",
				})
			).toBeInTheDocument();
		});
	});

	it("should render heading 1 with correct text", () => {
		render(<FourOhFourPage />);
		expect(
			screen.getByRole("heading", {
				level: 1,
			})
		).toHaveTextContent("We can't find this page");
	});
});
