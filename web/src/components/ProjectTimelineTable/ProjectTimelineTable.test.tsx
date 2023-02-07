import { render, screen, within } from "@testing-library/react";

import { IndevTimeline } from "@/feeds/inDev/types";

import { Timeline } from "./ProjectTimelineTable";

const props = {
	data: [
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "13 September 2022",
			column2: "Stakeholder list updated",
			additionalInfoLabel: null,
			additionalInfo: null,
			hidden: false,
		},
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "07 July 2022",
			column2: "Committee list updated",
			additionalInfoLabel: null,
			additionalInfo: null,
			hidden: false,
		},
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "25 May 2022",
			column2: "Committee meeting",
			additionalInfoLabel: "Meeting number",
			additionalInfo: null,
			hidden: false,
		},
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "14 April 2022",
			column2: "Scope published",
			additionalInfoLabel: null,
			additionalInfo: null,
			hidden: false,
		},
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "01 February 2022 - 01 March 2022",
			column2: "Draft scope consultation",
			additionalInfoLabel: null,
			additionalInfo: null,
			hidden: false,
		},
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "01 February 2022 - 01 March 2022",
			column2: "Committee member recruitment",
			additionalInfoLabel: null,
			additionalInfo: null,
			hidden: false,
		},
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "01 February 2022",
			column2:
				"Guideline title changed from Hypoadrenalism: acute and long-term management to Adrenal insufficiency: acute and long-term management.",
			additionalInfoLabel: null,
			additionalInfo: null,
			hidden: false,
		},
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "05 January 2022",
			column2: "Scoping workshop",
			additionalInfoLabel: "Location of meeting",
			additionalInfo: null,
			hidden: false,
		},
		{
			links: {
				self: [{}],
			},
			eTag: null,
			column1: "18 October 2021 - 25 October 2021",
			column2: "Topic expert committee member recruitment",
			additionalInfoLabel: null,
			additionalInfo: null,
			hidden: false,
		},
	] as unknown as IndevTimeline[],
};

describe("TimelineTable", () => {
	it("should render timeline heading and strapline", () => {
		render(<Timeline {...props} />);
		expect(
			screen.getByRole("heading", { level: 3, name: "Timeline" })
		).toBeInTheDocument();

		expect(
			screen.getByText("Key events during the development of the guidance:")
		).toBeInTheDocument();
	});

	it("should render timeline data", () => {
		render(<Timeline {...props} />);

		const timelineTable = screen.getByLabelText("Timeline");
		expect(timelineTable).toBeInTheDocument();
		const { getByText } = within(timelineTable);
		expect(getByText("Date").tagName).toBe("TH");
		expect(getByText("Draft scope consultation").tagName).toBe("TD");
	});
});
