import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
	it("should render anchor with given text", () => {
		render(<SkipLink targetId="test">Test</SkipLink>);

		expect(screen.getByRole("link")).toBeInTheDocument();
		expect(screen.getByRole("link")).toHaveTextContent("Test");
	});

	it("should render anchor with given text", () => {
		render(<SkipLink targetId="test">Test</SkipLink>);

		expect(screen.getByRole("link")).toHaveAttribute("href", "#test");
	});

	it("should scroll the element into view with focus", () => {
		const skipTarget = document.createElement("div");
		skipTarget.id = "test";
		skipTarget.scrollIntoView = jest.fn();
		skipTarget.focus = jest.fn();
		document.body.append(skipTarget);

		render(<SkipLink targetId="test">Test</SkipLink>);

		userEvent.click(screen.getByRole("link"));

		expect(skipTarget.scrollIntoView).toHaveBeenCalled();
		expect(skipTarget.focus).toHaveBeenCalled();
		expect(skipTarget).toHaveAttribute("tabIndex", "-1");
	});
});
