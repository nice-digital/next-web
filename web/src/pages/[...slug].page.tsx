// @ts-nocheck
import {
	setComponents,
	StoryblokComponent,
	type ISbStoryData,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { BasicCardGrid } from "@/components/Storyblok/BasicCardGrid/BasicCardGrid";
import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
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
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { type Breadcrumb } from "@/types/Breadcrumb";
import {
	CategoryNavigationStoryblok,
	InfoPageStoryblok,
} from "@/types/storyblok";
import {
	fetchStory,
	GENERIC_ERROR_MESSAGE,
	getAdditionalMetaTags,
	getBreadcrumbs,
	getSlugFromParams,
	getStoryVersionFromQuery,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type SlugCatchAllSuccessProps = {
	story: ISbStoryData<InfoPageStoryblok | CategoryNavigationStoryblok>;
	breadcrumbs: Breadcrumb[];
	siblingPages?: string[];
	component: string;
};

export type SlugCatchAllErrorProps = {
	error: string;
};

export type SlugCatchAllProps =
	| SlugCatchAllSuccessProps
	| SlugCatchAllErrorProps;

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

	const {
		story: storyData,
		breadcrumbs,
		siblingPages,
		component,
		parentChildTreeArray,
		parentAndSiblingsElse,
		slug,
	} = props;

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
		hero: StoryblokHero,
		iframe: StoryblokIframe,
		infoPage: InfoPage,
		nestedRichText: NestedRichText,
		quote: Blockquote,
		youtubeEmbed: StoryblokYoutubeEmbed,
		actionBannerDefault: StoryblokActionBannerDefault,
		nestedTable: StoryblokTable,
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
			></NextSeo>
			<StoryblokComponent
				blok={storyData.content}
				breadcrumbs={breadcrumbs}
				siblingPages={siblingPages}
				parentChildTreeArray={parentChildTreeArray}
				parentAndSiblingsElse={parentAndSiblingsElse}
				slug={slug}
			/>
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// Bail out early unless this route is enabled for this environment
	if (publicRuntimeConfig.storyblok.enableRootCatchAll.toString() !== "true") {
		return {
			notFound: true,
		};
	}

	const { query, params } = context;

	// Resolve slug from params
	const slug = getSlugFromParams(params?.slug);

	if (!slug) {
		return {
			notFound: true,
		};
	}

	try {
		const version = getStoryVersionFromQuery(query);

		// Get the story and its breadcrumbs
		const [storyResult, breadcrumbs] = await Promise.all([
			fetchStory<CategoryNavigationStoryblok | InfoPageStoryblok>(
				slug,
				version
			),
			getBreadcrumbs(slug, version),
		]);

		// will return a 404 if the story is not found
		if ("notFound" in storyResult) {
			// { storyResult },
			logger.error(
				`Story not found for slug: ${slug} in root [...slug] catch all.`
			);
			return storyResult;
		}
		if ("notFound" in storyResult) return storyResult;

		const siblingPages = [];

		const parentID = storyResult.story?.parent_id;
		const isRootPage = storyResult.story?.is_startpage;

		console.log("slug from querystring:", slug);
		const token = publicRuntimeConfig.storyblok.accessToken;
		const res = await fetch(
			`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${parentID}`
		);
		const data = await res.json();
		const siblings = data.links;
		const startsWithres = await fetch(
			`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=${slug}`
		);
		const startsWithData = await startsWithres.json();
		const startsWith = startsWithData.links;
		const currentFolder = Object.values(startsWith).find(
			(item) => item.is_folder && item.slug === slug
		);

		let parentAndSiblings = {};
		let parentFetchTime = 0;
		let parentDataSize = 0;
		let parentCount = 0;
		if (currentFolder && currentFolder.parent_id) {
			const parentFetchStart = performance.now();

			const parentRes = await fetch(
				`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${currentFolder.parent_id}`
			);
			const parentData = await parentRes.json();
			parentAndSiblings = parentData.links;
			parentFetchTime = performance.now() - parentFetchStart;
			parentDataSize = JSON.stringify(parentData.links).length;
			parentCount = Object.keys(parentData.links).length;
		} else {
			parentAndSiblings = siblings;
		}
		const linksArray = Object.values(siblings);
		let startsWithElse = {};
		let parentAndSiblingsElse = {};
		const parentAndSiblingsArray = Object.values(parentAndSiblings);
		const parentChildTreeArray = await Promise.all(
			parentAndSiblingsArray.map(async (parent) => {
				const children = linksArray.filter((childLink) => {
					const isChild =
						childLink.parent_id === parent.id && !childLink.is_startpage;

					return isChild;
				});

				if (children.length > 0) {
					parent.childLinks = children;
				} else {
					parent.childLinks = [];
					if (parent.slug === slug) {
						console.log("inside parent.slug===slug");
						console.log("storyResults", isRootPage);
						const noChildSlug = isRootPage
							? slug
							: slug.split("/").slice(0, -1).join("/");

						const startsWithres = await fetch(
							`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=${noChildSlug}&per_page=1000`
						);
						const startsWithData = await startsWithres.json();
						startsWithElse = startsWithData.links;
						console.log("noChildSlug", noChildSlug);
						const currentFolder = Object.values(startsWithElse).find((item) => {
							return item.is_folder && item.slug === noChildSlug;
						});
						console.log("currentFOlder", currentFolder);
						if (currentFolder && currentFolder.parent_id) {
							console.log("Inside current folder condn");
							const parentRes = await fetch(
								`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${currentFolder.parent_id}&per_page=1000`
							);
							const parentData = await parentRes.json();
							parentAndSiblingsElse = parentData.links;
							Object.values(parentAndSiblingsElse).map((parentelse) => {
								const children = Object.values(linksArray).filter(
									(childLink) => {
										const isChild =
											childLink.parent_id === parentelse.id &&
											!childLink.is_startpage;

										return isChild;
									}
								);
								// console.log("children", children);
								parentelse.childLinks = children;
								// parentelse.activename = "smoking-cession";
								if (children.length > 0) {
									parentelse.childLinks = children;
								} else {
									parentelse.childLinks = [];
								}
							});
						} else {
							parentAndSiblingsElse = siblings;
						}
					} else {
						console.log("inside else parent.slug===slug");
					}
				}
				//TODO: if there are no children, render siblings and parent-level items (i.e. same nav structure as when on parent page)

				return parent;
			})
		);
		const component = storyResult.story?.content?.component;
		// TODO: Use the Storyblok Links API to build a map of sibling & optionally child pages
		if (component === "infoPage") {
			siblingPages.push();
		}

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
				siblingPages,
				component,
				parentChildTreeArray,

				siblings: Object.values(siblings),
				startsWith: Object.values(startsWith),
				parentAndSiblingsArray: Object.values(parentAndSiblings),
				startsWithElse: Object.values(startsWithElse),
				parentAndSiblingsElse: Object.values(parentAndSiblingsElse),
				slug,
			},
		};

		return result;
	} catch (error) {
		// {
		// 	errorCause: error instanceof Error && error.cause,
		// 	requestHeaders: context.req.headers,
		// },
		logger.error(
			`Error fetching story for slug: ${slug} in SlugCatchAll page getServerSideProps.`
		);
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
}
