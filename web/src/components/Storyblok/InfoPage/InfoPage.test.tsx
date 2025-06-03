import { render, screen } from "@testing-library/react";

import sampleDataPageHeaderSectionNav from "@/mockData/storyblok/infoPageWithPageHeaderAndSectionNav.json"; //
import sampleDataHeroInPageNav from "@/mockData/storyblok/infoPageWithHeroAndInPageNav.json"; //
import sampleDataNoNav from "@/mockData/storyblok/infoPageWithNoNav.json"; //

import { InfoPageStoryblok } from "@/types/storyblok";

import {
	InfoPage,
	type InfoPageBlokProps
} from "./InfoPage";

const mockPageHeaderSectionNavData = sampleDataPageHeaderSectionNav.story.content;
const mockHeroInPageNavData = sampleDataHeroInPageNav.story.content;
const mockNoNavData = sampleDataNoNav.story.content;

const mockPropsWithPageHeaderAndSectionNav: InfoPageBlokProps = {
	blok: sampleDataPageHeaderSectionNav.story.content as InfoPageStoryblok,
	breadcrumbs: sampleDataPageHeaderSectionNav.breadcrumbs,
	tree: sampleDataPageHeaderSectionNav.tree,
	slug: sampleDataPageHeaderSectionNav.slug
};

const mockPropsWithHeroAndInPageNav: InfoPageBlokProps = {
	blok: mockHeroInPageNavData as InfoPageStoryblok,
	breadcrumbs: sampleDataHeroInPageNav.breadcrumbs,
	tree: sampleDataHeroInPageNav.tree,
	slug: sampleDataHeroInPageNav.slug
};

const mockPropsWithNoNav: InfoPageBlokProps = {
	blok: sampleDataNoNav.story.content as InfoPageStoryblok,
	breadcrumbs: sampleDataNoNav.breadcrumbs,
	tree: sampleDataNoNav.tree,
	slug: sampleDataNoNav.slug
};

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
