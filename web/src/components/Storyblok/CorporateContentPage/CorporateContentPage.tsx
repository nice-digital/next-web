import { StoryblokComponent, useStoryblokBridge } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo, useEffect } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { logger } from "@/logger";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { getAdditionalMetaTags } from "@/utils/storyblok";

export const CorporateContentPage = (
	props: SlugCatchAllProps
): React.ReactElement => {
	const story = "story" in props ? props.story : null;

	// Enable live updates in Visual Editor; only run bridge on client
	// useEffect(() => {
	// 	if (story?.id) {
	// 		useStoryblokBridge(story.id, () => {});
	// 	}
	// }, [story?.id]);

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
					pageType={props.component}
				/>
			)}
		</>
	);
};
