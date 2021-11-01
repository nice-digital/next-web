import { useRouter } from "next/router";

import {
	SearchResultsSuccess,
	SearchUrl,
	SortOrder,
} from "@nice-digital/search-client";

import { render, screen } from "@/test-utils";

import sampleData from "../../__mocks__/__data__/search/guidance-published.json";

import { GuidanceListPage } from "./GuidanceListPage";

jest.mock("@/logger", () => ({
	logger: { error: jest.fn() },
	useLogger: jest.fn(() => ({ error: jest.fn() })),
}));

describe("/guidance/published", () => {
	let routerPush: jest.Mock;
	beforeEach(() => {
		routerPush = jest.fn();

		(useRouter as jest.Mock).mockImplementation(() => ({
			route: "/",
			pathname: "",
			query: "",
			asPath: "",
			push: routerPush,
		}));

		render(
			<GuidanceListPage
				activeModifiers={[]}
				results={sampleData as unknown as SearchResultsSuccess}
				searchUrl={{ route: "/guidance/published" } as SearchUrl}
				metaDescription="A list of all published guidance"
				breadcrumb="Published"
				preheading="Published "
				heading={<>Guidance, NICE advice and quality&nbsp;standards</>}
				title="Published guidance, NICE advice and quality standards"
				defaultSort={{
					order: SortOrder.dateDescending,
					label: "Date",
				}}
				secondarySort={{
					order: SortOrder.titleAscending,
					label: "Title",
				}}
				showDateFilter={true}
				useFutureDates={false}
				dateFilterLabel="Last updated date"
				tableBodyRender={(_docs) => <p>test</p>}
			/>
		);
	});

	describe("Meta", () => {
		it("should set meta description", () => {
			expect(
				document.querySelector("meta[name='description']")
			).toBeInTheDocument();
			expect(document.querySelector("meta[name='description']")).toHaveProperty(
				"content",
				"A list of all published guidance"
			);
		});

		it("should set page title", () => {
			expect(document.title).toBe(
				"Published guidance, NICE advice and quality standards | Guidance | NICE"
			);
		});

		it("should not set noindex meta tag when there are results", () => {
			expect(document.querySelector("meta[name='robots']")).toBeInTheDocument();
			expect(document.querySelector("meta[name='robots']")).toHaveProperty(
				"content",
				"index,follow"
			);
		});

		it("should set noindex meta tag when no results", () => {
			render(
				<GuidanceListPage
					activeModifiers={[]}
					results={
						{ ...sampleData, documents: [] } as unknown as SearchResultsSuccess
					}
					searchUrl={{ route: "/guidance/published" } as SearchUrl}
					metaDescription="A list of all published guidance"
					breadcrumb="Published"
					preheading="Published "
					heading={<>Guidance, NICE advice and quality&nbsp;standards</>}
					title="Published guidance, NICE advice and quality standards"
					defaultSort={{
						order: SortOrder.dateDescending,
						label: "Date",
					}}
					showDateFilter={true}
					useFutureDates={false}
					dateFilterLabel="Last updated date"
					tableBodyRender={(_docs) => <p>test</p>}
				/>
			);
			expect(document.querySelector("meta[name='robots']")).toBeInTheDocument();
			expect(document.querySelector("meta[name='robots']")).toHaveProperty(
				"content",
				"noindex,follow"
			);
		});
	});

	describe("Skip links", () => {
		it("should render skip link to filters", () => {
			expect(
				screen.getByRole("link", { name: "Skip to filters" })
			).toHaveAttribute("href", "#filters");
		});

		it("should render two skip links to results", () => {
			const resultsSkipLinks = screen.getAllByRole("link", {
				name: "Skip to results",
			});
			expect(resultsSkipLinks[0]).toHaveAttribute("href", "#results");
			expect(resultsSkipLinks[1]).toHaveAttribute("href", "#results");
		});
	});

	describe("Table body", () => {
		it("should add skip link target id to results table", () => {
			expect(screen.getByRole("table")).toHaveProperty("id", "results");
		});

		it("should use custom renderer for table body", () => {
			expect(screen.getByRole("table")).toMatchInlineSnapshot(`
			<table
			  aria-describedby="filter-summary"
			  class="table"
			  id="results"
			>
			  <p>
			    test
			  </p>
			</table>
		`);
		});
	});
});
