import { render, screen } from "@testing-library/react";
import { StoryblokStory } from "storyblok-generate-ts";

import { mockNewsArticle, mockBlogPost } from "@/test-utils/storyblok-data";
import type { NewsStory } from "@/types/News";

import { HomepageLatestNews } from "./HomepageLatestNews";

// Mock a featured story
const featuredStory: StoryblokStory<NewsStory> = {
	...mockNewsArticle,
	id: 333333,
	name: "Featured story title",
	content: {
		...mockNewsArticle.content,
		introText: "Featured story intro text",
		image: {
			id: 234,
			filename: "https://placebacon.net/300/210?image=1",
			name: "Delicious bacon",
		},
	},
};

// Mock a second article with a different ID so we avoid duplicate key warnings
const secondNewsArticle = {
	...mockNewsArticle,
	id: 987654321,
};

const latestNews: StoryblokStory<NewsStory>[] = [
	mockNewsArticle,
	mockBlogPost,
	secondNewsArticle,
];

describe("Homepage latest news component", () => {
	it("should match snapshot without a featured story", () => {
		const { container } = render(
			<HomepageLatestNews latestNews={latestNews} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot with a featured story", () => {
		const { container } = render(
			<HomepageLatestNews
				latestNews={latestNews}
				featuredStory={featuredStory}
			/>
		);
		expect(container).toMatchSnapshot();
	});

	it("should render a featured story if one is supplied", () => {
		render(
			<HomepageLatestNews
				latestNews={latestNews}
				featuredStory={featuredStory}
			/>
		);

		expect(
			screen.getByRole("heading", { level: 3, name: "Featured story title" })
		).toBeInTheDocument();
	});

	it("should not render a featured story if one is not supplied", () => {
		render(<HomepageLatestNews latestNews={latestNews} />);

		expect(
			screen.queryByRole("heading", { level: 3, name: "Featured story title" })
		).toBeNull();
	});
});
