import { GetServerSideProps } from "next";

import { publicRuntimeConfig } from "@/config";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";

export { default } from "@/shared/CorporateContentSharedPageTemplate";

export const getServerSideProps: GetServerSideProps<SlugCatchAllProps> = async (
	context
) => {
	// Bail out early unless this route is enabled for this environment
	if (publicRuntimeConfig.storyblok.enableRootCatchAll.toString() !== "true") {
		return { notFound: true };
	}

	return getCorporateContentGssp<SlugCatchAllProps>("root-catch-all")(context);
};
