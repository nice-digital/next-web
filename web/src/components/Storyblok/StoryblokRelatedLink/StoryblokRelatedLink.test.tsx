import { render, screen } from "@testing-library/react";

import { RelatedLinkStoryblok } from "@/types/storyblok";

import { StoryblokRelatedLink } from "./StoryblokRelatedLink";

const mockResourceLinkExternalLinkType: RelatedLinkStoryblok = {
	_uid: "0were02",
	link: {
		id: "",
		url: "https://nice.org.uk/guidance/ta10",
		linktype: "url",
		fieldtype: "multilink",
		cached_url: "https://nice.org.uk/guidance/ta10",
	},
	title: "test link to guidance",
	component: "relatedLink",
};

const mockResourceLinkStoryLinkType: RelatedLinkStoryblok = {
	_uid: "86046",
	link: {
		id: "73000",
		url: "",
		linktype: "story",
		fieldtype: "multilink",
		cached_url: "about-us/our-charter",
		story: {
			name: "Our charter",
			id: 907,
			uuid: "730222",
			slug: "our-charter",
			url: "about-us/our-charter",
			full_slug: "about-us/our-charter",
			_stopResolving: true,
		},
	},
	title: "internal link info page",
	component: "relatedLink",
};

describe("StoryblokRelatedLink Component", () => {
	// that the link renders with the correct title and href
	it("should render the related link from an external source ", () => {
		render(<StoryblokRelatedLink blok={mockResourceLinkExternalLinkType} />);

		const link = screen.getByRole("link", {
			name: mockResourceLinkExternalLinkType.title,
		});
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute(
			"href",
			mockResourceLinkExternalLinkType.link.url
		);
		expect(link).toHaveTextContent(mockResourceLinkExternalLinkType.title);
	});

	// it shows a leading / if the link is internal
	it("should render the related link from an internal source", () => {
		render(<StoryblokRelatedLink blok={mockResourceLinkStoryLinkType} />);

		const link = screen.getByRole("link", {
			name: mockResourceLinkStoryLinkType.title,
		});
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute(
			"href",
			`/${mockResourceLinkStoryLinkType.link.story.url}`
		);
		expect(link).toHaveTextContent(mockResourceLinkStoryLinkType.title);
	});

	it("should fall back to a cached url if the link is internal and the story url is not present", () => {
		const mockInternalLinkWithoutStoryUrl = {
			...mockResourceLinkStoryLinkType,
			link: {
				...mockResourceLinkStoryLinkType.link,
				story: undefined,
			},
		};

		render(<StoryblokRelatedLink blok={mockInternalLinkWithoutStoryUrl} />);
		const link = screen.getByRole("link", {
			name: mockInternalLinkWithoutStoryUrl.title,
		});
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute(
			"href",
			`/${mockInternalLinkWithoutStoryUrl.link.cached_url}`
		);
	});

	// that the link does not render if the link href is not present from resolveStoryblokLink
	it("should not render if the link url property is not present", () => {
		const mockLinkWithoutUrl = {
			...mockResourceLinkExternalLinkType,
			link: {
				...mockResourceLinkExternalLinkType.link,
				url: "",
				cached_url: "",
			},
		};

		render(<StoryblokRelatedLink blok={mockLinkWithoutUrl} />);
		const link = screen.queryByRole("link", {
			name: mockLinkWithoutUrl.title,
		});
		expect(link).not.toBeInTheDocument();
	});
});
