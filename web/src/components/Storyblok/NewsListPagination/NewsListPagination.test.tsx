import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";

import { NewsListPagination } from "./NewsListPagination";

describe("NewsListPagination", () => {
	const configuration = {
		currentPage: 1,
		totalResults: 100,
		resultsPerPage: 10,
	};

	let mockRouter: any;

	beforeEach(() => {
		mockRouter = {
			pathname: "/news",
			query: {},
			push: jest.fn(),
		};

		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	afterEach(() => {
		jest.clearAllMocks(); // Reset all mock functions after each test
	});

	it("should render the correct number of pages", () => {
		render(<NewsListPagination configuration={configuration} />);
		const totalPages = Math.ceil(
			configuration.totalResults / configuration.resultsPerPage
		);
		expect(
			screen.getByText(`Page ${configuration.currentPage} of ${totalPages}`)
		).toBeInTheDocument();
	});

	it("should render pagination links correctly", () => {
		render(<NewsListPagination configuration={configuration} />);
		expect(screen.getByRole("link", { name: "Next Page" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Previous Page" })
		).toBeInTheDocument();
	});

	it("should not render previous page link on first page", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 1 }}
			/>
		);
		expect(
			screen.queryByRole("link", { name: "Previous Page" })
		).not.toBeInTheDocument();
	});

	it("should render the previous page link when not on the first page", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 2 }}
			/>
		);
		expect(
			screen.getByRole("link", { name: "Previous Page" })
		).toBeInTheDocument();
	});

	it("should not render next page link on last page", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 10 }}
			/>
		);
		expect(
			screen.queryByRole("link", { name: "Next Page" })
		).not.toBeInTheDocument();
	});

	it("should render the next page link when there are more pages", () => {
		render(<NewsListPagination configuration={configuration} />);
		expect(screen.getByRole("link", { name: "Next Page" })).toBeInTheDocument();
	});

	it("should navigate to the correct page when clicking on next page link", () => {
		render(<NewsListPagination configuration={configuration} />);
		fireEvent.click(screen.getByRole("link", { name: "Next Page" }));
		expect(mockRouter.push).toHaveBeenCalledWith("/news?page=2");
	});

	it("should navigate to the correct page when clicking on previous page link", () => {
		render(
			<NewsListPagination
				configuration={{ ...configuration, currentPage: 2 }}
			/>
		);
		fireEvent.click(screen.getByRole("link", { name: "Previous Page" }));
		expect(mockRouter.push).toHaveBeenCalledWith("/news?page=1");
	});
});
