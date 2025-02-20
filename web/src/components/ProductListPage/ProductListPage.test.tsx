import { userEvent } from "@testing-library/user-event";
import { NextRouter, useRouter } from "next/router";

import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import {
	SearchResultsSuccess,
	SearchUrl,
	SortOrder,
} from "@nice-digital/search-client";

import sampleData from "@/mockData/search/guidance-published.json";
import { cleanup, render, screen, waitFor } from "@/test-utils/rendering";

import { GuidanceListNav } from "../ProductListNav/GuidanceListNav";

import { getProductListPage } from "./ProductListPage";

jest.mock("@/logger", () => ({
	logger: { error: jest.fn(), info: jest.fn() },
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
		title: "Published guidance, NICE advice and quality standards | Guidance",
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
		searchInputPlaceholder: "Search published guidance",
		tableBodyRender: (_docs) => (
			<tbody>
				<tr>
					<td>test</td>
				</tr>
			</tbody>
		),
	});

	let routerPush: jest.Mock;
	let mockRouter: NextRouter;
	let routeChangeCompleteCallback: () => void;

	beforeEach(() => {
		routerPush = jest.fn();

		mockRouter = {
			route: "/",
			pathname: "/guidance/published",
			query: "",
			asPath: "",
			push: routerPush,
			events: {
				on: jest.fn((event, callback) => {
					if (event === "routeChangeComplete") {
						routeChangeCompleteCallback = callback;
					}
				}),
				off: jest.fn(),
			},
			beforePopState: jest.fn(() => null),
			prefetch: jest.fn(() => null),
		} as unknown as NextRouter;

		(useRouter as jest.Mock).mockImplementation(() => mockRouter);

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
			/* eslint-disable testing-library/no-node-access */
			expect(
				document.querySelector("meta[name='description']")
			).toBeInTheDocument();
			expect(document.querySelector("meta[name='description']")).toHaveProperty(
				"content",
				"A list of all published guidance"
			);
			/* eslint-enable testing-library/no-node-access */
		});

		it("should set page title", () => {
			expect(document.title).toBe(
				"Published guidance, NICE advice and quality standards | Guidance | NICE"
			);
		});

		it("should not set noindex meta tag when there are results", () => {
			/* eslint-disable testing-library/no-node-access */
			expect(document.querySelector("meta[name='robots']")).toBeInTheDocument();
			expect(document.querySelector("meta[name='robots']")).toHaveProperty(
				"content",
				"index,follow"
			);
			/* eslint-enable testing-library/no-node-access */
		});

		it("should set noindex meta tag when no results", () => {
			/* eslint-disable testing-library/no-node-access */
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
			/* eslint-enable testing-library/no-node-access */
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
			const contentStart = screen.getByTestId("content-start");

			expect(contentStart).toHaveAttribute("id", "content-start");
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

	describe("Scroll behaviour", () => {
		const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

		beforeEach(() => {
			// Mock scrollIntoView for the test
			window.HTMLElement.prototype.scrollIntoView = jest.fn();
		});

		afterEach(() => {
			// Restore the original scrollIntoView after each test
			window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
		});

		it("should scroll to filter summary after sorting by title", async () => {
			/* eslint-disable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
			const sortByDropdown = await screen.findByRole("combobox", {
				name: "Sort by",
			});
			const filterSummary = document.getElementById("filter-summary"); // should maybe be using a testid

			expect(sortByDropdown).toBeInTheDocument();
			expect(filterSummary).toBeInTheDocument();

			userEvent.selectOptions(sortByDropdown, "Title");

			await waitFor(() => {
				expect(mockRouter.push).toHaveBeenCalledWith(
					{ query: { s: "Title" } },
					undefined,
					{ scroll: false }
				);
			});

			if (routeChangeCompleteCallback) {
				routeChangeCompleteCallback();
			}

			await waitFor(() => {
				expect(filterSummary?.scrollIntoView).toHaveBeenCalled();
				expect(filterSummary).toHaveFocus();
				expect(filterSummary).toHaveAttribute("tabIndex", "-1");
			});
			/* eslint-enable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
		});

		it("should scroll to filter summary after sorting by date", async () => {
			/* eslint-disable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
			mockRouter.query = { s: "Title" };

			const sortByDropdown = await screen.findByRole("combobox", {
				name: "Sort by",
			});
			const filterSummary = document.getElementById("filter-summary"); // should maybe be using a testid

			expect(sortByDropdown).toBeInTheDocument();
			expect(filterSummary).toBeInTheDocument();

			userEvent.selectOptions(sortByDropdown, "Date");

			await waitFor(() => {
				expect(mockRouter.push).toHaveBeenCalledWith(
					{ query: { s: "Date" } },
					undefined,
					{ scroll: false }
				);
			});

			if (routeChangeCompleteCallback) {
				routeChangeCompleteCallback();
			}

			await waitFor(() => {
				expect(filterSummary?.scrollIntoView).toHaveBeenCalled();
				expect(filterSummary).toHaveFocus();
				expect(filterSummary).toHaveAttribute("tabIndex", "-1");
			});
			/* eslint-enable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
		});

		it("should scroll to the given scroll target on pagination click", async () => {
			/* eslint-disable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
			const nextPageButton = screen.getByText("Next page");
			const filterSummary = document.getElementById("filter-summary"); // should maybe be using a testid

			expect(nextPageButton).toBeInTheDocument();
			expect(filterSummary).toBeInTheDocument();

			await userEvent.click(nextPageButton);

			if (routeChangeCompleteCallback) {
				routeChangeCompleteCallback();
			}

			await waitFor(() => {
				expect(filterSummary?.scrollIntoView).toHaveBeenCalled();
				expect(filterSummary).toHaveFocus();
				expect(filterSummary).toHaveAttribute("tabIndex", "-1");
			});
			/* eslint-enable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
		});

		it("should scroll to the given scroll target on results per page click", async () => {
			/* eslint-disable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
			const allResultsButton = screen.getByLabelText(
				"Show All results per page"
			);
			const filterSummary = document.getElementById("filter-summary"); // should maybe be using a testid

			expect(allResultsButton).toBeInTheDocument();
			expect(filterSummary).toBeInTheDocument();

			await userEvent.click(allResultsButton);

			if (routeChangeCompleteCallback) {
				routeChangeCompleteCallback();
			}

			await waitFor(() => {
				expect(filterSummary?.scrollIntoView).toHaveBeenCalled();
				expect(filterSummary).toHaveFocus();
				expect(filterSummary).toHaveAttribute("tabIndex", "-1");
			});
			/* eslint-enable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
		});
	});
});
