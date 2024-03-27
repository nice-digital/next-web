// FILEPATH: /c:/Users/DHudson/Development/next-web/web/src/components/Storyblok/StoryblokBlogPost/StoryblokBlogPost.test.tsx

import { render, screen } from "@testing-library/react";
import { StoryblokStory } from "storyblok-generate-ts";

import { mockBlogPost } from "@/test-utils/storyblok-data";
import { AuthorStoryblok } from "@/types/storyblok";

import {
	StoryblokBlogPost,
	type StoryblokBlogPostProps,
} from "./StoryblokBlogPost";

describe("StoryblokBlogPost", () => {
	const { content } = mockBlogPost;
	const mockProps: StoryblokBlogPostProps = {
		blok: { ...content },
		breadcrumbs: [
			{
				title: "News",
				path: "/news",
			},
			{
				title: "Blog post",
				path: "/news/blogs",
			},
		],
	};

	it("renders the title", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByText(mockProps.blok.title)).toBeInTheDocument();
	});

	it("renders the intro text", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByText(mockProps.blok.introText)).toBeInTheDocument();
	});

	it("renders the image", () => {
		render(<StoryblokBlogPost {...mockProps} />);

		expect(screen.getByAltText("A kitty cat")).toBeInTheDocument();
	});

	it("renders the content", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(
			screen.getByText("A mock h2 heading in a rich text field")
		).toBeInTheDocument();
	});

	// Add more tests as needed for other parts of the component
	it("renders the breadcrumbs", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByRole("link", { name: "News" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Blog post" })).toBeInTheDocument();
	});

	//TODO: mob help: mock the author component?
	it("renders the author name", () => {
		const author = mockBlogPost.content
			.author[0] as StoryblokStory<AuthorStoryblok>;

		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByText(author.content.name)).toBeInTheDocument();
	});

	it("renders the author jobTitle", () => {
		const author = mockBlogPost.content
			.author[0] as StoryblokStory<AuthorStoryblok>;

		render(<StoryblokBlogPost {...mockProps} />);

		if (author.content.jobTitle) {
			expect(screen.getByText(author.content.jobTitle)).toBeInTheDocument();
		}
	});
});
