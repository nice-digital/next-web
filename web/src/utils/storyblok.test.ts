import { ISbStoryData } from "@storyblok/react";

import { type MultilinkStoryblok } from "@/types/storyblok";

import {
	resolveStoryblokLink,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
} from "./storyblok";

describe("Storyblok utils", () => {
	describe("Resolve Storyblok links", () => {
		it.each([
			[
				{ linktype: "url", url: " https://example.com  " },
				{ url: "https://example.com", isInternal: false },
			],
			[
				{ linktype: "asset", url: " https://example.com/image.png  " },
				{ url: "https://example.com/image.png", isInternal: false },
			],
			[
				{ linktype: "email", email: "  somebody@example.com " },
				{ url: "mailto:somebody@example.com", isInternal: false },
			],
			[
				{ linktype: "story", url: "example/page/slug" },
				{ url: "example/page/slug", isInternal: true },
			],
		])(
			"should ensure that correct links are returned for each linktype",
			(link, expectedOutput) => {
				expect(resolveStoryblokLink(link as MultilinkStoryblok)).toStrictEqual(
					expectedOutput
				);
			}
		);

		it.each([
			[
				{ linktype: "url", email: " https://example.com  " },
				{ url: undefined, isInternal: false },
			],
			[
				{ linktype: "asset", story: " https://example.com/image.png  " },
				{ url: undefined, isInternal: false },
			],
			[
				{ linktype: "email", url: "  somebody@example.com " },
				{ url: undefined, isInternal: false },
			],
			[
				{
					linktype: "incorrect_linktype",
					story: { full_slug: "example/page/slug" },
				},
				{ url: undefined, isInternal: false },
			],
		])("should return undefined for invalid inputs", (link, expectedOutput) => {
			expect(resolveStoryblokLink(link as MultilinkStoryblok)).toStrictEqual(
				expectedOutput
			);
		});
	});

	describe("Get story version from NextJS query", () => {
		it("should get the draft version when the _storyblok query param is present", () => {
			expect(getStoryVersionFromQuery({ _storyblok: "" })).toBe("draft");
		});

		it("should get the published version when the _storyblok query param isn't present", () => {
			expect(getStoryVersionFromQuery()).toBe("published");
		});
	});

	describe("Get slug from params", () => {
		it("should return a valid slug when supplied with an array", () => {
			expect(getSlugFromParams(["level-1", "level-2", "level-3"])).toBe(
				"level-1/level-2/level-3"
			);
		});
		it("should return a valid slug when supplied with a single param", () => {
			expect(getSlugFromParams("some-slug")).toBe("some-slug");
		});
	});

	describe("Get additional meta tags", () => {
		it("should return proper meta tags when created_at and published_at are present", () => {
			const story = {
				created_at: "1980",
				published_at: "2023",
			};

			expect(getAdditionalMetaTags(story as ISbStoryData)).toStrictEqual([
				{ name: "DC.Issued", content: "1980" },
				{
					name: "DC.Modified",
					content: "2023",
				},
			]);
		});

		it("should return proper meta tags when only created_at is present", () => {
			const story = {
				created_at: "1980",
			};

			expect(getAdditionalMetaTags(story as ISbStoryData)).toStrictEqual([
				{ name: "DC.Issued", content: "1980" },
				{
					name: "DC.Modified",
					content: "1980",
				},
			]);
		});
	});
});
