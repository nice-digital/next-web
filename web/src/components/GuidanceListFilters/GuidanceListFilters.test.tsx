import userEvent from "@testing-library/user-event";
import mockDate from "mockdate";
import { useRouter } from "next/router";

import { Navigator } from "@nice-digital/search-client/types";

import { render, screen, within } from "@/test-utils";

import sampleData from "../../__mocks__/__data__/search/guidance-published.json";

import { GuidanceListFilters } from "./GuidanceListFilters";

describe("GuidanceListFilters", () => {
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
			<GuidanceListFilters
				numActiveModifiers={2}
				navigators={sampleData.navigators as unknown as Navigator[]}
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
				<GuidanceListFilters
					numActiveModifiers={2}
					pageSize={20}
					sortOrder="Title"
					navigators={sampleData.navigators as unknown as Navigator[]}
				/>
			);

			userEvent.click(screen.getByText("Search"));

			expect(routerPush).toHaveBeenCalledWith(
				"?ps=20&s=Title&ndt=Guidance&ngt=NICE+guidelines",
				undefined,
				{
					scroll: false,
				}
			);
		});
	});

	describe("Title filter", () => {
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
			expect(screen.getByText("Search")).toBeInTheDocument();
			expect(screen.getByText("Search")).toHaveProperty("tagName", "BUTTON");
			expect(screen.getByText("Search")).toHaveAttribute("type", "submit");
		});

		it("should use NextJS router with serialized form on search button click", () => {
			const input = screen.getByLabelText("Filter by title or keyword"),
				button = screen.getByText("Search");

			userEvent.type(input, "diabetes");
			userEvent.click(button);

			expect(routerPush).toHaveBeenCalledWith(
				"?q=diabetes&ndt=Guidance&ngt=NICE+guidelines",
				undefined,
				{
					scroll: false,
				}
			);
		});
	});

	describe("Checkbox filters", () => {
		it("should not render checkboxes for guidance status navigators", () => {
			expect(screen.queryByLabelText(/Published/)).toBeNull();
		});

		it("should render filter groups in correct order", () => {
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
				"?nai=Antimicrobial+prescribing&ndt=Guidance&ngt=NICE+guidelines",
				undefined,
				{ scroll: false }
			);
		});
	});
});
