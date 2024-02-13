import { render, screen } from "@testing-library/react";

import { AuthorStoryblok } from "@/types/storyblok";

import { StoryblokAuthor } from "./StoryblokAuthor";

const blokContent: AuthorStoryblok = {
	name: "name",
	_uid: "id",
	component: "author",
	image: {
		id: 1,
		name: "test image",
		filename: "test.jpg",
		alt: "test",
	},
	jobTitle: "test job title",
};

describe("StoryblokAuthor", () => {
	it("should render the author component", () => {
		render(<StoryblokAuthor blok={blokContent} />);
		expect(screen.getByText("test name")).toBeInTheDocument();
		expect(screen.getByText("test job title")).toBeInTheDocument();
	});
});
