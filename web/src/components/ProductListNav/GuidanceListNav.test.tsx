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
		["Awaiting development"],
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
		["Awaiting development", "/guidance/awaiting-development"],
	])("should highlight %s when current path is %s", (linkText, pathname) => {
		(useRouter as jest.Mock).mockImplementation(() => ({ pathname }));
		render(<GuidanceListNav />);
		expect(screen.getByText(linkText)).toHaveAttribute("aria-current", "true");
	});

	it("should keep querystring from current page without from, to and pa", () => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			query: {
				ndt: "Guidance",
				nai: "Antimicrobial prescribing",
				from: "2019-01-01",
				to: "2019-03-31",
				pa: "2",
			},
		}));
		render(<GuidanceListNav />);
		expect(screen.getByText("Awaiting development")).toHaveAttribute(
			"href",
			"/guidance/awaiting-development?ndt=Guidance&nai=Antimicrobial%20prescribing"
		);
	});

	it("should remove querystring for current tab link", () => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			pathname: "/guidance/published",
			query: {
				ndt: "Guidance",
			},
		}));
		render(<GuidanceListNav />);
		expect(screen.getByText("Published")).toHaveAttribute(
			"href",
			"/guidance/published"
		);
	});
});
