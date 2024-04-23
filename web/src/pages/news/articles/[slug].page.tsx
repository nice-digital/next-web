import {
	type ISbStoryData,
	StoryblokComponent,
	setComponents,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
import { StoryblokIframe } from "@/components/Storyblok/StoryblokIframe/StoryblokIframe";
import { StoryblokNewsArticle } from "@/components/Storyblok/StoryblokNewsArticle/StoryblokNewsArticle";
import { StoryblokRelatedLink } from "@/components/Storyblok/StoryblokRelatedLink/StoryblokRelatedLink";
import { StoryblokRelatedNewsLink } from "@/components/Storyblok/StoryblokRelatedNewsLink/StoryblokRelatedNewsLink";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { logger } from "@/logger";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { NewsArticleStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	isError,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

type NewsArticlePageErrorProps = {
	error: string;
};

type NewsArticlePageSuccessProps = {
	story: ISbStoryData<NewsArticleStoryblok>;
	breadcrumbs?: Breadcrumb[];
};

type NewsArticlePageProps =
	| NewsArticlePageSuccessProps
	| NewsArticlePageErrorProps;

//TODO: check if moving this out of the component improves performance
//TODO: Or, should this be in the component function and wrapped in a useMemo/useCallback?
setComponents({
	newsArticle: StoryblokNewsArticle,
	quote: Blockquote,
	relatedLink: StoryblokRelatedLink,
	relatedNewsLink: StoryblokRelatedNewsLink,
	youtubeEmbed: StoryblokYoutubeEmbed,
	iframe: StoryblokIframe,
});

export default function NewsArticlePage(
	props: NewsArticlePageProps
): React.ReactElement {
	//TODO: is this a suitable way to handle the story dependancy for useMemo?
	// story for meta tags, allows for additionalMetaTags to be fetched in useMemo
	const story = "story" in props ? props.story : null;

	const additionalMetaTags = useMemo(() => {
		if (story) {
			return getAdditionalMetaTags(story);
		} else {
			//TODO: logger here - unable to fetch additonalMeta?
			//TODO: should this be an empty array or undefined?
			return [];
		}
	}, [story]);

	if ("error" in props) {
		//TODO: should we redirect to a relevant in gssp instead of showing an error page content in situe?
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	// reassigning story to avoid TS error
	const { story: storyData, breadcrumbs } = props;

	const title = storyData.name;

	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<StoryblokComponent blok={storyData.content} breadcrumbs={breadcrumbs} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { query, params } = context;

	// Resolve slug from params
	const slug = getSlugFromParams(params?.slug);

	if (!slug) {
		//TODO: logger here? - no slug provided
		//TODO: should we return a 404 here or throw and handle in the catch?
		return {
			notFound: true,
		};
	}

	const version = getStoryVersionFromQuery(query);

	try {
		// Get the story and its breadcrumbs
		const storyResult = await fetchStory(`news/articles/${slug}`, version);

		if ("notFound" in storyResult) {
			//TODO: logger here? - no slug provided
			//TODO: should we return a 404 here or throw and handle in the catch?
			return {
				notFound: true,
			};
		}

		const breadcrumbs = [
			{ title: "News", path: "/news" },
			{ title: "News articles", path: "/news/articles" },
		];

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
			},
		};

		return result;
	} catch (error) {
		//TODO: logger here? - error fetching story
		//TODO: the current error message from error.message is not user friendly and exposes internal details
		return {
			props: {
				error: isError(error)
					? error.message
					: "Oops! Something went wrong and we're working to fix it. Please try again later.",
			},
		};
	}
}
