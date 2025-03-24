import { screen, waitFor } from "@testing-library/react";

import { render } from "@/test-utils/rendering";

import NotFoundPage from "./not-found.page";

describe("not-found", () => {
	describe("SEO", () => {
		it("should render 'Page not found' in the page title", async () => {
			render(<NotFoundPage />);
			await waitFor(() => {
				expect(document.title).toStartWith("Page not found");
			});
		});
	});

	describe("Breadcrumbs", () => {
		it("should render home breadcrumb linking to the homepage", () => {
			render(<NotFoundPage />);
			expect(
				screen.queryByText("Home", {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/");
		});

		it("should render page not found as current page breadcrumb without link", () => {
			render(<NotFoundPage />);
			expect(
				screen.getByText("Page not found", {
					selector: ".breadcrumbs span",
				})
			).toBeInTheDocument();
		});
	});

	it("should render heading 1 with correct text", () => {
		render(<NotFoundPage />);
		expect(
			screen.getByRole("heading", {
				level: 1,
			})
		).toHaveTextContent("We cannot find this page");
	});
});
