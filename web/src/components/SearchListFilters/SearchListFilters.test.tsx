import userEvent from "@testing-library/user-event";
import mockDate from "mockdate";
import { useRouter } from "next/router";

import { Navigator } from "@nice-digital/search-client/types";

import { render, screen, within } from "@/test-utils";

import sampleData from "../../__mocks__/__data__/search/guidance-published.json";

import { SearchListFilters } from "./SearchListFilters";

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

		rerender = render(
			<SearchListFilters
				numActiveModifiers={2}
				navigators={sampleData.navigators as unknown as Navigator[]}
				showDateFilter={true}
				showTextFilter={true}
				dateFilterLabel="Last updated date"
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
		it("should serialize given page size and sort order in form submission", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					pageSize={20}
					sortOrder="Title"
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={true}
				/>
			);

			userEvent.click(screen.getByRole("button", { name: "Filter" }));

			expect(routerPush).toHaveBeenCalledWith(
				"?ps=20&s=Title&gst=Published&ndt=Guidance&ngt=NICE+guidelines",
				undefined,
				{
					scroll: false,
				}
			);
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
				/>
			);

			expect(
				screen.queryByRole("button", {
					name: /apply date filters/i,
				})
			).not.toBeNull();

			expect(screen.queryByLabelText(/from date/i)).toBeInTheDocument();
			expect(screen.queryByLabelText(/to date/i)).toBeInTheDocument();
		});

		it("should NOT show date filter when show date filter prop is false", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={false}
					queryText="diabetes"
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
		it("should add query parameter when query text is supplied", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={false}
					queryText="diabetes"
				/>
			);
			const input = screen.getByLabelText("Antimicrobial prescribing (21)");

			userEvent.click(input);

			expect(routerPush).toHaveBeenCalledWith(
				"?q=diabetes&gst=Published&nai=Antimicrobial+prescribing&ndt=Guidance&ngt=NICE+guidelines",
				undefined,
				{ scroll: false }
			);
		});

		it("should NOT render title filter input box and label when show text filter is false", () => {
			rerender(
				<SearchListFilters
					numActiveModifiers={2}
					navigators={sampleData.navigators as unknown as Navigator[]}
					showDateFilter={false}
					showTextFilter={false}
					queryText="diabetes"
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
				screen.queryByRole("button", {
					name: /filter/i,
				})
			).not.toBeNull();
		});

		it("should render title filter input box and label", () => {
			expect(
				screen.getByLabelText("Filter by title or keyword")
			).toBeInTheDocument();
		});

		it("should render placeholder attribute on title filter input", () => {
			expect(
				screen.getByLabelText("Filter by title or keyword")
			).toHaveAttribute("placeholder", "E.g. 'diabetes' or 'NG28'");
		});

		it("should render search submit button", () => {
			expect(screen.getByText("Filter")).toBeInTheDocument();
			expect(screen.getByText("Filter")).toHaveProperty("tagName", "BUTTON");
			expect(screen.getByText("Filter")).toHaveAttribute("type", "submit");
		});

		it("should use NextJS router with serialized form on search button click", () => {
			const input = screen.getByLabelText("Filter by title or keyword"),
				button = screen.getByRole("button", { name: "Filter" });

			userEvent.type(input, "diabetes");
			userEvent.click(button);

			expect(routerPush).toHaveBeenCalledWith(
				"?q=diabetes&gst=Published&ndt=Guidance&ngt=NICE+guidelines",
				undefined,
				{
					scroll: false,
				}
			);
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
				/>
			);

			expect(screen.queryByLabelText(/Published/)).toBeNull();
		});

		it.skip("should render filter groups in correct order", () => {
			const filterGroupHeadings = within(screen.getByRole("form"))
				.getAllByRole("heading", { level: 3 })
				.map((el) => el.textContent || "");
			expect(filterGroupHeadings).toStrictEqual([
				"Last updated date ",
				"Area of interest ",
				"Type (1 selected)",
				"Guidance programme (1 selected)",
			]);
		});

		it("should use NextJS router with serialized form on search checkbox tick", () => {
			const input = screen.getByLabelText("Antimicrobial prescribing (21)");

			userEvent.click(input);

			expect(routerPush).toHaveBeenCalledWith(
				"?gst=Published&nai=Antimicrobial+prescribing&ndt=Guidance&ngt=NICE+guidelines",
				undefined,
				{ scroll: false }
			);
		});
	});
});
