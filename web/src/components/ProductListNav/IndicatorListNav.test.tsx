import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { IndicatorListNav } from "./IndicatorListNav";

describe("IndicatorListNav", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({}));
	});

	it("should render ARIA label on wrapping nav element", () => {
		render(<IndicatorListNav />);
		expect(screen.getByRole("navigation")).toHaveAccessibleName(
			"Stages of indicator development"
		);
	});

	it.each([["Published"], ["In consultation"], ["In development"]])(
		"should render link for %s",
		(linkText) => {
			render(<IndicatorListNav />);
			const link = screen.getByText(linkText);
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("aria-current", "false");
		}
	);

	it.each([
		["Published", "/indicators/published"],
		["In consultation", "/indicators/inconsultation"],
		["In development", "/indicators/indevelopment"],
	])("should highlight %s when current path is %s", (linkText, pathname) => {
		(useRouter as jest.Mock).mockImplementation(() => ({ pathname }));
		render(<IndicatorListNav />);
		expect(screen.getByText(linkText)).toHaveAttribute("aria-current", "true");
	});

	it("should keep querystring from current page without from, to and pa", () => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			query: {
				ndt: "Indicator",
				nai: "National library of quality indicators",
				from: "2019-01-01",
				to: "2019-03-31",
				pa: "2",
			},
		}));
		render(<IndicatorListNav />);
		expect(screen.getByText("In development")).toHaveAttribute(
			"href",
			"/indicators/indevelopment?ndt=Indicator&nai=National%20library%20of%20quality%20indicators"
		);
	});

	it("should remove querystring for current tab link", () => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			pathname: "/indicators/published",
			query: {
				ndt: "Indicator",
			},
		}));
		render(<IndicatorListNav />);
		expect(screen.getByText("Published")).toHaveAttribute(
			"href",
			"/indicators/published"
		);
	});
});
