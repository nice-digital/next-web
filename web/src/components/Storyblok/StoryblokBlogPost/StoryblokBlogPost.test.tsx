import { ISbStoryData } from "@storyblok/react";
import { render, screen } from "@testing-library/react";

import { mockBlogPost } from "@/test-utils/storyblok-data";
import { AuthorStoryblok } from "@/types/storyblok";

import {
	StoryblokBlogPost,
	type StoryblokBlogPostProps,
} from "./StoryblokBlogPost";

/**  TODO: look to shape this based on mocking gssp from slug page,
 		   or mockApi when added or util mocks?
**/

const { content } = mockBlogPost;
const mockProps: StoryblokBlogPostProps = {
	blok: { ...content },
	breadcrumbs: [
		{
			title: "Home",
			path: "/",
		},
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

describe("StoryblokBlogPost", () => {
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
		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "News" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Blog post" })).toBeInTheDocument();
	});

	it("renders the author name", () => {
		const author = mockBlogPost.content
			.author[0] as ISbStoryData<AuthorStoryblok>;

		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByText(author.content.name)).toBeInTheDocument();
	});

	it("renders the author jobTitle", () => {
		const author = mockBlogPost.content
			.author[0] as ISbStoryData<AuthorStoryblok>;

		render(<StoryblokBlogPost {...mockProps} />);

		if (author.content.jobTitle) {
			expect(screen.getByText(author.content.jobTitle)).toBeInTheDocument();
		}
	});

	it("should render an action banner for newsletters and alerts", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(
			screen.getByText("Sign up for our newsletters and alerts")
		).toBeInTheDocument();
	});
});
