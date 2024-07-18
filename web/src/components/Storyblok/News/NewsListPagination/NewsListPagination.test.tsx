import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { NewsListPagination } from "./NewsListPagination";

describe("NewsListPagination", () => {
	const configuration = {
		currentPage: 1,
		total: 100,
		perPage: 10,
	};

	let mockRouter: {
		pathname: string;
		query: Record<string, unknown>;
		push: jest.Mock<void, [string]>;
	};

	beforeEach(() => {
		mockRouter = {
			pathname: "/news",
			query: { page: "1" },
			push: jest.fn(),
		};

		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	afterEach(() => {
		jest.clearAllMocks(); // Reset all mock functions after each test
	});

	it("should render the correct number of pages", () => {
		const { container } = render(
			<NewsListPagination configuration={configuration} />
		);
		const totalPages = Math.ceil(configuration.total / configuration.perPage);

		expect(container.textContent).toHaveTextContentIgnoreTags(
			`Page ${configuration.currentPage} of ${totalPages}`
		);
	});

	it("should render pagination links correctly", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 2 }}
			/>
		);
		expect(screen.getByRole("link", { name: "Next page" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Previous page" })
		).toBeInTheDocument();
	});

	it("should not render Previous page link on first page", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 1 }}
			/>
		);
		expect(
			screen.queryByRole("link", { name: "Previous page" })
		).not.toBeInTheDocument();
	});

	it("should render the Previous page link when not on the first page", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 2 }}
			/>
		);
		expect(
			screen.getByRole("link", { name: "Previous page" })
		).toBeInTheDocument();
	});

	it("should not render Next page link on last page", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 10 }}
			/>
		);
		expect(
			screen.queryByRole("link", { name: "Next page" })
		).not.toBeInTheDocument();
	});

	it("should render the Next page link when there are more pages", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 9 }}
			/>
		);
		expect(screen.getByRole("link", { name: "Next page" })).toBeInTheDocument();
	});

	it("next and previous links have correct href attributes", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 5 }}
			/>
		);

		const nextLink = screen.getByText("Next page");
		const previousLink = screen.getByText("Previous page");

		expect(nextLink).toHaveAttribute("href", "/news?page=6");
		expect(previousLink).toHaveAttribute("href", "/news?page=4");
	});

	it.todo(
		"should navigate to the correct page when clicking on Next page link"
	);

	it.todo(
		"should navigate to the correct page when clicking on Previous page link"
	);
});
