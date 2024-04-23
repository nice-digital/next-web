import { NextSeo } from "next-seo";
import React, { useMemo } from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";
import { Tag } from "@nice-digital/nds-tag";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { SoundCloudEmbed } from "@/components/SoundCloudEmbed/SoundCloudEmbed";
import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
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
	isError,
} from "@/utils/storyblok";

import styles from "./podcast.module.scss";

import type { GetServerSidePropsContext } from "next";

type PodcastPageErrorProps = {
	error: string;
};

type PodcastPageSuccessProps = {
	story: StoryblokStory<PodcastStoryblok>;
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
			return [];
		}
	}, [story]);

	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	const { story: storyData, breadcrumbs } = props;
	const { name, content } = storyData;
	const { date, description, soundcloudEmbedID } = content;

	const optimisedImage = content.image?.filename
		? constructStoryblokImageSrc(content.image?.filename)
		: undefined;
	// Fall back to podcast placeholder image if none is supplied
	const image = optimisedImage || defaultPodcastImage;

	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs>
			{[{ title: "Home", path: "/" }, ...breadcrumbs].map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	const meta = (
		<>
			<Tag outline>Podcast</Tag>
			<span className={styles.date}>{friendlyDate(date)}</span>
		</>
	);

	return (
		<>
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
				<p>
					Our NICE talks podcasts are available on a{" "}
					<a href="https://linktr.ee/nicetalks">
						variety of different platforms
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
	try {
		// Get the story and its breadcrumbs
		const storyResult = await fetchStory<PodcastStoryblok>(
			`news/podcasts/${slug}`,
			version
		);

		if ("notFound" in storyResult) {
			//TODO: logger here? - no slug provided
			//TODO: should we return a 404 here or throw and handle in the catch?
			return {
				notFound: true,
			};
		}

		const breadcrumbs = [
			{ title: "News", path: "/news" },
			{ title: "Podcasts", path: "/news/podcasts" },
			{ title: storyResult.story?.name },
		];

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
			},
		};

		return result;
	} catch (error) {
		return {
			props: {
				error: isError(error)
					? error.message
					: "Oops! Something went wrong and we're working to fix it. Please try again later.",
			},
		};
	}
}
