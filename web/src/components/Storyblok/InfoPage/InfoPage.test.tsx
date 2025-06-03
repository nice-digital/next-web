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

	it("renders section nav when hideSectionNav is not 'true' and sectionNavIsPopulated(tree) is true", () => {
        render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);
        expect(screen.getByTestId("section-nav")).toBeInTheDocument();
        expect(screen.queryByText("On this page")).not.toBeInTheDocument(); //TODO: add more meaningful check
    });

    xit("renders in-page nav when hideSectionNav is 'true' and hideInPageNav is not 'true'", () => {
		render(<InfoPage {...mockPropsWithHeroAndInPageNav}/>);
        expect(screen.getByText("On this page")).toBeInTheDocument();
        expect(screen.queryByTestId("section-nav")).not.toBeInTheDocument();
    }); // TODO: mock in-page nav or figure out how to proxy it renders correctly

    it("does not render nav area when both hideSectionNav and hideInPageNav are 'true'", () => {
        const blok = { ...mockPropsWithNoNav.blok };
        render(<InfoPage {...mockPropsWithNoNav} />);
        expect(screen.queryByTestId("info-page-nav-wrapper")).not.toBeInTheDocument();
    });



	xit("renders in-page nav when hideSectionNav is not 'true' but sectionNavIsPopulated(tree) is false and hideInPageNav is not 'true'", () => {
		const blok = { ...mockPropsWithNoNav.blok, hideSectionNav: "false", hideInPageNav: "false" };
		render(<InfoPage {...mockPropsWithNoNav} tree={[]} />);
		expect(screen.getByTestId("in-page-nav")).toBeInTheDocument();
		expect(screen.queryByTestId("section-nav")).not.toBeInTheDocument();
	});

	xit("renders in-page nav when Section Nav is not hidden but tree is undefined", () => {
		const blok = { ...mockPropsWithNoNav.blok, hideSectionNav: "false" };
		render(<InfoPage {...mockPropsWithNoNav} tree={undefined as any} />);
		expect(screen.getByTestId("in-page-nav")).toBeInTheDocument();
	});

	xit("renders in-page nav when hideSectionNav is not 'true' and tree is an empty array", () => {
		const blok = { ...mockPropsWithNoNav.blok, hideSectionNav: "false" };
		render(<InfoPage {...mockPropsWithNoNav} tree={[]} />);
		expect(screen.getByTestId("in-page-nav")).toBeInTheDocument();
	});

	xit("renders correct nav area when hideSectionNav is not 'true' and tree is falsy", () => {
		const blok = { ...mockPropsWithNoNav.blok, hideSectionNav: "false" };
		render(<InfoPage {...mockPropsWithNoNav} tree={null as any} />);
		expect(screen.getByTestId("in-page-nav")).toBeInTheDocument();
	});



    it("handles empty blok object", () => {
        const blok = {} as InfoPageStoryblok;
        render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);
        expect(screen.getByTestId("section-nav")).toBeInTheDocument();
    });

    it("does not try to render section nav if tree undefined", () => {
        const blok = { ...mockPropsWithPageHeaderAndSectionNav.blok};
        render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} tree={undefined as any} />);
		expect(screen.getByTestId("storyblok-rich-text")).toBeInTheDocument();
        expect(screen.queryByTestId("section-nav")).not.toBeInTheDocument();
    });
});
