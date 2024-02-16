// FILEPATH: /c:/Users/DHudson/Development/next-web/web/src/components/Storyblok/StoryblokBlogPost/StoryblokBlogPost.test.tsx

import { render, screen } from "@testing-library/react";

import { StoryblokBlogPost, StoryblokBlogPostProps } from "./StoryblokBlogPost";

describe("StoryblokBlogPost", () => {
	const mockProps: StoryblokBlogPostProps = {
		blok: {
			title: "Test post title",
			introText: "Post summary",
			date: "2024-01-31",
			author: [
				{
					component: "author",
					name: "Author Name",
					role: "Author Role",
					uid: "123",
				},
			],
			content: {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{
								text: "This is a mock blog post paragraph",
								type: "text",
							},
						],
					},
				],
			},
			image: {
				id: 123,
				name: "Image",
				filename: "image.jpg",
				alt: "Image alt text",
			},
			_uid: "123",

			component: "blogPost",
		},
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
		expect(screen.getByText("Test post title")).toBeInTheDocument();
	});

	it("renders the intro text", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByText("Post summary")).toBeInTheDocument();
	});

	it("renders the image", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByAltText("Image alt text")).toBeInTheDocument();
	});

	it("renders the content", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(
			screen.getByText("This is a mock blog post paragraph")
		).toBeInTheDocument();
	});

	// Add more tests as needed for other parts of the component
	it("renders the breadcrumbs", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByRole("link", { name: "News" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Blog post" })).toBeInTheDocument();
	});

	//TODO: mob help: mock the author component?
	xit("renders the author", () => {
		render(<StoryblokBlogPost {...mockProps} />);
		expect(screen.getByText("Author Name")).toBeInTheDocument();
		expect(screen.getByText("Author Role")).toBeInTheDocument();
	});
});
