import { ParsedUrlQuery } from "querystring";

import {
	getStoryblokApi,
	type ISbStoryParams,
	type ISbStoriesParams,
	type ISbResult,
	type ISbError,
	type ISbStoryData,
} from "@storyblok/react";
import { type MetaTag } from "next-seo/lib/types";
import { Redirect } from "next/types";

import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { type SBLink } from "@/types/SBLink";
import { type MultilinkStoryblok } from "@/types/storyblok";

export type StoryVersion = "draft" | "published" | undefined;

export type SBSingleResponse<T> = {
	story?: ISbStoryData<T>;
	notFound?: boolean;
};

export type SBMultipleResponse<T> = {
	stories: ISbStoryData<T>[];
	perPage?: number;
	total?: number;
	error?: string;
};

// News type enum
export const newsTypes = {
	newsArticle: "News",
	blogPost: "Blogs",
	podcast: "Podcasts",
	inDepthArticle: "In-depth",
};

// Are we using the Ocelot cache?
// If not, then we can assume we're not in production and can just request the latest version of the content
export const usingOcelotCache = !!process.env.STORYBLOK_OCELOT_ENDPOINT;

// Default podcast image
export const defaultPodcastImage =
	publicRuntimeConfig.publicBaseURL + "/img/nice-talks.png";

// Fetch a single story from the Storyblok API
export const fetchStory = async <T>(
	slug: string,
	version: StoryVersion = "published",
	params: ISbStoryParams = {}
): Promise<SBSingleResponse<T>> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version,
		resolve_links: "url",
		...params,
	};

	if (!usingOcelotCache) {
		sbParams.cv = Date.now();
	}

	let result = null;

	try {
		const response: ISbResult = await storyblokApi.get(
			`cdn/stories/${slug}`,
			sbParams
		);

		result = {
			story: response.data.story,
		};
	} catch (e) {
		const result = JSON.parse(e as string) as ISbError;
		logger.error(
			`${result.status} error from Storyblok API: ${result.message}`,
			e
		);
		if (result.status === 404) {
			return {
				notFound: true,
			};
		} else {
			throw Error(
				`${result.status} error from Storyblok API: ${result.message}`
			);
		}
	}

	return result;
};

export type ValidateRouteParamsArgs = {
	query: ParsedUrlQuery;
	sbParams?: ISbStoriesParams;
	resolvedUrl?: string;
};

export type ValidateRouteParamsSuccess<T> = {
	featuredStory: ISbStoryData<T> | null;
	stories: ISbStoryData<T>[];
	total: number;
	currentPage: number;
	perPage: number | undefined;
};

export type ValidateRouteParamsError = {
	error: string;
};

export type ValidateRouteParamsResult<T> =
	| { notFound: true }
	| { redirect: Redirect }
	| ValidateRouteParamsSuccess<T>
	| ValidateRouteParamsError;

export const validateRouteParams = async <T>({
	query,
	sbParams,
	resolvedUrl,
}: ValidateRouteParamsArgs): Promise<ValidateRouteParamsResult<T>> => {
	const version = getStoryVersionFromQuery(query);
	const page = Number(query.page) || 1;

	// const { starts_with, per_page } = options;
	const requestParams: ISbStoriesParams = {
		...sbParams,
		page,
		sort_by: "content.date:desc",
		filter_query: {
			date: {
				lt_date: new Date().toISOString(),
			},
		},
	};

	const redirectUrl = new URL(resolvedUrl || "", "http://localhost");

	const result = await fetchStories<T>(version, requestParams);

	if (
		!result ||
		result.total === undefined ||
		(result.total === 0 && result.stories.length === 0)
	) {
		logger.error("Error fetching stories: ", result);
		return {
			error:
				"There are no stories to display at the moment. Please try again later.",
		};
	}

	let featuredStory = null;
	let stories = result.stories;

	const { total, perPage } = result;

	if (page === 1 && stories.length > 0) {
		featuredStory = result.stories[0]; // Set featured story on page 1
		stories = stories.slice(1); // Skip first story on page 1 as it's featured
	}

	// redirect to page 1 if page is out of range
	if (page && perPage && page > Math.ceil(total / perPage)) {
		return {
			redirect: {
				destination: redirectUrl.pathname,
				permanent: false,
			},
		};
	}

	return {
		featuredStory,
		stories,
		total,
		currentPage: page,
		perPage,
	};
};

