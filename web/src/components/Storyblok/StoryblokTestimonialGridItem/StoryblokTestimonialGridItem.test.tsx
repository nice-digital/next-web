/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import {
	StoryblokTestimonialGridItem,
	StoryblokTestimonialGridItemProps,
} from "./StoryblokTestimonialGridItem";

const mockStoryBlokTestimonialGridItem: StoryblokTestimonialGridItemProps = {
	blok: {
		image: {
			id: 123456789,
			name: "Kittens mate.",
			filename: "https://placekitten.com/408/287",
			alt: null,
			fieldtype: "asset",
			title: null,
			focus: null,
		},
		quoteName: "Test Name",
		quoteRole: "Test Role",
		quoteText: "Test Quote Text",
		variant: "transparent",
		_uid: "",
		component: "testimonialGridItem",
	},
};

const mockStoryBlokTestimonialGridItemTransparent: StoryblokTestimonialGridItemProps =
	{
		blok: {
			...mockStoryBlokTestimonialGridItem.blok,
			variant: "transparent",
		},
	};

describe("Storyblok testimonial Default component", () => {
	it("should match snapshot for default variant", () => {
		const { container } = render(
			<StoryblokTestimonialGridItem {...mockStoryBlokTestimonialGridItem} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot for the default transparent variant", () => {
		const { container } = render(
			<StoryblokTestimonialGridItem
				{...mockStoryBlokTestimonialGridItemTransparent}
			/>
		);
		expect(container).toMatchSnapshot();
	});
});
