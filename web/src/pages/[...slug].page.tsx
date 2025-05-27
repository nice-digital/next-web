import {
	setComponents,
	StoryblokComponent,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { BasicCardGrid } from "@/components/Storyblok/BasicCardGrid/BasicCardGrid";
import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
import { CardGridRow } from "@/components/Storyblok/CardGridRow/CardGridRow";
import { CardGridSection } from "@/components/Storyblok/CardGridSection/CardGridSection";
import { CardListSection } from "@/components/Storyblok/CardListSection/CardListSection";
import { CategoryLandingPage } from "@/components/Storyblok/CategoryLandingPage/CategoryLandingPage";
import { CategoryNavigation } from "@/components/Storyblok/CategoryNavigation/CategoryNavigation";
import { InfoPage } from "@/components/Storyblok/InfoPage/InfoPage";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { NestedRichText } from "@/components/Storyblok/NestedRichText/NestedRichText";
import { PromoBox } from "@/components/Storyblok/PromoBox/PromoBox";
import { StoryblokAccordion } from "@/components/Storyblok/StoryblokAccordion/StoryblokAccordion";
import { StoryblokAccordionGroup } from "@/components/Storyblok/StoryblokAccordionGroup/StoryblokAccordionGroup";
import { StoryblokActionBannerDefault } from "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBannerDefault";
import { StoryblokActionBannerFullWidth } from "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBannerFullWidth";
import { StoryblokCalloutCard } from "@/components/Storyblok/StoryblokCalloutCard/StoryblokCalloutCard";
import { StoryblokHero } from "@/components/Storyblok/StoryblokHero/StoryblokHero";
import { StoryblokIframe } from "@/components/Storyblok/StoryblokIframe/StoryblokIframe";
import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import { StoryblokTable } from "@/components/Storyblok/StoryblokTable/StoryblokTable";
import { StoryblokTestimonialFullWidth } from "@/components/Storyblok/StoryblokTestimonialFullWidth/StoryblokTestimonialFullWidth";
import { StoryblokTestimonialGridItem } from "@/components/Storyblok/StoryblokTestimonialGridItem/StoryblokTestimonialGridItem";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { logger } from "@/logger";

import {
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";


export default function SlugCatchAll(
	props: SlugCatchAllProps
): React.ReactElement {
	const story = "story" in props ? props.story : null;

	const additionalMetaTags = useMemo(() => {
		if (story) {
			return getAdditionalMetaTags(story);
		} else {
			logger.error(
				`Story is not available for additionalMetaTags in SlugCatchAllPage.`
			);
			return undefined;
		}
	}, [story]);

	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	const { story: storyData, breadcrumbs, siblingPages, component } = props;

	const commonComponents = {
		cardGrid: BasicCardGrid,
		metadata: Metadata,
		pageHeader: StoryblokPageHeader,
	};

	//TODO: add the rest of the components as we iterate through the page build
	const categoryLandingPageComponents = {
		categoryLandingPage: CategoryLandingPage,
		hero: StoryblokHero,
		actionBanner: StoryblokActionBannerFullWidth,
		actionBannerDefault: StoryblokActionBannerDefault,
		cardGridSection: CardGridSection,
		cardListSection: CardListSection,
		promoBox: PromoBox,
		calloutCard: StoryblokCalloutCard,
		calloutCardWithImage: StoryblokCalloutCard,
		testimonialFullWidth: StoryblokTestimonialFullWidth,
		testimonialGridItem: StoryblokTestimonialGridItem,
	};

	const infoPageComponents = {
		accordion: StoryblokAccordion,
		accordionGroup: StoryblokAccordionGroup,
		actionBannerDefault: StoryblokActionBannerDefault,
		cardGridRowBasic: CardGridRow,
		cardGridRowCallout: CardGridRow,
		cardGridRowCalloutWithImage: CardGridRow,
		hero: StoryblokHero,
		iframe: StoryblokIframe,
		infoPage: InfoPage,
		nestedRichText: NestedRichText,
		nestedTable: StoryblokTable,
		quote: Blockquote,
		testimonialGridItem: StoryblokTestimonialGridItem,
		youtubeEmbed: StoryblokYoutubeEmbed,
	};

	const components = {
		...commonComponents,
		...(component === "infoPage"
			? infoPageComponents
			: component === "categoryLandingPage"
			? categoryLandingPageComponents
			: { categoryNavigation: CategoryNavigation }),
	};

	setComponents(components);

	const title = storyData.name;

	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo><h1>Root catch all route</h1>
			<StoryblokComponent
				blok={storyData.content}
				breadcrumbs={breadcrumbs}
				siblingPages={siblingPages}
			/>
		</>
	);
}

export const getServerSideProps = getCorporateContentGssp("");

// export async function getServerSideProps(context: GetServerSidePropsContext) {
// 	// Bail out early unless this route is enabled for this environment
// 	// if (publicRuntimeConfig.storyblok.enableRootCatchAll.toString() !== "true") {
// 	// 	return {
// 	// 		notFound: true,
// 	// 	};
// 	// }

// 	const { query, params } = context;

// 	// Resolve slug from params
// 	const slug = getSlugFromParams(params?.slug);

// 	if (!slug) {
// 		return {
// 			notFound: true,
// 		};
// 	}

// 	try {
// 		const version = getStoryVersionFromQuery(query);

// 		// Get the story and its breadcrumbs
// 		const [storyResult, breadcrumbs] = await Promise.all([
// 			fetchStory<CategoryNavigationStoryblok | InfoPageStoryblok>(
// 				slug,
// 				version
// 			),
// 			getBreadcrumbs(slug, version),
// 		]);

// 		// will return a 404 if the story is not found
// 		if ("notFound" in storyResult) {
// 			// { storyResult },
// 			logger.error(
// 				`Story not found for slug: ${slug} in root [...slug] catch all.`
// 			);
// 			return storyResult;
// 		}
// 		if ("notFound" in storyResult) return storyResult;

// 		const siblingPages = [];

// 		const component = storyResult.story?.content?.component;
// 		// TODO: Use the Storyblok Links API to build a map of sibling & optionally child pages
// 		if (component === "infoPage") {
// 			siblingPages.push(...["page1", "page2"]);
// 		}

// 		const result = {
// 			props: {
// 				...storyResult,
// 				breadcrumbs,
// 				siblingPages,
// 				component,
// 			},
// 		};

// 		return result;
// 	} catch (error) {
// 		// {
// 		// 	errorCause: error instanceof Error && error.cause,
// 		// 	requestHeaders: context.req.headers,
// 		// },
// 		logger.error(
// 			`Error fetching story for slug: ${slug} in SlugCatchAll page getServerSideProps.`
// 		);
// 		return {
// 			props: {
// 				error: GENERIC_ERROR_MESSAGE,
// 			},
// 		};
// 	}
// }
