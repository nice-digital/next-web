import {
	apiPlugin,
	SbReactComponentsMap,
	storyblokInit,
} from "@storyblok/react";

import { BasicCardGrid } from "@/components/Storyblok/BasicCardGrid/BasicCardGrid";
import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
import { CardGridSection } from "@/components/Storyblok/CardGridSection/CardGridSection";
import { CardList } from "@/components/Storyblok/CardList/CardList";
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

//TODO: consider a mix of static imports for common components and dynamic imports for lesser used components
const commonComponents = {
	accordion: StoryblokAccordion,
	accordionGroup: StoryblokAccordionGroup,
	actionBannerDefault: StoryblokActionBannerDefault,
	cardGrid: BasicCardGrid,
	cardList: CardList,
	hero: StoryblokHero,
	metadata: Metadata,
	nestedRichText: NestedRichText,
	pageHeader: StoryblokPageHeader,
	quote: Blockquote,
	youtubeEmbed: StoryblokYoutubeEmbed,
};

//TODO: add the rest of the components as we iterate through the page build
const categoryLandingPageComponents = {
	actionBanner: StoryblokActionBannerFullWidth,
	calloutCard: StoryblokCalloutCard,
	calloutCardWithImage: StoryblokCalloutCard,
	cardGridSection: CardGridSection,
	cardListSection: CardListSection,
	categoryLandingPage: CategoryLandingPage,
	promoBox: PromoBox,
	testimonialFullWidth: StoryblokTestimonialFullWidth,
	testimonialGridItem: StoryblokTestimonialGridItem,
};

const infoPageComponents = {
	iframe: StoryblokIframe,
	infoPage: InfoPage,
	nestedTable: StoryblokTable,
};

const categoryNavigationPageComponents = {
	categoryNavigation: CategoryNavigation,
};

export const allComponents: SbReactComponentsMap = {
	...commonComponents,
	...infoPageComponents,
	...categoryLandingPageComponents,
	...categoryNavigationPageComponents,
};

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
			components: allComponents,
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
