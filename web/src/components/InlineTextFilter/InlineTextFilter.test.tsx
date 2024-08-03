import { render, screen } from "@testing-library/react";

import { InlineTextFilter } from "./InlineTextFilter";

describe("InlineTextFilter", () => {
	it("should render label with given text", () => {
		render(
			<InlineTextFilter label="Test label" name="test" heading="Test heading" />
		);
		const label = screen.getByRole("button", {
			name: "Test heading",
		});

		expect(label).toBeInTheDocument();
		expect(label).toHaveProperty("tagName", "BUTTON");
	});

	it("should render label matching given input name", () => {
		render(<InlineTextFilter label="Test label" name="test" />);

		const input = screen.getByRole("textbox", { id: "test" });

		expect(input).toHaveProperty("tagName", "INPUT");
		expect(input).toHaveAttribute("type", "text");
	});

	it("should render placeholder on input", () => {
		render(
			<InlineTextFilter
				label="Test label"
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
				label="Test label"
				name="test"
				defaultValue="Some value"
			/>
		);

		const input = screen.getByDisplayValue("Some value");

		expect(input).toBeInTheDocument();
	});

	it("should render cta submit button", () => {
		render(<InlineTextFilter label="Test label" name="q" />);

		const button = screen.getByText("Apply Filter");

		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("type", "submit");
		expect(button).toHaveClass("btn");
	});
});
