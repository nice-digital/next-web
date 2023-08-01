import { screen, waitFor } from "@testing-library/react";

import { render } from "@/test-utils/rendering";

import ErrorPage from "./_error";

describe("_error", () => {
	describe("SEO", () => {
		it("should render 'Error' in the page title", async () => {
			render(<ErrorPage />);
			await waitFor(() => {
				expect(document.title).toStartWith("Error");
			});
		});
	});

	describe("Breadcrumbs", () => {
		it("should render home breadcrumb linking to the homepage", () => {
			render(<ErrorPage />);
			expect(
				screen.queryByText("Home", {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/");
		});

		it("should render error as current page breadcrumb without link", () => {
			render(<ErrorPage />);
			expect(
				screen.getByText("Error", {
					selector: ".breadcrumbs span",
				})
			).toBeInTheDocument();
		});
	});

	it("should render heading 1 with correct text", () => {
		render(<ErrorPage />);
		expect(
			screen.getByRole("heading", {
				level: 1,
			})
		).toHaveTextContent("Something's gone wrong");
	});
});
