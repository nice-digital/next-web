import { ISbStoryData, getStoryblokApi } from "@storyblok/react";
import { waitFor } from "@testing-library/react";
import { before } from "lodash";

import { logger } from "@/logger";
import MockLinksSuccessResponse from "@/test-utils/storyblok-links-success-response.json";
import MockMultipleStorySuccessResponse from "@/test-utils/storyblok-news-articles-listing.json";
import Mock404FromStoryblokApi from "@/test-utils/storyblok-not-found-response.json";
import MockServerErrorResponse from "@/test-utils/storyblok-server-error-response.json";
import MockSingleStorySuccessResponse from "@/test-utils/storyblok-single-story-response.json";
import { type MultilinkStoryblok } from "@/types/storyblok";
import * as storyblokUtils from "@/utils/storyblok";

import { fetchLinks } from "./fetchLinks";
import {
	resolveStoryblokLink,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	encodeParens,
	optimiseImage,
	fetchStory,
	fetchStories,
	getBreadcrumbs,
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

	describe("optimiseImage", () => {
		it("generates correct path with default quality", () => {
			const filename = "imagefilename.jpg";
			const expectedPath = "imagefilename.jpg/m/filters:quality%2880%29";
			const result = optimiseImage({ filename });
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified size and default quality", () => {
			const filename = "imagefilename.jpg";
			const size = "400x0";
			const expectedPath = "imagefilename.jpg/m/400x0/filters:quality%2880%29";
			const result = optimiseImage({ filename, size });
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified quality", () => {
			const filename = "imagefilename.jpg";
			const quality = 60;
			const expectedPath = "imagefilename.jpg/m/filters:quality%2860%29";
			const result = optimiseImage({ filename, quality });
			expect(result).toEqual(expectedPath);
		});

		it("generates correct path with specified size and quality", () => {
			const filename = "imagefilename.jpg";
			const size = "400x0";
			const quality = 60;
			const expectedPath = "imagefilename.jpg/m/400x0/filters:quality%2860%29";
			const result = optimiseImage({ filename, size, quality });
			expect(result).toEqual(expectedPath);
		});
	});

	describe("fetchStory", () => {
		it("should call the storyblokApi.get method with the correct params", async () => {
			getStoryblokApi().get = jest
				.fn()
				.mockResolvedValue(MockSingleStorySuccessResponse);

			await fetchStory("news/articles/test-page", "draft");

			expect(getStoryblokApi().get).toHaveBeenCalled();
			expect(getStoryblokApi().get).toHaveBeenCalledOnce();

			expect(getStoryblokApi().get).toHaveBeenCalledWith(
				"cdn/stories/news/articles/test-page",
				{
					cv: expect.any(Number),
					resolve_links: "url",
					version: "draft",
				}
			);
		});

		it("should fetch a story from Storyblok", async () => {
			getStoryblokApi().get = jest
				.fn()
				.mockResolvedValue(MockSingleStorySuccessResponse);

			const result = await fetchStory("news/articles/test-page", "published");

			expect(result.story).toEqual(MockSingleStorySuccessResponse.data.story);
		});

		it("should handle a 404", async () => {
			getStoryblokApi().get = jest
				.fn()
				.mockRejectedValue(JSON.stringify(Mock404FromStoryblokApi));

			const response = await fetchStory("non/existent/slug", "published");

			expect(response).toEqual({ notFound: true });
		});

		it("should handle server errors", async () => {
			getStoryblokApi().get = jest
				.fn()
				.mockRejectedValueOnce(JSON.stringify(MockServerErrorResponse));

			const throwErrorFetchStory = async () => {
				await fetchStory("news/articles/test-page", "published");
			};

			expect(throwErrorFetchStory).rejects.toThrow(
				"503 error from Storyblok API: Service Unavailable"
			);
		});
	});

	describe("fetchStories", () => {
		it("should call the Storyblok.get method with the correct params", async () => {
			getStoryblokApi().get = jest
				.fn()
				.mockResolvedValue(MockMultipleStorySuccessResponse);

			await fetchStories("published", {
				starts_with: "news/articles",
				per_page: 6,
			});

			expect(getStoryblokApi().get).toHaveBeenCalled();
			expect(getStoryblokApi().get).toHaveBeenCalledOnce();

			expect(getStoryblokApi().get).toHaveBeenCalledWith("cdn/stories", {
				cv: expect.any(Number),
				resolve_links: "url",
				version: "published",
				starts_with: "news/articles",
				per_page: 6,
			});
		});

		it("should fetch a list of stories from Storyblok", async () => {
			getStoryblokApi().get = jest
				.fn()
				.mockResolvedValue(MockMultipleStorySuccessResponse);

			const result = await fetchStories("published", {
				starts_with: "news/articles",
				per_page: 8,
			});

			const expectedResult = {
				stories: MockMultipleStorySuccessResponse.data.stories,
				perPage: MockMultipleStorySuccessResponse.perPage,
				total: MockMultipleStorySuccessResponse.total,
			};

			expect(result).toEqual(expectedResult);
		});

		it("should return a 404 error and log error message to logger when there is an error from storyblok", async () => {
			const loggerErrorSpy = jest.spyOn(logger, "error");
			getStoryblokApi().get = jest
				.fn()
				.mockRejectedValue(JSON.stringify(Mock404FromStoryblokApi));

			const throwErrorFetchStories = async () => {
				await fetchStories("published", {
					starts_with: "news/articles",
					per_page: 8,
				});
			};

			expect(throwErrorFetchStories).rejects.toThrow(
				"404 error from Storyblok API: Not Found"
			);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					"404 error from Storyblok API: Not Found",
					'{"message":"Not Found","status":404,"response":"This record could not be found"}'
				);
			});
		});

		it("should return a 503 error and log error message to logger when there is an error from storyblok", async () => {
			const loggerErrorSpy = jest.spyOn(logger, "error");
			getStoryblokApi().get = jest
				.fn()
				.mockRejectedValue(JSON.stringify(MockServerErrorResponse));

			const throwErrorFetchStories = async () => {
				await fetchStories("published", {
					starts_with: "news/articles",
					per_page: 8,
				});
			};

			expect(throwErrorFetchStories).rejects.toThrow(
				"503 error from Storyblok API: Service Unavailable"
			);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					"503 error from Storyblok API: Service Unavailable",
					'{"status":503,"message":"Service Unavailable"}'
				);
			});
		});
	});

	describe("fetchLinks", () => {
		it("should call the storyblokApi.getAll method with the correct params", async () => {
			getStoryblokApi().getAll = jest
				.fn()
				.mockResolvedValue(MockLinksSuccessResponse);

			await fetchLinks("published", "news/podcasts");

			expect(getStoryblokApi().getAll).toHaveBeenCalled();
			expect(getStoryblokApi().getAll).toHaveBeenCalledOnce();

			expect(getStoryblokApi().getAll).toHaveBeenCalledWith("cdn/links", {
				version: "published",
				starts_with: "news/podcasts",
			});
		});

		it("should fetch links from Storyblok", async () => {
			getStoryblokApi().getAll = jest
				.fn()
				.mockResolvedValue(MockLinksSuccessResponse);

			const result = await fetchLinks("published", "news/podcasts");

			expect(result).toEqual(MockLinksSuccessResponse);
		});

		it("should return a 404 error and log error message to logger when there is an error from storyblok", async () => {
			const loggerErrorSpy = jest.spyOn(logger, "error");
			getStoryblokApi().getAll = jest
				.fn()
				.mockRejectedValue(JSON.stringify(Mock404FromStoryblokApi));

			const throwErrorFetchLinks = async () => {
				await fetchLinks("published", "news/podcasts");
			};

			expect(throwErrorFetchLinks).rejects.toThrow(
				"404 error from Storyblok API: Not Found"
			);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					"404 error from Storyblok API: Not Found",
					'{"message":"Not Found","status":404,"response":"This record could not be found"}'
				);
			});
		});

		it("should return a 503 error and log error message to logger when there is an error from storyblok", async () => {
			const loggerErrorSpy = jest.spyOn(logger, "error");
			getStoryblokApi().getAll = jest
				.fn()
				.mockRejectedValue(JSON.stringify(MockServerErrorResponse));

			const throwErrorFetchLinks = async () => {
				await fetchLinks("published", "news/podcasts");
			};

			expect(throwErrorFetchLinks).rejects.toThrow(
				"503 error from Storyblok API: Service Unavailable"
			);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					"503 error from Storyblok API: Service Unavailable",
					'{"status":503,"message":"Service Unavailable"}'
				);
			});
		});
	});
});
