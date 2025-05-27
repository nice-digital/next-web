import { apiPlugin, storyblokInit } from "@storyblok/react";

import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import dynamic from "next/dynamic";

// const commonComponents = {
// 		cardGrid: dynamic(() =>
// 			import(/* webpackChunkName: "common-card-grid" */ "@/components/Storyblok/BasicCardGrid/BasicCardGrid").then((mod) => mod.BasicCardGrid)
// 		),
// 		metadata: dynamic(() =>
// 			import(/* webpackChunkName: "common-metadata" */ "@/components/Storyblok/Metadata/Metadata").then((mod) => mod.Metadata)
// 		),
// 		pageHeader: dynamic(() =>
// 			import(/* webpackChunkName: "common-page-header" */ "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader").then((mod) => mod.StoryblokPageHeader)
// 		),

// 		categoryLandingPage: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-page" */ "@/components/Storyblok/CategoryLandingPage/CategoryLandingPage").then((mod) => mod.CategoryLandingPage)
// 		),
// 		hero: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-hero" */ "@/components/Storyblok/StoryblokHero/StoryblokHero").then((mod) => mod.StoryblokHero)
// 		),
// 		actionBanner: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-action-banner" */ "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBannerFullWidth").then((mod) => mod.StoryblokActionBannerFullWidth)
// 		),
// 		actionBannerDefault: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-action-banner-default" */ "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBannerDefault").then((mod) => mod.StoryblokActionBannerDefault)
// 		),
// 		cardGridSection: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-card-grid-section" */ "@/components/Storyblok/CardGridSection/CardGridSection").then((mod) => mod.CardGridSection)
// 		),
// 		cardListSection: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-card-list-section" */ "@/components/Storyblok/CardListSection/CardListSection").then((mod) => mod.CardListSection)
// 		),
// 		promoBox: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-promo-box" */ "@/components/Storyblok/PromoBox/PromoBox").then((mod) => mod.PromoBox)
// 		),
// 		calloutCard: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-callout-card" */ "@/components/Storyblok/StoryblokCalloutCard/StoryblokCalloutCard").then((mod) => mod.StoryblokCalloutCard)
// 		),
// 		calloutCardWithImage: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-callout-card-with-image" */ "@/components/Storyblok/StoryblokCalloutCard/StoryblokCalloutCard").then((mod) => mod.StoryblokCalloutCard)
// 		),
// 		testimonialFullWidth: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-testimonial-full-width" */ "@/components/Storyblok/StoryblokTestimonialFullWidth/StoryblokTestimonialFullWidth").then((mod) => mod.StoryblokTestimonialFullWidth)
// 		),
// 		testimonialGridItem: dynamic(() =>
// 			import(/* WebpackChunkName: "category-landing-testimonial-grid-item" */ "@/components/Storyblok/StoryblokTestimonialGridItem/StoryblokTestimonialGridItem").then((mod) => mod.StoryblokTestimonialGridItem)
// 		),

// 		accordion: dynamic(() =>
// 			import(/* WebpackChunkName: "accordion" */ "@/components/Storyblok/StoryblokAccordion/StoryblokAccordion").then((mod) => mod.StoryblokAccordion)
// 		),
// 		accordionGroup: dynamic(() =>
// 			import(/* WebpackChunkName: "accordion-group" */ "@/components/Storyblok/StoryblokAccordionGroup/StoryblokAccordionGroup").then((mod) => mod.StoryblokAccordionGroup)
// 		),

// 		iframe: dynamic(() =>
// 			import(/* WebpackChunkName: "iframe" */ "@/components/Storyblok/StoryblokIframe/StoryblokIframe").then((mod) => mod.StoryblokIframe)
// 		),
// 		infoPage: dynamic(() =>
// 			import(/* WebpackChunkName: "info-page" */ "@/components/Storyblok/InfoPage/InfoPage").then((mod) => mod.InfoPage)
// 		),
// 		nestedRichText: dynamic(() =>
// 			import(/* WebpackChunkName: "nested-rich-text" */ "@/components/Storyblok/NestedRichText/NestedRichText").then((mod) => mod.NestedRichText)
// 		),
// 		quote: dynamic(() =>
// 			import(/* WebpackChunkName: "blockquote" */ "@/components/Storyblok/Blockquote/Blockquote").then((mod) => mod.Blockquote)
// 		),
// 		youtubeEmbed: dynamic(() =>
// 			import(/* WebpackChunkName: "youtube-embed" */ "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed").then((mod) => mod.StoryblokYoutubeEmbed)
// 		),
// 		nestedTable: dynamic(() =>
// 			import(/* WebpackChunkName: "nested-table" */ "@/components/Storyblok/StoryblokTable/StoryblokTable").then((mod) => mod.StoryblokTable)
// 		),
// 		categoryNavigation: dynamic(() =>
// 						import(
// 							/* webpackChunkName: "category-navigation" */ "@/components/Storyblok/CategoryNavigation/CategoryNavigation"
// 						).then((mod) => mod.CategoryNavigation)
// 					),
// 	};

// 	// const components = {
// 	// 	...commonComponents,
// 	// 	...(component === "infoPage"
// 	// 		? infoPageComponents
// 	// 		: component === "categoryLandingPage"
// 	// 		? categoryLandingPageComponents
// 	// 		: {
// 	// 				categoryNavigation: dynamic(() =>
// 	// 					import(
// 	// 						/* webpackChunkName: "category-navigation" */ "@/components/Storyblok/CategoryNavigation/CategoryNavigation"
// 	// 					).then((mod) => mod.CategoryNavigation)
// 	// 				),
// 	// 		  }),
// 	// };


// Init connection to Storyblok
export const initStoryblok = (): void => {
	const accessToken = publicRuntimeConfig.storyblok.accessToken;
	const endpoint = publicRuntimeConfig.storyblok.ocelotEndpoint;
	const usingOcelotCache = !!endpoint;

	try {
		logger.info(
			`start initStoryblok with accessToken: ${accessToken} and endpoint: ${endpoint}`
		);

		logger.info(`initStoryblok usingOcelotCache: ${usingOcelotCache}`);

		storyblokInit({
			accessToken,
			use: [apiPlugin],
			apiOptions: {
				cache: {
					clear: usingOcelotCache ? "manual" : "auto",
					type: usingOcelotCache ? "none" : "memory",
				},
				endpoint,
			},
		});
	} catch (error) {
		logger.error(
			{
				ocelotEndpoint: endpoint,
				usingOcelotCache,
				error,
			},
			`Error initialising Storyblok: ${error}`
		);
		new Error("Error initialising Storyblok", { cause: error });
	}
	logger.info("end initStoryblok");
};
