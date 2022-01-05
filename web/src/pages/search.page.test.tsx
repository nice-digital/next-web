import mockDate from "mockdate";
import { useRouter } from "next/router";

import { SearchResultsSuccess, SearchUrl } from "@nice-digital/search-client";

import { render, screen, waitFor, within } from "@/test-utils";

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
	let container: HTMLElement;
	beforeEach(() => {
		mockDate.set("2020-11-22");

		container = render(
			<SearchPage
				activeModifiers={[]}
				results={sampleData as unknown as SearchResultsSuccess}
				searchUrl={{ route: "/search?q=" } as SearchUrl}
			/>
		).container;
	});
	describe("SEO", () => {
		it.only("should render 'Search results' in the page title", async () => {
			await waitFor(() => {
				expect(document.title).toStartWith("Search results");
			});
		});
	});
});
