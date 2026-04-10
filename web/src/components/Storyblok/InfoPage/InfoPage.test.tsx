import { StoryblokComponent } from "@storyblok/react";
import { screen } from "@testing-library/react";

import sampleDataHeroInPageNav from "@/mockData/storyblok/infoPageWithHeroAndInPageNav.json";
import sampleDataNoNav from "@/mockData/storyblok/infoPageWithNoNav.json";
import sampleDataPageHeaderSectionNav from "@/mockData/storyblok/infoPageWithPageHeaderAndSectionNav.json";
import { render } from "@/test-utils/rendering";
import { type PreHeader } from "@/types/SBCorporateContent";
import { InfoPageStoryblok } from "@/types/storyblok";
import * as contentStructureUtils from "@/utils/storyblok/contentStructureUtils";

import { InfoPage, type InfoPageBlokProps } from "./InfoPage";

const mockPageHeaderSectionNavData =
	sampleDataPageHeaderSectionNav.story.content;
const mockHeroInPageNavData = sampleDataHeroInPageNav.story.content;
const mockNoNavData = sampleDataNoNav.story.content;

const mockPropsWithPageHeaderAndSectionNav: InfoPageBlokProps = {
	blok: mockPageHeaderSectionNavData as InfoPageStoryblok,
	breadcrumbs: sampleDataPageHeaderSectionNav.breadcrumbs,
	tree: sampleDataPageHeaderSectionNav.tree,
	slug: sampleDataPageHeaderSectionNav.slug,
	preheading:
		sampleDataPageHeaderSectionNav.breadcrumbs[
			sampleDataPageHeaderSectionNav.breadcrumbs.length - 1
		].title,
};

//TODO: update preheading value and mock when Hero preheading work is ready for dev
const mockPropsWithHeroAndInPageNav: InfoPageBlokProps = {
	blok: mockHeroInPageNavData as InfoPageStoryblok,
	breadcrumbs: sampleDataHeroInPageNav.breadcrumbs,
	tree: sampleDataHeroInPageNav.tree,
	slug: sampleDataHeroInPageNav.slug,
	preheading: "",
};

//TODO: update preheading when decision made on whether we keep preheading if no nav(Now it's no longer related to nav logic)
const mockPropsWithNoNav: InfoPageBlokProps = {
	blok: mockNoNavData as InfoPageStoryblok,
	breadcrumbs: sampleDataNoNav.breadcrumbs,
	tree: sampleDataNoNav.tree,
	slug: sampleDataNoNav.slug,
	preheading: "",
};

jest.mock("@storyblok/react", () => ({
	StoryblokComponent: jest.fn(() => null),
}));

const mockedStoryblokComponent = StoryblokComponent as unknown as jest.Mock;

describe("InfoPage", () => {
	beforeAll(() => {
		jest.spyOn(contentStructureUtils, "treeHasItems");
	});
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
			const { InfoPage } = await import("./InfoPage");
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

	xit("passes preheading when section nav is populated and title differs", () => {
		(contentStructureUtils.treeHasItems as jest.Mock).mockReturnValue(true);

		render(<InfoPage {...mockPropsWithPageHeaderAndSectionNav} />);

		expect(mockedStoryblokComponent).toHaveBeenCalledWith(
			expect.objectContaining({
				preheading: "Info Page with Hero and In Page Nav",
			}),
			{}
		);
	});

	xit("passes preheading when section nav is hidden", () => {
		(contentStructureUtils.treeHasItems as jest.Mock).mockReturnValue(true);
		const mockPropsWithSectionNav = {
			...mockPropsWithPageHeaderAndSectionNav,
			hideSectionNav: "true",
		};
		render(<InfoPage {...mockPropsWithSectionNav} />);
		expect(mockedStoryblokComponent).toHaveBeenCalledWith(
			expect.objectContaining({
				preheading: "Info Page with Hero and In Page Nav",
			}),
			{}
		);
	});

	xit("passes empty preheading when section name matches header title", () => {
		(contentStructureUtils.treeHasItems as jest.Mock).mockReturnValue(true);

		const mockPropsWithSameTitleandPreheading = {
			...mockPropsWithPageHeaderAndSectionNav,
			tree: [
				{
					id: 681214537,
					uuid: "e5cfb560-56ac-45a6-9dec-b421837e7692",
					slug: "unit-test-data/info-page-hero-in-page-nav",
					path: null,
					parent_id: 659520607,
					name: "Info Page with Page Header and Section Nav",
					is_folder: false,
					published: true,
					is_startpage: false,
					position: -30,
					real_path: "/unit-test-data/info-page-hero-in-page-nav",
					childLinks: [],
				},
			],
			blok: {
				...mockPropsWithPageHeaderAndSectionNav.blok,
				header: [
					{
						...mockPropsWithPageHeaderAndSectionNav.blok.header[0],
						title: "Info Page with Page Header and Section Nav",
					},
				],
			},
		};

		render(<InfoPage {...mockPropsWithSameTitleandPreheading} />);

		expect(mockedStoryblokComponent).toHaveBeenCalledWith(
			expect.objectContaining({
				preheading: "",
			}),
			{}
		);
	});

	xit("passes empty preheading when pageHeader is missing", () => {
		(contentStructureUtils.treeHasItems as jest.Mock).mockReturnValue(true);
		render(<InfoPage {...mockPropsWithHeroAndInPageNav} />);

		expect(mockedStoryblokComponent).toHaveBeenCalledWith(
			expect.objectContaining({
				preheading: "",
			}),
			{}
		);
	});

	it("returns null preheading when hidePreHeader is 'true'", () => {
		const mockProps = {
			...mockPropsWithPageHeaderAndSectionNav,
			blok: {
				...mockPropsWithPageHeaderAndSectionNav.blok,
				hidePreHeader: "true" as "true" | "false",
			},
		};

		render(<InfoPage {...mockProps} />);

		expect(mockedStoryblokComponent).toHaveBeenCalledWith(
			expect.objectContaining({
				preheading: null,
			}),
			{}
		);
	});

	it("calls getPreheading when hidePreHeader is not 'true'", () => {
		const mockProps = {
			...mockPropsWithPageHeaderAndSectionNav,
			blok: {
				...mockPropsWithPageHeaderAndSectionNav.blok,
				hidePreHeader: "false" as "true" | "false",
			},
		};

		render(<InfoPage {...mockProps} />);

		expect(mockedStoryblokComponent).toHaveBeenCalledWith(
			expect.objectContaining({
				preheading: expect.any(String),
			}),
			{}
		);
	});
});
