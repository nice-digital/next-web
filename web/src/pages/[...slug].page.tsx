import React from "react";

import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { publicRuntimeConfig } from "@/config";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next";
import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentpage";

export default function SlugCatchAll(props: SlugCatchAllProps) {
	return (
		<>
			<CorporateContentPageTemplate {...props} />
		</>
	);
}
interface RootCatchAllServerSidePropsContext
	extends GetServerSidePropsContext {}

export const getServerSideProps: GetServerSideProps<SlugCatchAllProps> = async (
	context: RootCatchAllServerSidePropsContext
): Promise<GetServerSidePropsResult<SlugCatchAllProps>> => {
	// Bail out early unless this route is enabled for this environment
	if (publicRuntimeConfig.storyblok.enableRootCatchAll.toString() !== "true") {
		return {
			notFound: true,
		};
	}

	const result = await getCorporateContentGssp("root-catch-all")(context);
	return result as GetServerSidePropsResult<SlugCatchAllProps>;
};
