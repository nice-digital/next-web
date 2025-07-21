import { StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useEffect, useMemo } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { logger } from "@/logger";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { getAdditionalMetaTags } from "@/utils/storyblok";

export const CorporateContentPage = (
	props: SlugCatchAllProps
): React.ReactElement => {
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
	useEffect(() => {
		const noIndexPaths = [
			"bnfc-via-nice-is-only-available-in-the-uk",
			"bnf-via-nice-is-only-available-in-the-uk",
			"cks-is-only-available-in-the-uk",
			"cks-end-user-licence-agreement",
		];

		const shouldNoIndex = noIndexPaths.includes(story?.full_slug);

		// Always remove existing robots tags
		document
			.querySelectorAll("meta[name='robots']")
			.forEach((tag) => tag.remove());

		// Add correct one
		const robots = document.createElement("meta");
		robots.name = "robots";
		robots.content = shouldNoIndex ? "noindex,nofollow" : "index,follow";
		document.head.appendChild(robots);
	}, [story?.full_slug]);
	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	const { story: storyData, breadcrumbs, tree, slug } = props;

	const title = storyData?.name;
	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			{storyData?.content && (
				<StoryblokComponent
					blok={storyData.content}
					breadcrumbs={breadcrumbs}
					tree={tree}
					slug={slug}
				/>
			)}
		</>
	);
};
