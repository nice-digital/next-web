import { useRouter } from "next/router";

import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import {
	SearchResultsSuccess,
	SearchUrl,
	SortOrder,
} from "@nice-digital/search-client";

import sampleData from "@/mockData/search/guidance-published.json";
import { render, screen, cleanup } from "@/test-utils/rendering";

import { GuidanceListNav } from "../ProductListNav/GuidanceListNav";

import { getProductListPage } from "./ProductListPage";

jest.mock("@/logger", () => ({
	logger: { error: jest.fn() },
	useLogger: jest.fn(() => ({ error: jest.fn() })),
}));

describe("/guidance/published", () => {
	const ProductListPage = getProductListPage({
		metaDescription: "A list of all published guidance",
		listNavType: GuidanceListNav,
		breadcrumbTrail: [
			<Breadcrumb to="/guidance" key="NICE guidance">
				NICE guidance
			</Breadcrumb>,
		],
		currentBreadcrumb: "Published",
		preheading: "Published ",
		heading: <>Guidance, NICE advice and quality&nbsp;standards</>,
		title: "Published guidance, NICE advice and quality standards",
		defaultSort: {
			order: SortOrder.dateDescending,
			label: "Date",
		},
		secondarySort: {
			order: SortOrder.titleAscending,
			label: "Title",
		},
		showDateFilter: true,
		useFutureDates: false,
		dateFilterLabel: "Last updated date",
		tableBodyRender: (_docs) => (
			<tbody>
				<tr>
					<td>test</td>
				</tr>
			</tbody>
		),
	});

	let routerPush: jest.Mock;
	beforeEach(() => {
		routerPush = jest.fn();

		(useRouter as jest.Mock).mockImplementation(() => ({
			route: "/",
			pathname: "/guidance/published",
			query: "",
			asPath: "",
			push: routerPush,
		}));

		// eslint-disable-next-line testing-library/no-render-in-setup
		render(
			<ProductListPage
				activeModifiers={[]}
				results={sampleData as unknown as SearchResultsSuccess}
				searchUrl={{ route: "/guidance/published" } as SearchUrl}
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
			cleanup();

			render(
				<ProductListPage
					activeModifiers={[]}
					results={
						{ ...sampleData, documents: [] } as unknown as SearchResultsSuccess
					}
					searchUrl={{ route: "/guidance/published" } as SearchUrl}
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

		it("should add content-start skip link target id to div element", () => {
			const headingElement = screen.getByText(
				"Guidance, NICE advice and quality standards"
			);
			expect(headingElement.parentElement?.getAttribute("id")).toEqual(
				"content-start"
			);
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
			  data-component="table"
			  id="results"
			>
			  <tbody>
			    <tr>
			      <td>
			        test
			      </td>
			    </tr>
			  </tbody>
			</table>
		`);
		});
	});
});
