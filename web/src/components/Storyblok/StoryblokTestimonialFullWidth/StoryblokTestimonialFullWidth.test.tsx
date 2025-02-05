/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import {
	StoryblokTestimonialFullWidth,
	StoryblokTestimonialFullWidthProps,
} from "./StoryblokTestimonialFullWidth";

const mockStoryblokTestimonialFullWidth: StoryblokTestimonialFullWidthProps = {
	blok: {
		image: {
			id: 123456789,
			name: "Kittens mate.",
			filename: "https://placekitten.com/408/287",
			alt: "some alt text",
			fieldtype: "asset",
			title: null,
			focus: null,
		},
		quoteName: "Test Name",
		quoteRole: "Test Role",
		quoteText: "Test Quote Text",
		variant: "fullWidth",
		component: "testimonialFullWidth",
		_uid: "",
	},
};

const mockStoryblokTestimonialFullWidthWhite: StoryblokTestimonialFullWidthProps =
	{
		blok: {
			...mockStoryblokTestimonialFullWidth.blok,
			variant: "fullWidthWhite",
		},
	};

describe("Storyblok testimonial full width component", () => {
	it("should match snapshot for full width variant", () => {
		const { container } = render(
			<StoryblokTestimonialFullWidth {...mockStoryblokTestimonialFullWidth} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot for the full width white variant", () => {
		const { container } = render(
			<StoryblokTestimonialFullWidth
				{...mockStoryblokTestimonialFullWidthWhite}
			/>
		);
		expect(container).toMatchSnapshot();
	});
});
