// import { render } from "@testing-library/react";
import mockDate from "mockdate";
import { useRouter } from "next/router";

import {
	SearchResults,
	SearchResultsSuccess,
	SearchUrl,
} from "@nice-digital/search-client";

import { render, screen, waitFor, within } from "@/test-utils";
import { formatDateStr } from "@/utils/index";

// import sampleData from "../../__mocks__/__data__/search/guidance-published.json";
import sampleData from "../__mocks__/__data__/search/search-results.json";
// import PublishedPage from "./../published.page";

import SearchPage from "./search.page";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
}));

type SearchDefaultProps = {
	results: SearchResults;
	activeModifiers: { displayName: string; toggleUrl: string }[];
	searchUrl: SearchUrl;
};

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
