import { render, screen, waitFor } from "@testing-library/react";

import { ErrorPageContent, ErrorPageContentProps } from "./ErrorPageContent";

const props: Required<ErrorPageContentProps> = {
	title: "A test title",
	heading: "A test heading",
	lead: "A test lead",
	breadcrumbs: null,
};

describe("ErrorPageContent", () => {
	describe("SEO", () => {
		it("should render default title in document title", async () => {
			render(<ErrorPageContent />);
			await waitFor(() => {
				expect(document.title).toStartWith("Error");
			});
		});

		it("should render given title in document title", async () => {
			render(<ErrorPageContent {...props} />);
			await waitFor(() => {
				expect(document.title).toStartWith(props.title);
			});
		});
	});

	describe("Breadcrumbs", () => {
		it("should render home breadcrumb linking to the homepage", () => {
			render(<ErrorPageContent {...props} />);
			expect(
				screen.queryByText("Home", {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/");
		});

		it("should render given title as current page breadcrumb without link", () => {
			render(<ErrorPageContent {...props} />);
			expect(
				screen.getByText(props.title, {
					selector: ".breadcrumbs span",
				})
			).toBeInTheDocument();
		});

		it("should render given given breadcrumbs", () => {
			render(<ErrorPageContent {...props} breadcrumbs={"Some breadcrumbs"} />);
			expect(screen.getByText("Some breadcrumbs")).toBeInTheDocument();
		});
	});

	it("should render heading 1 with default text", () => {
		render(<ErrorPageContent />);
		expect(
			screen.getByRole("heading", {
				level: 1,
			})
		).toHaveTextContent("Something's gone wrong");
	});

	it("should render heading 1 with given text", () => {
		render(<ErrorPageContent {...props} />);
		expect(
			screen.getByRole("heading", {
				level: 1,
			})
		).toHaveTextContent("A test heading");
	});

	it("should match snapshot for main content", () => {
		render(<ErrorPageContent {...props} />);

		expect(document.body).toMatchSnapshot();
	});
});
