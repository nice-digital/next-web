import { screen } from "@testing-library/react";

import sampleDataHeroInPageNav from "@/mockData/storyblok/infoPageWithHeroAndInPageNav.json";
import sampleDataNoNav from "@/mockData/storyblok/infoPageWithNoNav.json";
import sampleDataPageHeaderSectionNav from "@/mockData/storyblok/infoPageWithPageHeaderAndSectionNav.json";
import { render } from "@/test-utils/rendering";
import { InfoPageStoryblok } from "@/types/storyblok";

import { InfoPage, type InfoPageBlokProps } from "./FormPage";

const mockPageHeaderSectionNavData =
	sampleDataPageHeaderSectionNav.story.content;
const mockHeroInPageNavData = sampleDataHeroInPageNav.story.content;
const mockNoNavData = sampleDataNoNav.story.content;

const mockPropsWithPageHeaderAndSectionNav: InfoPageBlokProps = {
	blok: mockPageHeaderSectionNavData as InfoPageStoryblok,
	breadcrumbs: sampleDataPageHeaderSectionNav.breadcrumbs,
	tree: sampleDataPageHeaderSectionNav.tree,
	slug: sampleDataPageHeaderSectionNav.slug,
};

const mockPropsWithHeroAndInPageNav: InfoPageBlokProps = {
	blok: mockHeroInPageNavData as InfoPageStoryblok,
	breadcrumbs: sampleDataHeroInPageNav.breadcrumbs,
	tree: sampleDataHeroInPageNav.tree,
	slug: sampleDataHeroInPageNav.slug,
};

const mockPropsWithNoNav: InfoPageBlokProps = {
	blok: mockNoNavData as InfoPageStoryblok,
	breadcrumbs: sampleDataNoNav.breadcrumbs,
	tree: sampleDataNoNav.tree,
	slug: sampleDataNoNav.slug,
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
		const { component, title } = mockPageHeaderSectionNavData.header[0];

		expect(
			screen.getByTestId(`storyblok-component-${component}`)
		).toHaveTextContent(component);

		expect(
			screen.getByTestId(`storyblok-component-${component}`)
		).toHaveTextContent(title);
	});

	it("renders the Page Hero through the StoryblokComponent if present", () => {
		render(<InfoPage {...mockPropsWithHeroAndInPageNav} />);
		expect(screen.getByTestId("storyblok-component-hero")).toBeInTheDocument();
	});

	it("handles missing metadata gracefully", () => {
		const blok = {
			...mockPropsWithHeroAndInPageNav.blok,
			metadata: undefined,
		};
		render(<InfoPage {...mockPropsWithHeroAndInPageNav} blok={blok} />);
		expect(screen.getByTestId("storyblok-rich-text")).toBeInTheDocument();
	});

	it("renders content using StoryblokRichText", () => {
		render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);
		expect(screen.getByTestId("storyblok-rich-text")).toBeInTheDocument();
	});

	it("renders Section Nav when hideSectionNav is not 'true' and Section Nav tree is populated", () => {
		render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);
		expect(screen.getByTestId("section-nav")).toBeInTheDocument();
		expect(screen.queryByText("On this page")).not.toBeInTheDocument();
	});

	it("does not try to render Section Nav if tree is empty", () => {
		render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} tree={[]} />);
		expect(screen.getByTestId("storyblok-rich-text")).toBeInTheDocument();
		expect(screen.queryByTestId("section-nav")).not.toBeInTheDocument();
		expect(screen.queryByText("On this page")).not.toBeInTheDocument();
	});

	describe("when testing In-Page Nav rendering", () => {
		beforeEach(() => {
			jest.resetModules();

			jest.doMock("@nice-digital/nds-in-page-nav", () => ({
				InPageNav: () => <div>On this page</div>,
			}));
		});

		it("renders In-Page Nav when hideSectionNav is 'true' and hideInPageNav is not 'true'", async () => {
			const { InfoPage } = await import("./FormPage");
			render(<InfoPage {...mockPropsWithHeroAndInPageNav} />);
			expect(screen.getByText("On this page")).toBeInTheDocument();
			expect(screen.queryByTestId("section-nav")).not.toBeInTheDocument();
		});
	});

	it("does not render nav area when both hideSectionNav and hideInPageNav are 'true'", () => {
		render(<InfoPage {...mockPropsWithNoNav} />);
		expect(
			screen.queryByTestId("info-page-nav-wrapper")
		).not.toBeInTheDocument();
	});
});
