/* eslint-disable testing-library/no-node-access */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
	StoryblokAccordion,
	type StoryblokAccordionProps,
} from "./StoryblokAccordion";

const mockAccordion: StoryblokAccordionProps = {
	blok: {
		title: "Mock accordion title",
		content: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							text: "accordion content 1",
							type: "text",
						},
					],
				},
			],
		},
		headingLevel: undefined,
		displayTitleAsHeading: false,
		_uid: "123123123",
		component: "accordion",
	},
};

describe("Storyblok accordion component", () => {
	it("should match snapshot", () => {
		const { container } = render(<StoryblokAccordion {...mockAccordion} />);
		expect(container).toMatchSnapshot();
	});

	it("should render the title of the accordion", () => {
		render(<StoryblokAccordion {...mockAccordion} />);
		expect(screen.getByText("Mock accordion title")).toBeInTheDocument();
	});

	it("should toggle the accordion content visible when the trigger is clicked", async () => {
		const user = userEvent.setup();
		render(<StoryblokAccordion {...mockAccordion} />);
		const trigger = screen.getByText("Mock accordion title");
		const content = screen.getByText("accordion content 1");

		expect(content).not.toBeVisible();

		user.click(trigger);

		await waitFor(() => {
			expect(content).toBeVisible();
		});
	});

	it("should render a heading element if headingLevel is passed", () => {
		const accordionWithHeadingLevel: StoryblokAccordionProps = {
			...mockAccordion,
			blok: {
				...mockAccordion.blok,
				displayTitleAsHeading: true,
				headingLevel: 2,
			},
		};

		render(<StoryblokAccordion {...accordionWithHeadingLevel} />);
		expect(screen.getByRole("heading")).toBeInTheDocument();
		expect(screen.getByRole("heading").tagName).toBe("H2");
	});
});
