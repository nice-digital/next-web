import { StoryblokComponent } from "@storyblok/react";
import { render, screen } from "@testing-library/react";
import { NextSeo } from "next-seo";
import React from "react";

import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentpage";
import { logger } from "@/logger";
import { getAdditionalMetaTags } from "@/utils/storyblok";

jest.mock("@/utils/storyblok");
jest.mock("@/logger");
jest.mock("@storyblok/react", () => ({
	StoryblokComponent: jest.fn(() => <div>Mocked StoryblokComponent</div>),
}));
jest.mock("next-seo", () => ({
	NextSeo: jest.fn(() => <div>Mocked NextSeo</div>),
}));

const mockGetAdditionalMetaTags = getAdditionalMetaTags as jest.Mock;
const mockLoggerError = logger.error as jest.Mock;
const mockStoryblokComponent = StoryblokComponent as unknown as jest.Mock;
const mockNextSeo = NextSeo as jest.Mock;

describe("CorporateContentPageTemplate", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders error content if error prop is present", () => {
		const errorText = "Something went wrong";
		render(<CorporateContentPageTemplate error={errorText} />);

		expect(screen.getByText(errorText)).toBeInTheDocument();
		expect(mockStoryblokComponent).not.toHaveBeenCalled();
	});

	it("renders NextSeo and StoryblokComponent with correct props when story is present", () => {
		const story = {
			name: "Test Story",
			content: { _uid: "123", component: "testComponent" },
		};
		const breadcrumbs = ["crumb1"];
		const siblingPages = ["sib1", "sib2"];

		mockGetAdditionalMetaTags.mockReturnValue([
			{ name: "custom-meta", content: "value" },
		]);

		render(
			<CorporateContentPageTemplate
				story={story}
				breadcrumbs={breadcrumbs}
				siblingPages={siblingPages}
				component="testComponent"
			/>
		);

		expect(mockGetAdditionalMetaTags).toHaveBeenCalledWith(story);
		expect(mockLoggerError).not.toHaveBeenCalled();

		expect(mockNextSeo).toHaveBeenCalledWith(
			expect.objectContaining({
				title: story.name,
				openGraph: { title: story.name },
				additionalMetaTags: [{ name: "custom-meta", content: "value" }],
			}),
			expect.anything()
		);

		expect(mockStoryblokComponent).toHaveBeenCalledWith(
			expect.objectContaining({
				blok: story.content,
				breadcrumbs,
				siblingPages,
			}),
			expect.anything()
		);
	});

	it("logs error and returns undefined additionalMetaTags if story is missing", () => {
		mockGetAdditionalMetaTags.mockReturnValue(undefined);

		render(
			<CorporateContentPageTemplate
				story={undefined}
				breadcrumbs={[]}
				siblingPages={[]}
				component="testComponent"
			/>
		);

		expect(mockLoggerError).toHaveBeenCalledWith(
			"Story is not available for additionalMetaTags in SlugCatchAllPage."
		);

		expect(mockStoryblokComponent).not.toHaveBeenCalled();
	});
});
