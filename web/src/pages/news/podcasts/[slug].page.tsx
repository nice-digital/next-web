import { type ISbStoryData } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";
import { Tag } from "@nice-digital/nds-tag";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { SoundCloudEmbed } from "@/components/SoundCloudEmbed/SoundCloudEmbed";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { logger } from "@/logger";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { PodcastStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	friendlyDate,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	defaultPodcastImage,
	constructStoryblokImageSrc,
	GENERIC_ERROR_MESSAGE,
	getBreadcrumbs,
} from "@/utils/storyblok";

import styles from "./podcast.module.scss";

import type { GetServerSidePropsContext } from "next";

type PodcastPageErrorProps = {
	error: string;
};

type PodcastPageSuccessProps = {
	story: ISbStoryData<PodcastStoryblok>;
	breadcrumbs?: TypeBreadcrumb[];
};

type PodcastPageProps = PodcastPageSuccessProps | PodcastPageErrorProps;

export default function PodcastPage(
	props: PodcastPageProps
): React.ReactElement {
	const story = "story" in props ? props.story : null;

	const additionalMetaTags = useMemo(() => {
		if (story) {
			return getAdditionalMetaTags(story);
		} else {
			logger.error(
				`Story is not available for additionalMetaTags in PodcastPage.`
			);
			return [];
		}
	}, [story]);

	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	const { story: storyData, breadcrumbs } = props;
	const { name, content } = storyData;
	const { date, description, soundcloudEmbedID, metadata } = content;

	const optimisedImage = content.image?.filename
		? constructStoryblokImageSrc(content.image?.filename)
		: undefined;
	// Fall back to podcast placeholder image if none is supplied
	const image = optimisedImage || defaultPodcastImage;

	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs>
			{breadcrumbs.map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	const meta = (
		<>
			<Tag outline>Podcasts</Tag>
			<span className={styles.date}>{friendlyDate(date)}</span>
		</>
	);

	return (
		<>
			{metadata && metadata.length > 0 && <Metadata blok={metadata[0]} />}
			<NextSeo
				title={name}
				openGraph={{ title: name }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>

			<Hero
				title={name}
				header={BreadcrumbComponent}
				image={image}
				actions={meta}
			/>

			<div className={styles.content}>
				<h2>Listen</h2>
				<SoundCloudEmbed id={soundcloudEmbedID} />
				{description && (
					<>
						<h2>About this episode</h2>
						<StoryblokRichText content={description} />
					</>
				)}
				<h2>Other ways to listen</h2>
				<p>
					Our NICE talks podcasts are available{" "}
					<a href="https://linktr.ee/nicetalks">
						on a variety of different platforms
					</a>
					.
				</p>
			</div>
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { query, params } = context;
	const slug = getSlugFromParams(params?.slug);

	if (!slug) {
		return {
			notFound: true,
		};
	}

	const version = getStoryVersionFromQuery(query);
	const pagePath = `news/podcasts/${slug}`;

	logger.info("Fetching podcast from storyblok at path", params?.slug);

	try {
		// Get the story and its breadcrumbs
		const [storyResult, breadcrumbs] = await Promise.all([
			fetchStory<PodcastStoryblok>(pagePath, version),
			getBreadcrumbs(pagePath, version),
		]);

		logger.info(
			{
				data: storyResult,
				requestHeaders: context.req.headers,
			},
			`Fetched podcast from storyblok at path: ${slug}`
		);

		if ("notFound" in storyResult) {
			return {
				notFound: true,
			};
		}

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
			},
		};

		return result;
	} catch (error) {
		// {
		// 	"Cache-Control-Request": context.req.headers["cache-control"],
		// 	errorCause: error instanceof Error && error.cause,
		// 	requestHeaders: context.req.headers,
		// },
		logger.error(`Error fetching podcast at path ${slug} from gssp`);
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
}
