import { screen } from "@testing-library/react";

import sampleDataNoMeta from "@/mockData/storyblok/formPageNoMeta.json"; //https://api.storyblok.com/v2/cdn/stories/unit-test-data/form-page-no-meta?resolve_links=url&token=ALPHA_PUBLIC&version=published
import sampleDataWithPanel from "@/mockData/storyblok/formPageWithPanel.json"; //https://api.storyblok.com/v2/cdn/stories/unit-test-data/test-form-page?resolve_links=url&token=ALPHA_PUBLIC&version=published
import { render } from "@/test-utils/rendering";
import { FormPageStoryblok } from "@/types/storyblok";

import { FormPage, type FormPageProps } from "./FormPage";

const mockFormPageWithPanel = sampleDataWithPanel.story.content;
const mockFormPageNoMetaData = sampleDataNoMeta.story.content;

const mockPropsWithPanel: FormPageProps = {
	blok: mockFormPageWithPanel as FormPageStoryblok,
	// breadcrumbs: sampleDataWithPanel.breadcrumbs,
};

const mockPropsNoMetaData: FormPageProps = {
	blok: mockFormPageNoMetaData as FormPageStoryblok,
	// breadcrumbs: sampleDataNoMeta.breadcrumbs,
};

describe("FormPage", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders all metadata StoryblokComponents if present", () => {
		render(<FormPage {...mockPropsWithPanel} />);
		expect(
			screen.getByText(mockFormPageWithPanel.metadata[0].component)
		).toBeInTheDocument();
	});

	it("renders the Page Header through the StoryblokComponent if present", () => {
		render(<FormPage {...mockPropsWithPanel} />);
		const { component, title } = mockFormPageWithPanel.header[0];

		expect(
			screen.getByTestId(`storyblok-component-${component}`)
		).toHaveTextContent(component);

		expect(
			screen.getByTestId(`storyblok-component-${component}`)
		).toHaveTextContent(title);
	});

	it("renders the Panel through the StoryblokComponent if present", () => {
		render(<FormPage {...mockPropsWithPanel} />);
		expect(screen.getByTestId("storyblok-component-panel")).toBeInTheDocument();
	});

	it("should render FormEmbed through the StoryblokComponent", () => {
		render(<FormPage {...mockPropsWithPanel} />);
		expect(
			screen.getByTestId("storyblok-component-formEmbed")
		).toBeInTheDocument();
	});

	it("handles missing metadata gracefully", () => {
		const blok = {
			...mockPropsNoMetaData.blok,
			metadata: undefined,
		};
		render(<FormPage {...mockPropsNoMetaData} blok={blok} />);
		expect(
			screen.queryByText(mockFormPageWithPanel.metadata[0].component)
		).not.toBeInTheDocument();
		expect(
			screen.getByTestId("storyblok-component-formEmbed")
		).toBeInTheDocument();
	});

	it("renders content using nestedRichText through the StoryblokComponent", () => {
		render(<FormPage {...mockPropsWithPanel} />);
		expect(
			screen.getAllByTestId("storyblok-component-nestedRichText").length
		).toBeGreaterThan(1);
	});
});
