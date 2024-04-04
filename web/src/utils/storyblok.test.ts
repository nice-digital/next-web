import { ISbStoryData } from "@storyblok/react";

import { type MultilinkStoryblok } from "@/types/storyblok";

import {
	resolveStoryblokLink,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	encodeParens,
	optimiseImage,
	constructStoryblokImageSrc,
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

	describe("Encode parens", () => {
		it("should return an encoded string when given a string with parens", () => {
			expect(encodeParens("some string (with parens)")).toBe(
				"some string %28with parens%29"
			);
		});

		it("should return the original string when given a string without parens", () => {
			expect(encodeParens("some string without parens")).toBe(
				"some string without parens"
			);
		});
	});

	describe("constructStoryblokImageSrc", () => {
		it("generates correct path with default quality", () => {
			const filename = "imagefilename.jpg";
			const expectedPath = "imagefilename.jpg/m/filters:quality%2880%29";
			const result = constructStoryblokImageSrc(filename);
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified width and default quality", () => {
			const filename = "imagefilename.jpg";
			const width = 400;
			const expectedPath = "imagefilename.jpg/m/400x0/filters:quality%2880%29";
			const result = constructStoryblokImageSrc(filename, { width });
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified quality", () => {
			const filename = "imagefilename.jpg";
			const quality = 60;
			const expectedPath = "imagefilename.jpg/m/filters:quality%2860%29";
			const result = constructStoryblokImageSrc(filename, { quality });
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified width and quality", () => {
			const filename = "imagefilename.jpg";
			const width = 400;
			const quality = 60;
			const expectedPath = "imagefilename.jpg/m/400x0/filters:quality%2860%29";
			const result = constructStoryblokImageSrc(filename, { width, quality });
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified height and quality", () => {
			const filename = "imagefilename.jpg";
			const height = 400;
			const quality = 60;
			const expectedPath = "imagefilename.jpg/m/0x400/filters:quality%2860%29";
			const result = constructStoryblokImageSrc(filename, { height, quality });
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified width, height ", () => {
			const filename = "imagefilename.jpg";
			const width = 400;
			const height = 600;
			const expectedPath =
				"imagefilename.jpg/m/400x600/filters:quality%2880%29";
			const result = constructStoryblokImageSrc(filename, { width, height });
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified format", () => {
			const filename = "imagefilename.jpg";
			const format = "avif";
			const expectedPath =
				"imagefilename.jpg/m/filters:format%28avif%29:quality%2880%29";
			const result = constructStoryblokImageSrc(filename, {}, format);
			expect(result).toEqual(expectedPath);
		});
	});
});
