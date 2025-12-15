import { screen } from "@testing-library/react";

import sampleDataWithPanel from "@/mockData/storyblok/formPageWithPanel.json"; //https://api.storyblok.com/v2/cdn/stories/unit-test-data/test-form-page?resolve_links=url&token=ALPHA_PUBLIC&version=published
import sampleDataWithoutPanel from "@/mockData/storyblok/formPageWithoutPanel.json"; //https://api.storyblok.com/v2/cdn/stories/unit-test-data/test-form-page?resolve_links=url&token=ALPHA_PUBLIC&version=published
import { render } from "@/test-utils/rendering";
import { FormPageStoryblok } from "@/types/storyblok";

import { FormPage, type FormPageProps } from "./FormPage";

const mockFormPageWithPanel = sampleDataWithPanel.story.content;

const mockPropsWithPanel: FormPageProps = {
	blok: mockFormPageWithPanel as FormPageStoryblok,
	// breadcrumbs: sampleDataWithPanel.breadcrumbs,
};

// const mockPropsWithoutPanel: FormPageProps = {
// 	blok: mockFormPageWithoutPanel as FormPageStoryblok,
// 	breadcrumbs: sampleDataWithMeta.breadcrumbs,
// };

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

	// TODO: Add test coverage when NXT-501 is ready to implement on FormPage
	xit("renders the Panel through the StoryblokComponent if present", () => {
		// render(<FormPage {...mockPropsWithPageHeaderAndPanel} />);
		// const { component } = mockPageHeaderSectionAndPanel.panel[0];
	});

	it("should render FormEmbed through the StoryblokComponent", () => {
		render(<FormPage {...mockPropsWithPanel} />);
		expect(
			screen.getByTestId("storyblok-component-formEmbed")
		).toBeInTheDocument();
	});

	it("handles missing metadata gracefully", () => {
		const blok = {
			...mockPropsWithPanel.blok,
			metadata: undefined,
		};
		render(<FormPage {...mockPropsWithPanel} blok={blok} />);
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
