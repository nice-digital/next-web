import { render, screen } from "@testing-library/react";

import { InlineTextFilter } from "./InlineTextFilter";

describe("InlineTextFilter", () => {
	it("should render FilterGroup with given heading", () => {
		render(<InlineTextFilter name="test" heading="Test heading" />);
		const filterHeading = screen.getByRole("button", {
			name: "Test heading",
		});

		expect(filterHeading).toBeInTheDocument();
		expect(filterHeading).toHaveProperty("tagName", "BUTTON");
	});

	it("should render input with id matching the given component name prop", () => {
		render(<InlineTextFilter heading="Test label" name="test" />);

		const input = screen.getByRole("textbox", { id: "test" });

		expect(input).toHaveProperty("tagName", "INPUT");
		expect(input).toHaveAttribute("type", "text");
	});

	it("should render placeholder on input", () => {
		render(
			<InlineTextFilter
				heading="Test label"
				name="test"
				placeholder="Some text"
			/>
		);

		const input = screen.getByPlaceholderText("Some text");

		expect(input).toBeInTheDocument();
	});

	it("should render default value on input", () => {
		render(
			<InlineTextFilter
				heading="Test label"
				name="test"
				defaultValue="Some value"
			/>
		);

		const input = screen.getByDisplayValue("Some value");

		expect(input).toBeInTheDocument();
	});

	it("should render cta submit button", () => {
		render(<InlineTextFilter heading="Test label" name="q" />);

		const button = screen.getByText("Apply Filter");

		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("type", "submit");
		expect(button).toHaveClass("btn");
	});
});
