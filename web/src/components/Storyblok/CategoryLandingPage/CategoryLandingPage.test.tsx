import { render, screen } from "@testing-library/react";

import sampleDataHero from "@/mockData/storyblok/categoryLandingPageWithHero.json";
import sampleDataPageHeader from "@/mockData/storyblok/categoryLandingPageWithPageHeader.json";
import { CategoryLandingPageStoryblok } from "@/types/storyblok";

import { StoryblokHero } from "../StoryblokHero/StoryblokHero";
import { StoryblokPageHeader } from "../StoryblokPageHeader/StoryblokPageHeader";

import {
	CategoryLandingPage,
	type CategoryLandindPageBlokProps,
} from "./CategoryLandingPage";

// test mocking the StoryblokComponent
// jest.mock("@storyblok/react", () => ({
// 	StoryblokComponent: ({ blok }: { blok: any }) => {
// 		return (
// 			<div data-testid={`storyblok-component-${blok.component}`}>
// 				{blok.component}
// 			</div>
// 		);
// 	},
// }));

/**
 * TODO: move to a shared mock file
 *	Add components as needed, and update the switch statement in the mock.
 *  Currently uncertain if this is the best way to mock the StoryblokComponent, especially as we grow the number of components required...
 *  We can discuss when together.
 *  */
jest.mock("@storyblok/react", () => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	StoryblokComponent: ({ blok }: { blok: any }) => {
		switch (blok.component) {
			case "hero":
				return <StoryblokHero blok={blok} />;
			case "pageHeader":
				return <StoryblokPageHeader blok={blok} />;
			case "metadata":
				return (
					<div data-testid={`storyblok-component-${blok.component}`}>
						<p>{blok.description}</p>
						{/* Add more fields as necessary */}
					</div>
				);
			// replace with actual component
			case "buttonLink":
				return (
					<button data-testid={`storyblok-component-${blok.component}`}>
						{blok.text}
					</button>
				);
			// Add more cases for other component types if needed
			default:
				return (
					<div data-testid={`storyblok-component-${blok.component}`}>
						{blok.component}
					</div>
				);
		}
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
	it("renders the hero title", () => {
		render(<CategoryLandingPage {...mockPropsWithHero} />);
		expect(screen.getByText(mockHeroData.header[0].title)).toBeInTheDocument();
	});

	it("renders the page header title", () => {
		render(<CategoryLandingPage {...mockPropsWithPageHeader} />);
		expect(
			screen.getByText(mockPageHeaderData.header[0].title)
		).toBeInTheDocument();
	});
});
