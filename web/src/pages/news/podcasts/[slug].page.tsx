import { NextSeo } from "next-seo";
import React, { useMemo } from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";
import { Tag } from "@nice-digital/nds-tag";

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
	encodeParens,
} from "@/utils/storyblok";

import styles from "./podcast.module.scss";

import type { GetServerSidePropsContext } from "next";

interface PodcastPageProps {
	story: StoryblokStory<PodcastStoryblok>;
	breadcrumbs?: TypeBreadcrumb[];
}

export default function PodcastPage({
	story,
	breadcrumbs,
}: PodcastPageProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);

	const { name, content } = story;
	const { date, description, soundcloudEmbedID } = content;

	const optimisedImage = encodeParens(
		`${content.image?.filename}/m/filters:quality(80)`
	);
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

	if (slug) {
		const version = getStoryVersionFromQuery(query);

		// Get the story and its breadcrumbs
		const storyResult = await fetchStory<PodcastStoryblok>(
			`news/podcasts/${slug}`,
			version
		);

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
	} else {
		return {
			notFound: true,
		};
	}
}
