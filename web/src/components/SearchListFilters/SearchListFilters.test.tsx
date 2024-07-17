import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockDate from "mockdate";
import { useRouter } from "next/router";

import {
	KnownOrModifierKeys,
	Navigator,
} from "@nice-digital/search-client/types";

import sampleData from "@/mockData/search/guidance-published.json";
import { render, screen, within } from "@/test-utils/rendering";

import { SearchListFilters } from "./SearchListFilters";

const guidanceNavigatorsOrder: KnownOrModifierKeys[] = [
	"nai",
	"tt",
	"tsd",
	"ndt",
	"ngt",
	"nat",
];

describe("SearchListFilters", () => {
	let routerPush: jest.Mock, rerender: ReturnType<typeof render>["rerender"];
	beforeEach(() => {
		routerPush = jest.fn();

		(useRouter as jest.Mock).mockImplementation(() => ({
			route: "/",
			pathname: "",
			query: "",
			asPath: "",
			push: routerPush,
		}));

		mockDate.set("2020-11-22");

		// eslint-disable-next-line testing-library/no-render-in-setup
		rerender = render(
			<SearchListFilters
				numActiveModifiers={2}
				navigators={sampleData.navigators as unknown as Navigator[]}
				showDateFilter={true}
				showTextFilter={true}
				dateFilterLabel="Last updated date"
				navigatorsOrder={guidanceNavigatorsOrder}
			/>
		).rerender;
	});

	afterEach(() => {
		mockDate.reset();
	});

	it("should match snapshot for filter panel form", () => {
		expect(screen.getByRole("form")).toMatchSnapshot();
	});

	describe("Hidden fields", () => {
		it("should serialize given page size and sort order in form submission", async () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					pageSize={20}
					sortOrder="Title"
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={true}
					navigatorsOrder={guidanceNavigatorsOrder}
				/>
			);

			userEvent.click(screen.getByRole("button", { name: "Apply Filter" }));

			await waitFor(() => {
				expect(routerPush).toHaveBeenCalledWith(
					"?ps=20&s=Title&gst=Published&ndt=Guidance&ngt=NICE+guidelines",
					undefined,
					{
						scroll: false,
					}
				);
			});
		});
	});

	describe("Date filter", () => {
		it("should show date filter when show date filter prop is true", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={true}
					showTextFilter={false}
					queryText="diabetes"
					navigatorsOrder={guidanceNavigatorsOrder}
				/>
			);

			expect(
				screen.getByRole("button", {
					name: /apply date filters/i,
				})
			).not.toBeNull();

			expect(screen.getByLabelText(/from date/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/to date/i)).toBeInTheDocument();
		});

		it("should NOT show date filter when show date filter prop is false", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={false}
					queryText="diabetes"
					navigatorsOrder={guidanceNavigatorsOrder}
				/>
			);

			expect(
				screen.queryByRole("button", {
					name: /apply date filters/i,
				})
			).toBeNull();

			expect(screen.queryByLabelText(/from date/i)).not.toBeInTheDocument();
			expect(screen.queryByLabelText(/to date/i)).not.toBeInTheDocument();
		});
	});

	describe("Title filter", () => {
		it("should add query parameter when query text is supplied", async () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={false}
					queryText="diabetes"
					navigatorsOrder={guidanceNavigatorsOrder}
				/>
			);
			const input = screen.getByLabelText("Antimicrobial prescribing (21)");

			userEvent.click(input);

			await waitFor(() => {
				expect(routerPush).toHaveBeenCalledWith(
					"?q=diabetes&gst=Published&nai=Antimicrobial+prescribing&ndt=Guidance&ngt=NICE+guidelines",
					undefined,
					{ scroll: false }
				);
			});
		});

		it("should NOT render title filter input box and label when show text filter is false", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={false}
					queryText="diabetes"
					navigatorsOrder={guidanceNavigatorsOrder}
				/>
			);

			expect(
				screen.queryByText(/filter by title or keyword/i)
			).not.toBeInTheDocument();

			expect(
				screen.queryByRole("textbox", {
					name: /filter by title or keyword/i,
				})
			).toBeNull();

			expect(
				screen.getByRole("button", {
					name: /filter/i,
				})
			).not.toBeNull();
		});

		it("should render title filter input box and label", () => {
			expect(
				screen.getByLabelText("Filter by word or reference number")
			).toBeInTheDocument();
		});

		it("should render default placeholder attribute on title filter input when searchInputPlaceholder prop not supplied", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={true}
					queryText="diabetes"
					navigatorsOrder={guidanceNavigatorsOrder}
				/>
			);
			expect(
				screen.getByLabelText("Filter by word or reference number")
			).toHaveAttribute("placeholder", "E.g. 'diabetes' or 'NG28'");
		});

		it("should render custom placeholder attribute on title filter input when searchInputPlaceholder prop supplied", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={true}
					queryText="diabetes"
					navigatorsOrder={guidanceNavigatorsOrder}
					searchInputPlaceholder="Some placeholder text"
				/>
			);
			expect(
				screen.getByLabelText("Filter by word or reference number")
			).toHaveAttribute("placeholder", "Some placeholder text");
		});

		it("should render search submit button", () => {
			expect(screen.getByText("Apply Filter")).toBeInTheDocument();
			expect(screen.getByText("Apply Filter")).toHaveProperty(
				"tagName",
				"BUTTON"
			);
			expect(screen.getByText("Apply Filter")).toHaveAttribute(
				"type",
				"submit"
			);
		});

		it("should use NextJS router with serialized form on search button click", async () => {
			const input = screen.getByRole("textbox", {
					name: "Filter by word or reference number",
				}),
				button = screen.getByRole("button", { name: "Apply Filter" });

			await userEvent.type(input, "diabetes");
			await userEvent.click(button);

			await waitFor(() => {
				expect(routerPush).toHaveBeenCalledWith(
					"?q=diabetes&gst=Published&ndt=Guidance&ngt=NICE+guidelines",
					undefined,
					{
						scroll: false,
					}
				);
			});
		});
	});

	describe("Checkbox filters", () => {
		it("should not render checkboxes for guidance status navigators", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={false}
					navigatorShortNamesToExclude="gst"
					navigatorsOrder={guidanceNavigatorsOrder}
				/>
			);

			expect(screen.queryByLabelText(/Published/)).toBeNull();
		});

		it("should push an event to the data layer when checkbox checked", async () => {
			window.dataLayer = [];
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={false}
					navigatorShortNamesToExclude="gst"
					navigatorsOrder={guidanceNavigatorsOrder}
				/>
			);

			const checkbox = screen.getByRole("checkbox", {
				name: "Antimicrobial prescribing (21)",
			});

			userEvent.click(checkbox);

			await waitFor(() => {
				expect(checkbox).toBeChecked();
			});

			expect(window.dataLayer[0]).toStrictEqual({
				event: "search.filter-select",
				filter: "Antimicrobial prescribing",
				action: "selected",
			});
		});

		it("should render filter groups in correct order", () => {
			const filterGroupHeadings = within(screen.getByRole("form"))
				.getAllByRole("heading", { level: 3 })
				.map((el) => el.textContent || "");
			expect(filterGroupHeadings).toStrictEqual([
				"Last updated date ",
				"Status (1 selected)",
				"Area of interest ",
				"Type (1 selected)",
				"Guidance programme (1 selected)",
			]);
		});

		it("should use NextJS router with serialized form on search checkbox tick", async () => {
			const input = screen.getByLabelText("Antimicrobial prescribing (21)");

			userEvent.click(input);

			await waitFor(() => {
				expect(routerPush).toHaveBeenCalledWith(
					"?gst=Published&nai=Antimicrobial+prescribing&ndt=Guidance&ngt=NICE+guidelines",
					undefined,
					{ scroll: false }
				);
			});
		});
	});
});
