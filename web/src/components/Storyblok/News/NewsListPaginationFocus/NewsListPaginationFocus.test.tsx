import { render, screen } from "@testing-library/react";
import React, { createRef } from "react";

import { usePaginationFocus } from "@/hooks/usePaginationFocus";

import { PaginationFocusedElement } from "./NewsListPaginationFocus";

jest.mock("@/hooks/usePaginationFocus", () => ({
	usePaginationFocus: jest.fn(),
}));

describe("PaginationFocusedElement", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders with inner text", () => {
		const focusPaginationRef = createRef();
		const innerText = "example text";

		(usePaginationFocus as jest.Mock).mockReturnValue(focusPaginationRef);

		render(<PaginationFocusedElement innerText={innerText} />);

		expect(
			screen.getByRole("heading", { name: innerText })
		).toBeInTheDocument();
	});

	it("renders with visually-hidden class", () => {
		const focusPaginationRef = createRef();
		const innerText = "example text";

		(usePaginationFocus as jest.Mock).mockReturnValue(focusPaginationRef);

		render(<PaginationFocusedElement innerText={innerText} />);
		const headingElement = screen.getByRole("heading", { name: innerText });

		expect(headingElement).toHaveClass("visually-hidden");
	});

	it("renders with tabIndex -1", () => {
		const focusPaginationRef = createRef();
		const innerText = "example text";

		(usePaginationFocus as jest.Mock).mockReturnValue(focusPaginationRef);

		render(<PaginationFocusedElement innerText={innerText} />);
		const headingElement = screen.getByRole("heading", { name: innerText });

		expect(headingElement).toHaveAttribute("tabIndex", "-1");
	});
});
