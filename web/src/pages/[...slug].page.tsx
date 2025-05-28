import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React from "react";

import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentPage";
import { publicRuntimeConfig } from "@/config";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";

export default function SlugCatchAll(
	props: SlugCatchAllProps
): React.ReactElement {
	return (
		<>
			<CorporateContentPageTemplate {...props} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps<SlugCatchAllProps> = async (
	context
): Promise<GetServerSidePropsResult<SlugCatchAllProps>> => {
	// Bail out early unless this route is enabled for this environment
	if (publicRuntimeConfig.storyblok.enableRootCatchAll.toString() !== "true") {
		return {
			notFound: true,
		};
	}

	return getCorporateContentGssp<SlugCatchAllProps>("root-catch-all")(context);
};
