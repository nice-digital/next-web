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

type Link = {
	childLinks?: Link[];
	id: string;
	slug: string;
	parent_id: string;
	is_folder: boolean;
	is_startpage: boolean;
};
export type SlugCatchAllSuccessProps = {
	story: ISbStoryData<InfoPageStoryblok | CategoryNavigationStoryblok>;
	breadcrumbs: Breadcrumb[];
	component: string;
	parentChildLinksTreeArray: Link[];
	parentAndSiblingLinksElse: Link[];
	slug: string;
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
		component,
		parentChildLinksTreeArray,
		parentAndSiblingLinksElse,
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
				parentChildLinksTreeArray={parentChildLinksTreeArray}
				parentAndSiblingLinksElse={parentAndSiblingLinksElse}
				slug={slug}
			/>
		</>
	);
}
const fetchLinksFromStoryblok = async (
	token: string,
	queryParams: Record<string, string>
) => {
	const queryString = new URLSearchParams(queryParams).toString();
	const res = await fetch(
		`https://api.storyblok.com/v2/cdn/links?${queryString}`
	);
	const data = await res.json();
	return data.links;
};
const fetchParentAndSiblingLinks = async (
	token: string,
	parentID: string,
	slug: string
) => {
	// Fetch sibling links first
	const siblingsLinks = await fetchLinksFromStoryblok(token, {
		version: "published",
		token,
		with_parent: parentID || "",
		per_page: "1000",
	});
	const parentAndSiblingLinks = await reUseFetchingLogic(
		token,
		slug,
		siblingsLinks
	);
	return { siblingsLinks, parentAndSiblingLinks };
};
const reUseFetchingLogic = async (
	token: string,
	slug: string,
	siblingsLinks: Link[],
	secondIteration?: boolean
) => {
	const startsWithLinks: { [key: string]: Link } =
		await fetchLinksFromStoryblok(token, {
			version: "published",
			token,
			starts_with: slug,
			per_page: "1000",
		});

	const currentFolderLink: Link | undefined = Object.values(
		startsWithLinks
	).find((item: Link) => item.is_folder && item.slug === slug);

	let parentAndSiblingLinks: Link[] = [];

	if (currentFolderLink && currentFolderLink.parent_id) {
		parentAndSiblingLinks = await fetchLinksFromStoryblok(token, {
			version: "published",
			token,
			with_parent: currentFolderLink.parent_id,
			per_page: "1000",
		});
		if (secondIteration) {
			Object.values(parentAndSiblingLinks).map((parentelse) => {
				const children = Object.values(siblingsLinks).filter((childLink) => {
					const isChild =
						childLink.parent_id === parentelse.id && !childLink.is_startpage;

					return isChild;
				});
				parentelse.childLinks = children;
				if (children.length > 0) {
					parentelse.childLinks = children;
				} else {
					parentelse.childLinks = [];
				}
			});
		}
	} else {
		parentAndSiblingLinks = siblingsLinks;
	}
	return parentAndSiblingLinks;
};

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

		// const siblingPages = [];

		const parentID = storyResult.story?.parent_id as unknown as string;
		const isRootPage = storyResult.story?.is_startpage;
		const token = publicRuntimeConfig.storyblok.accessToken;

		const component = storyResult.story?.content?.component;
		let parentAndSiblingLinksElse: Link[] = [];
		let parentChildLinksTreeArray: Link[] = [];
		if (component === "infoPage") {
			const { siblingsLinks, parentAndSiblingLinks } =
				await fetchParentAndSiblingLinks(token, parentID, slug);

			const siblingsLinksArray: Link[] = Object.values(siblingsLinks);
			const parentAndSiblingLinksArray: Link[] = Object.values(
				parentAndSiblingLinks
			);
			// const startsWithLinksElse = {};
			parentChildLinksTreeArray = await Promise.all(
				parentAndSiblingLinksArray.map(async (parent) => {
					const children = siblingsLinksArray.filter((childLink) => {
						const isChild =
							childLink.parent_id === parent.id && !childLink.is_startpage;

						return isChild;
					});

					if (children.length > 0) {
						parent.childLinks = children;
					} else {
						parent.childLinks = [];
						let secondIteration;
						if (parent.slug === slug) {
							const noChildSlug = isRootPage
								? slug
								: slug.split("/").slice(0, -1).join("/");
							secondIteration = true;
							parentAndSiblingLinksElse = await reUseFetchingLogic(
								token,
								noChildSlug,
								siblingsLinks,
								secondIteration
							);
						} else {
							console.log("inside else parent.slug===slug");
						}
					}
					//TODO: if there are no children, render siblingsLinks and parent-level items (i.e. same nav structure as when on parent page)

					return parent;
				})
			);
		}

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
				// siblingPages,
				component,
				parentChildLinksTreeArray,
				parentAndSiblingLinksElse: Object.values(parentAndSiblingLinksElse),
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
