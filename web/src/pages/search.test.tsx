import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import {
	SearchResultsError,
	SearchResultsSuccess,
	SearchUrl,
} from "@nice-digital/search-client";

import sampleDataNoResults from "@/mockData/search/search-no-results.json";
import sampleDataFailed from "@/mockData/search/search-results-failed.json";
import sampleData from "@/mockData/search/search-results.json";
import { render, screen, waitFor } from "@/test-utils/rendering";

import SearchPage from "./search";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
	events: {
		on: jest.fn(),
		off: jest.fn(),
	},
	beforePopState: jest.fn(() => null),
	prefetch: jest.fn(() => null),
}));

describe("search", () => {
	describe("SEO", () => {
		it("should render 'Search results' in the page title when there's no search term", async () => {
			render(
				<SearchPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ q: "", route: "/search?q=" } as SearchUrl}
				/>
			);
			await waitFor(() => {
				expect(document.title).toStartWith("Search results");
			});
		});

		it("should render noindex, follow robots meta tag", async () => {
			render(
				<SearchPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ route: "/search?q=liver+cancer" } as SearchUrl}
				/>
			);
			await waitFor(() => {
				// eslint-disable-next-line testing-library/no-node-access
				expect(document.querySelector("meta[name='robots']")).toHaveProperty(
					"content",
					"noindex,follow"
				);
			});
		});

		it("should render search term in the page title when there's at least 1 result", async () => {
			render(
				<SearchPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={
						{ q: "liver cancer", route: "/search?q=liver+cancer" } as SearchUrl
					}
				/>
			);
			await waitFor(() => {
				expect(document.title).toStartWith("liver cancer | Search results");
			});
		});

		it("should render 'No results' in the page title when there are no results", async () => {
			render(
				<SearchPage
					activeModifiers={[]}
					results={sampleDataNoResults as unknown as SearchResultsSuccess}
					searchUrl={
						{ q: "zzzzzzzzzzzz", route: "/search?q=zzzzzzzzzzzz" } as SearchUrl
					}
				/>
			);
			await waitFor(() => {
				expect(document.title).toStartWith("No results | Search results");
			});
		});
	});

	describe("Sorting", () => {
		it("should push sort event to the data layer", async () => {
			window.dataLayer = [];
			render(
				<SearchPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ route: "/search?q=" } as SearchUrl}
				/>
			);

			const sortSelect = screen.getByRole("combobox", {
				name: /sort by/i,
			});

			userEvent.selectOptions(sortSelect, "relevance");

			await waitFor(() => {
				expect(window.dataLayer[0]).toStrictEqual({
					event: "sort",
					sort_by: "relevance",
				});
			});
		});
	});

	describe("Error message", () => {
		it("should render an error heading when search results fail", () => {
			render(
				<SearchPage
					activeModifiers={[]}
					results={sampleDataFailed as unknown as SearchResultsError}
					searchUrl={{ route: "/search?q=" } as SearchUrl}
				/>
			);
			const errorHeading = screen.getByRole("heading", {
				name: "Something's gone wrong",
			});
			expect(errorHeading).toBeInTheDocument();
		});
	});
});
