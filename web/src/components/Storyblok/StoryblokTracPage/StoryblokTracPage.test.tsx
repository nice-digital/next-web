import { screen } from "@testing-library/react";

import sampleDataWithPanel from "@/mockData/storyblok/formPageWithPanel.json"; //https://api.storyblok.com/v2/cdn/stories/unit-test-data/test-form-page?resolve_links=url&token=ALPHA_PUBLIC&version=published
import sampleDataNoMeta from "@/mockData/storyblok/tracPageNoMeta.json"; //https://api.storyblok.com/v2/cdn/stories/unit-test-data/form-page-no-meta?resolve_links=url&token=ALPHA_PUBLIC&version=published
import sampleTracDataWIthPanel from "@/mockData/storyblok/tracPageWithPanel.json";
import { render } from "@/test-utils/rendering";
import { TracPageStoryblok } from "@/types/storyblok";

import {
	StoryblokTracPage,
	type StoryblokTracPageProps,
} from "./StoryblokTracPage";

const mockTracPageWithPanel = sampleTracDataWIthPanel.story.content;
const mockFormPageNoMetaData = sampleDataNoMeta.story.content;

const mockPropsWithPanel: StoryblokTracPageProps = {
	blok: mockTracPageWithPanel as TracPageStoryblok,
};

const mockPropsNoMetaData: StoryblokTracPageProps = {
	blok: mockFormPageNoMetaData as TracPageStoryblok,
};

describe("StoryblokTracPage", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders all metadata StoryblokComponents if present", () => {
		render(<StoryblokTracPage {...mockPropsWithPanel} />);
		expect(
			screen.getByText(mockTracPageWithPanel.metadata[0].component)
		).toBeInTheDocument();
	});

	it("renders the Page Header through the StoryblokComponent if present", () => {
		render(<StoryblokTracPage {...mockPropsWithPanel} />);
		const { component, title } = mockTracPageWithPanel.header[0];

		expect(
			screen.getByTestId(`storyblok-component-${component}`)
		).toHaveTextContent(component);

		expect(
			screen.getByTestId(`storyblok-component-${component}`)
		).toHaveTextContent(title);
	});

	it("renders the Panel through the StoryblokComponent if present", () => {
		render(<StoryblokTracPage {...mockPropsWithPanel} />);
		expect(screen.getByTestId("storyblok-component-panel")).toBeInTheDocument();
	});

	it("should render FormEmbed through the StoryblokComponent", () => {
		render(<StoryblokTracPage {...mockPropsWithPanel} />);
		expect(
			screen.getByTestId("storyblok-component-tracEmbed")
		).toBeInTheDocument();
	});

	it("handles missing metadata gracefully", () => {
		const blok = {
			...mockPropsNoMetaData.blok,
			metadata: undefined,
		};
		render(<StoryblokTracPage {...mockPropsNoMetaData} blok={blok} />);
		expect(
			screen.queryByText(mockTracPageWithPanel.metadata[0].component)
		).not.toBeInTheDocument();
		expect(
			screen.getByTestId("storyblok-component-tracEmbed")
		).toBeInTheDocument();
	});

	it("renders content using nestedRichText through the StoryblokComponent", () => {
		render(<StoryblokTracPage {...mockPropsWithPanel} />);
		expect(
			screen.getAllByTestId("storyblok-component-nestedRichText").length
		).toBeGreaterThan(1);
	});
});
