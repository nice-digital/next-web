import { render, screen } from "@testing-library/react";

import sampleDataHero from "@/mockData/storyblok/categoryLandingPageWithHero.json";
import sampleDataPageHeader from "@/mockData/storyblok/categoryLandingPageWithPageHeader.json";
import { CategoryLandingPageStoryblok } from "@/types/storyblok";

import {
	CategoryLandingPage,
	type CategoryLandindPageBlokProps,
} from "./CategoryLandingPage";

const mockHeroData = sampleDataHero.story.content;
const mockPageHeaderData = sampleDataPageHeader.story.content;

const mockPropsWithHero: CategoryLandindPageBlokProps = {
	blok: mockHeroData as CategoryLandingPageStoryblok,
};
const mockPropsWithPageHeader: CategoryLandindPageBlokProps = {
	blok: mockPageHeaderData as CategoryLandingPageStoryblok,
};

describe("CategoryLandingPage", () => {
	it("includes the metadata through the StoryblokComponent", () => {
		render(<CategoryLandingPage {...mockPropsWithHero} />);
		expect(
			screen.getByText(mockHeroData.metadata[0].component)
		).toBeInTheDocument();
	});
	xit("renders the hero title", () => {
		render(<CategoryLandingPage {...mockPropsWithHero} />);
		expect(
			screen.getByText(mockHeroData.header[0].component)
		).toBeInTheDocument();
	});

	xit("renders the page header title", () => {
		render(<CategoryLandingPage {...mockPropsWithPageHeader} />);
		expect(
			screen.getByText(mockPageHeaderData.header[0].title)
		).toBeInTheDocument();
	});
});
