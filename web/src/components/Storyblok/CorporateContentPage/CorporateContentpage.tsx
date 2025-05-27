import {
	StoryblokComponent,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { logger } from "@/logger";
import {
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";

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

    const { story: storyData, breadcrumbs, siblingPages } = props;

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
