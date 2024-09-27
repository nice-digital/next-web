import { render, screen } from "@testing-library/react";

import { RelatedNewsLinkStoryblok } from "@/types/storyblok";

import { StoryblokRelatedNewsLink } from "./StoryblokRelatedNewsLink";

const mockRelatedNewsLinkResponse: RelatedNewsLinkStoryblok = {
	_uid: "42dac477-17b6-4052-9025-16a24dc1a438",
	date: "2024-05-09 12:00",
	link: {
		id: "",
		url: "https://www.standard.co.uk/news/health/mark-chapman-nhs-wales-swansea-university-b1156651.html",
		linktype: "url",
		fieldtype: "multilink",
		cached_url:
			"https://www.standard.co.uk/news/health/mark-chapman-nhs-wales-swansea-university-b1156651.html",
	},
	title:
		"Health watchdog backs wider use of breast cancer tumour profiling tests",
	component: "relatedNewsLink",
	publisher: "The Standard",
};

describe("StoryblokRelatedNewsLink Component", () => {
	it("should render the title of the related news link", () => {
		render(<StoryblokRelatedNewsLink blok={mockRelatedNewsLinkResponse} />);

		const title = screen.getByText(mockRelatedNewsLinkResponse.title);
		expect(title).toBeInTheDocument();
	});

	it("should render the publisher of the related news link", () => {
		render(<StoryblokRelatedNewsLink blok={mockRelatedNewsLinkResponse} />);

		const publisher = screen.getByText(mockRelatedNewsLinkResponse.publisher);
		expect(publisher).toBeInTheDocument();
	});

	it("should render the date of the related news link", () => {
		render(<StoryblokRelatedNewsLink blok={mockRelatedNewsLinkResponse} />);

		const date = screen.getByText("9 May 2024");
		expect(date).toBeInTheDocument();
	});

	it("should render the link of the related news link", () => {
		render(<StoryblokRelatedNewsLink blok={mockRelatedNewsLinkResponse} />);

		const link = screen.getByRole("link", {
			name: mockRelatedNewsLinkResponse.title,
		});
		expect(link).toBeInTheDocument();
	});

	it("should handle internal links to news articles", () => {
		const pathWithoutLeadingSlash = "news/articles/mark-chapman";
		const mockInternalNewsLinkResponse: RelatedNewsLinkStoryblok = {
			...mockRelatedNewsLinkResponse,
			link: {
				...mockRelatedNewsLinkResponse.link,
				url: "",
				linktype: "story",
				cached_url: pathWithoutLeadingSlash,
				story: {
					name: "Mark Chapman",
					id: 907,
					uuid: "730222",
					slug: "mark-chapman",
					url: pathWithoutLeadingSlash,
					full_slug: pathWithoutLeadingSlash,
					_stopResolving: true,
				},
			},
		};

		render(<StoryblokRelatedNewsLink blok={mockInternalNewsLinkResponse} />);

		const link = screen.getByRole("link", {
			name: mockInternalNewsLinkResponse.title,
		});
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", `/${pathWithoutLeadingSlash}`);
	});
});
