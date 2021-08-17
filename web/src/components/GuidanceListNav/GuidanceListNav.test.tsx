import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { GuidanceListNav } from "./GuidanceListNav";

describe("GuidanceListNav", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({}));
	});

	it("should render ARIA label on wrapping nav element", () => {
		render(<GuidanceListNav />);
		expect(screen.getByRole("navigation")).toHaveAccessibleName(
			"Stages of guidance development"
		);
	});

	it.each([
		["Published"],
		["In consultation"],
		["In development"],
		["Proposed"],
	])("should render link for %s", (linkText) => {
		render(<GuidanceListNav />);
		const link = screen.getByText(linkText);
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("aria-current", "false");
	});

	it.each([
		["Published", "/guidance/published"],
		["In consultation", "/guidance/inconsultation"],
		["In development", "/guidance/indevelopment"],
		["Proposed", "/guidance/proposed"],
	])("should highlight %s when current path is %s", (linkText, pathname) => {
		(useRouter as jest.Mock).mockImplementation(() => ({ pathname }));
		render(<GuidanceListNav />);
		expect(screen.getByText(linkText)).toHaveAttribute("aria-current", "true");
	});
});
