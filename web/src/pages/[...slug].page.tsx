import { StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { logger } from "@/logger";

import { getAdditionalMetaTags } from "@/utils/storyblok";

import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { publicRuntimeConfig } from "@/config";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

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

	const { story: storyData, breadcrumbs, siblingPages } = props;

	const title = storyData.name;

	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<h1>Root catch all route</h1>
			<StoryblokComponent
				blok={storyData.content}
				breadcrumbs={breadcrumbs}
				siblingPages={siblingPages}
			/>
		</>
	);
}

interface RootCatchAllServerSidePropsContext extends GetServerSidePropsContext {}

export const getServerSideProps: GetServerSideProps<SlugCatchAllProps> = async (
	context: RootCatchAllServerSidePropsContext
): Promise<GetServerSidePropsResult<SlugCatchAllProps>> => {

	// Bail out early unless this route is enabled for this environment
	if (publicRuntimeConfig.storyblok.enableRootCatchAll.toString() !== "true") {
		return {
			notFound: true,
		};
	}

	const result = await getCorporateContentGssp()(context);
    return result as GetServerSidePropsResult<SlugCatchAllProps>;
};