// Fetch multiple stories from the Storyblok API
export const fetchStories = async <T>(
	version: StoryVersion = "published",
	params: ISbStoriesParams = {}
): Promise<SBMultipleResponse<T>> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version,
		resolve_links: "url",
		...params,
	};

	if (!usingOcelotCache) {
		sbParams.cv = Date.now();
	}

	const result: SBMultipleResponse<T> = { stories: [] };

	try {
		const response: ISbResult = await storyblokApi.get(`cdn/stories`, sbParams);
		result.stories = response.data.stories;
		result.perPage = response.perPage;
		result.total = response.total;
	} catch (e) {
		const errorResponse = JSON.parse(e as string) as ISbError;

		result.error = errorResponse.message?.message;
		Promise.reject(new Error(`${errorResponse.message}"`));

		logger.error(
			`${errorResponse.status} error from Storyblok API: ${errorResponse.message}`,
			e
		);
		throw Error(
			`${errorResponse.status} error from Storyblok API: ${errorResponse.message}`
		);
	}

	return result;
};

// Fetch an array of links from the links endpoint
export const fetchLinks = async (
	version: StoryVersion,
	startsWith?: string
): Promise<SBLink[]> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version: version || "published",
		// cv: Date.now(), // Useful for flushing the Storyblok cache
	};

	if (startsWith) {
		sbParams.starts_with = startsWith;
	}

	let result = null;

	try {
		const links: SBLink[] = await storyblokApi.getAll("cdn/links", sbParams);
		result = links;
	} catch (e) {
		const result = JSON.parse(e as string) as ISbError;
		logger.error(
			`${result.status} error from Storyblok API: ${result.message}`,
			e
		);
		throw Error(`${result.status} error from Storyblok API: ${result.message}`);
	}

	return result;
};

// Take a slug and generate breadcrumbs from it using the links API
export const getBreadcrumbs = async (
	slug: string,
	version?: string
): Promise<Breadcrumb[]> => {
	const topSlug = slug.substring(0, slug.indexOf("/")); // Slug of highest level parent
	const linksResult = await fetchLinks(
		(version as StoryVersion) || "published",
		topSlug
	);

	const breadcrumbs: Breadcrumb[] = [];

	if (linksResult) {
		const links = linksResult as SBLink[];

		// Get item with current slug, add it to the array
		let thisPage = links.find((l) => l.slug === slug);
		breadcrumbs.push({
			title: thisPage?.name as string,
		});

		// Get current item's parent_id
		let parentId = thisPage?.parent_id;
		if (parentId) {
			// If it has a parent_id, get item with that ID & keep moving upwards
			do {
				thisPage = links.find((l) => l.id === parentId);
				breadcrumbs.push({
					title: thisPage?.name as string,
					path: thisPage?.real_path,
				});
				parentId = thisPage?.parent_id;
			} while (parentId);

			// Flip the order so we've got the top page first
			breadcrumbs.reverse();
		}
	}

	return breadcrumbs;
};

// Resolve a link object returned from the Storyblok API, so that it returns
// a) something that can be plugged straight into an href attribute, and
// b) a boolean that indicates whether it's an internal link or not, so
// we can use the NextJS Link component to render it
export const resolveStoryblokLink = ({
	linktype,
	url,
	cached_url,
	email,
}: MultilinkStoryblok): { url: string | undefined; isInternal: boolean } => {
	switch (linktype) {
		case "url":
		case "asset":
			return {
				url: url?.trim() || cached_url?.trim() || undefined,
				isInternal: false,
			};
		case "email":
			return {
				url: email?.trim() ? `mailto:${email.trim()}` : undefined,
				isInternal: false,
			};
		case "story":
			return {
				url: url?.trim() || cached_url?.trim() || undefined,
				isInternal: true,
			};
		default:
			return {
				url: undefined,
				isInternal: false,
			};
	}
};

