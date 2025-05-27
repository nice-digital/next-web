import {
	setComponents,
	StoryblokComponent,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";


import { logger } from "@/logger";
import {
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import dynamic from "next/dynamic";



export default function CorporateContentPageTemplate(
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

	// const { story: storyData, breadcrumbs, siblingPages, component } = props;

	// const commonComponents = {
	// 	cardGrid: BasicCardGrid,
	// 	metadata: Metadata,
	// 	pageHeader: StoryblokPageHeader,
	// };

	// //TODO: add the rest of the components as we iterate through the page build
	// const categoryLandingPageComponents = {
	// 	categoryLandingPage: CategoryLandingPage,
	// 	hero: StoryblokHero,
	// 	actionBanner: StoryblokActionBannerFullWidth,
	// 	actionBannerDefault: StoryblokActionBannerDefault,
	// 	cardGridSection: CardGridSection,
	// 	cardListSection: CardListSection,
	// 	promoBox: PromoBox,
	// 	calloutCard: StoryblokCalloutCard,
	// 	calloutCardWithImage: StoryblokCalloutCard,
	// 	testimonialFullWidth: StoryblokTestimonialFullWidth,
	// 	testimonialGridItem: StoryblokTestimonialGridItem,
	// };

	// const infoPageComponents = {
	// 	accordion: StoryblokAccordion,
	// 	accordionGroup: StoryblokAccordionGroup,
	// 	hero: StoryblokHero,
	// 	iframe: StoryblokIframe,
	// 	infoPage: InfoPage,
	// 	nestedRichText: NestedRichText,
	// 	quote: Blockquote,
	// 	youtubeEmbed: StoryblokYoutubeEmbed,
	// 	actionBannerDefault: StoryblokActionBannerDefault,
	// 	nestedTable: StoryblokTable,
	// };

	// const components = {
	// 	...commonComponents,
	// 	...(component === "infoPage"
	// 		? infoPageComponents
	// 		: component === "categoryLandingPage"
	// 		? categoryLandingPageComponents
	// 		: { categoryNavigation: CategoryNavigation }),
	// };

    const { story: storyData, breadcrumbs, siblingPages, component } = props;

    const commonComponents = {
		cardGrid: dynamic(() =>
			import(/* webpackChunkName: "common-card-grid" */ "@/components/Storyblok/BasicCardGrid/BasicCardGrid").then((mod) => mod.BasicCardGrid)
		),
		metadata: dynamic(() =>
			import(/* webpackChunkName: "common-metadata" */ "@/components/Storyblok/Metadata/Metadata").then((mod) => mod.Metadata)
		),
		pageHeader: dynamic(() =>
			import(/* webpackChunkName: "common-page-header" */ "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader").then((mod) => mod.StoryblokPageHeader)
		),
	};

	//TODO: add the rest of the components as we iterate through the page build
	const categoryLandingPageComponents = {
		categoryLandingPage: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-page" */ "@/components/Storyblok/CategoryLandingPage/CategoryLandingPage").then((mod) => mod.CategoryLandingPage)
		),
		hero: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-hero" */ "@/components/Storyblok/StoryblokHero/StoryblokHero").then((mod) => mod.StoryblokHero)
		),
		actionBanner: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-action-banner" */ "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBannerFullWidth").then((mod) => mod.StoryblokActionBannerFullWidth)
		),
		actionBannerDefault: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-action-banner-default" */ "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBannerDefault").then((mod) => mod.StoryblokActionBannerDefault)
		),
		cardGridSection: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-card-grid-section" */ "@/components/Storyblok/CardGridSection/CardGridSection").then((mod) => mod.CardGridSection)
		),
		cardListSection: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-card-list-section" */ "@/components/Storyblok/CardListSection/CardListSection").then((mod) => mod.CardListSection)
		),
		promoBox: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-promo-box" */ "@/components/Storyblok/PromoBox/PromoBox").then((mod) => mod.PromoBox)
		),
		calloutCard: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-callout-card" */ "@/components/Storyblok/StoryblokCalloutCard/StoryblokCalloutCard").then((mod) => mod.StoryblokCalloutCard)
		),
		calloutCardWithImage: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-callout-card-with-image" */ "@/components/Storyblok/StoryblokCalloutCard/StoryblokCalloutCard").then((mod) => mod.StoryblokCalloutCard)
		),
		testimonialFullWidth: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-testimonial-full-width" */ "@/components/Storyblok/StoryblokTestimonialFullWidth/StoryblokTestimonialFullWidth").then((mod) => mod.StoryblokTestimonialFullWidth)
		),
		testimonialGridItem: dynamic(() =>
			import(/* WebpackChunkName: "category-landing-testimonial-grid-item" */ "@/components/Storyblok/StoryblokTestimonialGridItem/StoryblokTestimonialGridItem").then((mod) => mod.StoryblokTestimonialGridItem)
		),
	};

	const infoPageComponents = {
		accordion: dynamic(() =>
			import(/* WebpackChunkName: "accordion" */ "@/components/Storyblok/StoryblokAccordion/StoryblokAccordion").then((mod) => mod.StoryblokAccordion)
		),
		accordionGroup: dynamic(() =>
			import(/* WebpackChunkName: "accordion-group" */ "@/components/Storyblok/StoryblokAccordionGroup/StoryblokAccordionGroup").then((mod) => mod.StoryblokAccordionGroup)
		),
		hero: dynamic(() =>
			import(/* WebpackChunkName: "hero" */ "@/components/Storyblok/StoryblokHero/StoryblokHero").then((mod) => mod.StoryblokHero)
		),
		iframe: dynamic(() =>
			import(/* WebpackChunkName: "iframe" */ "@/components/Storyblok/StoryblokIframe/StoryblokIframe").then((mod) => mod.StoryblokIframe)
		),
		infoPage: dynamic(() =>
			import(/* WebpackChunkName: "info-page" */ "@/components/Storyblok/InfoPage/InfoPage").then((mod) => mod.InfoPage)
		),
		nestedRichText: dynamic(() =>
			import(/* WebpackChunkName: "nested-rich-text" */ "@/components/Storyblok/NestedRichText/NestedRichText").then((mod) => mod.NestedRichText)
		),
		quote: dynamic(() =>
			import(/* WebpackChunkName: "blockquote" */ "@/components/Storyblok/Blockquote/Blockquote").then((mod) => mod.Blockquote)
		),
		youtubeEmbed: dynamic(() =>
			import(/* WebpackChunkName: "youtube-embed" */ "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed").then((mod) => mod.StoryblokYoutubeEmbed)
		),
		actionBannerDefault: dynamic(() =>
			import(/* WebpackChunkName: "action-banner-default" */ "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBannerDefault").then((mod) => mod.StoryblokActionBannerDefault)
		),
		nestedTable: dynamic(() =>
			import(/* WebpackChunkName: "nested-table" */ "@/components/Storyblok/StoryblokTable/StoryblokTable").then((mod) => mod.StoryblokTable)
		),
	};

	const components = {
		...commonComponents,
		...(component === "infoPage"
			? infoPageComponents
			: component === "categoryLandingPage"
			? categoryLandingPageComponents
			: {
					categoryNavigation: dynamic(() =>
						import(
							/* webpackChunkName: "category-navigation" */ "@/components/Storyblok/CategoryNavigation/CategoryNavigation"
						).then((mod) => mod.CategoryNavigation)
					),
			  }),
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
			/>
		</>
	);
}
