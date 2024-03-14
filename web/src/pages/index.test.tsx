import { StoryblokStory } from "storyblok-generate-ts";

import { homepageHeroProps } from "@/components/Storyblok/Homepage/HomepageHero/HomepageHero.test";
import { render } from "@/test-utils/rendering";
import {
	mockStoryblokStory,
	mockNewsArticle,
	mockBlogPost,
	mockRichText,
} from "@/test-utils/storyblok-data";
import { NewsStory } from "@/types/News";

import Home, { type HomeProps } from "./index.page";

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

const props: HomeProps = {
	latestNews,
	story: {
		...mockStoryblokStory,
		content: {
			hero: [homepageHeroProps.blok],
			links: mockRichText,
			_uid: "12345789",
			component: "homepage",
		},
	},
};

describe("Homepage", () => {
	it("should match snapshot", () => {
		const { container } = render(<Home {...props} />);
		expect(container).toMatchSnapshot();
	});
});
