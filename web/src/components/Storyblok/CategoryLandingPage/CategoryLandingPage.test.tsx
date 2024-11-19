import { render, screen } from "@testing-library/react";

import sampleDataHero from "@/mockData/storyblok/categoryLandingPageWithHero.json";
import sampleDataPageHeader from "@/mockData/storyblok/categoryLandingPageWithPageHeader.json";
import { CategoryLandingPageStoryblok } from "@/types/storyblok";

import {
	CategoryLandingPage,
	type CategoryLandindPageBlokProps,
} from "./CategoryLandingPage";

// test mocking the StoryblokComponent
jest.mock("@storyblok/react", () => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	StoryblokComponent: ({ blok }: { blok: any }) => {
		return (
			<div data-testid={`storyblok-component-${blok.component}`}>
				{blok.component}
			</div>
		);
	},
}));

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

	it("renders the Hero through the StoryblokComponent, if it's passed as block", () => {
		render(<CategoryLandingPage {...mockPropsWithHero} />);
		expect(
			screen.getByText(mockHeroData.header[0].component)
		).toBeInTheDocument();
	});

	xit("renders the Page Header through the StoryblokComponent, if it's passed as block", () => {
		render(<CategoryLandingPage {...mockPropsWithPageHeader} />);
		expect(
			screen.getByText(mockPageHeaderData.header[0].component)
		).toBeInTheDocument();
	});

	it("renders all permissible components in the content area through the StoryblokComponent", () => {
		render(<CategoryLandingPage {...mockPropsWithPageHeader} />);
		mockPageHeaderData.content.forEach(({ component }) => {
			expect(screen.getByText(component)).toBeInTheDocument();
		});
	});

	xit("renders the FullWidth Action Banner through the StoryblokComponent, if it's passed as block", () => {
		render(<CategoryLandingPage {...mockPropsWithPageHeader} />);
		expect(
			screen.getByText(mockPageHeaderData.content[0].component)
		).toBeInTheDocument();
	});
});
