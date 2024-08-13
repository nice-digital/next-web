/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import {
	StoryblokAccordionGroup,
	type StoryblokAccordionGroupProps,
} from "./StoryblokAccordionGroup";

const mockAccordionGroup: StoryblokAccordionGroupProps = {
	blok: {
		_uid: "i-4bb-4bb-4bb",
		component: "accordionGroup",
		accordions: [
			{
				_uid: "bddd-bddd-bddd",
				title: "Accordion group accordion 1 with heading",
				content: {
					type: "doc",
					content: [
						{
							type: "paragraph",
							content: [
								{
									text: "Test accordion group. Accordion 1",
									type: "text",
								},
							],
						},
					],
				},
				component: "accordion",
				headingLevel: 2,
				displayTitleAsHeading: true,
			},
			{
				_uid: "aff-aff-aff",
				title: "Accordion group accordion 2 with heading",
				content: {
					type: "doc",
					content: [
						{
							type: "paragraph",
							content: [
								{
									text: "est accordion group. Accordion 2",
									type: "text",
								},
							],
						},
					],
				},
				component: "accordion",
				headingLevel: 2,
				displayTitleAsHeading: true,
			},
			{
				_uid: "5bb-5bb-5bb",
				title: "Accordion group accordion no heading",
				content: {
					type: "doc",
					content: [
						{
							type: "paragraph",
							content: [
								{
									text: "est accordion group. Accordion 3",
									type: "text",
								},
							],
						},
					],
				},
				component: "accordion",
				headingLevel: undefined,
				displayTitleAsHeading: false,
			},
		],
	},
};

describe("Storyblok accordion group component", () => {
	it("should match snapshot", () => {
		const { container } = render(
			<StoryblokAccordionGroup {...mockAccordionGroup} />
		);
		expect(container).toMatchSnapshot();
	});
});
