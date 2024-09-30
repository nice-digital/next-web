import {
	ISbStoriesParams,
	ISbStoryData,
	getStoryblokApi,
} from "@storyblok/react";
import { waitFor } from "@testing-library/react";

import { logger } from "@/logger";
import MockMultipleStorySuccessResponse from "@/test-utils/storyblok-news-articles-listing.json";
import Mock404FromStoryblokApi from "@/test-utils/storyblok-not-found-response.json";
import MockLinksSuccessResponse from "@/test-utils/storyblok-react-links-success-response.json";
import MockServerErrorResponse from "@/test-utils/storyblok-server-error-response.json";
import MockSingleStorySuccessResponse from "@/test-utils/storyblok-single-story-response.json";
import { type MultilinkStoryblok } from "@/types/storyblok";
import * as storyblokUtils from "@/utils/storyblok";

import {
	resolveStoryblokLink,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	encodeParens,
	fetchStory,
	fetchStories,
	getBreadcrumbs,
	fetchLinks,
	getNewsType,
	newsTypes,
	friendlyDate,
	validateRouteParams,
	constructStoryblokImageSrc,
	GENERIC_ERROR_MESSAGE,
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
		it("should return undefined if slugParams is undefined", () => {
			expect(getSlugFromParams(undefined)).toBeUndefined();
		});
		it("should return undefined if slugParams is an empty string", () => {
			expect(getSlugFromParams("")).toBeUndefined();
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
			const loggerErrorSpy = jest.spyOn(logger, "error");
			getStoryblokApi().get = jest
				.fn()
				.mockRejectedValueOnce(JSON.stringify(MockServerErrorResponse));

			const throwErrorFetchStory = async () => {
				await fetchStory("news/articles/test-page", "published");
			};

			expect(throwErrorFetchStory).rejects.toThrow(GENERIC_ERROR_MESSAGE);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					{
						ocelotEndpoint: null,
						originatingErrorResponse: {
							message: "Service Unavailable",
							status: 503,
						},
						sbParams: { resolve_links: "url", version: "published" },
						slug: "news/articles/test-page",
					},
					"fetchStory: 503 error from Storyblok API: Service Unavailable at slug: news/articles/test-page "
				);
			});
		});

		it("should handle malformed JSON error responses", async () => {
			const loggerErrorSpy = jest.spyOn(logger, "error");
			getStoryblokApi().get = jest
				.fn()
				.mockRejectedValueOnce("This is not JSON");

			const throwErrorFetchStory = async () => {
				await fetchStory("news/articles/test-page", "published");
			};

			expect(throwErrorFetchStory).rejects.toThrow(GENERIC_ERROR_MESSAGE);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					{
						ocelotEndpoint: null,
						originatingErrorMessage: "This is not JSON",
						sbParams: { resolve_links: "url", version: "published" },
						slug: "news/articles/test-page",
					},
					"fetchStory: Failed to parse error response: This is not JSON; At path: news/articles/test-page;"
				);
			});
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
				// "404 error from Storyblok API: Not Found"
				GENERIC_ERROR_MESSAGE
			);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					{
						ocelotEndpoint: null,
						originatingErrorResponse: {
							message: "Not Found",
							response: "This record could not be found",
							status: 404,
						},
						sbParams: {
							per_page: 8,
							resolve_links: "url",
							starts_with: "news/articles",
							version: "published",
						},
					},
					"fetchStories: 404 error from Storyblok API: Not Found at starts_with: news/articles "
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
				// "503 error from Storyblok API: Service Unavailable"
				GENERIC_ERROR_MESSAGE
			);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					{
						ocelotEndpoint: null,
						originatingErrorResponse: {
							message: "Service Unavailable",
							status: 503,
						},
						sbParams: {
							per_page: 8,
							resolve_links: "url",
							starts_with: "news/articles",
							version: "published",
						},
					},
					"fetchStories: 503 error from Storyblok API: Service Unavailable at starts_with: news/articles "
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

	describe("getBreadcrumbs", () => {
		it("should fetch links with correct params", async () => {
			const fetchLinksSpy = jest.spyOn(storyblokUtils, "fetchLinks");

			getStoryblokApi().getAll = jest
				.fn()
				.mockResolvedValue([MockLinksSuccessResponse.links]);

			await getBreadcrumbs("news/podcasts/test-podcast-4", "published");

			expect(fetchLinksSpy).toHaveBeenCalled();
			expect(fetchLinksSpy).toHaveBeenCalledWith("published", "news");

			expect(getStoryblokApi().getAll).toHaveBeenCalled();
			expect(getStoryblokApi().getAll).toHaveBeenCalledWith("cdn/links", {
				version: "published",
				starts_with: "news",
			});
		});

		it("should return valid breadcrumbs", async () => {
			getStoryblokApi().getAll = jest
				.fn()
				.mockResolvedValue(MockLinksSuccessResponse.links);

			const result = await getBreadcrumbs(
				"news/podcasts/test-podcast-4",
				"published"
			);

			expect(result).toEqual([
				{ path: "/news", title: "News" },
				{ path: "/news/podcasts", title: "Podcasts" },
				{ title: "Test podcast 4" },
			]);
		});

		it.todo("no links found?");
		it.todo("no parent id?");
		it.todo("reverse ordering");
		it.todo("fetchLinks error");
		it.todo("fetchLinks 404?");
	});

	describe("friendlyDate", () => {
		it("should format date string into expected format", () => {
			const formattedDate = friendlyDate("2022-04-02");
			expect(formattedDate).toBe("02 April 2022");
		});

		it("should handle invalid input gracefully", () => {
			const emptyStringDate = friendlyDate("");
			const dateAsRandomString = friendlyDate("random string");
			expect(emptyStringDate).toBe("Invalid Date");
			expect(dateAsRandomString).toBe("Invalid Date");
		});
	});

	describe("getNewsType", () => {
		for (const type in newsTypes) {
			it(`should return the correct category type for ${type}`, () => {
				const story = {
					content: {
						component: type,
					},
				};

				expect(getNewsType(story.content.component)).toBe(
					newsTypes[type as keyof typeof newsTypes]
				);
			});
		}

		it("should return the default category type of News when an invalid type is passed", () => {
			const story = {
				content: {
					component: "invalidType",
				},
			};

			expect(getNewsType(story.content.component)).toBe(newsTypes.newsArticle);
		});
	});

	describe("validateRouteParams", () => {
		const mockRequestParams = {
			query: {},
			resolvedUrl: "/news/articles",
			sbParams: {
				starts_with: "news/articles/",
				per_page: 8,
			},
		};

		let expectedParams: ISbStoriesParams;

		let fetchStoriesSpy: jest.SpyInstance;

		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2024-04-08"));

			fetchStoriesSpy = jest.spyOn(storyblokUtils, "fetchStories");

			expectedParams = {
				page: 1,
				sort_by: "content.date:desc",
				...mockRequestParams.sbParams,
				filter_query: {
					date: {
						lt_date: new Date().toISOString(),
					},
				},
			};
		});

		afterEach(() => {
			// Clean up and restore original timers after each test
			jest.useRealTimers();
			jest.restoreAllMocks();
		});

		it("should call fetchStories with page being set to 1 when query object is empty", async () => {
			getStoryblokApi().get = jest
				.fn()
				.mockResolvedValue(MockMultipleStorySuccessResponse);
			await validateRouteParams(mockRequestParams);

			expect(fetchStoriesSpy).toHaveBeenCalled();

			expect(fetchStoriesSpy).toHaveBeenCalledWith("published", expectedParams);
		});

		it("should call fetchStories with the correct params when the query.page is greater than 1", async () => {
			const mockRequestParamsAtPage2 = {
				...mockRequestParams,
				query: {
					page: "2",
				},
			};

			const expectedParamsAtPage2 = {
				...expectedParams,
				page: 2,
			};

			await validateRouteParams(mockRequestParamsAtPage2);

			expect(fetchStoriesSpy).toHaveBeenCalled();
			expect(fetchStoriesSpy).toHaveBeenCalledWith(
				"published",
				expectedParamsAtPage2
			);
		});

		it("should return notFound when the query.page is not a number", async () => {
			const mockRequestParamsPageNaN = {
				...mockRequestParams,
				query: {
					page: "NaN",
				},
			};

			const result = await validateRouteParams(mockRequestParamsPageNaN);

			expect(result).toEqual({
				notFound: true,
			});
		});

		it("should return notFound when the query.page is less than 1", async () => {
			const mockRequestParamsPageLessThan1 = {
				...mockRequestParams,
				query: {
					page: "0",
				},
			};

			const result = await validateRouteParams(mockRequestParamsPageLessThan1);
			expect(result).toEqual({
				notFound: true,
			});
		});

		it("should return story data when fetchStories is successful", async () => {
			const result = await validateRouteParams(mockRequestParams);

			expect(result).toEqual({
				featuredStory: MockMultipleStorySuccessResponse.data.stories[0],
				stories: MockMultipleStorySuccessResponse.data.stories.slice(1),
				perPage: MockMultipleStorySuccessResponse.perPage,
				total: MockMultipleStorySuccessResponse.total,
				currentPage: 1,
			});
		});

		it("should call the logger info method when fetchStories returns no stories", async () => {
			const loggerInfoSpy = jest.spyOn(logger, "info");

			const mockNoStoriesResponse = {
				stories: [],
			};

			fetchStoriesSpy.mockResolvedValue(mockNoStoriesResponse);

			await validateRouteParams(mockRequestParams);

			expect(loggerInfoSpy).toHaveBeenCalled();

			expect(loggerInfoSpy).toHaveBeenCalledWith("No stories in result");
		});

		it("should call the logger error method when fetchStories throws an error", async () => {
			const loggerErrorSpy = jest.spyOn(logger, "error");

			const mockError = new Error("Error fetching stories", {
				cause: "test cause of error",
			});

			fetchStoriesSpy.mockRejectedValue(mockError);

			const throwErrorValiadateRouteParams = async () => {
				await validateRouteParams(mockRequestParams);
			};

			expect(throwErrorValiadateRouteParams).rejects.toThrow(
				GENERIC_ERROR_MESSAGE
			);

			await waitFor(() => {
				expect(loggerErrorSpy).toHaveBeenCalled();
				// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
				expect(loggerErrorSpy).toHaveBeenCalledWith(
					{
						errorMessage: "Error fetching stories",
						errorCause: "test cause of error",
						requestParams: {
							filter_query: { date: { lt_date: "2024-04-08T00:00:00.000Z" } },
							page: 1,
							per_page: 8,
							sort_by: "content.date:desc",
							starts_with: "news/articles/",
						},
					},
					`validateRouteParams: ${new Error(
						"Error fetching stories"
					)} in catch at slug 1`
				);
			});
		});
	});
});
