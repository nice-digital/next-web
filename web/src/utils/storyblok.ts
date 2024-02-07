import {
	apiPlugin,
	getStoryblokApi,
	storyblokInit,
	type ISbStoryParams,
	type ISbStoriesParams,
	type ISbResult,
	type ISbError,
	type ISbStoryData,
} from "@storyblok/react";
import { type MetaTag } from "next-seo/lib/types";

import { CardGrid } from "@/components/Storyblok/CardGrid/CardGrid";
import { CategoryNavigation } from "@/components/Storyblok/CategoryNavigation/CategoryNavigation";
import { Homepage } from "@/components/Storyblok/Homepage/Homepage";
import { HomepageHero } from "@/components/Storyblok/HomepageHero/HomepageHero";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { StoryblokHero } from "@/components/Storyblok/StoryblokHero/StoryblokHero";
import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
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
export type SBMultipleResponse = {
	stories: ISbStoryData[];
};

// Init connection to Storyblok
export const initStoryblok = (): void => {
	const components = {
		cardGrid: CardGrid,
		categoryNavigation: CategoryNavigation,
		homepage: Homepage,
		homepageHero: HomepageHero,
		hero: StoryblokHero,
		pageHeader: StoryblokPageHeader,
		metadata: Metadata,
	};

	try {
		const accessToken = publicRuntimeConfig.storyblok.previewAccessToken;

		storyblokInit({
			accessToken,
			use: [apiPlugin],
			apiOptions: {
				cache: {
					clear: "auto",
					type: "memory",
				},
			},
			components,
		});
	} catch (e) {
		logger.error("Error initialising Storyblok:", e);
	}
};

// Fetch a single story from the Storyblok API
// TODO: Fix the 404 response type
export const fetchStory = async <T>(
	slug: string,
	version: StoryVersion = "published",
	params: ISbStoryParams = {}
): Promise<SBSingleResponse<T>> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version,
		resolve_links: "url",
		cv: Date.now(), // Useful for flushing the Storyblok cache
		...params,
	};

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

// Fetch multiple stories from the Storyblok API
export const fetchStories = async (
	version: StoryVersion = "published",
	params: ISbStoriesParams = {}
): Promise<ISbStoryData[]> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version,
		resolve_links: "url",
		cv: Date.now(), // Useful for flushing the Storyblok cache
		...params,
	};

	let result = [];

	try {
		const response: ISbResult = await storyblokApi.get(`cdn/stories`, sbParams);
		result = response.data.stories;
	} catch (e) {
		const result = JSON.parse(e as string) as ISbError;
		Promise.reject(new Error(`${result.message}"`));

		logger.error(
			`${result.status} error from Storyblok API: ${result.message}`,
			e
		);
		throw Error(`${result.status} error from Storyblok API: ${result.message}`);
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
// something that can be plugged straight into an href attribute
export const resolveStoryblokLink = ({
	linktype,
	url,
	email,
	story,
}: MultilinkStoryblok): string | undefined => {
	switch (linktype) {
		case "url":
		case "asset":
			return url?.trim() || undefined;
		case "email":
			return email?.trim() ? `mailto:${email.trim()}` : undefined;
		case "story":
			return story?.full_slug ? `/${story.full_slug}` : undefined;
		default:
			return undefined;
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

// Resolve the slug object from the NextJS query params into a list of full
// slugs that we can use to build breadcrumbs, for example
export const getSlugHierarchyFromParams = (
	slugParams: string | string[] | undefined,
	prefix: string
): string[] => {
	if (!slugParams) {
		return [];
	}

	const hierarchy: string[] = [`${prefix}/`];

	if (Array.isArray(slugParams)) {
		for (let i = 0; i < slugParams.length - 1; i++) {
			let newSlug = `${prefix}/`;
			for (let j = 0; j <= i; j++) {
				newSlug = `${newSlug}${slugParams[j]}/`;
			}
			hierarchy.push(newSlug);
		}
	} else {
		hierarchy.push(`${prefix}/${slugParams}/`);
	}

	return hierarchy;
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
