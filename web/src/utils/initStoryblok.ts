import { apiPlugin, storyblokInit } from "@storyblok/react";

import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
import { CardGrid } from "@/components/Storyblok/CardGrid/CardGrid";
import { CategoryNavigation } from "@/components/Storyblok/CategoryNavigation/CategoryNavigation";
import { Homepage } from "@/components/Storyblok/Homepage/Homepage";
import { HomepageHero } from "@/components/Storyblok/Homepage/HomepageHero/HomepageHero";
import { InfoPage } from "@/components/Storyblok/InfoPage/InfoPage";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { NestedRichText } from "@/components/Storyblok/NestedRichText/NestedRichText";
import { PromoBox } from "@/components/Storyblok/PromoBox/PromoBox";
import { Spotlight } from "@/components/Storyblok/Spotlight/Spotlight";
import { StoryblokActionBanner } from "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBanner";
import { StoryblokAuthor } from "@/components/Storyblok/StoryblokAuthor/StoryblokAuthor";
import { StoryblokBlogPost } from "@/components/Storyblok/StoryblokBlogPost/StoryblokBlogPost";
import { StoryblokHero } from "@/components/Storyblok/StoryblokHero/StoryblokHero";
import { StoryblokIframe } from "@/components/Storyblok/StoryblokIframe/StoryblokIframe";
import { StoryblokNewsArticle } from "@/components/Storyblok/StoryblokNewsArticle/StoryblokNewsArticle";
import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import { StoryblokRelatedLink } from "@/components/Storyblok/StoryblokRelatedLink/StoryblokRelatedLink";
import { StoryblokRelatedNewsLink } from "@/components/Storyblok/StoryblokRelatedNewsLink/StoryblokRelatedNewsLink";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";

// Init connection to Storyblok
export const initStoryblok = (): void => {
	const components = {
		actionBanner: StoryblokActionBanner,
		author: StoryblokAuthor,
		blogPost: StoryblokBlogPost,
		cardGrid: CardGrid,
		categoryNavigation: CategoryNavigation,
		hero: StoryblokHero,
		homepage: Homepage,
		homepageHero: HomepageHero,
		infoPage: InfoPage,
		metadata: Metadata,
		nestedRichText: NestedRichText,
		newsArticle: StoryblokNewsArticle,
		pageHeader: StoryblokPageHeader,
		promoBox: PromoBox,
		quote: Blockquote,
		relatedLink: StoryblokRelatedLink,
		relatedNewsLink: StoryblokRelatedNewsLink,
		spotlight: Spotlight,
		youtubeEmbed: StoryblokYoutubeEmbed,
		iframe: StoryblokIframe,
	};

	try {
		const accessToken = publicRuntimeConfig.storyblok.previewAccessToken;

		storyblokInit({
			accessToken,
			use: [apiPlugin],
			apiOptions: {
				cache: {
					clear: "auto",
					type: "memory",
				},
			},
			components,
		});
	} catch (e) {
		logger.error("Error initialising Storyblok:", e);
	}
};

export const getMeBanjo = (): string => {
	return "Me Banjo";
};
