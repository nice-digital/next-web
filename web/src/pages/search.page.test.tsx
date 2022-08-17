import mockDate from "mockdate";
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
}));

describe("search", () => {
	describe("SEO", () => {
		beforeEach(() => {
			mockDate.set("2020-11-22");
		});
		it("should render 'Search results' in the page title", async () => {
			render(
				<SearchPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ route: "/search?q=" } as SearchUrl}
				/>
			);
			await waitFor(() => {
				expect(document.title).toStartWith("Search results");
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