// Figure out whether we're requesting the draft or published version,
// depending on the existence of the _storyblok query parameter
export const getStoryVersionFromQuery = (query?: {
	_storyblok?: string;
}): StoryVersion => {
	return (query && query._storyblok) === "" ? "draft" : "published";
};

// Resolve the slug object from the NextJS query params into a full slug that we
// can use to request content from the Storyblok API
export const getSlugFromParams = (
	slugParams: string | string[] | undefined
): string | undefined => {
	if (!slugParams) {
		return undefined;
	}

	return Array.isArray(slugParams) ? slugParams.join("/") : slugParams;
};

// Get metadata that can be derived from the Storyblok response
// e.g. DC.Issued, DC.Modified
export const getAdditionalMetaTags = (story: ISbStoryData): MetaTag[] => {
	const additionalMetaTags = [
		{ name: "DC.Issued", content: story?.created_at || "" },
		{
			name: "DC.Modified",
			content: story?.published_at || story?.created_at || "",
		},
	];
	return additionalMetaTags;
};

// Turn a Storyblok date string (yyyy-mm-dd hh:ss) into a friendly date
export const friendlyDate = (date: string): string => {
	const formatter = new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	return formatter.format(new Date(date));
};

// Get the news type from a Storyblok story's component prop
export const getNewsType = (component: string): string => {
	switch (component) {
		case "blogPost":
			return newsTypes.blogPost;
		case "podcast":
			return newsTypes.podcast;
		case "inDepthArticle":
			return newsTypes.inDepthArticle;
		case "newsArticle":
		default:
			return newsTypes.newsArticle;
	}
};

// this is a helper function to encode parens in the image url in background-image
// this is a workaround for a bug for how we handle storyblok image service in the frontend
export const encodeParens = (str: string): string =>
	str.replace(/\(/g, "%28").replace(/\)/g, "%29");

// TODO: extend the ImageServiceOptions to include filters and options as and when needed?

export type ImageServiceOptions = {
	width?: number;
	height?: number;
	quality?: number;
	smart?: boolean;
};

// Construct the image src for the Storyblok image service with limited options.
// We can extend this to include more options as and when needed
export const constructStoryblokImageSrc = (
	src: string,
	serviceOptions?: ImageServiceOptions | undefined,
	format?: "webp" | "avif" | "jpeg"
): string => {
	// append /m/ to use automatic webp detection.
	// If the browser supports webp, it will use webp
	// /m/ is also required for the Storyblok image service to work.
	let url = `${src}/m/`;

	/* the width and height can be set to static {width}x{height}
	   or proportional to width or height{width}x0 or 0x{height}
	   setting width 0 and height 0 has no effect and will serve the image at it's original size*/
	if (serviceOptions?.width || serviceOptions?.height) {
		url += `${serviceOptions.width || 0}x${serviceOptions.height || 0}/`;
	}

	/* smart provides a facial detection when cropping or resizing an image
	   this is useful for bio and author images qwhen we want to focus on a face */
	if (serviceOptions?.smart) {
		url += `smart/`;
	}

	const filters = [];

	// format can be webp, avif or jpeg
	if (format) {
		filters.push(`format(${format})`);
	}

	// lets us set the quality of the image for optimisation
	if (serviceOptions?.quality) {
		filters.push(`quality(${serviceOptions.quality})`);
	} else {
		filters.push(`quality(80)`);
	}

	// if filters are set, add them to the url and separate them with a colon which is required
	if (filters.length) {
		url += `filters:${filters.join(":")}`;
	}

	return encodeParens(url);
};
