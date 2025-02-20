import { render, screen } from "@testing-library/react";

import { CalloutCardWithImageStoryblok } from "@/types/storyblok";

import {
	StoryblokCalloutCard,
	StoryblokCalloutCardProps,
} from "./StoryblokCalloutCard";

const cardLinkUrl = "https://nice.org.uk/guidance/ta10";

const mockCalloutCardProps: StoryblokCalloutCardProps = {
	blok: {
		heading: "Mock card title",
		body: "Mock card summary",
		link: {
			id: "",
			url: cardLinkUrl,
			linktype: "url",
			fieldtype: "multilink",
			cached_url: cardLinkUrl,
		},
		component: "calloutCard",
		_uid: "123456877",
	},
};

describe("Callout card component", () => {
	it("should match snapshot with default values", () => {
		const { container } = render(
			<StoryblokCalloutCard {...mockCalloutCardProps} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot when image prop is passed", () => {
		const mockCalloutCardWithImageProps = {
			blok: {
				...mockCalloutCardProps.blok,
				image: {
					id: 18214711,
					alt: "",
					name: "",
					focus: "",
					title: "",
					source: "",
					filename: "test.JPG",
					copyright: "",
					fieldtype: "asset",
					meta_data: {},
					is_external_url: false,
				},
				component: "calloutCardWithImage",
			} as unknown as CalloutCardWithImageStoryblok,
		};
		const { container } = render(
			<StoryblokCalloutCard {...mockCalloutCardWithImageProps} />
		);
		expect(container).toMatchSnapshot();
	});
	it("should render a heading, body text and link for callout  card component with external link", () => {
		render(<StoryblokCalloutCard {...mockCalloutCardProps} />);
		const cardHeading = screen.getByText("Mock card title", {
			selector: "a",
		});
		const cardBody = screen.getByText("Mock card summary");
		expect(cardHeading).toBeInTheDocument();
		expect(cardHeading).toHaveAttribute("href", cardLinkUrl);
		expect(cardBody).toBeInTheDocument();
	});

	it("should render a heading, body text and link for callout card component with internal link", () => {
		const internalLink = {
			id: "600c4173-54de-4d42-b7cb-92feb3c92228",
			url: "",
			linktype: "url",
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
		};

		const mockCardListSectionPropsInternalLink = {
			blok: {
				...mockCalloutCardProps.blok,
				link: internalLink,
			},
		};
		render(
			<StoryblokCalloutCard
				{...(mockCardListSectionPropsInternalLink as StoryblokCalloutCardProps)}
			/>
		);
		const cardHeading = screen.getByText("Mock card title", {
			selector: "a",
		});
		const cardBody = screen.getByText("Mock card summary");
		expect(cardHeading).toBeInTheDocument();
		expect(cardHeading).toHaveAttribute("href", "test-nick");
		expect(cardBody).toBeInTheDocument();
	});
});
