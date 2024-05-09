import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { mockPodcastPage } from "@/test-utils/storyblok-data";
import * as storyblokUtils from "@/utils/storyblok";

import PodcastPage, { getServerSideProps } from "./[slug].page";

const mockPodcast = {
	...mockPodcastPage,
};

const mockBreadcrumbs = [
	{ title: "News", path: "/news" },
	{ title: "Podcasts", path: "/news/podcasts" },
];

describe("PodcastPage", () => {
	it("renders the page", () => {
		render(
			<PodcastPage story={mockPodcastPage} breadcrumbs={mockBreadcrumbs} />
		);

		expect(document.body).toMatchSnapshot();
	});

	it("should not render the breadcrumbs if none are provided", () => {
		render(<PodcastPage story={mockPodcastPage} />);

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
			<PodcastPage story={storyWithoutImage} breadcrumbs={mockBreadcrumbs} />
		);

		expect(document.body).toMatchSnapshot();
	});

	describe("getServerSideProps", () => {
		let fetchStorySpy: jest.SpyInstance;
		beforeEach(() => {
			fetchStorySpy = jest.spyOn(storyblokUtils, "fetchStory");
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
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ notFound: true });
		});

		it("should return an error if fetchStory returns an error", async () => {
			const errorMessage = "An error occurred";
			fetchStorySpy.mockRejectedValue(new Error(errorMessage));
			const context = {
				query: {},
				params: { slug: "test-slug" },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ props: { error: errorMessage } });
		});

		it("should return a generic error message if fetchStory returns an error without a message", async () => {
			const errorMessage = "An error occurred";
			fetchStorySpy.mockRejectedValue(errorMessage);

			const context = {
				query: {},
				params: { slug: "test-slug" },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);
			expect(result).toEqual({
				props: {
					error:
						"Oops! Something went wrong and we're working to fix it. Please try again later.",
				},
			});
		});

		it("should return the story and breadcrumbs", async () => {
			fetchStorySpy.mockResolvedValue({ story: mockPodcast });
			const context = {
				query: {},
				params: { slug: "test-slug" },
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
