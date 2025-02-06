/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";

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
const mockStoryBlokFullWidthWithLink: StoryblokTestimonialFullWidthProps = {
	blok: {
		...mockStoryblokTestimonialFullWidth.blok,
		link: [
			{
				_uid: "dd0669ab-b979-4eee-bb14-31b31273bd1c",
				link: {
					id: "600c4173-54de-4d42-b7cb-92feb3c92228",
					url: "",
					linktype: "story",
					fieldtype: "multilink",
					cached_url: "test-nick",
					story: {
						name: "Test Nick",
						id: 578471746,
						uuid: "600c4173-54de-4d42-b7cb-92feb3c92228",
						slug: "test-nick",
						url: "test-nick",
						full_slug: "test-nick",
						_stopResolving: true,
					},
				},
				title: "This is a link",
				component: "relatedLink",
				_editable:
					'<!--#storyblok#{"name": "relatedLink", "space": "292509", "uid": "dd0669ab-b979-4eee-bb14-31b31273bd1c", "id": "613928850"}-->',
			},
		],
	},
};
describe("Storyblok testimonial full width component", () => {
	it("should match snapshot for full width variant", () => {
		const { container } = render(
			<StoryblokTestimonialFullWidth {...mockStoryblokTestimonialFullWidth} />
		);
		expect(container).toMatchSnapshot();
	});
	it("should match snapshot for full width variant with Link", () => {
		const { container } = render(
			<StoryblokTestimonialFullWidth {...mockStoryBlokFullWidthWithLink} />
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
	it("should render the related link from an internal source", () => {
		render(
			<StoryblokTestimonialFullWidth {...mockStoryBlokFullWidthWithLink} />
		);
		const linkData = mockStoryBlokFullWidthWithLink.blok.link?.[0];
		if (linkData) {
			const link = screen.getByRole("link", {
				name: linkData.title,
			});
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("href", `/${linkData.link.story.url}`);
			expect(link).toHaveTextContent(linkData.title);
		} else {
			const link = screen.queryByRole("link");
			expect(link).not.toBeInTheDocument();
		}
	});
});
