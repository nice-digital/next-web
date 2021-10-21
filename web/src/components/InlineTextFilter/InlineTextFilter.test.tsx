import { render, screen } from "@testing-library/react";

import { InlineTextFilter } from "./InlineTextFilter";

describe("InlineTextFilter", () => {
	it("should render label with given text", () => {
		render(<InlineTextFilter label="Test label" name="test" />);

		const label = screen.getByText("Test label");

		expect(label).toBeInTheDocument();
		expect(label).toHaveProperty("tagName", "LABEL");
	});

	it("should render label matching given input name", () => {
		render(<InlineTextFilter label="Test label" name="test" />);

		const input = screen.getByLabelText("Test label");

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

		const input = screen.getByLabelText("Test label");

		expect(input).toHaveProperty("placeholder", "Some text");
	});

	it("should render default value on input", () => {
		render(
			<InlineTextFilter
				label="Test label"
				name="test"
				defaultValue="Some value"
			/>
		);

		const input = screen.getByLabelText("Test label");

		expect(input).toHaveProperty("value", "Some value");
	});

	it("should render cta submit button", () => {
		render(<InlineTextFilter label="Test label" name="q" />);

		const button = screen.getByText("Filter");

		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("type", "submit");
		expect(button).toHaveClass("btn");
	});
});
