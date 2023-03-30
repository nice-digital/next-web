import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import {
	SearchResultsError,
	SearchResultsSuccess,
	SearchUrl,
} from "@nice-digital/search-client";

import { render, screen, waitFor } from "@/test-utils";

import sampleDataFailed from "../__mocks__/__data__/search/search-results-failed.json";
import sampleData from "../__mocks__/__data__/search/search-results.json";

import SearchPage from "./search.page";

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
		it("should render 'Search results' in the page title", async () => {
			render(
				<SearchPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ route: "/search?q=liver+cancer" } as SearchUrl}
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
