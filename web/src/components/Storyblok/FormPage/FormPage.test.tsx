import { screen } from "@testing-library/react";

// import sampleDataHeroInPageNav from "@/mockData/storyblok/infoPageWithHeroAndInPageNav.json";
// import sampleDataNoNav from "@/mockData/storyblok/infoPageWithNoNav.json";
// import sampleDataPageHeaderSectionNav from "@/mockData/storyblok/infoPageWithPageHeaderAndSectionNav.json";

import sampleDataWithMeta from "@/mockData/storyblok/formPageWithMeta.json";
import sampleDataWithPageHeader from "@/mockData/storyblok/formPageWithPageHeader.json";
import { render } from "@/test-utils/rendering";
import { FormPageStoryblok } from "@/types/storyblok";

import { FormPage, type FormPageProps } from "./FormPage";

const mockPageHeaderSectionAndPanel = sampleDataWithPageHeader.story.content;

const mockFormPageWithMetadata = sampleDataWithMeta.story.content;
// const mockHeroInPageNavData = sampleDataHeroInPageNav.story.content;
// const mockNoNavData = sampleDataNoNav.story.content;

const mockPropsWithPageHeaderAndPanel: FormPageProps = {
	blok: mockPageHeaderSectionAndPanel as FormPageStoryblok,
	breadcrumbs: sampleDataWithPageHeader.breadcrumbs,
	slug: sampleDataWithPageHeader.slug,
};

const mockPropsWithMetadata: FormPageProps = {
	blok: mockFormPageWithMetadata as FormPageStoryblok,
	breadcrumbs: sampleDataWithMeta.breadcrumbs,
	slug: sampleDataWithMeta.slug,
};

describe("FormPage", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders all metadata StoryblokComponents if present", () => {
		render(<FormPage {...mockPropsWithMetadata} />);
		expect(
			screen.getByText(mockFormPageWithMetadata.metadata[0].component)
		).toBeInTheDocument();
	});

	it("renders the Page Header through the StoryblokComponent if present", () => {
		render(<FormPage {...mockPropsWithPageHeaderAndPanel} />);
		const { component, title } = mockPageHeaderSectionAndPanel.header[0];

		expect(
			screen.getByTestId(`storyblok-component-${component}`)
		).toHaveTextContent(component);

		expect(
			screen.getByTestId(`storyblok-component-${component}`)
		).toHaveTextContent(title);
	});

	xit("renders the Panel through the StoryblokComponent if present", () => {
		render(<FormPage {...mockPropsWithPageHeaderAndPanel} />);
		const { component } = mockPageHeaderSectionAndPanel.panel[0];
		console.log(component);

		// const panel = screen.get
	});

	it("should render FormEmbed through the StoryblokComponent", () => {
		render(<FormPage {...mockPropsWithPageHeaderAndPanel} />);
		expect(
			screen.getByTestId("storyblok-component-formEmbed")
		).toBeInTheDocument();
	});

	it("handles missing metadata gracefully", () => {
		const blok = {
			...mockPropsWithPageHeaderAndPanel.blok,
			metadata: undefined,
		};
		render(<FormPage {...mockPropsWithPageHeaderAndPanel} blok={blok} />);
		expect(
			screen.queryByText(mockFormPageWithMetadata.metadata[0].component)
		).not.toBeInTheDocument();
		expect(
			screen.getByTestId("storyblok-component-formEmbed")
		).toBeInTheDocument();
	});

	it("renders content using nestedRichText through the StoryblokComponent", () => {
		render(<FormPage {...mockPropsWithPageHeaderAndPanel} />);
		expect(
			screen.getAllByTestId("storyblok-component-nestedRichText").length
		).toBeGreaterThan(1);
	});
});
