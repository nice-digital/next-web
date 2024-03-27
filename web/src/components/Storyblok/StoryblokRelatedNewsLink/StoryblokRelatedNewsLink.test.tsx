import { render, screen } from "@testing-library/react";

import { RelatedNewsLinkStoryblok } from "@/types/storyblok";

import { StoryblokRelatedNewsLink } from "./StoryblokRelatedNewsLink";

const mockRelatedNewsLinkResponse: RelatedNewsLinkStoryblok = {
	title: "Test title",
	publisher: "Test publisher",
	date: "2021-01-01",
	link: {
		url: "https://www.google.com",
	},
	_uid: "123",
	component: "relatedNewsLink",
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

		const date = screen.getByText("1 January 2021");
		expect(date).toBeInTheDocument();
	});

	it("should render the link of the related news link", () => {
		render(<StoryblokRelatedNewsLink blok={mockRelatedNewsLinkResponse} />);

		const link = screen.getByRole("link", {
			name: mockRelatedNewsLinkResponse.title,
		});
		expect(link).toBeInTheDocument();
	});
});
