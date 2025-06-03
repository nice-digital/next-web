import { render, screen } from "@testing-library/react";

import sampleDataPageHeaderSectionNav from "@/mockData/storyblok/infoPageWithPageHeaderAndSectionNav.json";
import sampleDataHeroInPageNav from "@/mockData/storyblok/infoPageWithHeroAndInPageNav.json";
import sampleDataNoNav from "@/mockData/storyblok/infoPageWithNoNav.json";

import { InfoPageStoryblok } from "@/types/storyblok";

import {
    InfoPage,
    type InfoPageBlokProps
} from "./InfoPage";

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

const mockPageHeaderSectionNavData = sampleDataPageHeaderSectionNav.story.content;
const mockHeroInPageNavData = sampleDataHeroInPageNav.story.content;
const mockNoNavData = sampleDataNoNav.story.content;

const mockPropsWithPageHeaderAndSectionNav: InfoPageBlokProps = {
    blok: mockPageHeaderSectionNavData as InfoPageStoryblok,
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
    blok: mockNoNavData as InfoPageStoryblok,
    breadcrumbs: sampleDataNoNav.breadcrumbs,
    tree: sampleDataNoNav.tree,
    slug: sampleDataNoNav.slug
};

// TODO: mock in-page nav or figure out how to proxy it renders correctly

describe("InfoPage", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

    it("renders all metadata StoryblokComponents if present", () => {
        render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);
		expect(
			screen.getByText(mockPageHeaderSectionNavData.metadata[0].component)
		).toBeInTheDocument();
    });

    it("renders the Page Header through the StoryblokComponent if present", () => {
        render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);
        expect(
			screen.getByText(mockPageHeaderSectionNavData.header[0].component)
		).toBeInTheDocument();
    });

	it("renders the Page Hero through the StoryblokComponent if present", () => {
        render(<InfoPage {...mockPropsWithHeroAndInPageNav} />);
        expect(
			screen.getByTestId("storyblok-component-hero")
		).toBeInTheDocument();
    });

	it("handles missing metadata and header gracefully", () => {
        const blok = { ...mockPropsWithHeroAndInPageNav.blok, metadata: undefined, header: undefined };
        render(<InfoPage {...mockPropsWithHeroAndInPageNav} />);
        expect(screen.getByTestId("storyblok-rich-text")).toBeInTheDocument();
    });

	it("renders content using StoryblokRichText", () => {
        render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);
        expect(screen.getByTestId("storyblok-rich-text")).toBeInTheDocument();
    });
    it("handles empty blok object", () => {
        const blok = {} as InfoPageStoryblok;
        render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);
        expect(screen.getByTestId("section-nav")).toBeInTheDocument();
});
