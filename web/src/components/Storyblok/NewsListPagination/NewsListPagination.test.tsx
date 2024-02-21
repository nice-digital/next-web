import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import { NewsListPagination } from "./NewsListPagination";

describe("NewsListPagination", () => {
	const configuration = {
		currentPage: 1,
		totalResults: 100,
		resultsPerPage: 10,
	};

	let mockRouter: {
		pathname: string;
		query: Record<string, unknown>;
		push: jest.Mock<void, [string]>;
	};

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

	it.skip("should render the correct number of pages", () => {
		render(<NewsListPagination configuration={configuration} />);
		// const totalPages = Math.ceil(
		// 	configuration.totalResults / configuration.resultsPerPage
		// );
		// expect(
		// 	screen.getByText(`Page ${configuration.currentPage} of ${totalPages}`)
		// ).toBeInTheDocument();
		// expect(screen.getByText("Page")).toBeInTheDocument();
		// expect(screen.getByText("1")).toBeInTheDocument();
		// expect(screen.getByText("of")).toBeInTheDocument();
		// expect(screen.getByText("10")).toBeInTheDocument();
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

	it.todo(
		"should navigate to the correct page when clicking on Next page link"
	);

	it.todo(
		"should navigate to the correct page when clicking on Previous page link"
	);
});
