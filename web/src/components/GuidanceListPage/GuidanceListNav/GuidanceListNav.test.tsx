import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { GuidanceListNav } from "./GuidanceListNav";

const props = {
	ariaLabel: "Stages of guidance development",
	navItems: [
		{ path: "/guidance/published", text: "Published" },
		{ path: "/guidance/inconsultation", text: "In consultation" },
		{ path: "/guidance/indevelopment", text: "In development" },
		{
			path: "/guidance/awaiting-development",
			text: "Awaiting development",
		},
		{ path: "/guidance/topic-selection", text: "Topic selection" },
	],
};

describe("GuidanceListNav", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({}));
	});

	it("should render ARIA label on wrapping nav element", () => {
		render(<GuidanceListNav {...props} />);
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
		render(<GuidanceListNav {...props} />);
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
		render(<GuidanceListNav {...props} />);
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
		render(<GuidanceListNav {...props} />);
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
		render(<GuidanceListNav {...props} />);
		expect(screen.getByText("Published")).toHaveAttribute(
			"href",
			"/guidance/published"
		);
	});
});
