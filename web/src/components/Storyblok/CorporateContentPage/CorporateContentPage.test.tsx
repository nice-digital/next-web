import { StoryblokComponent } from "@storyblok/react";
import { render, screen } from "@testing-library/react";
import { NextSeo } from "next-seo";
import React from "react";

import { type ExtendedSBLink } from "@/components/Storyblok/StoryblokSectionNav/utils/Utils";
import { logger } from "@/logger";
import { getAdditionalMetaTags } from "@/utils/storyblok";

import { CorporateContentPage } from "./CorporateContentPage";

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

describe("CorporateContent", () => {
	const mockTree: ExtendedSBLink[] = [
		{
			id: 1,
			slug: "test-slug",
			name: "Test Name",
			is_folder: false,
			parent_id: 0,
			published: true,
			position: 0,
			uuid: "test-uuid",
			is_startpage: false,
			real_path: "/test-slug",
			path: null,
		},
	];

	const slug = "test-story";

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders error content if error prop is present", () => {
		const errorText = "Something went wrong";
		render(<CorporateContentPage error={errorText} />);

		expect(screen.getByText(errorText)).toBeInTheDocument();
		expect(mockStoryblokComponent).not.toHaveBeenCalled();
	});

	it("renders NextSeo and StoryblokComponent with correct props when story is present", () => {
		const story = {
			name: "Test Story",
			content: { _uid: "123", component: "testComponent" },
		};
		const breadcrumbs = ["crumb1"];

		mockGetAdditionalMetaTags.mockReturnValue([
			{ name: "custom-meta", content: "value" },
		]);

		render(
			<CorporateContentPage
				story={story}
				breadcrumbs={breadcrumbs}
				component="testComponent"
				slug={slug}
				tree={mockTree}
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
			}),
			expect.anything()
		);
	});

	it("logs error and returns undefined additionalMetaTags if story is missing", () => {
		mockGetAdditionalMetaTags.mockReturnValue(undefined);

		render(
			<CorporateContentPage
				story={undefined}
				breadcrumbs={[]}
				component="testComponent"
				slug={slug}
				tree={mockTree}
			/>
		);

		expect(mockLoggerError).toHaveBeenCalledWith(
			"Story is not available for additionalMetaTags in SlugCatchAllPage."
		);

		expect(mockStoryblokComponent).not.toHaveBeenCalled();
	});
});
