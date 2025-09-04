import { type ISbStoryData } from "@storyblok/react";
import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { logger } from "@/logger";
import { mockCvValue, mockPodcastPage } from "@/test-utils/storyblok-data";
import MockServerErrorResponse from "@/test-utils/storyblok-server-error-response.json";
import { PodcastStoryblok } from "@/types/storyblok";
import * as storyblokUtils from "@/utils/storyblok";
import { GENERIC_ERROR_MESSAGE } from "@/utils/storyblok";

import PodcastPage, { getServerSideProps } from "./[slug].page";

const mockPodcast = {
	...mockPodcastPage,
};

const mockBreadcrumbs = [
	{ title: "Home", path: "/" },
	{ title: "News", path: "/news" },
	{ title: "Podcasts", path: "/news/podcasts" },
];

describe("PodcastPage", () => {
	it("renders the page", () => {
		render(
			<PodcastPage
				story={mockPodcastPage as ISbStoryData<PodcastStoryblok>}
				breadcrumbs={mockBreadcrumbs}
			/>
		);

		expect(document.body).toMatchSnapshot();
	});

	it("should not render the breadcrumbs if none are provided", () => {
		render(
			<PodcastPage story={mockPodcastPage as ISbStoryData<PodcastStoryblok>} />
		);

		const breadcrumbs = screen.queryByRole("navigation", {
			name: "Breadcrumbs",
		});

		expect(breadcrumbs).not.toBeInTheDocument();
	});

	it("should render error page if fetchStory returns error", async () => {
		const errorMessage = "An error returned from getserversideprops";
		const { asFragment } = render(<PodcastPage error={errorMessage} />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a fallback image if no image is provided", () => {
		const storyWithoutImage = {
			...mockPodcast,
			content: {
				...mockPodcast.content,
				image: {
					id: 123,
					filename: "",
					name: "",
					alt: "Podcast image",
				},
			},
		};

		render(
			<PodcastPage
				story={storyWithoutImage as ISbStoryData<PodcastStoryblok>}
				breadcrumbs={mockBreadcrumbs}
			/>
		);

		expect(document.body).toMatchSnapshot();
	});

	describe("getServerSideProps", () => {
		let fetchStorySpy: jest.SpyInstance;
		let getBreadCrumbsSpy: jest.SpyInstance;
		beforeEach(() => {
			fetchStorySpy = jest.spyOn(storyblokUtils, "fetchStory");
			getBreadCrumbsSpy = jest.spyOn(storyblokUtils, "getBreadcrumbs");
			jest
				.spyOn(storyblokUtils, "fetchCacheVersion")
				.mockResolvedValue(mockCvValue);
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it("returns notFound if no slug is provided", async () => {
			const context = { query: {}, params: {} } as GetServerSidePropsContext;
			const result = await getServerSideProps(context);
			expect(result).toEqual({ notFound: true });
		});

		it("should return notFound when fetchStory returns notFound", async () => {
			fetchStorySpy.mockResolvedValue({ notFound: true });
			const context = {
				query: {},
				params: { slug: "slug-does-not-exist" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ notFound: true });
		});

		it("should log error if fetchStory returns error if 503", async () => {
			expect(jest.isMockFunction(logger.error)).toBe(true);
			const mockErrorMessage =
				"There was an error fetching this story. Please try again later.";
			const mockCatchError = new Error(mockErrorMessage, {
				cause: MockServerErrorResponse,
			});
			fetchStorySpy.mockRejectedValueOnce(mockCatchError);

			const mockContext = {
				query: {},
				params: { slug: "some-erroring-page" },
				req: {
					headers: {
						"cache-control":
							"public, s-maxage=300, max-age=120, stale-while-revalidate=1800",
					},
				},
			} as unknown as GetServerSidePropsContext;

			await getServerSideProps(mockContext);

			expect(logger.error).toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				// {
				// 	"Cache-Control-Request": mockContext.req.headers["cache-control"],
				// 	errorCause: MockServerErrorResponse,
				// 	requestHeaders: mockContext.req.headers,
				// },
				`Error fetching podcast at path ${mockContext.params?.slug} from gssp`
			);
		});

		it("should return an error if fetchStory returns an error", async () => {
			const errorMessage = "An error occurred";
			fetchStorySpy.mockRejectedValue(new Error(errorMessage));
			const context = {
				query: {},
				params: { slug: "test-slug" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ props: { error: GENERIC_ERROR_MESSAGE } });
		});

		it("should return a generic error message if fetchStory returns an error without a message", async () => {
			const errorMessage = "An error occurred";
			fetchStorySpy.mockRejectedValue(errorMessage);

			const context = {
				query: {},
				params: { slug: "test-slug" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);
			expect(result).toEqual({
				props: {
					error: GENERIC_ERROR_MESSAGE,
				},
			});
		});

		it("should return the story and breadcrumbs", async () => {
			fetchStorySpy.mockResolvedValue({ story: mockPodcast });
			getBreadCrumbsSpy.mockResolvedValue(mockBreadcrumbs);
			const context = {
				query: {},
				params: { slug: "test-slug" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({
				props: {
					story: mockPodcast,
					breadcrumbs: mockBreadcrumbs,
				},
			});
		});
	});
});
